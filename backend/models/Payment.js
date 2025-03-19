const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, //Can be null if it is only for wallet
    crossingId: { type: mongoose.Schema.Types.ObjectId, ref: "Crossing" }, //Can be null if it is only for wallet
    orderId: { type: String }, // Razorpay order ID
    paymentId: { type: String }, // Razorpay payment ID
    signature: { type: String }, // Razorpay signature for verification
    amount: { type: Number, required: true }, // Amount paid in smallest currency unit (e.g., paise for INR)
    currency: { type: String, required: true, default: "INR" },
    status: { type: String, enum: ["created", "pending", "success", "failed"], default: "created" },
    paymentFor: { type: String, enum: ["product", "crossing","wallet"], default: "product" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);