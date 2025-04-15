import express from "express";
import paymentController from "../controllers/paymentController.js";
const router = express.Router();

// Create a new order
router.post("/create-order", paymentController.createOrder);

// Verify payment
router.post("/verify-payment", paymentController.verifyPayment);

// Get payment details
router.get("/payment-details/:paymentId", paymentController.getPaymentDetails);

// Get all payments
router.get("/all-payments", paymentController.getAllPayments);

// Refund payment
router.post("/refund", paymentController.refundPayment);

export default router;