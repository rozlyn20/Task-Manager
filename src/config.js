// Centralized API Base URL configuration for Create React App
const getApiUrl = () => {
  // Direct process.env access ensures Create React App (react-scripts / Webpack)
  // statically inlines the environment variable during npm run build.
  return process.env.REACT_APP_API_URL || process.env.VITE_API_URL || "";
};

export const API_BASE_URL = getApiUrl().replace(/\/$/, "");

// Production debugging logs (viewable in browser DevTools console)
console.log("[Deployment Debug] process.env.REACT_APP_API_URL:", process.env.REACT_APP_API_URL);
console.log("[Deployment Debug] Resolved API_BASE_URL:", API_BASE_URL);
