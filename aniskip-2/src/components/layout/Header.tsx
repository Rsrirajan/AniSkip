import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabaseClient";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
// List of available profile images
const PFP_IMAGES = [
  "/pfps/Screenshot 2025-07-23 at 9.51.45 PM.png",
  "/pfps/Screenshot 2025-07-23 at 9.49.49 PM.png",
  "/pfps/Screenshot 2025-07-23 at 9.47.30 PM.png"
];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [pfp, setPfp] = useState<string>(PFP_IMAGES[0]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
    // Pick a random profile image on each load
    setPfp(PFP_IMAGES[Math.floor(Math.random() * PFP_IMAGES.length)]);
  }, []);

  return (
    <header className="w-full bg-gradient-to-r from-slate-900/90 via-purple-900/90 to-slate-900/90 px-8 py-4 flex items-center justify-end border-b border-purple-800/40 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="text-slate-300 hover:text-white p-2 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500">
                  <img
                    src={pfp}
                    alt="Profile"
                    className="w-8 h-8 rounded-xl object-cover border-2 border-purple-400 bg-slate-800"
                    style={{ background: '#fff' }}
                  />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-2 mt-2 min-w-[140px] max-h-60 overflow-y-auto">
                <DropdownMenu.Item onSelect={async () => { await supabase.auth.signOut(); navigate('/'); }} className="px-4 py-2 text-white hover:bg-purple-600 cursor-pointer">Sign out</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </>
        ) : null}
      </div>
    </header>
  );
};

export default Header;