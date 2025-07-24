import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Gear5LuffyAvatar from '../../assets/gear5-luffy-avatar.svg';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
  }, []);

  return (
    <header className="w-full bg-gradient-to-r from-slate-900/90 via-purple-900/90 to-slate-900/90 px-8 py-4 flex items-center justify-end border-b border-purple-800/40 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="text-slate-300 hover:text-white p-1 rounded-lg transition-colors">
                  <img 
                    src={Gear5LuffyAvatar} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full border-2 border-purple-400 hover:border-purple-300 transition-colors"
                  />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content 
                className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-2 mt-2 min-w-[140px] max-h-48 overflow-y-auto"
                sideOffset={5}
              >
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