import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.replace('#', '?'));
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      if (access_token && refresh_token) {
        supabase.auth.setSession({ access_token, refresh_token }).then(() => {
          window.location.hash = '';
          navigate('/dashboard', { replace: true });
        });
      } else {
        navigate('/signup', { replace: true });
      }
    } else {
      navigate('/signup', { replace: true });
    }
  }, [navigate]);
  return <div>Signing you in...</div>;
} 