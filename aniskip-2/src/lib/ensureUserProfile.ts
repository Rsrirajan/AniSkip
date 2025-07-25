import { supabase } from './supabaseClient';

export async function ensureUserProfile(user: any) {
  if (!user) return;
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  if (!data) {
    const PFP_IMAGES = [
      "/pfps/Screenshot 2025-07-23 at 9.51.45 PM.png",
      "/pfps/Screenshot 2025-07-23 at 9.49.49 PM.png",
      "/pfps/Screenshot 2025-07-23 at 9.47.30 PM.png",
      "/pfps/Screenshot 2025-07-25 at 1.42.40 PM.png",
      "/pfps/Screenshot 2025-07-25 at 1.44.26 PM.png",
      "/pfps/Screenshot 2025-07-25 at 1.46.26 PM.png"
    ];
    // Assign a random pfp
    const randomPfp = PFP_IMAGES[Math.floor(Math.random() * PFP_IMAGES.length)];
    await supabase.from('profiles').insert([
      {
        id: user.id,
        display_name: user.user_metadata?.full_name || user.email,
        avatar_url: randomPfp,
        plan: 'free',
      }
    ]);
  }
} 