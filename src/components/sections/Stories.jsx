import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "../../supabaseClient";

// Reusable Empty State Component
const EmptyStoriesFallback = () => (
  <div className="w-full bg-slate-50/60 border border-dashed border-slate-200 rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in duration-300">
    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
      <FontAwesomeIcon icon={["fas", "book-open"]} />
    </div>
    <div className="space-y-1">
      <h4 className="font-bold text-gray-700 text-base">No Stories Published Yet</h4>
      <p className="text-xs font-medium text-slate-400 max-w-sm mx-auto">
        Important campus logs, student achievements, and OSAS feature articles will appear right here as soon as they drop.
      </p>
    </div>
  </div>
);

// Placeholder Card
const StayTunedCard = ({ index }) => (
  <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-5 flex flex-col justify-between h-[184px] text-left animate-in fade-in duration-500">
    <div className="space-y-1.5">
      <div className="flex items-center space-x-1.5 text-slate-400">
        <FontAwesomeIcon icon={["fas", "hourglass-half"]} className="w-3 h-3 text-emerald-600/50 animate-pulse" />
        <span className="text-[9px] font-bold uppercase tracking-wider">Upcoming Log #{index}</span>
      </div>
      <h4 className="font-bold text-slate-400 text-sm leading-snug">
        More campus updates are being drafted...
      </h4>
      <p className="text-[11px] text-slate-400/80 font-medium leading-relaxed line-clamp-2">
        Student achievements, activity diaries, and OSAS features are currently in review. Stay tuned!
      </p>
    </div>
    <span className="text-[10px] font-bold text-emerald-600/30 uppercase tracking-wider">Stay Tuned</span>
  </div>
);

