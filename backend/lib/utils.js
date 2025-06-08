import jwt from "jsonwebtoken"

export const generatetoken = (userid, res) => {
    const token = jwt.sign({userid}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // ms
        httpOnly: true, // prevent xss attacks cross-site scripting attacks
        sameSite: "none", // Allow cross-site cookies in production
        secure: true, // Always use secure in all environments as deployment uses HTTPS
        path: "/", // Explicitly set path to root
    })

    return token;
}