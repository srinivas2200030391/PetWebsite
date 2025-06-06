import AboutPet from "../models/aboutpet.model.js";
import User from "../models/user.model.js";
import { updateprofile } from "./auth.controller.js";
import MatingPet from "../models/matingPet.model.js";


const userController = {
  async getAllUsers(req, res) {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  CreateUser: async (req, res) => {
    try {
      const ourUser = req.body;
      ourUser.address = [];
      ourUser.userType = "Client";
      ourUser.phone = "9999999999";
      const newUser = await User.create(ourUser);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateWishList: async (req, res) => {
    // wish list is id and update in an array of wishlist
    try {
      const { userId, wishListId } = req.body;
      console.log("userId and wishListId:", userId, wishListId); // Debugging line
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // First try to find in AboutPet model
      let wish = await AboutPet.findById(wishListId);
      
      // If not found in AboutPet, check MatingPet model
      if (!wish) {
        wish = await MatingPet.findById(wishListId);
      }
      
      // If still not found in either model
      if (!wish) {
        return res.status(404).json({ message: "Item not found in wishlist", petId: wishListId });
      }
      
      // check if the wishlist is already present in the user
      const isPresent = user.wishlist.includes(wishListId);
      if (isPresent) {
        // remove the wishlist from the user
        user.wishlist = user.wishlist.filter(
          (item) => item !== wishListId
        );
      } else {
        // add the wishlist to the user
        user.wishlist.push(wishListId);
      }
      console.log("Updated wishlist:", user.wishlist);
      
      // save the user
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      console.error("Wishlist update error:", error);
      res.status(500).json({ error: error.message });
    }
  },
  getAllWishList: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return just the wishlist IDs array instead of trying to populate
      // This avoids errors when some IDs might not exist in the database anymore
      res.status(200).json(user.wishlist || []);
    } catch (error) {
      console.error("Error getting wishlist:", error);
      res.status(500).json({ error: error.message });
    }
  },

  checkPetExists: async (req, res) => {
    try {
      const { petId } = req.params;

      // Check if pet exists in AboutPet model
      const aboutPet = await AboutPet.exists({ _id: petId });
      if (aboutPet) {
        return res.status(200).json({ exists: true, modelType: "AboutPet" });
      }

      // If not found in AboutPet, check MatingPet model
      const matingPet = await MatingPet.exists({ _id: petId });
      if (matingPet) {
        return res.status(200).json({ exists: true, modelType: "MatingPet" });
      }

      // Pet not found in either model
      return res.status(200).json({ exists: false });

    } catch (error) {
      console.error("Error checking pet existence:", error);
      res.status(500).json({ error: error.message });
    }
  },

  updateprofile: async (req, res) => {
    try {
      const user = req.body;
      console.log("user in update profile", user);
      const userId = user._id;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        user,
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
export default userController;
