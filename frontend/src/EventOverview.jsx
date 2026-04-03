import React from "react";
import {
  LuCalendarDays,
  LuMapPin,
  LuUsers,
} from "react-icons/lu";

export default function EventOverview() {
  return (
    <section>
      <div
        className="
          max-w-7xl 
          mx-auto 
          px-6 
          w-full 
          flex 
          flex-col 
          gap-6
          py-16 
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
            link="https://www.google.com/maps/search/?api=1&query=Pune+University+Sports+Grounds"
          />
          <InfoCard
            icon={<LuUsers />}
            title="Expected Runners"
            value="500+"
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

/* ---------- Reusable card with Link support ---------- */
function InfoCard({ icon, title, value, link }) {
  return (
    <div className="
      bg-white 
      border 
      border-slate-200 
      rounded-2xl 
      p-6 
      text-center 
      shadow-sm 
      flex 
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

      {/* IF A LINK IS PROVIDED, RENDER AN ANCHOR TAG; OTHERWISE RENDER TEXT */}
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-bold text-teal-600 hover:text-teal-700 underline decoration-teal-200 underline-offset-4 mt-2 transition-colors"
        >
          {value}
        </a>
      ) : (
        <p className="text-lg font-bold text-slate-800 mt-2">{value}</p>
      )}
    </div>
  );
}