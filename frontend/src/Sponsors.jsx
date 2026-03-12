// // C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\frontend\src\Sponsors.jsx
import SportsRhinosLogo from "./assets/sponsor1.jpeg";
import TimingPartner from "./assets/timing-partner.jpeg";
import IFinish from "./assets/Ifinish-partner.webp";
import Fitistan from "./assets/fitistan.png";
import MediCulture from "./assets/MEDICULTURE-Logo.jpeg";
import MedicoMarvels from "./assets/medio-marvels.jpeg";
import KhavteHospital from "./assets/khavte-hospital-logo.png"

const sponsors = [
  { id: 1, src: SportsRhinosLogo, name: "Execute \n Partner", scale: "scale-100", hoverScale: "group-hover:scale-110", span: "col-span-1" },
  { id: 2, src: TimingPartner, name: "Timing \n Partner", scale: "scale-120", hoverScale: "group-hover:scale-[1.4]", span: "col-span-1" },
  { id: 3, src: Fitistan, name: "Community & \n Technology Partner", scale: "scale-110", hoverScale: "group-hover:scale-125", span: "col-span-1" },
  { id: 4, src: IFinish, name: "Registration \n Partner", scale: "scale-130", hoverScale: "group-hover:scale-[1.5]", span: "col-span-1" },
  { id: 6, src: KhavteHospital, name: "Official Hospital \n Partner", scale: "scale-[2.8]", hoverScale: "group-hover:scale-[3.2]", span: "col-span-1" },
  { 
    id: 5, 
    isGroup: true, 
    logos: [MediCulture, MedicoMarvels], 
    name: "Physiotherapy & Recovery \n Support Partners", 
    scale: "scale-110", 
    hoverScale: "group-hover:scale-125", 
    span: "md:col-span-2 col-start-1 md:col-start-2" // This centers the group on the second row
  }
];

function Sponsors() {
  return (
    <section className="py-16 md:py-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-12 md:mb-20 tracking-tight">
          Our Official Partners
        </h2>

        {/* CHANGED: grid-cols-7 to grid-cols-5 to use side space and increase height */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-14 max-w-full mx-auto items-start justify-center">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className={`group flex flex-col items-center select-none ${sponsor.span}`}>
              
              <div className="w-full">
                {sponsor.isGroup ? (
                  <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
                    {sponsor.logos.map((logoSrc, index) => (
                      <div key={index} className="relative p-0.5 rounded-4xl transition-all duration-500 group-hover:bg-linear-to-br group-hover:from-emerald-400 group-hover:to-cyan-400 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                        {/* aspect-square ensures that as width grows, height grows too */}
                        <div className="relative w-full aspect-square bg-white rounded-[1.9rem] flex items-center justify-center p-3 md:p-5 z-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out group-hover:translate-y-1 overflow-hidden"> 
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
                  <div className="relative p-0.5 rounded-4xl transition-all duration-500 group-hover:bg-linear-to-br group-hover:from-emerald-400 group-hover:to-cyan-400 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                    <div className="relative w-full aspect-square bg-white rounded-[1.9rem] flex items-center justify-center p-4 md:p-8 z-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out group-hover:translate-y-1 overflow-hidden">
                      <img
                        src={sponsor.src}
                        alt={sponsor.name}
                        className={`relative z-20 w-full h-full object-contain filter transition-transform duration-500 ${sponsor.scale} ${sponsor.hoverScale}`}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 md:mt-8 flex flex-col items-center text-center">
                <p className="whitespace-pre-line text-gray-800 font-extrabold text-xs sm:text-sm md:text-base leading-tight tracking-tight px-2 group-hover:text-emerald-600 transition-colors duration-300">
                  {sponsor.name}
                </p>
                <div className="h-1.5 w-0 bg-emerald-500 mt-2 rounded-full group-hover:w-16 md:group-hover:w-24 shadow-[0_2px_8px_rgba(16,185,129,0.4)] transition-all duration-500 ease-in-out" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}