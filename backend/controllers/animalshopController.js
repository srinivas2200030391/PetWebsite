const Animalsshop = require("../models/Animalsshop");

module.exports = {
  createAnimalshop: async (req, res) => {
    try {
      const newAnimalshop = new Animalsshop(req.body);
      const savedAnimalshop = await newAnimalshop.save();
      res.status(201).json(savedAnimalshop);
    } catch (err) {
      console.error("Error creating animal shop:", err);
      res.status(500).json({ message: "Failed to create animal shop", error: err.message });
    }
  },

  getAnimalshopById: async (req, res) => {
    try {
      const animalshop = await Animalsshop.findById(req.params.id).populate("owner"); // Populate owner details
      if (!animalshop) {
        return res.status(404).json({ message: "Animal shop not found" });
      }
      res.status(200).json(animalshop);
    } catch (err) {
      console.error("Error getting animal shop by ID:", err);
      res.status(500).json({ message: "Failed to get animal shop", error: err.message });
    }
  },

  getAllAnimalshops: async (req, res) => {
    try {
      const animalshops = await Animalsshop.find().populate("owner"); // Populate owner details
      res.status(200).json(animalshops);
    } catch (err) {
      console.error("Error getting all animal shops:", err);
      res.status(500).json({ message: "Failed to get animal shops", error: err.message });
    }
  },

  updateAnimalshop: async (req, res) => {
    try {
      const updatedAnimalshop = await Animalsshop.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      ).populate("owner"); // Populate owner details

      if (!updatedAnimalshop) {
        return res.status(404).json({ message: "Animal shop not found" });
      }

      res.status(200).json(updatedAnimalshop);
    } catch (err) {
      console.error("Error updating animal shop:", err);
      res.status(500).json({ message: "Failed to update animal shop", error: err.message });
    }
  },

  deleteAnimalshop: async (req, res) => {
    try {
      const animalshopId = req.params.id;
      const deletedAnimalshop = await Animalsshop.findByIdAndDelete(animalshopId);
      if (!deletedAnimalshop) {
        return res.status(404).json({ message: "Animal shop not found" });
      }
      res.status(200).json({ message: "Animal shop deleted successfully" });
    } catch (err) {
      console.error("Error deleting animal shop:", err);
      res.status(500).json({ message: "Failed to delete animal shop", error: err.message });
    }
  },
};