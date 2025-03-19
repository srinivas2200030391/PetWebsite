import Broding from "../models/boarding.model.js";

const createBroding = async (req, res) => {
    try {
        const newBroding = new Broding(req.body);
        await newBroding.save();
        res.status(200).json("Success");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllBroding = async (req, res) => {
    try {
        const allBroding = await Broding.find();
        if (!allBroding.length) {
            return res.status(404).json({ message: "Broding not found" });
        }
        res.status(200).json(allBroding);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBroding = async (req, res) => {
    const { id } = req.query;
    const { Breed, Rate } = req.body;

    if (!Breed?.length && !Rate?.length) {
        return res.status(400).json({ message: "No fields to update" });
    }

    try {
        const existingBroding = await Broding.findById(id);
        if (!existingBroding) {
            return res.status(404).json({ message: "Broding not found" });
        }

        if (Breed?.length) {
            existingBroding.Breed.push(...Breed);
        }
        if (Rate?.length) {
            existingBroding.Rate.push(...Rate);
        }

        const updatedBroding = await existingBroding.save();
        res.status(200).json(updatedBroding);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBrodingRate = async (req, res) => {
    const { id } = req.query;
    try {
        const existingBroding = await Broding.findById(id);
        if (!existingBroding) {
            return res.status(404).json({ message: "Broding not found" });
        }

        res.status(200).json({
            success: true,
            data: {
                breeds: existingBroding.Breed,
                rates: existingBroding.Rate
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteBroding = async (req, res) => {
    const { Breed } = req.query;
    try {
        const broding = await Broding.findOne({ Breed: { $in: [Breed] } });
        if (!broding) {
            return res.status(404).json({ message: "Broding not found" });
        }

        const index = broding.Breed.indexOf(Breed);
        if (index === -1) {
            return res.status(404).json({ message: "Breed not found in Broding" });
        }

        await Broding.updateOne(
            { _id: broding._id },
            {
                $pull: { Breed: Breed, Rate: broding.Rate[index] }
            }
        );

        res.status(200).json({ success: true, message: "Broding updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addBrodingRate = async (req, res) => {
    const { id, Breed, Rate } = req.body;
    try {
        const existingBroding = await Broding.findById(id);
        if (!existingBroding) {
            return res.status(404).json({ message: "Broding not found" });
        }

        const breedMap = new Map(existingBroding.Breed.map((breed, index) => [breed, existingBroding.Rate[index]]));

        Breed.forEach((breed, index) => {
            breedMap.set(breed, Rate[index] || null);
        });

        existingBroding.Breed = Array.from(breedMap.keys());
        existingBroding.Rate = Array.from(breedMap.values());

        const updatedBroding = await existingBroding.save();
        res.status(200).json(updatedBroding);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const editBreed = async (req, res) => {
    const { id, breedName, newRate } = req.body;

    try {
        const existingBroding = await Broding.findById(id);
        if (!existingBroding) {
            return res.status(404).json({ message: "Broding document not found" });
        }

        const breedIndex = existingBroding.Breed.findIndex(breed => breed === breedName);

        if (breedIndex === -1) {
            return res.status(404).json({ message: "Breed not found" });
        }

        existingBroding.Rate[breedIndex] = newRate;

        const updatedBroding = await existingBroding.save();
        res.status(200).json(updatedBroding);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export default {
    createBroding,
    getAllBroding,
    updateBroding,
    getBrodingRate,
    deleteBroding,
    addBrodingRate,
    editBreed
};
