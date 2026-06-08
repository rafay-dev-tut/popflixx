// src/services/authLocalStorage.js

// ── GET ALL USERS ──
const getUsers = () => {
  const users = localStorage.getItem('popflix_users');
  return users ? JSON.parse(users) : [];
};

// ── SAVE USERS ──
const saveUsers = (users) => {
  localStorage.setItem('popflix_users', JSON.stringify(users));
};

// ── REGISTER USER ──
const registerUser = (email, password, ageGroup) => {
  const users = getUsers();
  const userExists = users.some(u => u.email === email);
  if (userExists) return { success: false, message: "Email already registered!" };

  const newUser = {
    id: 'user_' + Date.now(),
    email,
    password,
    ageGroup, // 'adult' or 'kids'
    history: {
      continueWatching: [],
      watched: []
    }
  };
  
  users.push(newUser);
  saveUsers(users);
  return { success: true, user: newUser };
};

// ── LOGIN USER ──
const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { success: false, message: "Invalid Email or Password!" };

  // Current session save karein
  localStorage.setItem('popflix_current_user', JSON.stringify(user));
  localStorage.setItem('popflix_age_group', user.ageGroup);
  return { success: true, user };
};

// ── LOGOUT USER ──
const logoutUser = () => {
  localStorage.removeItem('popflix_current_user');
  localStorage.removeItem('popflix_age_group');
};

// ── GET LOGGED IN USER ──
const getCurrentUser = () => {
  const user = localStorage.getItem('popflix_current_user');
  return user ? JSON.parse(user) : null;
};

// ── UPDATE TRACKING HISTORY ──
const updateMovieHistory = (movieId, movieTitle, posterPath, type) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === currentUser.id);
  if (userIndex === -1) return;

  let userObj = users[userIndex];
  
  if (!userObj.history) userObj.history = { continueWatching: [], watched: [] };

  const movieItem = { id: movieId, title: movieTitle, poster_path: posterPath, timestamp: Date.now() };

  if (type === 'continue') {
    userObj.history.continueWatching = userObj.history.continueWatching.filter(m => m.id !== movieId);
    userObj.history.continueWatching.unshift(movieItem);
  } else if (type === 'watched') {
    userObj.history.continueWatching = userObj.history.continueWatching.filter(m => m.id !== movieId);
    userObj.history.watched = userObj.history.watched.filter(m => m.id !== movieId);
    userObj.history.watched.unshift(movieItem);
  }

  users[userIndex] = userObj;
  saveUsers(users);
  localStorage.setItem('popflix_current_user', JSON.stringify(userObj));
};

// ── THE CRITICAL FIX: BUNDLE AND EXPORT AS authService ──
export const authService = {
  getUsers,
  saveUsers,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateMovieHistory
};