import mongoose from "mongoose";

const Productschema = new mongoose.Schema(
  {
    petsshop: { type: mongoose.Schema.Types.ObjectId, ref: "Animalsshop" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    imageurl: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length > 0 && v.length <= 4;
        },
        message: props => `You can upload between 1 and 4 images, but you provided ${props.value.length}!`
      },
      required: true,
    },
    Breeder_Name: { type: String, required: true },
    Contact_Number: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid 10-digit number!`,
      },
      required: true,
    },
    Breed_name: { type: String, required: true },
    quality: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    petParentsMatingVideo: { type: String, required: false }, // Removed validation
    Breed_lineage: { type: String, required: true },
    Address: { type: String, required: true },
    Gender: { type: String, required: true },
    status: { type: String, required: true, default: "available" },
    location: { type: String, required: true },
    age: { type: Number, required: true },
    authHeader: { type: String, required: true },
    vaccination: { type: String, required: true },
  },
  { timestamps: true }
);



const Product = mongoose.model("Product",Productschema);
export default Product
