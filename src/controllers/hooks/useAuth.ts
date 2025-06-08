// src/controllers/hooks/useAuth.ts
// Custom hook for authentication with additional utilities
// This file defines a custom hook for managing authentication in the application, providing functionalities to log in, sign up, social login, logout, and reset password with feedback mechanisms.

import { useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { authService, User, LoginCredentials, SignUpCredentials } from '../../models/services/AuthService';

// Re-export the context hook
export { useAuth } from '../contexts/AuthContext';

// Enhanced auth hook with additional utilities
export const useAuthActions = () => {
    const [isProcessing, setIsProcessing] = useState(false);

    // Enhanced login with loading state and error handling
    const loginWithFeedback = async (
        credentials: LoginCredentials,
        onSuccess?: () => void,
        onError?: (error: string) => void
    ): Promise<boolean> => {
        setIsProcessing(true);

        try {
        const response = await authService.loginWithEmail(credentials);

        if (response.success) {
            onSuccess?.();
            return true;
        } else {
            const errorMessage = response.error || 'Login failed';
            onError?.(errorMessage);
            Alert.alert('Login Failed', errorMessage);
            return false;
        }
        } catch (error) {
        const errorMessage = 'An unexpected error occurred';
        onError?.(errorMessage);
        Alert.alert('Error', errorMessage);
        return false;
        } finally {
        setIsProcessing(false);
        }
    };

    // Enhanced sign up with loading state and error handling
    const signUpWithFeedback = async (
        credentials: SignUpCredentials,
        onSuccess?: () => void,
        onError?: (error: string) => void
    ): Promise<boolean> => {
        setIsProcessing(true);

        try {
        const response = await authService.signUpWithEmail(credentials);

        if (response.success) {
            onSuccess?.();
            Alert.alert(
            'Welcome! 🎉',
            'Your account has been created successfully!',
            [{ text: 'Continue', style: 'default' }]
            );
            return true;
        } else {
            const errorMessage = response.error || 'Sign up failed';
            onError?.(errorMessage);
            Alert.alert('Sign Up Failed', errorMessage);
            return false;
        }
        } catch (error) {
        const errorMessage = 'An unexpected error occurred';
        onError?.(errorMessage);
        Alert.alert('Error', errorMessage);
        return false;
        } finally {
        setIsProcessing(false);
        }
    };

    // Social login with feedback
    const socialLoginWithFeedback = async (
        provider: 'google' | 'apple' | 'phone',
        onSuccess?: () => void,
        onError?: (error: string) => void,
        phoneNumber?: string
    ): Promise<boolean> => {
        setIsProcessing(true);

        try {
        let response;

        switch (provider) {
            case 'google':
            response = await authService.signInWithGoogle();
            break;
            case 'apple':
            response = await authService.signInWithApple();
            break;
            case 'phone':
            if (!phoneNumber) {
                throw new Error('Phone number is required');
            }
            response = await authService.signInWithPhone(phoneNumber);
            break;
            default:
            throw new Error('Invalid provider');
        }

        if (response.success) {
            onSuccess?.();
            Alert.alert(
            'Welcome! 🎉',
            `You've successfully signed in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}!`
            );
            return true;
        } else {
            const errorMessage = response.error || `${provider} sign in failed`;
            onError?.(errorMessage);
            Alert.alert('Sign In Failed', errorMessage);
            return false;
        }
        } catch (error) {
        const errorMessage = `${provider} sign in failed`;
        onError?.(errorMessage);
        Alert.alert('Error', errorMessage);
        return false;
        } finally {
        setIsProcessing(false);
        }
    };

    // Logout with confirmation
    const logoutWithConfirmation = async (
        onSuccess?: () => void
    ): Promise<void> => {
        Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
            {
            text: 'Cancel',
            style: 'cancel',
            },
            {
            text: 'Sign Out',
            style: 'destructive',
            onPress: async () => {
                try {
                await authService.logout();
                onSuccess?.();
                Alert.alert('Signed Out', 'You have been successfully signed out.');
                } catch (error) {
                Alert.alert('Error', 'Failed to sign out. Please try again.');
                }
            },
            },
        ]
        );
    };

    // Reset password with feedback
    const resetPasswordWithFeedback = async (
        email: string,
        onSuccess?: () => void,
        onError?: (error: string) => void
    ): Promise<boolean> => {
        if (!email) {
        Alert.alert('Email Required', 'Please enter your email address.');
        return false;
        }

        setIsProcessing(true);

        try {
        const response = await authService.resetPassword(email);

        if (response.success) {
            onSuccess?.();
            Alert.alert(
            'Reset Link Sent',
            'A password reset link has been sent to your email address.',
            [{ text: 'OK', style: 'default' }]
            );
            return true;
        } else {
            const errorMessage = response.error || 'Password reset failed';
            onError?.(errorMessage);
            Alert.alert('Reset Failed', errorMessage);
            return false;
        }
        } catch (error) {
        const errorMessage = 'Failed to send reset email';
        onError?.(errorMessage);
        Alert.alert('Error', errorMessage);
        return false;
        } finally {
        setIsProcessing(false);
        }
    };

    return {
        isProcessing,
        loginWithFeedback,
        signUpWithFeedback,
        socialLoginWithFeedback,
        logoutWithConfirmation,
        resetPasswordWithFeedback,
    };
    };

    // Hook for auth state monitoring
    export const useAuthState = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuthState = async () => {
        try {
            await authService.initialize();
            const currentUser = authService.getCurrentUser();
            
            setUser(currentUser);
            setIsAuthenticated(currentUser !== null);
        } catch (error) {
            console.error('Auth state initialization failed:', error);
        } finally {
            setIsLoading(false);
        }
        };

        initializeAuthState();
    }, []);

    const refreshAuthState = async () => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(currentUser !== null);
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        refreshAuthState,
    };
    };

    // Hook for user profile management
    export const useUserProfile = () => {
    const [isUpdating, setIsUpdating] = useState(false);

    const updateProfileWithFeedback = async (
        updates: Partial<User>,
        onSuccess?: () => void,
        onError?: (error: string) => void
    ): Promise<boolean> => {
        setIsUpdating(true);

        try {
        const response = await authService.updateProfile(updates);

        if (response.success) {
            onSuccess?.();
            Alert.alert(
            'Profile Updated',
            'Your profile has been updated successfully!',
            [{ text: 'OK', style: 'default' }]
            );
            return true;
        } else {
            const errorMessage = response.error || 'Profile update failed';
            onError?.(errorMessage);
            Alert.alert('Update Failed', errorMessage);
            return false;
        }
        } catch (error) {
        const errorMessage = 'Failed to update profile';
        onError?.(errorMessage);
        Alert.alert('Error', errorMessage);
        return false;
        } finally {
        setIsUpdating(false);
        }
    };

    const verifyEmailWithFeedback = async (
        code: string,
        onSuccess?: () => void,
        onError?: (error: string) => void
    ): Promise<boolean> => {
        if (!code) {
        Alert.alert('Code Required', 'Please enter the verification code.');
        return false;
        }

        setIsUpdating(true);

        try {
        const response = await authService.verifyEmail(code);

        if (response.success) {
            onSuccess?.();
            Alert.alert(
            'Email Verified! ✓',
            'Your email has been successfully verified.',
            [{ text: 'Great!', style: 'default' }]
            );
            return true;
        } else {
            const errorMessage = response.error || 'Email verification failed';
            onError?.(errorMessage);
            Alert.alert('Verification Failed', errorMessage);
            return false;
        }
        } catch (error) {
        const errorMessage = 'Failed to verify email';
        onError?.(errorMessage);
        Alert.alert('Error', errorMessage);
        return false;
        } finally {
        setIsUpdating(false);
        }
    };

    return {
        isUpdating,
        updateProfileWithFeedback,
        verifyEmailWithFeedback,
    };
};