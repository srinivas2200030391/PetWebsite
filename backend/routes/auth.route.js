import express from "express";
import {
  checkauth,
  login,
  logout,
  signup,
    updateprofile,
    getOtp,
    verifyOtp,
    resetPassword,
    sendResetOtp
} from "../controllers/auth.controller.js";
import { protectroute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/check", protectroute, checkauth);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectroute, updateprofile);
router.post("/getotp", getOtp); // Uncomment if you want to use OTP functionality
router.post("/verifyotp", verifyOtp); // Uncomment if you want to use OTP functionality
router.post("/reset-password",resetPassword)
router.post("/send-reset-otp", sendResetOtp);

export default router;
