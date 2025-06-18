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
    Modal,
    Share,
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
    StarIcon
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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [favoriteToDelete, setFavoriteToDelete] = useState<{id: string, title: string} | null>(null);

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
        // Add theme-based categories for verses
        { key: 'Joy', name: 'Joy', icon: SpiritualIcons.Joy },
        { key: 'Peace', name: 'Peace', icon: SpiritualIcons.Peace },
        { key: 'Love', name: 'Love', icon: SpiritualIcons.Love },
        { key: 'Hope', name: 'Hope', icon: SpiritualIcons.Hope },
        { key: 'Purpose', name: 'Purpose', icon: SpiritualIcons.Purpose },
    ];

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;
        
        const setupListener = async () => {
            unsubscribe = await loadFavorites();
        };
        
        setupListener();
        startAnimations();
        
        // Cleanup function
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
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
            if (!currentUser) {
                setLoading(false);
                return;
            }

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

            // Store the unsubscribe function for cleanup
            return unsubscribe;
        } catch (error) {
            console.error('Error loading favorites:', error);
            setLoading(false);
        }
    };

    // Refresh favorites
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // Just set refreshing to false since we have real-time listener
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    // Filter favorites based on selected category
    const getFilteredFavorites = () => {
        if (selectedCategory === 'all') {
            return favorites;
        }
        
        // Filter by type (devotion, video, verse, prayer)
        if (['devotion', 'video', 'verse', 'prayer'].includes(selectedCategory)) {
            return favorites.filter(item => item.type === selectedCategory);
        }
        
        // Filter by verse theme (Joy, Peace, Love, etc.)
        return favorites.filter(item => 
            item.type === 'verse' && item.category === selectedCategory
        );
    };

    // Remove favorite from Firestore
    const removeFavorite = async (favoriteId: string) => {
        try {
            const currentUser = authService.getCurrentUser();
            if (!currentUser) return;

            // Get the current user document to find the exact favorite object
            const userDocRef = doc(db, 'users', currentUser.id);
            const userDoc = await getDoc(userDocRef);
            
            if (!userDoc.exists()) return;
            
            const userData = userDoc.data();
            const userFavorites = userData.favorites || [];
            
            // Find the exact favorite object as it exists in Firestore
            const favoriteToRemove = userFavorites.find((fav: any) => 
                fav.id === favoriteId
            );
            
            if (!favoriteToRemove) {
                console.log('Favorite not found:', favoriteId);
                return;
            }

            console.log('Removing favorite:', favoriteToRemove);

            // Remove using the exact object from Firestore
            await updateDoc(userDocRef, {
                favorites: arrayRemove(favoriteToRemove)
            });

            console.log('Successfully removed favorite');
            Alert.alert('Removed', 'Favorite removed successfully! ⭐');
        } catch (error) {
            console.error('Error removing favorite:', error);
            Alert.alert('Error', 'Failed to remove favorite. Please try again.');
        }
    };

    
    // Confirm before removing favorite
    const confirmRemoveFavorite = (favoriteId: string, title: string) => {
        setFavoriteToDelete({ id: favoriteId, title });
        setShowDeleteConfirm(true);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setFavoriteToDelete(null);
    };

    const confirmDelete = async () => {
        if (favoriteToDelete) {
            try {
                await removeFavorite(favoriteToDelete.id);
            } catch (error) {
                console.error('Error removing favorite:', error);
            } finally {
                setShowDeleteConfirm(false);
                setFavoriteToDelete(null);
            }
        }
    };

    // Share favorite item
    const shareFavorite = async (favorite: FavoriteItem) => {
        try {
            await Share.share({
                message: `${favorite.content}\n\nFrom The Morning Amen app 🙏`,
                title: favorite.title,
            });
        } catch (error) {
            console.error('Error sharing favorite:', error);
            Alert.alert('Error', 'Failed to share content');
        }
};

    // Open favorite item in its dedicated screen
    const openFavorite = (favorite: FavoriteItem) => {
        switch (favorite.type) {
        case 'devotion':
            navigation.navigate('DevotionsStack', { screen: 'DevotionDetail', params: { devotion: favorite } });
            break;
        case 'video':
            navigation.navigate('VideosStack', { screen: 'VideoGallery', params: { selectedVideo: favorite } });
            break;
        case 'verse':
            navigation.navigate('HomeStack', { screen: 'VerseOfDay', params: { selectedVerse: favorite } });
            break;
        case 'prayer':
            navigation.navigate('PrayerStack', { screen: 'PrayerWall', params: { selectedPrayer: favorite } });
            break;
        default:
            Alert.alert('Info', 'Content will open in its dedicated screen');
        }
    };

    // Get icon based on favorite type
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

    //  Get colors based on favorite type
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

    // Format date to "MMM DD"
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
                    
                    <TouchableOpacity
                    style={styles.starContainer}
                    onPress={() => confirmRemoveFavorite(favorite.id, favorite.title)}
                    >
                        <StarIcon size={16} color="#FFD700" filled />
                    </TouchableOpacity>
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
                <LinearGradient
                    colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)']}
                    style={styles.backButtonGradient}
                >
                    <BackIcon size={20} color="#FFFFFF" />
                </LinearGradient>
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
                    onPress={() => navigation.navigate('HomeStack')}
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
                    <FavoriteCard key={`${favorite.type}-${favorite.id}-${index}`} favorite={favorite} index={index} />
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

            {/* Delete Confirmation Modal */}
                <Modal
                    visible={showDeleteConfirm}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={cancelDelete}
                >
                    <View style={styles.deleteModalOverlay}>
                        <View style={styles.deleteModalContent}>
                            <Text style={styles.deleteModalTitle}>Remove from Favorites</Text>
                            <Text style={styles.deleteModalText}>
                                Are you sure you want to remove "{favoriteToDelete?.title}" from your favorites?
                            </Text>
                            <View style={styles.deleteModalButtons}>
                                <TouchableOpacity style={styles.cancelButton} onPress={cancelDelete}>
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
                                    <Text style={styles.deleteButtonText}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

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

    starContainer: {
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

    backButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
},

    footerActions: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },

    deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
},

deleteModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
},

deleteModalTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
},

deleteModalText: {
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
    textAlign: 'center',
},

deleteModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
},

cancelButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
},

cancelButtonText: {
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
},

deleteButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
},

deleteButtonText: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
},

});