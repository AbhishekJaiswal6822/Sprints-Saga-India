// // C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\frontend\src\Sponsors.jsx
// import React from "react";
// import SportsRhinosLogo from "./assets/sponsor1.jpeg";
// import TimingPartner from "./assets/timing-partner.jpeg"
// import IFinish from "./assets/Ifinish-partner.webp"
// // import IFinishXTiming from "./assets/ifinishxtiming.png";
// import Fitistan from "./assets/fitistan.png";
// import MediCulture from "./assets/MEDICULTURE-Logo.jpeg"
// import MedicoMarvels from "./assets/medio-marvels.jpeg"

// const sponsors = [
//     { id: 1, src: SportsRhinosLogo, name: "Execute Partner", scale: "scale-100", hoverScale: "group-hover:scale-110" },
//     // I increased the base scale to 150 for a real "foreground" zoom
//     // { id: 2, src: IFinishXTiming, name: "Registration & Timing Partner", scale: "scale-125", hoverScale: "group-hover:scale-[1.5]" }, 
//     { id: 2, src: TimingPartner, name: "Timing Partner", scale: "scale-120", hoverScale: "group-hover:scale-[1.4]" },
//     { id: 3, src: Fitistan, name: "Community & Technology Partner", scale: "scale-110", hoverScale: "group-hover:scale-125" },
//     { id: 4, src: IFinish, name: "Registration Partner", scale: "scale-130", hoverScale: "group-hover:scale-[1.5]" },
//     { 
//         id: 5, 
//         isGroup: true,
//         logos: [MediCulture, MedicoMarvels],
//         name: "Physiotherapy & Recovery Support Partners", 
//         scale: "scale-110", 
//         hoverScale: "group-hover:scale-125" 
//     }
// ];

// function Sponsors() {
//     return (
//         <section className="py-16 md:py-24 bg-transparent overflow-hidden">
//             <div className="max-w-7xl mx-auto px-4 text-center">
//                 <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-12 md:mb-20 tracking-tight">
//                     Our Official Partners
//                 </h2>

//                 <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-6 gap-8 md:gap-12 max-w-7xl mx-auto items-start">
//                     {sponsors.map((sponsor) => (
//   <div key={sponsor.id} className="group flex flex-col items-center select-none">
//     <div className="relative p-0.5 rounded-4xl transition-all duration-500 group-hover:bg-linear-to-br group-hover:from-emerald-400 group-hover:to-cyan-400 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]">
//       <div className="relative w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 bg-white rounded-[1.9rem] flex items-center justify-center p-4 md:p-6 z-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out group-hover:translate-y-1 overflow-hidden">
        
//         {/* Conditional Logic for Multi-Logo or Single Logo */}
//         {sponsor.isGroup ? (
//           <div className="flex gap-2 items-center justify-center w-full h-full">
//             {sponsor.logos.map((logoSrc, index) => (
//               <img
//                 key={index}
//                 src={logoSrc}
//                 alt={sponsor.name}
//                 className={`relative z-20 w-1/2 h-full object-contain filter transition-transform duration-500 ${sponsor.scale} ${sponsor.hoverScale}`}
//               />
//             ))}
//           </div>
//         ) : (
//           <img
//             src={sponsor.src}
//             alt={sponsor.name}
//             className={`relative z-20 w-full h-full object-contain filter transition-transform duration-500 ${sponsor.scale} ${sponsor.hoverScale}`}
//           />
//         )}
//       </div>
//     </div>

//     {/* The Name (Now only appears once) */}
//     <div className="mt-6 md:mt-8 flex flex-col items-center text-center">
//       <p className="text-gray-800 font-extrabold text-xs sm:text-sm md:text-base leading-tight tracking-tight px-2 group-hover:text-emerald-600 transition-colors duration-300">
//         {sponsor.name}
//       </p>
//       <div className="h-1.5 w-0 bg-emerald-500 mt-2 rounded-full group-hover:w-12 md:group-hover:w-16 shadow-[0_2px_8px_rgba(16,185,129,0.4)] transition-all duration-500 ease-in-out" />
//     </div>
//   </div>
// ))}
//                 </div>
//             </div>
//         </section>
//     );
// }

