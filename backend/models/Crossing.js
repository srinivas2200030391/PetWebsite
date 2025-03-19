const mongoose = require("mongoose");

const CrossingSchema = new mongoose.Schema(
  {
    Category: { type: String, required: true },
    Breed_name: { type: String, required: true },
    Gender: { type: String, required: true, enum: ["Male", "Female"] },
    Quality: { type: String, required: true },
    imageurl: { type: String, required: true },
    mating_video: {type: String},
    Breeder_Name: { type: String, required: true },
    aadhar_Number: { type: Number, required: true },
    Address: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["available", "unavailable"],
    },
    Contact_Number: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: "Contact number must be a 10-digit number.",
      },
      required: true,
    },
    vaccination: { type: String, required: true },
    location: { type: String, required: true },
    age: { type: Number, required: true },
    Breed_lineage: { type: String, required: true },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Crossing", CrossingSchema);