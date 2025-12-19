

// import React, { useState, useEffect } from 'react';
// import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
// import { RxDotFilled } from 'react-icons/rx';

// // Import images from your local assets folder
// import img1 from './assets/whylokraja.jpeg';
// import img2 from './assets/missionpurposeimpact.jpeg';
// import img3 from './assets/yourexperienceyourvision.jpeg';
// import img4 from './assets/aboutssi.jpeg';

// function ImageSlider() {
//   const slides = [
//     { url: img1, title: 'Why Lokraja Marathon' },
//     { url: img2, title: 'Mission & Impact' },
//     { url: img3, title: 'Your Experience' },
//     { url: img4, title: 'About SSI' },
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [touchStart, setTouchStart] = useState(null);
//   const [touchEnd, setTouchEnd] = useState(null);

//   // Minimum swipe distance (in pixels) to trigger a slide change
//   const minSwipeDistance = 50;

//   const prevSlide = () => {
//     const isFirstSlide = currentIndex === 0;
//     const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
//     setCurrentIndex(newIndex);
//   };

//   const nextSlide = () => {
//     const isLastSlide = currentIndex === slides.length - 1;
//     const newIndex = isLastSlide ? 0 : currentIndex + 1;
//     setCurrentIndex(newIndex);
//   };

//   // --- SWIPE LOGIC ---
//   const onTouchStart = (e) => {
//     setTouchEnd(null); // Reset end touch
//     setTouchStart(e.targetTouches[0].clientX);
//   };

//   const onTouchMove = (e) => {
//     setTouchEnd(e.targetTouches[0].clientX);
//   };

//   const onTouchEnd = () => {
//     if (!touchStart || !touchEnd) return;
//     const distance = touchStart - touchEnd;
//     const isLeftSwipe = distance > minSwipeDistance;
//     const isRightSwipe = distance < -minSwipeDistance;

//     if (isLeftSwipe) {
//       nextSlide();
//     } else if (isRightSwipe) {
//       prevSlide();
//     }
//   };

//   // --- AUTO SLIDE ---
//   useEffect(() => {
//     const slideInterval = setInterval(nextSlide, 5000);
//     return () => clearInterval(slideInterval);
//   }, [currentIndex]);

//   return (
//     //newline
//     <div className='max-w-[1400px] h-[300px] sm:h-[450px] md:h-[600px] lg:h-[680px] w-full m-auto py-8 px-4 relative group select-none'>
//       {/* Background Image Container with Touch Handlers */}
//       <div
//         onTouchStart={onTouchStart}
//         onTouchMove={onTouchMove}
//         onTouchEnd={onTouchEnd}
//         style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
//         className='w-full h-full rounded-2xl bg-center bg-contain bg-no-repeat md:bg-cover duration-500 transition-all ease-in-out shadow-xl cursor-grab active:cursor-grabbing'
//       ></div>

//       {/* Left Arrow (Hidden on small screens, visible on hover for desktop) */}
//       <div className='hidden md:group-hover:block absolute top-[50%] -translate-y-[-50%] left-10 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/50 transition-colors'>
//        {/* newlineadded */}
//         <BsChevronCompactLeft onClick={prevSlide} size={30} />
//       </div>

//       {/* Right Arrow (Hidden on small screens, visible on hover for desktop) */}
//       <div className='hidden md:group-hover:block absolute top-[50%] -translate-y-[-50%] right-10 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/50 transition-colors'>
//         <BsChevronCompactRight onClick={nextSlide} size={30} />
//       </div>

//       {/* Manual Indicator Dots */}
//       <div className='flex justify-center py-4 gap-2'>
//         {slides.map((slide, slideIndex) => (
//           <div
//             key={slideIndex}
//             onClick={() => setCurrentIndex(slideIndex)}
//             className={`text-2xl cursor-pointer transition-all duration-300 ${
//               currentIndex === slideIndex ? 'text-teal-600 scale-125' : 'text-slate-300 hover:text-teal-400'
//             }`}
//           >
//             <RxDotFilled />
//           </div>
//         ))}
//       </div>
      
//       {/* Mobile Hint (Hidden on Desktop) */}
//       <p className='md:hidden text-center text-xs text-slate-400 -mt-2 animate-pulse'>
//         Swipe left or right to view more
//       </p>
//     </div>
//   );
// }

// export default ImageSlider;



import React, { useState, useEffect } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';

// Import images from your local assets folder
import img1 from './assets/whylokraja.jpeg';
import img2 from './assets/missionpurposeimpact.jpeg';
import img3 from './assets/yourexperienceyourvision.jpeg';
import img4 from './assets/aboutssi.jpeg';

function ImageSlider() {
  const slides = [
    { url: img1, title: 'Why Lokraja Marathon' },
    { url: img2, title: 'Mission & Impact' },
    { url: img3, title: 'Your Experience' },
    { url: img4, title: 'About SSI' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextSlide();
    else if (distance < -minSwipeDistance) prevSlide();
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [currentIndex]);

  return (
    <div className='max-w-[1200px] h-[300px] sm:h-[450px] md:h-[600px] lg:h-[650px] w-full m-auto py-8 px-4 relative group select-none'>
      
      {/* WRAPPER DIV: Holds the <img>. 
          We use overflow-hidden to keep the rounded corners sharp.
      */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className='w-full h-full rounded-2xl overflow-hidden shadow-xl border border-slate-100'
      >
        {/* THE IMAGE TAG: 
            'object-fill' ensures the entire image is visible and fills the container exactly.
            'w-full h-full' ensures it matches your manual container size.
        */}
        <img 
          src={slides[currentIndex].url} 
          alt={slides[currentIndex].title}
          className='w-full h-full object-fill duration-500 transition-all ease-in-out cursor-grab active:cursor-grabbing'
        />
      </div>

      {/* Left Arrow */}
      <div className='hidden md:group-hover:block absolute top-[50%] -translate-y-[-50%] left-10 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/50 transition-colors'>
        <BsChevronCompactLeft onClick={prevSlide} size={30} />
      </div>

      {/* Right Arrow */}
      <div className='hidden md:group-hover:block absolute top-[50%] -translate-y-[-50%] right-10 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/50 transition-colors'>
        <BsChevronCompactRight onClick={nextSlide} size={30} />
      </div>

      {/* Manual Indicator Dots */}
      <div className='flex justify-center py-4 gap-2'>
        {slides.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => setCurrentIndex(slideIndex)}
            className={`text-2xl cursor-pointer transition-all duration-300 ${
              currentIndex === slideIndex ? 'text-teal-600 scale-125' : 'text-slate-300 hover:text-teal-400'
            }`}
          >
            <RxDotFilled />
          </div>
        ))}
      </div>
      
      <p className='md:hidden text-center text-xs text-slate-400 -mt-2 animate-pulse'>
        Swipe left or right to view more
      </p>
    </div>
  );
}

export default ImageSlider;