import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zelive.app',
  appName: 'Zelive',
  webDir: 'www/browser',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: "65436456136-hru0k7l8m2q5jq4rvpvjlcssi6c4cj46.apps.googleusercontent.com",
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
