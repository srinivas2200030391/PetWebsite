import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generatetoken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import { sendEmail } from "../utils/sendEmail.js";


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
  const { email, password } = req.body;

  try {
    console.log("User login attempt with email:", email);
    console.log(
      "Password length:",
      password ? password.length : "No password provided"
    );

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generatetoken(user._id, res);

    console.log("User login successful for:", user.fullname);

    return res.status(200).json({
      message: "Login successful",
      data: {
        ...user.toObject(),
      },
    });
  } catch (error) {
    console.error("User login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    // Need to match the exact same options used when setting the cookie
    console.log("Logging out user:");
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
    // User is added to req.vendor by the protectroute middleware
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    // Return the vendor data directly
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Check auth error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOtp = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res
        .status(400)
        .json({ message: "Please provide an email, darling 💌" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found, love 💔" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    await user.save();

    const html = `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Hello lovely 💖</h2>
        <p>Your OTP is: <b>${otp}</b></p>
        <p>Use it within 5 minutes, okay? 💋</p>
      </div>
    `;

    await sendEmail(user.email, "Your OTP Code 💘", html);

    res.status(200).json({ message: "OTP sent to your email 💌" });
  } catch (error) {
    console.error(`getOtp error: ${error.message}`);
    res.status(500).json({ message: "Internal server error 💔" });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Please provide both email and OTP, sugar 🧁" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found 😢" });
    }

    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP, sweetheart 😞" });
    }

    user.otp = null;
    await user.save();

    res.status(200).json({ message: "OTP verified! You’re in, honey 🍯" });
  } catch (error) {
    console.error(`verifyOtp error: ${error.message}`);
    res.status(500).json({ message: "Internal server error 💔" });
  }
};

export const resetPassword =async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found 💔" });
    }

    // 💫 Hash the password like it's your deepest secret
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully 💖" });
  } catch (error) {
    console.error(`Error resetting password: ${error.message}`);
    res.status(500).json({ message: "Internal server error 😢" });
  }
};