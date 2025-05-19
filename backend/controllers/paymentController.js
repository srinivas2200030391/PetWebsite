import razorpayInstance from "../config/razorpayConfig.js";
import crypto from "crypto";
import Payment from "../models/userPayment.model.js"; // Import the Payment model
import User from "../models/user.model.js"; // Import the User model
import AboutPet from "../models/aboutpet.model.js"; // Import the AboutPet model

const paymentController = {
  // Create a new order
  createOrder: async (req, res) => {
    try {
      const { amount, currency = "INR", receipt,userId, petId } = req.body;
      console.log("Request Body:", req.body);

      if (!amount) {
        return res.status(400).json({
          success: false,
          message: "Amount is required",
        });
      }

      const amountInPaise = parseInt(amount) * 100;
      if (isNaN(amountInPaise)) {
        return res.status(400).json({
          success: false,
          message: "Invalid amount format",
        });
      }

      const options = {
        amount: amountInPaise,
        currency,
        receipt: receipt || `receipt_order_${Date.now()}`,
      };

      const order = await razorpayInstance.orders.create(options);
      const paymentRecord = new Payment({
        userId, // Link payment to the user
        petId, // Link payment to the pet
        razorpayPaymentId: null, // Placeholder for the payment ID
        razorpayOrderId: order.id, // Store the Razorpay order ID
        razorpaySignature: null, // Placeholder for signature
        amount: amount, // Store amount
        status: "Pending", // Set initial status to Pending
        paymentMethod: "UPI", // Default payment method (you can update this later)
      });
      console.log("Payment Record:", paymentRecord); // Log payment record before saving

      res.status(200).json({
        success: true,
        order,
        paymentRecord,
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
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        userId,
        petId,
      } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId || !petId) {
        return res.status(400).json({
          success: false,
          message: "All payment details are required",
        });
      }

      const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generated_signature === razorpay_signature) {
        // Create payment record
        const payment = await Payment.findOneAndUpdate(
          { razorpayOrderId: razorpay_order_id }, // Find by Razorpay Order ID
          {
            razorpayPaymentId: razorpay_payment_id, // Save the Razorpay Payment ID
            razorpaySignature: razorpay_signature, // Save the signature
            status: "Completed", // Mark payment as completed
          },
          { new: true }
        );

        // Update user's payment array
        const user = await User.findById(userId);
        const pet = await AboutPet.findById(petId);

        if (!user || !pet) {
          return res
            .status(404)
            .json({ success: false, message: "User or Pet not found" });
        }

        if (!user.payments.includes(petId)) {
          user.payments.push(petId);
        }

        await user.save();

        res.status(200).json({
          success: true,
          message: "Payment verified and recorded successfully",
          payment: payment,
        });
      } else {
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

  // Get payment details by payment ID
  getPaymentDetails: async (req, res) => {
    try {
      const { paymentId } = req.params;

      if (!paymentId) {
        return res.status(400).json({
          success: false,
          message: "Payment ID is required",
        });
      }

      const payment = await Payment.findById(paymentId);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

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

  // Get all payments (for admin, if needed)
  getAllPayments: async (req, res) => {
    try {
      const payments = await Payment.find();

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

      const payment = await Payment.findById(paymentId);

      if (!payment || payment.status !== "Completed") {
        return res.status(400).json({
          success: false,
          message: "Payment not found or already refunded",
        });
      }

      // Refund options
      const refundOptions = {
        payment_id: payment.razorpayPaymentId,
        amount: amount ? amount * 100 : undefined, // Partial refund if specified
        notes, // Optional: notes for the refund
      };

      const refund = await razorpayInstance.payments.refund(refundOptions);

      // Update payment status to "Refunded"
      await Payment.findByIdAndUpdate(paymentId, { status: "Refunded" });

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

  // get status based on user id and pet id
  getPayments: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId).populate("payments");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user.payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default paymentController;
