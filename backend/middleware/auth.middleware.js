import jwt from "jsonwebtoken"
import User from "../models/user.models.js"


// export const protectroute  =async(req,res,next)=>{
//     try {
//         const token = req.cookies.jwt // we have given name as jwt , can be changed if wanted 
        
//         if(!token){
//             return res.status(401).json({message:"unauthorized -no token provided"})
//         }

//         const decoded = jwt.verify(token,process.env.JWT_SECRET)

//         if(!decoded){
//             return res.status(401).json({message:"unauthorized -invalid token"})
//         }

//         const user = await User.findById(decoded.userId).select("-password")

//         if(!user){
//             return res.status(404).json({messsage:"user not found"})
//         }

//         req.user = user

//         next()
//     } catch (error) {
//         console.log("error in protected rote middle ware", error.message)
//         return res.status(500).json({messsage:"internal server errro"})
        
//     }

// }



export const protectroute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - no token provided" });
        }

        // Decode token and extract userId, if token is invalid this will throw an error
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        // If token is invalid, it will throw an error so we don't need to check "if (!decoded)"
        if (!decoded.userid) {
            return res.status(401).json({ message: "Unauthorized - invalid token" });
        }

        const user = await User.findById(decoded.userid).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protected route middleware", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
