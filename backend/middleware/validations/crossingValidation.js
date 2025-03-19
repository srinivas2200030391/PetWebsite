const { body } = require("express-validator");

const createCrossingValidationRules = () => {
  return [
    body("Category").trim().notEmpty().withMessage("Category is required"),
    body("Breed_name").trim().notEmpty().withMessage("Breed name is required"),
    body("Gender").isIn(["Male", "Female"]).withMessage("Gender must be Male or Female"),
    body("Quality").trim().notEmpty().withMessage("Quality is required"),
    body("imageurl").trim().notEmpty().withMessage("Image URL is required"),
    // Removed mating_video validation rule.
    body("Breeder_Name").trim().notEmpty().withMessage("Breeder name is required"),
    body("aadhar_Number").isNumeric().withMessage("Aadhar number must be numeric"),
    body("Address").trim().notEmpty().withMessage("Address is required"),
    body("status").isIn(["available", "unavailable"]).withMessage("Status must be available or unavailable"),
    body("Contact_Number").trim().notEmpty().withMessage("Contact Number is required").isMobilePhone().withMessage("Invalid contact number"),
    body("vaccination").trim().notEmpty().withMessage("Vaccination is required"),
    body("location").trim().notEmpty().withMessage("Location is required"),
    body("age").isNumeric().withMessage("Age must be numeric"),
    body("Breed_lineage").trim().notEmpty().withMessage("Breed lineage is required"),
    body("userid").trim().notEmpty().withMessage("User ID is required"),
  ];
};

module.exports = {
  createCrossingValidationRules,
};