const router = require("express").Router();
const userController = require("../controllers/userController");
const { verifyToken, verifyUser, verifyAdmin } = require("../middleware/verifyToken");

// Get a user
router.get("/:id", verifyToken, verifyUser, userController.getUser);

// Update a user
router.put("/:id", verifyToken, verifyUser, userController.updateUser);

// Delete a user
router.delete("/:id", verifyToken, verifyUser, userController.deleteUser);

module.exports = router;