import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Clock, MapPin, Activity, AlertTriangle, Info, Car, ShieldCheck } from 'lucide-react';

// --- 3D Background Element ---
function AnimatedBackground() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} color="#06b6d4" intensity={2} />
      <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[1, 100, 200]} scale={2.4}>
          <MeshDistortMaterial
            color="#e0f2f1"
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0}
            metalness={0.1}
            transparent
            opacity={0.6}
          />
        </Sphere>
      </Float>
    </>
  );
}

// --- Glassmorphic UI Panel ---
const LightGlassCard = ({ children, title, icon: Icon, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8, ease: "easeOut" }}
    className={`bg-white/80 backdrop-blur-2xl border border-white/50 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] ${className}`}
  >
    <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-3">
      {Icon && <Icon className="text-orange-500 w-5 h-5" />}
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{title}</h3>
    </div>
    {children}
  </motion.div>
);

export default function RaceDayPage() {
  const flagOffData = [
    { dist: "42 KM", assemble: "1:45 AM", flag: "2:00 AM", cut: "6.30 HRS", hydration: "Every 2 KM" },
    { dist: "35 KM", assemble: "1:45 AM", flag: "2:00 AM", cut: "5.30 HRS", hydration: "Every 2 KM" },
    { dist: "21 KM", assemble: "2:45 AM", flag: "3:00 AM", cut: "3.30 HRS", hydration: "Every 2 KM" },
    { dist: "10 KM", assemble: "3:45 AM", flag: "4:00 AM", cut: "1.45 HRS", hydration: "Every 2 KM" },
    { dist: "05 KM", assemble: "6:15 AM", flag: "6:30 AM", cut: "1 HR", hydration: "Every 2 KM" },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#f8fafc] text-slate-800 font-sans overflow-x-hidden pt-24 pb-12">
      
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Suspense fallback={null}>
            <AnimatedBackground />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* HEADER SECTION (Timer Removed) */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12">
          <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <div className="flex items-center gap-4 mb-2">
                <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded italic uppercase tracking-widest">Official Race Hub</span>
                <h1 className="text-7xl font-black italic tracking-tighter leading-none text-slate-900">
                LOK<span className="text-orange-500">RAJA</span>
                </h1>
            </div>
            <p className="text-cyan-600 text-lg font-bold tracking-[0.4em] pl-1 uppercase">Chapter Pune • Marathon 2026</p>
          </motion.div>
        </div>

        {/* MAIN DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: FLAG OFF SCHEDULE */}
          <div className="lg:col-span-8">
            <LightGlassCard title="Official Flag Off Schedule" icon={Clock}>
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white/50">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">
                      <th className="p-4">Distance</th>
                      <th className="p-4">Assemble Time</th>
                      <th className="p-4">Flag Off Time</th>
                      <th className="p-4">Cut Off Time</th>
                      <th className="p-4">Hydration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-base font-medium text-slate-700">
                    {flagOffData.map((row, i) => (
                      <motion.tr key={i} whileHover={{ backgroundColor: "rgba(255,255,255,0.8)" }} className="transition-colors group">
                        <td className="p-4 text-orange-600 font-black italic">{row.dist}</td>
                        <td className="p-4 font-mono text-slate-500">{row.assemble}</td>
                        <td className="p-4 font-mono text-slate-900 group-hover:text-cyan-600">{row.flag}</td>
                        <td className="p-4 font-mono text-slate-400">{row.cut}</td>
                        <td className="p-4 text-xs font-bold text-cyan-700 uppercase tracking-tighter">{row.hydration}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* LOCATION & GEAR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-5 bg-cyan-50 border border-cyan-100 rounded-2xl">
                    <h4 className="text-xs font-black text-cyan-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <MapPin size={16}/> Start & Finish Point
                    </h4>
                    <p className="text-sm font-bold text-slate-800 leading-tight">Shooting Range, Indoor Hall, Savitribai Phule Pune University</p>
                    <p className="text-xs text-cyan-600 mt-1 italic font-medium">Nearest Point: Beside University Ground</p>
                </div>
                <div className="p-5 bg-orange-50 border border-orange-100 rounded-2xl">
                    <h4 className="text-xs font-black text-orange-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <ShieldCheck size={16}/> Safety Requirement
                    </h4>
                    <p className="text-sm font-bold text-slate-800 uppercase leading-tight">Headtorch is Mandatory</p>
                    <p className="text-xs text-orange-600 mt-1 font-medium italic">Applies to 35K & 42K Runners only.</p>
                </div>
              </div>

              <div className="mt-4 p-5 bg-slate-900 rounded-2xl flex items-start gap-4">
                 <AlertTriangle className="text-orange-400 w-6 h-6 shrink-0" />
                 <div>
                    <p className="text-xs font-black text-white uppercase tracking-widest mb-1 underline decoration-orange-500 decoration-2 underline-offset-4">Important Race Note</p>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        Start times are scheduled considering Pune's early morning traffic. 
                        <strong> Runners must report 30 minutes before</strong> their respective flag-off times.
                    </p>
                 </div>
              </div>
            </LightGlassCard>
          </div>

          {/* RIGHT: ADVISORIES & PARKING */}
          <div className="lg:col-span-4 space-y-6">
            <LightGlassCard title="Participant Advisory" icon={Info} delay={0.2}>
              <div className="space-y-6">
                <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">1</span> BIB Collection Day
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-2 list-disc ml-8">
                        <li>Collect BIBs within <strong>allotted time slots</strong> to avoid crowding.</li>
                        <li>Carry <strong>Valid Photo ID</strong> and Registration Confirmation for verification.</li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">2</span> Race Day Travel
                    </h4>
                    <p className="text-xs text-slate-600 ml-8 leading-relaxed">
                        Plan travel for early starts. <strong>Road closures and diversions</strong> will be active during race hours.
                    </p>
                </div>
              </div>
            </LightGlassCard>

            <LightGlassCard title="Parking Enforcement" icon={Car} delay={0.4} className="bg-red-50/50 border-red-100">
              <div className="space-y-3">
                <span className="text-[10px] font-black text-red-600 bg-red-100 px-3 py-1 rounded-full uppercase tracking-widest">Mandatory Location</span>
                <p className="text-base font-black text-slate-900 uppercase">University Cricket Ground</p>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                    All vehicles <strong>must park here only</strong>. 
                </p>
                <div className="p-4 bg-red-600 rounded-2xl shadow-lg shadow-red-200">
                    <p className="text-xs font-bold text-white leading-tight">
                        Other parking areas are NOT allowed and are <span className="underline uppercase font-black">Punishable</span> by University Authorities.
                    </p>
                </div>
              </div>
            </LightGlassCard>
          </div>
        </div>

        {/* COMPREHENSIVE PARTNER FOOTER - INCREASED FONT SIZE */}
        <div className="mt-20 pt-12 border-t border-slate-200">
            <p className="text-center text-xs font-black text-slate-400 uppercase tracking-[0.5em] mb-12">Official Partners & Support</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 items-center opacity-90 transition-all duration-700">
                <div className="text-center group p-4 hover:bg-white hover:shadow-xl rounded-2xl transition-all">
                    <p className="text-2xl font-black text-slate-900 group-hover:text-cyan-600 tracking-tighter">TIMING</p>
                    <p className="text-xs font-bold text-slate-400 uppercase mt-1">Official Timing Partner</p>
                </div>
                <div className="text-center group p-4 hover:bg-white hover:shadow-xl rounded-2xl transition-all">
                    <p className="text-2xl font-black text-slate-900 group-hover:text-cyan-600 tracking-tighter">FITISTAN</p>
                    <p className="text-xs font-bold text-slate-400 uppercase mt-1">Community & Technology Partner</p>
                </div>
                <div className="text-center group p-4 hover:bg-white hover:shadow-xl rounded-2xl transition-all">
                    <p className="text-2xl font-black text-slate-900 group-hover:text-cyan-600 tracking-tighter">iFINISH</p>
                    <p className="text-xs font-bold text-slate-400 uppercase mt-1">Official Registration Partner</p>
                </div>
                <div className="text-center group p-4 hover:bg-white hover:shadow-xl rounded-2xl transition-all">
                    <p className="text-xl font-black text-slate-900 group-hover:text-cyan-600 tracking-tighter leading-none uppercase">Mediculture Foundation &<br/>Medico Marvels</p>
                    <p className="text-xs font-bold text-slate-400 uppercase mt-1">Physiotheraphy & Recovery Support Partner</p>
                </div>
                <div className="text-center group p-4 hover:bg-white hover:shadow-xl rounded-2xl transition-all">
                    <p className="text-2xl font-black text-slate-900 group-hover:text-cyan-600 tracking-tighter">KHAVTE HOSPITAL</p>
                    <p className="text-xs font-bold text-slate-400 uppercase mt-1">Hospital Partner</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}