import express from "express";
import { getAllBreeds, getBreedById, createBreed } from "../controllers/Breed.controller.js";

const router = express.Router();

router.get("/", getAllBreeds);           // GET /api/breeds
router.get("/:id", getBreedById);       // GET /api/breeds/:id
router.post("/", createBreed);          // POST /api/breeds

export default router;