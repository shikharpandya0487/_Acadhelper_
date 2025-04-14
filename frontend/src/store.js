import { create } from 'zustand';

// Function to get the initial user data from localStorage
const getUserFromLocalStorage = () => {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem("user");
    return userData && userData !== "undefined" ? JSON.parse(userData) : null;
};
const getURL=()=>{
  const URL_BASE = import.meta.env.VITE_URL_BASE.replace(/\/$/, ''); // Remove trailing slash if exists

  // console.log(URL_BASE)
  return URL_BASE
}

// Create the Zustand store with localStorage persistence
export const useStore = create((set) => ({
  url: getURL(),
  user: getUserFromLocalStorage(),
  setUser: (newUser) => {
    set({ user: newUser });
    if (typeof window !== "undefined") {
      if (newUser) {
        localStorage.setItem("user", JSON.stringify(newUser));
      } else {
        localStorage.removeItem("user");
      }
    }
  },
}));

// Clear localStorage on user logout
export const clearUser = () => {
  useStore.getState().setUser(null);
};
