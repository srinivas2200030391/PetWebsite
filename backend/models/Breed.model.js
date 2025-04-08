import mongoose from "mongoose";

const breedSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  petType: {
    type: String,
    enum: ['dog', 'cat', 'bird', 'fish'],
    required: true
  },
  characteristics: [{
    type: String
  }],
  height: String,
  weight: String,
  lifeSpan: String,
}, { timestamps: true });

const Breed = mongoose.model('Breed', breedSchema);
export default Breed;