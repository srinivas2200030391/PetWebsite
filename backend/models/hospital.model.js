import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  hospital: { type: String, required: true },
  doctorName: { type: String, required: true },
  address: { type: String, required: true },
  price: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  hospitalImage: { type: String, required: true },
  workingTime: { type: String, required: true },
}, { timestamps: true });

const Hospital = mongoose.model("Hospital", hospitalSchema);

export default Hospital;
