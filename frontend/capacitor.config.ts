import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.agroisync.mobile',
  appName: 'AgroSync',
  webDir: 'build',
  server: {
    url: 'https://agroisync.com',
    cleartext: true,
    androidScheme: 'https'
  },
  loggingBehavior: 'debug',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#22c55e',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      iosSpinnerStyle: 'small'
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#22c55e'
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
    },
    allowMixedContent: true
  },
  ios: {
    scheme: 'AgroSync',
    contentInset: 'automatic'
  }
};

export default config;
