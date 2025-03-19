const { body } = require("express-validator");

const createProductValidationRules = () => {
  return [
    body("petsshop").trim().notEmpty().withMessage("Pet Shop ID is required"),
    body("userId").trim().notEmpty().withMessage("User ID is required"),
    body("imageurl").isArray().notEmpty().withMessage("Image URLs are required"),
    body("Breed_name").trim().notEmpty().withMessage("Breed name is required"),
    body("quality").trim().notEmpty().withMessage("Quality is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("Breed_lineage").trim().notEmpty().withMessage("Breed lineage is required"),
    body("Address").trim().notEmpty().withMessage("Address is required"),
    body("Gender").isIn(["Male", "Female"]).withMessage("Gender must be Male or Female"),
    body("location").trim().notEmpty().withMessage("Location is required"),
    body("age").isNumeric().withMessage("Age must be a number"),
    body("vaccination").trim().notEmpty().withMessage("Vaccination is required"),
    body("Breeder_Name").trim().notEmpty().withMessage("Breeder Name is required"),
    body("Contact_Number").trim().notEmpty().withMessage("Contact Number is required").isMobilePhone().withMessage("Invalid contact number"),
  ];
};

module.exports = {
  createProductValidationRules,
};