import mongoose from "mongoose";
const petHealth = new mongoose.Schema({
  petId: { type: mongoose.Schema.Types.ObjectId, ref: "Mypet" },
  Date: { type: Date, required: true },
  vaccine: { type: String, required: true },
  from: { type: Date, required: true },
  end: { type: Date, required: true },
  validation: {
    type: String,
    enum: ["validated", "not validated"],
    required: true,
  },
  FE: { type: String, required: true },
  Hospital: { type: String, required: true },
  patient_id: { type: String, required: true },
});

const PetHealth = mongoose.model("PetHealth", petHealth);
export default PetHealth;
