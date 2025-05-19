import Boarding from "../models/boarding.model.js";
import cloudinary from "../lib/cloudinary.js";

// Base CRUD operations
const createBoarding = async (req, res) => {
  try {
    const boardingData = { ...req.body };
    
    // Handle image uploads if provided
    if (boardingData.images && boardingData.images.length > 0) {
      const uploadPromises = boardingData.images.map(image => 
        cloudinary.uploader.upload(image, {
          folder: "boarding_centers",
        })
      );
      
      const uploadResults = await Promise.all(uploadPromises);
      boardingData.images = uploadResults.map(result => result.secure_url);
    }
    
    const newBoarding = new Boarding(boardingData);
    const savedBoarding = await newBoarding.save();
    
    res.status(201).json({
      success: true,
      message: "Boarding center created successfully",
      data: savedBoarding
    });
  } catch (error) {
    console.error("Error creating boarding center:", error);
    res.status(400).json({
      success: false,
      message: "Failed to create boarding center",
      error: error.message
    });
  }
};

const getAllBoarding = async (req, res) => {
  try {
    const boardings = await Boarding.find();
    res.status(200).json({
      success: true,
      count: boardings.length,
      data: boardings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch boarding centers",
      error: error.message
    });
  }
};

const getBoardingById = async (req, res) => {
  try {
    const boarding = await Boarding.findById(req.params.id);
    if (!boarding) {
      return res.status(404).json({
        success: false,
        message: "Boarding center not found"
      });
    }
    res.status(200).json({
      success: true,
      data: boarding
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch boarding center",
      error: error.message
    });
  }
};

const updateBoarding = async (req, res) => {
  try {
    const boardingData = { ...req.body };
    
    // Handle image uploads if the images are base64 strings (new uploads)
    if (boardingData.images) {
      const newImages = boardingData.images.filter(img => img.startsWith('data:image'));
      
      if (newImages.length > 0) {
        const uploadPromises = newImages.map(image => 
          cloudinary.uploader.upload(image, {
            folder: "boarding_centers",
          })
        );
        
        const uploadResults = await Promise.all(uploadPromises);
        const newImageUrls = uploadResults.map(result => result.secure_url);
        
        // Keep existing image URLs and add new ones
        boardingData.images = [
          ...boardingData.images.filter(img => !img.startsWith('data:image')),
          ...newImageUrls
        ];
      }
    }
    
    const updatedBoarding = await Boarding.findByIdAndUpdate(
      req.params.id,
      boardingData,
      { new: true, runValidators: true }
    );
    
    if (!updatedBoarding) {
      return res.status(404).json({
        success: false,
        message: "Boarding center not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Boarding center updated successfully",
      data: updatedBoarding
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update boarding center",
      error: error.message
    });
  }
};

const deleteBoarding = async (req, res) => {
  try {
    const deletedBoarding = await Boarding.findByIdAndDelete(req.params.id);
    if (!deletedBoarding) {
      return res.status(404).json({
        success: false,
        message: "Boarding center not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Boarding center deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete boarding center",
      error: error.message
    });
  }
};

// Additional specialized routes for pricing
const getBoardingRates = async (req, res) => {
  try {
    const boardings = await Boarding.find().select('shopName priceTable');
    res.status(200).json({
      success: true,
      data: boardings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch boarding rates",
      error: error.message
    });
  }
};

const addBoardingRate = async (req, res) => {
  try {
    const boarding = await Boarding.findById(req.params.id);
    if (!boarding) {
      return res.status(404).json({
        success: false,
        message: "Boarding center not found"
      });
    }
    
    boarding.priceTable.push(req.body);
    await boarding.save();
    
    res.status(200).json({
      success: true,
      message: "Price rate added successfully",
      data: boarding
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to add price rate",
      error: error.message
    });
  }
};

const editBoardingRate = async (req, res) => {
  try {
    const boarding = await Boarding.findById(req.params.id);
    if (!boarding) {
      return res.status(404).json({
        success: false,
        message: "Boarding center not found"
      });
    }
    
    const rateIndex = boarding.priceTable.findIndex(
      rate => rate._id.toString() === req.params.rateId
    );
    
    if (rateIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Price rate not found"
      });
    }
    
    boarding.priceTable[rateIndex] = {
      ...boarding.priceTable[rateIndex],
      ...req.body
    };
    
    await boarding.save();
    
    res.status(200).json({
      success: true,
      message: "Price rate updated successfully",
      data: boarding
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update price rate",
      error: error.message
    });
  }
};

const deleteBoardingRate = async (req, res) => {
  try {
    const boarding = await Boarding.findById(req.params.id);
    if (!boarding) {
      return res.status(404).json({
        success: false,
        message: "Boarding center not found"
      });
    }
    
    boarding.priceTable = boarding.priceTable.filter(
      rate => rate._id.toString() !== req.params.rateId
    );
    
    await boarding.save();
    
    res.status(200).json({
      success: true,
      message: "Price rate deleted successfully",
      data: boarding
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete price rate",
      error: error.message
    });
  }
};

export default {
  createBoarding,
  getAllBoarding,
  getBoardingById,
  updateBoarding,
  deleteBoarding,
  getBoardingRates,
  addBoardingRate,
  editBoardingRate,
  deleteBoardingRate
}; 