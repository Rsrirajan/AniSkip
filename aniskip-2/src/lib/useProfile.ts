import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient"; // adjust path if needed

export function useProfile() {
  const [profile, setProfile] = useState<{ display_name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
      }

      setLoading(false);
    };

    getProfile();
  }, []);

  return { profile, loading };
}
