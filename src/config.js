// Centralized API Base URL configuration for deployment compatibility
const getApiUrl = () => {
  // 1. Check Create React App (react-scripts) environment variables
  if (typeof process !== "undefined" && process.env) {
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    if (process.env.VITE_API_URL) {
      return process.env.VITE_API_URL;
    }
  }

  // 2. Check Vite import.meta.env environment variables
  try {
    if (typeof import.meta !== "undefined" && import.meta.env) {
      if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
      }
      if (import.meta.env.REACT_APP_API_URL) {
        return import.meta.env.REACT_APP_API_URL;
      }
    }
  } catch (e) {
    // Ignore reference error if import.meta is unavailable
  }

  return "";
};

export const API_BASE_URL = getApiUrl().replace(/\/$/, "");
