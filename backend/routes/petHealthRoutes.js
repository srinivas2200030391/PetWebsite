import express from "express";
const router = express.Router();
import petHealthController from "../controllers/petHealthController.js";

router.get("/getAll", petHealthController.getAll);
router.get("/getById/:id", petHealthController.getById);
router.post("/create", petHealthController.create);

export default router;
