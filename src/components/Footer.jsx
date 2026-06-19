// // 1. CONFIGURATION ARRAYS (Easy to edit!)
// const quickNavigation = [
//   { name: "Home", href: "#home" },
//   { name: "About OSAS", href: "#about" },
//   { name: "Our Services", href: "#services" },
//   { name: "Connect with Us", href: "#contact" },
// ];

const studentPortals = [
  { name: "LCCC Official Website", href: "https://lacarlotacitycollege.edu.ph" },
  { name: "Student Portal", href: "https://lcccautomate.net/alams/signin.php" }
];

// const supportServices = [
//   { name: "Guidance & Counseling", href: "#guidance" },
//   { name: "Supreme Student Council (SSC)", href: "#ssc" },
//   { name: "Clinic & Health Services", href: "#clinic" },
// ];

export default function Footer() {
  return (
    <footer className="w-full bg-emerald-950 text-emerald-200 border-t-4 border-emerald-700">
      <div className="w-full max-w-6xl mx-auto px-6 py-12 flex flex-col space-y-10">
        
        {/* Top Section: Multi-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
          
          {/* Column 1: Brand & Office Info */}
          <div className="space-y-3">
            <h2 className="text-white font-extrabold text-2xl tracking-wide">
              OSAS
            </h2>
            <p className="text-sm font-semibold text-emerald-400 leading-tight">
              Office of the Student Affairs and Services
            </p>
            <div className="text-xs text-emerald-300/80 space-y-1 pt-2">
              <p className="text-white font-semibold">La Carlota City College</p>
              <p>Gurrea Street, La Carlota City,</p>
              <p>Negros Occidental, Philippines</p>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          {/* <div className="space-y-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">
              Quick Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              {quickNavigation.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="hover:text-white hover:underline transition-all">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Column 3: Student Resources */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">
              Student Resources
            </h3>
            <ul className="space-y-2 text-xs">
              {studentPortals.map((link, idx) => (
                <li key={idx}>
                  {/* If linking to the main LCCC site, open in new tab */}
                  <a 
                    href={link.href} 
                    target={link.href.startsWith("http") ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="hover:text-white hover:underline transition-all"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Student Support */}
          {/* <div className="space-y-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">
              Support Services
            </h3>
            <ul className="space-y-2 text-xs">
              {supportServices.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="hover:text-white hover:underline transition-all">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div> */}

        </div>

        {/* Sharp Mint-Tinted Divider Line */}
        <div className="w-full h-px bg-emerald-800" />

        {/* Bottom Copyright Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-medium text-emerald-300/70">
          <p>© {new Date().getFullYear()} LCCC - OSAS. All rights reserved.</p>
          <p className="text-[11px] text-emerald-400/80 font-normal">
            Empowering student development through holistic support.
          </p>
        </div>

      </div>
    </footer>
  );
}