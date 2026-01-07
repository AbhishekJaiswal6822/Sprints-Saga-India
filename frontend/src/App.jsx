// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\frontend\src\App.jsx 

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Imports for and Payment
import PaymentPage from "./pages/PaymentPage";

// Imports for Auth and Protection
import { AuthProvider } from "./AuthProvider";
import ProtectedRoute from "./ProtectedRoute"; // CRITICAL

import Navbar from "./Navbar";
import Footer from "./Footer";

// Pages
import Home from "./Home";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ResultsGallery from "./ResultsGallery";
import AdminDashboard from "./AdminDashboard";
import Accomodation from "./Accomodation";
import AdminAccommodation from "./AdminAccommodation";
import UnderMaintenance from "./UnderMaintenance";
import Faqs from "./Faqs";
import PrivacyPolicy from "./PrivacyPolicy";

// UserDashboard
import UserDashboard from "./pages/UserDashboard";

// Utilities
import ScrollToTop from "./ScrollToTop";
import Register from "./Register";
import PaymentSuccessPage from './pages/PaymentSuccessPage';

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />

            {/* AuthProvider must wrap all components that useAuth() */}
            <AuthProvider>

                <div className="min-h-screen flex flex-col">

                    <Navbar />

                    <main className="flex-1">
                        <Routes>
                            <Route path="/" element={<Home />} />

                            {/* --- PROTECTED ROUTES (Requiring only LOGIN) --- */}
                            <Route
                                path="/register"
                                element={<ProtectedRoute><Register /></ProtectedRoute>}
                            />
                            <Route
                                path="/payment"
                                element={<ProtectedRoute><PaymentPage /></ProtectedRoute>}
                            />

                            {/* --- RBAC ROUTES (Requiring ADMIN ROLE) --- */}
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute requiredRole="admin">
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/accommodation"
                                element={
                                    <ProtectedRoute requiredRole="admin">
                                        <AdminAccommodation />
                                    </ProtectedRoute>
                                }
                            />

                            {/* --- PUBLIC ROUTES --- */}
                            <Route path="/signin" element={<SignIn />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/results" element={<ResultsGallery />} />
                            <Route path="/accommodation" element={<Accomodation />} />
                            <Route path="/community" element={<UnderMaintenance />} />
                            <Route path="/expo" element={<UnderMaintenance />} />
                            <Route path="/raceday" element={<UnderMaintenance />} />
                            <Route path="/dashboard"element={<ProtectedRoute><UserDashboard /></ProtectedRoute>}/>
                            <Route path="/faqs" element={<Faqs />} />
                            <Route path="/privacy&policies" element={<PrivacyPolicy />} />
                            <Route
                                path="/payment-success"
                                element={
                                    <ProtectedRoute>
                                        <PaymentSuccessPage />
                                    </ProtectedRoute>
                                }
                            />

                        </Routes>
                    </main>

                    <Footer />

                </div>

            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;