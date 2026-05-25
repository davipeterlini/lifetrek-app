import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { HealthDataProvider } from "./contexts/HealthDataContext";

const GOOGLE_CLIENT_ID =
  (window as any).__ENV__?.VITE_GOOGLE_CLIENT_ID ||
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Could not find root element to mount to");

ReactDOM.createRoot(rootElement).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <LanguageProvider>
      <ToastProvider>
        <AuthProvider>
          <HealthDataProvider>
            <App />
          </HealthDataProvider>
        </AuthProvider>
      </ToastProvider>
    </LanguageProvider>
  </GoogleOAuthProvider>
);