// src/theme/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom'; 
import logo from '../assets/POPFLiX.svg'; 

function Footer() {
  // TMDB Movie Genre Mappings
  const movieGenres = [
    { id: 28,  name: "Action 💥" },
    { id: 35,  name: "Comedy 😂" },
    { id: 18,  name: "Drama 🎭" },
    { id: 27,  name: "Horror 🧛" },
    { id: 878, name: "Sci-Fi 🚀" },
  ];

  // TMDB TV Series Genre Mappings (Routed perfectly to /tv-shows)
  const tvGenres = [
    { id: 10759, name: "Action & Adventure 🗺️" },
    { id: 16,    name: "Animation 🧸" },
    { id: 35,    name: "Comedy ✨" },
    { id: 18,    name: "Drama 🎬" },
    { id: 9648,  name: "Mystery 🔍" },
  ];

  return (
    <footer className="bg-[#050508] text-gray-400 border-t border-gray-900/80 mt-auto pt-16 pb-8 transition-all duration-300 select-none relative overflow-hidden">
      {/* Ambient background cinematic glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-[#841919]/40 to-transparent blur-sm" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Main Footer Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 pb-12 border-b border-gray-900/40">
          
          {/* Brand Presentation Unit */}
          <div className="sm:col-span-2 md:col-span-4 flex flex-col items-center md:items-start gap-5">
            <Link to="/" className="transition-all duration-300 hover:scale-102 hover:drop-shadow-[0_0_8px_rgba(132,25,25,0.4)] inline-block">
              <img 
                src={logo} 
                alt="POPFLIX Logo" 
                className="h-7 w-auto object-contain" 
              />
            </Link>
            <p className="text-[12px] text-gray-500 max-w-sm text-center md:text-left leading-relaxed font-medium">
              Your premium cinema streaming universe. Explore unrestricted content environments, trace trending series modules, and navigate personalized dashboard profiles flawlessly.
            </p>
            {/* Elegant Vector Social Anchor Row */}
            <div className="flex gap-4 mt-2 text-gray-500 justify-center md:justify-start">
              <a href="#facebook" className="hover:text-[#841919] bg-gray-900/40 hover:bg-[#841919]/10 border border-gray-900 hover:border-[#841919]/30 p-2.5 rounded-xl transition-all duration-300">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/></svg>
              </a>
              <a href="#instagram" className="hover:text-[#841919] bg-gray-900/40 hover:bg-[#841919]/10 border border-gray-900 hover:border-[#841919]/30 p-2.5 rounded-xl transition-all duration-300">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#discord" className="hover:text-[#841919] bg-gray-900/40 hover:bg-[#841919]/10 border border-gray-900 hover:border-[#841919]/30 p-2.5 rounded-xl transition-all duration-300">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.094 13.094 0 01-1.873-.894.077.077 0 01-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 01.077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 01.078.009c.12.099.246.195.373.289a.077.077 0 01-.006.127 12.298 12.298 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/></svg>
              </a>
            </div>
          </div>

          {/* Explore Portal Links */}
          <div className="md:col-span-2 flex flex-col items-center md:items-start gap-4">
            <h4 className="text-[11px] uppercase font-black text-gray-200 tracking-widest border-b-2 border-[#841919] pb-1 w-fit">
              Navigation
            </h4>
            <nav className="flex flex-col items-center md:items-start gap-3 text-xs font-bold">
              <Link to="/" className="text-gray-500 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group">
                <span className="text-[#841919] opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">✦</span> Home
              </Link>
              <Link to="/movies" className="text-gray-500 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group">
                <span className="text-[#841919] opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">✦</span> All Movies
              </Link>
              <Link to="/tv-shows" className="text-gray-500 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group">
                <span className="text-[#841919] opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">✦</span> TV Shows
              </Link>
              <Link to="/subscription" className="text-gray-500 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group">
                <span className="text-[#841919] opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">✦</span> Plans ✨
              </Link>
            </nav>
          </div>

          {/* Movie Category Link Modules */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start gap-4">
            <h4 className="text-[11px] uppercase font-black text-gray-200 tracking-widest border-b-2 border-[#841919] pb-1 w-fit">
              Movie Vault
            </h4>
            <div className="flex flex-col gap-2.5 w-full text-center md:text-left text-xs font-bold">
              {movieGenres.map((genre) => (
                <Link 
                  key={genre.id}
                  to={`/movies?genre=${genre.id}`}
                  className="text-gray-500 hover:text-white bg-gray-900/10 hover:bg-gray-900/50 border border-gray-900/60 hover:border-[#841919]/30 rounded-xl py-2 px-3.5 transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm block"
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Dedicated TV Series Link Modules */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start gap-4">
            <h4 className="text-[11px] uppercase font-black text-gray-200 tracking-widest border-b-2 border-[#841919] pb-1 w-fit">
              TV Series Hub
            </h4>
            <div className="flex flex-col gap-2.5 w-full text-center md:text-left text-xs font-bold">
              {tvGenres.map((genre) => (
                <Link 
                  key={genre.id}
                  to={`/tv-shows?genre=${genre.id}`}
                  className="text-gray-500 hover:text-white bg-gray-900/10 hover:bg-gray-900/50 border border-gray-900/60 hover:border-[#841919]/30 rounded-xl py-2 px-3.5 transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm block"
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* ── Bottom Section: Copyright & Disclaimer ── */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-600 tracking-wide text-center md:text-left">
          <div className="flex flex-col gap-1 font-medium">
            <p>&copy; {new Date().getFullYear()} <span className="text-gray-400 font-bold tracking-wider">POPFLIX </span>. All rights reserved.</p>
            <p className="text-[10px] text-gray-700 max-w-md">Disclaimer: Automated stream indexing pipeline environment. This platform structures links dynamically via algorithmic local processing frames.</p>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 font-bold bg-gray-900/20 border border-gray-900 px-4 py-2 rounded-2xl whitespace-nowrap">
            <span>Engineered with</span>
            <span className="text-[#841919] animate-pulse text-xs">❤️</span>
            <span>for Ultimate Cinephiles</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;