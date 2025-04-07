import vendorController from "../controllers/vendor.controller.js";
import express from "express";
const router = express.Router();

router.post("/create", vendorController.createVendor);
router.get("/", vendorController.getVendors);
router.get("/:id", vendorController.getVendor);
router.put("/:id", vendorController.updateVendor);
router.delete("/:id", vendorController.deleteVendor);
router.put("/approve/:id", vendorController.approveVendor);
router.put("/reject/:id", vendorController.rejectVendor);
router.get("/approved", vendorController.getApprovedVendors);
router.get("/unapproved", vendorController.getUnapprovedVendors);
// router.get("/search/:query", vendorController.searchVendors);
router.get("/getbyemail/:email", vendorController.getVendorByEmail);

// router.get("/getbyphone/:phone", vendorController.getVendorByPhone);

export default router;
