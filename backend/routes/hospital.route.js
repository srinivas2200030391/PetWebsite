import express from "express";
import hospitalController from "../controllers/hospital.controller.js"; // Correct controller import

const router = express.Router();

router.post("/create", hospitalController.createHospital);
router.get("/get/:id", hospitalController.getHospital);
router.get("/getall", hospitalController.getAllHospitals);

export default router;
