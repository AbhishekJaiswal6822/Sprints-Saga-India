// frontend\src\SignUp.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function SignUp() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };


    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        setLoading(true);

        if (password !== confirmPassword) {
            setErr("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            // Even if register automatically logs in, we redirect to signin for explicit flow control
            await register(name, email, password, phone);

            // FIX: Redirect to Sign In after successful registration
            //       alert("Registration successful! Please sign in now.");
            navigate("/");

        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen bg-gray-transparent flex items-center justify-center px-4 py-12 mt-12 mb-12">
            <form
                onSubmit={submit}
                className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 border border-slate-100 relative z-10"
            >
                <h2 className="text-3xl font-extrabold text-teal-700 mb-2">
                    Create Account
                </h2>
                <p className="text-slate-500 mb-8 text-sm">
                    Register now and be part of the LokRaja Marathon running community.
                </p>

                {/* Full Name */}
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name *
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                        // Allow only letters and spaces
                        const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                        setName(value);
                    }}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                />


                {/* Email Address */}
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address *
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                        // Remove spaces and force lowercase
                        const value = e.target.value.replace(/\s/g, "").toLowerCase();
                        setEmail(value);
                    }}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                />


                {/* Phone Number */}
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone Number *
                </label>
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                        // Allow only digits and max 10 characters
                        const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setPhone(value);
                    }}
                    placeholder="1234567890"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                />


                {/* Password Input */}
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Password *
                </label>
                <div className="relative mb-4">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                            // Prevent spaces in password
                            const value = e.target.value.replace(/\s/g, "");
                            setPassword(value);
                        }}
                        placeholder="Enter a password"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        required
                        minLength={6}
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-teal-700"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <AiOutlineEyeInvisible className="h-5 w-5" />
                        ) : (
                            <AiOutlineEye className="h-5 w-5" />
                        )}
                    </button>
                </div>


                {/* Confirm Password Input */}
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Confirm Password *
                </label>
                <div className="relative mb-6">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                            // Prevent spaces in confirm password
                            const value = e.target.value.replace(/\s/g, "");
                            setConfirmPassword(value);
                        }}
                        placeholder="Re-enter password"
                        className={`w-full px-4 py-2 border rounded-lg pr-10 shadow-sm focus:outline-none focus:ring-2 ${confirmPassword && confirmPassword !== password
                                ? "border-red-400 focus:ring-red-400"
                                : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"
                            }`}
                        required
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-teal-700"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <AiOutlineEyeInvisible className="h-5 w-5" />
                        ) : (
                            <AiOutlineEye className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {/* Error Message */}
                {err && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-300 mb-4">
                        <p className="text-red-700 text-sm font-medium">{err}</p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-xl text-white font-semibold shadow-lg transition duration-200 
                ${loading ? 'opacity-70 cursor-not-allowed bg-teal-500' : 'hover:shadow-teal-400/50 hover:opacity-90'}`}
                    style={{ background: "linear-gradient(90deg, #06b6d4, #14b8a6)" }}
                >
                    {loading ? "Creating Account..." : "Create Account"}
                </button>

                {/* Links */}
                <div className="text-center mt-6 text-sm space-y-2">
                    <p>
                        Already have an account?{" "}
                        <Link to="/signin" className="text-teal-600 font-bold hover:underline">
                            Sign in here
                        </Link>
                    </p>
                    <Link to="/" className="text-slate-500 hover:text-teal-600 font-medium transition duration-150">
                        ← Back to Home
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default SignUp;