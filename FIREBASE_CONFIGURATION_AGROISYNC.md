# Firebase Configuration for AGROISYNC

## Overview
This document outlines the Firebase configuration for the AGROISYNC project, including the new domain configuration and debug token integration.

## Domain Migration
- **Old Domain**: `agrotmsol.com` / `agrotm.sol`
- **New Domain**: `agroisync.com`
- **Project ID**: `agrotmsol-95542` (remains unchanged)

## Firebase Configuration

### Frontend Configuration (`frontend/lib/firebase/config.ts`)
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyAKrRqO9U21UJdgMwmwXYH8pNpXaDjJvoc",
  authDomain: "agroisync.com", // Updated from agrotmsol-95542.firebaseapp.com
  databaseURL: "https://agroisync-95542-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "agrotmsol-95542", // Unchanged
  storageBucket: "agroisync-95542.firebasestorage.app",
  messagingSenderId: "533878061709",
  appId: "1:533878061709:web:c76cf40fe9dff00a0900c4",
  measurementId: "G-36EN55X7EY"
};
```

### Environment Variables
Create a `.env.local` file in the `frontend` directory with:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAKrRqO9U21UJdgMwmwXYH8pNpXaDjJvoc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=agroisync.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=agrotmsol-95542
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=agroisync-95542.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=533878061709
NEXT_PUBLIC_FIREBASE_APP_ID=1:533878061709:web:c76cf40fe9dff00a0900c4
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-36EN55X7EY
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://agroisync-95542-default-rtdb.asia-southeast1.firebasedatabase.app

# Firebase Debug Token (IMPORTANT)
NEXT_PUBLIC_FIREBASE_DEBUG_TOKEN=AFCAADF3-BDCF-4B29-B1E8-C69180EA55D2
```

## Firebase Debug Token

### Token Details
- **Value**: `AFCAADF3-BDCF-4B29-B1E8-C69180EA55D2`
- **Purpose**: Development and debugging authentication
- **Usage**: Automatically included in Firebase initialization

### Integration
The debug token is automatically exported from the Firebase configuration:
```typescript
export { app, auth, db, storage, analytics, FIREBASE_DEBUG_TOKEN };
```

### Development Logging
In development mode, the configuration logs:
- Firebase initialization success
- Debug token value
- Current domain configuration

## Firebase Hosting Configuration

### firebase.json
```json
{
  "hosting": {
    "site": "agroisync",
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### .firebaserc
```json
{
  "projects": {
    "default": "agrotmsol-95542"
  }
}
```

## Deployment Commands

### Initialize Firebase (if not already done)
```bash
firebase login
firebase init hosting
```

### Deploy to Firebase Hosting
```bash
# Build the project first
npm run build

# Deploy to the agroisync site
firebase deploy --only hosting:agroisync
```

## Backend Configuration

### Firebase Admin SDK
The backend uses the same Firebase project with admin privileges:
- **Project ID**: `agrotmsol-95542`
- **Service Account**: Configured via environment variables
- **Database URL**: `https://agroisync-95542-default-rtdb.asia-southeast1.firebasedatabase.app`

## Security Considerations

### CORS Configuration
- **Allowed Origins**: `https://agroisync.com`, `https://www.agroisync.com`
- **Credentials**: Enabled for authenticated requests
- **Methods**: GET, POST, PUT, DELETE, OPTIONS

### Environment Variables
- Never commit `.env.local` files
- Use different configurations for development and production
- Configure production variables in AWS Amplify Console

## Troubleshooting

### Common Issues

1. **Module Resolution Errors**
   - Ensure all imports use relative paths instead of `@/` aliases
   - Check `tsconfig.json` path configurations

2. **Firebase Initialization Failures**
   - Verify environment variables are set correctly
   - Check browser console for configuration errors
   - Ensure debug token is included

3. **Domain Resolution Issues**
   - Verify DNS configuration in Route 53
   - Check CNAME records point to correct CloudFront distribution
   - Ensure SSL certificates are valid

### Debug Mode
Enable debug logging by setting:
```bash
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_LOG_LEVEL=debug
```

## Production Deployment

### AWS Amplify
1. Configure environment variables in Amplify Console
2. Ensure build process uses Node 20+
3. Verify all domain references are updated to `agroisync.com`

### Firebase Hosting
1. Update `firebase.json` site name to `agroisync`
2. Deploy using `firebase deploy --only hosting:agroisync`
3. Verify domain configuration in Firebase Console

## Support

For Firebase-related issues:
- Check Firebase Console for project status
- Verify service account permissions
- Review Firebase logs for authentication errors
- Use debug token for development troubleshooting

---

**Last Updated**: December 2025
**Version**: 2.3.1
**Status**: Production Ready
