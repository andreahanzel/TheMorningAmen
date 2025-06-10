// src/controllers/navigation/RootNavigator.tsx

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.


// Root Navigator that manages authentication and main app navigation
// Routes between Auth screens and Main app based on login status
// This file defines the main navigation structure of the app, including authentication and main tabs

    import React, { useState, useEffect } from 'react';
    import { View, StyleSheet } from 'react-native';
    import { NavigationContainer } from '@react-navigation/native';
    import { createStackNavigator } from '@react-navigation/stack';
    import AsyncStorage from '@react-native-async-storage/async-storage';

    // Import screens
    import { LoginScreen } from '../../views/screens/auth/LoginScreen';
    import { SignUpScreen } from '../../views/screens/auth/SignUpScreen';
    import { ForgotPasswordScreen } from '../../views/screens/auth/ForgotPasswordScreen';
    import { TermsAndConditionsScreen } from '../../views/screens/legal/TermsAndConditionsScreen';
    import { PrivacyPolicyScreen } from '../../views/screens/legal/PrivacyPolicyScreen';
    import { MainTabNavigator } from './MainTabNavigator';

    // Import components
    import { LoadingSpinner } from '../../views/components/common/LoadingSpinner';

    // Navigation types
    export type RootStackParamList = {
        Auth: undefined;
        Login: undefined;
        SignUp: undefined;
        ForgotPassword: undefined;
        TermsAndConditions: undefined;
        PrivacyPolicy: undefined;
        MainTabs: undefined;
    };

    const Stack = createStackNavigator<RootStackParamList>();

    // Auth Stack Component
    const AuthStack = () => {
    return (
        <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            cardStyleInterpolator: ({
                current,
                layouts,
            }: {
                current: { progress: { interpolate: (config: { inputRange: number[]; outputRange: number[] }) => any } };
                layouts: { screen: { width: number } };
            }) => {
            return {
                cardStyle: {
                transform: [
                    {
                    translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                    }),
                    },
                ],
                },
            };
            },
        }}
        >
        <Stack.Screen name="Login">
            {({ navigation }: { navigation: import('@react-navigation/native').NavigationProp<RootStackParamList, 'Login'> }) => (
            <LoginScreen
                onLogin={() => navigation.navigate('MainTabs')}
                onSignUp={() => navigation.navigate('SignUp')}
                onGoogleLogin={() => navigation.navigate('MainTabs')}
                onAppleLogin={() => navigation.navigate('MainTabs')}
                onBack={() => navigation.goBack()}
                onForgotPassword={() => navigation.navigate('ForgotPassword')}
            />
            )}
        </Stack.Screen>
        
        <Stack.Screen name="SignUp">
            {({ navigation }: { navigation: import('@react-navigation/native').NavigationProp<RootStackParamList, 'SignUp'> }) => (
            <SignUpScreen
                onSignUp={() => navigation.navigate('MainTabs')}
                onLogin={() => navigation.navigate('Login')}
                onBack={() => navigation.goBack()}
                onGoogleSignUp={() => navigation.navigate('MainTabs')}
                onAppleSignUp={() => navigation.navigate('MainTabs')}
                navigation={navigation}
            />
            )}
        </Stack.Screen>
        
        <Stack.Screen name="ForgotPassword">
            {({ navigation }: { navigation: import('@react-navigation/native').NavigationProp<RootStackParamList, 'ForgotPassword'> }) => (
            <ForgotPasswordScreen
                onBack={() => navigation.goBack()}
                onSuccess={() => navigation.navigate('Login')}
            />
            )}
        </Stack.Screen>
                <Stack.Screen name="TermsAndConditions">
            {({ navigation }: { navigation: import('@react-navigation/native').NavigationProp<RootStackParamList, 'TermsAndConditions'> }) => (
            <TermsAndConditionsScreen
                navigation={navigation}
            />
            )}
        </Stack.Screen>

        <Stack.Screen name="PrivacyPolicy">
            {({ navigation }: { navigation: import('@react-navigation/native').NavigationProp<RootStackParamList, 'PrivacyPolicy'> }) => (
            <PrivacyPolicyScreen
                navigation={navigation}
            />
            )}
        </Stack.Screen>
        </Stack.Navigator>
    );
    };

    // Main App Component
    export const RootNavigator: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
        setIsLoading(true);
        
        // Check if user is logged in
        const currentUser = await AsyncStorage.getItem('@current_user');
        
        if (currentUser) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
        } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
        } finally {
        // Add a small delay for smooth transition
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        }
    };

    const handleLogout = async () => {
        try {
        await AsyncStorage.removeItem('@current_user');
        setIsAuthenticated(false);
        } catch (error) {
        console.error('Error during logout:', error);
        }
    };

    // Show loading screen while checking auth
    if (isLoading) {
        return (
        <View style={styles.loadingContainer}>
            <LoadingSpinner />
        </View>
        );
    }

    return (
        <NavigationContainer>
        <Stack.Navigator
            screenOptions={{
            headerShown: false,
            gestureEnabled: false,
            cardStyle: { flex: 1 }, // Ensure the card style takes full height
            }}
        >
            {isAuthenticated ? (
            <Stack.Screen name="MainTabs">
                {({ navigation }: { navigation: import('@react-navigation/native').NavigationProp<RootStackParamList, 'MainTabs'> }) => (
                    <MainTabNavigator />
                    )}
            </Stack.Screen>
            ) : (
            <Stack.Screen name="Auth" component={AuthStack} />
            )}
        </Stack.Navigator>
        </NavigationContainer>
    );
    };

    const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff9a56',
    },
});