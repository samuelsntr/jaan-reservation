import { AuthProvider } from "@/contexts/AuthContext";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "@/components/ui/sonner";
import { ReservationRefreshProvider } from "./contexts/ReservationRefreshContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Toaster theme="dark" richColors />
      <ReservationRefreshProvider>
        <App />
      </ReservationRefreshProvider>
    </AuthProvider>
  </StrictMode>
);
