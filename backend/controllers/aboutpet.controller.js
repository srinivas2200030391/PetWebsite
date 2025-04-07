import AboutPet from "../models/aboutpet.model.js";

const aboutPet = {
  createAbout: async (req, res) => {
    const aboutPet = new AboutPet(req.body);
    try {
      await aboutPet.save();
      res.status(200).json("Product created successfully");
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // Fetch all pets from database
  getAllAboutPet: async (req, res) => {
    try {
      const allPets = await AboutPet.find({});
      if (!allPets || allPets.length === 0) {
        return res.status(404).json("No pets found");
      }
      res.status(200).json(allPets);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  getAllDogs: async (req, res) => {
    try {
      const dogDetails = await AboutPet.find({ category: "Dog" });
      if (!dogDetails || dogDetails.length === 0) {
        return res.status(404).json("No dogs found");
      }
      res.status(200).json(dogDetails);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
  getAllCats: async (req, res) => {
    try {
      const catDetails = await AboutPet.find({ category: "Cat" });
      if (!catDetails || catDetails.length === 0) {
        return res.status(404).json("No cats found");
      }
      res.status(200).json(catDetails);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
  getAllBirds: async (req, res) => {
    try {
      const birdDetails = await AboutPet.find({ Category: "bird" });
      if (!birdDetails || birdDetails.length === 0) {
        return res.status(404).json("No birds found");
      }
      res.status(200).json(birdDetails);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};

export default aboutPet;
