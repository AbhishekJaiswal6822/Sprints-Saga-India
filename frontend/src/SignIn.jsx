
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; 

function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      // The login function returns { success: boolean, message: string }
      const result = await login(email, password);

      if (result.success) {
        // FIX: Successful login redirects directly to the protected registration page
        navigate("/"); 
      } else {
        // Failure: Analyze the error message
        const errorMessage = result.message || "Login failed. Please check your credentials.";

        // 🛑 CRITICAL FIX: Check for keywords indicating account non-existence (backend dependent)
        if (
            errorMessage.toLowerCase().includes("user not found") || 
            errorMessage.toLowerCase().includes("invalid credentials") ||
            errorMessage.toLowerCase().includes("account not found")
        ) {
            // FORCED SIGN UP REDIRECTION
            setErr("Account not found. You must sign up first.");
            setTimeout(() => {
                navigate("/signup"); 
            }, 1500); 
        } else {
            setErr(errorMessage);
        }
      }
    } catch (e) {
      setErr(e.message || "An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-slate-200 relative z-10"
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Log in to your Account</h2>
        <p className="text-slate-500 mb-6">Access the marathon registration system.</p>

        {/* Email Input */}
        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="john@example.com"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
          required
        />

        {/* Password Input with Toggle Icon */}
        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
        <div className="relative mb-6">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent pr-10"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible className="h-5 w-5" />
            ) : (
              <AiOutlineEye className="h-5 w-5" />
            )}
          </button>
        </div>


        {err && <div className="text-red-500 mb-3 text-sm">{err}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg text-white font-semibold cursor-pointer shadow-md transition duration-150 ease-in-out"
          style={{ background: "linear-gradient(90deg,#05c6d7,#0c9aa3)", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Signing in..." : "Log In with Email"}
        </button>

        <div className="text-center mt-6 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-teal-600 font-medium hover:underline">
            Sign up here
          </Link>
        </div>

        <div className="text-center mt-3 text-sm">
          <Link to="/" className="text-teal-500 hover:text-teal-600">
            Back to Home
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignIn;