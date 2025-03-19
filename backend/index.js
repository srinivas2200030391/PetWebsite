import cors from "cors"
import express from "express"
import { connectDB } from "./lib/db.js";
import dotenv from "dotenv"
import cartRoute from "./routes/cart.route.js"
import boardingRoute from "./routes/boarding.route.js"


const app = express();
dotenv.config();
const PORT = process.env.PORT || 8000;


app.use(cors());
app.use(express.json());


app.use("/api/cart",cartRoute);
app.use("/api/boarding",boardingRoute);




app.listen(PORT, () =>{
     console.log(`Server running on port ${PORT}`)
     connectDB();
    });
