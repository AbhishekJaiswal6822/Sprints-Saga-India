// src/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* ABOUT */}
          <div>
            <h1 className="text-white text-lg font-semibold mb-3">
              Sprints Saga India
            </h1>
            <p className="text-slate-400 leading-relaxed">
              The premium marathon event bringing together runners from around the world.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/register" className="hover:text-white hover:underline">Register</Link></li>
              <li><Link to="/results" className="hover:text-white hover:underline">Results</Link></li>
              <li><Link to="/accommodation" className="hover:text-white hover:underline">Accommodation</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-3">Contact Us</h4>

            <p className="text-sm text-slate-400 mb-4">
              (For any queries, support requests, or partnership opportunities, feel free to reach us below.)
            </p>

            <div className="space-y-4">

              {/* EMAIL */}
              <div>
                <h5 className="text-white font-medium mb-1">Email Us</h5>
                <p className="text-sm">info@sprintssagaindia.com</p>

                <h5 className="text-white font-medium mt-2 mb-1">
                  Bulk Registration
                </h5>
                <p className="text-sm">registration@sprintssagaindia.com</p>
              </div>

              {/* SOCIAL MEDIA */}
              <div>
                <h5 className="text-white font-medium mb-2">Social Media</h5>

                <div className="space-y-2">
                  <a
                    href="https://www.instagram.com/sprintssagaindia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-pink-500 active:text-pink-600 transition duration-300"
                  >
                    <FaInstagram size={18} />
                    <span className="text-sm">sprintssagaindia</span>
                  </a>

                  <a
                    href="https://www.facebook.com/SprintsSagaIndia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-blue-500 active:text-blue-600 transition duration-300"
                  >
                    <FaFacebookF size={16} />
                    <span className="text-sm">Sprints Saga India</span>
                  </a>
                </div>
              </div>

              {/* PHONE */}
              <div>
                <h5 className="text-white font-medium mb-2">Contact Number</h5>

                <div className="space-y-2 text-sm">
                  {/* <div className="flex items-center gap-3">
                    <FaPhoneAlt size={14} />
                    <span> +91 8850943813</span>
                  </div> */}

                  <div className="flex items-center gap-3">
                    <FaPhoneAlt size={14} />
                    <span>+91 9967707306</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaWhatsapp size={17} className="text-green-500" />
                    <span>+91 9987190415</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* FAQ */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-3">FAQs</h4>
            <p className="text-slate-400 text-sm">
              Need answers? Visit our FAQs for detailed information about registration,
              race rules, refunds, and more.
            </p>
            <Link to="/faqs" className="text-teal-400 hover:underline block mt-2">
              View FAQs
            </Link>
          </div>

          {/* POLICIES */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-3">
              Privacy & Policies
            </h4>
            <p className="text-slate-400 text-sm">
              Your trust matters. Read our Privacy Policy to understand how your
              information is collected, used, and safeguarded.
            </p>
            <Link
              to="/privacy&policies"
              className="text-teal-400 hover:underline block mt-2"
            >
              Privacy & Policies
            </Link>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="border-t border-slate-700 mt-10"></div>

        {/* COPYRIGHT */}
        <div className="mt-6 text-center text-slate-400">
          © {new Date().getFullYear()} Sprints Saga India. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;
