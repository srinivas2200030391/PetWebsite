import Vendor from "../models/vendor.model.js";

const vendorController = {
  getVendors: async (req, res) => {
    try {
      const vendors = await Vendor.find();
      res.status(200).json(vendors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  createVendor: async (req, res) => {
    try {
      const newVendor = await Vendor.create(req.body);
      res.status(201).json(newVendor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getVendor: async (req, res) => {
    try {
      const vendor = await Vendor.findById(req.params.id);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.status(200).json(vendor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateVendor: async (req, res) => {
    try {
      const updatedVendor = await Vendor.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.status(200).json(updatedVendor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteVendor: async (req, res) => {
    try {
      const deletedVendor = await Vendor.findByIdAndDelete(req.params.id);
      if (!deletedVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.status(200).json({ message: "Vendor deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  approveVendor: async (req, res) => {
    try {
      const vendor = await Vendor.findById(req.params.id);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      vendor.approved = true;
      await vendor.save();
      res.status(200).json({ message: "Vendor approved successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  rejectVendor: async (req, res) => {
    try {
      const vendor = await Vendor.findById(req.params.id);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      vendor.approved = false;
      await vendor.save();
      res.status(200).json({ message: "Vendor rejected successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getApprovedVendors: async (req, res) => {
    try {
      const vendors = await Vendor.find({ approved: true });
      res.status(200).json(vendors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getUnapprovedVendors: async (req, res) => {
    try {
      const vendors = await Vendor.find({ approved: false });
      res.status(200).json(vendors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getVendorByEmail: async (req, res) => {
    try {
      const vendor = await Vendor.findOne({ email: req.params.email });
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.status(200).json(vendor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default vendorController;
