const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: {
      type: String,
      default: "Client",
      enum: ["Admin", "Vendor", "Driver", "Client"],
    },
    phone: { type: String, required: true },
    aadhar_Number: { type: String },
    address: {
      name: String,
      phone: String,
      HouseNo: String,
      Area: String,
      Landmark: String,
      Pincode: String,
      Towncity: String,
      State: String,
    },
    profile: {
      type: String,
      default: "https://example.com/default-profile.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);