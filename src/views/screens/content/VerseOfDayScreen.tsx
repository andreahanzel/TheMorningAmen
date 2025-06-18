// src/views/screens/content/VerseOfDayScreen.tsx

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

// Updated to use custom spiritual icons instead of emojis
// This file defines the Verse of the Day screen, which displays a daily verse with reflection and application sections.
// It includes animations, custom icons, and a share functionality.

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
    ScrollView,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { BackIcon, ShareIcon, PrayerIcon, CrossIcon } from '../../components/icons/CustomIcons';
import { db } from '../../../../firebase.config';
import { authService } from '../../../models/services/AuthService';
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { StarIcon } from '../../components/icons/CustomIcons';
import { getDoc } from 'firebase/firestore';

// Import our custom spiritual icons
import { SpiritualIcons } from '../../components/icons/SpiritualIcons';

// Import verses data (updated to remove emoji field)
import versesData from '../../../models/data/verses.json';

const { width, height } = Dimensions.get('window');

interface Verse {
    id: string;
    verse: string;
    text: string;
    theme: string;
    reflection: string;
    application: string;
}

interface VerseOfDayScreenProps {
    navigation: any;
}

export const VerseOfDayScreen: React.FC<VerseOfDayScreenProps> = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [verses] = useState<Verse[]>(versesData);
    const [showReflection, setShowReflection] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const cardTranslateX = useRef(new Animated.Value(0)).current;
    const cardScale = useRef(new Animated.Value(1)).current;
    const reflectionOpacity = useRef(new Animated.Value(0)).current;
    const iconRotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        startAnimations();
        startIconAnimation();
    }, []);

    // Check if the current verse is favorited when the index changes
    useEffect(() => {
        checkIfFavorited();
        const unsubscribe = setupFavoriteListener();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [currentIndex]);

    const checkIfFavorited = async () => {
        try {
            const currentUser = authService.getCurrentUser();
            if (!currentUser) return;

            const userDocRef = doc(db, 'users', currentUser.id);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const userFavorites = userData.favorites || [];
                const currentVerse = verses[currentIndex];
                
            const isAlreadyFavorited = userFavorites.some((fav: any) => 
                fav.id === currentVerse.id && fav.type === 'verse'
            );

                setIsFavorited(isAlreadyFavorited);
            }
        } catch (error) {
            console.error('Error checking if favorited:', error);
        }
    };

    // Set up a listener for favorite changes
        const setupFavoriteListener = () => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) return;

        const userDocRef = doc(db, 'users', currentUser.id);
        const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                const userFavorites = userData.favorites || [];
                const currentVerse = verses[currentIndex];
                
                const isCurrentlyFavorited = userFavorites.some((fav: any) => 
                    fav.id === currentVerse.id && fav.type === 'verse'
                );
                
                setIsFavorited(isCurrentlyFavorited);
            }
        });

        return unsubscribe;
    };

    // Animate the custom icon
    const startIconAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(iconRotateAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(iconRotateAnim, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

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

    // Get the appropriate custom icon for the theme
    const getCustomIcon = (theme: string) => {
        const IconComponent = SpiritualIcons[theme as keyof typeof SpiritualIcons];
        if (!IconComponent) {
            // Fallback to a default icon if theme not found
            return SpiritualIcons.Joy;
        }
        return IconComponent;
    };

    // Function to toggle favorite verse
    const toggleFavorite = async () => {
            const currentVerse = verses[currentIndex];
            
            try {
                const currentUser = authService.getCurrentUser();
                if (!currentUser) {
                    Alert.alert('Login Required', 'Please log in to save favorites');
                    return;
                }

                const userDocRef = doc(db, 'users', currentUser.id);
                
                if (isFavorited) {
                    // For removal, find the exact object in Firestore
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const userFavorites = userData.favorites || [];
                        
                        // Find the exact favorite object that exists in Firestore
                        const existingFavorite = userFavorites.find((fav: any) => 
                            fav.id === currentVerse.id && fav.type === 'verse'
                        );
                        
                        if (existingFavorite) {
                            // Remove using the exact object structure from Firestore
                            await updateDoc(userDocRef, {
                                favorites: arrayRemove(existingFavorite)
                            });
                            console.log('Successfully removed verse from favorites');
                            Alert.alert('Removed from Favorites', `"${currentVerse.verse}" has been removed from your favorites! 💔`);
                        }
                    }
                } else {
                    // Add to favorites with current timestamp
                    const favoriteItem = {
                        id: currentVerse.id,
                        type: 'verse' as const,
                        title: `${currentVerse.theme} - ${currentVerse.verse}`,
                        content: currentVerse.text,
                        author: 'Bible',
                        date: new Date().toISOString(),
                        category: currentVerse.theme,
                    };
                    
                    await updateDoc(userDocRef, {
                        favorites: arrayUnion(favoriteItem)
                    });
                    console.log('Successfully added verse to favorites');
                    Alert.alert('Added to Favorites', `"${currentVerse.verse}" has been saved to your favorites! ⭐`);
                }
                
            } catch (error) {
                console.error('Error toggling favorite:', error);
                Alert.alert('Error', 'Failed to update favorite');
            }
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

    const previousVerse = () => {
        if (currentIndex > 0) {
            setShowReflection(false);
            animateCardTransition(() => {
                setCurrentIndex(currentIndex - 1);
            });
        }
    };

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

    const toggleReflection = () => {
        if (showReflection) {
            Animated.timing(reflectionOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setShowReflection(false));
        } else {
            setShowReflection(true);
            Animated.timing(reflectionOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

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

    // Updated theme colors to match The Morning Amen logo
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
                return ['#ff9a56', '#ff6b35', '#f7931e']; // Default gradient colors
        }
    };

    const currentVerse = verses[currentIndex];
    const CustomIcon = getCustomIcon(currentVerse.theme);
    const iconRotation = iconRotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const onPanGestureEvent = (event: any) => {
        const { translationX } = event.nativeEvent;
        cardTranslateX.setValue(translationX);
    };

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
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)']}
                            style={styles.backButtonGradient}
                        >
                            <BackIcon size={20} color="#FFFFFF" />
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
                            <ShareIcon size={18} color="#FFFFFF" />
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>

                {/* Main Scrollable Content */}
                <ScrollView 
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
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
                                    {/* Custom Icon Badge */}
                                    <View style={styles.themeBadge}>
                                        <LinearGradient
                                            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)']}
                                            style={styles.themeBadgeGradient}
                                        >
                                            <Animated.View
                                                style={[
                                                    styles.customIconContainer,
                                                    {
                                                        transform: [{ rotate: iconRotation }],
                                                    },
                                                ]}
                                            >
                                                <CustomIcon 
                                                    size={28} 
                                                    color="#FFFFFF" 
                                                    gradient={false}
                                                />
                                            </Animated.View>
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
                                        onPress={toggleFavorite}
                                    >
                                        <LinearGradient
                                            colors={
                                                isFavorited 
                                                    ? ['#FFD700', '#FFA500', '#FF8C00'] 
                                                    : ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)']
                                            }
                                            style={styles.actionButtonGradient}
                                        >
                                            <View style={styles.actionButtonContent}>
                                                <Text style={[
                                                    styles.actionButtonText,
                                                    isFavorited && { color: '#FFFFFF', fontWeight: 'bold' }
                                                ]}>
                                                    {isFavorited ? 'Favorited' : 'Favorite'}
                                                </Text>
                                                <StarIcon 
                                                    size={16} 
                                                    color={isFavorited ? "#FFD700" : "#FFFFFF"} 
                                                    filled={isFavorited} 
                                                />
                                            </View>
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
                                                <View style={styles.actionButtonContent}>
                                                    <Text style={styles.actionButtonText}>Share</Text>
                                                    <ShareIcon size={16} color="#FFFFFF" />
                                                </View>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Reflection Toggle Button */}
                                    <TouchableOpacity
                                        style={styles.reflectionButton}
                                        onPress={toggleReflection}
                                    >
                                        <LinearGradient
                                            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)']}
                                            style={styles.actionButtonGradient}
                                        >
                                            <View style={styles.actionButtonContent}>
                                                <Text style={styles.actionButtonText}>
                                                    {showReflection ? 'Hide Reflection' : 'Show Reflection'}
                                                </Text>
                                                <PrayerIcon size={16} color="#FFFFFF" />
                                            </View>
                                        </LinearGradient>
                                    </TouchableOpacity>

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
                                },
                            ]}
                        >
                            <BlurView intensity={15} style={styles.reflectionCard}>
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                                    style={styles.reflectionGradient}
                                >
                                    <View style={styles.reflectionHeader}>
                                        <PrayerIcon size={16} color="#FFFFFF" />
                                        <Text style={styles.reflectionTitle}>Reflection</Text>
                                    </View>
                                    <Text style={styles.reflectionText}>{currentVerse.reflection}</Text>
                                    
                                    <View style={styles.applicationHeader}>
                                        <CrossIcon size={16} color="#FFFFFF" />
                                        <Text style={styles.applicationTitle}>Apply Today</Text>
                                    </View>
                                    <Text style={styles.applicationText}>{currentVerse.application}</Text>
                                </LinearGradient>
                            </BlurView>
                        </Animated.View>
                    )}

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
                </ScrollView>

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

    content: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 150,
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

    customIconContainer: {
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
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

    actionButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
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

    reflectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 12,
    },

    reflectionTitle: {
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
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

    applicationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 12,
    },

    applicationTitle: {
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
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

    reflectionButton: {
    borderRadius: 20,
    marginTop: 16,
    alignSelf: 'center',
    },

});