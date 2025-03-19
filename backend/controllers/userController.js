const User = require("../models/User");
const Crypto = require("crypto-js");

module.exports = {
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password"); // Exclude password
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (err) {
      console.error("Error getting user:", err);
      res.status(500).json({ message: "Failed to get user", error: err.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      // Hash the password if it's being updated
      if (req.body.password) {
        req.body.password = Crypto.AES.encrypt(
          req.body.password,
          process.env.SECRET_KEY
        ).toString();
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      ).select("-password"); // Exclude password

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ message: "Failed to update user", error: err.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ message: "Failed to delete user", error: err.message });
    }
  },
};