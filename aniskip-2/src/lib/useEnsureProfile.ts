import { useEffect } from "react";
import { supabase } from "./supabaseClient";
import { ensureUserProfile } from "./ensureUserProfile";

export function useEnsureProfile() {
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data?.user) {
        await ensureUserProfile(data.user);
      }
    });
  }, []);
} 