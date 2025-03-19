const { body } = require("express-validator");

const registerValidationRules = () => {
  return [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email address"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("phone").trim().notEmpty().withMessage("Phone is required").isMobilePhone().withMessage("Invalid phone number"),
  ];
};

const loginValidationRules = () => {
  return [body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email address")];
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
};