const mongoose = require("mongoose");

const AnimalShopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    time: { type: String, required: true },
    imageUrl: { type: String, required: true },
    animals: { type: [String] },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isAvailable: { type: Boolean, default: true },
    pickup: { type: Boolean, default: true },
    delivery: { type: Boolean, default: true },
    code: { type: String, required: true },
    logoUrl: {
      type: String,
      default: "https://example.com/default-logo.jpg",
    },
    rating: { type: Number, min: 1, max: 5 },
    ratingcount: { type: Number, default: 0 },
    coords: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String, required: true },
      title: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Animalsshop", AnimalShopSchema);