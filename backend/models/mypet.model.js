import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    profilePic: {
        type: String,
        required: true
    },
    petName: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    breedName: {
        type: String,
        required: true
    },
    breedLineage: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Dog', 'Cat', 'Bird', 'Other']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female']
    }
}, {
    timestamps: true
});

export default mongoose.model('Pet', petSchema);
