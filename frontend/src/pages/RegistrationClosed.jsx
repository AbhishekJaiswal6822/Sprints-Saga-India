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
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#f8fafc] overflow-hidden">
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
              className="bg-orange-500 p-6 rounded-[2rem] shadow-2xl shadow-orange-200"
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
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Portal Status: Closed</span>
            </div>
            
            {/* Reduced mb-6 to mb-3 */}
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-3">
              Registration Closed on <br />
              <span className="text-orange-500">Sprints Saga India</span>
            </h1>
          </motion.div>

          {/* Reduced space-y-8 to space-y-4 */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="bg-slate-50/50 border border-slate-100 rounded-[1.5rem] p-5 relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="text-lg font-bold text-slate-800 mb-1">
                  Participate in <span className="text-orange-600">LokRaja Marathon 2026</span>
                </h2>
                {/* Reduced mb-6 to mb-4 */}
                <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                  Direct slots are full, but you can still secure your spot through **IndiaRunning**.
                </p>

                <motion.a
                  href="https://www.indiarunning.com/app/event?eventSlug=lokraja_marathon_2026__chapter_pune_62632"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  /* Reduced p-5 to p-4 */
                  className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Register via IndiaRunning</p>
                      <p className="text-[11px] text-orange-500 font-bold italic uppercase">Ends 10:00 PM Today!</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-orange-500" />
                </motion.a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium italic">
              <Info className="w-3 h-3" />
              Entries are limited. Grab your spot before the deadline.
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] drop-shadow-sm">
        LokRaja Marathon 2026 • Official Announcement
      </div>
    </div>
  );
};

export default RegistrationClosed;