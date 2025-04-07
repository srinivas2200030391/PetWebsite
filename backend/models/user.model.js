import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    address: {
      name: String,
      phone: String,
      houseNo: String,
      area: String,
      landmark: String,
      pincode: String,
      townCity: String,
      state: String,
    },
    profilepic: {
      type: String,
      default: "https://images.unsplash.com/photo-1603415526960-f7e0328f1d76", // direct image link 🖼️✨
    },
    userType: {
      type: String,
      default: "Client",
      enum: ["Admin", "Vendor", "Driver", "Client"],
    },
    phone: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
