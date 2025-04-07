import HospitalCard from "../models/hospitalcard.model.js";

const hospitalcardController = {
  createHospital: async (req, res) => {
    const newHospital = new HospitalCard(req.body);
    try {
      await newHospital.save();
      res.status(200).json({ message: "Successfully added" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getHospitalById: async (req, res) => {
    const hospitalId = req.params.id;
    try {
      const hospital = await HospitalCard.findById(hospitalId);
      if (!hospital) {
        return res.status(404).json({ message: "Hospital not found" });
      }
      res.status(200).json(hospital);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllHospitals: async (req, res) => {
    try {
      const hospitals = await HospitalCard.find();
      if (!hospitals || hospitals.length === 0) {
        return res.status(404).json({ message: "No hospitals found" });
      }
      res.status(200).json(hospitals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getHospitalByName: async (req, res) => {
    const hospitalName = req.params.name;
    try {
      const hospital = await HospitalCard.findOne({ name: hospitalName });
      if (!hospital) {
        return res.status(404).json({ message: "Hospital not found" });
      }
      res.status(200).json(hospital);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default hospitalcardController;
