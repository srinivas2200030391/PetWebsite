const Crossing = require("../models/Crossing");
const Payment = require("../models/Payment");

module.exports = {
  // Create a new crossing
  createCrossing: async (req, res) => {
    try {
      const newCrossing = new Crossing(req.body);
      const savedCrossing = await newCrossing.save();
      res.status(201).json(savedCrossing);
    } catch (err) {
      console.error("Error creating crossing:", err);
      res
        .status(500)
        .json({ message: "Failed to create crossing", error: err.message });
    }
  },

  // Get all crossings
  getAllCrossings: async (req, res) => {
    try {
      const crossings = await Crossing.find();
      res.status(200).json(crossings);
    } catch (err) {
      console.error("Error getting all crossings:", err);
      res
        .status(500)
        .json({ message: "Failed to get crossings", error: err.message });
    }
  },

  // Get a single crossing by ID
  getCrossingById: async (req, res) => {
    try {
      const crossing = await Crossing.findById(req.params.id);
      if (!crossing) {
        return res.status(404).json({ message: "Crossing not found" });
      }
      res.status(200).json(crossing);
    } catch (err) {
      console.error("Error getting crossing by ID:", err);
      res
        .status(500)
        .json({ message: "Failed to get crossing", error: err.message });
    }
  },

  // Update a crossing
  updateCrossing: async (req, res) => {
    try {
      const updatedCrossing = await Crossing.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      if (!updatedCrossing) {
        return res.status(404).json({ message: "Crossing not found" });
      }
      res.status(200).json(updatedCrossing);
    } catch (err) {
      console.error("Error updating crossing:", err);
      res.status(500).json({ message: "Failed to update crossing", error: err.message });
    }
  },

  // Delete a crossing
  deleteCrossing: async (req, res) => {
    try {
      await Crossing.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Crossing has been deleted" });
    } catch (err) {
      console.error("Error deleting crossing:", err);
      res.status(500).json({ message: "Failed to delete crossing", error: err.message });
    }
  },

  // Get crossing details with payment verification
  getCrossingDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const crossing = await Crossing.findById(id);
      if (!crossing) {
        return res.status(404).json({ message: "Crossing not found" });
      }

      // Check if payment exists for this crossing and user
      const payment = await Payment.findOne({
        userId: userId,
        crossingId: id,
        status: "success",
      });

      let crossingDetails;

      if (payment) {
        // If payment exists, return all details
        crossingDetails = { ...crossing._doc };
      } else {
        // If no payment, return limited details
        crossingDetails = {
          Category: crossing.Category,
          Breed_name: crossing.Breed_name,
          Gender: crossing.Gender,
          imageurl: crossing.imageurl,
          Quality: crossing.Quality,
          age: crossing.age,
          Breed_lineage: crossing.Breed_lineage,
          vaccination: crossing.vaccination,
          location: crossing.location,
          status: crossing.status,
        };
      }

      res.status(200).json(crossingDetails);
    } catch (err) {
      console.error("Error getting crossing details:", err);
      res
        .status(500)
        .json({ message: "Failed to get crossing details", error: err.message });
    }
  },
};