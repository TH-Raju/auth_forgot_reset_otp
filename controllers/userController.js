const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const mailer = require("../helpers/mailer");
const sendMail = require("../helpers/mailer");
const userRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({
        success: false,
        msg: "Errors",
        message: errors.array(),
      });
    }

    const { name, email, mobile, password } = req.body;

    const isExist = await User.findOne({
      email: email,
    });

    if (isExist) {
      return res.status(404).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      mobile,
      password: hashPassword,
      image: "images/" + req.file.filename,
    });

    const userData = await newUser.save();
    // console.log(userData._id.toString());
    const userId = userData._id.toString();
    // console.log(userData);
    const msg =
      "<p>Hello " +
      name +
      ", Please <a href=http://localhost:8000/mail-verification?id=" +
      userId +
      ">Verify</a> your email</p>";

    sendMail(email, "Mail Verification", msg);

    return res.status(200).json({
      success: true,
      message: "Registration successful",
      user: userData,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const mailVerification = async (req, res) => {
  try {
    if (req.query.id === undefined) {
      return res.send("404");
    }

    const userData = await User.findOne({ _id: req.query.id });
    if (!userData) {
      return res.send("User not found");
    }

    if (userData.is_verified === 1) {
      return res.send("Your email is already verified");
    }

    await User.findByIdAndUpdate(
      { _id: req.query.id },
      { $set: { is_verified: 1 } }
    );

    return res.send("Email verification successful");
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("error!!!");
  }
};

module.exports = {
  userRegister,
  mailVerification,
};
