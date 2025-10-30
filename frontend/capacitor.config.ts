import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.agroisync.app',
  appName: 'AgroSync',
  webDir: 'build',
  // IMPORTANTE: NÃO configurar 'server' - isso faz usar arquivos LOCAIS do build
  // O app vai ser EXATAMENTE igual ao web, usando os mesmos arquivos estáticos
  // server: undefined, // Remove configuração de servidor remoto
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
    allowMixedContent: false
  },
  ios: {
    scheme: 'AgroSync',
    contentInset: 'automatic'
  }
};

export default config;
