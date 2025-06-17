// src/views/screens/main/HomeScreen.tsx

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

// Enhanced HomeScreen with preserved functionality + News & Bible Reading + Responsive Design
// This file is responsible for the main home screen of the app, featuring user greetings, daily highlights, and quick access to various features.
// It includes responsive design for different screen sizes, animations, and a modern UI with gradient backgrounds and blur effects.

import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    Animated,
    Dimensions,
    StatusBar,
    RefreshControl,
    Platform,
    SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { BibleIcon, PrayerIcon, PlayIcon, NewsIcon, SunriseIcon, StarIcon, SearchIcon, CrossIcon } from '../../components/icons/CustomIcons';
import { SpiritualIcons } from '../../components/icons/SpiritualIcons';
import { FirebaseService } from '../../../models/services/FirebaseService';
import { testFirebaseConnection } from '../../../utils/firebaseTest';
import { 
    initializeFirebaseData, 
    checkFirebaseCollections, 
    testDevotionsCollection,
    clearAllFirebaseData
    } from '../../../utils/firebaseDataInit';


// Import your custom theme
import { colors } from '../../../styles/colors';
import { typography } from '../../../styles/typography';

// Define the User interface
interface User {
    firstName: string;
    // Add other user properties as needed
}

interface HomeScreenProps {
    navigation: any;
    onLogout?: () => void;
}

// COMPONENT: Enhanced HomeScreen
export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, onLogout }) => {
    const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
    const isSmallScreen = screenDimensions.width < 400;
    const isMediumScreen = screenDimensions.width >= 400 && screenDimensions.width < 768;
    const isLargeScreen = screenDimensions.width >= 768;
    
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [featuredDevotion, setFeaturedDevotion] = useState<any>(null);
    const [todaysVerse, setTodaysVerse] = useState<any>(null);
    const [firebaseLoading, setFirebaseLoading] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const cardAnims = useRef([
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0), // News section
        new Animated.Value(0), // Bible reading
    ]).current;

        // Spiritual icon animations
    const iconRotateAnims = useRef([
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
    ]).current;

    const iconScaleAnims = useRef([
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
    ]).current;

    // Floating animation for enhanced UI
    const floatAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenDimensions(window);
        });
        return () => subscription?.remove();
    }, []);

    // This effect runs on component mount to load user data and start animations
    useEffect(() => {
        loadUserData();
        loadFirebaseData();
        startAnimations();
        startFloatingAnimation();
        startSpiritualIconAnimations();
        
        // Update time every minute
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timeInterval);
    }, []);

    // Function to test Firebase connection
    const handleTestFirebase = async () => {
    console.log('Testing Firebase connection...');
    const result = await testFirebaseConnection();
    
    if (result.success) {
        Alert.alert('Firebase Connected!', `Document created with ID: ${result.documentId}`);
    } else {
        Alert.alert('Firebase Error', result.error);
    }
};

    // Function to test Firebase connection and add a test document
    const loadUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('@current_user');
            if (userData) {
                setCurrentUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const loadFirebaseData = async () => {
    try {
        setFirebaseLoading(true);
        console.log('Loading Firebase data for HomeScreen...');
        
        // Load featured devotion (most recent)
        const devotions = await FirebaseService.getAllDevotions();
            if (devotions && devotions.length > 0) {
                setFeaturedDevotion(devotions[0]);
                // Only log the id, since 'title' may not exist on the type
                console.log('Featured devotion loaded:', devotions[0]?.id || 'Devotion loaded');
            }
            
            // Load today's verse
            const verse = await FirebaseService.getTodaysVerse();
            if (verse) {
                setTodaysVerse(verse);
                console.log('Today\'s verse loaded:', (verse && 'verse' in verse ? (verse as any).verse : verse?.id) || 'Verse loaded');
            }
            
        } catch (error) {
            console.error('Error loading Firebase data:', error);
        } finally {
            setFirebaseLoading(false);
        }
    };

    const startAnimations = () => {
        // Main container animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();

        // Staggered card animations
        const cardAnimations = cardAnims.map((anim, index) =>
            Animated.timing(anim, {
                toValue: 1,
                duration: 600,
                delay: index * 150,
                useNativeDriver: true,
            })
        );

        Animated.stagger(100, cardAnimations).start();
    };

    const startFloatingAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const startSpiritualIconAnimations = () => {
        iconRotateAnims.forEach((anim, index) => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 3000 + (index * 200),
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: 3000 + (index * 200),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        });

        iconScaleAnims.forEach((anim, index) => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 2000 + (index * 150),
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: 2000 + (index * 150),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        });
    }; 

