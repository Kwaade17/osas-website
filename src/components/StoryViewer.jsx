import { useParams, Link } from "react-router-dom"
import { storiesList } from "../assets/storiesList"

export default function StoryViewer() {
  const { storyId } = useParams()
  
  // Look up the specific story using the URL id slug
  const story = storiesList.find((s) => s.id === storyId)

  // Fallback state if the user types an invalid URL route parameter
  if (!story) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <h2 className="text-2xl font-extrabold text-gray-800">Story Not Found</h2>
        <p className="text-sm text-gray-500 max-w-xs">The article you are trying to access might have been moved or archived.</p>
        <Link to="/" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl transition-colors">
          Back to Home Hub
        </Link>
      </div>
    )
  }

  return (
    // Replace the opening <article> tag with this:
    <article className="w-full max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 
      animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out"
    >
      
      {/* Navigation Breadcrumb back out to home */}
      <Link to="/" className="inline-flex items-center space-x-1 text-xs font-bold text-slate-400 hover:text-emerald-600 uppercase tracking-wider mb-6 group transition-colors">
        <svg className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back to Stories</span>
      </Link>

      {/* Meta Header */}
      <div className="space-y-3 mb-6">
        <span className="inline-block text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
          {story.tag}
        </span>
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight md:leading-snug">
          {story.title}
        </h1>
        <div className="flex items-center space-x-3 text-xs md:text-sm font-medium text-slate-400 pt-1">
          <span>Published on {story.date}</span>
          <span>•</span>
          <span>{story.readTime}</span>
        </div>
      </div>

      {/* Hero Media Cover Image Slot */}
      <div className="w-full h-56 md:h-96 rounded-2xl overflow-hidden shadow-xs border border-slate-100 mb-8">
        <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
      </div>

      {/* Main Editorial Reading Body */}
      <div className="text-gray-700 text-base md:text-lg leading-relaxed space-y-6 font-medium whitespace-pre-line">
        {story.content}
      </div>

    </article>
  )
}