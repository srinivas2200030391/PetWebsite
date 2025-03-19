import express from "express";
import brodingController from "../controllers/boarding.controller.js";

const router = express.Router();

router.post("/createbroading", brodingController.createBroding);
router.get("/getallbroading", brodingController.getAllBroding);
router.put("/updatebroadingdetails", brodingController.updateBroding);
router.get("/getBreedRate", brodingController.getBrodingRate);
router.put("/AddBreedRate", brodingController.addBrodingRate);
router.delete("/deleteBreed", brodingController.deleteBroding);
router.put("/EditBreed", brodingController.editBreed);

export default router;
