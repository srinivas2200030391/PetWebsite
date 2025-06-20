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
import BoardingRoute from "./routes/boarding.route.js"; // Assuming you have a boarding route

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: function(origin, callback) {
      const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173", "https://petzu.vercel.app"];
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow credentials (cookies, auth headers)
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieparser());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use("/api/cart", cartRoute);
app.use("/api/boarding",BoardingRoute);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/aboutpet", aboutPetRoute);
app.use("/api/hospital", hospitalRoute);
app.use("/api/hospitalcard", hospitalCardRoute);
app.use("/api/vendor", vendorRoute); // Assuming you have a vendor route
app.use("/api/payments", paymentRoute);
app.use("/api/matingpets", userMatingPetRoute);
app.use("/api/mypet", myPetRoutes);
app.use("/api/pethealth", petHealthRoutes);
app.use("/api/cages", cageRoutes);
// app.use("/api/bookings", BoardingRoute);

// Add a debug route to verify the server is working correctly
app.get("/api/debug", (req, res) => {
  res.json({ success: true, message: "Server is working correctly", routes: app._router.stack.filter(r => r.route).map(r => ({ path: r.route.path, methods: Object.keys(r.route.methods) })) });
});

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
//import Boarding from "./models/boarding.model";

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
