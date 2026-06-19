import { useState } from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { storiesList } from "../../assets/storiesList"

// 👇 FIX: Reusable Empty State Component moved OUTSIDE of the render scope
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
)

export default function Stories() {
  // Pagination States
  const [desktopPage, setDesktopPage] = useState(1)
  const [mobilePage, setMobilePage] = useState(1)

  const itemsPerDesktopPage = 3 // 1 Featured + 2 Side items
  const itemsPerMobilePage = 3  // Strict 3 vertical rows

  // --- PAGINATION MATHEMATICS ---
  const totalDesktopPages = Math.ceil((storiesList?.length || 0) / itemsPerDesktopPage)
  const totalMobilePages = Math.ceil((storiesList?.length || 0) / itemsPerMobilePage)

  // Slicing data chunks for current pages safely
  const currentDesktopStories = (storiesList || []).slice(
    (desktopPage - 1) * itemsPerDesktopPage,
    desktopPage * itemsPerDesktopPage
  )
  const currentMobileStories = (storiesList || []).slice(
    (mobilePage - 1) * itemsPerMobilePage,
    mobilePage * itemsPerMobilePage
  )

  // 👇 SAFETY GUARD: Use fallback objects if the array slices resolve as empty
  const featuredStory = currentDesktopStories[0] || null
  const sideStories = currentDesktopStories.slice(1)

  return (
    <div id="stories" className="w-full max-w-6xl mx-auto px-4 md:px-6 py-6 scroll-mt-20">
      
      <h2 className="text-2xl font-black text-gray-800 text-center tracking-tight mb-6">Stories & Updates</h2>

      {/* --- DESKTOP VIEW --- */}
      <div className="hidden sm:block space-y-6">
        {featuredStory ? (
          <div className="grid grid-cols-3 gap-6 min-h-[388px]">
            
            {/* Left Side: Featured Story (Spans 2 columns) */}
            <div className="col-span-2 group bg-white border border-slate-100 shadow-xs rounded-2xl overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-full h-64 overflow-hidden relative">
                <img 
                  src={featuredStory.image} 
                  alt={featuredStory.title} 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-in-out"
                />
                <span className="absolute top-4 left-4 text-xs font-bold text-emerald-700 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-md uppercase tracking-wider shadow-xs">
                  {featuredStory.tag}
                </span>
              </div>
              
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-xs font-medium text-slate-400">
                    <span>{featuredStory.date}</span>
                    <span>•</span>
                    <span>{featuredStory.readTime}</span>
                  </div>
                  <h3 className="font-extrabold text-gray-800 text-2xl leading-snug group-hover:text-emerald-700 transition-colors duration-300">
                    {featuredStory.title}
                  </h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-2">
                    {featuredStory.excerpt}
                  </p>
                </div>
                
                <Link 
                  to={`/stories/${featuredStory.id}`}
                  className="self-start text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1 cursor-pointer group/btn"
                >
                  <span>Read Full Story</span>
                  <svg className="w-4 h-4 transform group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Side: Secondary Stories Feed Stack */}
            <div className="col-span-1 flex flex-col gap-5">
              {sideStories.map((story, index) => (
                <Link 
                  to={`/stories/${story.id}`}
                  key={`desktop-side-${index}`}
                  className="group bg-white border border-slate-100 shadow-xs rounded-2xl p-4 flex flex-col justify-between h-[184px] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer text-left block"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {story.tag}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">{story.readTime}</span>
                    </div>
                    <h4 className="font-bold text-gray-800 text-base leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors duration-300">
                      {story.title}
                    </h4>
                    <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">
                      {story.excerpt}
                    </p>
                  </div>

                  <div className="text-xs font-bold text-emerald-600 group-hover:text-emerald-700 flex items-center space-x-1 pt-2">
                    <span>Read article</span>
                    <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
              {sideStories.length === 0 && <div className="flex-1 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200" />}
            </div>

          </div>
        ) : (
          <EmptyStoriesFallback />
        )}

        {/* Desktop Pagination Actions Bar */}
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
            {currentMobileStories.map((story, index) => (
              <Link
                to={`/stories/${story.id}`}
                key={`mobile-story-${index}`}
                className="w-full bg-white border border-slate-100 shadow-xs rounded-2xl p-4 flex gap-4 text-left block"
              >
                <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-50 self-center">
                  <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {story.tag}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">{story.readTime}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm leading-snug tracking-tight line-clamp-2">
                      {story.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium line-clamp-2 leading-relaxed mt-1">
                    {story.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyStoriesFallback />
        )}

        {/* Mobile Pagination Control Row */}
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
  )
}