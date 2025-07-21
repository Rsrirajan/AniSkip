import { supabase } from './supabaseClient';

export async function ensureUserProfile(user: any) {
  if (!user) return;
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  if (!data) {
    await supabase.from('profiles').insert([
      {
        id: user.id,
        display_name: user.user_metadata?.full_name || user.email,
        avatar_url: user.user_metadata?.avatar_url || null,
        plan: 'free',
      }
    ]);
  }
} 