const router = require("express").Router();
const productController = require("../controllers/productController");
const { verifyToken } = require("../middleware/verifyToken"); // Assuming verifyToken.js exists
const { checkRole } = require("../middleware/accessControl"); // Import access control
const { createProductValidationRules } = require("../middleware/validations/productValidation");
const validate = require("../middleware/validate");

router.post(
  "/",
  verifyToken,
  checkRole(["Vendor", "Admin"]),
  createProductValidationRules(),
  validate,
  productController.createProduct
);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put(
  "/:id",
  verifyToken,
  checkRole(["Vendor", "Admin"]),
  productController.updateProduct
);
router.delete(
  "/:id",
  verifyToken,
  checkRole(["Vendor", "Admin"]),
  productController.deleteProduct
);

module.exports = router;