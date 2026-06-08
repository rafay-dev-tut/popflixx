// src/pages/OwnerPanel.jsx
import React, { useState, useEffect } from 'react';
import { authService } from '../services/authLocalStorage';

function OwnerPanel() {
  const [users, setUsers] = useState([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [expandedUser, setExpandedUser] = useState(null);

  const MASTER_ADMIN_USERNAME = "abdulrafay";
  const MASTER_ADMIN_PASSWORD = "popflix2026";

  // Real-time synchronization fetcher
  const syncUsersDatabase = () => {
    if (isAdminAuthenticated) {
      setUsers(authService.getUsers() || []);
    }
  };

  useEffect(() => {
    syncUsersDatabase();

    // 1. Listen to cross-tab storage changes (if user watches movie in another tab)
    window.addEventListener('storage', syncUsersDatabase);
    
    // 2. Poll localStorage every 2 seconds for aggressive real-time update tracking
    const liveInterval = setInterval(syncUsersDatabase, 2000);

    return () => {
      window.removeEventListener('storage', syncUsersDatabase);
      clearInterval(liveInterval);
    };
  }, [isAdminAuthenticated]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUsername === MASTER_ADMIN_USERNAME && adminPassword === MASTER_ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('❌ Invalid Owner Credentials! Access Terminated.');
    }
  };

  // Immediate Account Suspension & Instant Kick-out Logic
  const handleDeleteUser = (userId) => {
    const currentUser = authService.getCurrentUser();
    
    if (currentUser && currentUser.id === userId) {
      alert("❌ Security Action Denied: You cannot suspend your own active user session from here!");
      return;
    }

    const confirmFirst = window.confirm("🚨 WARNING: Are you absolutely sure? This will completely wipe their session and kick them out immediately!");
    if (!confirmFirst) return;

    const confirmSecond = window.confirm("💣 DOUBLE CHECK: Kick out user? (Note: Account data will remain retained in Owner Panel backup)");
    if (confirmSecond) {
      // Force instant kickout event for that specific user session without deleting row from master DB
      localStorage.setItem(`SUSPENDED_USER_${userId}`, 'TRUE');
      
      alert("🗑️ User session terminated and blocked from the ecosystem active view.");
      if (expandedUser === userId) setExpandedUser(null);
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 selection:bg-[#841919]">
        <div className="bg-gray-900 border-2 border-[#841919]/60 p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#841919] text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest shadow">
            OWNER ONLY
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-center mb-2 mt-2 tracking-wide">Shield Authentication</h2>
          <p className="text-gray-400 text-xs text-center mb-6">Enter system administrator master node keys to proceed</p>

          {authError && (
            <div className="bg-red-950/40 border border-red-800 text-red-400 text-xs py-2.5 rounded-xl mb-4 text-center font-bold">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Admin Username</label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#841919]"
                placeholder="Enter owner username"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Master Password</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#841919]"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#841919] hover:bg-[#841919]/90 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-widest transition-all mt-2 shadow-lg"
            >
              🔓 Unlock Admin Ecosystem
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white selection:bg-[#841919]">
      <div className="border-l-4 border-[#841919] pl-3 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide">🛡️ Secure Admin Ecosystem</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">Manage user access control lists and view activity metrics</p>
        </div>
        <button 
          onClick={() => setIsAdminAuthenticated(false)}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-4 py-2 rounded-lg text-xs self-start sm:self-center transition-all border border-gray-700"
        >
          🔒 Lock Panel
        </button>
      </div>

      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="p-5 border-b border-gray-800 bg-gray-900/40">
          <h3 className="font-bold text-sm sm:text-base tracking-wide text-gray-200">Registered User Directory ({users.length})</h3>
        </div>

        {users.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No registered profiles found in the database layer.
          </div>
        ) : (
          <div className="w-full overflow-x-auto block scrollbar-thin scrollbar-thumb-gray-800">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-800 bg-black/40 text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-4">User Details</th>
                  <th className="p-4">Secure Password</th>
                  <th className="p-4">Profile Type</th>
                  <th className="p-4 text-center">User Activity</th>
                  <th className="p-4 text-right">Actions Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-xs sm:text-sm">
                {users.map((user) => (
                  <React.Fragment key={user.id}>
                    <tr className={`hover:bg-gray-800/20 transition-colors ${expandedUser === user.id ? 'bg-[#841919]/5' : ''}`}>
                      <td className="p-4">
                        <div className="font-semibold text-gray-200 break-all max-w-[180px] sm:max-w-none">{user.email}</div>
                        <div className="font-mono text-gray-500 text-[10px] mt-0.5">ID: {user.id}</div>
                      </td>
                      <td className="p-4">
                        <div className="bg-black/40 border border-gray-800 px-2.5 py-1.5 rounded-lg font-mono text-xs text-yellow-500 inline-block tracking-wide select-all">
                          {user.password || "N/A"}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                          user.ageGroup === 'kids' 
                            ? 'bg-blue-900/40 text-blue-400 border border-blue-800/60' 
                            : 'bg-purple-900/40 text-purple-400 border border-purple-800/60'
                        }`}>
                          {user.ageGroup || 'adult'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${
                            expandedUser === user.id 
                              ? 'bg-[#841919] border-[#841919] text-white' 
                              : 'bg-gray-950 border-gray-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          {expandedUser === user.id ? 'Hide Activity 🔼' : 'View History 👁️'}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-red-950/60 hover:bg-[#841919] border border-red-900 text-red-200 hover:text-white font-bold px-3 py-1.5 rounded-lg text-xs tracking-wide transition-all active:scale-95 shadow whitespace-nowrap"
                        >
                          💣 Terminate Session
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Activity Stream */}
                    {expandedUser === user.id && (
                      <tr>
                        <td colSpan="5" className="bg-black/40 p-4 border-t border-b border-gray-800/80">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Continue Watching */}
                            <div className="bg-gray-950/80 p-4 rounded-xl border border-gray-800/60">
                              <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                ⏳ Continue Watching Stream ({user.history?.continueWatching?.length || 0})
                              </h4>
                              {user.history?.continueWatching && user.history.continueWatching.length > 0 ? (
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                  {user.history.continueWatching.map((mv) => (
                                    <div key={mv.id} className="flex items-center gap-3 bg-gray-900/50 p-2 rounded-lg border border-gray-800">
                                      {mv.poster_path && (
                                        <img src={`https://image.tmdb.org/t/p/w92${mv.poster_path}`} alt="" className="w-7 h-10 object-cover rounded shadow" />
                                      )}
                                      <div className="min-w-0 flex-grow">
                                        <div className="text-xs font-bold text-gray-200 truncate">{mv.title}</div>
                                        <div className="text-[10px] text-gray-500 mt-0.5">ID: {mv.id}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-gray-600 italic">No media currently inside active cache row.</p>
                              )}
                            </div>

                            {/* Completely Watched */}
                            <div className="bg-gray-950/80 p-4 rounded-xl border border-gray-800/60">
                              <h4 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                ✅ Fully Watched History Ledger ({user.history?.watched?.length || 0})
                              </h4>
                              {user.history?.watched && user.history.watched.length > 0 ? (
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                  {user.history.watched.map((mv) => (
                                    <div key={mv.id} className="flex items-center gap-3 bg-gray-900/50 p-2 rounded-lg border border-gray-800">
                                      {mv.poster_path && (
                                        <img src={`https://image.tmdb.org/t/p/w92${mv.poster_path}`} alt="" className="w-7 h-10 object-cover rounded shadow" />
                                      )}
                                      <div className="min-w-0 flex-grow">
                                        <div className="text-xs font-bold text-gray-200 truncate">{mv.title}</div>
                                        <div className="text-[10px] text-gray-500 mt-0.5">ID: {mv.id}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-gray-600 italic">No media logs marked as watched entirely.</p>
                              )}
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerPanel;