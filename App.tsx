// App.tsx 
// This is the main entry point for the React Native app.
// It initializes the app, loads custom fonts, and displays the main content.

import React, { useState, useRef } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Animated,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { useAppFonts } from './src/controllers/hooks/useFonts';
import { AnimatedLogo } from './src/views/components/common/AnimatedLogo';
import { LoginScreen } from './src/views/screens/auth/LoginScreen';
import { SignUpScreen } from './src/views/screens/auth/SignUpScreen';
import { ForgotPasswordScreen } from './src/views/screens/auth/ForgotPasswordScreen';
import { RootNavigator } from './src/controllers/navigation/RootNavigator';


const { width, height } = Dimensions.get('window');

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// App Navigation States
type AppState = 'welcome' | 'login' | 'signup' | 'forgot-password' | 'main';

const styles = StyleSheet.create({
screenContainer: {
    flex: 1,
},

container: {
    flex: 1,
},

loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},

loadingText: {
    fontFamily: 'Outfit_300Light',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
},

logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
},

bottomContent: {
    paddingHorizontal: 30,
    paddingBottom: 60,
    alignItems: 'center',
},

welcomeText: {
    fontFamily: 'Outfit_300Light',
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    opacity: 0.95,
},

journeyText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 25,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
},

inspirationText: {
    fontFamily: 'LibreBaskerville_400Regular_Italic',
    fontSize: 16,
    lineHeight: 24,
    color: '#fff8e1',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    opacity: 0.95,
},

actionButton: {
    borderRadius: 30,
    shadowColor: '#ffeb3b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 12,
},

buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignItems: 'center',
    minWidth: 220,
},

buttonText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
},

floatingParticle: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 5,
},

ripple: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    pointerEvents: 'none',
},

// Main App Styles 
mainAppContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
},

mainAppText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
},

mainAppSubtext: {
    fontFamily: 'Outfit_300Light',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 40,
},

logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
},

logoutButtonText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: '#FFFFFF',
},
});

// Ripple Effect Component
const RippleEffect: React.FC<{ x: number; y: number }> = ({ x, y }) => {
    const scale = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0.8)).current;

    React.useEffect(() => {
        Animated.parallel([
        Animated.timing(scale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }),
        Animated.timing(opacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }),
        ]).start();
    }, []);

    return (
        <Animated.View
        style={[
            styles.ripple,
            {
            transform: [
                { translateX: x - 50 },
                { translateY: y - 50 },
                { scale }
            ],
            opacity,
            },
        ]}
        />
    );
    };

