import React from "react";
import { FiAward, FiTarget, FiZap, FiTwitter, FiInstagram } from "react-icons/fi";

// Asset Imports
import ambassadors1 from "../assets/ambassador-sagar-abaso-kachare.png";
import ambassadors2 from "../assets/ambassador-meenal-kunal-kashikar.png";
import ambassadors3 from "../assets/ambassador-kinnari-shah.png";
import ambassadors4 from "../assets/ambassador-vijay-gumaste.png"
import ambassadors5 from "../assets/ambassador-dadasaheb-sabakale.png"
import ambassadors6 from "../assets/ambassador-siddesh-pandit.png"
// import ambassadors7 from "../assets/ambassador-ganesh-dhamagunde.png"

const ambassadors = [
  {
    id: 1,
    name: "Sagar Abaso Kachare",
    title: "Fitness Trainer (Free for All Ages)",
    image: ambassadors1,
    highlights: [
      "Ultra Runner & Fitness Trainer",
      "Event Organizer",
      "Race Ambassador",

      "Pacer and Motivational Speaker",
      "Highly dedicated runner with experience in multiple types of marathons"
    ],
    achievement: "Completed a remarkable 405 KM Indian Army Ultra Marathon Finisher 🇮🇳",
    mission: "Focused on promoting fitness for everyone, training and motivating people across all age groups while actively contributing to the running community.",
    couponCode: "SAGAR10",
    instagram: "https://www.instagram.com/sagar_kachare810?igsh=MXZ4Z3YyeG9veHV3cg==",
  },
  {
    id: 2,
    name: "Meenal Kunal Kashikar",
    title: "Senior Project Manager at SymphonyAI | Marathoner | Ironman 70.3 Finisher",
    image: ambassadors2,
    highlights: [
      "Race Coordinator - Vrukshathon 2024 & 2025",
      "Marathon Ambassador (2024-2026) for major events including Pharmathon and Sinhagad Hill Marathon",
      "Duathlon Podium Finisher - Bergman Kolhapur (1st Rank - 2022 & 2023)",
      "Marathon Pacer for Lokmat, AFMC Pune, and NDA Marathons",
      "Cycling: Pune-Goa Ride 2024 | Pune-Mumbai Ride 2022 & 2025"
    ],
    achievement: "Ironman 70.3 Goa (2023) & Powerthon Triathlon (2023) Finisher",
    mission: "To represent the running community with dedication and endurance, motivating countless runners to push beyond their limits while actively running major marathons like TMM and Satara Hill since 2018.",
    recognition: [
      "Face of Vihaan NGO - Tata Mumbai Marathon 2023",
      "Fitness Icon - Aloha Clinics Marathon 2022"
    ],
    couponCode: "MEENAL10",
    instagram: "https://www.instagram.com/meenalkunalkashikar?igsh=MTQxcTZ1YjQ1ZmNr",
  },
  {
    id: 3,
    name: "Kinnari Shah",
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
    mission: "To push boundaries, lead by example, and inspire more women to join the running community by demonstrating determination and consistency.",
    recentPerformance: [
      "Dosti Thane Half Marathon (10km) - 1st Position",
      "Jupiter Thane Half Marathon (10km) - 1st Position",
      "Jiyo Sanman Se Run (10km) - 2nd Position",
      "Swami Vivekanand Run (10km) - 2nd Position"
    ],
    couponCode: "KINNARI10",
    instagram: "https://www.instagram.com/kinnshah?igsh=MWs5YzYya2piOGhuZg==",
  },
  {
    id: 4,
    name: "Vijay Gumaste",
    title: "Endurance Athlete | Record Holder | Experienced Pacer",
    image: ambassadors4,
    highlights: [
      "Record Holder – 268 Surya Namaskars in just 1 hour",
      "Globally Recognized – Honored by Taiwan Marathon Club for 1,000,000+ steps in 30 days",
      "Experienced Pacer for Pune International Marathon and Apla Pune Marathon",
      "Consistent pacer for Neerathon and various other major racing events",
      "Known for lifting others while chasing his own limits"
    ],
    achievement: "Personal Bests: Full Marathon - 5:23 | Half Marathon - 2:55",
    mission: "To maintain a consistent, self-driven approach to fitness while serving as a guide and pacer to help fellow runners achieve their personal milestones.",
    stats: {
      worldRecord: "268 Surya Namaskars (60 mins)",
      globalHonor: "1 Million Steps Challenge Finisher"
    },
    couponCode: "VIJAY10",
    instagram: "https://www.instagram.com/gumastevijay954?igsh=ZTlyZzVtYTQ0eTB6",
  },
  {
    id: 5,
    name: "Dadasaheb Sabakale",
    title: "Pacer | Marathon Ambassador | Bluebrigade Running Club",
    image: ambassadors5,
    highlights: [
      "Prominent member of Bluebrigade Running Club",
      "Disciplined athlete known for Accurate Timing",
      "Strong Group Motivation and community leadership",
      "Available as 10K Pacer, 21K Pacer, and Event Ambassador",
      "Official Ambassador for CME Soldierathon 2025 and Punekar Half Marathon 2026"
    ],
    achievement: "Proven Pacing Record: 5K in 30 mins | 10K in 60-70 mins | 21K in 2:20 & 2:45 across major marathons like Pharmathon and Pune World Marathon.",
    mission: "To lead runners with discipline and accurate timing, ensuring a strong finish for every group he leads while promoting the spirit of 'Let's Run Together. Finish Strong.'",
    pacingEvents: [
      "AMC Marathon (5K - 30 mins)",
      "SBI Green & Punekar HM (10K - 60-70 mins)",
      "Pharmathon & Pune World Marathon (21K - 2:20/2:45)"
    ],
    couponCode: "DADASAHEB10",
    instagram: "https://www.instagram.com/dadasahebsabakale92?igsh=MXg1aGh0azhwaG4zbg==",
  },
  {
    id: 6,
    name: "Sidhesh Pandit",
    title: "Running Coach – ABCR Kharadi Runners | Marathoner",
    image: ambassadors6,
    highlights: [
      "11+ years of extensive running experience",
      "Trained 150+ amateur runners to reach their fitness goals",
      "Official Pacer: Bajaj Pune HM, Federal Pune HM, Lokmat Pune Marathon, Punekar HM, and SPJ 10K",
      "Brand Ambassador: PCHM Marathon, Punekar Half Marathon, and Familython",
      "Active participant in multiple high-profile marathons"
    ],
    achievement: "Personal Bests: Full Marathon - 3:28 Hours | Half Marathon - 1:34 Hours",
    mission: "To provide scientific and structured training focused on endurance, running efficiency, injury prevention, and building mental strength.",
    coachingApproach: "Scientifically structured training designed to help runners 'Train With Experience. Run With Confidence.'",
    couponCode: "SIDDHESH10",
    instagram: "https://www.instagram.com/runwithpandit?igsh=bGl4bnl6NDdwYWJx",
  },
  // {
  //   id: 7,
  //   name: "Ganesh Dhamagunde",
  //   title: "Marathoner | Ironman 70.3 Finisher",
  //   image: ambassadors7,
  //   highlights: [
  //     "Senior Project Manager at SymphonyAI",
  //     "Marathon Ambassador (2024-2026)",
  //     "Duathlon Podium Finisher"
  //   ],
  //   achievement: "Ironman 70.3 Goa - 2023 & Powerthon Triathlon - 2023",
  //   mission: "Actively running major marathons like TMM and Satara Hill since 2018.",
  //   couponCode: "GANESH10",
  // }
];

