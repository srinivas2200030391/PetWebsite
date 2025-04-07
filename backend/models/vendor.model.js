import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    address: {
      shopNo: String,
      area: String,
      landmark: String,
      city: String,
      state: String,
      pincode: String,
    },
    shopImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1618943471652-6b7df52c67f7", // classy lil storefront pic darling 😘
    },
    approved: {
      type: Boolean,
      default: true, // admin approval needed, because darling, standards 🧐💅
    },
  },
  { timestamps: true }
);

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
