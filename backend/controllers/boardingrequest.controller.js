import BoardingRequest from "../models/boardingrequest.model.js";

// Get all boarding requests
const BoardingRequestController = {
  getAllBoardingRequests: async (req, res) => {
    try {
      const requests = await BoardingRequest.find();
      res.json(requests);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Add a boarding request
  addBoardingRequest: async (req, res) => {
    try {
      // const { customer, petName, petType, startDate, endDate, totalCost } =
      //   req.body;
      // const boardingRequest = new BoardingRequest({
      //   customer,
      //   petName,
      //   petType,
      //   startDate,
      //   endDate,
      //   totalCost,
      // });
      // await boardingRequest.save();
      const boardingRequest = new BoardingRequest(req.body);
      console.log("boardingRequest", boardingRequest);
      await boardingRequest.save();
      res.status(201).json(boardingRequest);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Get a single boarding request
  getBoardingRequest: async (req, res) => {
    try {
      const id = req.params.id;
      const boardingRequest = await BoardingRequest.find({ customer: id });
      if (!boardingRequest) {
        return res.status(404).json({ error: "Boarding request not found" });
      }
      res.json(boardingRequest);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Update a boarding request
  updateBoardingRequest: async (req, res) => {
    // update the status
    try {
      const id = req.params.id;
      const { status } = req.body;
      const boardingRequest = await BoardingRequest.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      res.json(boardingRequest);
    } catch (err) {
      if (err.name === "CastError") {
        res.status(400).json({ error: "Invalid ID format" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  },
  // Delete a boarding request
  deleteBoardingRequest: async (req, res) => {
    try {
      const id = req.params.id;
      const boardingRequest = await BoardingRequest.findByIdAndDelete(id);
      if (!boardingRequest) {
        return res.status(404).json({ error: "Boarding request not found" });
      }
      res.json({ message: "Boarding request deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default BoardingRequestController;
