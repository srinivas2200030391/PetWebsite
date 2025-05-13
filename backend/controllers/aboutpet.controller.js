import AboutPet from "../models/aboutpet.model.js";



export const getAllAboutPets = async (req, res) => {
  try {
    const pets = await AboutPet.find();
    res.status(200).json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single about pet by ID
export const getAboutPetById = async (req, res) => {
  try {
    const { petId } = req.params;
    console.log("Pet ID parameter:", petId); // Log the petId parameter
    
    const pet = await AboutPet.findById(petId);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.status(200).json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Filter about pets by category or breed
export const filterAboutPets = async (req, res) => {
  try {
    const { category, breed } = req.query;
    const filters = {};
    if (category) filters.category = category;
    if (breed) filters.breed = breed;

    const pets = await AboutPet.find(filters);
    res.status(200).json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const aboutPet = {
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
  getBreeds: async (req, res) => {
    try {
      // get pet breeds
      const { item } = req.params;
      console.log("Item parameter:", item); // Log the item parameter
      const allBreeds = await AboutPet.find({ category: item }).select("breed");

      if (!allBreeds || allBreeds.length === 0) {
        return res.status(404).json("No breeds found, love 🐾");
      }
      // Extract, filter, and deduplicate the Breed values
      const uniqueBreeds = [
        ...new Set(
          allBreeds
            .map((item) => item.breed)
            .filter((breed) => breed && breed.trim() !== "")
        ),
      ];

      res.status(200).json(uniqueBreeds);
    } catch (error) {
      res.status(500).json(`Server error, darling 💔: ${error.message}`);
    }
  },

  getPetByBreed: async (req, res) => {
    const { breed } = req.params;
    console.log("Breed parameter:", breed); // Log the breed parameter
    try {
      const pets = await AboutPet.find({ breed: breed });
      if (!pets || pets.length === 0) {
        return res.status(404).json("No pets found for this breed");
      }
      res.status(200).json(pets);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
  getAboutPetById : async (req, res) => {
    try {
      const { petId } = req.params;
      console.log("Pet ID parameter:", petId); // Log the petId parameter
      
      const pet = await AboutPet.findById(petId);
      if (!pet) return res.status(404).json({ message: "Pet not found" });
      res.status(200).json(pet);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

