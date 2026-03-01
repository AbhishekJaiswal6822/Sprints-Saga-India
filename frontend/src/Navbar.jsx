import React, { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { AiOutlineClose } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import logobg from './assets/logo-Picsart-BackgroundRemover.jpg'
import { useAuth } from "./AuthProvider";

function Navbar() {
  const { user, logout } = useAuth(); // Get user and logout function
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // For redirecting after logout

  const ADMIN_EMAIL = "admin@sprintssagaindia.com";

  const path = location.pathname;
  let activeKey = null;
  // ... (Your existing activeKey logic stays the same)
  if (path === "/") activeKey = "home";
  else if (path.startsWith("/register")) activeKey = "register";
  else if (path.startsWith("/community")) activeKey = "community";
  else if (path.startsWith("/expo")) activeKey = "expo";
  else if (path.startsWith("/raceday")) activeKey = "raceday";
  else if (path.startsWith("/results")) activeKey = "results";
  else if (path.startsWith("/dashboard")) activeKey = "dashboard";
  else if (path.startsWith("/admin")) activeKey = "admin";

  const links = [
    { key: "home", label: "Home", to: "/" },
    { key: "register", label: "Register", to: "/register" },
    { key: "community", label: "Community", to: "/community" },
    { key: "expo", label: "Expo Management", to: "/expo" },
    { key: "raceday", label: "Race Day", to: "/raceday" },
    { key: "results", label: "Results & Gallery", to: "/results" },
    { key: "dashboard", label: "Dashboard", to: "/dashboard" },
  ];

  if (user?.isLoggedIn && user?.email === ADMIN_EMAIL) {
    links.push({ key: "admin", label: "Admin", to: "/admin" });
  }

  const toggle = () => setOpen((v) => !v);
  const closeMenu = () => setOpen(false);

  // Logout Handler
  const handleLogout = () => {
    logout(); // This should clear localStorage and reset user state
    closeMenu();
    navigate("/"); // Redirect to home
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/100 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" onClick={closeMenu} className="shrink-0">
            <img src={logobg} alt="Sprints Saga India" className="h-14 w-auto object-contain" draggable={false} />
          </Link>

          {/* Navigation (Desktop) */}
          <div className="flex-1 flex justify-center">
            <nav className="hidden lg:flex h-full">
              <ul className="flex items-center gap-1">
                {links.map(({ key, label, to }) => (
                  <li key={key} className="group relative flex items-center h-16 px-1">
                    <Link
                      to={to}
                      className={`
              relative z-10 px-5 py-2 rounded-full text-[14px] font-bold tracking-tight
              transition-all duration-300 ease-in-out
              ${key === activeKey
                          ? "bg-teal-600 text-white shadow-[0_10px_20px_-10px_rgba(13,148,136,1)]"
                          : "text-slate-700 hover:text-teal-700 group-hover:-translate-y-1"
                        }
            `}
                    >
                      {label}

                      {/* DARKER HOVER BLOOM: Uses 20% opacity of the solid Teal-500 */}
                      {key !== activeKey && (
                        <span className="absolute inset-0 rounded-full bg-teal-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10 shadow-sm border border-teal-500/10" />
                      )}
                    </Link>

                    {/* Premium Animated Underline Indicator */}
                    <div className="absolute inset-x-0 bottom-2 flex justify-center pointer-events-none">
                      <div
                        className={`
                h-[3px] rounded-full bg-teal-500 transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]
                ${key === activeKey
                            ? "w-6 opacity-100 shadow-[0_0_10px_rgba(13,148,136,0.8)]"
                            : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 shadow-[0_0_8px_rgba(13,148,136,0.4)]"
                          }
              `}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right buttons (Desktop) */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex gap-3 items-center">
              {user?.isLoggedIn ? (
                // --- LOGOUT BUTTON (Premium Hover Style) ---
                <button
                  onClick={handleLogout}
                  className="group relative px-5 py-2 rounded-full border border-red-200 text-red-600 text-sm font-bold transition-all duration-300 hover:border-red-400 hover:-translate-y-0.5 active:scale-95"
                >
                  <span className="relative z-10">Logout</span>
                  {/* Bloom Effect */}
                  <span className="absolute inset-0 rounded-full bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
                </button>
              ) :
                (
                  // --- LOGIN/SIGNUP BUTTONS (Premium Modern Style) ---
                  <>
                    {/* Login Button */}
                    <Link
                      to="/signin"
                      className="group relative px-6 py-2 rounded-full border border-slate-200 text-slate-700 text-sm font-bold transition-all duration-300 hover:border-teal-400 hover:text-teal-600 hover:-translate-y-0.5 active:scale-95"
                    >
                      <span className="relative z-10">Login</span>
                      {/* Glass Bloom */}
                      <span className="absolute inset-0 rounded-full bg-teal-50/50 scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 z-0" />
                    </Link>

                    {/* Sign Up Button (Soft Shadow + Glow) */}
                    <Link
                      to="/signup"
                      className="group relative px-6 py-2 rounded-full text-white text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 active:scale-95 shadow-[0_4px_12px_rgba(5,198,215,0.3)] hover:shadow-[0_8px_20px_rgba(5,198,215,0.5)]"
                      style={{ background: "linear-gradient(90deg,#05c6d7,#0c9aa3)" }}
                    >
                      <span className="relative z-10">Sign Up</span>
                      {/* Inner Light Overlay */}
                      <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  </>
                )}
            </div>

            <button onClick={toggle} className="lg:hidden text-2xl p-2 transition-transform active:scale-90" aria-label="Menu">
              {open ? <AiOutlineClose /> : <CiMenuBurger />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden border-t bg-white/80 backdrop-blur-lg animate-in slide-in-from-top duration-300">
          <ul className="px-4 py-4 space-y-2">
            {links.map(({ key, label, to }) => (
              <li key={key}>
                <Link to={to} onClick={closeMenu} className="block px-3 py-2 rounded-md hover:bg-slate-100">
                  {label}
                </Link>
              </li>
            ))}

            <li className="pt-3"><hr /></li>

            {user?.isLoggedIn ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-center px-4 py-2 rounded-lg border border-red-200 text-red-600 font-medium"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/signin" onClick={closeMenu} className="block text-center px-4 py-2 rounded-lg border text-slate-700">Login</Link>
                </li>
                <li>
                  <Link to="/signup" onClick={closeMenu} className="block text-center px-4 py-2 rounded-lg text-white" style={{ background: "linear-gradient(90deg,#05c6d7,#0c9aa3)" }}>Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Navbar;