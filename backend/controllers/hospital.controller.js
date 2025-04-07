import Hospital from "../models/hospital.model.js";
import User from "../models/user.model.js"; // Correct import for User model

const hospitalController = {
  createHospital: async (req, res) => {
    try {
      // get the data from request body and get the email and get _id from the user based on email
      const newHospitalData = req.body;
      const user = await User.findOne({ email: newHospitalData.userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // create a new hospital document and save it to the database
      newHospitalData.userId = user._id; // Assign the user ID to the hospital data
      const newHospital = await Hospital.create(newHospitalData);
      res
        .status(200)
        .json({ message: "Hospital successfully created", data: newHospital });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getHospital: async (req, res) => {
    const userId = req.params.id;
    try {
      const hospitalDetails = await Hospital.find({ userId: userId });
      if (!hospitalDetails || hospitalDetails.length === 0) {
        return res
          .status(404)
          .json({ message: "Hospital not found for this user" });
      }
      res.status(200).json(hospitalDetails);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAllHospitals: async (req, res) => {
    try {
      const hospitals = await Hospital.find();
      res.status(200).json(hospitals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default hospitalController;