// Refresh control for pull-to-refresh functionality
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // Reload both user data and Firebase data
        Promise.all([
            loadUserData(),
            loadFirebaseData()
        ]).finally(() => {
            setRefreshing(false);
        });
    }, []);

    // Get greeting based on current time
    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Format date string for display
    const getDateString = () => {
        return currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Handle card press navigation with animations - PRESERVED EXACTLY
    const handleCardPress = (screen: string) => {
        const scaleDown = Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
        });
        
        const scaleUp = Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
        });

        Animated.sequence([scaleDown, scaleUp]).start(() => {
            // Navigate to the correct screens - PRESERVED EXACTLY
            switch (screen) {
                case 'Devotions':
                    navigation.navigate('DevotionsStack');
                    break;
                case 'PrayerWall':
                    navigation.navigate('PrayerStack');
                    break;
                case 'VideoGallery':
                    navigation.navigate('VideosStack');
                    break;
                case 'VerseOfDay':
                    navigation.navigate('VerseOfDay');
                    break;
                case 'Affirmations':
                    navigation.navigate('VerseOfDay');
                    break;
                case 'Profile':
                    navigation.navigate('ProfileStack');
                    break;
                case 'About':
                    navigation.navigate('About');
                    break;
                case 'BibleReading':
                    // Show coming soon alert instead of navigating
                    if (Platform.OS === 'web') {
                        window.alert('Coming Soon! 📖\n\nBible Reading feature will be available in future updates.');
                    } else {
                        Alert.alert('Coming Soon! 📖', 'Bible Reading feature will be available in future updates.');
                    }
                    break;
                case 'News':
                    // Show coming soon alert
                    if (Platform.OS === 'web') {
                        window.alert('Coming Soon! 📰\n\nChristian News feature will be available in future updates.');
                    } else {
                        Alert.alert('Coming Soon! 📰', 'Christian News feature will be available in future updates.');
                    }
                    break;
                case 'Meditation':
                    if (Platform.OS === 'web') {
                        window.alert('Coming Soon! 🧘‍♀️\n\nMeditation feature will be available in future updates.');
                    } else {
                        Alert.alert('Coming Soon! 🧘‍♀️', 'Meditation feature will be available in future updates.');
                    }
                    break;
                case 'Favorites':
                    if (Platform.OS === 'web') {
                        window.alert('Coming Soon! ⭐\n\nMy Favorites feature will be available in future updates.');
                    } else {
                        Alert.alert('Coming Soon! ⭐', 'My Favorites feature will be available in future updates.');
                    }
                    break;
                case 'Settings':
                    if (Platform.OS === 'web') {
                        window.alert('Coming Soon! ⚙️\n\nSettings feature will be available in future updates.');
                    } else {
                        Alert.alert('Coming Soon! ⚙️', 'Settings feature will be available in future updates.');
                    }
                    break;
                default:
                    console.log(`Navigation to ${screen} - Screen coming soon!`);
                    break;
            }
        });
    };

    // Function to get the icon component based on the icon name
    // This function returns the appropriate icon component based on the icon name
    const getIconComponent = (iconName: string, size: number, index: number = 0) => {
        const iconProps = { size: size + 8, gradient: true, color: '#FFFFFF' };
        
        switch (iconName) {
            case 'bible': return <BibleIcon {...iconProps} />;
            case 'prayer': return <PrayerIcon {...iconProps} />;
            case 'video': return <PlayIcon {...iconProps} />;
            case 'news': return <NewsIcon {...iconProps} />;
            case 'sunrise': return <SunriseIcon {...iconProps} />;
            case 'star': return <StarIcon {...iconProps} />;
            case 'cross': return <CrossIcon {...iconProps} />;
            default: return <BibleIcon {...iconProps} />;
        }
    };

    // Enhanced Feature Card with responsive design
    const FeatureCard = ({ 
        title, 
        subtitle, 
        icon, 
        colors: cardColors, 
        onPress, 
        animValue,
        size = 'large',
        isNew = false
    }: {
        title: string;
        subtitle: string;
        icon: string;
        colors: [string, string, ...string[]];
        onPress: () => void;
        animValue: Animated.Value;
        size?: 'large' | 'medium' | 'small';
        isNew?: boolean;
    }) => {

        // Card width and height based on screen size and size prop
        const getCardWidth = () => {
        if (size === 'large' || isSmallScreen) return '100%';
        return '49%'; // Only use two in one row on medium or large screens
        };

        // Modify the card height based on size and screen size
        const getCardHeight = () => {
        if (size === 'large') return isLargeScreen ? 200 : 180;
        if (size === 'medium') return isLargeScreen ? 200 : 180;
        return 100;
        };


        return (
            <Animated.View
            style={[
                styles.featureCard,
                {
                width: getCardWidth(),
                height: getCardHeight(),
                marginBottom: isLargeScreen ? 40 : 20, // ✅ row gap for large screens
                transform: [
                    {
                    translateY: animValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                    }),
                    },
                    {
                    scale: animValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                    }),
                    },
                ],
                },
            ]}
            >

                <Pressable
                    style={styles.cardTouchable}
                    onPress={onPress}
                >
                    <LinearGradient
                        colors={cardColors}
                        style={styles.cardGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <BlurView intensity={10} style={styles.cardBlurOverlay}>
                            <View style={styles.cardContent}>
                                {/* Icon Container */}
                                {/* Icon Container with Spiritual Animations */}
                        <Animated.View 
                            style={[
                                styles.cardIcon,
                                {
                                    transform: [
                                        { scale: pulseAnim },
                                        {
                                            rotate: iconRotateAnims[Math.floor(Math.random() * iconRotateAnims.length)].interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['0deg', '360deg'],
                                            }),
                                        },
                                        {
                                            scale: iconScaleAnims[Math.floor(Math.random() * iconScaleAnims.length)].interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [1, 1.2],
                                            }),
                                        },
                                    ]
                                }
                            ]}
                        >
                            {getIconComponent(icon, size === 'large' ? (isLargeScreen ? 36 : 32) : (isLargeScreen ? 28 : 24), Math.floor(Math.random() * 8))}
                        </Animated.View>
                                
                                {/* Text Container */}
                                <View style={styles.cardTextContent}>
                                    <View style={styles.cardTitleRow}>
                                        <Text style={[
                                            styles.cardTitle, 
                                            { 
                                                fontSize: size === 'large' ? 
                                                    (isLargeScreen ? 20 : 18) : 
                                                    (isLargeScreen ? 18 : 16) 
                                            }
                                        ]}>
                                            {title}
                                        </Text>
                                        {isNew && (
                                            <View style={styles.newBadge}>
                                                <Text style={styles.newBadgeText}>NEW</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={[
                                        styles.cardSubtitle, 
                                        { 
                                            fontSize: size === 'large' ? 
                                                (isLargeScreen ? 15 : 14) : 
                                                (isLargeScreen ? 14 : 12) 
                                        }
                                    ]}>
                                        {subtitle}
                                    </Text>
                                </View>
                            </View>

                            {/* Floating particles */}
                            <Animated.View 
                                style={[
                                    styles.floatingParticle,
                                    {
                                        transform: [{
                                            translateY: floatAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0, -10],
                                            })
                                        }]
                                    }
                                ]}
                            />
                        </BlurView>
                    </LinearGradient>
                </Pressable>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary.coral} />
            <LinearGradient
                colors={[colors.primary.sunrise, colors.primary.coral, colors.primary.amber]}
                style={styles.gradientContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Floating background elements */}
                <Animated.View 
                    style={[
                        styles.backgroundElement1,
                        {
                            transform: [{
                                translateY: floatAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 20],
                                })
                            }]
                        }
                    ]}
                />
                <Animated.View 
                    style={[
                        styles.backgroundElement2,
                        {
                            transform: [{
                                translateX: floatAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 15],
                                })
                            }]
                        }
                    ]}
                />

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[
                        styles.scrollContent,
                        isLargeScreen && styles.largeScreenContent
                    ]}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.neutral.white}
                            colors={[colors.primary.coral]}
                        />
                    }
                >
                    {/* Header Section - Enhanced but preserved */}
                    <Animated.View
                        style={[
                            styles.header,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                                paddingTop: Platform.OS === 'ios' ? 20 : 40,
                            },
                        ]}
                    >
                        <BlurView intensity={15} style={styles.headerBlur}>
                            <View style={styles.headerContent}>
                                <View style={styles.headerTop}>
                                    <View style={styles.headerLeft}>
                                        <View style={styles.logoContainer}>
                                            <Animated.View style={[styles.logo, { transform: [{ scale: pulseAnim }] }]}>
                                                <LinearGradient
                                                    colors={[colors.primary.gold, colors.primary.amber]}
                                                    style={styles.logoGradient}
                                                >
                                                    <Text style={styles.logoText}>TMA</Text>
                                                </LinearGradient>
                                            </Animated.View>
                                        </View>
                                        <View style={styles.greetingContainer}>
                                            <Text style={[
                                                styles.greeting,
                                                { fontSize: isLargeScreen ? 28 : isSmallScreen ? 22 : 24 }
                                            ]}>
                                                {getGreeting()}{currentUser ? `, ${currentUser.firstName}` : ''}!
                                            </Text>
                                            <Text style={styles.dateText}>{getDateString()}</Text>
                                        </View>
                                    </View>
                                    
                                    <Pressable
                                        style={styles.profileButton}
                                        onPress={() => navigation.navigate('Profile')}
                                    >
                                        <BlurView intensity={20} style={styles.profileGradient}>
                                            <CrossIcon size={20} color="#FFFFFF" />
                                        </BlurView>
                                    </Pressable>
                                </View>

                                <Text style={[
                                    styles.subtitle,
                                    { fontSize: isLargeScreen ? 18 : 16 }
                                ]}>
                                    Start your day with faith, hope, and purpose
                                </Text>
                            </View>
                        </BlurView>
                    </Animated.View>

                    {/* Daily Highlight Card - Enhanced */}
                    <Animated.View
                        style={[
                            styles.highlightSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: scaleAnim }],
                            },
                        ]}
                    >
                        <BlurView intensity={20} style={styles.highlightCard}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
                                style={styles.highlightGradient}
                            >
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8}}>
                                    <SunriseIcon size={18} color="#FFFFFF" />
                                    <Text style={[
                                        styles.highlightTitle,
                                        { fontSize: isLargeScreen ? 20 : 18 }
                                    ]}>
                                        Today's Blessing
                                    </Text>
                                </View>
                                <Text style={[styles.highlightVerse, { fontSize: isLargeScreen ? 18 : 16 }]}>
                                    {todaysVerse ? `"${todaysVerse.text}"` : '"This is the day that the Lord has made; let us rejoice and be glad in it."'}
                                </Text>
                                <Text style={styles.highlightReference}>
                                    {todaysVerse ? `- ${todaysVerse.verse}` : '- Psalm 118:24'}
                                </Text>
                                
                                <Pressable
                                    style={styles.highlightButton}
                                    onPress={() => handleCardPress('VerseOfDay')}
                                >
                                    <Text style={styles.highlightButtonText}>Read More →</Text>
                                </Pressable>
                            </LinearGradient>
                        </BlurView>
                    </Animated.View>

                    {/* Main Features Grid - Enhanced with responsive layout */}
                <Animated.View
                    style={[
                        styles.featuresSection,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                            marginTop: isLargeScreen ? 40 : 0, // Add top margin for large screens only
                        },
                    ]}
                >
                    <Text style={[
                        styles.sectionTitle,
                        { 
                            fontSize: isLargeScreen ? 24 : 20,
                            marginBottom: isLargeScreen ? 40 : 20, // Increase bottom margin for large screens
                        }
                    ]}>
                        Explore Your Faith Journey
                    </Text>
                        
                        {/* Features Grid Layout - Responsive */}
                        <View style={styles.featuresGrid}>
                        {/* Daily Devotions - Full Width */}
                        <FeatureCard
                            title="Daily Devotions"
                            subtitle="Inspiring stories and reflections"
                            icon="bible"
                            colors={[colors.primary.coral, colors.primary.amber]}
                            onPress={() => handleCardPress('Devotions')}
                            animValue={cardAnims[0]}
                            size="large"
                        />

                        {/* Bible Reading - Full Width */}
                        <FeatureCard
                            title="Bible Reading"
                            subtitle="Daily scripture reading plan"
                            icon="bible"
                            colors={[colors.primary.gold, colors.secondary.sunGlow]}
                            onPress={() => handleCardPress('BibleReading')}
                            animValue={cardAnims[6]}
                            size="large"
                            isNew
                        />

                        {/* Medium Cards Row - Two per row */}
                        <View style={[
                            styles.mediumCardsRow,
                            isLargeScreen && { marginBottom: 35 } // gap between rows of medium cards
                            ]}>
                            <FeatureCard
                                title="Prayer Wall"
                                subtitle="Share & pray together"
                                icon="prayer"
                                colors={[colors.primary.deepOrange, colors.primary.coral]}
                                onPress={() => handleCardPress('PrayerWall')}
                                animValue={cardAnims[1]}
                                size="medium"
                            />

                            <FeatureCard
                                title="Video Messages"
                                subtitle="Inspirational content"
                                icon="video"
                                colors={[colors.primary.orange, colors.primary.amber]}
                                onPress={() => handleCardPress('VideoGallery')}
                                animValue={cardAnims[2]}
                                size="medium"
                            />
                        </View>

                        {/* Christian News - Full Width */}
                        <FeatureCard
                            title="Christian News"
                            subtitle="Latest faith-based news and updates"
                            icon="news"
                            colors={[colors.primary.sunrise, colors.primary.coral]}
                            onPress={() => handleCardPress('News')}
                            animValue={cardAnims[7]}
                            size="large"
                            isNew
                        />

                        {/* Daily Affirmations - Full Width */}
                    <FeatureCard
                        title="Daily Affirmations"
                        subtitle="Strengthen your faith daily"
                        icon="prayer"
                        colors={[colors.primary.gold, colors.secondary.sunGlow]}
                        onPress={() => handleCardPress('Affirmations')}
                        animValue={cardAnims[3]}
                        size="large"
                    />

                        {/* Second Medium Cards Row */}
                        <View style={[
                            styles.mediumCardsRow,
                            isLargeScreen && { marginBottom: 35 } // gap between rows of medium cards
                            ]}>
                            <FeatureCard
                                title="Meditation"
                                subtitle="Find inner peace"
                                icon="sunrise"
                                colors={[colors.primary.amber, colors.secondary.sunGlow]}
                                onPress={() => handleCardPress('Meditation')}
                                animValue={cardAnims[4]}
                                size="medium"
                            />

                            <FeatureCard
                                title="My Favorites"
                                subtitle="Saved content"
                                icon="star"
                                colors={[colors.primary.gold, colors.secondary.sunGlow]}
                                onPress={() => handleCardPress('Favorites')}
                                animValue={cardAnims[5]}
                                size="medium"
                            />
                        </View>
                        </View>

                    </Animated.View>

                    {/* Quick Actions  */}
                    <Animated.View
                        style={[
                            styles.quickActionsSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                                
                            },
                        ]}
                    >
                        <Text style={[styles.sectionTitle, { fontSize: isLargeScreen ? 22 : 20, marginBottom: 40 }]}>
                            Quick Actions
                        </Text>
                        <View style={[
                            styles.quickActionsGrid,
                            isLargeScreen && styles.largeScreenQuickActions
                        ]}>
                            <Pressable
                                style={[styles.quickActionButton, isLargeScreen && styles.largeQuickAction]}
                                onPress={() => handleCardPress('PrayerWall')}
                            >
                                <BlurView intensity={20} style={styles.quickActionGradient}>
                                    <PrayerIcon size={isLargeScreen ? 28 : 24} gradient={true} color="#FFFFFF" />
                                    <Text style={styles.quickActionText}>Add Prayer</Text>
                                </BlurView>
                            </Pressable>

                            <Pressable
                                style={[styles.quickActionButton, isLargeScreen && styles.largeQuickAction]}
                                onPress={initializeFirebaseData}
                                >
                                <BlurView intensity={20} style={styles.quickActionGradient}>
                                    <Text style={styles.quickActionText}>Init Data</Text>
                                </BlurView>
                            </Pressable>

                            <Pressable
                                style={[styles.quickActionButton, isLargeScreen && styles.largeQuickAction]}
                                onPress={checkFirebaseCollections}
                                >
                                <BlurView intensity={20} style={styles.quickActionGradient}>
                                    <Text style={styles.quickActionText}>Check Data</Text>
                                </BlurView>
                            </Pressable>

                            {/* NEW CLEAR DATA BUTTON */}
                            <Pressable
                                style={[styles.quickActionButton, isLargeScreen && styles.largeQuickAction]}
                                onPress={clearAllFirebaseData}
                                >
                                <BlurView intensity={20} style={styles.quickActionGradient}>
                                    <Text style={styles.quickActionText}>Clear Data</Text>
                                </BlurView>
                            </Pressable>

                            <Pressable
                                style={[styles.quickActionButton, isLargeScreen && styles.largeQuickAction]}
                                onPress={testDevotionsCollection}
                                >
                                <BlurView intensity={20} style={styles.quickActionGradient}>
                                    <Text style={styles.quickActionText}>Test Devotions</Text>
                                </BlurView>
                            </Pressable>

                            <Pressable
                                style={[styles.quickActionButton, isLargeScreen && styles.largeQuickAction]}
                                onPress={handleTestFirebase}
                                >
                                <BlurView intensity={20} style={styles.quickActionGradient}>
                                    <Text style={styles.quickActionText}>Test Connection</Text>
                                </BlurView>
                            </Pressable>
                        </View>
                    </Animated.View>

                    {/* Bottom Spacing for tab bar */}
                    <View style={styles.bottomSpacing} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary.sunrise,
    },
    
    gradientContainer: {
        flex: 1,
    },

    cardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },

    cardBlurOverlay: {
    ...Platform.select({
        ios: {
        flex: 1,
        borderRadius: 24,
        overflow: 'hidden',
        },
        android: {
        flex: 1,
        borderRadius: 24,
        overflow: 'hidden',
        },
        web: {
        flex: 1,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'transparent', // disables the weird blur look on desktop
        },
    }),
    },


    // Enhanced floating background elements
    backgroundElement1: {
        position: 'absolute',
        top: '10%',
        right: '-5%',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },

    backgroundElement2: {
        position: 'absolute',
        bottom: '30%',
        left: '-10%',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    
    scrollView: {
        flex: 1,
    },
    
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 15,
        paddingBottom: Platform.OS === 'ios' ? 120 : 100,
    },

    largeScreenContent: {
        paddingHorizontal: 40,
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%',
    },

    // Enhanced Header Styles
    header: {
        paddingBottom: 20,
        marginBottom: 25,
    },

    headerBlur: {
        borderRadius: 25,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },

    headerContent: {
        padding: 25,
    },
    
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    
    headerLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    
    logoContainer: {
        marginRight: 15,
    },
    
    logo: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },

    logoGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    
    logoText: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.neutral.white,
    },
    
    greetingContainer: {
        flex: 1,
    },
    
    greeting: {
        fontWeight: '600',
        color: colors.neutral.white,
        ...Platform.select({
            ios: {
                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
            },
        }),
    },
    
    dateText: {
        fontSize: 14,
        fontWeight: '300',
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 2,
    },
    
    profileButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    
    profileGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    
    profileIcon: {
        fontSize: 20,
    },
    
    subtitle: {
        fontWeight: '300',
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginTop: 10,
    },
    
    // Enhanced Highlight Section
    highlightSection: {
        marginBottom: 30,
    },
    
    highlightCard: {
        borderRadius: 25,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    
    highlightGradient: {
        padding: 30,
    },
    
    highlightTitle: {
        fontWeight: '600',
        color: colors.neutral.white,
        marginBottom: 15,
        textAlign: 'center',
    },
    
    highlightVerse: {
        fontWeight: '400',
        color: colors.neutral.white,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 10,
        fontStyle: 'italic',
    },
    
    highlightReference: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: 20,
    },
    
    highlightButton: {
        alignSelf: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    
    highlightButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.neutral.white,
    },
    
    // Enhanced Features Section
    featuresSection: {
        marginBottom: 16,
        marginTop: 0,
    },
    
    sectionTitle: {
        fontWeight: '600',
        color: colors.neutral.white,
        marginBottom: -20,
        textAlign: 'center',
        ...Platform.select({
            ios: {
                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
            },
        }),
    },
    
    featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 5,
    columnGap: 12,
    },

    
    // Responsive grid layouts
    mediumCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
    gap: 5,
    },

    largeScreenRow: {
        gap: 20,
    },
    
    // Enhanced Feature Card Styles (DevotionsScreen style)
    featureCard: {
        borderRadius: 24,
        marginBottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    
    cardTouchable: {
        flex: 1,
        borderRadius: 24,
        overflow: 'hidden',
    },
    
    cardGradient: {
        flex: 1,
        borderRadius: 24,
        position: 'relative',
    },

    cardContent: {
        padding: 26,
        paddingTop: 28,
        paddingBottom: 28,
        alignItems: 'center',
        justifyContent: 'center',
        },


    cardIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    iconText: {
        color: colors.neutral.white,
        fontWeight: '700',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    // Card Header (like DevotionsScreen)
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },

    categoryContainer: {},

    categoryBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    categoryText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    newBadgeContainer: {
        borderRadius: 12,
    },

    newBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    newBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },

    // Card Body (like DevotionsScreen)
    cardBody: {
        alignItems: 'center',
    },
    
    cardIconContainer: {
        marginBottom: 12,
    },

    cardIconText: {
        textAlign: 'center',
    },
    
    cardTextContent: {
        alignItems: 'center',
    },
    
    cardTitle: {
        fontWeight: '700',
        color: colors.neutral.white,
        textAlign: 'center',
        marginBottom: 8,
        ...Platform.select({
            ios: {
                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
            },
        }),
    },
    
    cardSubtitle: {
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 18,
    },

    // Floating particles (like DevotionsScreen)
    floatingParticle: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },

    floatingParticle2: {
        position: 'absolute',
        top: '60%',
        right: '10%',
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },

    floatingParticle3: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    
    // Enhanced Quick Actions Section
    quickActionsSection: {
        marginBottom: 50,
        paddingHorizontal: 15,
        marginTop: 60,
        
    },
    
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: 20,
        rowGap: 15,
        columnGap: 10,
        },


    largeScreenQuickActions: {
        justifyContent: 'center',
        gap: 30,
    },
    
    quickActionButton: {
        width: 100,
        height: 100,
        borderRadius: 20,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // fallback if BlurView fails
        ...Platform.select({
            ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            },
            android: {
            elevation: 6,
            },
        }),
        },


    largeQuickAction: {
        flex: 0,
        width: 120,
    },
    
    quickActionGradient: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },

    
    quickActionIcon: {
        fontSize: 26,
        marginBottom: 6,
        color: colors.neutral.white,
        },

    
    quickActionText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.neutral.white,
        textAlign: 'center',
    },
    
    bottomSpacing: {
        height: 10,
    },
});

export default HomeScreen;