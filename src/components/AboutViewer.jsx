import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { aboutData } from "../assets/aboutData"
import OrganizationChart from "./OrgChart"

export default function AboutViewer() {
  const content = aboutData

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Back to Home Navigation Anchor Link */}
      <Link 
        to="/" 
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-emerald-700 transition-colors duration-200 group self-start cursor-pointer"
      >
        <FontAwesomeIcon 
          icon={["fas", "chevron-left"]} 
          className="w-2.5 h-2.5 transform group-hover:-translate-x-0.5 transition-transform duration-200" 
        />
        <span>Back to Home Layout</span>
      </Link>

      {/* Hero Section Banner */}
      <div className="space-y-3 border-b border-slate-100 pb-6 text-center sm:text-left">
        <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
          {content.title}
        </h1>
        <p className="text-sm font-bold text-emerald-700 tracking-wide uppercase">
          Office of the Student Affairs and Services
        </p>
        <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed mt-2">
          {content.shortDescription}
        </p>
      </div>

      {/* Vision & Mission Split Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-6 space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
            <FontAwesomeIcon icon={["fas", "eye"]} />
          </div>
          <h3 className="font-extrabold text-gray-800 text-lg">Our Vision</h3>
          <p className="text-slate-500 font-medium text-xs md:text-sm leading-relaxed">
            {content.vision}
          </p>
        </div>

        <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-6 space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
            <FontAwesomeIcon icon={["fas", "bullseye"]} />
          </div>
          <h3 className="font-extrabold text-gray-800 text-lg">Our Mission</h3>
          <p className="text-slate-500 font-medium text-xs md:text-sm leading-relaxed">
            {content.mission}
          </p>
        </div>
      </div>

      {/* Core Objectives Dynamic Row List */}
      <div className="space-y-4">
        <h3 className="font-black text-gray-800 text-xl tracking-tight text-center sm:text-left">
          Core Focus Objectives
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {content.objectives.map((obj, i) => (
            <div key={i} className="flex bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-x-4 items-start">
              <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-gray-800 text-sm md:text-base">{obj.title}</h4>
                <p className="text-slate-500 font-medium text-xs md:text-sm leading-relaxed">{obj.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Organizational Chart */}
      <OrganizationChart />

    </div>
  )
}