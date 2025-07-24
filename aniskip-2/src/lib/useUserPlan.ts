import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export function useUserPlan() {
  // All features are free, so just return 'free' and not loading
  return { plan: 'free', showNsfw: false, loading: false };
}