const router = require("express").Router();
const paymentController = require("../controllers/paymentController");
const { verifyToken } = require("../middleware/verifyToken");

router.post("/createOrder", verifyToken, paymentController.createOrder);
router.post("/verifyPayment", verifyToken, paymentController.verifyPayment);

module.exports = router;