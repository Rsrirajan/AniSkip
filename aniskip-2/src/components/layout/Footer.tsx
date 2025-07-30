import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { Play } from "lucide-react";

const Footer: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const handleSignIn = () => {
    navigate('/signup');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <footer className="bg-black mt-16">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Play className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-white tracking-wide">AniSkip</span>
            </div>
            <p className="text-slate-400 max-w-md">
              Skip the fillers, track your progress, and discover amazing anime. The ultimate anime tracking experience for true fans.
            </p>
            {/* Only show Get Started Free if not logged in */}
            {!user && (
              <button 
                onClick={handleGetStarted}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-bold shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
              >
                Get Started Free
              </button>
            )}
          </div>
          {/* Support (only if not logged in) */}
          {!user && (
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><button onClick={() => window.open('mailto:support@aniskip.com')} className="text-slate-400 hover:text-purple-300 transition-colors">Help Center</button></li>
                <li><button onClick={() => window.open('mailto:contact@aniskip.com')} className="text-slate-400 hover:text-purple-300 transition-colors">Contact Us</button></li>
                <li><button onClick={() => window.open('/privacy')} className="text-slate-400 hover:text-purple-300 transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => window.open('/terms')} className="text-slate-400 hover:text-purple-300 transition-colors">Terms of Service</button></li>
                <li><button onClick={() => window.open('/cookies')} className="text-slate-400 hover:text-purple-300 transition-colors">Cookie Policy</button></li>
              </ul>
            </div>
          )}
        </div>
        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">
            ©2025 AniSkip. All rights reserved. Made with ❤️ for anime fans.
          </p>
          {/* Only show sign in/up if not logged in */}
          {!user && (
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <button onClick={handleSignIn} className="text-slate-500 hover:text-purple-300 transition-colors text-sm">Sign In</button>
              <button onClick={handleSignUp} className="text-purple-400 hover:text-purple-300 font-semibold transition-colors text-sm">
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;