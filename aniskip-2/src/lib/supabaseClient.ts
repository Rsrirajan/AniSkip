/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const environment = import.meta.env.VITE_ENVIRONMENT || (import.meta.env.DEV ? 'development' : 'production');
const siteUrl = import.meta.env.VITE_SITE_URL || (import.meta.env.DEV ? 'http://localhost:5173' : 'https://animeskip.pro');

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export environment info for debugging
export const envConfig = {
  environment,
  siteUrl,
  isDevelopment: environment === 'development',
  isProduction: environment === 'production'
};

console.log('🔧 Supabase Client Config:', {
  environment,
  siteUrl,
  isDevelopment: envConfig.isDevelopment,
  isProduction: envConfig.isProduction
}); 