// src/views/screens/auth/SignUpScreen.tsx
// This file is part of the TMA project.
// TMA is a React Native application designed to provide a seamless user experience.

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
    } from 'react-native';
    import { LinearGradient } from 'expo-linear-gradient';

    const { width, height } = Dimensions.get('window');

    interface SignUpScreenProps {
    onSignUp: () => void;
    onLogin: () => void;
    onGoogleSignUp: () => void;
    onAppleSignUp: () => void;
    onBack: () => void;
    }

    export const SignUpScreen: React.FC<SignUpScreenProps> = ({
    onSignUp,
    onLogin,
    onGoogleSignUp,
    onAppleSignUp,
    onBack,
    }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);

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

    const handleSignUp = async () => {
        if (!acceptTerms) {
        alert('Please accept the Terms & Conditions to continue');
        return;
        }
        
        if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
        }

        setIsLoading(true);
        // Add your signup logic here
        setTimeout(() => {
        setIsLoading(false);
        onSignUp();
        }, 2000);
    };

    const validatePassword = (pass: string) => {
        return pass.length >= 8;
    };

    const getPasswordStrength = () => {
        if (password.length === 0) return null;
        if (password.length < 6) return { strength: 'weak', color: '#ff4444' };
        if (password.length < 8) return { strength: 'medium', color: '#ff9800' };
        return { strength: 'strong', color: '#4caf50' };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <LinearGradient
        colors={['#ff8c42', '#ff6b35', '#ff4500']}
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
                <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                
                <View style={styles.miniLogoContainer}>
                <View style={styles.miniLogo}>
                    <LinearGradient
                    colors={['#ffeb3b', '#ff6b35', '#ff4500']}
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
                <Text style={styles.welcomeTitle}>Join The Family</Text>
                <Text style={styles.welcomeSubtitle}>
                Begin your spiritual transformation
                </Text>
            </Animated.View>

            {/* Sign Up Form */}
            <Animated.View
                style={[
                styles.formContainer,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
                ]}
            >
                {/* Name Inputs Row */}
                <View style={styles.nameRow}>
                <View style={[styles.inputContainer, styles.nameInput]}>
                    <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>First Name</Text>
                    <TextInput
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="John"
                        placeholderTextColor="rgba(255, 255, 255, 0.6)"
                        autoCapitalize="words"
                    />
                    <View style={styles.inputUnderline} />
                    </View>
                </View>

                <View style={[styles.inputContainer, styles.nameInput]}>
                    <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Doe"
                        placeholderTextColor="rgba(255, 255, 255, 0.6)"
                        autoCapitalize="words"
                    />
                    <View style={styles.inputUnderline} />
                    </View>
                </View>
                </View>

                {/* Email Input */}
                <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="john.doe@example.com"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    />
                    <View style={styles.inputUnderline} />
                </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <View style={styles.passwordContainer}>
                    <TextInput
                        style={[styles.input, styles.passwordInput]}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Create a strong password"
                        placeholderTextColor="rgba(255, 255, 255, 0.6)"
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Text style={styles.eyeIcon}>
                        {showPassword ? '👁️' : '🙈'}
                        </Text>
                    </TouchableOpacity>
                    </View>
                    <View style={styles.inputUnderline} />
                    
                    {/* Password Strength Indicator */}
                    {passwordStrength && (
                    <View style={styles.passwordStrengthContainer}>
                        <View style={styles.strengthBar}>
                        <View 
                            style={[
                            styles.strengthFill, 
                            { 
                                backgroundColor: passwordStrength.color,
                                width: passwordStrength.strength === 'weak' ? '33%' : 
                                    passwordStrength.strength === 'medium' ? '66%' : '100%'
                            }
                            ]} 
                        />
                        </View>
                        <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                        {passwordStrength.strength.toUpperCase()}
                        </Text>
                    </View>
                    )}
                </View>
                </View>

                {/* Confirm Password Input */}
                <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Confirm Password</Text>
                    <View style={styles.passwordContainer}>
                    <TextInput
                        style={[styles.input, styles.passwordInput]}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm your password"
                        placeholderTextColor="rgba(255, 255, 255, 0.6)"
                        secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        <Text style={styles.eyeIcon}>
                        {showConfirmPassword ? '👁️' : '🙈'}
                        </Text>
                    </TouchableOpacity>
                    </View>
                    <View style={[
                    styles.inputUnderline, 
                    { backgroundColor: confirmPassword && password !== confirmPassword ? '#ff4444' : 'rgba(255, 255, 255, 0.3)' }
                    ]} />
                    
                    {/* Password Match Indicator */}
                    {confirmPassword.length > 0 && (
                    <Text style={[
                        styles.matchText,
                        { color: password === confirmPassword ? '#4caf50' : '#ff4444' }
                    ]}>
                        {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </Text>
                    )}
                </View>
                </View>

                {/* Terms & Conditions */}
                <TouchableOpacity 
                style={styles.termsContainer}
                onPress={() => setAcceptTerms(!acceptTerms)}
                >
                <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                    {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.termsText}>
                    I agree to the{' '}
                    <Text style={styles.termsLink}>Terms & Conditions</Text>
                    {' '}and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
                </TouchableOpacity>

                {/* Sign Up Button */}
                <TouchableOpacity
                style={[styles.signUpButton, !acceptTerms && styles.disabledButton]}
                onPress={handleSignUp}
                disabled={isLoading || !acceptTerms}
                >
                <LinearGradient
                    colors={acceptTerms ? ['#ffeb3b', '#ff9800', '#ff6b35'] : ['#999', '#666', '#444']}
                    style={styles.signUpButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Text style={styles.signUpButtonText}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Text>
                </LinearGradient>
                </TouchableOpacity>
            </Animated.View>

            {/* Social Sign Up Section */}
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
                <Text style={styles.dividerText}>or sign up with</Text>
                <View style={styles.dividerLine} />
                </View>

                {/* Social Buttons */}
                <View style={styles.socialButtonsContainer}>
                {/* Google Button */}
                <TouchableOpacity
                    style={styles.socialButton}
                    onPress={onGoogleSignUp}
                >
                    <LinearGradient
                    colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                    style={styles.socialButtonGradient}
                    >
                    <Text style={styles.socialButtonIcon}>🔍</Text>
                    <Text style={styles.socialButtonText}>Google</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Apple Button */}
                <TouchableOpacity
                    style={styles.socialButton}
                    onPress={onAppleSignUp}
                >
                    <LinearGradient
                    colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                    style={styles.socialButtonGradient}
                    >
                    <Text style={styles.socialButtonIcon}>🍎</Text>
                    <Text style={styles.socialButtonText}>Apple</Text>
                    </LinearGradient>
                </TouchableOpacity>
                </View>

                {/* Phone Sign Up Button */}
                <TouchableOpacity style={styles.phoneButton}>
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
                    style={styles.phoneButtonGradient}
                >
                    <Text style={styles.phoneButtonIcon}>📱</Text>
                    <Text style={styles.phoneButtonText}>Sign up with Phone</Text>
                </LinearGradient>
                </TouchableOpacity>
            </Animated.View>

            {/* Login Link */}
            <Animated.View
                style={[
                styles.loginSection,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
                ]}
            >
                <Text style={styles.loginPrompt}>Already have an account?</Text>
                <TouchableOpacity onPress={onLogin}>
                <Text style={styles.loginLink}>Sign In</Text>
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
                <TouchableOpacity style={styles.guestButton}>
                <Text style={styles.guestButtonText}>Continue as Guest</Text>
                </TouchableOpacity>
            </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>

        {/* Floating Particles */}
        <View style={styles.particlesContainer}>
            {[...Array(8)].map((_, index) => (
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
    };

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
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    backButtonText: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    
    miniLogoContainer: {
        flex: 1,
        alignItems: 'center',
    },
    
    miniLogo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    
    miniLogoGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    miniLogoText: {
        fontSize: 14,
        fontFamily: 'Outfit_700Bold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    
    welcomeSection: {
        paddingHorizontal: 30,
        paddingVertical: 30,
        alignItems: 'center',
    },
    
    welcomeTitle: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 32,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 10,
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
        paddingVertical: 10,
    },
    
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    
    nameInput: {
        flex: 0.48,
    },
    
    inputContainer: {
        marginBottom: 20,
    },
    
    inputWrapper: {
        position: 'relative',
    },
    
    inputLabel: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 8,
        marginLeft: 5,
    },
    
    input: {
        fontFamily: 'NunitoSans_400Regular',
        fontSize: 16,
        color: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 5,
        backgroundColor: 'transparent',
    },
    
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    
    passwordInput: {
        flex: 1,
    },
    
    eyeButton: {
        padding: 10,
    },
    
    eyeIcon: {
        fontSize: 18,
    },
    
    inputUnderline: {
        height: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginTop: 5,
    },
    
    passwordStrengthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    
    strengthBar: {
        flex: 1,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 2,
        marginRight: 10,
    },
    
    strengthFill: {
        height: '100%',
        borderRadius: 2,
    },
    
    strengthText: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 12,
        fontWeight: 'bold',
    },
    
    matchText: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
    },
    
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 25,
        paddingHorizontal: 5,
    },
    
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 4,
        marginRight: 12,
        marginTop: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    checkboxChecked: {
        backgroundColor: '#4caf50',
        borderColor: '#4caf50',
    },
    
    checkmark: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    
    termsText: {
        fontFamily: 'Outfit_300Light',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 20,
        flex: 1,
    },
    
    termsLink: {
        fontFamily: 'Outfit_500Medium',
        color: '#FFFFFF',
        textDecorationLine: 'underline',
    },
    
    signUpButton: {
        borderRadius: 30,
        shadowColor: '#ffeb3b',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 10,
        marginBottom: 25,
    },
    
    disabledButton: {
        shadowOpacity: 0.1,
        elevation: 2,
    },
    
    signUpButtonGradient: {
        paddingVertical: 18,
        paddingHorizontal: 40,
        borderRadius: 30,
        alignItems: 'center',
    },
    
    signUpButtonText: {
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
        paddingVertical: 15,
    },
    
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    
    dividerText: {
        fontFamily: 'Outfit_300Light',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        marginHorizontal: 15,
    },
    
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    
    socialButton: {
        flex: 0.48,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    
    socialButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    
    socialButtonIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    
    socialButtonText: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 14,
        color: '#FFFFFF',
    },
    
    phoneButton: {
        borderRadius: 25,
        marginBottom: 15,
    },
    
    phoneButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    
    phoneButtonIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    
    phoneButtonText: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 14,
        color: '#FFFFFF',
    },
    
    loginSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        marginBottom: 15,
    },
    
    loginPrompt: {
        fontFamily: 'Outfit_300Light',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginRight: 5,
    },
    
    loginLink: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 14,
        color: '#FFFFFF',
        textDecorationLine: 'underline',
    },
    
    guestSection: {
        paddingHorizontal: 30,
        alignItems: 'center',
        marginBottom: 20,
    },
    
    guestButton: {
        paddingVertical: 10,
        paddingHorizontal: 25,
    },
    
    guestButtonText: {
        fontFamily: 'Outfit_300Light',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        textDecorationLine: 'underline',
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
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
});