import mongoose from "mongoose"

const BrodingSchema = new mongoose.Schema({
    Shopname: { type: String, required: true },
    Owner_name: { type: String, required: true },
    Working_timeings: { type: String, required: true },
    Address: { type: String, required: true },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    phonenumber: { type: Number, required: true },
    Category: { type: Array, required: true },
    Breed: { type: Array, required: true },
    imageurl: { type: String, required: true },
    Rate: { type: Array, required: true },
    currentbookings: { type: Array, required: true },
    Shoplocation: { type: Array, required: true },
    description: { type: String, required: false }
}, { timestamps: true });

const Boarding = mongoose.model("Boarding",BrodingSchema);
export default Boarding
