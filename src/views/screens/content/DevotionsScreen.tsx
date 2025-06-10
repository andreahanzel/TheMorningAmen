// src/views/screens/content/DevotionsScreen.tsx

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

// This file is part of the Daily Devotions app, providing a daily devotional experience with animations and interactive features.
// It is designed to be visually appealing and user-friendly, showcasing daily devotions with a focus on spiritual growth and community engagement.

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
    RefreshControl,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SearchIcon, StarIcon } from '../../components/icons/CustomIcons';
import { SpiritualIcons } from '../../components/icons/SpiritualIcons';


const { width, height } = Dimensions.get('window');

// Sample devotions data
const devotionsData = [
    {
        id: '1',
        title: 'Finding Peace in the Storm',
        excerpt: 'When life gets overwhelming, remember that God is your anchor...',
        content: 'Life often feels like a stormy sea, with waves of challenges crashing over us. In these moments, we can feel lost and overwhelmed. But Scripture reminds us that even in the fiercest storms, God is our anchor. He is the calm in our chaos, the peace in our panic. When Jesus walked on water during the storm, He showed His disciples—and us—that no storm is too great for our Savior. Today, whatever storm you are facing, remember that you are not alone. God is with you, and He will see you through.',
        date: '2025-01-15',
        readTime: '3 min read',
        verse: 'Psalm 46:10',
        verseText: 'Be still and know that I am God.',
        author: 'Andrea Toreki',
        category: 'Peace',
        image: '🌊',
        isFavorite: false,
    },
    {
        id: '2',
        title: 'The Power of Gratitude',
        excerpt: 'Discovering joy through thankfulness in every season of life...',
        content: 'Gratitude is more than just saying "thank you"—it\'s a posture of the heart that transforms how we see the world. When we choose gratitude, we shift our focus from what we lack to what we have been blessed with. This doesn\'t mean ignoring real struggles or pretending everything is perfect. Rather, it means choosing to see God\'s goodness even in difficult seasons. The apostle Paul wrote about giving thanks in all circumstances, not because every circumstance is good, but because God is good in every circumstance.',
        date: '2025-01-14',
        readTime: '4 min read',
        verse: '1 Thessalonians 5:18',
        verseText: 'Give thanks in all circumstances; for this is God\'s will for you in Christ Jesus.',
        author: 'Andrea Toreki',
        category: 'Gratitude',
        image: '🙏',
        isFavorite: true,
    },
    {
        id: '3',
        title: 'Walking in Faith',
        excerpt: 'Taking the next step even when you can\'t see the whole staircase...',
        content: 'Faith is often described as stepping into the unknown, trusting that God will provide solid ground beneath our feet. It\'s not about having all the answers or seeing the complete picture. Faith is about taking the next step, even when the path ahead seems unclear. Abraham left his homeland not knowing where God was leading him. Moses approached Pharaoh despite feeling inadequate. David faced Goliath with just a sling and stones. Each of these heroes of faith had one thing in common: they trusted God\'s heart even when they couldn\'t trace His hand.',
        date: '2025-01-13',
        readTime: '5 min read',
        verse: 'Hebrews 11:1',
        verseText: 'Now faith is confidence in what we hope for and assurance about what we do not see.',
        author: 'Andrea Toreki',
        category: 'Faith',
        image: '✨',
        isFavorite: false,
    },
    {
        id: '4',
        title: 'Love Without Limits',
        excerpt: 'Experiencing and sharing God\'s unconditional love in our relationships...',
        content: 'God\'s love for us is unlike any human love we\'ve experienced. It\'s not based on our performance, our success, or our ability to earn it. His love is given freely, completely, and without condition. This kind of love changes everything about how we view ourselves and how we love others. When we truly understand that we are unconditionally loved by the Creator of the universe, it frees us to love others in the same way. We can love without fear of rejection, give without expecting return, and forgive because we have been forgiven.',
        date: '2025-01-12',
        readTime: '4 min read',
        verse: '1 John 4:19',
        verseText: 'We love because he first loved us.',
        author: 'Andrea Toreki',
        category: 'Love',
        image: '💝',
        isFavorite: false,
    },
    {
        id: '5',
        title: 'New Mercies Every Morning',
        excerpt: 'God\'s faithfulness refreshes us with each new day...',
        content: 'Every sunrise brings with it a fresh supply of God\'s mercy and grace. No matter what happened yesterday—whether we succeeded or failed, whether we felt close to God or distant from Him—each new day is an opportunity for a fresh start. This is the beauty of God\'s faithfulness: it never runs out, never gets depleted, and never depends on our ability to earn it. His mercies are new every morning, as steady and reliable as the sunrise itself. Today is a gift, full of new possibilities and fresh grace.',
        date: '2025-01-11',
        readTime: '3 min read',
        verse: 'Lamentations 3:22-23',
        verseText: 'The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning.',
        author: 'Andrea Toreki',
        category: 'Hope',
        image: '🌅',
        isFavorite: true,
    },
];

