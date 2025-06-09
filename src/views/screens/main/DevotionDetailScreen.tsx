// src/views/screens/main/DevotionDetailScreen.tsx
//This file is part of The Morning Amen app, a React Native application for daily devotions and spiritual growth.

// Import necessary libraries and components
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
    StatusBar,
    Platform,
    Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { BackIcon, ShareIcon, StarIcon } from '../../components/icons/CustomIcons';
import { SpiritualIcons } from '../../components/icons/SpiritualIcons';



const { width, height } = Dimensions.get('window');

interface DevotionDetailScreenProps {
    route: any;
    navigation: any;
}


// Main component for the Devotion Detail Screen
export const DevotionDetailScreen: React.FC<DevotionDetailScreenProps> = ({ route, navigation }) => {
    const { devotion } = route.params;
    const [isFavorite, setIsFavorite] = useState(devotion.isFavorite);
    const [readingProgress, setReadingProgress] = useState(0);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const iconRotateAnim = useRef(new Animated.Value(0)).current;

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
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();

        // Start icon rotation animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(iconRotateAnim, {
                    toValue: 1,
                    duration: 4000,
                    useNativeDriver: true,
                }),
                Animated.timing(iconRotateAnim, {
                    toValue: 0,
                    duration: 4000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    // Handle scroll event to update reading progress
    const handleScroll = (event: any) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        const progress = contentOffset.y / (contentSize.height - layoutMeasurement.height);
        const clampedProgress = Math.min(Math.max(progress, 0), 1);
        setReadingProgress(clampedProgress);
        
        Animated.timing(progressAnim, {
            toValue: clampedProgress,
            duration: 100,
            useNativeDriver: false,
        }).start();
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        // Here you would typically save to AsyncStorage or API
    };

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: `"${devotion.verseText}" - ${devotion.verse}\n\nRead more in The Morning Amen app!`,
                title: devotion.title,
            });
        } catch (error) {
            console.error('Error sharing:', error);
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
                {/* Header with Progress Bar */}
                <Animated.View
                    style={[
                        styles.header,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <BlurView intensity={20} style={styles.headerBlur}>
                        <View style={styles.headerContent}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => navigation.goBack()}
                            >
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                                    style={styles.backButtonGradient}
                                >
                                    <BackIcon size={20} color="#FFFFFF" />
                                </LinearGradient>
                            </TouchableOpacity>

                            <View style={styles.headerActions}>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={handleShare}
                                >
                                    <LinearGradient
                                        colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                                        style={styles.actionButtonGradient}
                                    >
                                        <ShareIcon size={18} color="#FFFFFF" />
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={toggleFavorite}
                                >
                                    <LinearGradient
                                        colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                                        style={styles.actionButtonGradient}
                                    >
                                        <StarIcon 
                                            size={18} 
                                            color={isFavorite ? '#FFD700' : '#FFFFFF'} 
                                            filled={isFavorite} 
                                        />
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Reading Progress Bar */}
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                                <Animated.View
                                    style={[
                                        styles.progressFill,
                                        {
                                            width: progressAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['0%', '100%'],
                                            }),
                                        },
                                    ]}
                                />
                            </View>
                            <Text style={styles.progressText}>
                                {Math.round(readingProgress * 100)}%
                            </Text>
                        </View>
                    </BlurView>
                </Animated.View>

                {/* Content */}
                <ScrollView
                    style={[styles.scrollView, { flex: 1 }]} 
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={true} // Changed to true for web
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    nestedScrollEnabled={true} // Added this for web compatibility
                >
                    
                    {/* Hero Section */}
                    <Animated.View
                        style={[
                            styles.heroSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: scaleAnim }],
                            },
                        ]}
                    >
                        <BlurView intensity={15} style={styles.heroBlur}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                                style={styles.heroGradient}
                            >
                                <View style={styles.heroIconContainer}>
                                    <Animated.View
                                        style={[
                                            styles.heroIconWrapper,
                                            {
                                                transform: [{ rotate: iconRotateAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: ['0deg', '360deg'],
                                                })}],
                                            },
                                        ]}
                                    >
                                        {(() => {
                                            const CustomIcon = SpiritualIcons[devotion.category as keyof typeof SpiritualIcons] || SpiritualIcons.Joy;
                                            return <CustomIcon size={64} gradient={true} />;
                                        })()}
                                    </Animated.View>
                                </View>
                                <Text style={styles.heroCategory}>{devotion.category}</Text>
                                <Text style={styles.heroTitle}>{devotion.title}</Text>
                                
                                <View style={styles.heroMeta}>
                                    <Text style={styles.heroAuthor}>by {devotion.author}</Text>
                                    <Text style={styles.heroDivider}>•</Text>
                                    <Text style={styles.heroDate}>
                                        {new Date(devotion.date).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </Text>
                                    <Text style={styles.heroDivider}>•</Text>
                                    <Text style={styles.heroReadTime}>{devotion.readTime}</Text>
                                </View>
                            </LinearGradient>
                        </BlurView>
                    </Animated.View>

                    {/* Featured Verse */}
                    <Animated.View
                        style={[
                            styles.verseSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <BlurView intensity={10} style={styles.verseBlur}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                                style={styles.verseGradient}
                            >
                                <Text style={styles.verseLabel}>Today's Verse</Text>
                                <Text style={styles.verseText}>"{devotion.verseText}"</Text>
                                <Text style={styles.verseReference}>— {devotion.verse}</Text>
                            </LinearGradient>
                        </BlurView>
                    </Animated.View>

                    {/* Main Content */}
                    <Animated.View
                        style={[
                            styles.contentSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <BlurView intensity={10} style={styles.contentBlur}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                                style={styles.contentGradient}
                            >
                                <Text style={styles.contentText}>{devotion.content}</Text>
                            </LinearGradient>
                        </BlurView>
                    </Animated.View>

                    {/* Reflection Questions */}
                    <Animated.View
                        style={[
                            styles.reflectionSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <BlurView intensity={10} style={styles.reflectionBlur}>
                            <LinearGradient
                                colors={['rgba(255,235,59,0.2)', 'rgba(255,152,0,0.1)']}
                                style={styles.reflectionGradient}
                            >
                                <View style={styles.reflectionTitleContainer}>
                                    <View style={styles.reflectionIconWrapper}>
                                        {(() => {
                                            const ReflectIcon = SpiritualIcons.Purpose; // Using Purpose icon (compass)
                                            return <ReflectIcon size={20} gradient={true} />;
                                        })()}
                                    </View>
                                    <Text style={styles.reflectionTitle}>Reflect & Apply</Text>
                                </View>
                                <View style={styles.questionContainer}>
                                    <Text style={styles.questionText}>
                                        • How can you apply this message to your current situation?
                                    </Text>
                                    <Text style={styles.questionText}>
                                        • What is God speaking to your heart through this devotion?
                                    </Text>
                                    <Text style={styles.questionText}>
                                        • How can you share this encouragement with others today?
                                    </Text>
                                </View>
                            </LinearGradient>
                        </BlurView>
                    </Animated.View>

                    {/* Prayer Section */}
                    <Animated.View
                        style={[
                            styles.prayerSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <BlurView intensity={10} style={styles.prayerBlur}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                                style={styles.prayerGradient}
                            >
                                <View style={styles.prayerTitleContainer}>
                                    <View style={styles.prayerIconWrapper}>
                                        {(() => {
                                            const PrayIcon = SpiritualIcons.Peace; // Using Peace icon (praying hands)
                                            return <PrayIcon size={20} gradient={true} />;
                                        })()}
                                    </View>
                                    <Text style={styles.prayerTitle}>Prayer</Text>
                                </View>
                                <Text style={styles.prayerText}>
                                    "Heavenly Father, thank You for Your constant presence in my life. 
                                    Help me to trust in Your perfect timing and plan. Give me the 
                                    strength to walk in faith, even when I cannot see the path ahead. 
                                    May Your peace fill my heart and Your love guide my steps. In Jesus' name, Amen."
                                </Text>
                            </LinearGradient>
                        </BlurView>
                    </Animated.View>

                    {/* Action Buttons */}
                    <Animated.View
                        style={[
                            styles.actionSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <TouchableOpacity style={styles.primaryActionButton}>
                            <LinearGradient
                                colors={['#ffeb3b', '#ff9800', '#ff6b35']}
                                style={styles.primaryActionGradient}
                            >
                                <Text style={styles.primaryActionText}>Add to Journal</Text>
                                <Text style={styles.primaryActionIcon}>📝</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.secondaryActions}>
                            <TouchableOpacity style={styles.secondaryActionButton}>
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                                    style={styles.secondaryActionGradient}
                                >
                                    <Text style={styles.secondaryActionText}>Share Verse</Text>
                                    <Text style={styles.secondaryActionIcon}>📱</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.secondaryActionButton}>
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                                    style={styles.secondaryActionGradient}
                                >
                                    <Text style={styles.secondaryActionText}>Set Reminder</Text>
                                    <Text style={styles.secondaryActionIcon}>⏰</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    <View style={styles.bottomSpacing} />
                </ScrollView>

                {/* Floating particles */}
                <View style={styles.backgroundParticles}>
                    {[...Array(12)].map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.backgroundParticle,
                                {
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    opacity: Math.random() * 0.3 + 0.1,
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
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
    },

    headerBlur: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },

    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
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

    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },

    actionButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },

    actionButtonGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    actionIcon: {
        fontSize: 18,
        color: '#FFFFFF',
    },

    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    progressBar: {
        flex: 1,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 2,
        overflow: 'hidden',
    },

    progressFill: {
        height: '100%',
        backgroundColor: '#ffeb3b',
        borderRadius: 2,
    },

    progressText: {
        fontSize: 12,
        fontFamily: 'Outfit_500Medium',
        color: 'rgba(255, 255, 255, 0.8)',
        minWidth: 35,
    },

    scrollView: {
        flex: 1,
    },

    contentContainer: {
        paddingTop: Platform.OS === 'ios' ? 140 : 120,
        paddingHorizontal: 20,
    },

    heroSection: {
        marginBottom: 24,
        borderRadius: 24,
    },

    heroBlur: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    heroGradient: {
        padding: 32,
        alignItems: 'center',
    },

    heroIconContainer: {
        marginBottom: 16,
        alignItems: 'center',
    },

    heroIconWrapper: {
        padding: 8,
    },

    heroCategory: {
        fontSize: 14,
        fontFamily: 'Outfit_600SemiBold',
        color: 'rgba(255, 255, 255, 0.8)',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
    },

    heroTitle: {
        fontSize: 28,
        fontFamily: 'Outfit_700Bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        lineHeight: 36,
    },

    heroMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },

    heroAuthor: {
        fontSize: 14,
        fontFamily: 'Outfit_500Medium',
        color: 'rgba(255, 255, 255, 0.9)',
    },

    heroDate: {
        fontSize: 14,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255, 255, 255, 0.8)',
    },

    heroReadTime: {
        fontSize: 14,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255, 255, 255, 0.8)',
    },

    heroDivider: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        marginHorizontal: 8,
    },

    verseSection: {
        marginBottom: 24,
        borderRadius: 20,
    },

    verseBlur: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },

    verseGradient: {
        padding: 24,
        alignItems: 'center',
    },

    verseLabel: {
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    verseText: {
        fontSize: 20,
        fontFamily: 'LibreBaskerville_400Regular_Italic',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 32,
        marginBottom: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    verseReference: {
        fontSize: 16,
        fontFamily: 'LibreBaskerville_700Bold',
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
    },

    contentSection: {
        marginBottom: 24,
        borderRadius: 20,
    },

    contentBlur: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },

    contentGradient: {
        padding: 24,
    },

    contentText: {
        fontSize: 18,
        fontFamily: 'Outfit_400Regular',
        color: '#FFFFFF',
        lineHeight: 30,
        textAlign: 'left',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
    },

    reflectionSection: {
        marginBottom: 24,
        borderRadius: 20,
    },

    reflectionBlur: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 235, 59, 0.3)',
    },

    reflectionGradient: {
        padding: 24,
    },

    questionContainer: {
        gap: 12,
    },

    questionText: {
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        color: '#FFFFFF',
        lineHeight: 24,
        paddingLeft: 8,
    },

    prayerSection: {
        marginBottom: 24,
        borderRadius: 20,
    },

    prayerBlur: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },

    prayerGradient: {
        padding: 24,
    },

    prayerText: {
        fontSize: 17,
        fontFamily: 'LibreBaskerville_400Regular_Italic',
        color: '#FFFFFF',
        lineHeight: 28,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
    },

    actionSection: {
        marginBottom: 24,
    },

    primaryActionButton: {
        borderRadius: 30,
        marginBottom: 16,
        shadowColor: '#ffeb3b',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },

    primaryActionGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 30,
        gap: 12,
    },

    primaryActionText: {
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    primaryActionIcon: {
        fontSize: 18,
    },

    secondaryActions: {
        flexDirection: 'row',
        gap: 12,
    },

    secondaryActionButton: {
        flex: 1,
        borderRadius: 20,
    },

    secondaryActionGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        gap: 8,
    },

    secondaryActionText: {
        fontSize: 14,
        fontFamily: 'Outfit_500Medium',
        color: '#FFFFFF',
    },

    secondaryActionIcon: {
        fontSize: 16,
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
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },

    bottomSpacing: {
        height: 100,
    },

    reflectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 12,
},

reflectionIconWrapper: {
    padding: 4,
},

reflectionTitle: {
    fontSize: 20,
    fontFamily: 'Outfit_700Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
},

prayerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 12,
},

prayerIconWrapper: {
    padding: 4,
},

prayerTitle: {
    fontSize: 20,
    fontFamily: 'Outfit_700Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
},

});