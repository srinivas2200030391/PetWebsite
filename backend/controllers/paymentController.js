const Razorpay = require("razorpay");
const dotenv = require("dotenv");
const Payment = require("../models/Payment");
const Crypto = require("crypto");

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Get this from Razorpay dashboard
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Get this from Razorpay dashboard
});

module.exports = {
  createOrder: async (req, res) => {
    try {
      const { amount, currency = "INR", paymentFor, productId = null, crossingId = null, userId } = req.body; // Ensure amount is passed
      const options = {
        amount: amount * 100,  // Amount in smallest currency unit
        currency,
        receipt: `receipt_${Date.now()}`,  //Unique receipt ID,
      };
       const newPayment = new Payment({
                userId: userId,
                productId: productId,
                crossingId: crossingId,
                amount: amount,
                currency: currency,
                paymentFor: paymentFor
            });
       const savedPayment = await newPayment.save();

      razorpay.orders.create(options, async (err, order) => {
        if (err) {
          console.error("Razorpay order creation error:", err);
          return res.status(500).json({ message: "Failed to create order", error: err.message });
        }
          savedPayment.orderId=order.id;
          await savedPayment.save();
        res.status(200).json(order);
      });
    } catch (err) {
      console.error("Error creating Razorpay order:", err);
      res.status(500).json({ message: "Failed to create order", error: err.message });
    }
  },

  verifyPayment: async (req, res) => {
    try {
      const { orderId, paymentId, signature } = req.body;

      const generatedSignature = Crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(orderId + "|" + paymentId)
        .digest("hex");

      if (generatedSignature === signature) {
        // Payment is successful
        await Payment.findOneAndUpdate(
          { orderId: orderId },
          {
            paymentId: paymentId,
            signature: signature,
            status: "success",
          },
          { new: true }
        );

        res.status(200).json({ message: "Payment verified successfully" });
      } else {
        // Payment is not valid
        await Payment.findOneAndUpdate(
          { orderId: orderId },
          {
            paymentId: paymentId,
            signature: signature,
            status: "failed",
          },
          { new: true }
        );
        res.status(400).json({ message: "Invalid signature" });
      }
    } catch (err) {
      console.error("Error verifying payment:", err);
      res.status(500).json({ message: "Payment verification failed", error: err.message });
    }
  },
};