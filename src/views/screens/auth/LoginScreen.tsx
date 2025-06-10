// src/views/screens/auth/LoginScreen.tsx

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

// This is the login / sign-in screen for the app
// Login screen with social authentication
// This screen includes a mini logo, animated entrance effects, and a modern design
// It features a welcome message, email and password inputs, social login options, and a guest mode button
// The design is inspired by modern UI trends with a focus on user experience
// The screen uses React Native components, Expo's LinearGradient for backgrounds, and animations for smooth transitions

import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Animated,
    Dimensions,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ViewStyle,
    } from 'react-native';
    import { LinearGradient } from 'expo-linear-gradient';
    import { Feather, FontAwesome } from '@expo/vector-icons';
    import AsyncStorage from '@react-native-async-storage/async-storage';

    const { width, height } = Dimensions.get('window');

    interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    createdAt?: string;
    loginTime?: string;
    }
    interface LoginScreenProps {
    onLogin: () => void;
    onSignUp: () => void;
    onGoogleLogin: () => void;
    onAppleLogin: () => void;
    onBack: () => void;
    onForgotPassword: () => void;
    }

    export const LoginScreen: React.FC<LoginScreenProps> = ({
    onLogin,
    onSignUp,
    onGoogleLogin,
    onAppleLogin,
    onBack,
    onForgotPassword,
    }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    // Animation values
    const slideAnim = useRef(new Animated.Value(50)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    React.useEffect(() => {
        // Entrance animations
        Animated.parallel([
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
        }),
        ]).start();
    }, []);

    const handleLogin = async () => {
        const errors: {[key: string]: string} = {};
        
        // Check for missing fields
        if (!email.trim()) errors.email = 'Email is required';
        if (!password) errors.password = 'Password is required';
        
        // Validate email format
        if (email.trim() && (!email.includes('@') || !email.includes('.'))) {
            errors.email = 'Please enter a valid email address';
        }
        
        // Basic password length validation for login
        if (password && password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        
        setValidationErrors(errors);
        
        // If there are errors, don't proceed
        if (Object.keys(errors).length > 0) {
            return;
        }

        setIsLoading(true);
        
        try {
            // Get stored users from AsyncStorage
            const storedUsers = await AsyncStorage.getItem('@registered_users');
            let users = [];
            
            if (storedUsers) {
                users = JSON.parse(storedUsers);
            }
            
            // Check if user exists with matching email and password
            const foundUser = users.find((user: User) => 
                user.email.toLowerCase() === email.toLowerCase().trim() && 
                user.password === password
            );
            
            if (foundUser) {
                // Store current user session
                await AsyncStorage.setItem('@current_user', JSON.stringify({
                    email: foundUser.email,
                    firstName: foundUser.firstName,
                    lastName: foundUser.lastName,
                    loginTime: new Date().toISOString()
                }));
                
                setIsLoading(false);
                onLogin(); // Success - proceed to app
            } else {
                // Authentication failed
                setIsLoading(false);
                setValidationErrors({
                    email: 'Invalid email or password',
                    password: 'Invalid email or password'
                });
            }
            
        } catch (error) {
            console.error('Login error:', error);
            setIsLoading(false);
            setValidationErrors({
                email: 'Login failed. Please try again.',
                password: 'Login failed. Please try again.'
            });
        }
    };

    // Handle guest login with confirmation
    const handleGuestLogin = () => {
        if (Platform.OS === 'web') {
            // On web, use browser confirm dialog
            const confirmed = window.confirm(
                'Continue as Guest?\n\nYou\'ll have limited access to features. You can always sign up later for the full experience.'
            );
            if (confirmed) {
                onLogin();
            }
        } else {
            // On mobile, use React Native Alert
            Alert.alert(
                'Continue as Guest?',
                'You\'ll have limited access to features. You can always sign up later for the full experience.',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Continue',
                        onPress: () => {
                            onLogin();
                        },
                    },
                ]
            );
        }
    };


    // Helper function
    const getInputWrapperStyle = (fieldName: string, isValid?: boolean): ViewStyle[] => {
        const hasError = validationErrors[fieldName];
        const baseStyles: ViewStyle[] = [styles.inputWrapper];

        if (focusedInput === fieldName) baseStyles.push(styles.inputWrapperFocused);
        if (hasError) baseStyles.push(styles.inputWrapperError);
        else if (isValid) baseStyles.push(styles.inputWrapperSuccess);

        return baseStyles;
    };

    // Check if email is valid
    const isValidEmail = email.includes('@') && email.includes('.');

    return (
    <LinearGradient
            colors={['#ff9a56', '#ff6b35', '#f7931e'] as const}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.formWrapper}>
                    {/* Header with Mini Logo */}
                    <Animated.View
                        style={[
                            styles.header,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <TouchableOpacity style={styles.backButton} onPress={onBack}>
                            <View style={styles.backIcon}>
                                <View style={styles.backArrow} />
                            </View>
                        </TouchableOpacity>
                        <View style={styles.miniLogoContainer}>
                            <View style={styles.miniLogo}>
                            <LinearGradient
                                    colors={['#ffeb3b', '#ff6b35', '#f7931e'] as const}
                                    style={styles.miniLogoGradient}
                                >
                                    <Text style={styles.miniLogoText}>TMA</Text>
                                </LinearGradient>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Welcome Section */}
                    <Animated.View
                        style={[
                            styles.welcomeSection,
                            {
                                opacity: fadeAnim,
                                transform: [
                                    { translateY: slideAnim },
                                    { scale: scaleAnim },
                                ],
                            },
                        ]}
                    >
                        <Text style={styles.welcomeTitle}>Welcome Back</Text>
                        <Text style={styles.welcomeSubtitle}>
                            Continue your spiritual journey
                        </Text>
                    </Animated.View>

                    {/* Login Form */}
                    <Animated.View
                        style={[
                            styles.formContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        {/* Email Input */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Email</Text>
                                <View style={getInputWrapperStyle('email', isValidEmail && email.length > 0)}>
                                    <TextInput
                                        style={styles.input}
                                        value={email}
                                        onChangeText={(text: string) => {
                                            setEmail(text);
                                            if (validationErrors.email) {
                                                setValidationErrors(prev => {
                                                    const newErrors = {...prev};
                                                    delete newErrors.email;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                        placeholder="Enter your email"
                                        placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        selectionColor="rgba(255, 255, 255, 0.5)"
                                        underlineColorAndroid="transparent"
                                        onFocus={() => setFocusedInput('email')}
                                        onBlur={() => setFocusedInput(null)}
                                    />
                                    {isValidEmail && email.length > 0 && !validationErrors.email && (
                                        <Text style={styles.validationIcon}>✓</Text>
                                    )}
                                </View>
                                {validationErrors.email && (
                                    <Text style={styles.errorText}>{validationErrors.email}</Text>
                                )}
                            </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <View style={getInputWrapperStyle('password', password.length > 0)}>
                                <TextInput
                                    style={[styles.input, styles.passwordInput]}
                                    value={password}
                                    onChangeText={(text: string) => {
                                        setPassword(text);
                                        if (validationErrors.password) {
                                            setValidationErrors(prev => {
                                                const newErrors = {...prev};
                                                delete newErrors.password;
                                                return newErrors;
                                            });
                                        }
                                    }}
                                    placeholder="Enter your password"
                                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                    secureTextEntry={!showPassword}
                                    selectionColor="rgba(255, 255, 255, 0.5)"
                                    underlineColorAndroid="transparent"
                                    onFocus={() => setFocusedInput('password')}
                                    onBlur={() => setFocusedInput(null)}
                                />
                                <TouchableOpacity
                                    style={styles.visibilityButton}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <View style={styles.eyeIcon}>
                                        {showPassword ? (
                                            <View style={styles.eyeContainer}>
                                                <View style={styles.eyeOuter} />
                                                <View style={styles.eyeInner} />
                                            </View>
                                        ) : (
                                            <View style={styles.eyeContainer}>
                                                <View style={styles.eyeOuter} />
                                                <View style={styles.eyeSlash} />
                                            </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
                                    {password.length > 0 && !validationErrors.password && (
                                        <Text style={styles.validationIcon}>✓</Text>
                                    )}
                                    </View>
                                    {validationErrors.password && (
                                        <Text style={styles.errorText}>{validationErrors.password}</Text>
                                    )}
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity
                            style={styles.forgotPassword}
                            onPress={onForgotPassword}
                        >
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            <LinearGradient
                                colors={['#ffeb3b', '#ff9800', '#ff6b35']}
                                style={styles.loginButtonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.loginButtonText}>
                                    {isLoading ? 'Signing In...' : 'Sign In'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Social Login Section */}
                    <Animated.View
                        style={[
                            styles.socialSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or continue with</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Social Buttons */}
                        <View style={styles.socialRow}>
                            <TouchableOpacity style={styles.socialButton} onPress={onGoogleLogin}>
                                <FontAwesome name="google" size={22} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton} onPress={onAppleLogin}>
                                <FontAwesome name="apple" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Sign Up Link */}
                    <Animated.View
                        style={[
                            styles.signUpSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <Text style={styles.signUpPrompt}>Don't have an account?</Text>
                        <TouchableOpacity onPress={onSignUp}>
                            <Text style={styles.signUpLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Guest Mode */}
                    <Animated.View
                        style={[
                            styles.guestSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.guestButton}
                            onPress={handleGuestLogin}
                        >
                            <Text style={styles.guestButtonText}>Continue as Guest</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>

        {/* Floating Particles */}
        <View style={styles.particlesContainer}>
            {[...Array(6)].map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.floatingParticle,
                        {
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        },
                    ]}
                />
            ))}
        </View>
    </LinearGradient>
);
}

    const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    
    keyboardView: {
        flex: 1,
    },
    
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    
    backIcon: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    backArrow: {
        width: 12,
        height: 12,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#FFFFFF',
        transform: [{ rotate: '45deg' }],
    },
    
    miniLogoContainer: {
        flex: 1,
        alignItems: 'center',
    },
    
    miniLogo: {
        width: 50,
        height: 50,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    
    miniLogoGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    miniLogoText: {
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    
    welcomeSection: {
        paddingHorizontal: 30,
        paddingVertical: 40,
        alignItems: 'center',
    },
    
    welcomeTitle: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 32,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    
    welcomeSubtitle: {
        fontFamily: 'Outfit_300Light',
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    
    formContainer: {
        paddingHorizontal: 30,
        paddingVertical: 20,
    },

    formWrapper: {
        width: '100%',
        maxWidth: 400, // Limit width on larger screens
        alignSelf: 'center',
        },
    
    inputContainer: {
        marginBottom: 24,
    },
    
    inputLabel: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 10,
        marginLeft: 2,
    },
    
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 16,
    },
    
    input: {
        flex: 1,
        fontFamily: 'NunitoSans_400Regular',
        fontSize: 16,
        color: '#FFFFFF',
        paddingVertical: 16,
        backgroundColor: 'transparent', // crucial to override autofill bg
        ...(Platform.OS === 'web' && {
            outlineWidth: 0,
            outlineColor: 'transparent',
            boxShadow: '0 0 0px 1000px transparent inset', // trick to remove autofill bg
            transition: 'background-color 5000s ease-in-out 0s', // prevent flash
        }),
        },


    passwordInput: {
        paddingRight: 10,
    },
    
    visibilityButton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    eyeIcon: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    eyeContainer: {
        width: 20,
        height: 14,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    eyeOuter: {
        width: 18,
        height: 12,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
    },
    
    eyeInner: {
        position: 'absolute',
        width: 6,
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 3,
    },
    
    eyeSlash: {
        position: 'absolute',
        width: 20,
        height: 1.5,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        transform: [{ rotate: '45deg' }],
    },
    
    forgotPassword: {
        alignItems: 'flex-end',
        marginTop: -8,
        marginBottom: 32,
    },
    
    forgotPasswordText: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        textDecorationLine: 'underline',
    },
    
    loginButton: {
        borderRadius: 30,
        shadowColor: '#ffeb3b',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
        marginBottom: 30,
        
    },
    
    loginButtonGradient: {
        paddingVertical: 18,
        paddingHorizontal: 40,
        borderRadius: 30,
        alignItems: 'center',
    },
    
    loginButtonText: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 16,
        color: '#FFFFFF',
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    
    socialSection: {
        paddingHorizontal: 30,
        paddingVertical: 20,
    },
    
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    
    dividerText: {
        fontFamily: 'Outfit_300Light',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        marginHorizontal: 16,
    },
    
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 28,
        },
    
    socialButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        paddingHorizontal: 28,
        paddingVertical: 16,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        },
    
    signUpSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        marginBottom: 10,
        marginTop: -10,
    },
    
    signUpPrompt: {
        fontFamily: 'Outfit_300Light',
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.8)',
        marginRight: 6,
    },
    
    signUpLink: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 15,
        color: '#FFFFFF',
        textDecorationLine: 'underline',
    },
    
    guestSection: {
        paddingHorizontal: 30,
        alignItems: 'center',
        marginTop: 10,
    },
    
    guestButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    
    guestButtonText: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    
    particlesContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
    },
    
    floatingParticle: {
        position: 'absolute',
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },

    inputWrapperFocused: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    transform: [{ scale: 1.02 }],
},

inputWrapperSuccess: {
    borderColor: 'rgba(76, 175, 80, 0.6)',
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
},

inputWrapperError: {
    borderColor: 'rgba(255, 68, 68, 0.6)',
    backgroundColor: 'rgba(255, 68, 68, 0.08)',
},

validationIcon: {
    fontSize: 18,
    color: '#4caf50',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginLeft: 8,
    marginTop: 1,
    minWidth: 20, 
},

errorText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: '#ff4444',
    marginTop: 6,
    marginLeft: 2,
},

});