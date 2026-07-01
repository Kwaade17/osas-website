import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; 
import AboutViewer from "./components/AboutViewer";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardTemp from "./pages/DashboardTemp";
import PostReader from "./pages/PostReader";
import ProtectedRoute from "./components/ProtectedRoute";

// IMPORT THE DYNAMIC PUBLIC REQUEST FORM
import GoodMoralRequest from "./pages/GoodMoralRequest";

// IMPORT YOUR HEADER & FOOTER
import TopBar from "./components/TopBar"; 
import Footer from "./components/Footer";           

// THE PUBLIC LAYOUT WRAPPER
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50/20">
      <TopBar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

// --- OPTIMIZED FONTAWESOME IMPORTS ---
// We import only the 16 specific icons your project actually uses!
import { library } from "@fortawesome/fontawesome-svg-core";
import { 
  faChevronLeft, 
  faShieldHalved, 
  faTriangleExclamation, 
  faFolderOpen, 
  faRightFromBracket, 
  faXmark, 
  faPlus, 
  faTrash, 
  faBullhorn, 
  faBookOpen, 
  faImages, 
  faRotate, 
  faBars, 
  faLock, 
  faHourglassHalf, 
  faArrowRight,
  faFile,
  faMessage,
  faKitMedical,
  faUserGraduate,
  faBuilding,
  faEye,
  faBullseye,
  faCalendarDays,
  faCalendarCheck,
  faCalendarDay,
  faCircleCheck,
  faCertificate
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";

// Register only these 20 icons in the global library cache
library.add(
  faChevronLeft, 
  faShieldHalved, 
  faTriangleExclamation, 
  faFolderOpen, 
  faRightFromBracket, 
  faXmark, 
  faPlus, 
  faTrash, 
  faBullhorn, 
  faBookOpen, 
  faImages, 
  faRotate, 
  faBars, 
  faLock, 
  faHourglassHalf, 
  faArrowRight,
  faFile,
  faMessage,
  faKitMedical,
  faUserGraduate,
  faBuilding,
  faEye,
  faBullseye,
  faCalendarDays,
  faCalendarCheck,
  faCalendarDay,
  faCertificate,
  faCircleCheck,
  faFacebook
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about-osas" element={<PublicLayout><AboutViewer /></PublicLayout>} />
      <Route path="/posts/:id" element={<PublicLayout><PostReader /></PublicLayout>} />
      <Route path="/clearance/good-moral-request" element={<GoodMoralRequest />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardTemp />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}