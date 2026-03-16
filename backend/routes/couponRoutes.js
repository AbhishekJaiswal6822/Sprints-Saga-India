// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\backend\routes\couponRoutes.js

const express = require("express");
const router = express.Router();
const { 
    createCoupon, 
    getAllCoupons, 
    toggleCouponStatus, 
    deleteCoupon, 
    validateCoupon 
} = require("../controllers/couponController");

// Admin routes
router.post("/", createCoupon);
router.get("/", getAllCoupons);
router.patch("/:id/status", toggleCouponStatus);
router.delete("/:id", deleteCoupon);

// User/Public route
router.get("/validate/:code", validateCoupon);

module.exports = router;