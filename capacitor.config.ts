import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.db8b7874ca4c4874bc8e8177c4b9aa2d',
  appName: 'holibaith-47625',
  webDir: 'dist',                 // keep this even when using server.url
  server: {
    // 1) Clean URL (no query params)
    url: 'https://db8b7874-ca4c-4874-bc8e-8177c4b9aa2d.lovableproject.com',
    cleartext: false,             // 2) HTTPS only

    // 3) Let the WebView navigate within these hosts.
    // Add others you actually use (auth, payments, etc.)
    allowNavigation: [
      '*.lovableproject.com',
      'auth.supabase.co',         // remove if not using Supabase
      'accounts.google.com',      // remove if not using Google OAuth
      'api.github.com'            // example; keep your real ones only
    ],
  },

  // Optional: turn off the native splash quickly if you added that plugin
  // plugins: { SplashScreen: { launchShowDuration: 0 } },
};

export default config;
