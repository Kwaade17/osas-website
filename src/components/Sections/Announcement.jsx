import { announcementsList } from "../../assets/announcementsList"

export default function Announcement() {
  // Safe evaluation check to see if announcements actually exist
  const hasAnnouncements = Array.isArray(announcementsList) && announcementsList.length > 0

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-6">
      
      {/* Dynamic Header: Adjusts based on the data state */}
      <h2 className="text-2xl font-black text-gray-800 tracking-tight mb-6 text-center sm:text-left">
        {hasAnnouncements ? "Latest Announcements" : "Announcements"}
      </h2>

      {hasAnnouncements ? (
        /* --- DYNAMIC GRID FEED (When data exists) --- */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcementsList.map((item, index) => (
            <div 
              key={item.id || index}
              className="flex flex-col bg-white border border-slate-100 rounded-2xl shadow-xs p-6 justify-between space-y-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="space-y-2">
                {/* Badge Status Row */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${item.badgeColor || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                    {item.tag}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{item.date}</span>
                </div>

                {/* Announcement Title */}
                <h3 className="font-extrabold text-gray-800 text-base md:text-lg leading-snug group-hover:text-emerald-700 transition-colors duration-200">
                  {item.title}
                </h3>

                {/* Announcement Content */}
                <p className="text-slate-500 font-medium text-xs md:text-sm leading-relaxed">
                  {item.content}
                </p>
              </div>

              {/* Bottom Brand Accent Line */}
              <div className="w-full h-1 bg-gradient-to-r from-emerald-500/20 to-transparent rounded-full pt-1" />
            </div>
          ))}
        </div>
      ) : (
        /* --- YOUR EXACT INTENDED FALLBACK CONTAINER (When array is empty) --- */
        <div className="flex flex-col bg-slate-100/80 rounded-2xl border border-slate-200/60 shadow-xs p-4 space-y-3 animate-in fade-in duration-300">
          
          {/* Header Section with Muted Megaphone Icon */}
          <div className="flex flex-col items-center justify-center pt-2 space-y-1">
            <svg 
              className="w-8 h-8 text-slate-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15.574 15.786a3.953 3.953 0 01-5.147 0M12 13a4 4 0 00-4-4V7a4 4 0 018 0v2a4 4 0 00-4 4zM5.337 9.172l-.722-.516a1 1 0 01-.228-1.4l1.15-1.61a1 1 0 011.4-.228l.722.516a1 1 0 01.228 1.4l-1.15 1.61a1 1 0 01-1.4.228zM18.663 9.172l.722-.516a1 1 0 00.228-1.4l-1.15-1.61a1 1 0 00-1.4-.228l-.722.516a1 1 0 00-.228 1.4l1.15 1.61a1 1 0 001.4.228z" 
              />
            </svg>
            <span className="text-lg font-bold text-center text-slate-500 tracking-wide">
              No New Announcements
            </span>
          </div>

          {/* Inner Description Card */}
          <span className="rounded-lg bg-white p-6 md:p-8 text-sm md:text-base text-slate-600 shadow-2xs leading-relaxed text-center sm:text-left">
            There are no active announcements at the moment. Important updates regarding enrollment, scholarships, and student activities will be posted here as they drop.
          </span>

        </div>
      )}
    </div>
  )
}