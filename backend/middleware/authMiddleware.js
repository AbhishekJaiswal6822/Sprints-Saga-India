// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // the User model to verify data
// Middleware to verify JWT and attach user data to the request object (req.user)
const authMiddleware = (req, res, next) => {
    // 1. Check for the token in the headers
    // The token is typically sent in the 'Authorization' header as: Bearer <token>
    const authHeader = req.header('Authorization');
    
    // Check if header is present and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            message: 'Access Denied. No token, or token format is invalid.' 
        });
    }

    // Extract the token part (strip the "Bearer " prefix)
    const token = authHeader.replace('Bearer ', '');
    
    // 2. Verify the token
    try {
        // jwt.verify takes the token, the secret, and a callback/returns the payload
        // The payload contains { id: user._id } which we signed in authController.js
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Attach the user's ID/payload to the request object
        // This makes the user ID available in subsequent controllers (e.g., req.user.id in registrationController)
        req.user = decoded;
        
        // Continue to the next middleware or the route handler
        next();

    } catch (err) {
        // This catches token expiry, invalid signature, or other verification failures
        console.error("JWT Verification Error:", err.message);
        return res.status(401).json({ 
            message: 'Token is not valid or has expired.' 
        });
    }
};

// --- NEW ADMIN LOCK ---
const adminMiddleware = async (req, res, next) => {
    try {
        // Find the user in the database using the ID from the decoded token
        const user = await User.findById(req.user.id);
        const ADMIN_EMAIL = "admin@sprintssagaindia.com";

        if (!user || user.email !== ADMIN_EMAIL) {
            return res.status(403).json({ 
                message: "Access Denied: You do not have admin privileges." 
            });
        }

        // If it matches, proceed to the actual data logic
        next();
    } catch (error) {
        console.error("Admin Verification Error:", error);
        res.status(500).json({ message: "Server error during admin verification." });
    }
};

module.exports = { authMiddleware, adminMiddleware };