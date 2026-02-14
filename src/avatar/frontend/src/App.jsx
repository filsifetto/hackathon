import { Loader } from "@react-three/drei";
import { Leva } from "leva";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/SiteLayout";
import { HomePage } from "./pages/HomePage";
import { EventsPage } from "./pages/EventsPage";
import { AboutPage } from "./pages/AboutPage";
import { ProgramPage } from "./pages/ProgramPage";
import { CasePage } from "./pages/CasePage";
import { JoinPage } from "./pages/JoinPage";
import { TestExpressionsPage } from "./pages/TestExpressionsPage";

function App() {
  return (
    <BrowserRouter>
      <Loader />
      <Leva collapsed hidden />
      <Routes>
        <Route path="/test-avatar-expressions" element={<TestExpressionsPage />} />
        <Route path="*" element={
          <SiteLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/arrangementer" element={<EventsPage />} />
              <Route path="/om-oss" element={<AboutPage />} />
              <Route path="/partiprogram" element={<ProgramPage />} />
              <Route path="/bli-medlem" element={<JoinPage />} />
              <Route path="/saker/:slug" element={<CasePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SiteLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
