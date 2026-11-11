import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { Layout } from "./components/layout/Layout";
import { AboutPage } from "./pages/AboutPage";
import { ApproachPage } from "./pages/ApproachPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ServicesPage } from "./pages/ServicesPage";

function routerBasename() {
  const base = import.meta.env.BASE_URL;
  if (base === "/") return undefined;
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter basename={routerBasename()}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:slug" element={<ProjectDetailPage />} />
            <Route path="approach" element={<ApproachPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
