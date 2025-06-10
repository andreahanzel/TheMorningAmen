// src/views/screens/community/AboutScreen.tsx

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

// About screen with ministry story and vision
// This screen shares the heart behind The Morning Amen app

import React, { useRef, useEffect } from 'react';
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
    Linking,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SpiritualIcons } from '../../components/icons/SpiritualIcons';

const { width, height } = Dimensions.get('window');

interface AboutScreenProps {
    navigation: any;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const cardAnims = useRef([
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
    ]).current;

    // Spiritual icon animations
    const iconRotateAnims = useRef([
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
    ]).current;

    const iconPulseAnims = useRef([
        new Animated.Value(1),
        new Animated.Value(1),
        new Animated.Value(1),
        new Animated.Value(1),
    ]).current;

    useEffect(() => {
        startAnimations();
        startSpiritualIconAnimations();
    }, []);

    const startAnimations = () => {
        // Main container animations
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
            Animated.spring(logoScale, {
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
                duration: 500,
                delay: index * 150,
                useNativeDriver: true,
            })
        );

        Animated.stagger(100, cardAnimations).start();
    };

    const startSpiritualIconAnimations = () => {
        iconRotateAnims.forEach((anim, index) => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 4000 + (index * 300),
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: 4000 + (index * 300),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        });

        iconPulseAnims.forEach((anim, index) => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(anim, {
                        toValue: 1.15,
                        duration: 2500 + (index * 200),
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 2500 + (index * 200),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        });
    };

    const openLink = async (url: string, name: string) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Error', `Cannot open ${name}`);
            }
        } catch (error) {
            Alert.alert('Error', `Failed to open ${name}`);
        }
    };

    const sendEmail = () => {
        openLink('mailto:info@themorningamen.com', 'Email');
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

                    <Text style={styles.headerTitle}>About The Morning Amen</Text>
                    
                    <View style={styles.headerSpacer} />
                </Animated.View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={true}
                >
                    {/* Logo Section */}
                    <Animated.View
                        style={[
                            styles.logoSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: logoScale }],
                            },
                        ]}
                    >
                        <View style={styles.logoContainer}>
                            <LinearGradient
                                colors={['#ffeb3b', '#ff6b35', '#f7931e']}
                                style={styles.logo}
                            >
                                <Text style={styles.logoText}>TMA</Text>
                            </LinearGradient>
                        </View>
                        <Text style={styles.appName}>The Morning Amen</Text>
                        <Text style={styles.tagline}>"Start with Faith, Walk with Purpose, Share with Love"</Text>
                    </Animated.View>

                    {/* Mission Card */}
                    <Animated.View
                        style={[
                            styles.card,
                            {
                                opacity: cardAnims[0],
                                transform: [
                                    {
                                        translateY: cardAnims[0].interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [50, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <BlurView intensity={20} style={styles.cardBlur}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
                                style={styles.cardGradient}
                            >
                                <Animated.View
                                    style={[
                                        styles.cardIconContainer,
                                        {
                                            transform: [
                                                {
                                                    rotate: iconRotateAnims[0].interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: ['0deg', '360deg'],
                                                    }),
                                                },
                                                { scale: iconPulseAnims[0] },
                                            ],
                                        },
                                    ]}
                                >
                                    <SpiritualIcons.Purpose size={48} gradient={true} color="#FFFFFF" />
                                </Animated.View>
                                <Text style={styles.cardTitle}>Our Mission</Text>
                                <Text style={styles.cardText}>
                                    To inspire and uplift people in their daily spiritual journey through meaningful 
                                    devotions, encouraging videos, and a supportive prayer community. We believe 
                                    every morning is a new opportunity to connect with God and grow in faith.
                                </Text>
                            </LinearGradient>
                        </BlurView>
                    </Animated.View>

                    {/* Story Card */}
                    <Animated.View
                        style={[
                            styles.card,
                            {
                                opacity: cardAnims[1],
                                transform: [
                                    {
                                        translateY: cardAnims[1].interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [50, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <BlurView intensity={20} style={styles.cardBlur}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
                                style={styles.cardGradient}
                            >
                                <Animated.View
                                    style={[
                                        styles.cardIconContainer,
                                        {
                                            transform: [
                                                {
                                                    rotate: iconRotateAnims[1].interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: ['0deg', '360deg'],
                                                    }),
                                                },
                                                { scale: iconPulseAnims[1] },
                                            ],
                                        },
                                    ]}
                                >
                                    <SpiritualIcons.Love size={48} gradient={true} color="#FFFFFF" />
                                </Animated.View>
                                <Text style={styles.cardTitle}>Andrea's Heart</Text>
                                <Text style={styles.cardText}>
                                    Hi! I'm Andrea, and The Morning Amen was born from my personal journey of 
                                    seeking daily inspiration and connection with God. As a student and someone 
                                    passionate about technology and faith, I wanted to create a space where 
                                    people could start their mornings with purpose and end their days with gratitude.
                                </Text>
                                <Text style={styles.cardText}>
                                    This app represents my heart's desire to share the hope, peace, and joy 
                                    I've found in my relationship with Christ. Every devotion, prayer, and 
                                    feature is crafted with love and prayer.
                                </Text>
                            </LinearGradient>
                        </BlurView>
                    </Animated.View>

                    {/* Features Card */}
                    <Animated.View
                        style={[
                            styles.card,
                            {
                                opacity: cardAnims[2],
                                transform: [
                                    {
                                        translateY: cardAnims[2].interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [50, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <BlurView intensity={20} style={styles.cardBlur}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
                                style={styles.cardGradient}
                            >
                                <Animated.View
                                    style={[
                                        styles.cardIconContainer,
                                        {
                                            transform: [
                                                {
                                                    rotate: iconRotateAnims[2].interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: ['0deg', '360deg'],
                                                    }),
                                                },
                                                { scale: iconPulseAnims[2] },
                                            ],
                                        },
                                    ]}
                                >
                                    <SpiritualIcons.Joy size={48} gradient={true} color="#FFFFFF" />
                                </Animated.View>
                                <Text style={styles.cardTitle}>What Makes Us Special</Text>
                                <View style={styles.featuresList}>
                                    <View style={styles.featureItem}>
                                        <View style={styles.featureIconContainer}>
                                            <SpiritualIcons.Faith size={20} gradient={true} color="#FFFFFF" />
                                        </View>
                                        <Text style={styles.featureText}>Daily devotions written with heart and scripture</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <View style={styles.featureIconContainer}>
                                            <SpiritualIcons.Joy size={20} gradient={true} color="#FFFFFF" />
                                        </View>
                                        <Text style={styles.featureText}>Inspirational video messages for encouragement</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <View style={styles.featureIconContainer}>
                                            <SpiritualIcons.Peace size={20} gradient={true} color="#FFFFFF" />
                                        </View>
                                        <Text style={styles.featureText}>Prayer wall for community support and unity</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <View style={styles.featureIconContainer}>
                                            <SpiritualIcons.Renewal size={20} gradient={true} color="#FFFFFF" />
                                        </View>
                                        <Text style={styles.featureText}>Daily verses with reflection and application</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <View style={styles.featureIconContainer}>
                                            <SpiritualIcons.Gratitude size={20} gradient={true} color="#FFFFFF" />
                                        </View>
                                        <Text style={styles.featureText}>Positive affirmations based on God's truth</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </BlurView>
                    </Animated.View>

                    {/* Future Vision Card */}
                    <Animated.View
                        style={[
                            styles.card,
                            {
                                opacity: cardAnims[3],
                                transform: [
                                    {
                                        translateY: cardAnims[3].interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [50, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <BlurView intensity={20} style={styles.cardBlur}>
                            <LinearGradient
                                colors={['rgba(255,235,59,0.3)', 'rgba(255,152,0,0.2)']}
                                style={styles.cardGradient}
                            >
                                <Animated.View
                                    style={[
                                        styles.cardIconContainer,
                                        {
                                            transform: [
                                                {
                                                    rotate: iconRotateAnims[3].interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: ['0deg', '360deg'],
                                                    }),
                                                },
                                                { scale: iconPulseAnims[3] },
                                            ],
                                        },
                                    ]}
                                >
                                    <SpiritualIcons.Hope size={48} gradient={true} color="#FFFFFF" />
                                </Animated.View>
                                <Text style={styles.cardTitle}>Coming Soon</Text>
                                <Text style={styles.cardText}>
                                    We're just getting started! Future updates will include:
                                </Text>
                                <View style={styles.comingSoonList}>
                                <View style={styles.comingSoonItem}>
                                    <View style={styles.comingSoonIconContainer}>
                                        <SpiritualIcons.Faith size={16} gradient={true} color="#FFFFFF" />
                                    </View>
                                    <Text style={styles.comingSoonText}>Digital bookstore with inspiring reads</Text>
                                </View>
                                <View style={styles.comingSoonItem}>
                                    <View style={styles.comingSoonIconContainer}>
                                        <SpiritualIcons.Gratitude size={16} gradient={true} color="#FFFFFF" />
                                    </View>
                                    <Text style={styles.comingSoonText}>Charity platform to give back</Text>
                                </View>
                                <View style={styles.comingSoonItem}>
                                    <View style={styles.comingSoonIconContainer}>
                                        <SpiritualIcons.Love size={16} gradient={true} color="#FFFFFF" />
                                    </View>
                                    <Text style={styles.comingSoonText}>Community groups and discussions</Text>
                                </View>
                                <View style={styles.comingSoonItem}>
                                    <View style={styles.comingSoonIconContainer}>
                                        <SpiritualIcons.Strength size={16} gradient={true} color="#FFFFFF" />
                                    </View>
                                    <Text style={styles.comingSoonText}>Personal spiritual growth tracking</Text>
                                </View>
                                <View style={styles.comingSoonItem}>
                                    <View style={styles.comingSoonIconContainer}>
                                        <SpiritualIcons.Hope size={16} gradient={true} color="#FFFFFF" />
                                    </View>
                                    <Text style={styles.comingSoonText}>Smart prayer reminders</Text>
                                </View>
                            </View>
                            </LinearGradient>
                        </BlurView>
                    </Animated.View>

                    {/* Contact Section */}
                    <Animated.View
                        style={[
                            styles.contactSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <Text style={styles.contactTitle}>Let's Connect</Text>
                        <Text style={styles.contactText}>
                            Have questions, prayer requests, or just want to share how the app has 
                            blessed you? I'd love to hear from you!
                        </Text>

                        <View style={styles.contactButtons}>
                            <TouchableOpacity
                                style={styles.contactButton}
                                onPress={sendEmail}
                            >
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)']}
                                    style={styles.contactButtonGradient}
                                >
                                    <View style={styles.contactIconContainer}>
                                        <SpiritualIcons.Love size={18} gradient={true} color="#FFFFFF" />
                                    </View>
                                    <Text style={styles.contactButtonText}>Email Us</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.contactButton}
                                onPress={() => openLink('https://instagram.com/', 'Instagram')}
                            >
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)']}
                                    style={styles.contactButtonGradient}
                                >
                                    <View style={styles.contactIconContainer}>
                                        <SpiritualIcons.Hope size={18} gradient={true} color="#FFFFFF" />
                                    </View>
                                    <Text style={styles.contactButtonText}>Follow Us</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Footer */}
                    <Animated.View
                        style={[
                            styles.footer,
                            {
                                opacity: fadeAnim,
                            },
                        ]}
                    >
                        <View style={styles.footerHeartContainer}>
                            <Text style={styles.footerText}>Made with </Text>
                            <SpiritualIcons.Love size={14} gradient={true} color="#FFFFFF" />
                            <Text style={styles.footerText}> and lots of prayer</Text>
                        </View>
                        <Text style={styles.footerText}>
                            Version 1.0.0 • Module 2 Project
                        </Text>
                        <Text style={styles.footerText}>
                            © 2025 Andrea Toreki • All rights reserved
                        </Text>
                    </Animated.View>

                    <View style={styles.bottomSpacing} />
                </ScrollView>

                {/* Background particles */}
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

    headerTitle: {
        fontSize: 18,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    headerSpacer: {
        width: 44,
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 20,
    },

    logoSection: {
        alignItems: 'center',
        marginBottom: 40,
    },

    logoContainer: {
        marginBottom: 20,
    },

    logo: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 12,
    },

    logoText: {
        fontSize: 28,
        fontFamily: 'Outfit_900Black',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    appName: {
        fontSize: 32,
        fontFamily: 'Outfit_700Bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    tagline: {
        fontSize: 16,
        fontFamily: 'LibreBaskerville_400Regular_Italic',
        color: 'rgba(255, 255, 255, 0.95)',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },

    card: {
        marginBottom: 24,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },

    cardBlur: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    cardGradient: {
        padding: 24,
        alignItems: 'center',
    },

    cardIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        width: 64,
        height: 64,
    },

    cardTitle: {
        fontSize: 22,
        fontFamily: 'Outfit_700Bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    cardText: {
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255, 255, 255, 0.95)',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 12,
    },

    featuresList: {
        alignSelf: 'stretch',
        marginTop: 8,
    },

    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 8,
    },

    featureIconContainer: {
        width: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    featureText: {
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255, 255, 255, 0.95)',
        flex: 1,
        lineHeight: 24,
    },

    comingSoonList: {
        alignSelf: 'stretch',
        marginTop: 12,
    },

    comingSoonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 8,
    },

    contactSection: {
        alignItems: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
    },

    contactTitle: {
        fontSize: 24,
        fontFamily: 'Outfit_700Bold',
        color: '#FFFFFF',
        marginBottom: 16,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    contactText: {
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },

    contactButtons: {
        flexDirection: 'row',
        gap: 16,
    },

    contactButton: {
        borderRadius: 20,
    },

    contactButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    contactIconContainer: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },

    contactButtonText: {
        fontSize: 16,
        fontFamily: 'Outfit_500Medium',
        color: '#FFFFFF',
    },

    footer: {
        alignItems: 'center',
        paddingVertical: 20,
    },

    footerText: {
        fontSize: 14,
        fontFamily: 'Outfit_300Light',
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginBottom: 4,
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

    comingSoonIconContainer: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
},

comingSoonText: {
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 24,
    flex: 1,
},

footerHeartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
},

});