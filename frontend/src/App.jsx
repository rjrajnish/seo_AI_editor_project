import "./App.css";

import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Content from "./pages/content";
import AIStudio from "./pages/ai-studio";
import SEOIntelligence from "./pages/seo-intelligence";
import Analytics from "./pages/analytics";
import Settings from "./pages/settings";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/content" element={<Content />} />
      <Route path="/ai-studio" element={<AIStudio />} />
      <Route path="/seo-intelligence" element={<SEOIntelligence />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
