import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import './styles/fonts.scss';
import './styles/index.scss';
import App from "./App";
import AirPurifierArticle from "./components/BLOGTEMPLATE/BlogTemplate";
import BlogTemplate from "./components/BLOGTEMPLATE/BlogTemplate";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
      {/* < BlogTemplate /> */}
    </HelmetProvider>
  </StrictMode>
);
