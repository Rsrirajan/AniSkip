import { envConfig } from './supabaseClient';

// Environment-based authentication configuration
export const authConfig = {
  // Get the appropriate redirect URL based on environment
  getRedirectUrl: () => {
    if (envConfig.isDevelopment) {
      return `${envConfig.siteUrl}/auth-callback`;
    }
    return `${envConfig.siteUrl}/auth-callback`;
  },

  // Get the appropriate reset password URL
  getResetUrl: () => {
    if (envConfig.isDevelopment) {
      return `${envConfig.siteUrl}/reset`;
    }
    return `${envConfig.siteUrl}/reset`;
  },

  // Get the appropriate sign out redirect URL
  getSignOutRedirectUrl: () => {
    if (envConfig.isDevelopment) {
      return `${envConfig.siteUrl}`;
    }
    return `${envConfig.siteUrl}`;
  },

  // Check if we're in development mode
  isDevelopment: envConfig.isDevelopment,

  // Check if we're in production mode
  isProduction: envConfig.isProduction,

  // Get current environment
  environment: envConfig.environment,

  // Get current site URL
  siteUrl: envConfig.siteUrl
};

// Log auth configuration for debugging
console.log('🔐 Auth Config:', {
  redirectUrl: authConfig.getRedirectUrl(),
  resetUrl: authConfig.getResetUrl(),
  signOutUrl: authConfig.getSignOutRedirectUrl(),
  isDevelopment: authConfig.isDevelopment,
  environment: authConfig.environment
});

export default authConfig; 