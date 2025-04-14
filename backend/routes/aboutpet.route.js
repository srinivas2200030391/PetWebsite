import express from "express";
import aboutPet from "../controllers/aboutpet.controller.js";

const router = express.Router();

router.post("/createaboutpet", aboutPet.createAbout);
router.get("/dog", aboutPet.getAllDogs);
router.get("/getallaboutpet", aboutPet.getAllAboutPet);
router.get("/cat", aboutPet.getAllCats);
router.get("/bird", aboutPet.getAllBirds);
router.get("/getbreeds/:item", aboutPet.getBreeds);
router.get("/getpetbybreed/:breed", aboutPet.getPetByBreed);

export default router;
