import express from "express";
const router = express.Router();
import boardingRequestController from "../controllers/boardingrequest.controller.js";

router.get("/", boardingRequestController.getAllBoardingRequests);
router.post("/", boardingRequestController.addBoardingRequest);
router.get("/user/:id", boardingRequestController.getBoardingRequest);
router.put("/:id", boardingRequestController.updateBoardingRequest);
router.delete("/:id", boardingRequestController.deleteBoardingRequest);

export default router;
