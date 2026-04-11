import { motion, useScroll, useTransform } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Trophy,
  Shirt,
  Award,
  Coffee,
  FileText,
  Gift,
  Droplets,
  Ambulance,
  Flashlight,
  CreditCard,
  Users,
  Car,
  Zap,
  Heart,
  Star,
  TrendingUp,
} from "lucide-react";


const RaceDay = () => {
  // 1. Hooks and data declarations go here
  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const scheduleData = [
    { distance: "42 KM", assemble: "1:45 AM", flagOff: "2:00 AM", cutOff: "6.30 HRS", icon: Trophy },
    { distance: "35 KM", assemble: "1:45 AM", flagOff: "2:00 AM", cutOff: "5.30 HRS", icon: Star },
    { distance: "21 KM", assemble: "2:45 AM", flagOff: "3:00 AM", cutOff: "3.30 HRS", icon: TrendingUp },
    { distance: "10 KM", assemble: "3:45 AM", flagOff: "4:00 AM", cutOff: "1.45 HRS", icon: Zap },
    { distance: "5 KM", assemble: "6:15 AM", flagOff: "6:30 AM", cutOff: "1 HR", icon: Heart },
  ];

  const perks = [
    { icon: Shirt, label: "Race T-Shirt", color: "from-orange-500 to-orange-600", bg: "bg-orange-50" },
    { icon: Award, label: "Finisher Medal", color: "from-yellow-500 to-yellow-600", bg: "bg-yellow-50" },
    { icon: CreditCard, label: "Race BIB", color: "from-cyan-500 to-cyan-600", bg: "bg-cyan-50" },
    { icon: Coffee, label: "Breakfast", color: "from-orange-600 to-orange-700", bg: "bg-orange-50" },
    { icon: FileText, label: "E-Certificate", color: "from-slate-600 to-slate-700", bg: "bg-slate-50" },
    { icon: Gift, label: "Goodie Bag", color: "from-purple-500 to-purple-600", bg: "bg-purple-50" },
    { icon: Trophy, label: "Rewards", color: "from-amber-500 to-amber-600", bg: "bg-amber-50" },
    { icon: Droplets, label: "Hydration & Route Support", color: "from-blue-500 to-blue-600", bg: "bg-blue-50" },
    { icon: Ambulance, label: "Ambulance Support", color: "from-red-500 to-red-600", bg: "bg-red-50" },
  ];

  const advisories = [
    {
      title: "Bib Collection Day",
      content: "Collect within allotted slots to avoid crowding. Carry valid ID and confirmation.",
      type: "info",
      icon: CheckCircle,
    },
    {
      title: "Parking & Travel (Bib Day)",
      content: "Limited parking in front of venue. Strongly encouraged to use public transport or carpool.",
      type: "warning",
      icon: Car,
    },
    {
      title: "Race Day Travel",
      content: "Due to early start times, plan travel accordingly. Several roads will be closed/diverted.",
      type: "warning",
      icon: Clock,
    },
    {
      title: "Parking (Race Day) - CRITICAL",
      content: "Parking near start/finish is on UNIVERSITY CRICKET GROUND ONLY. Important and mandatory to park all cars and bikes here. Any other parking is NOT allowed by University Authorities and is punishable.",
      type: "critical",
      icon: AlertTriangle,
    },
  ];

  const partners = [
    { label: "Official Timing Partner", name: "TIMING" },
    { label: "Community & Technology Partner", name: "FITISTAN" },
    { label: "Official Registration Partner", name: "iFINISH" },
    { label: "Physiotherapy & Recovery Support Partner", name: "MEDICULTURE" },
    { label: "Hospital Partner", name: "KHAVTE" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.02,
      y: -8,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  // 2. Return statement goes HERE
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-orange-50/30 text-slate-900">
      {/* Hero Section with Parallax */}
      <motion.div
        style={{ y: headerY, opacity: headerOpacity }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full bg-linear-to-br from-orange-400/10 via-cyan-400/5 to-orange-400/10"
          />
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "radial-gradient(circle at 20% 50%, rgba(249, 115, 22, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
              backgroundSize: "200% 200%",
            }}
          />
        </div>


        {/* Wave decoration */}

      </motion.div>

      {/* Image Gallery with Stagger Animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="container mx-auto px-4 py-12"
      >



      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-12"
      >
        {/* BIB Distribution - Hero Card */}
        <motion.div variants={itemVariants} className="relative">
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute inset-0 bg-linear-to-r from-cyan-400/30 to-orange-400/30 rounded-3xl blur-2xl"
          />

          <motion.div
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
            className="relative bg-linear-to-br from-white via-cyan-50/50 to-orange-50/50 rounded-3xl p-8 md:p-10 border-2 border-cyan-400 shadow-2xl overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-orange-500/5 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-tr from-cyan-500/5 to-transparent rounded-full blur-3xl" />

            <div className="relative">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 mb-8"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 bg-linear-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <CreditCard className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-4xl md:text-5xl uppercase italic tracking-tight text-cyan-700">
                    BIB Distribution
                  </h2>
                  <p className="text-sm text-slate-600 uppercase tracking-wide mt-1">Mandatory Collection</p>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  { icon: Calendar, label: "Date", value: "11th April 2026", color: "orange" },
                  { icon: Clock, label: "Time", value: "9 AM to 5 PM", color: "cyan" },
                  {
  icon: MapPin,
  label: "Venue",
  value: (
    <a 
      href="https://maps.app.goo.gl/veKqmGFUdTmsXBrTA" 
      target="_blank" 
      rel="noopener noreferrer"
      className="group block"
    >
      <p className="text-slate-900 font-bold leading-tight hover:text-orange-600 active:scale-95 transition-all duration-200 cursor-pointer underline decoration-orange-300 underline-offset-4 md:no-underline md:border-b-2 md:border-transparent md:hover:border-orange-200 inline-block md:block">
        University Athletic Field,<br />
        <span className="group-hover:text-orange-600 transition-colors">
          Savitribai Phule Pune University
        </span>
      </p>
      {/* Mobile Hint */}
      <p className="text-[9px] font-black text-orange-500 mt-2 md:hidden flex items-center gap-1 animate-pulse uppercase tracking-tighter">
        Tap to open Maps →
      </p>
    </a>
  ),
  color: "orange"
}
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-slate-200 shadow-md hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-linear-to-br from-${item.color}-500 to-${item.color}-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">{item.label}</p>
                        <p className="text-lg text-slate-900">{item.value}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-cyan-200 shadow-lg"
              >
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-orange-600" />
                  <p className="text-sm font-bold uppercase tracking-wide text-orange-600">What to Carry</p>
                </div>

                {/* Updated Bulleted List */}
                <ul className="flex flex-col gap-2.5 mb-6 ml-1">
                  {["VALID PHOTO ID", "REGISTRATION CONFIRMATION / QR"].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-800 shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>

                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="relative p-5 bg-red-50 border-2 border-red-400 rounded-xl overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl" />
                  <div className="relative flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-red-900">
                        <span className="uppercase tracking-wide font-bold">Important:</span> Bib collection will NOT be available on race day. Verify name, category, and timing chip while collecting. Proxy requires authorization and ID proof.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Flag Off Schedule */}

        <motion.div variants={itemVariants}>
          <motion.div
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
            className="bg-white backdrop-blur-sm rounded-3xl p-6 md:p-8 border-2 border-orange-300 shadow-2xl overflow-hidden"
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 mb-5"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-14 h-14 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Clock className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h2 className="text-3xl md:text-4xl uppercase italic tracking-tight text-orange-700">
                  Flag Off Schedule
                </h2>
                <p className="text-xs text-slate-600 uppercase tracking-wide mt-0.5">All Categories</p>
              </div>
            </motion.div>

            <div className="overflow-x-auto rounded-2xl border-2 border-slate-200 shadow-inner">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-linear-to-r from-cyan-50 to-orange-50 border-b-2 border-slate-300">
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wide text-cyan-700">Distance</th>
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wide text-cyan-700">Assemble</th>
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wide text-cyan-700">Flag Off</th>
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wide text-cyan-700">Cut Off</th>
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wide text-cyan-700">Hydration</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((row, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ backgroundColor: "rgba(249, 115, 22, 0.05)" }}
                      className="border-b border-slate-200 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <row.icon className="w-4 h-4 text-orange-600" />
                          <span className="text-orange-600 font-bold">{row.distance}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-900">{row.assemble}</td>
                      <td className="py-3 px-4 text-slate-900 font-bold">{row.flagOff}</td>
                      <td className="py-3 px-4 text-slate-900">{row.cutOff}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 text-cyan-600">
                          <Droplets className="w-3.5 h-3.5" />
                          Every 2 KM
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 grid md:grid-cols-2 gap-4">
              {[
                {
                  icon: MapPin,
                  title: "Start & Finish",
                  content: "Shooting Range, Indoor Hall, Savitribai Phule Pune University",
                  subtitle: "(Nearest Point: Beside University Ground)",
                  color: "orange",
                },
                {
                  icon: Flashlight,
                  title: "Mandatory Gear",
                  content: "Headtorch is mandatory for 35K, 42K runners",
                  subtitle: "Report 30 mins before flag-off",
                  color: "cyan",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 bg-linear-to-br from-${item.color}-500 to-${item.color}-600 rounded-lg flex items-center justify-center shrink-0 shadow-md`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">{item.title}</p>
                      <p className="text-xs text-slate-900 font-medium leading-tight mb-0.5">{item.content}</p>
                      <p className={`text-[10px] text-${item.color}-700 italic`}>{item.subtitle}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* What Runners Get */}
        <motion.div variants={itemVariants}>
          <motion.div
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
            className="bg-white backdrop-blur-sm rounded-3xl p-8 md:p-10 border-2 border-orange-300 shadow-2xl"
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 mb-8"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Gift className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h2 className="text-4xl md:text-5xl uppercase italic tracking-tight text-orange-700">
                  What You're Getting
                </h2>
                <p className="text-sm text-slate-600 uppercase tracking-wide mt-1">Runner Benefits</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {perks.map((perk, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                  whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{
                    delay: idx * 0.05,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    scale: 1.1,
                    y: -10,
                    rotateZ: 5,
                    transition: { type: "spring", stiffness: 400 },
                  }}
                  className="group relative cursor-pointer"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`absolute inset-0 ${perk.bg} opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl blur-xl`}
                  />

                  <div className={`relative ${perk.bg} backdrop-blur-sm p-6 rounded-2xl border-2 border-slate-200 group-hover:border-orange-400 transition-all shadow-lg group-hover:shadow-2xl`}>
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                      className={`w-14 h-14 mx-auto mb-4 bg-linear-to-br ${perk.color} rounded-xl flex items-center justify-center shadow-xl`}
                    >
                      <perk.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <p className="text-xs text-center uppercase tracking-wide text-slate-900 leading-tight">{perk.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Important Advisory */}
        <motion.div variants={itemVariants}>
          <motion.div
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
            className="bg-white backdrop-blur-sm rounded-3xl p-8 md:p-10 border-2 border-red-400 shadow-2xl"
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 mb-8"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="w-16 h-16 bg-linear-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <AlertTriangle className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h2 className="text-4xl md:text-5xl uppercase italic tracking-tight text-red-700">
                  Important Advisory
                </h2>
                <p className="text-sm text-slate-600 uppercase tracking-wide mt-1">Please Read Carefully</p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {advisories.map((advisory, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className={`p-6 rounded-2xl border-l-4 shadow-lg hover:shadow-xl transition-all ${advisory.type === "critical"
                    ? "bg-red-100 border-red-600 border-2"
                    : advisory.type === "warning"
                      ? "bg-orange-50 border-orange-500 border-2"
                      : "bg-cyan-50 border-cyan-500 border-2"
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <advisory.icon
                        className={`w-7 h-7 mt-1 shrink-0 ${advisory.type === "critical"
                          ? "text-red-600"
                          : advisory.type === "warning"
                            ? "text-orange-600"
                            : "text-cyan-600"
                          }`}
                      />
                    </motion.div>
                    <div>
                      <h3 className="uppercase tracking-wide text-sm mb-3 text-slate-900">{advisory.title}</h3>
                      <p className="text-sm text-slate-700 leading-relaxed">{advisory.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Partners Footer */}
        {/* <motion.div variants={itemVariants}>
          <motion.div
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
            className="bg-gradient-to-br from-white via-slate-50 to-white rounded-3xl p-8 md:p-10 border-2 border-slate-300 shadow-2xl"
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 mb-8"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Users className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h2 className="text-4xl md:text-5xl uppercase italic tracking-tight text-cyan-700">
                  Official Partners
                </h2>
                <p className="text-sm text-slate-600 uppercase tracking-wide mt-1">Supporting Excellence</p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {partners.map((partner, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: idx * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 hover:border-orange-500 transition-all shadow-md hover:shadow-xl overflow-hidden group"
                >
                  <motion.div
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent"
                  />
                  <div className="relative">
                    <p className="text-xs uppercase tracking-wide text-slate-600 mb-3">
                      {partner.label}
                    </p>
                    <p className="text-xl uppercase tracking-wider text-orange-600 group-hover:text-orange-700 transition-colors">
                      {partner.name}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div> */}
      </motion.div>


    </div>
  );
}
export default RaceDay;