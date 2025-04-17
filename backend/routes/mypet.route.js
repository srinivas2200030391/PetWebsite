import express from "express";
const router = express.Router();
//const { verifyAndAAuthorization } = require("../middleware/verifyToken");
import myPetController from "../controllers/mypet.controller.js";

router.post("/createpet/:id", myPetController.createpet);
router.post("/petlogin", myPetController.loginuser);

export default router;