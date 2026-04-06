import React from 'react';
import { motion } from 'framer-motion';
import { Timer, ExternalLink, ArrowRight, Trophy, Info } from 'lucide-react';

const RegistrationClosed = () => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 py-12 pb-28 md:p-8 bg-[#f8fafc] overflow-hidden">
      {/* Soft Decorative Blurs */}
      <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-orange-100/40 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-blue-100/30 blur-[100px]" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        /* Reduced p-8/p-12 to py-6/px-8/md:py-8/md:px-12 to compress height */
        className="relative z-10 max-w-5xl w-full bg-white/90 backdrop-blur-3xl border border-white rounded-[3rem] py-6 px-8 md:py-8 md:px-12 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center gap-8 md:gap-12"
      >
        {/* Left Visual Area */}
        <motion.div variants={itemVariants} className="md:w-1/3 flex justify-center">
          <div className="relative">
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              /* Reduced p-8 to p-6 */
              className="bg-orange-500 p-6 rounded-4xl shadow-2xl shadow-orange-200"
            >
              <Trophy className="w-16 h-16 text-white" />
            </motion.div>
            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-slate-50">
              <Timer className="w-5 h-5 text-orange-500" />
            </div>
          </div>
        </motion.div>

        {/* Right Content Area */}
        <div className="md:w-2/3 text-center md:text-left">
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Portal Status: Registration Closed</span>
            </div>
            
            {/* Reduced mb-6 to mb-3 */}
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-3">
              Registration Closed on <br />
              <span className="text-orange-500">Sprints Saga India</span>
            </h1>
          </motion.div>

          {/* Reduced space-y-8 to space-y-4 */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-2 uppercase tracking-tight italic">
                  The Countdown <span className="text-orange-600">Begins!</span>
                </h2>
                
                <p className="text-slate-600 text-sm mb-5 leading-relaxed font-medium">
                  We are officially sold out! Now, it's time to lace up, hit the track, and prepare for the ultimate test of endurance and spirit at the <strong className="text-slate-900">LokRaja Marathon 2026</strong>.
                </p>

                {/* Excitement / Date Badge replacing the external link */}
                <div className="flex items-center bg-white border border-orange-100 p-4 rounded-xl shadow-sm relative overflow-hidden">
                  {/* Decorative background flair */}
                  <div className="absolute right-0 top-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl transform translate-x-1/2 -translate-y-1/2" />
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="flex flex-col items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-md text-white border border-orange-300/50">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-90 mt-1">Apr</span>
                      <span className="text-2xl font-black leading-none mb-1">12</span>
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-lg uppercase italic tracking-wide">Race Day 2026</p>
                      <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">Savitribai Phule Pune University, Maharashtra</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-slate-500 text-xs font-bold italic px-2">
              <Info className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <p>Train hard, rest well, and get ready. We can't wait to see you at the start line!</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 md:bottom-8 left-0 w-full px-4 text-center text-[9px] md:text-[10px] font-black text-slate-700 uppercase tracking-widest md:tracking-[0.5em] drop-shadow-sm leading-relaxed">
        LokRaja Marathon 2026 <span className="hidden sm:inline">•</span><br className="sm:hidden" /> Official Announcement
      </div>
    </div>
  );
};

export default RegistrationClosed;