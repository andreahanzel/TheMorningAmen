// src/models/services/AuthService.ts

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

// Complete authentication service with social login integration
// This file is responsible for managing user authentication, including login, signup, and social sign-in methods.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuthInstance, db } from '../../../firebase.config';
import type { Auth } from 'firebase/auth';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';

import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc 
} from 'firebase/firestore';

// Types for authentication
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  provider: 'email' | 'google' | 'apple' | 'phone';
  createdAt: string;
  isEmailVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

// Storage keys
const STORAGE_KEYS = {
  USER: '@morning_amen_user',
  TOKEN: '@morning_amen_token',
  BIOMETRIC_ENABLED: '@morning_amen_biometric',
  REMEMBER_ME: '@morning_amen_remember',
};

class AuthService {
  private currentUser: User | null = null;
  private authToken: string | null = null;

  // Get Firebase Auth instance with proper error handling
  private getAuth(): Auth {
    try {
      return getAuthInstance();
    } catch (error) {
      console.error('Firebase Auth is not available:', error);
      throw new Error('Authentication service is not available');
    }
  }

  async initialize(): Promise<void> {
    try {
      const auth = this.getAuth();
      
      // Listen to Firebase auth state changes
      onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        try {
          if (firebaseUser) {
            // User is signed in
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            let user: User;
            
            if (userDoc.exists()) {
              user = { id: firebaseUser.uid, ...userDoc.data() } as User;
            } else {
              user = this.mapFirebaseUserToUser(firebaseUser);
            }
            
            const token = await firebaseUser.getIdToken();
            await this.saveUserSession(user, token);
          } else {
            // User is signed out
            this.currentUser = null;
            this.authToken = null;
            await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.TOKEN]);
          }
        } catch (error) {
          console.error('Auth state change error:', error);
        }
      });
      
      // Fallback to AsyncStorage for compatibility
      const savedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      const savedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      
      if (savedUser && savedToken && !this.currentUser) {
        this.currentUser = JSON.parse(savedUser);
        this.authToken = savedToken;
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null && this.authToken !== null;
  }

  // Email/Password Login
  async loginWithEmail(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const auth = this.getAuth();
      
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        credentials.email, 
        credentials.password
      );

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      let user: User;
      
      if (userDoc.exists()) {
        user = { id: userCredential.user.uid, ...userDoc.data() } as User;
      } else {
        // Fallback to Firebase user data if Firestore doc doesn't exist
        user = this.mapFirebaseUserToUser(userCredential.user);
      }
      
      const token = await userCredential.user.getIdToken();
      
      // Save user session
      await this.saveUserSession(user, token);
      
      return {
        success: true,
        user,
        token
      };

    } catch (error: any) {
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Email/Password Sign Up
  async signUpWithEmail(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      const auth = this.getAuth();
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      await updateProfile(userCredential.user, {
        displayName: `${credentials.firstName} ${credentials.lastName}`
      });

      const user = this.mapFirebaseUserToUser(userCredential.user);
      user.firstName = credentials.firstName;
      user.lastName = credentials.lastName;
      
      // Save user profile to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        id: userCredential.user.uid,
        email: credentials.email,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        provider: 'email',
        createdAt: new Date().toISOString(),
        isEmailVerified: userCredential.user.emailVerified,
        profilePicture: null,
        favorites: [],
        prayerRequests: []
      });

      const token = await userCredential.user.getIdToken();

      return {
        success: true,
        user,
        token
      };
      
    } catch (error: any) {
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Update Profile in Firestore
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<AuthResponse> {
    try {
      if (!this.currentUser) {
        return {
          success: false,
          error: 'No user logged in'
        };
      }

      // Update in Firestore
      await updateDoc(doc(db, 'users', userId), updates);
      
      // Update local user data
      const updatedUser = { ...this.currentUser, ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      this.currentUser = updatedUser;

      return {
        success: true,
        user: updatedUser
      };

    } catch (error) {
      return {
        success: false,
        error: 'Profile update failed. Please try again.'
      };
    }
  }

  // Google Sign In
  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      await this.simulateNetworkDelay();

      // In a real app, you would use:
      // import { GoogleSignin } from '@react-native-google-signin/google-signin';
      // const userInfo = await GoogleSignin.signIn();

      // Simulated Google user data
      const user: User = {
        id: 'google_user_' + Date.now(),
        email: 'demo@gmail.com',
        firstName: 'Demo',
        lastName: 'Google User',
        profilePicture: 'https://via.placeholder.com/150',
        provider: 'google',
        createdAt: new Date().toISOString(),
        isEmailVerified: true,
      };

      const token = 'google_token_' + Date.now();
      await this.saveUserSession(user, token);

      return {
        success: true,
        user,
        token
      };

    } catch (error) {
      return {
        success: false,
        error: 'Google sign in failed. Please try again.'
      };
    }
  }

  // Apple Sign In
  async signInWithApple(): Promise<AuthResponse> {
    try {
      await this.simulateNetworkDelay();

      // Simulated Apple user data
      const user: User = {
        id: 'apple_user_' + Date.now(),
        email: 'demo@privaterelay.appleid.com',
        firstName: 'Demo',
        lastName: 'Apple User',
        provider: 'apple',
        createdAt: new Date().toISOString(),
        isEmailVerified: true,
      };

      const token = 'apple_token_' + Date.now();
      await this.saveUserSession(user, token);

      return {
        success: true,
        user,
        token
      };

    } catch (error) {
      return {
        success: false,
        error: 'Apple sign in failed. Please try again.'
      };
    }
  }

  // Phone Sign In
  async signInWithPhone(phoneNumber: string): Promise<AuthResponse> {
    try {
      await this.simulateNetworkDelay();

      const user: User = {
        id: 'phone_user_' + Date.now(),
        email: `${phoneNumber}@phone.auth`,
        firstName: 'Phone',
        lastName: 'User',
        provider: 'phone',
        createdAt: new Date().toISOString(),
        isEmailVerified: true,
      };

      const token = 'phone_token_' + Date.now();
      await this.saveUserSession(user, token);

      return {
        success: true,
        user,
        token
      };

    } catch (error) {
      return {
        success: false,
        error: 'Phone sign in failed. Please try again.'
      };
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      const auth = this.getAuth();
      
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear local storage
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.TOKEN,
      ]);

      // Clear instance variables
      this.currentUser = null;
      this.authToken = null;

    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Reset Password
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const auth = this.getAuth();
      await sendPasswordResetEmail(auth, email);

      return {
        success: true,
        error: undefined
      };

    } catch (error: any) {
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Update Profile
  async updateProfile(updates: Partial<User>): Promise<AuthResponse> {
    try {
      if (!this.currentUser) {
        return {
          success: false,
          error: 'No user logged in'
        };
      }

      await this.simulateNetworkDelay();

      // Update user data
      const updatedUser = { ...this.currentUser, ...updates };
      
      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      this.currentUser = updatedUser;

      return {
        success: true,
        user: updatedUser
      };

    } catch (error) {
      return {
        success: false,
        error: 'Profile update failed. Please try again.'
      };
    }
  }

  // Verify Email
  async verifyEmail(code: string): Promise<AuthResponse> {
    try {
      await this.simulateNetworkDelay();

      if (!this.currentUser) {
        return {
          success: false,
          error: 'No user logged in'
        };
      }

      // Update email verification status
      const updatedUser = { ...this.currentUser, isEmailVerified: true };
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      this.currentUser = updatedUser;

      return {
        success: true,
        user: updatedUser
      };

    } catch (error) {
      return {
        success: false,
        error: 'Email verification failed. Please try again.'
      };
    }
  }

  // Enable/Disable Biometric Authentication
  async setBiometricEnabled(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.BIOMETRIC_ENABLED, 
        JSON.stringify(enabled)
      );
    } catch (error) {
      console.error('Biometric setting error:', error);
    }
  }

  // Check if biometric is enabled
  async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
      return enabled ? JSON.parse(enabled) : false;
    } catch (error) {
      return false;
    }
  }

  // Private helper methods
  private async saveUserSession(user: User, token: string): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.USER, JSON.stringify(user)],
        [STORAGE_KEYS.TOKEN, token],
      ]);

      this.currentUser = user;
      this.authToken = token;

    } catch (error) {
      console.error('Save session error:', error);
      throw error;
    }
  }

  private async simulateNetworkDelay(): Promise<void> {
    // Simulate network delay for demo purposes
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  // Get auth headers for API calls
  getAuthHeaders(): { [key: string]: string } {
    return {
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json',
    };
  }

  // Refresh token (for production apps)
  async refreshToken(): Promise<boolean> {
    try {
      const auth = this.getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.getIdToken(true);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  private mapFirebaseUserToUser(firebaseUser: FirebaseUser): User {
    const [firstName, lastName] = (firebaseUser.displayName || '').split(' ');
    
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      firstName: firstName || 'User',
      lastName: lastName || '',
      profilePicture: firebaseUser.photoURL || undefined,
      provider: 'email',
      createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
      isEmailVerified: firebaseUser.emailVerified
    };
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/invalid-email':
        return 'Please enter a valid email address';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later';
      default:
        return 'Authentication failed. Please try again';
    }
  }
}

// Export singleton instance
export const authService = new AuthService();