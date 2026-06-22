import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'
import OSAS from '/osas-logo.png'

export default function TopBar() {
  const [isToggle, setIsToggle] = useState(false)
  const location = useLocation()

  // Custom active state checker for section hashes
  const checkActive = (path, hash = '') => {
    return location.pathname === path && location.hash === hash
  }

  // Adapted helper class to process active section styling cleanly
  const getNavLinkClass = (path, hash = '') => {
    const isActive = checkActive(path, hash)
    return `px-3 py-1.5 rounded-md transition-colors duration-200 ease-in-out text-left block ${
      isActive ? 'bg-emerald-50 text-emerald-900 font-extrabold' : 'hover:bg-gray-100 text-emerald-800'
    }`
  }

  return (
    <nav className='relative w-full bg-white z-50'>
      {/* Main Top Bar Wrapper */}
      <div className='flex justify-between items-center shadow-xs px-4 py-3 md:px-8'>
        
        {/* Left Side: Brand Logo and Title */}
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

        {/* Desktop Navigation Menu (HashLink handles cross-page smooth jumps) */}
        <div className='hidden sm:flex items-center text-sm font-bold space-x-2'>
          <HashLink smooth className={getNavLinkClass('/', '')} to="/#">Home</HashLink>
          <HashLink smooth className={getNavLinkClass('/', '#about')} to="/#about">About</HashLink>
          <HashLink smooth className={getNavLinkClass('/', '#services')} to="/#services">Services</HashLink>
          <HashLink smooth className={getNavLinkClass('/', '#contact')} to="/#contact">Contact</HashLink>
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
        <div className='absolute top-full left-0 w-full bg-white flex flex-col p-4 space-y-1 text-sm font-bold shadow-md border-t border-gray-100 sm:hidden animate-in fade-in slide-in-from-top-2 duration-200'>
          <HashLink smooth onClick={() => setIsToggle(false)} className={getNavLinkClass('/', '')} to="/#">Home</HashLink>
          <HashLink smooth onClick={() => setIsToggle(false)} className={getNavLinkClass('/', '#about')} to="/#about">About</HashLink>
          <HashLink smooth onClick={() => setIsToggle(false)} className={getNavLinkClass('/', '#services')} to="/#services">Services</HashLink>
          <HashLink smooth onClick={() => setIsToggle(false)} className={getNavLinkClass('/', '#contact')} to="/#contact">Contact</HashLink>
        </div>
      )}
    </nav>
  )
}