const Community = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* 1. Container width set to 6xl for a balanced professional look */}
      <div className="max-w-6xl mx-auto">

        {/* 2. Header brought down with mt-12; gap below reduced with mb-6 */}
        <div className="text-center mt-12 mb-6">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
            Our <span className="text-teal-600 underline decoration-teal-200 underline-offset-4">Community</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            Meet the athletes leading the movement
          </p>
        </div>

        {/* Ambassadors Grid */}
<div className="space-y-12">
  {ambassadors.map((person) => (
    <div key={person.id} className="relative group">
      {/* GRID FIX: 
        1. Default (Mobile): grid-cols-1 (Image on top, Text below)
        2. Large: lg:grid-cols-[1.2fr_0.8fr] (Text left, Image right)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-0 rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-slate-900 shadow-2xl border border-slate-800">

        {/* DETAILS SECTION (Order-2 on mobile so it stays below the image) */}
        <div className="p-6 md:p-10 flex flex-col justify-center order-2 lg:order-1 lg:min-h-[550px]">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-1 w-10 bg-teal-500 rounded-full"></span>
            <p className="text-teal-400 font-black uppercase tracking-[0.3em] text-[10px]">Ambassador Profile</p>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter mb-2">
            {person.name}
          </h2>
          <p className="text-teal-500 font-bold italic text-sm mb-6">{person.title}</p>

          <div className="space-y-3 mb-6">
            <ul className="grid grid-cols-1 gap-2">
              {person.highlights.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300 text-xs md:text-sm">
                  <FiZap className="text-teal-500 mt-0.5 shrink-0" size={14} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Achievement Box */}
          <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 mb-4">
            <div className="flex items-center gap-2 text-teal-400 mb-1">
              <FiAward size={16} />
              <span className="font-black uppercase tracking-widest text-[9px]">Major Achievement</span>
            </div>
            <p className="text-white font-medium text-xs md:text-sm leading-relaxed">{person.achievement}</p>
          </div>

          {/* Mission */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-teal-400 mb-1">
              <FiTarget size={16} />
              <span className="font-black uppercase tracking-widest text-[9px]">Mission</span>
            </div>
            <p className="text-slate-400 text-[11px] md:text-xs leading-snug italic line-clamp-3">{person.mission}</p>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
            <div className="w-full sm:w-auto bg-teal-600 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-4 shadow-lg">
              <span className="font-black uppercase tracking-widest text-[9px] text-teal-100 border-r border-teal-400 pr-4">Use Code</span>
              <span className="text-xl font-black tracking-widest font-mono uppercase">{person.couponCode}</span>
            </div>

            <a
              href={person.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto p-3 bg-white/5 hover:bg-teal-600 rounded-xl transition-all text-white flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
            >
              <FiInstagram size={20} />
              <span className="sm:hidden">Follow on Instagram</span>
            </a>
          </div>
        </div>

        {/* IMAGE SECTION (Order-1 on mobile so it stays on top) */}
        <div className="relative h-72 sm:h-96 lg:h-full order-1 lg:order-2 overflow-hidden bg-slate-800">
          <img
            src={person.image}
            alt={person.name}
            className="w-full h-full object-cover object-top lg:object-right grayscale-20 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:bg-gradient-to-l lg:from-slate-900/80 lg:via-transparent lg:to-transparent opacity-90"></div>
        </div>

      </div>
    </div>
  ))}
</div>
      </div>
    </div>
  );
};

export default Community;