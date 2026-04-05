import React, { useState } from 'react';

import { Zap, Trophy, Target, Copy, Check } from 'lucide-react';
// import { Zap, Trophy, Target, Copy, Check, Instagram } from 'lucide-react';

import { motion, useScroll, useTransform } from 'framer-motion';



// Asset Imports

import ambassadors1 from "../assets/ambassador-sagar-abaso-kachare.png";

import ambassadors2 from "../assets/ambassador-meenal-kunal-kashikar.png";

import ambassadors3 from "../assets/ambassador-kinnari-shah.png";

import ambassadors4 from "../assets/ambassador-vijay-gumaste.png"

import ambassadors5 from "../assets/ambassador-dadasaheb-sabakale.png"

import ambassadors6 from "../assets/ambassador-siddesh-pandit.png"

import ambassadors7 from "../assets/ambassador-ganesh-dhamagunde.png"

import ambassadors8 from "../assets/ambassador-ashish-dhillon.png"





const ambassadors = [

  {

    name: "SAGAR ABASO KACHARE",

    title: "Fitness Trainer (Free for All Ages)",

    image: ambassadors1,

    highlights: [

      "Ultra Runner & Fitness Trainer",

      "Event Organizer & Race Ambassador",

      "Professional Pacer and Motivational Speaker",

      "Highly dedicated runner with experience in multiple types of marathons",

      "Community fitness advocate for all age groups"

    ],

    achievement: "Completed a remarkable 405 KM Indian Army Ultra Marathon - one of the toughest endurance challenges in the country",

    mission: "Focused on promoting fitness for everyone, training and motivating people across all age groups, whilst actively contributing to the running community and making marathons accessible to all.",

    code: "SAGAR10",

    gradient: "from-orange-500 to-red-500"

  },

  {

    name: "MEENAL KUNAL KASHIKAR",

    title: "Senior Project Manager at SymphonyAI | Marathoner | Ironman 70.3 Finisher",

    image: ambassadors2,

    highlights: [

      "Race Coordinator – Vrudshabron 2024 & 2025",

      "Marathon Ambassador (2024-2026) for major events including Pharmathon and Sinhagad Hill Marathon",

      "Duathlon Podium Finisher - Bergman Kolhapur (1st Rank - 2022 & 2023)",

      "Marathon Pacer for Jalonar, AFMC Pune, and NDA Marathons",

      "Cycling: Pune-Goa Ride 2024 | Pune-Mumbai Ride 2024 & 2025"

    ],

    achievement: "Ironman 70.3 Goa (2023) & Powerthon Triathlon (2023) Finisher - pushing the boundaries of endurance sports",

    mission: "To represent the running community with dedication and enthusiasm, motivating countless runners to push beyond their limits while actively running major marathons like TMM and Satara Hill since 2018.",

    code: "MEENAL10",

    gradient: "from-pink-500 to-purple-500"

  },

  {

    name: "KINNARI SHAH",

    title: "Entrepreneur | Fitness Enthusiast | Passionate Runner",

    image: ambassadors3,

    highlights: [

      "Entrepreneur and dedicated fitness enthusiast",

      "6 years of consistent running experience",

      "Participated in nearly 60 competitive races",

      "Actively encourages women to prioritize their health and fitness",

      "Consistency-driven athlete and community motivator"

    ],

    achievement: "Multiple Podium Finishes: 1st Position at Dosti Thane & Jupiter Thane Half Marathons; 2nd Position at Jiyo Sanman Se & Swami Vivekanand Runs",

    mission: "To push boundaries, lead by example, and inspire more women to join the running community by demonstrating determination and consistency in every stride.",

    code: "KINNARI10",

    gradient: "from-blue-500 to-cyan-500"

  },

  {

    name: "VIJAY GUMASTE",

    title: "Endurance Athlete | Record Holder | Experienced Pacer",

    image: ambassadors4,

    highlights: [

      "Record Holder - 268 Surya Namaskars in just 1 hour",

      "Globally Recognized – Honored by Taiwan Marathon Club for 1,000,000+ steps in 30 days",

      "Experienced Pacer for Pune International Marathon and Apla Pune Marathon",

      "Consistent pacer for Merathon and various other major racing events",

      "Known for lifting others while chasing his own limits"

    ],

    achievement: "Personal Bests: Full Marathon - 5:23 | Half Marathon - 2:55 - proving that consistency beats perfection",

    mission: "To maintain a consistent, self-driven approach to fitness while serving as a guide and pacer to help fellow runners achieve their personal milestones and race goals.",

    code: "VIJAY10",

    gradient: "from-indigo-500 to-blue-500"

  },

  {

    name: "DADASAHEB SABAKALE",

    title: "Pacer | Marathon Ambassador | Bluebrigade Running Club",

    image: ambassadors5,

    highlights: [

      "Prominent member of Bluebrigade Running Club",

      "Disciplined athlete known for Accurate Timing",

      "Strong Group Motivation and community leadership",

      "Available as 10K Pacer, 21K Pacer, and Event Ambassador",

      "Official Ambassador for CME Soldierthon 2025 and Punekar Half Marathon 2026"

    ],

    achievement: "Proven Pacing Record: 5K in 30 mins | 10K in 60-70 mins | 21K in 2:20 & 2:45 across major marathons like Pharmathon and Pune World Marathon",

    mission: "To lead runners with discipline and accurate timing, ensuring a strong finish for every group he leads while promoting the spirit of 'Let's Run Together, Finish Strong'.",

    code: "DADASAHEB10",

    gradient: "from-red-500 to-orange-500"

  },

  {

    name: "SIDHESH PANDIT",

    title: "Running Coach – ABCR Kharadi Runners | Marathoner",

    image: ambassadors6,

    highlights: [

      "11+ years of extensive running experience",

      "Trained 150+ amateur runners to reach their fitness goals",

      "Official Pacer: Bajaj Pune HM, Federal Pune HM, Lokmot Pune Marathon, Punekar HM, and SPI 10K",

      "Brand Ambassador: PGHM Marathon, Punekar Half Marathon, and FamilyThon",

      "Active participant in multiple high-profile marathons"

    ],

    achievement: "Personal Bests: Full Marathon - 3:28 Hours | Half Marathon - 1:34 Hours - elite-level performance",

    mission: "To provide scientific and structured training focused on endurance, running efficiency, injury prevention, and building mental strength for runners of all levels.",

    code: "SIDDHESH10",

    gradient: "from-teal-500 to-green-500"

  },

  {

    name: "GANESH DHAMAGUNDE",

    title: "Marathon Enthusiast | Community Leader | Fitness Advocate",

    image: ambassadors7,

    highlights: [

      "Dedicated runner with passion for community fitness",

      "Active participant in major marathons and running events",

      "Known for his motivational spirit and positive energy",

      "Encourages beginners to start their fitness journey",

      "Regular presence at local running clubs and training sessions"

    ],

    achievement: "Consistent Marathon Finisher with impressive personal records and dedication to continuous improvement in endurance sports",

    mission: "To inspire and motivate fellow runners by leading through example, sharing experiences, and building a stronger, healthier running community together.",

    code: "GANESH10",

    gradient: "from-green-500 to-teal-500"

  },
  {
    name: "ASHISH DHILLON",
    title: "Captain – Fitistan | Ex-NCC Cadet | Long-distance Runner & Pacer",
    image: ambassadors8,
    highlights: [
      "Captain – Fitistan and experienced marathon pacer",
      "KVS Regional Athletics Representative",
      "Paced major events: Pune World Marathon & CME Soldierathon",
      "Completed 6 consecutive pacing events (Feb-Mar)",
      "Dedicated long-distance runner and community leader"
    ],
    achievement: "Successfully completed 6 consecutive professional pacing assignments between 1st February and 8th March",
    mission: "To lead and motivate the running community through disciplined pacing, sharing athletics expertise as a Regional Representative, and achieving the Procam Slam goal.",
    code: "ASHISH10",
    gradient: "from-yellow-400 to-orange-500"
  },

];



