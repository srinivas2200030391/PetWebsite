import PetHealth from "../models/petHealth.js";

const petHealthController = {
  // Get all PetHealth records
  getAll: async (req, res) => {
    try {
      const petId = req.params.petId;
      const petHealthRecords = await PetHealth.find().populate(petId);
      res.status(200).json(petHealthRecords);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get PetHealth record by ID
  getById: async (req, res) => {
    try {
      const petHealthRecord = await PetHealth.findById(req.params.id).populate(
        "petId"
      );
      if (!petHealthRecord) {
        return res.status(404).json({ message: "PetHealth record not found" });
      }
      res.status(200).json(petHealthRecord);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new PetHealth record
  create: async (req, res) => {
    const petHealthRecord = new PetHealth({
      petId: req.body.petId,
      Date: req.body.Date,
      vaccine: req.body.vaccine,
      from: req.body.from,
      end: req.body.end,
      validation: req.body.validation,
      FE: req.body.FE,
      Hospital: req.body.Hospital,
      patient_id: req.body.patient_id,
    });

    try {
      const newPetHealthRecord = await petHealthRecord.save();
      res.status(201).json(newPetHealthRecord);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

export default petHealthController;
