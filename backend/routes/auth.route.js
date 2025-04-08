import express from "express";
import { checkauth, login, logout, signup, updateprofile } from "../controllers/auth.controller.js";
import { protectroute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/check", protectroute, checkauth);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectroute, updateprofile);

export default router;