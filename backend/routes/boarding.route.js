import express from "express";
import boardingController from "../controllers/boarding.controller.js";

const router = express.Router();

// Base CRUD operations
router.post("/", boardingController.createBoarding);
router.get("/", boardingController.getAllBoarding);
router.get("/:id", boardingController.getBoardingById);
router.put("/:id", boardingController.updateBoarding);
router.delete("/:id", boardingController.deleteBoarding);

// Additional specialized routes
router.get("/rates", boardingController.getBoardingRates);
router.put("/:id/rates", boardingController.addBoardingRate);
router.put("/:id/rates/:rateId", boardingController.editBoardingRate);
router.delete("/:id/rates/:rateId", boardingController.deleteBoardingRate);

export default router;
