// src/views/screens/auth/LoginScreen.tsx
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
    } from 'react-native';
    import { LinearGradient } from 'expo-linear-gradient';
    import { AnimatedLogo } from '../../components/common/AnimatedLogo';

    const { width, height } = Dimensions.get('window');

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
        setIsLoading(true);
        // Add your login logic here
        setTimeout(() => {
        setIsLoading(false);
        onLogin();
        }, 2000);
    };

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
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
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
                        placeholder="Enter your password"
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
                </View>
                </View>

                {/* Forgot Password */}
                <TouchableOpacity 
                    style={styles.forgotPassword}
                    onPress={onForgotPassword} // CHANGE THIS LINE
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
                <View style={styles.socialButtonsContainer}>
                {/* Google Button */}
                <TouchableOpacity
                    style={styles.socialButton}
                    onPress={onGoogleLogin}
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
                    onPress={onAppleLogin}
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

                {/* Phone Login Button */}
                <TouchableOpacity style={styles.phoneButton}>
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
                    style={styles.phoneButtonGradient}
                >
                    <Text style={styles.phoneButtonIcon}>📱</Text>
                    <Text style={styles.phoneButtonText}>Continue with Phone</Text>
                </LinearGradient>
                </TouchableOpacity>
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
        paddingVertical: 40,
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
        paddingVertical: 20,
    },
    
    inputContainer: {
        marginBottom: 25,
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
        paddingVertical: 15,
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
        fontSize: 20,
    },
    
    inputUnderline: {
        height: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginTop: 5,
    },
    
    forgotPassword: {
        alignItems: 'flex-end',
        marginBottom: 30,
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
        shadowRadius: 15,
        elevation: 10,
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
        marginBottom: 25,
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
        marginBottom: 20,
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
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    
    socialButtonIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    
    socialButtonText: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 14,
        color: '#FFFFFF',
    },
    
    phoneButton: {
        borderRadius: 25,
        marginBottom: 20,
    },
    
    phoneButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    
    phoneButtonIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    
    phoneButtonText: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 16,
        color: '#FFFFFF',
    },
    
    signUpSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        marginBottom: 20,
    },
    
    signUpPrompt: {
        fontFamily: 'Outfit_300Light',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginRight: 5,
    },
    
    signUpLink: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 14,
        color: '#FFFFFF',
        textDecorationLine: 'underline',
    },
    
    guestSection: {
        paddingHorizontal: 30,
        alignItems: 'center',
    },
    
    guestButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
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