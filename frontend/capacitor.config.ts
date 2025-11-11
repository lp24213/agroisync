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
      launchShowDuration: 1500,
      backgroundColor: '#1a1a1a',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER',
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
