import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generatetoken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import { sendEmail } from "../utils/sendEmail.js";

export const signup = async (req, res) => {
  try {
    const userData = req.body;
    console.log("Signup request data:", userData);
    
    // Extract email from the request
    const email = userData.email;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    //check if phone number exists
    const phoneExists = await User.findOne({ phone: userData.phone });
    if (phoneExists) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Create a new user with properly mapped fields
    const newUser = new User({
      fullname: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      username: userData.username,
      password: hashedPassword,
      userType: "Client"
    });
    
    console.log("Creating new user:", newUser);
    
    // Save the user to the database
    await newUser.save();

    // Generate a token for the new user
    generatetoken(newUser._id, res);

    res.status(201).json({
      message: "User created successfully",
      data: {
        ...newUser.toObject(),
        password: undefined // Don't send password back to client
      },
    });
  } catch (error) {
    console.error(`Error in signup controller: ${error.message}`);
    res.status(500).json({ message: "Internal server error: " + error.message });
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
      secure: true, 
      sameSite: "none",
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
  const { email, phone } = req.body;

  try {
    if (!email) {
      return res
        .status(400)
        .json({ message: "Please provide an email" });
    }
    if (!phone) {
      return res
        .status(400)
        .json({ message: "Please provide a phone number" });
    }

    const user = await User.findOne({ email });
    const phoneExists = await User.findOne({ phone });

    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (phoneExists) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    
    const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333; background-color: #f7f7f7; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">PetZu Verification Code</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="font-size: 20px; color: #333;">Your One-Time Password (OTP)</h2>
            <p style="color: #555;">Hello,</p>
            <p style="color: #555;">Please use the following code to complete your action. This code is valid for 5 minutes.</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="display: inline-block; font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #333; background-color: #f2f2f2; padding: 15px 25px; border-radius: 5px;">${otp}</span>
            </div>
            <p style="color: #555;">If you did not request this code, please disregard this email. Your account is secure.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">
              &copy; ${new Date().getFullYear()} PetZu. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    `;

    await sendEmail(email, "Your OTP Code", html);

    // Send the OTP to the client for verification
    res.status(200).json({ 
      success: true,
      message: `OTP sent to your email - ${email}`,
      otp: otp  // Send OTP to client
    });
  } catch (error) {
    console.error(`getOtp error: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
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

    res.status(200).json({ message: "OTP verified! You're in, honey 🍯" });
  } catch (error) {
    console.error(`verifyOtp error: ${error.message}`);
    res.status(500).json({ message: "Internal server error 💔" });
  }
};

export const resetPassword = async (req, res) => {
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
