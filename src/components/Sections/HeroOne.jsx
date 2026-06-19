import { useState } from 'react'
import lcccBuilding from '/LCCC Building.jpg'

export default function HeroOne() {
  const slides = [
    {
      title: "WHAT ARE WE?",
      subtitle: "The official hub for student welfare, campus organizations, and holistic development at La Carlota City College.",
      overlay: "bg-emerald-800/80",
      image: lcccBuilding
    },
    {
      title: "STUDENT SERVICES",
      subtitle: "Access guidance counseling, health checkups, character clearances, and student welfare support all in one place.",
      overlay: "bg-teal-800/85",
      image: lcccBuilding
    },
    {
      title: "CAMPUS LIFE & ORGANIZATIONS",
      subtitle: "Empowering student leaders and vibrant organizations to build a dynamic, inclusive college community.",
      overlay: "bg-emerald-900/80",
      image: lcccBuilding
    }
  ]

  const [currentSlide, setCurrentSlide] = useState(0)

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className='w-full h-72 md:h-[420px] relative overflow-hidden bg-slate-900'>
      
      {/* Sliding Track Viewport */}
      <div 
        className='w-full h-full flex transition-transform duration-700 ease-in-out'
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="w-full h-full flex-shrink-0 relative flex items-center justify-center text-center"
          >
            {/* Background Image per slide */}
            <img 
              className='w-full h-full object-cover absolute inset-0' 
              src={slide.image} 
              alt='LCCC Background' 
            />
            
            {/* Dynamic Tint Overlay */}
            <div className={`w-full h-full absolute inset-0 ${slide.overlay}`} />
            
            {/* Text Copy Group */}
            <div className='relative z-10 flex flex-col items-center justify-center space-y-3 px-12 max-w-3xl mx-auto'>
              <h1 className='text-white text-3xl md:text-5xl font-extrabold tracking-wide drop-shadow-md uppercase leading-tight'>
                {slide.title}
              </h1>
              <p className='text-emerald-100 text-sm md:text-lg max-w-xl font-medium drop-shadow-sm leading-relaxed px-2'>
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* --- MANUAL NAVIGATION ARROWS --- */}
      <button 
        onClick={handlePrev}
        className='absolute top-1/2 -translate-y-1/2 left-3 md:left-6 z-30 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all cursor-pointer backdrop-blur-xs'
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button 
        onClick={handleNext}
        className='absolute top-1/2 -translate-y-1/2 right-3 md:right-6 z-30 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all cursor-pointer backdrop-blur-xs'
        aria-label="Next slide"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* --- BOTTOM DASH INDICATORS --- */}
      <div className='absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex space-x-2'>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  )
}