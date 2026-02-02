// // C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\frontend\src\Sponsors.jsx
import React from "react";
import SportsRhinosLogo from "./assets/sponsor1.jpeg";
import IFinishXTiming from "./assets/ifinishxtiming.png";
import Fitistan from "./assets/fitistan.png";

const sponsors = [
    { id: 1, src: SportsRhinosLogo, name: "Execute Partner" },
    { id: 2, src: IFinishXTiming, name: "Registration & Timing Partner" },
    { id: 3, src: Fitistan, name: "Community & Technology Partner" },
];

function Sponsors() {
    return (
        <section className="py-16 md:py-24 bg-[#fcfcfc] overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 text-center">
                {/* Responsive Heading */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-12 md:mb-20 tracking-tight">
                    Our Official Partners
                </h2>

                {/* Responsive Grid: 1 col on mobile, 2 on small tablets, 3 on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto items-start">
                    {sponsors.map((sponsor) => (
                        <div key={sponsor.id} className="group flex flex-col items-center select-none">
                            
                            {/* The "Glow Container" - Triggers on Desktop Hover & Mobile Tap */}
                            <div className="relative p-0.5 rounded-4xl transition-all duration-500 
                                            group-hover:bg-linear-to-br group-hover:from-emerald-400 group-hover:to-cyan-400 
                                            group-active:bg-linear-to-br group-active:from-emerald-400 group-active:to-cyan-400 
                                            group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                                
                                {/* Responsive Card Body */}
                                <div
                                    className="relative w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 bg-white rounded-[1.9rem] 
                                               flex items-center justify-center p-4 md:p-6 z-10
                                               shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] 
                                               transition-all duration-500 ease-out
                                               group-hover:translate-y-1 group-active:translate-y-1
                                               group-active:scale-95"
                                >
                                    {/* Subsurface Light Effect */}
                                    <div className="absolute inset-0 rounded-[1.9rem] bg-linear-to-tr from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500" />

                                    <img
                                        src={sponsor.src}
                                        alt={sponsor.name}
                                        className="relative z-20 w-full h-full object-contain filter group-hover:scale-110 group-active:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            </div>

                            {/* Text Label Section */}
                            <div className="mt-6 md:mt-8 flex flex-col items-center">
                                <p className="text-gray-800 font-extrabold text-xs sm:text-sm md:text-base leading-tight tracking-tight px-2 
                                              group-hover:text-emerald-600 group-active:text-emerald-600 transition-colors duration-300">
                                    {sponsor.name}
                                </p>
                                
                                {/* High-Visibility Underline */}
                                <div className="h-1.5 w-0 bg-emerald-500 mt-2 rounded-full 
                                                group-hover:w-12 md:group-hover:w-16 
                                                group-active:w-12 shadow-[0_2px_8px_rgba(16,185,129,0.4)]
                                                transition-all duration-500 ease-in-out" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Sponsors;