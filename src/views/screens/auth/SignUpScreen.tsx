// src/views/screens/auth/SignUpScreen.tsx

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

// This file is part of the TMA project. - This file defines the SignUpScreen component that allows users to register for the application.
// TMA is a React Native application designed to provide a seamless user experience.

// Import necessary libraries and components
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
import { authService } from '../../../models/services/AuthService';

const { width, height } = Dimensions.get('window');

interface SignUpScreenProps {
    onSignUp: () => void;
    onLogin: () => void;
    onGoogleSignUp: () => void;
    onAppleSignUp: () => void;
    onBack: () => void;
    navigation: any;
}

interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    createdAt?: string;
}

// This component represents the Sign Up screen of the application.
export const SignUpScreen: React.FC<SignUpScreenProps> = ({
    onSignUp,
    onLogin,
    onGoogleSignUp,
    onAppleSignUp,
    onBack,
    navigation,
}) => {
    const [firstName, setFirstName] = useState('');
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

    
    // Enhanced state for interactions
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [buttonPressed, setButtonPressed] = useState(false);

    // Animation values
    const slideAnim = useRef(new Animated.Value(50)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const checkboxScale = useRef(new Animated.Value(1)).current;


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

    // Function to validate password strength
    const isStrongPassword = (password: string): boolean => {
    const strongRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
    return strongRegex.test(password);
    };

    // Function to get password requirements
    const getPasswordRequirements = (password: string) => {
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[@$!%*?&#^]/.test(password)
        };
    };

    // Function to handle sign up button press
        const handleSignUp = async () => {
        const errors: {[key: string]: string} = {};
        
        // Check for missing fields
        if (!firstName.trim()) errors.firstName = 'First name is required';
        if (!lastName.trim()) errors.lastName = 'Last name is required';
        if (!email.trim()) errors.email = 'Email is required';
        if (!password) errors.password = 'Password is required';
        if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';
        if (!acceptTerms) errors.terms = 'Please accept the Terms & Conditions';
        
        // Validate email format
        if (email.trim() && (!email.includes('@') || !email.includes('.'))) {
            errors.email = 'Please enter a valid email address';
        }
        
        // Validate password strength
        if (password && !isStrongPassword(password)) {
            errors.password = 'Password must meet all requirements below';
        }
        
        // Check password match
        if (password && confirmPassword && password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        
        setValidationErrors(errors);
        
        // If there are errors, don't proceed
        if (Object.keys(errors).length > 0) {
            return;
        }

        setIsLoading(true);
        
        try {
            // Use Firebase Authentication instead of AsyncStorage
            const { authService } = await import('../../../models/services/AuthService');
            const response = await authService.signUpWithEmail({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                password
            });
            
            if (response.success) {
                // Store current user session for compatibility
                await AsyncStorage.setItem('@current_user', JSON.stringify({
                    email: response.user?.email,
                    firstName: response.user?.firstName,
                    lastName: response.user?.lastName,
                    loginTime: new Date().toISOString()
                }));
                onSignUp(); // Success - proceed to app
            } else {
                setValidationErrors({
                    email: response.error || 'Registration failed'
                });
            }
        } catch (error) {
            console.error('SignUp error:', error);
            setValidationErrors({
                email: 'Registration failed. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle guest login with confirmation - helper function
    const getInputWrapperStyle = (fieldName: string, isValid?: boolean): ViewStyle[] => {
        const hasError = validationErrors[fieldName];
        const baseStyles: ViewStyle[] = [styles.inputWrapper];

        if (focusedInput === fieldName) baseStyles.push(styles.inputWrapperFocused);
        if (hasError) baseStyles.push(styles.inputWrapperError);
        else if (isValid) baseStyles.push(styles.inputWrapperSuccess);

        return baseStyles;
        };


    // Handle guest login with confirmation dialog
    const handleGuestLogin = () => {
        if (Platform.OS === 'web') {
            // On web, use browser confirm dialog
            const confirmed = window.confirm(
                'Continue as Guest?\n\nYou\'ll have limited access to features. You can always sign up later for the full experience.'
            );
            if (confirmed) {
                onSignUp();
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
                            onSignUp();
                        },
                    },
                ]
            );
        }
    };

    const handleCheckboxPress = () => {
        // Bounce animation for checkbox
        Animated.sequence([
            Animated.timing(checkboxScale, {
                toValue: 1.2,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(checkboxScale, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
        
        setAcceptTerms(!acceptTerms);
    };
    // Function to get password strength
    const getPasswordStrength = () => {
        if (password.length === 0) return null;
        if (password.length < 6) return { strength: 'weak', color: '#ff4444' };
        if (password.length < 8) return { strength: 'medium', color: '#ff9800' };
        return { strength: 'strong', color: '#4caf50' };
    };

    // Check if email is valid
    const passwordStrength = getPasswordStrength();
    const isValidEmail = email.includes('@') && email.includes('.');
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

    // Render the Sign Up screen
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
                        {/* First Name */}
                        <View style={[styles.inputContainer, styles.nameInput]}>
                            <Text style={styles.inputLabel}>First Name</Text>
                            <View style={getInputWrapperStyle('firstName', firstName.trim().length > 0)}>
                                <TextInput
                                    style={styles.input}
                                    value={firstName}
                                    onChangeText={(text: string) => {
                                        setFirstName(text);
                                        if (validationErrors.firstName) {
                                            setValidationErrors(prev => {
                                                const newErrors = { ...prev };
                                                delete newErrors.firstName;
                                                return newErrors;
                                            });
                                        }
                                    }}
                                    placeholder="John"
                                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                    autoCapitalize="words"
                                    selectionColor="rgba(255, 255, 255, 0.5)"
                                    underlineColorAndroid="transparent"
                                    onFocus={() => setFocusedInput('firstName')}
                                    onBlur={() => setFocusedInput(null)}
                                />
                                {firstName.trim().length > 0 && !validationErrors.firstName && (
                                    <Text style={styles.validationIcon}>✓</Text>
                                )}
                            </View>
                            {validationErrors.firstName && (
                                <Text style={styles.errorText}>{validationErrors.firstName}</Text>
                            )}
                        </View>


                        {/* Last Name */}
                        <View style={[styles.inputContainer, styles.nameInput]}>
                            <Text style={styles.inputLabel}>Last Name</Text>
                            <View style={getInputWrapperStyle('lastName', lastName.trim().length > 0)}>
                                <TextInput
                                    style={styles.input}
                                    value={lastName}
                                    onChangeText={(text: string) => {
                                        setLastName(text);
                                        if (validationErrors.lastName) {
                                            setValidationErrors(prev => {
                                                const newErrors = { ...prev };
                                                delete newErrors.lastName;
                                                return newErrors;
                                            });
                                        }
                                    }}
                                    placeholder="Doe"
                                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                    autoCapitalize="words"
                                    selectionColor="rgba(255, 255, 255, 0.5)"
                                    underlineColorAndroid="transparent"
                                    onFocus={() => setFocusedInput('lastName')}
                                    onBlur={() => setFocusedInput(null)}
                                />
                                {lastName.trim().length > 0 && !validationErrors.lastName && (
                                    <Text style={styles.validationIcon}>✓</Text>
                                )}
                            </View>
                            {validationErrors.lastName && (
                                <Text style={styles.errorText}>{validationErrors.lastName}</Text>
                            )}
                        </View>
                        </View>

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
                                        placeholder="john.doe@example.com"
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
                                <View style={getInputWrapperStyle('password', isStrongPassword(password))}>
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
                                        placeholder="Create a strong password"
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
                                    {isStrongPassword(password) && !validationErrors.password && (
                                        <Text style={styles.validationIcon}>✓</Text>
                                    )}
                                </View>
                                
                                {/* Password Requirements Box */}
                                {password.length > 0 && (
                                    <View style={styles.passwordRequirementsBox}>
                                        <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                                        {(() => {
                                            const requirements = getPasswordRequirements(password);
                                            return (
                                                <>
                                                    <View style={styles.requirementRow}>
                                                        <Text style={[styles.requirementIcon, requirements.length && styles.requirementMet]}>
                                                            {requirements.length ? '✓' : '○'}
                                                        </Text>
                                                        <Text style={[styles.requirementText, requirements.length && styles.requirementMet]}>
                                                            At least 8 characters
                                                        </Text>
                                                    </View>
                                                    <View style={styles.requirementRow}>
                                                        <Text style={[styles.requirementIcon, requirements.uppercase && styles.requirementMet]}>
                                                            {requirements.uppercase ? '✓' : '○'}
                                                        </Text>
                                                        <Text style={[styles.requirementText, requirements.uppercase && styles.requirementMet]}>
                                                            One uppercase letter (A-Z)
                                                        </Text>
                                                    </View>
                                                    <View style={styles.requirementRow}>
                                                        <Text style={[styles.requirementIcon, requirements.number && styles.requirementMet]}>
                                                            {requirements.number ? '✓' : '○'}
                                                        </Text>
                                                        <Text style={[styles.requirementText, requirements.number && styles.requirementMet]}>
                                                            One number (0-9)
                                                        </Text>
                                                    </View>
                                                    <View style={styles.requirementRow}>
                                                        <Text style={[styles.requirementIcon, requirements.special && styles.requirementMet]}>
                                                            {requirements.special ? '✓' : '○'}
                                                        </Text>
                                                        <Text style={[styles.requirementText, requirements.special && styles.requirementMet]}>
                                                            One special character (@$!%*?&#^)
                                                        </Text>
                                                    </View>
                                                </>
                                            );
                                        })()}
                                    </View>
                                )}
                                
                                {validationErrors.password && (
                                    <Text style={styles.errorText}>{validationErrors.password}</Text>
                                )}
                                
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

                            {/* Confirm Password Input */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Confirm Password</Text>
                                <View style={getInputWrapperStyle('confirmPassword', passwordsMatch)}>
                                    <TextInput
                                        style={[styles.input, styles.passwordInput]}
                                        value={confirmPassword}
                                        onChangeText={(text: string) => {
                                            setConfirmPassword(text);
                                            if (validationErrors.confirmPassword) {
                                                setValidationErrors(prev => {
                                                    const newErrors = {...prev};
                                                    delete newErrors.confirmPassword;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                        placeholder="Confirm your password"
                                        placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                        secureTextEntry={!showConfirmPassword}
                                        selectionColor="rgba(255, 255, 255, 0.5)"
                                        underlineColorAndroid="transparent"
                                        onFocus={() => setFocusedInput('confirmPassword')}
                                        onBlur={() => setFocusedInput(null)}
                                    />
                                    <TouchableOpacity
                                        style={styles.visibilityButton}
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <View style={styles.eyeIcon}>
                                            {showConfirmPassword ? (
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
                                    {passwordsMatch && !validationErrors.confirmPassword && (
                                        <Text style={styles.validationIcon}>✓</Text>
                                    )}
                                </View>
                                
                                {validationErrors.confirmPassword && (
                                    <Text style={styles.errorText}>{validationErrors.confirmPassword}</Text>
                                )}
                                
                                {/* Password Match Indicator */}
                                {confirmPassword.length > 0 && !validationErrors.confirmPassword && (
                                    <Text style={[
                                        styles.matchText,
                                        { color: passwordsMatch ? '#4caf50' : '#ff4444' }
                                    ]}>
                                        {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                                    </Text>
                                )}
                            </View>

                            {/* Terms & Conditions */}
                            <TouchableOpacity 
                                style={styles.termsContainer}
                                onPress={handleCheckboxPress}
                                activeOpacity={0.8}
                            >
                            <Animated.View style={[
                                styles.checkbox, 
                                acceptTerms && styles.checkboxChecked,
                                { transform: [{ scale: checkboxScale }] }
                            ]}>
                                {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
                            </Animated.View>

                            <Text style={styles.termsText}>
                                I agree to the{' '}
                                <Text 
                                    style={styles.termsLink}
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        setShowTermsModal(true);
                                    }}
                                >
                                    Terms & Conditions
                                </Text>
                                {' '}and{' '}
                                <Text 
                                    style={styles.termsLink}
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        setShowPrivacyModal(true);
                                    }}
                                >
                                    Privacy Policy
                                </Text>
                            </Text>
                            </TouchableOpacity>

                            {/* Terms & Conditions Modal */}
                            {showTermsModal && (
                                <View style={styles.modalOverlay}>
                                    <View style={styles.modalContainer}>
                                        <View style={styles.modalHeader}>
                                            <Text style={styles.modalTitle}>Terms & Conditions</Text>
                                            <TouchableOpacity 
                                                style={styles.closeButton}
                                                onPress={() => setShowTermsModal(false)}
                                            >
                                                <Text style={styles.closeButtonText}>✕</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                                            <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</Text>
                                            
                                            <Text style={styles.modalSectionTitle}>1. Acceptance of Terms</Text>
                                            <Text style={styles.modalParagraph}>
                                                By downloading, accessing, or using The Morning Amen mobile application ("App"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use our App.
                                            </Text>

                                            <Text style={styles.modalSectionTitle}>2. Description of Service</Text>
                                            <Text style={styles.modalParagraph}>
                                                The Morning Amen is a faith-based mobile application that provides daily devotionals, inspirational videos, prayer requests, Bible verses, and spiritual content designed to support your spiritual journey and growth.
                                            </Text>

                                            <Text style={styles.modalSectionTitle}>3. User Accounts and Registration</Text>
                                            <Text style={styles.modalParagraph}>
                                                To access certain features, you may need to create an account. You are responsible for:
                                            </Text>
                                            <Text style={styles.modalBulletPoint}>• Providing accurate and complete information</Text>
                                            <Text style={styles.modalBulletPoint}>• Maintaining the security of your account credentials</Text>
                                            <Text style={styles.modalBulletPoint}>• All activities that occur under your account</Text>
                                            <Text style={styles.modalBulletPoint}>• Notifying us immediately of any unauthorized use</Text>

                                            <Text style={styles.modalSectionTitle}>4. Acceptable Use Policy</Text>
                                            <Text style={styles.modalParagraph}>
                                                You agree not to use the App to:
                                            </Text>
                                            <Text style={styles.modalBulletPoint}>• Post or share content that is offensive, harmful, or inappropriate</Text>
                                            <Text style={styles.modalBulletPoint}>• Violate any applicable laws or regulations</Text>
                                            <Text style={styles.modalBulletPoint}>• Infringe on intellectual property rights</Text>
                                            <Text style={styles.modalBulletPoint}>• Transmit viruses or malicious code</Text>
                                            <Text style={styles.modalBulletPoint}>• Attempt to gain unauthorized access to our systems</Text>

                                            <Text style={styles.modalSectionTitle}>5. User-Generated Content</Text>
                                            <Text style={styles.modalParagraph}>
                                                When you submit prayer requests or other content, you grant us a non-exclusive, royalty-free license to use, display, and distribute such content within the App. You retain ownership of your content and can request its removal at any time.
                                            </Text>

                                            <Text style={styles.modalSectionTitle}>6. Privacy and Data Protection</Text>
                                            <Text style={styles.modalParagraph}>
                                                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. By using the App, you consent to our privacy practices.
                                            </Text>

                                            <Text style={styles.modalSectionTitle}>7. Intellectual Property Rights</Text>
                                            <Text style={styles.modalParagraph}>
                                                All content in the App, including text, graphics, logos, images, audio clips, and software, is owned by The Morning Amen or its licensors and is protected by copyright, trademark, and other intellectual property laws.
                                            </Text>

                                            <Text style={styles.modalSectionTitle}>8. Disclaimers and Limitations</Text>
                                            <Text style={styles.modalParagraph}>
                                                The App is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free service, accuracy of content, or compatibility with all devices.
                                            </Text>

                                            <Text style={styles.modalSectionTitle}>9. Limitation of Liability</Text>
                                            <Text style={styles.modalParagraph}>
                                                To the maximum extent permitted by law, The Morning Amen shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
                                            </Text>

                                            <Text style={styles.modalSectionTitle}>10. Contact Information</Text>
                                            <Text style={styles.modalParagraph}>
                                                If you have questions about these Terms, please contact us at: legal@themorningamen.com
                                            </Text>
                                        </ScrollView>
                                        <TouchableOpacity 
                                            style={styles.modalAcceptButton}
                                            onPress={() => setShowTermsModal(false)}
                                        >
                                            <Text style={styles.modalAcceptText}>I Understand</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                            {/* Privacy Policy Modal */}
                            {showPrivacyModal && (
                                <View style={styles.modalOverlay}>
                                    <View style={styles.modalContainer}>
                                        <View style={styles.modalHeader}>
                                            <Text style={styles.modalTitle}>Privacy Policy</Text>
                                            <TouchableOpacity 
                                                style={styles.closeButton}
                                                onPress={() => setShowPrivacyModal(false)}
                                            >
                                                <Text style={styles.closeButtonText}>✕</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                                            <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</Text>
                                            
                                            <Text style={styles.modalIntro}>
                                                At The Morning Amen, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, share, and safeguard your information when you use our mobile application.
                                            </Text>

                                            <Text style={styles.modalSectionTitle}>1. Information We Collect</Text>
                                            <Text style={styles.modalSubSectionTitle}>Personal Information</Text>
                                            <Text style={styles.modalParagraph}>
                                                When you create an account or use our services, we may collect:
                                            </Text>
                                            <Text style={styles.modalBulletPoint}>• Name and email address</Text>
                                            <Text style={styles.modalBulletPoint}>• Account credentials (encrypted passwords)</Text>
                                            <Text style={styles.modalBulletPoint}>• Profile information you choose to provide</Text>
                                            <Text style={styles.modalBulletPoint}>• Prayer requests and spiritual content you submit</Text>

                                            <Text style={styles.modalSectionTitle}>2. How We Use Your Information</Text>
                                            <Text style={styles.modalParagraph}>
                                                We use your information to:
                                            </Text>
                                            <Text style={styles.modalBulletPoint}>• Provide and maintain our services</Text>
                                            <Text style={styles.modalBulletPoint}>• Personalize your spiritual journey experience</Text>
                                            <Text style={styles.modalBulletPoint}>• Send daily devotionals and spiritual content</Text>
                                            <Text style={styles.modalBulletPoint}>• Respond to your inquiries and support requests</Text>
                                            <Text style={styles.modalBulletPoint}>• Improve our App's functionality and features</Text>

                                            <Text style={styles.modalSectionTitle}>3. Information Sharing</Text>
                                            <Text style={styles.modalParagraph}>
                                                We do not sell, trade, or rent your personal information. We may share information only:
                                            </Text>
                                            <Text style={styles.modalBulletPoint}>• With your explicit consent</Text>
                                            <Text style={styles.modalBulletPoint}>• To comply with legal requirements</Text>
                                            <Text style={styles.modalBulletPoint}>• To protect our rights, property, or safety</Text>

                                            <Text style={styles.modalSectionTitle}>4. Data Security</Text>
                                            <Text style={styles.modalParagraph}>
                                                We implement robust security measures including encryption of data in transit and at rest, secure servers with regular security updates, and access controls.
                                            </Text>

                                            <Text style={styles.modalSectionTitle}>5. Your Privacy Rights</Text>
                                            <Text style={styles.modalParagraph}>
                                                You have the right to access, correct, or delete your personal information, opt-out of marketing communications, and request data portability.
                                            </Text>

                                            <Text style={styles.modalSectionTitle}>6. Children's Privacy</Text>
                                            <Text style={styles.modalParagraph}>
                                                Our App is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                                            </Text>

                                            <Text style={styles.modalSectionTitle}>7. Contact Us</Text>
                                            <Text style={styles.modalParagraph}>
                                                If you have questions about this Privacy Policy, please contact us at: privacy@themorningamen.com
                                            </Text>
                                        </ScrollView>
                                        <TouchableOpacity 
                                            style={styles.modalAcceptButton}
                                            onPress={() => setShowPrivacyModal(false)}
                                        >
                                            <Text style={styles.modalAcceptText}>I Understand</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            
                            {validationErrors.terms && (
                                <Text style={[styles.errorText, { marginTop: -15, marginBottom: 15 }]}>
                                    {validationErrors.terms}
                                </Text>
                            )}

                            {/* Sign Up Button */}
                            <TouchableOpacity
                                style={[
                                    styles.signUpButton, 
                                    !acceptTerms && styles.disabledButton,
                                    buttonPressed && styles.signUpButtonPressed
                                ]}
                                onPress={handleSignUp}
                                disabled={isLoading}
                                activeOpacity={0.9}
                                onPressIn={() => setButtonPressed(true)}
                                onPressOut={() => setButtonPressed(false)}
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
                            <View style={styles.socialRow}>
                                <TouchableOpacity style={styles.socialButton} onPress={onGoogleSignUp}>
                                    <FontAwesome name="google" size={22} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialButton} onPress={onAppleSignUp}>
                                    <FontAwesome name="apple" size={24} color="#fff" />
                                </TouchableOpacity>
                            </View>
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
};

// Styles for the Sign Up screen
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
    
    formWrapper: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
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
        paddingVertical: 30,
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
    
    nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
},
    
    nameInput: {
        flex: 1,
        minWidth: 0,
    },
    
    inputContainer: {
        marginBottom: 18,
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
        overflow: 'hidden',
        minWidth: 0, 
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
    
    input: {
    flex: 1,
    fontFamily: 'NunitoSans_400Regular',
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 16,
    backgroundColor: 'transparent',
    paddingRight: 8, // Add some padding to prevent text from touching the icon
    ...(Platform.OS === 'web' && {
        outlineWidth: 0,
        outlineColor: 'transparent',
        boxShadow: '0 0 0px 1000px transparent inset',
        transition: 'background-color 5000s ease-in-out 0s',
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
    
    passwordRequirementsBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        padding: 12,
        marginTop: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    
    requirementsTitle: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 8,
    },
    
    requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 4,
    },
    
    requirementIcon: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
        width: 16,
        marginRight: 8,
    },
    
    requirementText: {
        fontFamily: 'Outfit_300Light',
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        flex: 1,
    },
    
    requirementMet: {
        color: '#4caf50',
    },
    
    passwordStrengthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingHorizontal: 2,
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
        marginTop: 8,
        marginLeft: 2,
    },
    
    termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 25,
    paddingHorizontal: 2,
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
    borderWidth: 2,             
    borderRadius: 4,            
    flexDirection: 'row',       
    alignItems: 'center',   
    paddingHorizontal: 0     
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
        shadowRadius: 12,
        elevation: 8,
        marginBottom: 30,
    },
    
    signUpButtonPressed: {
        transform: [{ scale: 0.98 }],
        shadowOpacity: 0.2,
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
        paddingVertical: 20,
    },
    
    dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
        alignItems: 'center',
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
    
    loginSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        marginBottom: 10,
        marginTop: -10,
    },
    
    loginPrompt: {
        fontFamily: 'Outfit_300Light',
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.8)',
        marginRight: 6,
    },
    
    loginLink: {
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

        modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },

    modalContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        marginHorizontal: 20,
        marginVertical: 40,
        borderRadius: 20,
        maxHeight: '90%',
        width: '90%',
    },

    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },

    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    closeButtonText: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },

    modalContent: {
        padding: 20,
        maxHeight: 400,
    },

    lastUpdated: {
        fontSize: 12,
        fontStyle: 'italic',
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },

    modalIntro: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
        marginBottom: 20,
        fontWeight: '500',
        backgroundColor: 'rgba(255, 154, 86, 0.1)',
        padding: 15,
        borderRadius: 10,
    },

    modalSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },

    modalSubSectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginTop: 15,
        marginBottom: 8,
    },

    modalParagraph: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
        marginBottom: 10,
    },

    modalBulletPoint: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
        marginBottom: 5,
        marginLeft: 15,
    },

    modalAcceptButton: {
        margin: 20,
        paddingVertical: 12,
        paddingHorizontal: 30,
        backgroundColor: '#ff6b35',
        borderRadius: 25,
        alignItems: 'center',
    },

    modalAcceptText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },


});