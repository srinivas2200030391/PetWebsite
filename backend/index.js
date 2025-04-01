import cors from "cors"
import express from "express"
import dotenv from "dotenv"
import cookieparser from "cookie-parser";


import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import cartRoute from "./routes/cart.route.js"
// import boardingRoute from "./routes/boarding.route.js"


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





app.use("/api/cart",cartRoute);
// app.use("/api/boarding",boardingRoute);
app.use("/api/auth",authRoutes)




app.listen(PORT, () =>{
     console.log(`Server running on port ${PORT}`)
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
//   console.log(`Server running on port ${PORT}`);
//   connectdb();  // Connect to the database
// });