interface DevotionsScreenProps {
    navigation: any;
}

// This screen displays a list of daily devotions with animations, filtering, and interactive features.
export const DevotionsScreen: React.FC<DevotionsScreenProps> = ({ navigation }) => {
    const [devotions, setDevotions] = useState(devotionsData);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const cardAnims = useRef(devotions.map(() => new Animated.Value(0))).current;
    const iconRotateAnims = useRef(devotions.map(() => new Animated.Value(0))).current;


    useEffect(() => {
        startAnimations();
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
        ]).start();

        // Staggered card animations
        const cardAnimations = cardAnims.map((anim, index) =>
            Animated.timing(anim, {
                toValue: 1,
                duration: 500,
                delay: index * 100,
                useNativeDriver: true,
            })
        );

        Animated.stagger(80, cardAnimations).start();
    };

    // Toggle favorite status
    const toggleFavorite = (id: string) => {
        setDevotions(prev =>
            prev.map(devotion =>
                devotion.id === id
                    ? { ...devotion, isFavorite: !devotion.isFavorite }
                    : devotion
            )
        );
    };

    // Refresh control handler
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    // Filter devotions by category
    const categories = ['All', 'Peace', 'Gratitude', 'Faith', 'Love', 'Hope'];

    // Filter devotions based on selected category
    const filteredDevotions = selectedCategory === 'All' 
        ? devotions 
        : devotions.filter(d => d.category === selectedCategory);

        // Animated icon rotations
    const iconAnimations = iconRotateAnims.map((anim) =>
        Animated.loop(
            Animated.sequence([
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 4000,
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 4000,
                    useNativeDriver: true,
                }),
            ])
        )
    );

