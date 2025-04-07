import express from "express";
import hospitalcardController from "../controllers/hospitalcard.controller.js";

const router = express.Router();

router.post("/create", hospitalcardController.createHospital);
router.get("/", hospitalcardController.getAllHospitals);
router.get("/:id", hospitalcardController.getHospitalById);
router.get("/name/:name", hospitalcardController.getHospitalByName);

export default router;
