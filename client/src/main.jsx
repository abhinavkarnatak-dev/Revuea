import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Toaster
      position="top-right"
      toastOptions={{ duration: 2000 }}
      reverseOrder={false}
    />
    <App />
  </AuthProvider>
);