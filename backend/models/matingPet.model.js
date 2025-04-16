import mongoose from "mongoose";

const matingPetSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  category: String,
  breedName: String,
  gender: String,
  photosAndVideos: [String],
  beforeMatingVideos: [String],
  petQuality: String,
  age: Number,
  breedLineage: String,
  vaccinationDetails: String,
  vaccinationProof: [String],
  availability: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available',
  },
  price: Number,
  location: String,
  breederName: String,
  phoneNum: String,
  shopAddress: String,
  beforePayment: {
    category: String,
    breedName: String,
    gender: String,
    photosAndVideos: [String],
    beforeMatingVideos: [String],
    petQuality: String,
    age: Number,
    breedLineage: String,
    vaccinationDetails: String,
    vaccinationProof: [String],
    availability: String,
    price: Number,
    location: String,
  },
  afterPayment: {
    breederName: String,
    phoneNum: String,
    location: String,
    shopAddress: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const MatingPet = mongoose.model("MatingPet", matingPetSchema);
export default MatingPet;