// Main App Component
export default function App() {

    const { fontsLoaded } = useAppFonts();
    const [currentScreen, setCurrentScreen] = useState<AppState>('welcome');
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
    const [showContent, setShowContent] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // Animation values
    const textSlideUp = useRef(new Animated.Value(100)).current;
    const textFade = useRef(new Animated.Value(0)).current;
    const logoBreath = useRef(new Animated.Value(1)).current;
    const screenTransition = useRef(new Animated.Value(1)).current;
    const floatingParticles = useRef([...Array(6)].map(() => ({
        x: new Animated.Value(Math.random() * (width - 50)),
        y: new Animated.Value(Math.random() * (height - 50)),
        scale: new Animated.Value(0.5 + Math.random() * 0.5),
        }))).current;

    React.useEffect(() => {
        if (fontsLoaded) {
        SplashScreen.hideAsync();
        startEntranceAnimations();
        }
    }, [fontsLoaded]);

    const startEntranceAnimations = () => {
        // Delay content entrance
        setTimeout(() => setShowContent(true), 1000);

        // Logo breathing effect
        Animated.loop(
        Animated.sequence([
            Animated.timing(logoBreath, {
            toValue: 1.03,
            duration: 3000,
            useNativeDriver: true,
            }),
            Animated.timing(logoBreath, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
            }),
        ])
        ).start();

        // Text entrance animation
        setTimeout(() => {
        Animated.parallel([
            Animated.timing(textSlideUp, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
            }),
            Animated.timing(textFade, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
            }),
        ]).start();
        }, 1500);

        // Floating particles animation
        floatingParticles.forEach((particle, index) => {
            const animateParticle = () => {
                // Separate X/Y animations (can't use native driver for position)
                Animated.parallel([
                Animated.timing(particle.x, {
                    toValue: Math.random() * (width - 50),
                    duration: 8000 + Math.random() * 4000,
                    useNativeDriver: false, // Position animations must use JS driver
                }),
                Animated.timing(particle.y, {
                    toValue: Math.random() * (height - 50),
                    duration: 6000 + Math.random() * 6000,
                    useNativeDriver: false, // Position animations must use JS driver
                }),
                ]).start(() => animateParticle());

                // Separate scale animation (can use native driver)
                Animated.loop(
                Animated.sequence([
                    Animated.timing(particle.scale, {
                    toValue: 0.2 + Math.random() * 0.8,
                    duration: 2000 + Math.random() * 2000,
                    useNativeDriver: true, // Scale can use native driver
                    }),
                    Animated.timing(particle.scale, {
                    toValue: 0.5 + Math.random() * 0.5,
                    duration: 2000 + Math.random() * 2000,
                    useNativeDriver: true, // Keep consistent
                    }),
                ])
                ).start();
            };
            
            setTimeout(() => animateParticle(), index * 500);
        });
    };

    const createRipple = (event: any) => {
        const { locationX, locationY } = event.nativeEvent;
        const rippleId = Date.now();
        
        setRipples(prev => [...prev, { 
        id: rippleId, 
        x: locationX || width / 2, 
        y: locationY || height / 2 
        }]);
        
        // Remove ripple after animation
        setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== rippleId));
        }, 1500);
    };

    const handleLogoPress = () => {
        // Logo pulse effect
        Animated.sequence([
        Animated.timing(logoBreath, {
            toValue: 1.1,
            duration: 150,
            useNativeDriver: true,
        }),
        Animated.timing(logoBreath, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }),
        ]).start();
    };

    const navigateToScreen = (screen: AppState) => {
        // Screen transition animation
        Animated.sequence([
        Animated.timing(screenTransition, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }),
        Animated.timing(screenTransition, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }),
        ]).start();
        
        setTimeout(() => setCurrentScreen(screen), 300);
    };

    const handleBeginJourney = () => {
        navigateToScreen('login');
    };

    const handleSuccessfulAuth = () => {
        setIsAuthenticated(true);
        navigateToScreen('main');
        // Here later it navigates to the main app screens
        console.log('🎉 Authentication successful! Welcome to The Morning Amen!');
    };

    const handleSocialLogin = (provider: string) => {
        console.log(`🔐 ${provider} login initiated...`);
        // For now, simulate successful login
        setTimeout(() => {
        handleSuccessfulAuth();
        }, 2000);
    };

    // Show loading screen while fonts are loading
    if (!fontsLoaded) {
        return (
        <LinearGradient
            colors={['#ff9a56', '#ff6b35', '#f7931e']}
            style={styles.loadingContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <Text style={styles.loadingText}>Loading The Morning Amen...</Text>
        </LinearGradient>
        );
    }

    // Render different screens based on current state
    const renderScreen = () => {
        switch (currentScreen) {
        case 'login':
            return (
            <LoginScreen
                onLogin={handleSuccessfulAuth}
                onSignUp={() => navigateToScreen('signup')}
                onGoogleLogin={() => handleSocialLogin('Google')}
                onAppleLogin={() => handleSocialLogin('Apple')}
                onBack={() => navigateToScreen('welcome')}
                onForgotPassword={() => navigateToScreen('forgot-password')}
            />
            
            );
        
        case 'signup':
            return (
            <SignUpScreen
                onSignUp={handleSuccessfulAuth}
                onLogin={() => navigateToScreen('login')}
                onGoogleSignUp={() => handleSocialLogin('Google')}
                onAppleSignUp={() => handleSocialLogin('Apple')}
                onBack={() => navigateToScreen('welcome')}
            />
            );

            case 'forgot-password':
            return (
            <ForgotPasswordScreen
                onBack={() => navigateToScreen('login')}
                onSuccess={() => navigateToScreen('login')}
            />
            );
        
        case 'main':
            return <RootNavigator />;
        
        default: // 'welcome'
            return (
            <TouchableWithoutFeedback onPress={createRipple}>
                <View style={styles.container}>
                <LinearGradient
                    colors={['#ff9a56', '#ff6b35', '#f7931e']}
                    style={StyleSheet.absoluteFillObject}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />

                {/* Floating Particles */}
                {floatingParticles.map((particle, index) => (
                    <Animated.View
                        key={index}
                        style={[
                        styles.floatingParticle,
                        {
                            // Remove translateX and translateY, use static positioning
                            top: Math.random() * height,
                            left: Math.random() * width,
                            transform: [{ scale: particle.scale }],
                            opacity: 0.6,
                        },
                        ]}
                    />
                    ))}

                {/* Interactive Ripples */}
                {ripples.map((ripple) => (
                    <RippleEffect key={ripple.id} x={ripple.x} y={ripple.y} />
                ))}

                {/* Logo Section with Breathing */}
                <TouchableWithoutFeedback onPress={handleLogoPress}>
                    <Animated.View 
                    style={[
                        styles.logoSection,
                        {
                        transform: [{ scale: logoBreath }],
                        },
                    ]}
                    >
                    <AnimatedLogo />
                    </Animated.View>
                </TouchableWithoutFeedback>

                {/* Animated Bottom Content */}
                {showContent && (
                    <Animated.View 
                    style={[
                        styles.bottomContent,
                        {
                        opacity: textFade,
                        transform: [{ translateY: textSlideUp }],
                        },
                    ]}
                    >
                    {/* Welcome Text */}
                    <Text style={styles.welcomeText}>
                        Welcome to your daily
                    </Text>
                    
                    <Text style={styles.journeyText}>
                        Spiritual Journey
                    </Text>
                    
                    {/* Inspirational Text */}
                    <Text style={styles.inspirationText}>
                        Let faith be your morning light and peace be your daily guide.
                    </Text>
                    
                    {/* Enhanced Action Button */}
                    <TouchableOpacity 
                        style={styles.actionButton} 
                        activeOpacity={0.8}
                        onPress={handleBeginJourney}
                    >
                        <LinearGradient
                        colors={['#ffeb3b', '#ff9800', '#ff6b35']}
                        style={styles.buttonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        >
                        <Text style={styles.buttonText}>Begin Your Journey</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    </Animated.View>
                )}
                </View>
            </TouchableWithoutFeedback>
            );
        }
    };

    return (
        <Animated.View 
        style={[
            styles.screenContainer,
            {
            opacity: screenTransition,
            },
        ]}
        >
        {renderScreen()}
        </Animated.View>
    );
}