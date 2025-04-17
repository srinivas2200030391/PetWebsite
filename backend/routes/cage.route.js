import express from "express";
const router = express.Router();
import cageController from "../controllers/cage.controller.js";

router.get("/", cageController.getAllCages);
router.get("/status/:status", cageController.getCagesByStatus);
router.post("/", cageController.addCage);
router.put("/:cageId", cageController.updateCage);
router.delete("/:cageId", cageController.deleteCage);

export default router;
