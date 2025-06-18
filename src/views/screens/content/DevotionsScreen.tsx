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
import { FirebaseService } from '../../../models/services/FirebaseService';
import { db } from '../../../../firebase.config';
import { authService } from '../../../models/services/AuthService';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, onSnapshot } from 'firebase/firestore';
import { Alert } from 'react-native';



const { width, height } = Dimensions.get('window');

interface Devotion {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    readTime: string;
    verse: string;
    verseText: string;
    author: string;
    category: string;
    isFavorite: boolean;
}

interface DevotionsScreenProps {
    navigation: any;
}

// This screen displays a list of daily devotions with animations, filtering, and interactive features.
export const DevotionsScreen: React.FC<DevotionsScreenProps> = ({ navigation }) => {
    const [devotions, setDevotions] = useState<Devotion[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userFavorites, setUserFavorites] = useState<string[]>([]);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const cardAnims = useRef<Animated.Value[]>([]).current;
    const iconRotateAnims = useRef<Animated.Value[]>([]).current;

    // Load devotions on mount and start animations
        useEffect(() => {
            loadDevotions();
            startAnimations();
            const unsubscribe = setupFavoritesListener();
            
            return () => {
                if (unsubscribe) unsubscribe();
            };
        }, []);

    useEffect(() => {
    // Reset category to 'All' when component mounts
        setSelectedCategory('All');
    }, []);


    const startAnimations = () => {
        // Main container animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: false,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: false,
            }),
        ]).start();

        // Staggered card animations
        const cardAnimations = cardAnims.map((anim, index) =>
            Animated.timing(anim, {
                toValue: 1,
                duration: 500,
                delay: index * 100,
                useNativeDriver: false,
            })
        );

        Animated.stagger(80, cardAnimations).start();
    };

    // Load devotions from Firebase
        const loadDevotions = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Loading devotions from Firebase...');

                // Load user favorites first
                const currentUser = authService.getCurrentUser();
                let favoriteIds: string[] = [];
                if (currentUser) {
                    try {
                        const userDocRef = doc(db, 'users', currentUser.id);
                        const userDoc = await getDoc(userDocRef);
                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            favoriteIds = (userData.favorites || []).map((fav: any) => fav.id);
                            setUserFavorites(favoriteIds);
                        }
                    } catch (error) {
                        console.error('Error loading user favorites:', error);
                    }
                }
                
                const firebaseDevotions = await FirebaseService.getAllDevotions();
                
                // DEBUG: Log raw Firebase data
                console.log('Raw Firebase data:', firebaseDevotions);

                if (!firebaseDevotions || firebaseDevotions.length === 0) {
                    console.log('No devotions found, loading fallback data...');
                    const fallbackDevotions = [
                        {
                            id: 'fallback_001',
                            title: 'Finding Peace in the Storm',
                            excerpt: 'When life gets overwhelming, remember that God is your anchor.',
                            content: 'Life often feels like a stormy sea, with waves of challenges crashing over us relentlessly...',
                            date: '2025-01-15',
                            readTime: '4 min read',
                            verse: 'Psalm 46:10',
                            verseText: 'Be still and know that I am God.',
                            author: 'Andrea Toreki',
                            category: 'Peace',
                            isFavorite: false,
                        }
                    ];
                    setDevotions(fallbackDevotions);
                    return;
                }
                                
                // Process and validate data  
                const processedDevotions = firebaseDevotions.map((d: any) => {
                    console.log('Processing devotion:', d.id, 'Category:', d.category);
                    return {
                        id: d.id ?? '',
                        title: d.title ?? '',
                        excerpt: d.excerpt ?? '',
                        content: d.content ?? '',
                        date: d.date ?? '',
                        readTime: d.readTime ?? '',
                        verse: d.verse ?? '',
                        verseText: d.verseText ?? '',
                        author: d.author ?? '',
                        category: d.category ?? '', // Make sure this is not undefined
                        isFavorite: favoriteIds.includes(d.id),
                    };
                });
                
                setDevotions(processedDevotions);
                
                // Initialize animations
                cardAnims.length = 0;
                iconRotateAnims.length = 0;
                processedDevotions.forEach(() => {
                    cardAnims.push(new Animated.Value(0));
                    iconRotateAnims.push(new Animated.Value(0));
                });
                
                console.log(`Loaded ${processedDevotions.length} devotions from Firebase`);
                
            } catch (error) {
                console.error('Error loading devotions:', error);
                setError('Failed to load devotions. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        // Set up listener for user favorites
        const setupFavoritesListener = () => {
            const currentUser = authService.getCurrentUser();
            if (!currentUser) return;

            const userDocRef = doc(db, 'users', currentUser.id);
            const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const userData = docSnapshot.data();
                    const favoriteIds = (userData.favorites || []).map((fav: any) => fav.id);
                    setUserFavorites(favoriteIds);
                    
                    // Update devotions with new favorite status
                    setDevotions(prev => 
                        prev.map(devotion => ({
                            ...devotion,
                            isFavorite: favoriteIds.includes(devotion.id)
                        }))
                    );
                }
            });

    return unsubscribe;
}; 


    // Toggle favorite status
    const toggleFavorite = async (id: string) => {
        const devotion = devotions.find(d => d.id === id);
        if (!devotion) return;

        try {
            const currentUser = authService.getCurrentUser();
            if (!currentUser) {
                Alert.alert('Login Required', 'Please log in to save favorites');
                return;
            }

            const favoriteItem = {
                id: devotion.id,
                type: 'devotion' as const,
                title: devotion.title,
                content: devotion.content,
                author: devotion.author,
                date: devotion.date,
                category: devotion.category,
            };

            const userDocRef = doc(db, 'users', currentUser.id);
            
            if (devotion.isFavorite) {
                await updateDoc(userDocRef, {
                    favorites: arrayRemove(favoriteItem)
                });
            } else {
                await updateDoc(userDocRef, {
                    favorites: arrayUnion(favoriteItem)
                });
            }

            // Update local state
            setDevotions(prev =>
                prev.map(d =>
                    d.id === id ? { ...d, isFavorite: !d.isFavorite } : d
                )
            );

            console.log(`${devotion.isFavorite ? 'Removed from' : 'Added to'} favorites: ${devotion.title}`);
        } catch (error) {
            console.error('Error toggling favorite:', error);
            Alert.alert('Error', 'Failed to update favorite');
        }
    };

    // Refresh control handler
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadDevotions().finally(() => {
            setRefreshing(false);
        });
    }, []);

    // Categories for filtering
    const categories = ['All', 'Peace', 'Gratitude', 'Faith', 'Love', 'Hope', 'Strength', 'Mindfulness', 'Patience'];

    // Filter devotions based on selected category
    const filteredDevotions = selectedCategory === 'All' 
        ? devotions 
        : devotions.filter(d => d.category?.trim() === selectedCategory);

        // Animated icon rotations


    // Devotion card component
    const DevotionCard = ({ devotion, index }: { devotion: Devotion; index: number }) => (
        <View style={styles.devotionCard}>
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
                                    transform: [{
                                        rotate: iconRotateAnims[index]
                                            ? iconRotateAnims[index].interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['0deg', '360deg'],
                                            })
                                            : '0deg',
                                    }],
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
    </View>
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
                        style={[styles.devotionsList, { flex: 1 }]}
                        contentContainerStyle={styles.devotionsContent}
                        showsVerticalScrollIndicator={true}
                        bounces={true}
                        scrollEventThrottle={16}
                        nestedScrollEnabled={true}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor="#FFFFFF"
                                colors={['#ff6b35']}
                            />
                        }
                    >
                        {loading && (
                            <View style={styles.loadingContainer}>
                                <Text style={styles.loadingText}>Loading devotions...</Text>
                            </View>
                        )}

                        {error && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{error}</Text>
                                <TouchableOpacity style={styles.retryButton} onPress={loadDevotions}>
                                    <Text style={styles.retryButtonText}>Retry</Text>
                                </TouchableOpacity>
                            </View>
                        )}                  

                        
                        {!loading && !error && devotions.length === 0 && (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No devotions available</Text>
                            </View>
                        )}
                        
                        {(filteredDevotions.length > 0 ? filteredDevotions : devotions).map((devotion, index) => (
                            
                            <DevotionCard key={devotion.id} devotion={devotion} index={index} />
                        ))}
                        
                        <View style={styles.bottomSpacing} />
                    </ScrollView>

                    {/* Background particles section stays the same */}
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
        maxHeight: 40,
    },

    categoriesContent: {
        paddingRight: 20,
        paddingLeft: 5,
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

    loadingContainer: {
    padding: 40,
    alignItems: 'center',
    },

    loadingText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        fontFamily: 'Outfit_400Regular',
    },

    errorContainer: {
        padding: 40,
        alignItems: 'center',
    },

    errorText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        fontFamily: 'Outfit_400Regular',
        textAlign: 'center',
        marginBottom: 20,
    },

    retryButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },

    retryButtonText: {
        color: '#FFFFFF',
        fontFamily: 'Outfit_600SemiBold',
    },

    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },

    emptyText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '400',
    },
});