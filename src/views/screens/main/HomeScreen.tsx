// src/views/screens/main/HomeScreen.tsx
// HomeScreen component serves as the main landing page for users after logging in.
// It displays a personalized greeting, today's verse, and various features like devotions, prayer wall, video gallery, etc.
// The screen is designed to be responsive, adapting to different screen sizes and orientations.
// The screen features animations, a category filter, and video playback functionality.

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
import {
    Alert,
} from 'react-native';

// Define the User interface
interface User {
    firstName: string;
    // Add other user properties as needed
}

interface HomeScreenProps {
    navigation: any;
    onLogout?: () => void;
}

// COMPONENT: HomeScreen
export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, onLogout }) => {
    const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
    const isSmallScreen = Dimensions.get('window').width < 400;
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

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
    ]).current;

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenDimensions(window);
        });
        return () => subscription?.remove();
    }, []);

    useEffect(() => {
        loadUserData();
        startAnimations();
        
        // Update time every minute
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timeInterval);
    }, []);

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

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // Simulate refresh
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
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

    // Handle card press navigation with animations
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
        // Navigate to the correct screens
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
                // You can create this screen later or navigate to VerseOfDay for now
                navigation.navigate('VerseOfDay');
                break;
            case 'Profile':
                navigation.navigate('ProfileStack');
                break;
            case 'About':
                navigation.navigate('About');
                break;
            case 'Meditation':
            case 'Favorites':
            case 'Settings':
                // These will be created in future modules
                console.log(`${screen} - Coming in future updates!`);
                Alert.alert('Coming Soon! 🚀', `${screen} feature will be available in future updates.`);
                break;
            default:
                console.log(`Navigation to ${screen} - Screen coming soon!`);
                break;
        }
    });
};

