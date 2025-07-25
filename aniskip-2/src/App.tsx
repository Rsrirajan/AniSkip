import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import Layout from "./Layout"
import Dashboard from "./pages/Dashboard"
import Library from "./pages/Library"
import Search from "./pages/Search"
import Settings from "./pages/Settings"
import AnimeDetails from "./pages/AnimeDetails"
import Landing from "./pages/Landing"
import Signup from "./pages/Signup"
import WatchGuides from "./pages/WatchGuides"
import { supabase } from "./lib/supabaseClient"

function RequireAuth({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const location = useLocation();

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
      setLoading(false);
    });
  }, []);

  if (loading) return null;
  if (!user) return <Navigate to="/signup" state={{ from: location }} replace />;
  return <>{children}</>;
}

function RedirectIfAuth({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
      setLoading(false);
    });
  }, []);
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RedirectIfAuth><Landing /></RedirectIfAuth>} />
        <Route path="/signup" element={<RedirectIfAuth><Signup /></RedirectIfAuth>} />
        <Route path="/reset" element={<RedirectIfAuth><Signup /></RedirectIfAuth>} />
        <Route
          path="/*"
          element={
            <RequireAuth>
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="library" element={<Library />} />
                  <Route path="search" element={<Search />} />
                  <Route path="watch-guides" element={<WatchGuides />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="anime/:id" element={<AnimeDetails />} />
                </Routes>
              </Layout>
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  )
}

export default App 