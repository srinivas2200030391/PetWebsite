// pet-app-backend\controllers\productController.js
const Product = require("../models/Product");
const Payment = require("../models/Payment");

module.exports = {
    createProduct: async (req, res) => {
        console.log("createProduct function called!");

        try {
            console.log("req.body:", req.body);
            const newProduct = new Product(req.body);  // Potential Error Point 1
            console.log("newProduct created:", newProduct);

            const savedProduct = await newProduct.save();  // Potential Error Point 2
            console.log("savedProduct:", savedProduct);

            res.status(201).json(savedProduct);
        } catch (err) {
            console.error("Error creating product:", err);
            console.error("Error stack:", err.stack);

            // Add more specific error handling based on the error type
            if (err.name === 'ValidationError') {
                // Mongoose validation error
                console.error("Mongoose validation errors:", err.errors);
                return res.status(400).json({ message: "Validation error", errors: err.errors });  // Return a 400 Bad Request
            } else if (err.name === 'MongoError' && err.code === 11000) {
                // Duplicate key error
                return res.status(409).json({ message: "Duplicate key error", error: err.message }); // Return a 409 Conflict
            }

            res.status(500).json({ message: "Failed to create product", error: err.message });
        }
    },

    getAllProducts: async (req, res) => {
        try {
            const products = await Product.find();
            res.status(200).json(products);
        } catch (err) {
            console.error("Error getting all products:", err);
            res.status(500).json({ message: "Failed to get products", error: err.message });
        }
    },

    getProductById: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.status(200).json(product);
        } catch (err) {
            console.error("Error getting product by ID:", err);
            res.status(500).json({ message: "Failed to get product", error: err.message });
        }
    },
    updateProduct: async (req, res) => {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            if (!updatedProduct) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.status(200).json(updatedProduct);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteProduct: async (req, res) => {
        try {
            await Product.findByIdAndDelete(req.params.id);
            res.status(200).json("Product has been deleted...");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getProductDetails: async (req, res) => {
        try {
            const { id } = req.params;
            const { userId } = req.body;

            const product = await Product.findById(id);

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            // Check if payment exists for this product and user
            const payment = await Payment.findOne({
                userId: userId,
                productId: id,
                status: "success",
            });

            let productDetails;

            if (payment) {
                // If payment exists, return all details
                productDetails = {
                    ...product._doc,
                };
            } else {
                // If no payment, return limited details
                productDetails = {
                    category: product.category,
                    Breed_name: product.Breed_name,
                    Gender: product.Gender,
                    imageurl: product.imageurl,
                    quality: product.quality,
                    age: product.age,
                    Breed_lineage: product.Breed_lineage,
                    vaccination: product.vaccination,
                    price: product.price,
                    location: product.location,
                    status: product.status,
                };
            }

            res.status(200).json(productDetails);
        } catch (err) {
            console.error("Error getting product details:", err);
            res
                .status(500)
                .json({ message: "Failed to get product details", error: err.message });
        }
    },
};