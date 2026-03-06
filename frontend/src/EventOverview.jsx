// EventOverview.jsx (FINAL MINIMAL VERSION)
import React from "react";
// Removed unnecessary imports for unused icons and router hooks
import {
  LuCalendarDays,
  LuMapPin,
  LuUsers,
} from "react-icons/lu";

export default function EventOverview() {
  return (
    // Outer section is now minimal, relying on parent for background/padding
    <section>
      <div 
        className="
          max-w-7xl 
          mx-auto 
          px-6 /* Horizontal padding */
          w-full 
          flex 
          flex-col 
          gap-6
          py-16 /* Vertical padding to separate from elements above/below */
        "
      >

        {/* ===== Event Info Title ===== */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-800">
            Event Information
          </h2>
          <p className="text-slate-500 mt-1">
            Everything you need to know about LokRaja Marathon - Chapter Pune 2026
          </p>
        </div>

        {/* ===== Event Info Cards (4-Column Grid) ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6"> 
          <InfoCard
            icon={<LuCalendarDays />}
            title="Date"
            value="April 12, 2026"
          />
          <InfoCard
            icon={<LuMapPin />}
            title="Location"
            value="Savitribai Phule Pune University, Maharashtra"
          />
          <InfoCard
            icon={<LuUsers />}
            title="Expected Runners"
            value="1500+"
          />
          <InfoCard
            icon={<LuUsers />}
            title="Race Category"
            value="5K, 10K, 21K, 35K, 42K"
          />
        </div>

      </div>
    </section>
  );
}

/* ---------- Small reusable card (REMOVED REDUNDANT 'flex') ---------- */
function InfoCard({ icon, title, value }) {
  return (
    <div className="
      bg-white 
      border 
      border-slate-200 
      rounded-2xl 
      p-6 
      text-center 
      shadow-sm 
      
      /* Only one instance of flex is needed */
      flex-col 
      justify-between 
      h-full
      "
    >
      <div> 
        <div className="text-3xl text-teal-600 mb-2 flex justify-center">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-slate-500">{title}</h3>
      </div>
      
      <p className="text-lg font-bold text-slate-800 mt-2">{value}</p>
    </div>
  );
}