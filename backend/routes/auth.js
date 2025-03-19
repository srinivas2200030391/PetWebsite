const router = require("express").Router();
const authController = require("../controllers/authController");
const { registerValidationRules, loginValidationRules } = require("../middleware/validations/authValidation");
const validate = require("../middleware/validate");

router.post("/register", registerValidationRules(), validate, authController.register);
router.post("/login", loginValidationRules(), validate, authController.login);

module.exports = router;