// pet-app-backend\models\Product.js
const mongoose = require("mongoose");
const ffmpeg = require("fluent-ffmpeg");

// Function to check video duration
const checkVideoDuration = async (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }
      const duration = metadata.format.duration;
      resolve(duration <= 10);
    });
  });
};

const ProductSchema = new mongoose.Schema(
  {
    petsshop: { type: mongoose.Schema.Types.ObjectId, ref: "Animalsshop", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageurl: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length > 0 && v.length <= 4;
        },
        message: "You can upload between 1 and 4 images.",
      },
      required: true,
    },
    Breed_name: { type: String, required: true },
    quality: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    petParentsMatingVideo: {  // Video Validation Removed
      type: String
    },
    Breed_lineage: { type: String, required: true },
    Address: { type: String, required: true },
    Gender: { type: String, required: true, enum: ["Male", "Female"] },
    status: {
      type: String,
      default: "available",
      enum: ["available", "unavailable"],
    },
    location: { type: String, required: true },
    age: { type: Number, required: true },
    vaccination: { type: String, required: true },
    Breeder_Name: { type: String, required: true },
    Contact_Number: {
      type: String,  // Data type changed to String
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: "Contact number must be a 10-digit number.",
      },
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);