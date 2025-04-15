import razorpayInstance from "../config/razorpayConfig.js";
import crypto from "crypto";

// Create a new order
const paymentController = {
  createOrder: async (req, res) => {
    try {
      const { amount, currency = "INR", receipt, notes } = req.body;
      console.log("Creating order with amount:", amount, "currency:", currency);
      
      if (!amount) {
        return res.status(400).json({
          success: false,
          message: "Amount is required",
        });
      }

      const options = {
        amount: parseInt(amount) * 100, // amount in smallest currency unit (paise for INR)
        currency,
        receipt: receipt || `receipt_order_₹{Date.now()}`,
        notes,
      };
      
      const order = await razorpayInstance.orders.create(options);

      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({
        success: false,
        message: "Error creating order",
        error: error.message,
      });
    }
  },

  // Verify payment after completion
  verifyPayment: async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: "All payment details are required",
        });
      }

      // Creating the hmac object
      const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      // Comparing the signatures
      if (generated_signature === razorpay_signature) {
        // Payment is successful
        // You can update your database here (e.g., mark order as paid)
        res.status(200).json({
          success: true,
          message: "Payment verified successfully",
        });
      } else {
        // Payment verification failed
        res.status(400).json({
          success: false,
          message: "Payment verification failed",
        });
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({
        success: false,
        message: "Error verifying payment",
        error: error.message,
      });
    }
  },

  // Get payment details
  getPaymentDetails: async (req, res) => {
    try {
      const { paymentId } = req.params;

      if (!paymentId) {
        return res.status(400).json({
          success: false,
          message: "Payment ID is required",
        });
      }

      const payment = await razorpayInstance.payments.fetch(paymentId);

      res.status(200).json({
        success: true,
        payment,
      });
    } catch (error) {
      console.error("Error fetching payment:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching payment details",
        error: error.message,
      });
    }
  },

  // Get all payments
  getAllPayments: async (req, res) => {
    try {
      const payments = await razorpayInstance.payments.all();

      res.status(200).json({
        success: true,
        payments,
      });
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching all payments",
        error: error.message,
      });
    }
  },

  // Refund payment
  refundPayment: async (req, res) => {
    try {
      const { paymentId, amount, notes } = req.body;

      if (!paymentId) {
        return res.status(400).json({
          success: false,
          message: "Payment ID is required",
        });
      }

      const refundOptions = {
        payment_id: paymentId,
        amount: amount ? amount * 100 : undefined, // Optional: partial refund if specified
        notes, // Optional: notes for the refund
      };

      const refund = await razorpayInstance.payments.refund(refundOptions);

      res.status(200).json({
        success: true,
        refund,
      });
    } catch (error) {
      console.error("Error refunding payment:", error);
      res.status(500).json({
        success: false,
        message: "Error refunding payment",
        error: error.message,
      });
    }
  },
};

export default paymentController;