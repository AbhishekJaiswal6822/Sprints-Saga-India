// src/UnderMaintenance.jsx
import React from "react";
import { FiTool, FiClock } from "react-icons/fi";

function UnderMaintenance() {
  return (
    <main className="min-h-screen bg-transparent flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-lg p-8 text-center">

        {/* Icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-cyan-100 flex items-center justify-center">
            <FiTool className="text-teal-700" size={45} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-teal-700 mb-3">
          Coming Soon
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 text-sm leading-relaxed">
          We're currently working hard to bring this section live soon.
          <br />
          Thank you for your patience!
        </p>

        {/* ETA box */}
        <div className="bg-slate-100 rounded-2xl border border-slate-200 p-4 mt-6 flex items-center gap-3 justify-center">
          <FiClock className="text-teal-600" size={20} />
          <span className="text-slate-700 text-sm font-medium">
            Expected Launch: Coming Soon
          </span>
        </div>

        {/* Footer note */}
        <p className="text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} Sprints Saga India — All rights reserved.
        </p>
      </div>
    </main>
  );
}

export default UnderMaintenance;
