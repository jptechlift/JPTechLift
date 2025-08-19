import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import './styles/fonts.scss';
import './styles/index.scss';
import App from "./App";

console.log('VITE_API_URL', import.meta.env.VITE_API_URL);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
