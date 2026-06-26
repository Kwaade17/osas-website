import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "../../supabaseClient";

export default function SlideFeature() {
  const [services, setServices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [loading, setLoading] = useState(true);

  // Safe fallback static data
  const baseStaticServices = [
    { id: "good-moral", title: "Good Moral", description: "Certifications and character clearance requests.", icon: "file" },
    { id: "student-discipline", title: "Student Discipline", description: "Handbooks, guidelines, and conduct support.", icon: "message" },
    { id: "guidance-counseling", title: "Guidance Counseling", description: "Academic, personal, and career consultation.", icon: "message" },
    { id: "health-checkup", title: "Health and Checkup", description: "Medical services and campus clinic updates.", icon: "kit-medical" }
  ];

  useEffect(() => {
    fetchCloudServices();
  }, []);

  // Fetch live Services from Supabase
  const fetchCloudServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("type", "Service")
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      setServices(data);
    } else {
      setServices(baseStaticServices); // Fallback to safe static baseline
    }
    setLoading(false);
  };

  const baseList = services.length > 0 ? services : baseStaticServices;

  // Clone the first 3 items to the end of the array to make the desktop carousel scroll seamlessly
  const extendedServices = [...baseList, ...baseList.slice(0, 3)];

  useEffect(() => {
    if (baseList.length === 0) return;
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 3000); // 3-second auto scroll

    return () => clearInterval(timer);
  }, [baseList.length]);

  const handleTransitionEnd = () => {
    if (currentIndex >= baseList.length) {
      setIsTransitioning(false);
      setCurrentIndex(0);
    }
  };

  const activeDotIndex = baseList.length > 0 ? currentIndex % baseList.length : 0;

  // Helper to render icon cleanly (react element or fontawesome string name)
  const renderIcon = (iconName) => {
    const cleanName = String(iconName || "file").replace("fa-", "");
    return <FontAwesomeIcon icon={["fas", cleanName]} className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div id="services" className="w-full flex flex-col items-center space-y-6 overflow-hidden">
      
      {/* Section Header (Now inside SlideFeature so it aligns with Announcements & Stories!) */}
      <div className="w-full text-center sm:text-left">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
          Services Offered
        </h2>
        <p className="text-sm text-slate-400 font-semibold mt-1">
          Explore campus services, character clearances, and medical updates.
        </p>
      </div>

      {/* --- DESKTOP VIEW (sm:block hidden) --- */}
      <div className="hidden sm:block w-full overflow-hidden px-1 py-4">
        <div 
          className={`flex py-4 -my-4 ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
          style={{ transform: `translateX(-${currentIndex * 33.3333}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedServices.map((service, index) => {
            // Checks if it's the static baseline to prevent broken routing
            const isStaticId = service.id === "good-moral" || service.id === "student-discipline" || service.id === "guidance-counseling" || service.id === "health-checkup";
            const targetPath = isStaticId ? "/about-osas" : `/posts/${service.id}`;

            return (
              <Link
                to={targetPath}
                key={`desktop-${index}`}
                className="w-1/3 flex-shrink-0 px-3 h-48 block text-left"
              >
                <div className="h-full bg-white border border-slate-100 shadow-sm rounded-2xl p-6 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer">
                  <div className="space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                      {renderIcon(service.icon)}
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg leading-snug group-hover:text-emerald-700 transition-colors">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2">
                    {service.description || service.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* --- MOBILE VIEW (sm:hidden) --- */}
      <div className="relative w-full max-w-sm h-52 flex items-center justify-center overflow-hidden px-4 sm:hidden">
        {baseList.map((service, index) => {
          const isActive = index === activeDotIndex;
          const isNext = index === (activeDotIndex + 1) % baseList.length;
          const isPrev = index === (activeDotIndex - 1 + baseList.length) % baseList.length;
          
          const isStaticId = service.id === "good-moral" || service.id === "student-discipline" || service.id === "guidance-counseling" || service.id === "health-checkup";
          const targetPath = isStaticId ? "/about-osas" : `/posts/${service.id}`;

          if (!isActive && !isNext && !isPrev) return null;

          return (
            <Link
              to={targetPath}
              key={`mobile-${index}`}
              className={`absolute w-72 h-48 bg-white border border-slate-100 shadow-md rounded-2xl p-6 flex flex-col justify-between transition-all duration-700 ease-in-out cursor-pointer block text-left ${
                isActive 
                  ? "opacity-100 scale-100 z-20 translate-x-0" 
                  : isNext 
                  ? "opacity-0 scale-90 z-10 translate-x-full pointer-events-none" 
                  : "opacity-0 scale-90 z-10 -translate-x-full pointer-events-none"
              }`}
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                  {renderIcon(service.icon)}
                </div>
                <h3 className="font-bold text-gray-800 text-lg leading-snug">
                  {service.title}
                </h3>
              </div>
              <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2">
                {service.description || service.desc}
              </p>
            </Link>
          );
        })}
      </div>

      {/* --- Indicator Dots --- */}
      <div className="flex space-x-2 pt-2">
        {baseList.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setCurrentIndex(index);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeDotIndex ? "w-6 bg-emerald-600" : "w-2 bg-slate-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        </div>
      );
    }