// export default Sponsors;

import React from "react";
import SportsRhinosLogo from "./assets/sponsor1.jpeg";
import TimingPartner from "./assets/timing-partner.jpeg";
import IFinish from "./assets/Ifinish-partner.webp";
import Fitistan from "./assets/fitistan.png";
import MediCulture from "./assets/MEDICULTURE-Logo.jpeg";
import MedicoMarvels from "./assets/medio-marvels.jpeg";

const sponsors = [
  { id: 1, src: SportsRhinosLogo, name: "Execute Partner", scale: "scale-100", hoverScale: "group-hover:scale-110", span: "col-span-1" },
  { id: 2, src: TimingPartner, name: "Timing Partner", scale: "scale-120", hoverScale: "group-hover:scale-[1.4]", span: "col-span-1" },
  { id: 3, src: Fitistan, name: "Community & Technology Partner", scale: "scale-110", hoverScale: "group-hover:scale-125", span: "col-span-1" },
  { id: 4, src: IFinish, name: "Registration Partner", scale: "scale-130", hoverScale: "group-hover:scale-[1.5]", span: "col-span-1" },
  { 
    id: 5, 
    isGroup: true,
    logos: [MediCulture, MedicoMarvels],
    name: "Physiotherapy & Recovery Support Partners", 
    scale: "scale-110", 
    hoverScale: "group-hover:scale-125",
    span: "md:col-span-2 col-span-2" 
  }
];

function Sponsors() {
  return (
    <section className="py-16 md:py-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-12 md:mb-20 tracking-tight">
          Our Official Partners
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-6 gap-8 md:gap-12 max-w-7xl mx-auto items-start">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className={`group flex flex-col items-center select-none ${sponsor.span}`}>
              
              {/* Container for the Logos */}
              <div className="w-full">
                {sponsor.isGroup ? (
                  /* Sub-grid for Grouped Logos: Renders two separate white containers */
                  <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
                    {sponsor.logos.map((logoSrc, index) => (
                      <div key={index} className="relative p-0.5 rounded-4xl transition-all duration-500 group-hover:bg-linear-to-br group-hover:from-emerald-400 group-hover:to-cyan-400 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                        <div className="relative h-32 sm:h-40 md:h-48 bg-white rounded-[1.9rem] flex items-center justify-center p-3 md:p-6 z-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out group-hover:translate-y-1 overflow-hidden">
                          <img
                            src={logoSrc}
                            alt={sponsor.name}
                            className={`relative z-20 w-full h-full object-contain filter transition-transform duration-500 ${sponsor.scale} ${sponsor.hoverScale}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Single Logo Container */
                  <div className="relative p-0.5 rounded-4xl transition-all duration-500 group-hover:bg-linear-to-br group-hover:from-emerald-400 group-hover:to-cyan-400 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                    <div className="relative h-40 sm:h-44 md:h-48 bg-white rounded-[1.9rem] flex items-center justify-center p-4 md:p-6 z-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out group-hover:translate-y-1 overflow-hidden">
                      <img
                        src={sponsor.src}
                        alt={sponsor.name}
                        className={`relative z-20 w-full h-full object-contain filter transition-transform duration-500 ${sponsor.scale} ${sponsor.hoverScale}`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Shared Name Label */}
              <div className="mt-6 md:mt-8 flex flex-col items-center text-center">
                <p className="text-gray-800 font-extrabold text-xs sm:text-sm md:text-base leading-tight tracking-tight px-2 group-hover:text-emerald-600 transition-colors duration-300">
                  {sponsor.name}
                </p>
                <div className="h-1.5 w-0 bg-emerald-500 mt-2 rounded-full group-hover:w-12 md:group-hover:w-24 shadow-[0_2px_8px_rgba(16,185,129,0.4)] transition-all duration-500 ease-in-out" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Sponsors;