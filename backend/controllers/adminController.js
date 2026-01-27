// backend/controllers/adminController.js
const Registration = require('../models/Registration');
const User = require('../models/User');

exports.getAdminDashboardData = async (req, res) => {
    try {
        // 1. Fetch Users and Registrations
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        const registrations = await Registration.find().sort({ registeredAt: -1 });

        // 2. Calculate Live Stats from your real Atlas fields
        const stats = {
            total: registrations.length,
            individual: registrations.filter(r => r.registrationType === 'individual').length,
            group: registrations.filter(r => r.registrationType === 'group').length,
            paid: registrations.filter(r => r.paymentStatus === 'paid').length,
            pending: registrations.filter(r => r.paymentStatus === 'pending').length,
            revenue: registrations
                .filter(r => r.paymentStatus === 'paid')
                .reduce((sum, r) => sum + (r.amount || 0), 0)
        };

        res.status(200).json({
            success: true,
            users,
            registrations,
            stats
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};