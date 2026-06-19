import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { aboutData } from "../assets/aboutData"

export default function About() {
  // Defensive guard in case data fails to load properly
  const content = aboutData || {
    title: "About OSAS",
    shortDescription: "The Office of the Student Affairs and Services...",
    buttonText: "Learn More About Our Office",
    linkTo: "/about-osas"
  }

  return (
    <section id="about" className="w-full max-w-6xl mx-auto px-4 md:px-6 py-6 scroll-mt-20">
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-10 flex flex-col space-y-6 text-center sm:text-left">
        
        {/* Text Content Block */}
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
            {content.title}
          </h2>
          <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed max-w-4xl">
            {content.shortDescription}
          </p>
        </div>

        {/* Action Button Link Block */}
        <div className="pt-2 flex justify-center sm:justify-start">
          <Link
            to={content.linkTo}
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-xs transition-all duration-200 group cursor-pointer active:scale-98"
          >
            <span>{content.buttonText}</span>
            <FontAwesomeIcon 
              icon={["fas", "arrow-right"]} 
              className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-200" 
            />
          </Link>
        </div>

      </div>
    </section>
  )
}