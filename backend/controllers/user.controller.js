import AboutPet from "../models/aboutpet.model.js";
import User from "../models/user.model.js";
import { updateprofile } from "./auth.controller.js";


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
      // check if the wishlist is present in the aboutpet model
      const wish = await AboutPet.findById(wishListId);
      if (!wish) {
        return res.status(404).json({ message: "Wishlist not found" });
      }
      // check if the wishlist is already present in the user
      const isPresent = user.wishlist.includes(
       wishListId
      );
      if (isPresent) {
        // remove the wishlist from the user
        user.wishlist = user.wishlist.filter(
          (item) => item !== wishListId
        );
      } else {
        // add the wishlist to the user
        user.wishlist.push(wishListId);
      }
      console.log(user.wishlist);
      
      // save the user
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAllWishList: async (req, res) => {
    try {
      const user =
        await User.findById(req.params.id).populate("wishlist");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user.wishlist);
    } catch (error) {
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
