import HeroOne from "../components/sections/HeroOne"
import Announcement from "../components/sections/Announcement"
import SlideFeature from "../components/sections/SlideFeature"
import Stories from "../components/sections/Stories"
import About from "../components/About"
import Contact from "../components/Contact"

export default function Home() {
  return(
    <main>

      <HeroOne />

      <div className="w-full max-w-4xl mx-auto p-4 md:p-8 space-y-3">
        <Announcement />
      </div>

      <div className="w-full max-w-4xl mx-auto p-4 md:p-8 space-y-3 border-t-2 border-slate-200">
        <h2 className="text-xl font-bold text-gray-800 tracking-wide px-1">
          Services Offer
        </h2>
        <SlideFeature />
      </div>

      <div className="w-full p-4 md:p-8 space-y-3 border-t-2 border-slate-200">
        <Stories />
      </div>

      <div className="w-full p-4 md:p-8 space-y-3 border-t-2 border-slate-200">
        <About />
      </div>

      <div className="w-full p-4 md:p-8 space-y-3 border-t-2 border-slate-200">
        <Contact />
      </div>

    </main>
  )
}