const FeatureCard = ({ 
    title, 
    subtitle, 
    icon, 
    colors, 
    onPress, 
    animValue,
    size = 'large' 
}: {
    title: string;
    subtitle: string;
    icon: string;
    colors: [string, string, ...string[]];
    onPress: () => void;
    animValue: Animated.Value;
    size?: 'large' | 'medium' | 'small';
}) => {
    return (
        <Animated.View
            style={[
                styles.featureCard,
                size === 'large' && styles.largeCard,
                size === 'medium' && styles.mediumCard,
                {
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
                    colors={colors}
                    style={styles.cardGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.cardContent}>
                        {/* Icon Container */}
                        <View style={styles.cardIcon}>
                            <Text style={[styles.iconText, { fontSize: size === 'large' ? 32 : 24 }]}>
                                {icon}
                            </Text>
                        </View>
                        
                        {/* Text Container - SEPARATE from icon */}
                        <View style={styles.cardTextContainer}>
                            <Text style={[styles.cardTitle, { fontSize: size === 'large' ? 18 : 16 }]}>
                                {title}
                            </Text>
                            <Text style={[styles.cardSubtitle, { fontSize: size === 'large' ? 14 : 12 }]}>
                                {subtitle}
                            </Text>
                        </View>
                    </View>
                    
                    {/* Floating particles in cards */}
                    <View style={styles.cardParticles}>
                        {[...Array(3)].map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.cardParticle,
                                    {
                                        top: `${20 + Math.random() * 60}%`,
                                        right: `${10 + Math.random() * 30}%`,
                                        opacity: 0.3,
                                    },
                                ]}
                            />
                        ))}
                    </View>
                </LinearGradient>
            </Pressable>
        </Animated.View>
    );
};

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#ff6b35" />
            <LinearGradient
                colors={['#ff9a56', '#ff6b35', '#f7931e']}
                style={styles.gradientContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <ScrollView
                    style={[styles.scrollView, { flex: 1 }]} // Ensure flex: 1
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={true} // true for web
                    bounces={true}
                    nestedScrollEnabled={true} // web compatibility
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#FFFFFF"
                            colors={['#ff6b35']}
                        />
                    }
                >
                    {/* Header Section */}
                    <Animated.View
                        style={[
                            styles.header,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <View style={styles.headerTop}>
                            <View style={styles.headerLeft}>
                                <View style={styles.logoContainer}>
                                    <LinearGradient
                                        colors={['#ffeb3b', '#ff6b35', '#f7931e']}
                                        style={styles.logo}
                                    >
                                        <Text style={styles.logoText}>TMA</Text>
                                    </LinearGradient>
                                </View>
                                <View style={styles.greetingContainer}>
                                    <Text style={styles.greeting}>
                                        {getGreeting()}{currentUser ? `, ${currentUser.firstName}` : ''}!
                                    </Text>
                                    <Text style={styles.dateText}>{getDateString()}</Text>
                                </View>
                            </View>
                            
                            <Pressable
                                style={styles.profileButton}
                                onPress={() => navigation.navigate('Profile')}
                            >
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                                    style={styles.profileGradient}
                                >
                                    <Text style={styles.profileIcon}>👤</Text>
                                </LinearGradient>
                            </Pressable>
                        </View>

                        <Text style={styles.subtitle}>
                            Start your day with faith, hope, and purpose
                        </Text>
                    </Animated.View>

                    {/* Daily Highlight Card */}
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
                                <Text style={styles.highlightTitle}>✨ Today's Blessing</Text>
                                <Text style={styles.highlightVerse}>
                                    "This is the day that the Lord has made; let us rejoice and be glad in it."
                                </Text>
                                <Text style={styles.highlightReference}>- Psalm 118:24</Text>
                                
                                <Pressable
                                    style={styles.highlightButton}
                                    onPress={() => handleCardPress('VerseOfDay')}
                                >
                                    <Text style={styles.highlightButtonText}>Read More →</Text>
                                </Pressable>
                            </LinearGradient>
                        </BlurView>
                    </Animated.View>

                    {/* Main Features Grid */}
                    <Animated.View
                        style={[
                            styles.featuresSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <Text style={styles.sectionTitle}>Explore Your Faith Journey</Text>
                        
                        {/* Features Grid Layout */}
                        <View style={styles.featuresGrid}>
                            <FeatureCard
                                title="Daily Devotions"
                                subtitle="Inspiring stories and reflections"
                                icon="📖"
                                colors={['#ff6b35', '#ff8c42', '#ffa726']}
                                onPress={() => handleCardPress('Devotions')}
                                animValue={cardAnims[0]}
                                size="large"
                            />

                            <View style={styles.mediumCardsRow}>
                                <FeatureCard
                                    title="Prayer Wall"
                                    subtitle="Share & pray together"
                                    icon="🙏"
                                    colors={['#ff7043', '#ff5722', '#f4511e']}
                                    onPress={() => handleCardPress('PrayerWall')}
                                    animValue={cardAnims[1]}
                                    size="medium"
                                />
                                
                                <FeatureCard
                                    title="Video Messages"
                                    subtitle="Inspirational content"
                                    icon="🎥"
                                    colors={['#ff9800', '#f57c00', '#ef6c00']}
                                    onPress={() => handleCardPress('VideoGallery')}
                                    animValue={cardAnims[2]}
                                    size="medium"
                                />
                            </View>

                            <FeatureCard
                                title="Daily Affirmations"
                                subtitle="Strengthen your faith daily"
                                icon="💝"
                                colors={['#ffb74d', '#ffa726', '#ff9800']}
                                onPress={() => handleCardPress('Affirmations')}
                                animValue={cardAnims[3]}
                                size="large"
                            />

                            <View style={styles.mediumCardsRow}>
                                <FeatureCard
                                    title="Meditation"
                                    subtitle="Find inner peace"
                                    icon="🧘‍♀️"
                                    colors={['#ffcc02', '#ffb300', '#ff8f00']}
                                    onPress={() => handleCardPress('Meditation')}
                                    animValue={cardAnims[4]}
                                    size="medium"
                                />
                                
                                <FeatureCard
                                    title="My Favorites"
                                    subtitle="Saved content"
                                    icon="⭐"
                                    colors={['#ffd54f', '#ffca28', '#ffc107']}
                                    onPress={() => handleCardPress('Favorites')}
                                    animValue={cardAnims[5]}
                                    size="medium"
                                />
                            </View>
                        </View>
                    </Animated.View>

                    {/* Quick Actions */}
                    <Animated.View
                        style={[
                            styles.quickActionsSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                        <View style={styles.quickActionsGrid}>
                            <Pressable
                                style={styles.quickActionButton}
                                onPress={() => handleCardPress('PrayerWall')}
                            >
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                                    style={styles.quickActionGradient}
                                >
                                    <Text style={styles.quickActionIcon}>🙏</Text>
                                    <Text style={styles.quickActionText}>Add Prayer</Text>
                                </LinearGradient>
                            </Pressable>

                            <Pressable
                                style={styles.quickActionButton}
                                onPress={() => handleCardPress('About')}
                            >
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                                    style={styles.quickActionGradient}
                                >
                                    <Text style={styles.quickActionIcon}>ℹ️</Text>
                                    <Text style={styles.quickActionText}>About</Text>
                                </LinearGradient>
                            </Pressable>

                            <Pressable
                                style={styles.quickActionButton}
                                onPress={() => handleCardPress('Settings')}
                            >
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                                    style={styles.quickActionGradient}
                                >
                                    <Text style={styles.quickActionIcon}>⚙️</Text>
                                    <Text style={styles.quickActionText}>Settings</Text>
                                </LinearGradient>
                            </Pressable>
                        </View>
                    </Animated.View>

                    {/* Bottom Spacing for tab bar */}
                    <View style={styles.bottomSpacing} />
                </ScrollView>

                {/* Floating Background Particles */}
                <View style={styles.backgroundParticles}>
                    {[...Array(8)].map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.backgroundParticle,
                                {
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    opacity: 0.1,
                                },
                            ]}
                        />
                    ))}
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ff9a56',
    },
    
    gradientContainer: {
        flex: 1,
    },
    
    scrollView: {
        flex: 1,
    },
    
    scrollContent: {
        flexGrow: 1,
        paddingBottom: Platform.OS === 'ios' ? 120 : 100, // Extra space for tab bar
    },

    header: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 20 : 40,
        paddingBottom: 20,
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
        width: 55,
        height: 55,
        borderRadius: 27.5,
        justifyContent: 'center',
        alignItems: 'center',
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
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        ...Platform.select({
            ios: {
                textShadowColor: 'rgba(0, 0, 0, 0.5)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
            },
        }),
    },
    
    greetingContainer: {
        flex: 1,
    },
    
    greeting: {
        fontSize: 24,
        fontWeight: '600',
        color: '#FFFFFF',
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
        fontSize: 16,
        fontWeight: '300',
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginTop: 10,
    },
    
    highlightSection: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    
    highlightCard: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    
    highlightGradient: {
        padding: 25,
    },
    
    highlightTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 15,
        textAlign: 'center',
    },
    
    highlightVerse: {
        fontSize: 16,
        fontWeight: '400',
        color: '#FFFFFF',
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
        color: '#FFFFFF',
    },
    
    featuresSection: {
        paddingHorizontal: 20, // Use fixed smaller padding for mobile
        marginBottom: 30,
    },
    
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 20,
        ...Platform.select({
            ios: {
                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
            },
        }),
    },
    
    featuresGrid: {
        gap: 20,
        paddingHorizontal: Dimensions.get('window').width < 400 ? 0 : 0,
    },
    
        // Proper medium cards row layout
        mediumCardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
        width: '100%',
        flexWrap: 'wrap',
    },
    
    featureCard: {
        borderRadius: 20,
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
    
    largeCard: {
        width: '100%',
        height: 120,
    },
    
    mediumCard: {
    // Change from fixed width to flexible
    width: Dimensions.get('window').width < 400 ? '100%' : '48%',
    height: 95,
    // Add minWidth to prevent too narrow cards
    minWidth: Dimensions.get('window').width < 400 ? '100%' : 0,
    marginBottom: Dimensions.get('window').width < 400 ? 10 : 0,
    },
    
    cardTouchable: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
    },
    
    cardGradient: {
        flex: 1,
        borderRadius: 20,
        padding: 18,
        position: 'relative',
    },
    
    cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: Dimensions.get('window').width < 400 ? 12 : 18,
    },
    
    cardIcon: {
        marginRight: 15,
    },
    
    iconText: {
        fontSize: 32,
    },
    
    cardTextContainer: {
        flex: 1,
        minWidth: 0, // Prevents text overflow
        paddingRight: 5,
    },
    
    cardTitle: {
        fontSize: Dimensions.get('window').width < 400 ? 16 : 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 5,
        ...Platform.select({
            ios: {
                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
            },
        }),
    },
    
    cardSubtitle: {
        fontSize: Dimensions.get('window').width < 400 ? 12 : 14,
        fontWeight: '300',
        color: 'rgba(255, 255, 255, 0.9)',
    },
    
    cardParticles: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
    },
    
    cardParticle: {
        position: 'absolute',
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    
    quickActionsSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    
    quickActionsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    
    quickActionButton: {
        flex: 1,
        borderRadius: 15,
    },
    
    quickActionGradient: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    
    quickActionIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    
    quickActionText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#FFFFFF',
        textAlign: 'center',
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
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    
    bottomSpacing: {
        height: 100,
    },
});