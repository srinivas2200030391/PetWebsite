import express from "express";
import {
  getAllMatingPets,
  getMatingPetById,
  filterMatingPets,
} from "../controllers/userMatingPet.controller.js";

const router = express.Router();

router.get("/all", getAllMatingPets);
router.get("/pet/:petId", getMatingPetById);
router.get("/filter", filterMatingPets);

export default router;
