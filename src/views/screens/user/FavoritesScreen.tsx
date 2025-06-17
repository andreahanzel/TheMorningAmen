// src/views/screens/user/FavoritesScreen.tsx

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

// Beautiful Favorites Screen with Firestore cloud sync and amazing animations

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
    Alert,
    Platform,
    RefreshControl,
    Image,
    } from 'react-native';
    import { LinearGradient } from 'expo-linear-gradient';
    import { BlurView } from 'expo-blur';
    import {
    collection,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    onSnapshot,
    getDoc
    } from 'firebase/firestore';
    import { db } from '../../../../firebase.config';
    import { authService } from '../../../models/services/AuthService';
    import { SpiritualIcons } from '../../components/icons/SpiritualIcons';
    import { 
    BackIcon, 
    HeartIcon, 
    ShareIcon,
    PlayIcon,
    BookIcon,
    DeleteIcon
    } from '../../components/icons/CustomIcons';

    const { width, height } = Dimensions.get('window');

    interface FavoriteItem {
    id: string;
    type: 'devotion' | 'video' | 'verse' | 'prayer';
    title: string;
    content?: string;
    imageUri?: string;
    videoUri?: string;
    author?: string;
    date: string;
    category?: string;
    }

    interface FavoritesScreenProps {
    navigation: any;
    }

    export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation }) => {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const cardAnims = useRef<Animated.Value[]>([]).current;

    const categories = [
        { key: 'all', name: 'All', icon: SpiritualIcons.Love },
        { key: 'devotion', name: 'Devotions', icon: SpiritualIcons.Peace },
        { key: 'video', name: 'Videos', icon: SpiritualIcons.Joy },
        { key: 'verse', name: 'Verses', icon: SpiritualIcons.Purpose },
        { key: 'prayer', name: 'Prayers', icon: SpiritualIcons.Rest },
    ];

    useEffect(() => {
        loadFavorites();
        startAnimations();
    }, []);

    useEffect(() => {
        initializeCardAnimations();
    }, [favorites]);

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

    const initializeCardAnimations = () => {
        cardAnims.length = 0;
        const filteredFavorites = getFilteredFavorites();
        
        for (let i = 0; i < filteredFavorites.length; i++) {
        cardAnims.push(new Animated.Value(0));
        }
        animateCards();
    };

    const animateCards = () => {
        const animations = cardAnims.map((anim, index) =>
        Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            delay: index * 100,
            useNativeDriver: true,
        })
        );
        Animated.stagger(80, animations).start();
    };

    const loadFavorites = async () => {
        try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) return;

        // Listen to user document for real-time favorites updates
        const userDocRef = doc(db, 'users', currentUser.id);
        const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            const userFavorites = userData.favorites || [];
            setFavorites(userFavorites);
            }
            setLoading(false);
        });

        // Return cleanup function
        return unsubscribe;
        } catch (error) {
        console.error('Error loading favorites:', error);
        setLoading(false);
        }
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadFavorites().finally(() => setRefreshing(false));
    }, []);

    const getFilteredFavorites = () => {
        if (selectedCategory === 'all') {
        return favorites;
        }
        return favorites.filter(item => item.type === selectedCategory);
    };

    const removeFavorite = async (favoriteId: string) => {
        try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) return;

        const favoriteToRemove = favorites.find(fav => fav.id === favoriteId);
        if (!favoriteToRemove) return;

        // Remove from Firestore
        const userDocRef = doc(db, 'users', currentUser.id);
        await updateDoc(userDocRef, {
            favorites: arrayRemove(favoriteToRemove)
        });

        Alert.alert('Removed', 'Favorite removed successfully! 💔');
        } catch (error) {
        console.error('Error removing favorite:', error);
        Alert.alert('Error', 'Failed to remove favorite');
        }
    };

    const confirmRemoveFavorite = (favoriteId: string, title: string) => {
        Alert.alert(
        'Remove Favorite',
        `Remove "${title}" from your favorites?`,
        [
            { text: 'Cancel', style: 'cancel' },
            {
            text: 'Remove',
            style: 'destructive',
            onPress: () => removeFavorite(favoriteId),
            },
        ]
        );
    };

    const shareFavorite = async (favorite: FavoriteItem) => {
        // Implement sharing functionality
        Alert.alert('Share', `Sharing "${favorite.title}" - Feature coming soon! 📱`);
    };

    const openFavorite = (favorite: FavoriteItem) => {
        switch (favorite.type) {
        case 'devotion':
            navigation.navigate('DevotionDetail', { devotion: favorite });
            break;
        case 'video':
            navigation.navigate('VideoGallery', { selectedVideo: favorite });
            break;
        case 'verse':
            navigation.navigate('VerseOfDay', { selectedVerse: favorite });
            break;
        case 'prayer':
            navigation.navigate('PrayerWall', { selectedPrayer: favorite });
            break;
        default:
            Alert.alert('Info', 'Content will open in its dedicated screen');
        }
    };

    const getTypeIcon = (type: string) => {
        const iconProps = { size: 16, gradient: true };
        switch (type) {
        case 'devotion': return <BookIcon size={16} color="#FFFFFF" />;
        case 'video': return <PlayIcon size={16} color="#FFFFFF" />;
        case 'verse': return <SpiritualIcons.Purpose {...iconProps} />;
        case 'prayer': return <SpiritualIcons.Rest {...iconProps} />;
        default: return <SpiritualIcons.Love {...iconProps} />;
        }
    };

    const getTypeColors = (type: string): [string, string, string] => {
        switch (type) {
        case 'devotion':
            return ['#2196f3', '#42a5f5', '#64b5f6'];
        case 'video':
            return ['#f44336', '#e57373', '#ef5350'];
        case 'verse':
            return ['#9c27b0', '#ab47bc', '#ba68c8'];
        case 'prayer':
            return ['#4caf50', '#66bb6a', '#81c784'];
        default:
            return ['#ff6b35', '#ff8c42', '#ffa726'];
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        });
    };

    const filteredFavorites = getFilteredFavorites();

    // Favorite Card Component
    const FavoriteCard = ({ favorite, index }: { favorite: FavoriteItem; index: number }) => {
        const colors = getTypeColors(favorite.type);
        
        return (
        <Animated.View
            style={[
            styles.favoriteCard,
            {
                opacity: cardAnims[index] || new Animated.Value(1),
                transform: [
                {
                    translateY: (cardAnims[index] || new Animated.Value(1)).interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                    }),
                },
                {
                    scale: (cardAnims[index] || new Animated.Value(1)).interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                    }),
                },
                ],
            },
            ]}
        >
            <TouchableOpacity
            onPress={() => openFavorite(favorite)}
            activeOpacity={0.9}
            >
            <BlurView intensity={20} style={styles.cardBlur}>
                <LinearGradient
                colors={colors}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                >
                {/* Header */}
                <View style={styles.cardHeader}>
                    <View style={styles.typeContainer}>
                    <View style={styles.typeBadge}>
                        {getTypeIcon(favorite.type)}
                        <Text style={styles.typeText}>
                        {favorite.type.toUpperCase()}
                        </Text>
                    </View>
                    </View>
                    
                    <View style={styles.cardActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => shareFavorite(favorite)}
                    >
                        <ShareIcon size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => confirmRemoveFavorite(favorite.id, favorite.title)}
                    >
                        <DeleteIcon size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                    </View>
                </View>

                {/* Image if present */}
                {favorite.imageUri && (
                    <View style={styles.imageContainer}>
                    <Image source={{ uri: favorite.imageUri }} style={styles.favoriteImage} />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.5)']}
                        style={styles.imageOverlay}
                    />
                    </View>
                )}

                {/* Content */}
                <View style={styles.cardContent}>
                    <Text style={styles.favoriteTitle} numberOfLines={2}>
                    {favorite.title}
                    </Text>
                    
                    {favorite.content && (
                    <Text style={styles.favoriteContent} numberOfLines={3}>
                        {favorite.content}
                    </Text>
                    )}

                    {favorite.author && (
                    <Text style={styles.favoriteAuthor}>
                        by {favorite.author}
                    </Text>
                    )}
                </View>

                {/* Footer */}
                <View style={styles.cardFooter}>
                    <Text style={styles.favoriteDate}>
                    {formatDate(favorite.date)}
                    </Text>
                    
                    <View style={styles.heartContainer}>
                    <HeartIcon size={16} color="#FFFFFF" filled />
                    </View>
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
            </BlurView>
            </TouchableOpacity>
        </Animated.View>
        );
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
                <BackIcon size={20} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>My Favorites</Text>
                <Text style={styles.headerSubtitle}>
                {favorites.length} saved item{favorites.length !== 1 ? 's' : ''}
                </Text>
            </View>
            
            <View style={styles.headerRight}>
                <HeartIcon size={24} color="#FFFFFF" filled />
            </View>
            </Animated.View>

            {/* Category Filter */}
            <Animated.View
            style={[
                styles.categoriesContainer,
                {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                },
            ]}
            >
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContent}
            >
                {categories.map((category) => {
                const isSelected = selectedCategory === category.key;
                
                return (
                    <TouchableOpacity
                    key={category.key}
                    style={styles.categoryChip}
                    onPress={() => setSelectedCategory(category.key)}
                    activeOpacity={0.8}
                    >
                    <LinearGradient
                        colors={
                        isSelected
                            ? ['#ffeb3b', '#ff9800', '#ff6b35']
                            : ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']
                        }
                        style={[
                        styles.categoryChipGradient,
                        isSelected && styles.categoryChipSelected
                        ]}
                    >
                        <category.icon size={14} gradient={isSelected} />
                        <Text style={[
                        styles.categoryChipText,
                        isSelected && styles.categoryChipTextSelected
                        ]}>
                        {category.name}
                        </Text>
                    </LinearGradient>
                    </TouchableOpacity>
                );
                })}
            </ScrollView>
            </Animated.View>

            {/* Favorites List */}
            <ScrollView
            style={styles.favoritesList}
            contentContainerStyle={styles.favoritesContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#FFFFFF"
                colors={['#ff6b35']}
                />
            }
            >
            {loading ? (
                <Animated.View
                style={[
                    styles.loadingContainer,
                    {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                    },
                ]}
                >
                <SpiritualIcons.Love size={48} gradient />
                <Text style={styles.loadingText}>Loading your favorites...</Text>
                </Animated.View>
            ) : filteredFavorites.length === 0 ? (
                <Animated.View
                style={[
                    styles.emptyState,
                    {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                    },
                ]}
                >
                <HeartIcon size={64} color="rgba(255,255,255,0.6)" />
                <Text style={styles.emptyStateTitle}>
                    {selectedCategory === 'all' 
                    ? 'No Favorites Yet' 
                    : `No ${categories.find(c => c.key === selectedCategory)?.name || 'Items'} Saved`
                    }
                </Text>
                <Text style={styles.emptyStateText}>
                    {selectedCategory === 'all'
                    ? 'Start saving devotions, videos, verses, and prayers you love!'
                    : 'Save some items in this category to see them here.'
                    }
                </Text>
                <TouchableOpacity
                    style={styles.exploreButton}
                    onPress={() => navigation.navigate('Home')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                    colors={['#ffeb3b', '#ff9800', '#ff6b35']}
                    style={styles.exploreButtonGradient}
                    >
                    <Text style={styles.exploreButtonText}>Explore Content</Text>
                    <SpiritualIcons.Joy size={16} gradient />
                    </LinearGradient>
                </TouchableOpacity>
                </Animated.View>
            ) : (
                filteredFavorites.map((favorite, index) => (
                <FavoriteCard key={favorite.id} favorite={favorite} index={index} />
                ))
            )}
            
            <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Background particles */}
            <View style={styles.particlesContainer}>
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
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },

    headerTitle: {
        fontSize: 24,
        fontFamily: 'Outfit_700Bold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    headerSubtitle: {
        fontSize: 14,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 2,
    },

    headerRight: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },

    categoriesContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },

    categoriesContent: {
        paddingHorizontal: 0,
    },

    categoryChip: {
        marginRight: 12,
        borderRadius: 20,
        overflow: 'hidden',
    },

    categoryChipGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 20,
        gap: 6,
    },

    categoryChipSelected: {
        borderColor: 'rgba(255, 255, 255, 0.6)',
        transform: [{ scale: 1.05 }],
    },

    categoryChipText: {
        fontSize: 12,
        fontFamily: 'Outfit_500Medium',
        color: 'rgba(255, 255, 255, 0.8)',
    },

    categoryChipTextSelected: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },

    favoritesList: {
        flex: 1,
    },

    favoritesContent: {
        paddingHorizontal: 20,
    },

    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },

    loadingText: {
        fontSize: 18,
        fontFamily: 'Outfit_500Medium',
        color: '#FFFFFF',
        marginTop: 16,
        textAlign: 'center',
    },

    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },

    emptyStateTitle: {
        fontSize: 24,
        fontFamily: 'Outfit_700Bold',
        color: '#FFFFFF',
        marginTop: 20,
        marginBottom: 12,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    emptyStateText: {
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },

    exploreButton: {
        borderRadius: 20,
        shadowColor: '#ffeb3b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },

    exploreButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 20,
        gap: 8,
    },

    exploreButtonText: {
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    favoriteCard: {
        marginBottom: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
    },

    cardBlur: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    cardGradient: {
        padding: 20,
        position: 'relative',
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    typeContainer: {},

    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        gap: 6,
    },

    typeText: {
        fontSize: 10,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },

    cardActions: {
        flexDirection: 'row',
        gap: 8,
    },

    actionButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    imageContainer: {
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },

    favoriteImage: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
    },

    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
    },

    cardContent: {
        marginBottom: 12,
    },

    favoriteTitle: {
        fontSize: 18,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
        lineHeight: 24,
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    favoriteContent: {
        fontSize: 14,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: 20,
        marginBottom: 6,
    },

    favoriteAuthor: {
        fontSize: 12,
        fontFamily: 'Outfit_300Light',
        color: 'rgba(255, 255, 255, 0.8)',
        fontStyle: 'italic',
    },

    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    favoriteDate: {
        fontSize: 12,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255, 255, 255, 0.8)',
    },

    heartContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        padding: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
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
        width: 3,
        height: 3,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },

    particlesContainer: {
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