const AmbassadorCard = ({ ambassador, index }) => {

  const [copiedCode, setCopiedCode] = useState(false);



  const handleCopyCode = () => {

    navigator.clipboard.writeText(ambassador.code);

    setCopiedCode(true);

    setTimeout(() => setCopiedCode(false), 2000);

  };



  return (

    <motion.div

      initial={{ opacity: 0, y: 60 }}

      whileInView={{ opacity: 1, y: 0 }}

      viewport={{ once: true, margin: "-50px" }}

      transition={{

        duration: 0.7,

        delay: index * 0.15,

        type: "spring",

        stiffness: 80,

        damping: 20

      }}

      className="group relative"

    >

      <div className={`absolute -inset-0.5 bg-gradient-to-r ${ambassador.gradient} rounded-[32px] opacity-0

                      group-hover:opacity-20 blur-xl transition-all duration-700`}></div>



      <motion.div

        whileHover={{

          y: -12,

          transition: { duration: 0.4, ease: "easeOut" }

        }}

        className="relative bg-white rounded-[28px] lg:rounded-[32px] shadow-lg border border-slate-200 overflow-hidden

                   hover:shadow-2xl hover:border-slate-300 transition-all duration-500

                   flex flex-col lg:flex-row"

      >

        {/* Mobile/Tablet Image - Top */}

        <div className="relative lg:hidden w-full h-72 sm:h-80 overflow-hidden">

          <motion.div

            className={`absolute inset-0 bg-gradient-to-b ${ambassador.gradient} opacity-10 z-10 pointer-events-none`}

            animate={{ opacity: [0.1, 0.15, 0.1] }}

            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}

          ></motion.div>

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-10"></div>

          <motion.img

            src={ambassador.image}

            alt={ambassador.name}

            className="w-full h-full object-cover object-top"

            whileHover={{ scale: 1.05 }}

            transition={{ duration: 0.6, ease: "easeOut" }}

            loading="lazy"

          />

        </div>



        {/* Left Column - Content */}

        <div className="flex-1 lg:w-1/2 p-5 lg:pl-10 lg:pr-8 flex flex-col justify-between">

          <motion.div

            className="flex items-center gap-2 mb-4"

            initial={{ width: 0 }}

            whileInView={{ width: "auto" }}

            transition={{ delay: 0.3, duration: 0.5 }}

          >

            <motion.div

              className={`h-0.5 w-10 bg-gradient-to-r ${ambassador.gradient}`}

              initial={{ scaleX: 0 }}

              whileInView={{ scaleX: 1 }}

              transition={{ delay: 0.4, duration: 0.5 }}

            ></motion.div>

            <span className="text-teal-600 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.15em]">

              AMBASSADOR PROFILE

            </span>

          </motion.div>



          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black uppercase

                         text-slate-900 leading-[1.1] tracking-tight mb-3 sm:mb-4">

            {ambassador.name}

          </h2>



          <p className="text-teal-600 text-sm sm:text-base lg:text-lg italic font-semibold mb-5 sm:mb-6 leading-relaxed">

            {ambassador.title}

          </p>



          <motion.ul

            className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6"

            initial="hidden"

            whileInView="visible"

            viewport={{ once: true }}

            variants={{

              visible: {

                transition: {

                  staggerChildren: 0.08

                }

              }

            }}

          >

            {ambassador.highlights.map((highlight, idx) => (

              <motion.li

                key={idx}

                className="flex items-start gap-3"

                variants={{

                  hidden: { opacity: 0, x: -20 },

                  visible: { opacity: 1, x: 0 }

                }}

              >

                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 flex-shrink-0 mt-0.5" />

                <span className="text-slate-700 text-xs sm:text-sm lg:text-base leading-relaxed">

                  {highlight}

                </span>

              </motion.li>

            ))}

          </motion.ul>



          <motion.div

            className="relative bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6 overflow-hidden"

            whileHover={{ scale: 1.02 }}

            transition={{ duration: 0.3 }}

          >

            <motion.div

              className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${ambassador.gradient} opacity-5 rounded-full blur-2xl`}

              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}

              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}

            ></motion.div>

            <div className="relative flex items-start gap-3">

              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 flex-shrink-0 mt-0.5" />

              <div>

                <span className="text-teal-800 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.12em] block mb-2">

                  MAJOR ACHIEVEMENT


                </span>

                <p className="text-slate-800 text-xs sm:text-sm lg:text-base font-medium leading-relaxed">

                  {ambassador.achievement}

                </p>

              </div>

            </div>

          </motion.div>



          <div className="mb-6 sm:mb-8">

            <div className="flex items-center gap-2 mb-3">

              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />

              <span className="text-slate-900 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.12em]">

                MISSION

              </span>

            </div>

            <p className="text-slate-600 text-xs sm:text-sm lg:text-base italic leading-relaxed">

              {ambassador.mission}

            </p>



          </div>





        </div>



        {/* Right Column - Desktop Image */}

        <div className="hidden lg:block relative lg:w-1/2 overflow-hidden">

          <motion.div

            className={`absolute inset-0 bg-gradient-to-r ${ambassador.gradient} opacity-10 z-10 pointer-events-none`}

            animate={{ opacity: [0.1, 0.15, 0.1] }}

            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}

          ></motion.div>

          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white via-white/60 to-transparent z-10"></div>

          <motion.img

            src={ambassador.image}

            alt={ambassador.name}

            className="w-full h-full object-cover object-right transition-transform duration-700

                     group-hover:scale-110"

            loading="lazy"

          />

        </div>

      </motion.div>



    </motion.div>

  );

};



const Community = () => {

  const { scrollYProgress } = useScroll();

  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);



  return (

    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-12 sm:py-16 lg:py-24 overflow-hidden">

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        <motion.header

          style={{ y: headerY, opacity: headerOpacity }}

          className="text-center mb-12 sm:mb-16 lg:mb-20 relative"

        >

          <motion.div

            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96

                       bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-full blur-3xl"

            animate={{

              scale: [1, 1.2, 1],

              rotate: [0, 90, 0]

            }}

            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}

          ></motion.div>



          <motion.div

            initial={{ opacity: 0, y: 30 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ duration: 0.8, ease: "easeOut" }}

          >

            <motion.h1

              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black uppercase mb-4 sm:mb-6 relative z-10"

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.6, delay: 0.2 }}

            >

              <span className="text-slate-900">OUR </span>

              <span className="relative inline-block">

                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">

                  COMMUNITY

                </span>

                <motion.span

                  className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-600 to-cyan-600 opacity-30"

                  initial={{ scaleX: 0 }}

                  animate={{ scaleX: 1 }}

                  transition={{ duration: 0.8, delay: 0.8 }}

                ></motion.span>

              </span>

            </motion.h1>

            <motion.p

              className="text-slate-500 text-xs sm:text-sm lg:text-base uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold relative z-10"

              initial={{ opacity: 0 }}

              animate={{ opacity: 1 }}

              transition={{ duration: 0.6, delay: 0.4 }}

            >

              Meet the athletes leading the movement

            </motion.p>

          </motion.div>





        </motion.header>



        <div className="space-y-6 sm:space-y-8 lg:space-y-12">

          {ambassadors.map((ambassador, index) => (

            <AmbassadorCard

              key={ambassador.code}

              ambassador={ambassador}

              index={index}

            />

          ))}

        </div>



        <motion.div

          initial={{ opacity: 0, y: 40 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

          transition={{ duration: 0.8 }}

          className="mt-16 sm:mt-20 lg:mt-24 text-center relative"

        >





        </motion.div>

      </div>

    </div>

  );

};



export default Community;

