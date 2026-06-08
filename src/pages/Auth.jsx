// src/pages/Auth.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── FIXED IMPORT: Standalone imports removed, bundled authService added ──
import { authService } from '../services/authLocalStorage';

function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ageGroup, setAgeGroup] = useState('adult'); // Default profile type
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // ── FIXED: Used authService bundle ──
      const result = authService.loginUser(email, password);
      if (result.success) {
        navigate('/'); // Redirect to Home page after successful login
      } else {
        setError(result.message);
      }
    } else {
      // ── FIXED: Used authService bundle ──
      const result = authService.registerUser(email, password, ageGroup);
      if (result.success) {
        alert("Registration Successful! Please Login.");
        setIsLogin(true); // Switch to login view after signup
        setError('');
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 selection:bg-[#841919]">
      <div className="bg-gray-900/80 border border-gray-800 p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-2xl backdrop-blur-md">
        
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 tracking-wide">
          {isLogin ? '🎬 Sign In to PopFlix' : '🚀 Create Cinema Account'}
        </h2>

        {error && (
          <div className="bg-[#841919]/20 border border-[#841919] text-red-400 text-xs sm:text-sm px-4 py-2 rounded-lg mb-4 text-center font-semibold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#841919] transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#841919] transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Conditional Profile Type Field for Signups */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Age Restriction Profile</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#841919] transition-all cursor-pointer"
              >
                <option value="adult">Adult Profile (Unrestricted Cinema)</option>
                <option value="kids">Kids Profile (Family-Friendly Only)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#841919] hover:bg-[#841919]/90 text-white font-bold py-3 rounded-lg text-sm tracking-wide transition-all shadow-lg active:scale-[0.99] mt-2"
          >
            {isLogin ? 'Sign In' : 'Get Started'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-gray-800/60 pt-4">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-xs sm:text-sm text-gray-400 hover:text-white font-medium transition-colors"
          >
            {isLogin ? "New to PopFlix? " : "Already have an account? "}
            <span className="text-[#841919] font-bold hover:underline">
              {isLogin ? 'Create an account' : 'Sign In now'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default Auth;