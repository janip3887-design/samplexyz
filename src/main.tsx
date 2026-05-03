import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import Admin from "./Admin.tsx";
import Dining from "./Dining.tsx";
import "./index.css";
import { AuthProvider } from "./AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/dining" element={<Dining />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
