import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; 
import AboutViewer from "./components/AboutViewer";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PostReader from "./pages/PostReader";
import ProtectedRoute from "./components/ProtectedRoute";

// IMPORT YOUR HEADER & FOOTER
import TopBar from "./components/TopBar"; // Double check this path!
import Footer from "./components/Footer";           // Double check this path!

// 1. THE PUBLIC LAYOUT WRAPPER (Includes TopBar & Footer with Sticky Spacing)
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50/20">
      <TopBar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

// Import FontAwesome library icons globally
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
library.add(fas, fab);

export default function App() {
  return (
    <Routes>
      {/* 
        2. PUBLIC ROUTES: 
        We wrap all user-facing views inside our PublicLayout so they get headers/footers automatically! 
      */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about-osas" element={<PublicLayout><AboutViewer /></PublicLayout>} />
      <Route path="/posts/:id" element={<PublicLayout><PostReader /></PublicLayout>} />

      {/* 
        3. PRIVATE ADMIN ROUTES: 
        These are completely standalone and have their own custom panel layouts! 
      */}
      <Route path="/login" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}