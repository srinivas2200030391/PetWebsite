const router = require("express").Router();
const animalshopController = require("../controllers/animalshopController");
const { verifyToken, verifyVendor, verifyAdmin } = require("../middleware/verifyToken");

// Create
router.post("/", verifyToken, verifyAdmin, animalshopController.createAnimalshop);

// Get all
router.get("/", animalshopController.getAllAnimalshops);

// Get by ID
router.get("/:id", animalshopController.getAnimalshopById);

// Update
router.put("/:id", verifyToken, verifyVendor, animalshopController.updateAnimalshop);

// Delete
router.delete("/:id", verifyToken, verifyAdmin, animalshopController.deleteAnimalshop);

module.exports = router;