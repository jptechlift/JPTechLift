import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./styles/fonts.scss";
import "./styles/index.scss";
import App from "./App";
import CreateBlogForm from "./components/CreateBlogForm";
import CreateBlogPage from "./pages/CreateBlogPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
