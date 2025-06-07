import jwt from "jsonwebtoken"

export const generatetoken = (userid, res) => {
    const token = jwt.sign({userid}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // ms
        httpOnly: true, // prevent xss attacks cross-site scripting attacks
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Allows cross-site cookies in production
        secure: true, // Always use secure in all environments as deployment uses HTTPS
        path: "/", // Explicitly set path to root
        domain: process.env.NODE_ENV === "production" ? new URL(process.env.FRONTEND_URL).hostname : undefined // Extract domain from FRONTEND_URL in production
    })

    return token;
}