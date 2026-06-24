import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function SlideFeature() {
  const baseServices = [
    { title: "Good Moral", desc: "Certifications and character clearance requests.", icon: <FontAwesomeIcon icon="fa-file" /> },
    { title: "Student Discipline", desc: "Handbooks, guidelines, and conduct support.", icon: <FontAwesomeIcon icon="fa-message" /> },
    { title: "Guidance Counseling", desc: "Academic, personal, and career consultation.", icon: <FontAwesomeIcon icon="fa-message" /> },
    { title: "Health and Checkup", desc: "Medical services and campus clinic updates.", icon: <FontAwesomeIcon icon="fa-kit-medical" /> }
  ]

  // Clone the first 3 items to the end so there is always a card to slide into on desktop
  const extendedServices = [...baseServices, ...baseServices.slice(0, 3)]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true)
      setCurrentIndex((prevIndex) => prevIndex + 1)
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  // Handle seamless reset back to 0
  const handleTransitionEnd = () => {
    if (currentIndex >= baseServices.length) {
      setIsTransitioning(false)
      setCurrentIndex(0)
    }
  }

  // Active indicator dot calculation
  const activeDotIndex = currentIndex % baseServices.length

  return (
    <div id="services" className="w-full flex flex-col items-center space-y-6 overflow-hidden">
      
      {/* --- DESKTOP VIEW (sm:block hidden) --- */}
      <div className="hidden sm:block w-full overflow-hidden px-1 py-4">
        <div 
          className={`flex py-4 -my-4 ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
          // Each card takes up exactly 1/3 of the container width (33.333%)
          style={{ transform: `translateX(-${currentIndex * 33.3333}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedServices.map((service, index) => (
            <div
              key={`desktop-${index}`}
              className="w-1/3 flex-shrink-0 px-3 h-48"
            >
              <div className="h-full bg-white border border-slate-100 shadow-sm rounded-2xl p-6 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                    {service.icon}
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg leading-snug">
                    {service.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2">
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MOBILE VIEW (sm:hidden) --- */}
      <div className="relative w-full max-w-sm h-52 flex items-center justify-center overflow-hidden px-4 sm:hidden">
        {baseServices.map((service, index) => {
          const isActive = index === activeDotIndex
          const isNext = index === (activeDotIndex + 1) % baseServices.length
          const isPrev = index === (activeDotIndex - 1 + baseServices.length) % baseServices.length

          if (!isActive && !isNext && !isPrev) return null

          return (
            <div
              key={`mobile-${index}`}
              className={`absolute w-72 h-48 bg-white border border-slate-100 shadow-md rounded-2xl p-6 flex flex-col justify-between transition-all duration-700 ease-in-out ${
                isActive 
                  ? "opacity-100 scale-100 z-20 translate-x-0" 
                  : isNext 
                  ? "opacity-0 scale-90 z-10 translate-x-full pointer-events-none" 
                  : "opacity-0 scale-90 z-10 -translate-x-full pointer-events-none"
              }`}
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                  {service.icon}
                </div>
                <h3 className="font-bold text-gray-800 text-lg leading-snug">
                  {service.title}
                </h3>
              </div>
              <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2">
                {service.desc}
              </p>
            </div>
          )
        })}
      </div>

      {/* --- Indicator Dots --- */}
      <div className="flex space-x-2 pt-2">
        {baseServices.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true)
              setCurrentIndex(index)
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeDotIndex ? "w-6 bg-emerald-600" : "w-2 bg-slate-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  )
}