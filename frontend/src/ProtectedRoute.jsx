// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\frontend\src\ProtectedRoute.js - 

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

// Component now accepts an optional 'requiredRole' prop
const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();
    const ADMIN_EMAIL = "admin@sprintssagaindia.com";

    // 1. Loading state (wait for user data)
    if (loading) {
        return <div>Loading user session...</div>;
    }

    // 2. Check for login
    if (!user || !user.isLoggedIn) {
        // If not logged in, redirect to signin page
        return <Navigate to="/signin" replace />;
    }

    // 3. Combined Role & Email Check
    if (requiredRole === 'admin') {
        // If the page requires admin, they MUST have the admin email
        if (user.email !== ADMIN_EMAIL) {
            return <Navigate to="/" replace />;
        }
    } else if (requiredRole && user.role !== requiredRole) {
        // This handles any other roles you might add in the future
        return <Navigate to="/" replace />;
    }

    // 4. Access granted
    return children;
};

export default ProtectedRoute;