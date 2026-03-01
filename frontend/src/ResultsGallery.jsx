// ResultsGallery.jsx
import React, { useState } from "react";
import { FiSearch, FiCamera } from "react-icons/fi";

function ResultsGallery() {
  const [bibNumber, setBibNumber] = useState("");

  const topPerformers = [
    { rank: 1, name: "Sarah Connor", category: "Full Marathon", time: "2:28:15" },
    { rank: 2, name: "Mike Johnson", category: "Full Marathon", time: "2:31:42" },
    { rank: 3, name: "Emma Watson", category: "Full Marathon", time: "2:35:18" },
  ];

  const galleryItems = Array(8).fill(null); // Empty placeholders

  return (
    <main className="min-h-screen bg-transparent pb-20">
      {/* Header */}
      <section className="text-center py-12 mt-10">
        <h1 className="text-4xl font-extrabold text-teal-700 mb-3">
          Race Results & Gallery
        </h1>
        <p className="text-slate-500 text-lg">
          Find your results, download certificates, and view race photos
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-4 space-y-12">
        
        {/* FIND YOUR RESULTS */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2">
            <FiSearch className="text-teal-600 text-xl" />
            <h2 className="text-xl font-semibold text-slate-900">Find Your Results</h2>
          </div>
          <p className="text-slate-500 mt-1">
            Enter your bib number to view your race results and photos
          </p>

          <div className="mt-6 flex gap-3">
            <input
              type="text"
              value={bibNumber}
              onChange={(e) => setBibNumber(e.target.value)}
              placeholder="Enter bib number"
              className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-slate-700 
                    focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <button className="flex items-center gap-2 bg-teal-700 px-6 py-3 rounded-xl text-white font-semibold 
                    hover:bg-teal-800">
              <FiSearch />
              Search
            </button>
          </div>
        </div>

        {/* TOP PERFORMERS */}
        {/* <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl text-teal-600">🏅</span>
            <h2 className="text-xl font-semibold text-slate-900">Top Performers</h2>
          </div>
          <p className="text-slate-500 mb-6">
            Congratulations to our race winners!
          </p>

          <div className="space-y-4">
            {topPerformers.map((runner) => (
              <div
                key={runner.rank}
                className="flex items-center justify-between bg-slate-50 px-5 py-4 rounded-2xl border 
                  border-slate-200"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-linear-to-br from-teal-500 to-cyan-500 
                      text-white flex items-center justify-center font-bold">
                    {runner.rank}
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">{runner.name}</p>
                    <p className="text-slate-500 text-sm">{runner.category}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">{runner.time}</p>
                  <span className="px-3 py-1 text-xs text-white bg-teal-700 rounded-full inline-block mt-1">
                    {runner.rank === 1 ? "Winner" : `#${runner.rank}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* PHOTO GALLERY */}
        {/* <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200"> */}
          {/* <div className="flex items-center gap-2 mb-1">
            <FiCamera className="text-teal-600 text-xl" />
            <h2 className="text-xl font-semibold text-slate-900">Race Photo Gallery</h2>
          </div>
          <p className="text-slate-500 mb-6">
            Professional race photos available for download
          </p> */}

          {/* Photo Grid */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryItems.map((_, idx) => (
              <div
                key={idx}
                className="h-40 bg-slate-100 rounded-2xl flex items-center justify-center"
              >
                <FiCamera className="text-slate-400 text-3xl" />
              </div>
            ))}
          </div> */}

          {/* View All Photos Button */}
          {/* <div className="mt-8 text-center">
            <button className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold 
                    bg-white hover:bg-slate-100">
              View All Photos
            </button>
          </div> */}
        </div>

      {/* </div> */}
    </main>
  );
}

export default ResultsGallery;
