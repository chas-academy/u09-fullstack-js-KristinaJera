import JWT from "jsonwebtoken";
import Admin from "../models/adminModel.js";

// Admin authentication middleware
export const adminAuth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);

    const admin = await Admin.findById(decoded.userId);
    if (!admin) {
      return res.status(403).json({ message: "Not authorized as admin" });
    }
    console.log(`Admin authenticated: ${admin._id}`);
    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please log in again." });
    }
    console.error(error); // Log error for debugging
    res.status(401).json({ message: "Invalid token" });
  }
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];
  JWT.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Token is not valid" });
    }

    req.user = user;
    next();
  });
};

// User/Company authentication middleware
export const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing or malformed." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);
    req.user = {
      userId: userToken.userId,
      role: userToken.role,
    };

    // Proceed without checking role if not needed
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(403).json({ message: "Invalid token or access denied." });
  }
};


// Role-based authentication middleware
export const authMiddleware = (roles = []) => {
  return (req, res, next) => {
      const token = req.headers['authorization']?.split(' ')[1]; // Extract the token from the Bearer header

      if (!token) {
          return res.status(401).json({ message: 'No token provided' });
      }

      JWT.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
    
        console.log('Decoded User:', user);  // Check the role in the token payload
        req.user = user;
        
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: User does not have required role' });
        }
    
        next();
    });    
  };
};

export default { userAuth, adminAuth, authenticateToken, authMiddleware };
