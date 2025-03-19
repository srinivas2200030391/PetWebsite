//File path: /pet-app-backend/middleware/accessControl.js
const checkRole = (roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      if (!roles.includes(req.user.userType)) {
        return res.status(403).json({ message: "Forbidden: Insufficient privileges" });
      }
  
      next();
    };
  };
  
  module.exports = { checkRole };