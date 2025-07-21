import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kuqiblpyfyutjvqepioj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1cWlibHB5Znl1dGp2cWVwaW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NTMzMjIsImV4cCI6MjA2ODEyOTMyMn0.x6hdLZZkIZYTtLDYzZgr_eAf4YLOEnITgB1VyrxRSh0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function makeUserPro() {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('No user found:', userError);
      return;
    }

    console.log('Current user:', user.email);

    // Update user's plan to 'pro'
    const { data, error } = await supabase
      .from('profiles')
      .update({ plan: 'pro' })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      return;
    }

    console.log('Successfully updated user to Pro plan!');
    console.log('User ID:', user.id);
    console.log('User Email:', user.email);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

makeUserPro(); 