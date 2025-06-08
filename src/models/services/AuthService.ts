// src/models/services/AuthService.ts
// Complete authentication service with social login integration
// This file is responsible for managing user authentication, including login, signup, and social sign-in methods.

import AsyncStorage from '@react-native-async-storage/async-storage';

// Types for authentication
export interface User {
  id: string; // Added missing ID field
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

  // Initialize auth service
  async initialize(): Promise<void> {
    try {
      const savedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      const savedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      
      if (savedUser && savedToken) {
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
      // Simulate API call - actual API calls would go here
      await this.simulateNetworkDelay();

      // Basic validation
      if (!credentials.email || !credentials.password) {
        return {
          success: false,
          error: 'Email and password are required'
        };
      }

      // Simulate authentication
      const user: User = {
        id: 'user_' + Date.now(),
        email: credentials.email,
        firstName: 'Demo',
        lastName: 'User',
        provider: 'email',
        createdAt: new Date().toISOString(),
        isEmailVerified: true,
      };

      const token = 'demo_token_' + Date.now();

      // Save to storage
      await this.saveUserSession(user, token);

      return {
        success: true,
        user,
        token
      };

    } catch (error) {
      return {
        success: false,
        error: 'Login failed. Please try again.'
      };
    }
  }

  // Email/Password Sign Up
  async signUpWithEmail(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      await this.simulateNetworkDelay();

      // Validation
      if (!credentials.email || !credentials.password || !credentials.firstName) {
        return {
          success: false,
          error: 'All fields are required'
        };
      }

      if (credentials.password.length < 8) {
        return {
          success: false,
          error: 'Password must be at least 8 characters long'
        };
      }

      // Create new user
      const user: User = {
        id: 'user_' + Date.now(),
        email: credentials.email,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        provider: 'email',
        createdAt: new Date().toISOString(),
        isEmailVerified: false,
      };

      const token = 'demo_token_' + Date.now();

      // Save to storage
      await this.saveUserSession(user, token);

      return {
        success: true,
        user,
        token
      };

    } catch (error) {
      return {
        success: false,
        error: 'Sign up failed. Please try again.'
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
      // Clear local storage
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.TOKEN,
      ]);

      // Clear instance variables
      this.currentUser = null;
      this.authToken = null;

      // In a real app, you might also want to:
      // - Revoke tokens on the server
      // - Clear other sensitive data
      // - Reset app state

    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Reset Password
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      await this.simulateNetworkDelay();

      // In a real app, you would send a reset email
      // For demo purposes, we'll just return success

      return {
        success: true,
        error: undefined
      };

    } catch (error) {
      return {
        success: false,
        error: 'Password reset failed. Please try again.'
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
      // In a real app, you would call your API to refresh the token
      await this.simulateNetworkDelay();
      
      // For demo, just return success
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();