import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import cartRoute from "./routes/cart.route.js";
// import aboutPetRoute from "./routes/aboutpet.route.js";
import hospitalRoute from "./routes/hospital.route.js";
import userRoutes from "./routes/user.route.js";
import hospitalCardRoute from "./routes/hospitalcard.route.js";
import vendorRoute from "./routes/vendor.route.js"; // Assuming you have a vendor route
// import boardingRoute from "./routes/boarding.route.js"
import paymentRoute from "./routes/paymentRoutes.js"; // Assuming you have a payment route
import userMatingPetRoute from "./routes/userMatingPet.route.js";
import aboutPetRoute from "./routes/aboutpet.route.js";
import myPetRoutes from "./routes/mypet.route.js"; // Assuming you have a mypet route
import petHealthRoutes from "./routes/petHealthRoutes.js"; // Assuming you have a pet health route
import cageRoutes from "./routes/cage.route.js"; // Assuming you have a cage route

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: "http://localhost:5173", // Allow only your frontend
    credentials: true, // Allow credentials (cookies, auth headers)
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  })
);
app.use(express.json());
app.use(cookieparser());

app.use("/api/cart", cartRoute);
// app.use("/api/boarding",boardingRoute);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/aboutpet", aboutPetRoute);
app.use("/api/hospital", hospitalRoute);
app.use("/api/hospitalcard", hospitalCardRoute);
app.use("/api/vendor", vendorRoute); // Assuming you have a vendor route
app.use("/api/payment", paymentRoute);
app.use("/api/matingpets", userMatingPetRoute);
app.use("/api/aboutpet", aboutPetRoute);
app.use("/api/mypet", myPetRoutes);
app.use("/api/pethealth", petHealthRoutes);
app.use("/api/cages", cageRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});

// import dotenv from "dotenv";
// import cookieparser from "cookie-parser";
// import cors from "cors";
// import authRoutes from "./routes/auth.route.js";
// import connectdb from "./lib/db.js";
// import express from "express"

// const app = express();

// dotenv.config();

// const PORT = process.env.PORT;

// // Middleware for parsing cookies
// app.use(cookieparser());

// // CORS configuration (ensure frontend URL is correct)
// app.use(cors({
//   origin: "http://localhost:5173", // Frontend URL
//   credentials: true,  // Allow cookies to be sent/received
// }));

// // Routes
// app.use("/api/auth", authRoutes);

// // Start the server
// server.listen(PORT, () => {
//   console.log(`Server running on port ₹{PORT}`);
//   connectdb();  // Connect to the database
// });
