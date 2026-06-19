import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// 1. THE CONFIGURATION ARRAY (Easy to customize!)
// You can add, edit, or delete items here. The layout will adapt automatically.
const contactDetails = [
  {
    title: "Facebook Page",
    value: "OSAS La Carlota City College", // Replace with your actual Page name
    link: "https://www.facebook.com/lccc.osas", // Replace with your actual FB page URL
    // FontAwesome brands use "fab" prefix
    icon: ["fab", "facebook"], 
    bgColor: "bg-blue-50 text-blue-600", // Customize colors per card if you want
  },
  {
    title: "Office Location",
    value: "TETC Building, Room #5",
    link: null, // No link for location
    icon: ["fas", "building"],
    bgColor: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Office Hours",
    value: "Mon - Fri: 8:00 AM - 5:00 PM",
    link: null, // No link for hours
    icon: ["fas", "clock"],
    bgColor: "bg-emerald-50 text-emerald-600",
  }
]

export default function Contact() {
  return(
    <section id="contact" className="w-full max-w-6xl mx-auto px-4 md:px-6 scroll-mt-20 my-12">
      
      {/* Header Section */}
      <div className="w-full text-center max-w-xl mx-auto space-y-3 mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">
          Connect With Us
        </h2>
        <p className="text-sm font-medium text-gray-500">
          Have questions about clearances, events, or student support? Reach out directly.
        </p>
      </div>

      {/* Dynamic Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contactDetails.map((item, index) => {
          const isLink = !!item.link; // Checks if a link exists

          // Common card design wrapped in Tailwind transitions
          const cardClasses = `bg-white border border-slate-100 shadow-xs rounded-2xl p-6 flex flex-col items-center text-center space-y-3 transition-all duration-300 ${
            isLink ? "hover:shadow-md hover:border-blue-100 cursor-pointer" : ""
          }`;

          const CardContent = () => (
            <>
              {/* Dynamic Icon with Dynamic Colors */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${item.bgColor}`}>
                <FontAwesomeIcon icon={item.icon} />
              </div>
              <h4 className="font-bold text-gray-800 text-sm">
                {item.title}
              </h4>
              <p className={`text-xs font-semibold ${isLink ? "text-blue-600 hover:underline" : "text-slate-400"}`}>
                {item.value}
              </p>
            </>
          );

          // If there is a link, render an anchor tag. Otherwise, render a standard div.
          return isLink ? (
            <a 
              key={index} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={cardClasses}
            >
              <CardContent />
            </a>
          ) : (
            <div key={index} className={cardClasses}>
              <CardContent />
            </div>
          );
        })}
      </div>

    </section>
  )
}