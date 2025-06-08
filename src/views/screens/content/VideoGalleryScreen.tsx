// src/views/screens/content/VideoGalleryScreen.tsx
// Video gallery screen
// This screen displays inspirational videos in a grid layout with play functionality


// Imports for React and React Native components
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
    Linking,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// Import video data
import videosData from '../../../models/data/videos.json';

const { width, height } = Dimensions.get('window');

interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: string;
    videoUrl: string;
    category: string;
    author: string;
    date: string;
    views: string;
    isFavorite: boolean;
    verse: string;
    verseText: string;
}

interface VideoGalleryScreenProps {
    navigation: any;
}

// Video Gallery Screen Component
export const VideoGalleryScreen: React.FC<VideoGalleryScreenProps> = ({ navigation }) => {
    const [videos, setVideos] = useState<Video[]>(videosData);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const cardAnims = useRef(videos.map(() => new Animated.Value(0))).current;

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
        setVideos(prev =>
            prev.map(video =>
                video.id === id
                    ? { ...video, isFavorite: !video.isFavorite }
                    : video
            )
        );
    };

    // Play video function
    const playVideo = async (videoUrl: string, title: string) => {
        try {
            const supported = await Linking.canOpenURL(videoUrl);
            if (supported) {
                await Linking.openURL(videoUrl);
            } else {
                Alert.alert('Error', 'Unable to open video');
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to play video');
        }
    };

    // Refresh control
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    const categories = ['All', 'Purpose', 'Prayer', 'Faith', 'Love', 'Gratitude', 'Peace'];

    const filteredVideos = selectedCategory === 'All' 
        ? videos 
        : videos.filter(v => v.category === selectedCategory);

        // Function to get category colors
    const getCategoryColors = (category: string): [string, string, string] => {
        switch (category) {
            case 'Purpose':
                return ['#ff6b35', '#ff8c42', '#ffa726'];
            case 'Prayer':
                return ['#ff7043', '#ff5722', '#f4511e'];
            case 'Faith':
                return ['#ff9800', '#f57c00', '#ef6c00'];
            case 'Love':
                return ['#ffb74d', '#ffa726', '#ff9800'];
            case 'Gratitude':
                return ['#ffcc02', '#ffb300', '#ff8f00'];
            case 'Peace':
                return ['#ffd54f', '#ffca28', '#ffc107'];
            default:
                return ['#ff6b35', '#ff8c42', '#ffa726'];
        }
    };

    // Video Card Component
    const VideoCard = ({ video, index }: { video: Video; index: number }) => (
        <Animated.View
            style={[
                styles.videoCard,
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
                activeOpacity={0.9}
                onPress={() => playVideo(video.videoUrl, video.title)}
            >
                <BlurView intensity={20} style={styles.cardBlur}>
                    <LinearGradient
                        colors={getCategoryColors(video.category)}
                        style={styles.cardGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        {/* Card Header */}
                        <View style={styles.cardHeader}>
                            <View style={styles.categoryContainer}>
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)']}
                                    style={styles.categoryBadge}
                                >
                                    <Text style={styles.categoryText}>{video.category}</Text>
                                </LinearGradient>
                            </View>
                            
                            <TouchableOpacity
                                style={styles.favoriteButton}
                                onPress={() => toggleFavorite(video.id)}
                            >
                                <Text style={[
                                    styles.favoriteIcon,
                                    { color: video.isFavorite ? '#FFD700' : 'rgba(255,255,255,0.8)' }
                                ]}>
                                    {video.isFavorite ? '⭐' : '☆'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Video Thumbnail */}
                        <View style={styles.thumbnailContainer}>
                            <View style={styles.thumbnailBackground}>
                                <Text style={styles.thumbnailEmoji}>{video.thumbnail}</Text>
                                <View style={styles.playButton}>
                                    <LinearGradient
                                        colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                                        style={styles.playButtonGradient}
                                    >
                                        <Text style={styles.playIcon}>▶️</Text>
                                    </LinearGradient>
                                </View>
                                <View style={styles.durationBadge}>
                                    <Text style={styles.durationText}>{video.duration}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Content */}
                        <View style={styles.cardContent}>
                            <Text style={styles.videoTitle}>{video.title}</Text>
                            <Text style={styles.videoDescription}>{video.description}</Text>
                            
                            <View style={styles.verseContainer}>
                                <Text style={styles.verseText}>"{video.verseText}"</Text>
                                <Text style={styles.verseReference}>- {video.verse}</Text>
                            </View>
                        </View>

                        {/* Footer */}
                        <View style={styles.cardFooter}>
                            <View style={styles.authorInfo}>
                                <Text style={styles.authorName}>{video.author}</Text>
                                <Text style={styles.videoViews}>{video.views} views</Text>
                            </View>
                            <Text style={styles.dateText}>
                                {new Date(video.date).toLocaleDateString()}
                            </Text>
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
                            <Text style={styles.headerTitle}>Video Gallery</Text>
                            <Text style={styles.headerSubtitle}>Inspirational messages & teachings</Text>
                        </View>
                        
                        <TouchableOpacity style={styles.searchButton}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                                style={styles.searchGradient}
                            >
                                <Text style={styles.searchIcon}>🔍</Text>
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

                {/* Videos List */}
                <ScrollView
                    style={styles.videosList}
                    contentContainerStyle={styles.videosContent}
                    showsVerticalScrollIndicator={true}
                    bounces={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#FFFFFF"
                            colors={['#ff6b35']}
                        />
                    }
                >
                    {filteredVideos.map((video, index) => (
                        <VideoCard key={video.id} video={video} index={index} />
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

    videosList: {
        flex: 1,
    },

    videosContent: {
        paddingHorizontal: 20,
    },

    videoCard: {
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

    thumbnailContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },

    thumbnailBackground: {
        width: 140,
        height: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    thumbnailEmoji: {
        fontSize: 40,
        marginBottom: 8,
    },

    playButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
    },

    playButtonGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },

    playIcon: {
        fontSize: 14,
    },

    durationBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },

    durationText: {
        fontSize: 12,
        fontFamily: 'Outfit_500Medium',
        color: '#FFFFFF',
    },

    cardContent: {
        alignItems: 'center',
        marginBottom: 20,
    },

    videoTitle: {
        fontSize: 20,
        fontFamily: 'Outfit_700Bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 12,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    videoDescription: {
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
        fontSize: 14,
        fontFamily: 'LibreBaskerville_400Regular_Italic',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 8,
    },

    verseReference: {
        fontSize: 12,
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

    videoViews: {
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