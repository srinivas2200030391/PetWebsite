import mongoose from "mongoose"

const BoardingSchema = new mongoose.Schema({
    // Basic Info
    shopName: { type: String, required: true },
    shopDescription: { type: String, required: true },
    location: { type: String, required: true },
    
    // Add shopId field with default value and non-unique
    shopId: { type: String, default: function() { return new mongoose.Types.ObjectId().toString() }, required: false },
    
    // Contact Info (including the mentioned required fields)
    ownerName: { type: String, required: true },
    address: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    businessHours: { type: String, required: true },
    
    // Pet Types and Pricing
    petTypes: { type: Array, required: true },
    priceTable: { type: Array, required: true },
    
    // Amenities (optional)
    amenities: { type: Array, required: false },
    
    // Images (can be optional)
    images: { type: Array, required: false },
    
    // User reference (for authentication)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    
    // Bookings
    currentBookings: { type: Array, default: [], required: false }
}, { timestamps: true });

// Remove any existing shopId index that might be causing the issue
BoardingSchema.index({ shopId: 1 }, { unique: false });

const Boarding = mongoose.model("Boarding", BoardingSchema);
export default Boarding
