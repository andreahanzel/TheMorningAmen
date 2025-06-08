// src/views/screens/content/VerseOfDayScreen.tsx
// Daily verse screen with swipe gestures and animations
// This screen displays daily verses with themes, reflections, and applications

import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    StatusBar,
    Platform,
    TouchableOpacity,
    Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

// Import verses data
import versesData from '../../../models/data/verses.json';

const { width, height } = Dimensions.get('window');

interface Verse {
    id: string;
    verse: string;
    text: string;
    theme: string;
    emoji: string;
    reflection: string;
    application: string;
}

interface VerseOfDayScreenProps {
    navigation: any;
}

// VerseOfDayScreen component
export const VerseOfDayScreen: React.FC<VerseOfDayScreenProps> = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [verses] = useState<Verse[]>(versesData);
    const [showReflection, setShowReflection] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const cardTranslateX = useRef(new Animated.Value(0)).current;
    const cardScale = useRef(new Animated.Value(1)).current;
    const reflectionOpacity = useRef(new Animated.Value(0)).current;
    const reflectionHeight = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        startAnimations();
    }, []);

    const startAnimations = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    };

    // Navigation functions - next and previous verses
    const nextVerse = () => {
        if (currentIndex < verses.length - 1) {
            setShowReflection(false);
            animateCardTransition(() => {
                setCurrentIndex(currentIndex + 1);
            });
        }
    };

    // Function to go to the previous verse
    // This function checks if the current index is greater than 0 before allowing navigation
    const previousVerse = () => {
        if (currentIndex > 0) {
            setShowReflection(false);
            animateCardTransition(() => {
                setCurrentIndex(currentIndex - 1);
            });
        }
    };

    // Function to animate card transition
    // This function scales down the card and fades it out, then resets the state and scales it back up
    const animateCardTransition = (callback: () => void) => {
        Animated.sequence([
            Animated.timing(cardScale, {
                toValue: 0.9,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0.3,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start(() => {
            callback();
            Animated.parallel([
                Animated.timing(cardScale, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    };

    // Function to toggle reflection visibility
    // This function uses Animated API to show or hide the reflection section with a smooth transition
    const toggleReflection = () => {
        if (showReflection) {
            // Hide reflection
            Animated.parallel([
                Animated.timing(reflectionOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(reflectionHeight, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                }),
            ]).start(() => setShowReflection(false));
        } else {
            // Show reflection
            setShowReflection(true);
            Animated.parallel([
                Animated.timing(reflectionOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(reflectionHeight, {
                    toValue: 200,
                    duration: 300,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    };

    // Function to share the current verse
    const shareVerse = async () => {
        const currentVerse = verses[currentIndex];
        try {
            await Share.share({
                message: `"${currentVerse.text}" - ${currentVerse.verse}\n\nFrom The Morning Amen app 🙏`,
                title: `Today's Verse: ${currentVerse.theme}`,
            });
        } catch (error) {
            console.error('Error sharing verse:', error);
        }
    };

    // Function to get theme colors based on the verse theme
    const getThemeColors = (theme: string): [string, string, string] => {
        switch (theme) {
            case 'Joy':
                return ['#ffeb3b', '#ffc107', '#ff9800'];
            case 'Strength':
                return ['#ff6b35', '#ff8c42', '#ffa726'];
            case 'Purpose':
                return ['#ff7043', '#ff5722', '#f4511e'];
            case 'Rest':
                return ['#81c784', '#66bb6a', '#4caf50'];
            case 'Hope':
                return ['#64b5f6', '#42a5f5', '#2196f3'];
            case 'Peace':
                return ['#ba68c8', '#ab47bc', '#9c27b0'];
            case 'Trust':
                return ['#ffb74d', '#ffa726', '#ff9800'];
            case 'Love':
                return ['#f06292', '#ec407a', '#e91e63'];
            case 'Renewal':
                return ['#4db6ac', '#26a69a', '#009688'];
            case 'New Life':
                return ['#aed581', '#9ccc65', '#8bc34a'];
            default:
                return ['#ff6b35', '#ff8c42', '#ffa726'];
        }
    };

    const currentVerse = verses[currentIndex];

    const onPanGestureEvent = (event: any) => {
        const { translationX } = event.nativeEvent;
        cardTranslateX.setValue(translationX);
    };

    // Function to handle the end of the pan gesture
    const onPanHandlerStateChange = (event: any) => {
        if (event.nativeEvent.state === State.END) {
            const { translationX, velocityX } = event.nativeEvent;
            
            if (Math.abs(translationX) > width * 0.3 || Math.abs(velocityX) > 500) {
                if (translationX > 0) {
                    previousVerse();
                } else {
                    nextVerse();
                }
            }
            
            // Reset card position
            Animated.spring(cardTranslateX, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        }
    };

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#ff6b35" />
            <LinearGradient
                colors={['#ff9a56', '#ff6b35', '#f7931e']}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Header */}
                <Animated.View
                    style={[
                        styles.header,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <LinearGradient
                            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                            style={styles.backButtonGradient}
                        >
                            <Text style={styles.backIcon}>←</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Daily Verse</Text>
                        <Text style={styles.headerSubtitle}>
                            {currentIndex + 1} of {verses.length}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.shareButton}
                        onPress={shareVerse}
                    >
                        <LinearGradient
                            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                            style={styles.shareButtonGradient}
                        >
                            <Text style={styles.shareIcon}>📤</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>

                {/* Main Content */}
                <View style={styles.content}>
                    <PanGestureHandler
                        onGestureEvent={onPanGestureEvent}
                        onHandlerStateChange={onPanHandlerStateChange}
                    >
                        <Animated.View
                            style={[
                                styles.cardContainer,
                                {
                                    opacity: fadeAnim,
                                    transform: [
                                        { translateY: slideAnim },
                                        { translateX: cardTranslateX },
                                        { scale: cardScale },
                                    ],
                                },
                            ]}
                        >
                            <BlurView intensity={20} style={styles.verseCard}>
                                <LinearGradient
                                    colors={getThemeColors(currentVerse.theme)}
                                    style={styles.cardGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    {/* Theme Badge */}
                                    <View style={styles.themeBadge}>
                                        <LinearGradient
                                            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)']}
                                            style={styles.themeBadgeGradient}
                                        >
                                            <Text style={styles.themeEmoji}>{currentVerse.emoji}</Text>
                                            <Text style={styles.themeText}>{currentVerse.theme}</Text>
                                        </LinearGradient>
                                    </View>

                                    {/* Verse Text */}
                                    <View style={styles.verseContainer}>
                                        <Text style={styles.verseText}>"{currentVerse.text}"</Text>
                                        <Text style={styles.verseReference}>— {currentVerse.verse}</Text>
                                    </View>

                                    {/* Navigation Dots */}
                                    <View style={styles.dotsContainer}>
                                        {verses.map((_, index) => (
                                            <View
                                                key={index}
                                                style={[
                                                    styles.dot,
                                                    index === currentIndex && styles.activeDot,
                                                ]}
                                            />
                                        ))}
                                    </View>

                                    {/* Action Buttons */}
                                    <View style={styles.actionButtons}>
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={toggleReflection}
                                        >
                                            <LinearGradient
                                                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)']}
                                                style={styles.actionButtonGradient}
                                            >
                                                <Text style={styles.actionButtonText}>
                                                    {showReflection ? 'Hide' : 'Reflect'} 💭
                                                </Text>
                                            </LinearGradient>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={shareVerse}
                                        >
                                            <LinearGradient
                                                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)']}
                                                style={styles.actionButtonGradient}
                                            >
                                                <Text style={styles.actionButtonText}>Share 📱</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Floating particles */}
                                    <View style={styles.cardParticles}>
                                        {[...Array(5)].map((_, i) => (
                                            <View
                                                key={i}
                                                style={[
                                                    styles.particle,
                                                    {
                                                        top: `${10 + Math.random() * 80}%`,
                                                        left: `${10 + Math.random() * 80}%`,
                                                    },
                                                ]}
                                            />
                                        ))}
                                    </View>
                                </LinearGradient>
                            </BlurView>
                        </Animated.View>
                    </PanGestureHandler>

                    {/* Reflection Section */}
                    {showReflection && (
                        <Animated.View
                            style={[
                                styles.reflectionContainer,
                                {
                                    opacity: reflectionOpacity,
                                    height: reflectionHeight,
                                },
                            ]}
                        >
                            <BlurView intensity={15} style={styles.reflectionCard}>
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                                    style={styles.reflectionGradient}
                                >
                                    <Text style={styles.reflectionTitle}>💭 Reflection</Text>
                                    <Text style={styles.reflectionText}>{currentVerse.reflection}</Text>
                                    
                                    <Text style={styles.applicationTitle}>🎯 Apply Today</Text>
                                    <Text style={styles.applicationText}>{currentVerse.application}</Text>
                                </LinearGradient>
                            </BlurView>
                        </Animated.View>
                    )}
                </View>

                {/* Navigation Instructions */}
                <Animated.View
                    style={[
                        styles.instructionsContainer,
                        {
                            opacity: fadeAnim,
                        },
                    ]}
                >
                    <Text style={styles.instructionsText}>
                        ← Swipe to navigate → • Tap Reflect for insights
                    </Text>
                </Animated.View>

                {/* Background particles */}
                <View style={styles.backgroundParticles}>
                    {[...Array(10)].map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.backgroundParticle,
                                {
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                },
                            ]}
                        />
                    ))}
                </View>
            </LinearGradient>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
    },

    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },

    backButtonGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    backIcon: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },

    headerCenter: {
        alignItems: 'center',
    },

    headerTitle: {
        fontSize: 20,
        fontFamily: 'Outfit_700Bold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    headerSubtitle: {
        fontSize: 14,
        fontFamily: 'Outfit_300Light',
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 2,
    },

    shareButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },

    shareButtonGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    shareIcon: {
        fontSize: 18,
    },

    content: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },

    cardContainer: {
        marginBottom: 20,
    },

    verseCard: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 12,
    },

    cardGradient: {
        padding: 32,
        minHeight: 400,
        justifyContent: 'space-between',
        position: 'relative',
    },

    themeBadge: {
        alignSelf: 'center',
        marginBottom: 24,
    },

    themeBadgeGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    themeEmoji: {
        fontSize: 20,
        marginRight: 8,
    },

    themeText: {
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    verseContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },

    verseText: {
        fontSize: 22,
        fontFamily: 'LibreBaskerville_400Regular_Italic',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 32,
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    verseReference: {
        fontSize: 18,
        fontFamily: 'LibreBaskerville_700Bold',
        color: 'rgba(255, 255, 255, 0.95)',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        gap: 8,
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },

    activeDot: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        width: 20,
        borderRadius: 10,
    },

    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },

    actionButton: {
        flex: 1,
        borderRadius: 20,
    },

    actionButtonGradient: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    actionButtonText: {
        fontSize: 14,
        fontFamily: 'Outfit_500Medium',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
    },

    reflectionContainer: {
        marginTop: 20,
        overflow: 'hidden',
    },

    reflectionCard: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },

    reflectionGradient: {
        padding: 20,
    },

    reflectionTitle: {
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
        marginBottom: 12,
        textAlign: 'center',
    },

    reflectionText: {
        fontSize: 14,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 16,
    },

    applicationTitle: {
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
        marginBottom: 12,
        textAlign: 'center',
    },

    applicationText: {
        fontSize: 14,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: 22,
        textAlign: 'center',
    },

    instructionsContainer: {
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 120 : 100,
        alignItems: 'center',
    },

    instructionsText: {
        fontSize: 14,
        fontFamily: 'Outfit_300Light',
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },

    cardParticles: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
    },

    particle: {
        position: 'absolute',
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },

    backgroundParticles: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
    },

    backgroundParticle: {
        position: 'absolute',
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
});