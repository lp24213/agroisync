import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.agroisync.mobile',
  appName: 'Agroisync',
  webDir: 'build',
  loggingBehavior: 'production',
  bundledWebRuntime: false,
  server: {
    url: 'https://agroisync.com',
    cleartext: false,
    androidScheme: 'https',
    allowNavigation: ['agroisync.com', '*.agroisync.com', 'fonts.googleapis.com', 'fonts.gstatic.com'],
    hostname: 'agroisync.com'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: false,
      splashImmersive: false
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#22c55e',
      overlaysWebView: false,
      animated: true
    },
    Keyboard: {
      resize: 'body',
      style: 'light',
      resizeOnFullScreen: true
    }
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined
    }
  },
  ios: {
    scheme: 'AgroSync',
    contentInset: 'automatic'
  }
};

export default config;
