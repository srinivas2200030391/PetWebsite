// pet-app-backend\routes\crossing.js
const router = require("express").Router();
const crossingController = require("../controllers/crossingController");
const { verifyToken } = require("../middleware/verifyToken");
const { createCrossingValidationRules } = require("../middleware/validations/crossingValidation");
const validate = require("../middleware/validate");
const { checkRole } = require("../middleware/accessControl");

router.post(
  "/",
  verifyToken,
  checkRole(["Vendor", "Admin"]),
  createCrossingValidationRules(),
  validate,
  crossingController.createCrossing
);

// Ensure your other routes are also defined correctly
router.get("/", crossingController.getAllCrossings);
router.get("/:id", crossingController.getCrossingById);
router.put(
  "/:id",
  verifyToken,
  checkRole(["Vendor", "Admin"]),
  crossingController.updateCrossing
);
router.delete(
  "/:id",
  verifyToken,
  checkRole(["Vendor", "Admin"]),
  crossingController.deleteCrossing
);

module.exports = router;