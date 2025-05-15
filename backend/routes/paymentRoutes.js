import express from "express";
import paymentController from "../controllers/paymentController.js";

const router = express.Router();

// Create a new order (Payment initiation)
router.post("/create", paymentController.createOrder);

// Verify payment after completion
router.post("/verify", paymentController.verifyPayment);

// Get all payments (Admin route)
router.get("/", paymentController.getAllPayments);

// Refund a payment
router.post("/refund", paymentController.refundPayment);

router.get("/getallpayments/:userId", paymentController.getPayments);

// Get payment details by payment ID
router.get("/:paymentId", paymentController.getPaymentDetails);

export default router;
