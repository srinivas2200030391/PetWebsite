import express from "express";
import userController from "../controllers/user.controller.js"; // Correct controller import

const router = express.Router();

router.post("/create", userController.CreateUser);
router.get("/get/:id", userController.getUser);
router.get("/getall", userController.getAllUsers);
router.put("/updatewishlist", userController.updateWishList);
router.get("/getallwishlist/:id", userController.getAllWishList);
router.put("/updateprofile", userController.updateprofile);
router.get("/checkPetExists/:petId", userController.checkPetExists);
export default router;
