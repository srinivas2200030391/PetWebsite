import jwt from "jsonwebtoken"

export const generatetoken = (userid, res) => {
    const token = jwt.sign({userid}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // ms
        httpOnly: true, // prevent xss attacks cross-site scripting attacks
        sameSite: "strict", // CSRF ATTACKS cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development",
        path: "/" // Explicitly set path to root
        // domain: "yourdomain.com" // Uncomment and set if needed
    })

    return token;
}