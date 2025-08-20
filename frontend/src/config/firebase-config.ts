// Configuração do Firebase para AGROISYNC
export const firebaseConfig = {
  apiKey: "AIzaSyAMctOxpCQOiWCgUXATpUj5ju9mbQgjsqM",
  authDomain: "agroisync-firebase.firebaseapp.com",
  projectId: "agroisync-firebase",
  storageBucket: "agroisync-firebase.firebasestorage.app",
  messagingSenderId: "547464599696",
  appId: "1:547464599696:web:a3cc564c29568d1d5a2015"
}

// Verificar se estamos no ambiente correto
export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && 
         firebaseConfig.apiKey !== "your_firebase_api_key" &&
         firebaseConfig.apiKey !== "demo-api-key"
}
