const { check } = require("express-validator");

exports.registerValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .normalizeEmail({
      gmail_remove_dots: true,
    }),
  check("mobile")
    .not()
    .isEmpty()
    .withMessage("Mobile number is required")
    .isLength({ min: 10, max: 10 }),
  check("password")
    .not()
    .isEmpty()
    .withMessage(
      "Password is required, One Uppercase and lowercase letter, number & special characters must be 6 characters long"
    )
    .isStrongPassword({
      min: 6,
      max: 20,
      minUpperCase: 1,
      minLowerCase: 1,
      minNumbers: 1,
      minSpecialChars: 1,
    }),
  check("image").custom((value, { req }) => {
    if (
      req.file &&
      (req.file.mimetype === "image/jpeg" ||
        req.file.mimetype === "image/png" ||
        req.file.mimetype === "image/jpg")
    ) {
      return true;
    } else {
      throw new Error("Image is required. Upload jpg or png files");
    }
  }),
];
