import React, { useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  Play,
  BarChart3,
  Library,
  Settings,
  Search,
  BookOpen
} from "lucide-react"
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { useEnsureProfile } from "@/lib/useEnsureProfile";
import { supabase } from "@/lib/supabaseClient";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
  { title: "Library", url: "/library", icon: Library },
  { title: "Search", url: "/search", icon: Search },
  { title: "Watch Guides", url: "/watch-guides", icon: BookOpen },
  { title: "Settings", url: "/settings", icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  useEnsureProfile();
  const location = useLocation();
  const navigate = useNavigate();

  // Session timeout on tab inactivity (2 hours)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden) {
        // Start timer when tab is hidden
        timeoutRef.current = setTimeout(async () => {
          await supabase.auth.signOut();
          window.location.reload();
        }, 2 * 60 * 60 * 1000); // 2 hours
      } else {
        // Clear timer if tab becomes visible again
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Play className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl gradient-text">AniSkip</h2>
            <div className="flex gap-2 mt-1">
              <span className="px-1.5 py-0.5 bg-slate-800/70 text-slate-200 rounded-full text-[9px] font-medium border border-slate-700">Filler Lists</span>
              <span className="px-1.5 py-0.5 bg-slate-800/70 text-slate-200 rounded-full text-[9px] font-medium border border-slate-700">Watch Guides</span>
            </div>
          </div>
        </div>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                location.pathname === item.url 
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' 
                  : 'text-slate-300 hover:bg-purple-500/20 hover:text-purple-300'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>

      <main className="flex-1 flex flex-col">
        <Header />

        <div className="flex-1 overflow-auto">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
} 