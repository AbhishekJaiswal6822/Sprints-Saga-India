


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RxDotFilled } from 'react-icons/rx';

// Import the arrow icons
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Desktop images
import img1Desktop from "./assets/lokraja-marathon-2026-desktop.jpeg";
import img2Desktop from "./assets/registration-website-desktop.jpeg";
// import img3Desktop from "./assets/early-bird-desktop.jpeg";
import img4Desktop from "./assets/early-bird-registration.jpg";


// Mobile images
import img1Mobile from "./assets/lokraja-marathon-2026-mobile.jpeg";
import img2Mobile from "./assets/registration-website-mobile.jpeg";
// import img3Mobile from "./assets/early-bird-mobile.jpeg";
import img4Mobile from "./assets/early-bird-registration.jpg";

export default function Hero() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slides = [
    { desktop: img1Desktop, mobile: img1Mobile, clickable: true, type: 'register-soon' },
    { desktop: img2Desktop, mobile: img2Mobile, clickable: true, type: 'register-now' },
    // { desktop: img3Desktop, mobile: img3Mobile, clickable: false, type: 'none' },
    { desktop: img4Desktop, mobile: img4Mobile, clickable: false, type: 'none' },
  ];

  const minSwipeDistance = 50;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  // --- SWIPE LOGIC ---
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextSlide();
    else if (distance < -minSwipeDistance) prevSlide();
  };

  // --- AUTO SLIDE ---
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  // At the top of your Hero component


  return (
    <div className='mt-8 max-w-[1200px] h-[550px] sm:h-[450px] md:h-[600px] lg:h-[650px] w-full m-auto py-8 px-2 relative group select-none'>

      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className='w-full h-full rounded-2xl overflow-hidden shadow-xl border border-slate-100 relative'
      >
        <div className="w-full h-full relative overflow-hidden rounded-2xl">
          <img
            // Explicitly choose the source based on JavaScript state
            src={isMobile ? slides[currentIndex].mobile : slides[currentIndex].desktop}
            alt="LokRaja Marathon Hero"
            // Use object-cover to prevent shrinking/stretching on mobile
            className="w-full h-full object-fill transition-opacity duration-500 ea se-in-out"
            // The key is critical: it forces a complete re-render when switching devices
            key={`${currentIndex}-${isMobile ? 'mobile' : 'desktop'}`}
          />
        </div>

        {/* --- SIDE NAVIGATION ARROWS --- */}
        {/* Left Arrow */}
        <button
          onClick={(e) => { e.stopPropagation(); prevSlide(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/10 hover:bg-black/30 text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:block"
        >
          <FiChevronLeft size={40} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={(e) => { e.stopPropagation(); nextSlide(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/10 hover:bg-black/30 text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:block"
        >
          <FiChevronRight size={40} />
        </button>

        {/* --- DYNAMIC CLICKABLE OVERLAYS --- */}
        {slides[currentIndex].clickable && (
          <>
            {/* Slide 1: Register Soon Area */}
            {slides[currentIndex].type === 'register-soon' && (
              <button
                onClick={() => navigate("/register")}
                className="absolute left-1/2 -translate-x-1/2 bottom-[5%] w-[60%] h-[25%] md:w-[40%] md:h-[20%] bg-transparent cursor-pointer z-20"
                aria-label="Register Soon"
              />
            )}

            {/* Slide 2: Register Now Area */}
            {slides[currentIndex].type === 'register-now' && (
              <button
                onClick={() => navigate("/register")}
                className="absolute right-[5%] bottom-[10%] w-[55%] h-[25%] md:right-[8%] md:bottom-[15%] md:w-[35%] md:h-[20%] bg-transparent cursor-pointer z-20"
                aria-label="Register Now"
              />
            )}
          </>
        )}
      </div>

      {/* Manual Indicator Dots */}
      <div className='flex justify-center py-4 gap-2'>
        {slides.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => setCurrentIndex(slideIndex)}
            className={`text-2xl cursor-pointer transition-all duration-300 ${currentIndex === slideIndex ? 'text-teal-600 scale-125' : 'text-slate-300 hover:text-teal-400'
              }`}
          >
            <RxDotFilled />
          </div>
        ))}
      </div>

      {/* <p className='md:hidden text-center text-xs text-slate-400 -mt-2 animate-pulse'>
        Swipe left or right
      </p> */}
    </div>
  );
}