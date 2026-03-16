// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\backend\controllers\couponController.js

const Coupon = require("../models/Coupon");

// 1. Create a new coupon (Admin)
exports.createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue } = req.body;
        const newCoupon = await Coupon.create({ 
            code: code.toUpperCase(), 
            discountType, 
            discountValue 
        });
        res.status(201).json({ success: true, data: newCoupon });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 2. Get all coupons (Admin List)
exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort("-createdAt");
        res.status(200).json({ success: true, data: coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Toggle Coupon Status (Admin On/Off)
exports.toggleCouponStatus = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) return res.status(404).json({ success: false, message: "Not found" });

        coupon.isActive = !coupon.isActive;
        await coupon.save();
        res.status(200).json({ success: true, data: coupon });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Delete Coupon (Admin)
exports.deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Coupon deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Validate a coupon (For Users in Register.jsx)

exports.validateCoupon = async (req, res) => {
    try {
        // .trim() removes any accidental spaces sent from the frontend
        const code = req.params.code.trim().toUpperCase(); 
        
        console.log(`[Coupon Check]: Searching for "${code}"`);

        const coupon = await Coupon.findOne({ 
            code: code, 
            isActive: true 
        });

        if (!coupon) {
            console.log(`[Coupon Fail]: "${code}" not found or inactive`);
            return res.status(404).json({ success: false, message: "Invalid or expired coupon" });
        }

        console.log(`[Coupon Success]: Found "${code}" - ${coupon.discountValue}${coupon.discountType === 'PERCENT' ? '%' : ' Flat'}`);
        res.status(200).json({ success: true, data: coupon });
    } catch (error) {
        console.error("Validation Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};