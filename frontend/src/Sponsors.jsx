// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\frontend\src\Sponsors.jsx
import React from "react";
import SportsRhinosLogo from "./assets/sponsor1.jpeg";
import TimingPartner from "./assets/timing-partner.jpeg"
import IFinish from "./assets/Ifinish-partner.webp"
// import IFinishXTiming from "./assets/ifinishxtiming.png";
import Fitistan from "./assets/fitistan.png";

const sponsors = [
    { id: 1, src: SportsRhinosLogo, name: "Execute Partner", scale: "scale-100", hoverScale: "group-hover:scale-110" },
    // I increased the base scale to 150 for a real "foreground" zoom
    // { id: 2, src: IFinishXTiming, name: "Registration & Timing Partner", scale: "scale-125", hoverScale: "group-hover:scale-[1.5]" }, 
    { id: 2, src: TimingPartner, name: "Timing Partner", scale: "scale-120", hoverScale: "group-hover:scale-[1.4]" },
    { id: 3, src: Fitistan, name: "Community & Technology Partner", scale: "scale-110", hoverScale: "group-hover:scale-125" },
    { id: 4, src: IFinish, name: "Registration Partner", scale: "scale-130", hoverScale: "group-hover:scale-[1.5]" }
];

function Sponsors() {
    return (
        <section className="py-16 md:py-24 bg-transparent overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-12 md:mb-20 tracking-tight">
                    Our Official Partners
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-7xl mx-auto items-start">
                    {sponsors.map((sponsor) => (
                        <div key={sponsor.id} className="group flex flex-col items-center select-none">

                            <div className="relative p-0.5 rounded-4xl transition-all duration-500 
                                            group-hover:bg-linear-to-br group-hover:from-emerald-400 group-hover:to-cyan-400 
                                            group-active:bg-linear-to-br group-active:from-emerald-400 group-active:to-cyan-400 
                                            group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]">

                                <div
                                    className="relative w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 bg-white rounded-[1.9rem] 
                                               flex items-center justify-center p-4 md:p-6 z-10
                                               shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] 
                                               transition-all duration-500 ease-out
                                               group-hover:translate-y-1 group-active:translate-y-1
                                               group-active:scale-95
                                               overflow-hidden" // Added this to prevent spilling
                                >
                                    <div className="absolute inset-0 rounded-[1.9rem] bg-linear-to-tr from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500" />

                                    <img
                                        src={sponsor.src}
                                        alt={sponsor.name}
                                        className={`relative z-20 w-full h-full object-contain filter transition-transform duration-500 ${sponsor.scale} ${sponsor.hoverScale} group-active:scale-110`}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 md:mt-8 flex flex-col items-center">
                                <p className="text-gray-800 font-extrabold text-xs sm:text-sm md:text-base leading-tight tracking-tight px-2 
                                              group-hover:text-emerald-600 group-active:text-emerald-600 transition-colors duration-300">
                                    {sponsor.name}
                                </p>

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