// Decodes HTML entities and strips tags cleanly
const getPlainText = (htmlContent) => {
  if (!htmlContent) return "";
  const spacedHtml = htmlContent
    .replace(/<\/p>/g, " </p>")
    .replace(/<\/h[1-6]>/g, " </h>")
    .replace(/<br\s*\/?>/g, " <br/>");
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = spacedHtml;
  return (tempDiv.textContent || tempDiv.innerText || "").replace(/\s+/g, " ").trim();
};

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [desktopPage, setDesktopPage] = useState(1);
  const [mobilePage, setMobilePage] = useState(1);

  // Fetch live Stories from PostgreSQL
  useEffect(() => {
    const fetchStories = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("type", "Story")
        .order("created_at", { ascending: false });

      if (!error) {
        setStories(data);
      }
    };
    fetchStories();
  }, []);

  const itemsPerDesktopPage = 3; 
  const itemsPerMobilePage = 3;  

  const totalDesktopPages = Math.ceil((stories?.length || 0) / itemsPerDesktopPage);
  const totalMobilePages = Math.ceil((stories?.length || 0) / itemsPerMobilePage);

  const currentDesktopStories = (stories || []).slice(
    (desktopPage - 1) * itemsPerDesktopPage,
    desktopPage * itemsPerDesktopPage
  );
  const currentMobileStories = (stories || []).slice(
    (mobilePage - 1) * itemsPerMobilePage,
    mobilePage * itemsPerMobilePage
  );

  const featuredStory = currentDesktopStories[0] || null;
  const sideStories = currentDesktopStories.slice(1);

  const processStoryDetails = (story) => {
    if (!story) return { readTime: "1 min read", excerpt: "", hasImage: false, image: "" };

    const plainText = getPlainText(story.content); 
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
    const excerpt = plainText.slice(0, 140) + (plainText.length > 140 ? "..." : "");
    const image = story.cover_image || ""; // MAPPED to cover_image

    return { readTime, excerpt, hasImage: !!story.cover_image, image };
  };

  const sidePlaceholdersCount = featuredStory ? 2 - sideStories.length : 0;
  const mobilePlaceholdersCount = currentMobileStories.length > 0 ? 3 - currentMobileStories.length : 0;

  return (
    <div id="stories" className="w-full max-w-6xl mx-auto px-4 md:px-6 py-6 scroll-mt-20">
      
      {/* Title Header */}
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
          Stories & Campus Updates
        </h2>
        <p className="text-sm text-slate-400 font-semibold mt-1">
          Explore campus events, student highlights, and student development updates.
        </p>
      </div>

      {/* --- DESKTOP VIEW --- */}
      <div className="hidden sm:block space-y-6">
        {featuredStory ? (
          <div className="grid grid-cols-3 gap-6 min-h-[388px]">
            
            {/* Left Side: Featured Story */}
            {(() => {
              const details = processStoryDetails(featuredStory);
              return (
                <div className="col-span-2 group bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden flex flex-col hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300">
                  <div className="w-full h-64 overflow-hidden relative">
                    {details.hasImage ? (
                      <img 
                        src={details.image} 
                        alt="" 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-in-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-slate-900 flex flex-col items-center justify-center text-center p-6 text-white space-y-1.5 relative select-none">
                        <FontAwesomeIcon icon={["fas", "images"]} className="w-8 h-8 text-emerald-400/50 mb-1" />
                        <span className="font-extrabold text-xs uppercase tracking-wider text-emerald-100">No Cover Image</span>
                        <span className="text-[11px] text-emerald-300/60 max-w-xs">This update was published as a text-only report.</span>
                      </div>
                    )}
                    <span className="absolute top-4 left-4 text-xs font-bold text-emerald-700 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-md uppercase tracking-wider shadow-xs">
                      Featured Story
                    </span>
                  </div>
                  
                  <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 text-xs font-medium text-slate-400">
                        <span>{featuredStory.date}</span>
                        <span>•</span>
                        <span>{details.readTime}</span>
                      </div>
                      <h3 className="font-extrabold text-gray-800 text-2xl leading-snug group-hover:text-emerald-700 transition-colors duration-300">
                        {featuredStory.title}
                      </h3>
                      <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-2">
                        {details.excerpt}
                      </p>
                    </div>
                    
                    <Link 
                      to={`/posts/${featuredStory.id}`}
                      className="self-start text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1 cursor-pointer group/btn"
                    >
                      <span>Read Full Story</span>
                      <svg className="w-4 h-4 transform group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })()}

            {/* Right Side: Dynamic Secondary Stack */}
            <div className="col-span-1 flex flex-col gap-5">
              {/* 1. Real side stories */}
              {sideStories.map((story) => {
                const details = processStoryDetails(story);
                return (
                  <Link 
                    to={`/posts/${story.id}`}
                    key={story.id}
                    className="group bg-white border border-slate-100 border-l-4 border-l-emerald-600/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 flex flex-col justify-between h-[184px] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer text-left block rounded-2xl"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          Campus Story
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">{details.readTime}</span>
                      </div>
                      <h4 className="font-bold text-gray-800 text-base leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors duration-300">
                        {story.title}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">
                        {details.excerpt}
                      </p>
                    </div>

                    <div className="text-xs font-bold text-emerald-600 group-hover:text-emerald-700 flex items-center space-x-1 pt-2">
                      <span>Read article</span>
                      <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}

              {Array.from({ length: sidePlaceholdersCount }).map((_, index) => (
                <StayTunedCard key={`placeholder-${index}`} index={sideStories.length + index + 1} />
              ))}
            </div>

          </div>
        ) : (
          <EmptyStoriesFallback />
        )}

        {/* Desktop Pagination */}
        {totalDesktopPages > 1 && (
          <div className="flex justify-end items-center space-x-2 pt-2">
            <button
              disabled={desktopPage === 1}
              onClick={() => setDesktopPage((prev) => prev - 1)}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer text-gray-600"
            >
              <FontAwesomeIcon icon={["fas", "chevron-left"]} className="w-3 h-3" />
            </button>
            <span className="text-xs font-bold text-gray-500 px-2">
              Page {desktopPage} of {totalDesktopPages}
            </span>
            <button
              disabled={desktopPage === totalDesktopPages}
              onClick={() => setDesktopPage((prev) => prev + 1)}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer text-gray-600"
            >
              <FontAwesomeIcon icon={["fas", "chevron-right"]} className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* --- MOBILE VIEW --- */}
      <div className="flex flex-col sm:hidden space-y-4">
        {currentMobileStories.length > 0 ? (
          <div className="flex flex-col gap-4">
            {/* Real stories */}
            {currentMobileStories.map((story) => {
              const details = processStoryDetails(story);
              return (
                <Link
                  to={`/posts/${story.id}`}
                  key={story.id}
                  className="w-full bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 flex gap-4 text-left block rounded-2xl"
                >
                  <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-50 self-center">
                    {details.hasImage ? (
                      <img src={details.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                        <FontAwesomeIcon icon={["fas", "images"]} className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          Campus Story
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">{details.readTime}</span>
                      </div>
                      <h3 className="font-bold text-gray-800 text-sm leading-snug tracking-tight line-clamp-2">
                        {story.title}
                      </h3>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium line-clamp-2 leading-relaxed mt-1">
                      {details.excerpt}
                    </p>
                  </div>
                </Link>
              );
            })}

            {/* Mobile placeholders */}
            {Array.from({ length: mobilePlaceholdersCount }).map((_, index) => (
              <div key={`mobile-placeholder-${index}`} className="w-full bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-4 flex gap-4 text-left items-center opacity-60 animate-in fade-in duration-500">
                <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                  <FontAwesomeIcon icon={["fas", "hourglass-half"]} className="w-5 h-5 animate-pulse text-emerald-600/40" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Stay Tuned</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">More campus articles are coming soon!</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyStoriesFallback />
        )}

        {totalMobilePages > 1 && (
          <div className="flex justify-between items-center pt-2 px-1">
            <span className="text-xs font-bold text-gray-500">
              Showing {mobilePage} of {totalMobilePages} stories
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={mobilePage === 1}
                onClick={() => setMobilePage((prev) => prev - 1)}
                className="px-3 py-1.5 rounded-xl border border-slate-100 bg-white text-xs font-bold text-gray-600 shadow-2xs active:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                Prev
              </button>
              <button
                disabled={mobilePage === totalMobilePages}
                onClick={() => setMobilePage((prev) => prev + 1)}
                className="px-3 py-1.5 rounded-xl border border-slate-100 bg-white text-xs font-bold text-gray-600 shadow-2xs active:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}