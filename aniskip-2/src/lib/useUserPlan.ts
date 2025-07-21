import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export function useUserPlan() {
  const [plan, setPlan] = useState<string | null>(null);
  const [showNsfw, setShowNsfw] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchPlan() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (mounted) {
          setPlan(null);
          setShowNsfw(false);
          setLoading(false);
        }
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("plan, show_nsfw")
        .eq("id", user.id)
        .single();
      if (mounted) {
        setPlan(data?.plan || "free");
        setShowNsfw(data?.show_nsfw || false);
        setLoading(false);
      }
    }
    fetchPlan();
    return () => { mounted = false; };
  }, []);

  return { plan, showNsfw, loading };
} 