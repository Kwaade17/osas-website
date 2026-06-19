import { useEffect } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import TopBar from "./components/TopBar"
import Home from "./pages/Home"
import Footer from "./components/Footer"
import StoryViewer from "./components/StoryViewer"

import { library } from '@fortawesome/fontawesome-svg-core'

import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

import AboutViewer from "./components/AboutViewer"
import OrgChart from "./components/OrgChart"

library.add(fas, fab)

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [location.pathname])

  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <div className="sticky inset-0 z-50 bg-white">
        <TopBar />
      </div>
      <div className="bg-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stories/:storyId" element={<StoryViewer />} />
          <Route path="/about-osas" element={<AboutViewer />} />
          <Route path="/org-chart" element={<OrgChart />} />
        </Routes>
        <Footer />
      </div>
    </>
  )
}

export default App