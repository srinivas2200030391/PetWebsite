import mongoose from "mongoose";

const CageSchema = new mongoose.Schema({
  cageNumber: {
    type: String,
    required: true,
    unique: true,
  },
  imageUrl: String,
  dimensions: String,
  dailyRate: Number,
  status: {
    type: String,
    enum: ["Available", "Occupied", "Maintenance", "Pending"],
    default: "Available",
  },
  availableFrom: Date,
  availableTo: Date,
});

const Cage = mongoose.model("Cage", CageSchema);
export default Cage;
