import "./App.css";

import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Content from "./pages/content";
import AIStudio from "./pages/ai-studio";
import SEOIntelligence from "./pages/seo-intelligence";
import Analytics from "./pages/analytics";
import Settings from "./pages/settings";


import { Navigate } from "react-router-dom";
import { isTokenValid } from "./utils/auth";
import AuthPage from "./pages/autth";
 

  function ProtectedRoute({ children }) {
  if (!isTokenValid()) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      {/* If logged in, redirect from /auth to / */}
      <Route
        path="/auth"
        element={isTokenValid() ? <Navigate to="/" /> : <AuthPage />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/content"
        element={
          <ProtectedRoute>
            <Content />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ai-studio"
        element={
          <ProtectedRoute>
            <AIStudio />
          </ProtectedRoute>
        }
      />

      <Route
        path="/seo-intelligence"
        element={
          <ProtectedRoute>
            <SEOIntelligence />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
