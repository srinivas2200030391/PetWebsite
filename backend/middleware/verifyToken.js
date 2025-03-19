const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY_jWT, (err, user) => {
      if (err) {
        console.error("Token verification error:", err);
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.id === req.params.id) {
      next();
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }
  });
};

const verifyVendor = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && (req.user.userType === "Vendor" || req.user.userType === "Admin")) {
      next();
    } else {
      return res.status(403).json({ message: "Unauthorized: Vendor access required" });
    }
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.userType === "Admin") {
      next();
    } else {
      return res.status(403).json({ message: "Unauthorized: Admin access required" });
    }
  });
};

module.exports = {
  verifyToken,
  verifyUser,
  verifyVendor,
  verifyAdmin,
};