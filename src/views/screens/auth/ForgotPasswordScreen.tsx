// src/views/screens/auth/ForgotPasswordScreen.tsx
// Forgot Password Screen for The Morning Amen app -this screen allows users to reset their password by entering their email address.
// Features: Email validation, user existence check, animated UI, and comprehensive messaging

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
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt?: string;
}

interface ForgotPasswordScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

// ForgotPasswordScreen component
export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onBack,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Animation values
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

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

  // Email validation and user existence check
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  // Check if user exists in AsyncStorage
  // This function retrieves the registered users from AsyncStorage and checks if the provided email exists
  const checkUserExists = async (email: string): Promise<boolean> => {
    try {
      const storedUsers = await AsyncStorage.getItem('@registered_users');
      if (!storedUsers) return false;
      
      const users: User[] = JSON.parse(storedUsers);
      return users.some(user => user.email.toLowerCase() === email.toLowerCase().trim());
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
    }
  };

  // Handle password reset
  // This function validates the email input, checks if the user exists, and sends a reset link if valid
  const handleResetPassword = async () => {
    const errors: {[key: string]: string} = {};
    
    // Check for missing email
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Check if user exists
      const exists = await checkUserExists(email);
      setUserExists(exists);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (exists) {
        // User exists - send reset email
        setEmailSent(true);
        
        // Animate success
        Animated.spring(successAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }).start();
        
        Alert.alert(
          'Reset Link Sent! 📧',
          `We've sent a password reset link to ${email}. Please check your inbox and spam folder, then follow the instructions to reset your password.`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Auto-redirect after 3 seconds
                setTimeout(() => {
                  onSuccess();
                }, 3000);
              }
            }
          ]
        );
      } else {
        // User doesn't exist
        Alert.alert(
          'Email Not Found 📧',
          `We couldn't find an account associated with ${email}. Please check your email address or sign up for a new account.`,
          [
            {
              text: 'Try Again',
              style: 'default',
            },
            {
              text: 'Sign Up',
              onPress: () => {
                // Navigate to sign up (you can implement this)
                onBack();
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert(
        'Connection Error',
        'Unable to process your request. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function for input wrapper styles
  const getInputWrapperStyle = (fieldName: string, isValid?: boolean): ViewStyle[] => {
    const hasError = validationErrors[fieldName];
    const baseStyles: ViewStyle[] = [styles.inputWrapper];

    if (focusedInput === fieldName) baseStyles.push(styles.inputWrapperFocused);
    if (hasError) baseStyles.push(styles.inputWrapperError);
    else if (isValid) baseStyles.push(styles.inputWrapperSuccess);

    return baseStyles;
  };

  const isValidEmail = validateEmail(email);

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

            {/* Icon Section */}
            <Animated.View
              style={[
                styles.iconSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                },
              ]}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.lockIcon}>
                  {emailSent ? '📧' : '🔐'}
                </Text>
              </View>
            </Animated.View>

            {/* Content Section */}
            <Animated.View
              style={[
                styles.contentSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.title}>
                {emailSent ? 'Check Your Email' : 'Forgot Password?'}
              </Text>
              <Text style={styles.subtitle}>
                {emailSent 
                  ? `We've sent reset instructions to ${email}. Please check your inbox and spam folder.`
                  : 'Don\'t worry! Enter your email address and we\'ll send you a secure link to reset your password.'
                }
              </Text>
            </Animated.View>

            {/* Form Section */}
            {!emailSent && (
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
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <View style={getInputWrapperStyle('email', isValidEmail && email.length > 0)}>
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={(text: string) => {
                        setEmail(text);
                        setUserExists(null); // Reset user existence check
                        if (validationErrors.email) {
                          setValidationErrors(prev => {
                            const newErrors = {...prev};
                            delete newErrors.email;
                            return newErrors;
                          });
                        }
                      }}
                      placeholder="Enter your email address"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoFocus
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

                {/* Reset Button */}
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={handleResetPassword}
                  disabled={isLoading || !email.trim()}
                >
                  <LinearGradient
                    colors={
                      isLoading || !email.trim() 
                        ? ['#cccccc', '#999999', '#666666']
                        : ['#ffeb3b', '#ff9800', '#ff6b35']
                    }
                    style={styles.resetButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.resetButtonText}>
                      {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Success Section */}
            {emailSent && (
              <Animated.View
                style={[
                  styles.successSection,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }, { scale: successAnim }],
                  },
                ]}
              >
                <View style={styles.successIconContainer}>
                  <Text style={styles.successIcon}>✅</Text>
                </View>
                <Text style={styles.successText}>Email Sent Successfully!</Text>
                <Text style={styles.successSubtext}>
                  If you don't see the email in a few minutes, please check your spam folder.
                </Text>

                <TouchableOpacity
                  style={styles.backToLoginButton}
                  onPress={onSuccess}
                >
                  <LinearGradient
                    colors={['#ffeb3b', '#ff9800', '#ff6b35']}
                    style={styles.backToLoginGradient}
                  >
                    <Text style={styles.backToLoginText}>Back to Login</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Help Section */}
            <Animated.View
              style={[
                styles.helpSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.helpText}>Remember your password?</Text>
              <TouchableOpacity onPress={onBack}>
                <Text style={styles.helpLink}>Back to Login</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Additional Help Section */}
            {!emailSent && (
              <Animated.View
                style={[
                  styles.additionalHelpSection,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <Text style={styles.additionalHelpText}>
                  Don't have an account yet?
                </Text>
                <TouchableOpacity style={styles.supportButton} onPress={onBack}>
                  <Text style={styles.supportButtonText}>Create Account</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
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
  
  iconSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  
  lockIcon: {
    fontSize: 40,
  },
  
  contentSection: {
    paddingHorizontal: 30,
    paddingBottom: 30,
    alignItems: 'center',
  },
  
  title: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  
  subtitle: {
    fontFamily: 'Outfit_300Light',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  
  formContainer: {
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  
  inputContainer: {
    marginBottom: 30,
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
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' && {
      outlineWidth: 0,
      outlineColor: 'transparent',
      boxShadow: '0 0 0px 1000px transparent inset',
      transition: 'background-color 5000s ease-in-out 0s',
    }),
  },
  
  resetButton: {
    borderRadius: 30,
    shadowColor: '#ffeb3b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 20,
  },
  
  resetButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
  },
  
  resetButtonText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  successSection: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(76, 175, 80, 0.3)',
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  
  successIcon: {
    fontSize: 32,
  },
  
  successText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  successSubtext: {
    fontFamily: 'Outfit_300Light',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  
  backToLoginButton: {
    borderRadius: 30,
    shadowColor: '#ffeb3b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  
  backToLoginGradient: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
  },
  
  backToLoginText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  
  helpSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  
  helpText: {
    fontFamily: 'Outfit_300Light',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginRight: 5,
  },
  
  helpLink: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  
  additionalHelpSection: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  
  additionalHelpText: {
    fontFamily: 'Outfit_300Light',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 15,
  },
  
  supportButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  
  supportButtonText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
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