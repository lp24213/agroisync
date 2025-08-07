import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User,
  UserCredential,
  AuthError,
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  linkWithCredential,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from './config';

// User interface
export interface UserProfile {
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

// Authentication service class
export class FirebaseAuthService {
  private static instance: FirebaseAuthService;
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  private constructor() {}

  public static getInstance(): FirebaseAuthService {
    if (!FirebaseAuthService.instance) {
      FirebaseAuthService.instance = new FirebaseAuthService();
    }
    return FirebaseAuthService.instance;
  }

  // Initialize reCAPTCHA
  public initializeRecaptcha(containerId: string, callback: () => void): void {
    if (typeof window !== 'undefined' && window.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'normal',
        callback,
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        },
      });
    }
  }

  // Clear reCAPTCHA
  public clearRecaptcha(): void {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
  }

  // Email/Password Registration
  public async registerWithEmail(
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      // Create user with email and password
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, {
        displayName: fullName,
      });

      // Send email verification
      await sendEmailVerification(user);

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        fullName,
        phone,
        emailVerified: false,
        phoneVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          language: 'pt',
          theme: 'dark',
          notifications: {
            email: true,
            sms: false,
            push: true,
          },
        },
        security: {
          twoFactorEnabled: false,
          loginHistory: [],
        },
      };

      await this.saveUserProfile(userProfile);

      return { success: true, user: userProfile };
    } catch (error) {
      const authError = error as AuthError;
      return {
        success: false,
        error: this.getAuthErrorMessage(authError.code),
      };
    }
  }

  // Email/Password Login
  public async loginWithEmail(
    email: string,
    password: string
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      const userProfile = await this.getUserProfile(user.uid);

      if (userProfile) {
        // Update last login
        await this.updateLastLogin(user.uid);
        return { success: true, user: userProfile };
      } else {
        return { success: false, error: 'User profile not found' };
      }
    } catch (error) {
      const authError = error as AuthError;
      return {
        success: false,
        error: this.getAuthErrorMessage(authError.code),
      };
    }
  }

  // SMS Authentication
  public async sendSMSCode(
    phoneNumber: string,
    recaptchaToken: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.recaptchaVerifier) {
        return { success: false, error: 'reCAPTCHA not initialized' };
      }

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        this.recaptchaVerifier
      );

      // Store confirmation result for verification
      if (typeof window !== 'undefined') {
        (window as any).confirmationResult = confirmationResult;
      }

      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      return {
        success: false,
        error: this.getAuthErrorMessage(authError.code),
      };
    }
  }

  // Verify SMS Code
  public async verifySMSCode(
    code: string,
    userProfile?: UserProfile
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      if (typeof window === 'undefined' || !(window as any).confirmationResult) {
        return { success: false, error: 'SMS verification not initiated' };
      }

      const confirmationResult = (window as any).confirmationResult;
      const result = await confirmationResult.confirm(code);

      if (result.user) {
        let userProfile = await this.getUserProfile(result.user.uid);

        if (!userProfile) {
          // Create new user profile for phone-only registration
          userProfile = {
            uid: result.user.uid,
            email: result.user.email || '',
            fullName: result.user.displayName || 'User',
            phone: result.user.phoneNumber || '',
            emailVerified: false,
            phoneVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLoginAt: new Date(),
            preferences: {
              language: 'pt',
              theme: 'dark',
              notifications: {
                email: false,
                sms: true,
                push: true,
              },
            },
            security: {
              twoFactorEnabled: false,
              loginHistory: [],
            },
          };

          await this.saveUserProfile(userProfile);
        } else {
          // Update phone verification status
          await this.updatePhoneVerification(result.user.uid, true);
          await this.updateLastLogin(result.user.uid);
        }

        return { success: true, user: userProfile };
      } else {
        return { success: false, error: 'Invalid verification code' };
      }
    } catch (error) {
      const authError = error as AuthError;
      return {
        success: false,
        error: this.getAuthErrorMessage(authError.code),
      };
    }
  }

  // Wallet Authentication
  public async authenticateWithWallet(
    walletAddress: string,
    signature: string,
    message: string,
    walletType: 'ethereum' | 'solana'
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      // Verify signature (this would be implemented based on your verification logic)
      const isValidSignature = await this.verifyWalletSignature(
        walletAddress,
        signature,
        message,
        walletType
      );

      if (!isValidSignature) {
        return { success: false, error: 'Invalid wallet signature' };
      }

      // Check if user exists with this wallet address
      let userProfile = await this.getUserByWalletAddress(walletAddress);

      if (!userProfile) {
        // Create new user profile for wallet-only registration
        userProfile = {
          uid: `wallet_${walletAddress.toLowerCase()}`,
          email: '',
          fullName: `Wallet User ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
          walletAddress,
          walletType,
          emailVerified: false,
          phoneVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLoginAt: new Date(),
          preferences: {
            language: 'pt',
            theme: 'dark',
            notifications: {
              email: false,
              sms: false,
              push: true,
            },
          },
          security: {
            twoFactorEnabled: false,
            loginHistory: [],
          },
        };

        await this.saveUserProfile(userProfile);
      } else {
        // Update last login
        await this.updateLastLogin(userProfile.uid);
      }

      return { success: true, user: userProfile };
    } catch (error) {
      return {
        success: false,
        error: 'Wallet authentication failed',
      };
    }
  }

  // Password Reset
  public async sendPasswordResetEmail(
    email: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      return {
        success: false,
        error: this.getAuthErrorMessage(authError.code),
      };
    }
  }

  // Logout
  public async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      return {
        success: false,
        error: this.getAuthErrorMessage(authError.code),
      };
    }
  }

  // Get current user profile
  public async getCurrentUserProfile(): Promise<UserProfile | null> {
    const user = auth.currentUser;
    if (!user) return null;

    return await this.getUserProfile(user.uid);
  }

  // Update user profile
  public async updateUserProfile(
    uid: string,
    updates: Partial<UserProfile>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update user profile',
      };
    }
  }

  // Delete user account
  public async deleteUserAccount(
    password?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      // Re-authenticate if password is provided
      if (password && user.email) {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      }

      // Delete user profile from Firestore
      await deleteDoc(doc(db, 'users', user.uid));

      // Delete Firebase Auth user
      await deleteUser(user);

      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      return {
        success: false,
        error: this.getAuthErrorMessage(authError.code),
      };
    }
  }

  // Private helper methods
  private async saveUserProfile(userProfile: UserProfile): Promise<void> {
    const userRef = doc(db, 'users', userProfile.uid);
    await setDoc(userRef, {
      ...userProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });
  }

  private async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
        } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  private async getUserByWalletAddress(walletAddress: string): Promise<UserProfile | null> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('walletAddress', '==', walletAddress));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
        } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user by wallet address:', error);
      return null;
    }
  }

  private async updateLastLogin(uid: string): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
    });
  }

  private async updatePhoneVerification(uid: string, verified: boolean): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      phoneVerified: verified,
      updatedAt: serverTimestamp(),
    });
  }

  private async verifyWalletSignature(
    walletAddress: string,
    signature: string,
    message: string,
    walletType: 'ethereum' | 'solana'
  ): Promise<boolean> {
    // This is a placeholder implementation
    // In a real application, you would verify the signature based on the wallet type
    try {
      if (walletType === 'ethereum') {
        // Implement Ethereum signature verification
        // You can use ethers.js or web3.js
        return true; // Placeholder
      } else if (walletType === 'solana') {
        // Implement Solana signature verification
        // You can use @solana/web3.js
        return true; // Placeholder
      }
      return false;
    } catch (error) {
      console.error('Error verifying wallet signature:', error);
      return false;
    }
  }

  private getAuthErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'User not found',
      'auth/wrong-password': 'Incorrect password',
      'auth/email-already-in-use': 'Email already in use',
      'auth/weak-password': 'Password is too weak',
      'auth/invalid-email': 'Invalid email address',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your connection',
      'auth/invalid-verification-code': 'Invalid verification code',
      'auth/invalid-verification-id': 'Invalid verification ID',
      'auth/quota-exceeded': 'SMS quota exceeded. Please try again later',
      'auth/captcha-check-failed': 'reCAPTCHA verification failed',
      'auth/invalid-phone-number': 'Invalid phone number',
      'auth/missing-phone-number': 'Phone number is required',
      'auth/invalid-credential': 'Invalid credentials',
      'auth/operation-not-allowed': 'Operation not allowed',
      'auth/user-disabled': 'User account has been disabled',
      'auth/requires-recent-login': 'Please log in again to perform this action',
    };

    return errorMessages[errorCode] || 'Authentication error occurred';
  }
}

// Export singleton instance
export const firebaseAuth = FirebaseAuthService.getInstance();
