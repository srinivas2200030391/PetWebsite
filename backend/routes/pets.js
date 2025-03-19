const router = require("express").Router();
const { verifyToken, verifyVendor, verifyAdmin } = require("../middleware/verifyToken");
const petController = require("../controllers/petController")

router.post("/", verifyToken, petController.createPet)

module.exports = router;