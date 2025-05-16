import mongoose from "mongoose";

const AboutPetSchema = new mongoose.Schema({
  images: { type: [String], required: true },
  breed: { type: String, required: true },
  name: { type: String, required: true },
  details: { type: String },
  group: { type: String },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String, required: true },
  height: { type: String },
  weight: { type: String, required: true },
  status: {
    type: String,
    enum: ["Available", "UnAvailable"],
    default: "Available",
  },
  lifeSpan: { type: String },
  characteristics: { type: String },

  // 🌟 New fields start here, darling:
  videos: { type: [String], default: [] }, // pet videos
  petQuality: { type: String }, // pet quality
  breedLineage: { type: String }, // breed lineage
  vaccinationDetails: { type: String }, // details of vaccination
  vaccinationProof: { type: String }, // proof of vaccination
  location: { type: String }, // city/location
  breederName: { type: String }, // name of the breeder/owner
  phoneNumber: {
    type: String,
    validate: {
      validator: (v) => /^[0-9]{10}$/.test(v),
      message: (props) =>
        `${props.value} is not a valid 10-digit phone number, love 💔`,
    },
    required: true,
  }, // phone number (10-digit only)
  shopAddress: { type: String }, // shop address
});

const AboutPet = mongoose.model("AboutPet", AboutPetSchema);

export default AboutPet;
