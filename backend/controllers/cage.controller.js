import express from "express";
const router = express.Router();
import Cage from "../models/cage.model.js";

// Controller functions
const cageController = {
  // Get all cages
  getAllCages: async (req, res) => {
    try {
      const cages = await Cage.find();
      res.json(cages);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get cages by status
  getCagesByStatus: async (req, res) => {
    try {
      const { status } = req.params;
      const cages = await Cage.find({ status });
      res.json(cages);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Add a new cage
  addCage: async (req, res) => {
    try {
      const cage = req.body;
      console.log(cage);
      const newCage = new Cage(cage);
      await newCage.save();
      res.status(201).json(newCage);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Update a cage
  updateCage: async (req, res) => {
    try {
      const { cageId } = req.params;
      const updatedCage = await Cage.findByIdAndUpdate(cageId, req.body, {
        new: true,
      });
      if (!updatedCage)
        return res.status(404).json({ message: "Cage not found" });
      res.json(updatedCage);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Delete a cage
  deleteCage: async (req, res) => {
    try {
      const { cageId } = req.params;
      const deletedCage = await Cage.findByIdAndDelete(cageId);
      if (!deletedCage)
        return res.status(404).json({ message: "Cage not found" });
      res.json({ message: "Cage deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

export default cageController;