iconAnimations.forEach(anim => anim.start());

    // Devotion card component
    const DevotionCard = ({ devotion, index }: { devotion: any; index: number }) => (
    <Animated.View
        style={[
            styles.devotionCard,
            {
                opacity: cardAnims[index],
                transform: [
                    {
                        translateY: cardAnims[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [50, 0],
                        }),
                    },
                    {
                        scale: cardAnims[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.9, 1],
                        }),
                    },
                ],
            },
        ]}
    >
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('DevotionDetail', { devotion })}
        >
            <LinearGradient
                colors={getCategoryColors(devotion.category)}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Header */}
                <View style={styles.cardHeader}>
                    <View style={styles.categoryContainer}>
                        <LinearGradient
                            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)']}
                            style={styles.categoryBadge}
                        >
                            <Text style={styles.categoryText}>{devotion.category}</Text>
                        </LinearGradient>
                    </View>
                    
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={() => toggleFavorite(devotion.id)}
                    >
                        <StarIcon 
                            size={20} 
                            color={devotion.isFavorite ? '#FFD700' : 'rgba(255,255,255,0.8)'} 
                            filled={devotion.isFavorite} 
                        />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                    <View style={styles.devotionIconContainer}>
                        <Animated.View 
                            style={[
                                styles.devotionIconWrapper,
                                {
                                    transform: [{ rotate: iconRotateAnims[index].interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0deg', '360deg'],
                                    })}],
                                },
                            ]}
                        >
                            {(() => {
                                const CustomIcon = SpiritualIcons[devotion.category as keyof typeof SpiritualIcons] || SpiritualIcons.Joy;
                                return <CustomIcon size={48} gradient={true} />;
                            })()}
                        </Animated.View>
                    </View>
                    <Text style={styles.devotionTitle}>{devotion.title}</Text>
                    <Text style={styles.devotionExcerpt}>{devotion.excerpt}</Text>
                    
                    <View style={styles.verseContainer}>
                        <Text style={styles.verseText}>"{devotion.verseText}"</Text>
                        <Text style={styles.verseReference}>- {devotion.verse}</Text>
                    </View>
                </View>
                {/* Footer */}
                <View style={styles.cardFooter}>
                    <View style={styles.authorInfo}>
                        <Text style={styles.authorName}>{devotion.author}</Text>
                        <Text style={styles.readTime}>{devotion.readTime}</Text>
                    </View>
                    <Text style={styles.dateText}>{new Date(devotion.date).toLocaleDateString()}</Text>
                </View>

                {/* Floating particles */}
                <View style={styles.cardParticles}>
                    {[...Array(3)].map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.particle,
                                {
                                    top: `${20 + Math.random() * 60}%`,
                                    right: `${10 + Math.random() * 20}%`,
                                },
                            ]}
                        />
                    ))}
                </View>
            </LinearGradient>
        </TouchableOpacity>
    </Animated.View>
);

    // Function to get category colors
    const getCategoryColors = (category: string): [string, string, string] => {
    switch (category) {
        case 'Peace':
            return ['#4FACFE', '#00F2FE', '#4FACFE']; // Bright blue gradient
        case 'Gratitude':
            return ['#FF9F43', '#FFCE54', '#FF9F43']; // Vibrant orange/yellow
        case 'Faith':
            return ['#A29BFE', '#74B9FF', '#A29BFE']; // Purple to blue
        case 'Love':
            return ['#FF7675', '#FF9FF3', '#FF7675']; // Pink to red
        case 'Hope':
            return ['#00B894', '#70F0FF', '#00B894']; // Green to cyan
        case 'Strength':
            return ['#FDCB6E', '#FF7675', '#FDCB6E']; // Orange to red
        default:
            return ['#ff6b35', '#ff8c42', '#ffa726']; // Default orange
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
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.headerTitle}>Daily Devotions</Text>
                            <Text style={styles.headerSubtitle}>Nourish your soul with God's word</Text>
                        </View>
                        
                        <TouchableOpacity style={styles.searchButton}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                                style={styles.searchGradient}
                            >
                                <SearchIcon size={20} color="#FFFFFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Category Filter */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.categoriesContainer}
                        contentContainerStyle={styles.categoriesContent}
                    >
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.categoryButton,
                                    selectedCategory === category && styles.categoryButtonActive
                                ]}
                                onPress={() => setSelectedCategory(category)}
                            >
                                <LinearGradient
                                    colors={
                                        selectedCategory === category
                                            ? ['#ffeb3b', '#ff9800']
                                            : ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']
                                    }
                                    style={styles.categoryButtonGradient}
                                >
                                    <Text style={[
                                        styles.categoryButtonText,
                                        selectedCategory === category && styles.categoryButtonTextActive
                                    ]}>
                                        {category}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Animated.View>

                {/* Devotions List */}
                <ScrollView
                    style={[styles.devotionsList, { flex: 1 }]} // flex: 1
                    contentContainerStyle={styles.devotionsContent}
                    showsVerticalScrollIndicator={true} // true for web
                    bounces={true}
                    scrollEventThrottle={16}
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
                    {filteredDevotions.map((devotion, index) => (
                        <DevotionCard key={devotion.id} devotion={devotion} index={index} />
                    ))}
                    
                    <View style={styles.bottomSpacing} />
                </ScrollView>

                {/* Background particles */}
                <View style={styles.backgroundParticles}>
                    {[...Array(8)].map((_, index) => (
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
        backgroundColor: 'transparent',
    },

    header: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        
    },

    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },

    headerTitle: {
        fontSize: 28,
        fontFamily: 'Outfit_700Bold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    headerSubtitle: {
        fontSize: 16,
        fontFamily: 'Outfit_300Light',
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 4,
    },

    searchButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    searchGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    searchIcon: {
        fontSize: 20,
    },

    categoriesContainer: {
        marginBottom: 10,
    },

    categoriesContent: {
        paddingRight: 20,
    },

    categoryButton: {
        marginRight: 12,
        borderRadius: 20,
    },

    categoryButtonActive: {},

    categoryButtonGradient: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },

    categoryButtonText: {
        fontSize: 14,
        fontFamily: 'Outfit_500Medium',
        color: 'rgba(255, 255, 255, 0.8)',
    },

    categoryButtonTextActive: {
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    devotionsList: {
        flex: 1,
    },

    devotionsContent: {
        paddingHorizontal: 20,
    },

    devotionCard: {
        marginBottom: 20,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
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
        borderRadius: 24,
        position: 'relative',
    },

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
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    favoriteButton: {
        padding: 8,
    },

    favoriteIcon: {
        fontSize: 20,
    },

    cardContent: {
        alignItems: 'center',
        marginBottom: 20,
    },

    devotionIconContainer: {
        marginBottom: 16,
        alignItems: 'center',
    },

    devotionIconWrapper: {
        padding: 8,
    },

    devotionTitle: {
        fontSize: 22,
        fontFamily: 'Outfit_700Bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 12,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    devotionExcerpt: {
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },

    verseContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        alignSelf: 'stretch',
    },

    verseText: {
        fontSize: 16,
        fontFamily: 'LibreBaskerville_400Regular_Italic',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 8,
    },

    verseReference: {
        fontSize: 14,
        fontFamily: 'LibreBaskerville_700Bold',
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
    },

    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    authorInfo: {
        flex: 1,
    },

    authorName: {
        fontSize: 14,
        fontFamily: 'Outfit_500Medium',
        color: 'rgba(255, 255, 255, 0.9)',
    },

    readTime: {
        fontSize: 12,
        fontFamily: 'Outfit_300Light',
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 2,
    },

    dateText: {
        fontSize: 12,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255, 255, 255, 0.7)',
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
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
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

    bottomSpacing: {
        height: 100,
    },
});