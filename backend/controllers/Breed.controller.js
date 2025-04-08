import Breed from "../models/breed.model.js";

// Get all breeds by type
export const getAllBreeds = async (req, res) => {
  try {
    const { type } = req.params;
    const breeds = await Breed.find({ petType: type.toLowerCase() });
    res.status(200).json(breeds);
  } catch (error) {
    console.error("Error fetching breeds:", error);
    res.status(500).json({ error: "Failed to fetch breeds" });
  }
};

// Get breed by ID
export const getBreedById = async (req, res) => {
  try {
    const { id } = req.params;
    const breed = await Breed.findById(id);
    
    if (!breed) {
      return res.status(404).json({ error: "Breed not found" });
    }
    
    res.status(200).json(breed);
  } catch (error) {
    console.error("Error fetching breed:", error);
    res.status(500).json({ error: "Failed to fetch breed details" });
  }
};

// Create new breed
export const createBreed = async (req, res) => {
  try {
    const breed = new Breed(req.body);
    await breed.save();
    res.status(201).json(breed);
  } catch (error) {
    console.error("Error creating breed:", error);
    res.status(500).json({ error: "Failed to create breed" });
  }
};