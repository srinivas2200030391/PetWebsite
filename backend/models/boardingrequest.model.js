import mongoose from "mongoose";

const BoardingRequestSchema = new mongoose.Schema({
  // keep cageId reference to Cage model
  cageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cage",
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  petName: String,
  petType: String,
  startDate: Date,
  endDate: Date,
  totalAmount: Number,
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

const BoardingRequest = mongoose.model(
  "BoardingRequest",
  BoardingRequestSchema
);
export default BoardingRequest;
