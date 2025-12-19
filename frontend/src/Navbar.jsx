// // 



// // modified 
import React, { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { AiOutlineClose } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import logo from "./assets/logo.jpg";
import logobg from './assets/logo-Picsart-BackgroundRemover.jpg'

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const path = location.pathname;
  let activeKey = null;
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
    { key: "admin", label: "Admin", to: "/admin" },
  ];

  const toggle = () => setOpen((v) => !v);
  const closeMenu = () => setOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur shadow-sm">

      <div className="max-w-7xl mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">

          {/* Logo */}
          <Link to="/" onClick={closeMenu} className="shrink-0">
            <img
            // src={logo}
              src={logobg}
              alt="Sprints Saga India"
              className="h-14 w-auto object-contain"
              draggable={false}
            />
          </Link>

          {/* Center title (mobile) / nav (desktop) */}
          <div className="flex-1 flex justify-center">
            <h1 className="md:hidden font-extrabold text-lg text-slate-800">
              Sprints Saga India
            </h1>

            <nav className="hidden lg:flex">
              <ul className="flex gap-3">
                {links.map(({ key, label, to }) => (
                  <li key={key}>
                    <Link
                      to={to}
                      className={`px-4 py-2 rounded-full text-sm transition ${
                        key === activeKey
                          ? "bg-teal-600 text-white"
                          : "text-slate-700 hover:bg-teal-600 hover:text-white"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex gap-3">
              <Link
                to="/signin"
                className="px-4 py-1.5 rounded-lg border text-sm"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 rounded-lg text-white text-sm"
                style={{ background: "linear-gradient(90deg,#05c6d7,#0c9aa3)" }}
              >
                Sign Up
              </Link>
            </div>

            <button
              onClick={toggle}
              className="lg:hidden text-2xl p-2"
              aria-label="Menu"
            >
              {open ? <AiOutlineClose /> : <CiMenuBurger />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {/* {open && (
        <div className="lg:hidden border-t bg-white">
          <ul className="px-4 py-4 space-y-2">
            {links.map(({ key, label, to }) => (
              <li key={key}>
                <Link
                  to={to}
                  onClick={closeMenu}
                  className="block px-3 py-2 rounded-md hover:bg-slate-100"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )} */}
      {/* Mobile menu */}
{open && (
  <div className="lg:hidden border-t bg-white">
    <ul className="px-4 py-4 space-y-2">

      {/* Navigation links */}
      {links.map(({ key, label, to }) => (
        <li key={key}>
          <Link
            to={to}
            onClick={closeMenu}
            className="block px-3 py-2 rounded-md hover:bg-slate-100"
          >
            {label}
          </Link>
        </li>
      ))}

      {/* Divider */}
      <li className="pt-3">
        <hr />
      </li>

      {/* ✅ Auth buttons (mobile only) */}
      <li>
        <Link
          to="/signin"
          onClick={closeMenu}
          className="block text-center px-4 py-2 rounded-lg border text-slate-700"
        >
          Login 
        </Link>
      </li>

      <li>
        <Link
          to="/signup"
          onClick={closeMenu}
          className="block text-center px-4 py-2 rounded-lg text-white"
          style={{ background: "linear-gradient(90deg,#05c6d7,#0c9aa3)" }}
        >
          Sign Up
        </Link>
      </li>

    </ul>
  </div>
)}

    </header>
  );
}

export default Navbar;


