import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from "./theme/Header";
import Footer from './theme/Footer'; 
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails'; 
import TVShows from './pages/TVShows'; 
import TVDetails from './pages/TVDetails'; // 🛠️ FIXED: Aapki actual file ka naam TVDetails.jsx hai
import Subscription from './pages/Subscription';
import Auth from './pages/Auth';
import OwnerPanel from './pages/OwnerPanel';
import { authService } from './services/authLocalStorage';

// ── AUTOMATIC LIVE SESSION KILLER NODE ──
const SessionValidator = () => {
  const location = useLocation();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const allUsers = authService.getUsers();
      const userStillExists = allUsers.some(u => u.id === currentUser.id);
      
      if (!userStillExists) {
        authService.logoutUser();
        alert("🚨 Security Alert: Your session has expired or your account has been suspended by the Admin!");
        window.location.href = '/auth';
      }
    }
  }, [location]);

  return null;
};

// ── ROUTE GUARDING PROCESSOR SYSTEM ──
const Guard = ({ children }) => {
  return authService.getCurrentUser() ? children : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <BrowserRouter>
      {/* Dynamic Security Middleware Injection */}
      <SessionValidator />

      {/* Background rich dark cinema theme */}
      <div className="flex flex-col min-h-screen bg-[#0b0c10] text-white selection:bg-[#841919]">
        
        {/* Header top par hi rahega */}
        <Header />
        
        {/* Main Content Area: Protected Route System Attached */}
        <main className="flex-grow">
          <Routes>
            {/* Open Authentication Portal */}
            <Route path="/auth" element={!authService.getCurrentUser() ? <Auth /> : <Navigate to="/" replace />} />

            {/* Protected Client Views Routes Gate */}
            <Route path="/" element={<Guard><Home /></Guard>} />
            <Route path="/movies" element={<Guard><Movies /></Guard>} />
            <Route path="/movie/:id" element={<Guard><MovieDetails /></Guard>} />
            
            {/* TV Shows Navigation System Linked */}
            <Route path="/tv-shows" element={<Guard><TVShows /></Guard>} />
            <Route path="/tv/:id" element={<Guard><TVDetails /></Guard>} />
            
            <Route path="/subscription" element={<Guard><Subscription /></Guard>} />
            
            {/* Secure Admin Ecosystem */}
            <Route path="/owner-panel" element={<Guard><OwnerPanel /></Guard>} />

            {/* Fallback Catch-All Wildcard Redirector */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer bottom par hi rahega */}
        <Footer />
        
      </div>
    </BrowserRouter>
  );
}

export default App;