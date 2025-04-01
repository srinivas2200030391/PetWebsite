import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import connectdb from "./lib/db.js";

dotenv.config(); 

const PORT = process.env.PORT;

// Middleware for parsing cookies
app.use(cookieparser());

// CORS configuration (ensure frontend URL is correct)
app.use(cors({
  origin: "http://localhost:5173", // Frontend URL
  credentials: true,  // Allow cookies to be sent/received
}));


// Routes
app.use("/api/auth", authRoutes);



// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectdb();  // Connect to the database
});