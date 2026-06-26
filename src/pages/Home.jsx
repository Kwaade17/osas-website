import React from "react";
import HeroOne from "../components/Sections/HeroOne";
import Announcement from "../components/Sections/Announcement";
import SlideFeature from "../components/Sections/SlideFeature";
import Stories from "../components/Sections/Stories";
import About from "../components/About";
import Contact from "../components/Contact";

export default function Home() {
  return (
    <main className="space-y-4">
      
      <HeroOne />

      <div className="w-full p-4 md:p-8 space-y-3">
        <Announcement />
      </div>

      {/* FIXED: Removed the max-w-4xl constraint and hardcoded header so SlideFeature can align beautifully! */}
      <div className="w-full p-4 md:p-8 space-y-3 border-t-2 border-slate-100">
        <SlideFeature />
      </div>

      <div className="w-full p-4 md:p-8 space-y-3 border-t-2 border-slate-100">
        <Stories />
      </div>

      <div className="w-full p-4 md:p-8 space-y-3 border-t-2 border-slate-100">
        <About />
      </div>

      <div className="w-full p-4 md:p-8 space-y-3 border-t-2 border-slate-100">
        <Contact />
      </div>

    </main>
  );
}