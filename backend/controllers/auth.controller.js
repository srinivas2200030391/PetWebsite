import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generatetoken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { email, fullname, password } = req.body;
  try {
    if (!fullname || !password || !email) {
      return res.status(400).json({ message: "provide full details" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "password must be 6 characters" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "user already exist" });
    }
    // hash passwords

    const salt = await bcrypt.genSalt(10);
    const hashedpasssword = await bcrypt.hash(password, salt);

    const newuser = new User({
      fullname: fullname,
      password: hashedpasssword,
      email: email,
    });

    if (newuser) {
      generatetoken(newuser._id, res);
      await newuser.save();

      res.status(201).json({
        id: newuser._id,
        fullname: newuser.fullname,
        email: newuser.email,
        profilepic: newuser.profilepic,
      }); // 201 means somethinfg has created
    } else {
      res.status(400).json({ messaage: "Invalid user data" });
    }
  } catch (error) {
    console.log(`error in signup controller ${error.message}`);
    res.status(500).json({ message: "internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt with email:", email);
    console.log("Password length:", password ? password.length : "No password provided");

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.find({ email: email });

    if (user.length === 0) {
      return res.status(401).json({ message: "User not found, my love 💔" });
    }

    console.log("Login Successful for", user[0].fullname); // Log before sending response
    return res.status(200).json({ message: "Login successful 💕", data: user });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const logout = (req, res) => {
  try {
    // Need to match the exact same options used when setting the cookie
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // This is important
      sameSite: "strict",
      expires: new Date(0),
      path: "/", // Make sure path matches how you set it
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateprofile = async (req, res) => {
  try {
    const { profilepic } = req.body;
    const userId = req.user._id;

    if (!profilepic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilepic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilepic: uploadResponse.secure_url,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updating profile:", error.message); // More detailed logging
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkauth = async (req, res) => {
  try {
      // User is already verified by protectroute middleware
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
          return res.status(401).json({ message: "User not found" });
      }
      res.status(200).json(user);
  } catch (error) {
      console.error("Check auth error:", error);
      res.status(500).json({ message: "Server error" });
  }
};
