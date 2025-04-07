import mongoose from "mongoose";

const AboutPetSchema = new mongoose.Schema({
    images: { type: [String], required: true },  // changed from image + better typing
    breed: { type: String, required: true },     // fixed typo from Bread
    details: { type: String, required: true },
    group: { type: String, required: true },
    category: { type: String, required: true },
    height: { type: String, required: true },
    weight: { type: String, required: true },
    lifeSpan: { type: String, required: true },  // camelCase
    characteristics: { type: String, required: true } // camelCase + plural
});

const AboutPet = mongoose.model("AboutPet", AboutPetSchema);

export default AboutPet;
