import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model with '_id' field
    required: true,
    },
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AboutPet", // Assuming you have a AboutPet model with '_id' field
        required: true,
    },
  razorpayPaymentId: {
    type: String,
    default: null,
  },
  razorpayOrderId: {
    type: String,
    default: null,
  },
  razorpaySignature: {
    type: String,
    default: null,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Failed", "Refunded"],
    default: "Pending",
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    enum: ["Credit Card", "Debit Card", "UPI", "Net Banking"],
    default: "UPI", // Default can be set to your preference
  },
  serviceType: {
    type: String,
    enum: ["adoption", "mating", "other"],
    default: "adoption",
  }
});

const Payment = mongoose.model("Payment", PaymentSchema);

export default Payment;
