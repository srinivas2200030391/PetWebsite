import express from "express";
import myPetController from "../controllers/mypet.controller.js";

const router = express.Router();

// Create new pet
router.post("/create", myPetController.createPet);

// Get all pets for a user
router.get("/user/:userId", myPetController.getUserPets);

// Get single pet details
router.get("/pet/:petId", myPetController.getPetById);

// Update pet profile
router.put("/update/:petId", myPetController.updatePet);

// Delete pet profile
router.delete("/delete/:petId", myPetController.deletePet);

export default router;
