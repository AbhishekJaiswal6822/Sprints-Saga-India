// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\backend\controllers\couponController.js

const Coupon = require("../models/Coupon");

// Create a new coupon (Admin only)
exports.createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue } = req.body;
    const newCoupon = await Coupon.create({ code, discountType, discountValue });
    res.status(201).json({ success: true, data: newCoupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Validate a coupon (Public/Registration)
exports.validateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ success: false, message: "Invalid or expired coupon" });
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};