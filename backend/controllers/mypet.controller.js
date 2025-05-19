import Pet from '../models/mypet.model.js';
import cloudinary from '../lib/cloudinary.js';

const myPetController = {
  // Create new pet profile
  createPet: async (req, res) => {
    try {
      console.log('Received data:', req.body);
      const { userId, ...petData } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "UserId is required"
        });
      }

      // Handle image upload to cloudinary if there's an image
      if (petData.profilePic && petData.profilePic.startsWith('data:')) {
        const uploadResponse = await cloudinary.uploader.upload(petData.profilePic, {
          folder: 'pet_profiles'
        });
        petData.profilePic = uploadResponse.secure_url;
      }

      // Create new pet document
      const newPet = new Pet({
        ...petData,
        userId
      });

      const savedPet = await newPet.save();
      console.log('Saved pet:', savedPet);

      res.status(201).json({
        success: true,
        message: "Pet profile created successfully",
        data: savedPet
      });
    } catch (error) {
      console.error('Error creating pet:', error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create pet profile"
      });
    }
  },

  // Get all pets for a user
  getUserPets: async (req, res) => {
    try {
      const { userId } = req.params;
      console.log('Fetching pets for userId:', userId);

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "UserId is required"
        });
      }

      const pets = await Pet.find({ userId });
      console.log('Found pets:', pets);

      res.status(200).json({
        success: true,
        data: pets
      });
    } catch (error) {
      console.error('Error fetching pets:', error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to fetch pets"
      });
    }
  },

  // Get single pet details
  getPetById: async (req, res) => {
    try {
      const { petId } = req.params;
      console.log('Fetching pet with ID:', petId);

      const pet = await Pet.findById(petId);

      if (!pet) {
        return res.status(404).json({
          success: false,
          message: "Pet not found"
        });
      }

      res.status(200).json({
        success: true,
        data: pet
      });
    } catch (error) {
      console.error('Error fetching pet:', error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to fetch pet details"
      });
    }
  },

  // Update pet profile
  updatePet: async (req, res) => {
    try {
      const { petId } = req.params;
      const updates = req.body;
      console.log('Updating pet:', petId, 'with data:', updates);

      // Handle image update if new image is provided
      if (updates.profilePic && updates.profilePic.startsWith('data:')) {
        const uploadResponse = await cloudinary.uploader.upload(updates.profilePic, {
          folder: 'pet_profiles'
        });
        updates.profilePic = uploadResponse.secure_url;
      }

      const updatedPet = await Pet.findByIdAndUpdate(
        petId,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!updatedPet) {
        return res.status(404).json({
          success: false,
          message: "Pet not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "Pet profile updated successfully",
        data: updatedPet
      });
    } catch (error) {
      console.error('Error updating pet:', error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update pet profile"
      });
    }
  },

  // Delete pet profile
  deletePet: async (req, res) => {
    try {
      const { petId } = req.params;
      console.log('Deleting pet:', petId);

      const deletedPet = await Pet.findByIdAndDelete(petId);

      if (!deletedPet) {
        return res.status(404).json({
          success: false,
          message: "Pet not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "Pet profile deleted successfully",
        data: deletedPet
      });
    } catch (error) {
      console.error('Error deleting pet:', error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to delete pet profile"
      });
    }
  }
};

export default myPetController;
