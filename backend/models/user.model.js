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
      default: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?q=80&w=2952&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // direct image link 🖼️✨
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
    wishlist: {
      type: [String],
      default: [],
    },
    payments: {
      type: [String],
      default: [],
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
