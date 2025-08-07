# 🔐 Firebase Authentication Setup Guide

## Overview
This guide explains how to set up and use the Firebase Authentication system in the AGROTM project. The system supports multiple authentication methods including email/password, SMS, and wallet-based authentication.

## 🚀 Quick Start

### 1. Firebase Project Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Enter project name (e.g., "agrotm-solana")
   - Follow the setup wizard

2. **Enable Authentication**
   - In Firebase Console, go to "Authentication" > "Sign-in method"
   - Enable the following providers:
     - Email/Password
     - Phone (for SMS verification)
     - Anonymous (optional, for guest users)

3. **Configure Firestore Database**
   - Go to "Firestore Database" > "Create database"
   - Choose "Start in test mode" for development
   - Select a location close to your users

### 2. Environment Configuration

Copy the Firebase configuration from your project settings:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Install Dependencies

```bash
npm install firebase
# or
pnpm add firebase
```

## 🔧 Configuration Files

### Firebase Config (`frontend/lib/firebase/config.ts`)
- Initializes Firebase app and services
- Configures authentication, Firestore, and storage
- Sets up development emulators

### Authentication Service (`frontend/lib/firebase/auth.ts`)
- Handles all authentication operations
- Manages user profiles in Firestore
- Provides error handling and validation

### React Hook (`frontend/hooks/useAuth.ts`)
- Provides easy access to authentication state
- Manages loading and error states
- Offers authentication methods for components

## 📱 Authentication Methods

### 1. Email/Password Authentication

```typescript
import { useAuth } from '../hooks/useAuth';

const { loginWithEmail, registerWithEmail } = useAuth();

// Registration
const result = await registerWithEmail(
  'user@example.com',
  'password123',
  'John Doe',
  '+1234567890'
);

// Login
const result = await loginWithEmail('user@example.com', 'password123');
```

### 2. SMS Authentication

```typescript
import { useAuth } from '../hooks/useAuth';

const { sendSMSVerification, verifySMSCode } = useAuth();

// Send SMS verification
const result = await sendSMSVerification('+1234567890', 'recaptcha_token');

// Verify SMS code
const result = await verifySMSCode('123456');
```

### 3. Wallet Authentication (Metamask)

```typescript
import { useAuth } from '../hooks/useAuth';

const { loginWithMetamask } = useAuth();

// Login with Metamask
const result = await loginWithMetamask();
```

## 🗄️ User Profile Structure

```typescript
interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone?: string;
  walletAddress?: string;
  walletType?: 'ethereum' | 'solana';
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  preferences: {
    language: 'pt' | 'en' | 'es' | 'zh';
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  security: {
    twoFactorEnabled: boolean;
    loginHistory: Array<{
      timestamp: Date;
      ip: string;
      userAgent: string;
      location?: string;
    }>;
  };
}
```

## 🔒 Security Features

### 1. Password Requirements
- Minimum 8 characters
- Recommended: uppercase, lowercase, numbers, special characters

### 2. Rate Limiting
- Login attempts: 3 per 5 minutes
- Registration attempts: 2 per 10 minutes
- Account lockout: 15 minutes after max attempts

### 3. Session Management
- Maximum 5 concurrent sessions
- Session timeout: 30 minutes
- Automatic cleanup of expired sessions

### 4. Input Validation
- Email format validation
- Phone number format validation (international format)
- Wallet address validation
- reCAPTCHA integration

## 🌐 API Endpoints

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Email/password login |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login-metamask` | Wallet-based login |
| POST | `/api/auth/forgot-password` | Password reset |
| POST | `/api/auth/send-sms` | Send SMS verification |
| POST | `/api/auth/verify-sms` | Verify SMS code |
| POST | `/api/auth/verify-email` | Verify email code |
| POST | `/api/auth/resend-verification` | Resend verification |

## 🧪 Testing

### Development with Emulators

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Start Emulators**
   ```bash
   firebase emulators:start
   ```

3. **Configure Environment**
   ```env
   NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
   ```

### Test Users

Create test users in Firebase Console or use the registration form:

```typescript
// Test user data
const testUser = {
  email: 'test@agrotm.com',
  password: 'TestPassword123!',
  fullName: 'Test User',
  phone: '+1234567890'
};
```

## 🚨 Error Handling

### Common Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| `auth/user-not-found` | User doesn't exist | Check email or register |
| `auth/wrong-password` | Incorrect password | Verify password |
| `auth/email-already-in-use` | Email already registered | Use different email or login |
| `auth/weak-password` | Password too weak | Use stronger password |
| `auth/invalid-email` | Invalid email format | Check email format |
| `auth/too-many-requests` | Too many attempts | Wait before retrying |
| `auth/invalid-verification-code` | Wrong SMS code | Check code and retry |

### Error Handling in Components

```typescript
const { error, clearError } = useAuth();

useEffect(() => {
  if (error) {
    // Show error message to user
    toast.error(error);
    clearError();
  }
}, [error, clearError]);
```

## 🔄 State Management

### Authentication State

The `useAuth` hook provides:

```typescript
const {
  user,           // Firebase User object
  userProfile,    // Custom UserProfile object
  loading,        // Loading state
  error,          // Error message
  // ... authentication methods
} = useAuth();
```

### Protected Routes

```typescript
// Component wrapper for protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  return <>{children}</>;
};
```

## 📱 Mobile Considerations

### SMS Authentication
- Requires reCAPTCHA verification
- Phone number must be in international format
- Limited to 10 SMS per phone number per day

### Wallet Authentication
- Requires Metamask or similar wallet
- Works best on desktop browsers
- Mobile wallets may require different implementation

## 🔧 Customization

### Custom User Profile Fields

Add custom fields to the UserProfile interface:

```typescript
interface UserProfile {
  // ... existing fields
  customField?: string;
  preferences: {
    // ... existing preferences
    customPreference?: boolean;
  };
}
```

### Custom Authentication Methods

Extend the FirebaseAuthService class:

```typescript
class CustomAuthService extends FirebaseAuthService {
  async customAuthMethod() {
    // Custom authentication logic
  }
}
```

## 🚀 Deployment

### Production Checklist

- [ ] Configure Firebase project for production
- [ ] Set up proper Firestore security rules
- [ ] Configure authentication providers
- [ ] Set up email templates
- [ ] Configure SMS provider (Twilio, etc.)
- [ ] Set up monitoring and analytics
- [ ] Test all authentication flows
- [ ] Configure CORS and security headers

### Environment Variables

Ensure all Firebase environment variables are set in your deployment platform (Vercel, Railway, etc.).

## 📚 Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
- [Next.js Authentication](https://nextjs.org/docs/authentication)

## 🤝 Support

For issues or questions:
1. Check Firebase Console logs
2. Review browser console for errors
3. Verify environment variables
4. Test with Firebase emulators
5. Check network connectivity
