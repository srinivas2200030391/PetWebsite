import MatingPet from "../models/matingPet.model.js";

// Get all mating pets (regardless of vendor)
export const getAllMatingPets = async (req, res) => {
  try {
    const pets = await MatingPet.find().populate("vendor");
    res.status(200).json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single mating pet by ID
export const getMatingPetById = async (req, res) => {
  try {
    const { petId } = req.params;
    const pet = await MatingPet.findById(petId).populate("vendor");
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.status(200).json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Filter mating pets by category or breed
export const filterMatingPets = async (req, res) => {
  try {
    const { category, breedName } = req.query;
    const filters = {};
    if (category) filters.category = category;
    if (breedName) filters.breedName = breedName;

    const pets = await MatingPet.find(filters).populate("vendor");
    res.status(200).json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
