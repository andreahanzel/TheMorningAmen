// src/controllers/contexts/AuthContext.tsx
// Complete authentication context with state management

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService, User, LoginCredentials, SignUpCredentials, AuthResponse } from '../../models/services/AuthService';

// Auth state interface
interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
    isInitialized: boolean;
    }

    // Auth actions
    type AuthAction =
    | { type: 'INIT_SUCCESS'; payload: { user: User | null } }
    | { type: 'INIT_ERROR' }
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: { user: User } }
    | { type: 'LOGIN_ERROR'; payload: { error: string } }
    | { type: 'SIGNUP_START' }
    | { type: 'SIGNUP_SUCCESS'; payload: { user: User } }
    | { type: 'SIGNUP_ERROR'; payload: { error: string } }
    | { type: 'LOGOUT_SUCCESS' }
    | { type: 'CLEAR_ERROR' }
    | { type: 'UPDATE_USER'; payload: { user: User } };

    // Initial state
    const initialState: AuthState = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
    isInitialized: false,
    };

    // Auth reducer
    const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'INIT_SUCCESS':
        return {
            ...state,
            user: action.payload.user,
            isAuthenticated: action.payload.user !== null,
            isInitialized: true,
            isLoading: false,
        };

        case 'INIT_ERROR':
        return {
            ...state,
            isInitialized: true,
            isLoading: false,
        };

        case 'LOGIN_START':
        case 'SIGNUP_START':
        return {
            ...state,
            isLoading: true,
            error: null,
        };

        case 'LOGIN_SUCCESS':
        case 'SIGNUP_SUCCESS':
        return {
            ...state,
            user: action.payload.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
        };

        case 'LOGIN_ERROR':
        case 'SIGNUP_ERROR':
        return {
            ...state,
            isLoading: false,
            error: action.payload.error,
            isAuthenticated: false,
            user: null,
        };

        case 'LOGOUT_SUCCESS':
        return {
            ...state,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        };

        case 'CLEAR_ERROR':
        return {
            ...state,
            error: null,
        };

        case 'UPDATE_USER':
        return {
            ...state,
            user: action.payload.user,
        };

        default:
        return state;
    }
    };

    // Auth context interface
    interface AuthContextType {
    // State
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
    isInitialized: boolean;

    // Actions
    login: (credentials: LoginCredentials) => Promise<boolean>;
    signUp: (credentials: SignUpCredentials) => Promise<boolean>;
    signInWithGoogle: () => Promise<boolean>;
    signInWithApple: () => Promise<boolean>;
    signInWithPhone: (phoneNumber: string) => Promise<boolean>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<boolean>;
    updateProfile: (updates: Partial<User>) => Promise<boolean>;
    verifyEmail: (code: string) => Promise<boolean>;
    clearError: () => void;
    setBiometricEnabled: (enabled: boolean) => Promise<void>;
    isBiometricEnabled: () => Promise<boolean>;
    }

    // Create context
    const AuthContext = createContext<AuthContextType | undefined>(undefined);

    // Auth provider component
    interface AuthProviderProps {
    children: React.ReactNode;
    }

    export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Initialize auth service
    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        try {
        await authService.initialize();
        const currentUser = authService.getCurrentUser();
        
        dispatch({
            type: 'INIT_SUCCESS',
            payload: { user: currentUser },
        });
        } catch (error) {
        console.error('Auth initialization failed:', error);
        dispatch({ type: 'INIT_ERROR' });
        }
    };

    // Login with email/password
    const login = async (credentials: LoginCredentials): Promise<boolean> => {
        dispatch({ type: 'LOGIN_START' });

        try {
        const response: AuthResponse = await authService.loginWithEmail(credentials);

        if (response.success && response.user) {
            dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: response.user },
            });
            return true;
        } else {
            dispatch({
            type: 'LOGIN_ERROR',
            payload: { error: response.error || 'Login failed' },
            });
            return false;
        }
        } catch (error) {
        dispatch({
            type: 'LOGIN_ERROR',
            payload: { error: 'An unexpected error occurred' },
        });
        return false;
        }
    };

    // Sign up with email/password
    const signUp = async (credentials: SignUpCredentials): Promise<boolean> => {
        dispatch({ type: 'SIGNUP_START' });

        try {
        const response: AuthResponse = await authService.signUpWithEmail(credentials);

        if (response.success && response.user) {
            dispatch({
            type: 'SIGNUP_SUCCESS',
            payload: { user: response.user },
            });
            return true;
        } else {
            dispatch({
            type: 'SIGNUP_ERROR',
            payload: { error: response.error || 'Sign up failed' },
            });
            return false;
        }
        } catch (error) {
        dispatch({
            type: 'SIGNUP_ERROR',
            payload: { error: 'An unexpected error occurred' },
        });
        return false;
        }
    };

    // Google Sign In
    const signInWithGoogle = async (): Promise<boolean> => {
        dispatch({ type: 'LOGIN_START' });

        try {
        const response: AuthResponse = await authService.signInWithGoogle();

        if (response.success && response.user) {
            dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: response.user },
            });
            return true;
        } else {
            dispatch({
            type: 'LOGIN_ERROR',
            payload: { error: response.error || 'Google sign in failed' },
            });
            return false;
        }
        } catch (error) {
        dispatch({
            type: 'LOGIN_ERROR',
            payload: { error: 'Google sign in failed' },
        });
        return false;
        }
    };

    // Apple Sign In
    const signInWithApple = async (): Promise<boolean> => {
        dispatch({ type: 'LOGIN_START' });

        try {
        const response: AuthResponse = await authService.signInWithApple();

        if (response.success && response.user) {
            dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: response.user },
            });
            return true;
        } else {
            dispatch({
            type: 'LOGIN_ERROR',
            payload: { error: response.error || 'Apple sign in failed' },
            });
            return false;
        }
        } catch (error) {
        dispatch({
            type: 'LOGIN_ERROR',
            payload: { error: 'Apple sign in failed' },
        });
        return false;
        }
    };

    // Phone Sign In
    const signInWithPhone = async (phoneNumber: string): Promise<boolean> => {
        dispatch({ type: 'LOGIN_START' });

        try {
        const response: AuthResponse = await authService.signInWithPhone(phoneNumber);

        if (response.success && response.user) {
            dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: response.user },
            });
            return true;
        } else {
            dispatch({
            type: 'LOGIN_ERROR',
            payload: { error: response.error || 'Phone sign in failed' },
            });
            return false;
        }
        } catch (error) {
        dispatch({
            type: 'LOGIN_ERROR',
            payload: { error: 'Phone sign in failed' },
        });
        return false;
        }
    };

    // Logout
    const logout = async (): Promise<void> => {
        try {
        await authService.logout();
        dispatch({ type: 'LOGOUT_SUCCESS' });
        } catch (error) {
        console.error('Logout failed:', error);
        // Even if logout fails, clear local state
        dispatch({ type: 'LOGOUT_SUCCESS' });
        }
    };

    // Reset Password
    const resetPassword = async (email: string): Promise<boolean> => {
        try {
        const response: AuthResponse = await authService.resetPassword(email);
        return response.success;
        } catch (error) {
        return false;
        }
    };

    // Update Profile
    const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
        try {
        const response: AuthResponse = await authService.updateProfile(updates);

        if (response.success && response.user) {
            dispatch({
            type: 'UPDATE_USER',
            payload: { user: response.user },
            });
            return true;
        }

        return false;
        } catch (error) {
        return false;
        }
    };

    // Verify Email
    const verifyEmail = async (code: string): Promise<boolean> => {
        try {
        const response: AuthResponse = await authService.verifyEmail(code);

        if (response.success && response.user) {
            dispatch({
            type: 'UPDATE_USER',
            payload: { user: response.user },
            });
            return true;
        }

        return false;
        } catch (error) {
        return false;
        }
    };

    // Clear Error
    const clearError = (): void => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    // Biometric Settings
    const setBiometricEnabled = async (enabled: boolean): Promise<void> => {
        await authService.setBiometricEnabled(enabled);
    };

    const isBiometricEnabled = async (): Promise<boolean> => {
        return await authService.isBiometricEnabled();
    };

    // Context value
    const contextValue: AuthContextType = {
        // State
        user: state.user,
        isLoading: state.isLoading,
        isAuthenticated: state.isAuthenticated,
        error: state.error,
        isInitialized: state.isInitialized,

        // Actions
        login,
        signUp,
        signInWithGoogle,
        signInWithApple,
        signInWithPhone,
        logout,
        resetPassword,
        updateProfile,
        verifyEmail,
        clearError,
        setBiometricEnabled,
        isBiometricEnabled,
    };

    return (
        <AuthContext.Provider value={contextValue}>
        {children}
        </AuthContext.Provider>
    );
    };

    // Custom hook to use auth context
    export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
};