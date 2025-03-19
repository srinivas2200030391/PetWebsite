const Crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
  register: async (req, res) => {
    try {
      const hashedPassword = Crypto.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        phone: req.body.phone,
        aadhar_Number: req.body.aadhar_Number,
        userType: req.body.userType,
      });

      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
      console.error("Error during registration:", err);
      res
        .status(500)
        .json({ message: "Registration failed", error: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const decryptedPassword = Crypto.AES.decrypt(
        user.password,
        process.env.SECRET_KEY
      ).toString(Crypto.enc.Utf8);

      if (decryptedPassword !== req.body.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const accessToken = jwt.sign(
        {
          id: user._id,
          userType: user.userType,
        },
        process.env.SECRET_KEY_jWT,
        { expiresIn: "3d" }
      );

      const { password, ...others } = user._doc;
      res.status(200).json({ ...others, accessToken });
    } catch (err) {
      console.error("Error during login:", err);
      res
        .status(500)
        .json({ message: "Login failed", error: err.message });
    }
  },
};