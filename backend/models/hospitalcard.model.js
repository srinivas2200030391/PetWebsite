import mongoose from "mongoose";

const hospitalCardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    imageUrl: { type: String, required: true }
  },
  { timestamps: true }
);

const HospitalCard = mongoose.model("HospitalCard", hospitalCardSchema);

export default HospitalCard;
