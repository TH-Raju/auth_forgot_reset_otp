const express = require("express");
const router = express.Router();

router.use(express.json());

const path = require("path");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../public/images");
    // Create the directory if it doesn't exist
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});
const filefilter = (req, file, cb) => {
  if (
    file.mimetype === "image/" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: filefilter,
});
const userController = require("../controllers/userController");
const { registerValidator } = require("../helpers/validation");

router.post(
  "/register",
  upload.single("image"),
  registerValidator,
  userController.userRegister
);

module.exports = router;
