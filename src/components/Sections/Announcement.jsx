import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "../../supabaseClient";

export default function Announcement() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("type", "Announcement")
        .order("created_at", { ascending: false });

      if (!error) {
        setAnnouncements(data);
      }
    };
    fetchAnnouncements();
  }, []);

  const hasAnnouncements = announcements.length > 0;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-6">
      
      {/* Section Header */}
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
          {hasAnnouncements ? "Latest Announcements" : "Announcements"}
        </h2>
        <p className="text-sm text-slate-400 font-semibold mt-1">
          Stay up to date with official releases, clearances, and college notices.
        </p>
      </div>

      {hasAnnouncements ? (
        <>
          {/* --- SMART LAYOUT 1: SINGLE BANNER (Title & Cover Image only!) --- */}
          {announcements.length === 1 && (
            <div className="flex justify-center w-full">
              <Link 
                to={`/posts/${announcements[0].id}`}
                className="flex flex-col md:flex-row bg-white border-l-4 border-l-emerald-600 border border-slate-200 shadow-md rounded-[28px] overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 max-w-3xl w-full text-left cursor-pointer group min-h-[220px]"
              >
                {/* Cover Image Container */}
                <div className="w-full md:w-1/2 h-52 md:h-auto overflow-hidden relative border-r border-slate-100 flex-shrink-0">
                  {announcements[0].cover_image ? (
                    <img 
                      src={announcements[0].cover_image} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-in-out" 
                    />
                  ) : (
                    /* Fallback design */
                    <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-slate-900 flex flex-col items-center justify-center text-center p-6 text-white space-y-1.5 relative select-none">
                      <FontAwesomeIcon icon={["fas", "images"]} className="w-6 h-6 text-emerald-400/50 mb-1" />
                      <span className="font-extrabold text-[10px] uppercase tracking-wider text-emerald-100">No Cover Image</span>
                      <span className="text-[10px] text-emerald-300/60 max-w-xs text-center">Published as a text-only notice.</span>
                    </div>
                  )}
                </div>

                {/* Text Container */}
                <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 shadow-xs">
                        Important Notice
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{announcements[0].date}</span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-lg md:text-xl leading-snug group-hover:text-emerald-700 transition-colors duration-200 line-clamp-3">
                      {announcements[0].title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-end pt-4 border-t border-slate-100/60">
                    <span className="text-xs font-bold text-emerald-600 group-hover:text-emerald-700 flex items-center gap-1.5 group/btn">
                      <span>Read Full Notice</span>
                      <FontAwesomeIcon icon={["fas", "arrow-right"]} className="w-3 h-3 transform group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* --- SMART LAYOUT 2: RESPONSIVE GRID (If there are multiple announcements) --- */}
          {announcements.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {announcements.map((item, index) => (
                <Link 
                  to={`/posts/${item.id}`}
                  key={item.id || index}
                  className="flex flex-col bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] justify-between h-[300px] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group text-left cursor-pointer rounded-3xl"
                >
                  {/* Cover Image Container */}
                  <div className="w-full h-36 overflow-hidden border-b border-slate-100 relative flex-shrink-0">
                    {item.cover_image ? (
                      <img src={item.cover_image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-slate-900 flex flex-col items-center justify-center text-center p-4 text-white space-y-1 relative select-none">
                        <FontAwesomeIcon icon={["fas", "images"]} className="w-5 h-5 text-emerald-400/50" />
                        <span className="font-bold text-[9px] uppercase tracking-wider text-emerald-100">No Cover Image</span>
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-100/50">
                          Announcement
                        </span>
                        <span className="text-xs font-semibold text-slate-400">{item.date}</span>
                      </div>

                      <h3 className="font-extrabold text-gray-800 text-sm md:text-base leading-snug group-hover:text-emerald-700 transition-colors duration-200 line-clamp-2">
                        {item.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100/60 mt-auto">
                      <span className="text-[10px] font-bold text-slate-400">{item.date}</span>
                      <span className="text-xs font-bold text-emerald-600 group-hover:text-emerald-700 flex items-center gap-1.5">
                        <span>Read Announcement</span>
                        <FontAwesomeIcon icon={["fas", "arrow-right"]} className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col bg-slate-100/80 rounded-2xl border border-slate-200/60 shadow-xs p-4 space-y-3 animate-in fade-in duration-300">
          <div className="flex flex-col items-center justify-center pt-2 space-y-1">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.574 15.786a3.953 3.953 0 01-5.147 0M12 13a4 4 0 00-4-4V7a4 4 0 018 0v2a4 4 0 00-4 4zM5.337 9.172l-.722-.516a1 1 0 01-.228-1.4l1.15-1.61a1 1 0 011.4-.228l.722.516a1 1 0 01.228 1.4l-1.15 1.61a1 1 0 01-1.4.228zM18.663 9.172l.722-.516a1 1 0 00.228-1.4l-1.15-1.61a1 1 0 00-1.4-.228l-.722.516a1 1 0 00-.228 1.4l1.15 1.61a1 1 0 001.4.228z" />
            </svg>
            <span className="text-lg font-bold text-center text-slate-500 tracking-wide">No New Announcements</span>
          </div>
          <span className="rounded-lg bg-white p-6 md:p-8 text-sm md:text-base text-slate-600 shadow-2xs leading-relaxed text-center sm:text-left">
            There are no active announcements at the moment. Important updates regarding enrollment, scholarships, and student activities will be posted here as they drop.
          </span>
        </div>
      )}
    </div>
  );
}