import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation, Link } from 'react-router-dom' // Imported standard Link
import { HashLink } from 'react-router-hash-link'
import OSAS from '/osas-logo.png'

export default function TopBar() {
  const [isToggle, setIsToggle] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const location = useLocation()

  // 1. DYNAMIC AUTH SYNC: Evaluates authentication whenever the page path shifts!
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("osas_token"));
    };
    checkAuth();
    
    // Listens to native browser storage modifications
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [location]);

  const checkActive = (path, hash = '') => {
    return location.pathname === path && location.hash === hash
  }

  const getNavLinkClass = (path, hash = '') => {
    const isActive = checkActive(path, hash)
    return `px-3 py-1.5 rounded-md transition-colors duration-200 ease-in-out text-left block ${
      isActive ? 'bg-emerald-50 text-emerald-900 font-extrabold' : 'hover:bg-gray-100 text-emerald-800'
    }`
  }

  return (
    <nav className='relative w-full bg-white z-50 border-b border-gray-100 shadow-xs'>
      <div className='flex justify-between items-center px-4 py-3 md:px-8'>
        
        {/* Brand Logo and Title */}
        <HashLink smooth to="/#" onClick={() => setIsToggle(false)} className='flex items-center space-x-3'>
          <img className='w-12 h-12 md:w-14 md:h-14 object-contain' src={OSAS} alt="OSAS Logo" />
        
          <div className='flex flex-col -space-y-1'>
            <span className='hidden sm:block font-bold text-emerald-800 text-sm md:text-base tracking-tight'>
              OFFICE OF THE STUDENT AFFAIRS AND SERVICES
            </span>
            <span className='block sm:hidden font-bold text-emerald-800 tracking-wider'>
              OSAS
            </span>
            <span className='text-xs font-medium text-gray-400 tracking-normal'>
              La Carlota City College
            </span>
          </div>
        </HashLink>

        {/* Desktop Navigation Menu */}
        <div className='hidden sm:flex items-center text-sm font-bold space-x-2'>
          <HashLink smooth className={getNavLinkClass('/', '')} to="/#">Home</HashLink>
          <HashLink smooth className={getNavLinkClass('/', '#services')} to="/#services">Services</HashLink>
          <HashLink smooth className={getNavLinkClass('/', '#about')} to="/#about">About</HashLink>
          <HashLink smooth className={getNavLinkClass('/', '#contact')} to="/#contact">Contact</HashLink>

          {/* 2. DYNAMIC AUTH ACTION BUTTON (Desktop) */}
          {isAuthenticated ? (
            <Link 
              to="/dashboard" 
              className="ml-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <FontAwesomeIcon icon={["fas", "folder-open"]} className="w-3 h-3" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="ml-4 border border-emerald-600/30 hover:bg-emerald-50 text-emerald-800 font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
            >
              <FontAwesomeIcon icon={["fas", "lock"]} className="w-3 h-3" />
              <span>Staff Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setIsToggle(!isToggle)} 
          className='sm:hidden flex text-xl p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer'
        >
          <FontAwesomeIcon icon={!isToggle ? "fa-bars" : "fa-xmark"} className="w-5 h-5" />
        </button>

      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {isToggle && (
        <div className='absolute top-full left-0 w-full bg-white flex flex-col p-4 space-y-1 text-sm font-bold shadow-md border-t border-gray-100 sm:hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50'>
          <HashLink smooth onClick={() => setIsToggle(false)} className={getNavLinkClass('/', '')} to="/#">Home</HashLink>
          <HashLink smooth onClick={() => setIsToggle(false)} className={getNavLinkClass('/', '#services')} to="/#services">Services</HashLink>
          <HashLink smooth onClick={() => setIsToggle(false)} className={getNavLinkClass('/', '#about')} to="/#about">About</HashLink>
          <HashLink smooth onClick={() => setIsToggle(false)} className={getNavLinkClass('/', '#contact')} to="/#contact">Contact</HashLink>
          
          {/* 3. DYNAMIC AUTH ACTION BUTTON (Mobile Drawer) */}
          {isAuthenticated ? (
            <Link 
              to="/dashboard" 
              onClick={() => setIsToggle(false)} 
              className="w-full text-center mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl block text-xs shadow-xs"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setIsToggle(false)} 
              className="w-full text-center mt-3 border border-emerald-600/30 hover:bg-emerald-50 text-emerald-800 font-bold py-2.5 rounded-xl block text-xs"
            >
              Staff Login Portal
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}