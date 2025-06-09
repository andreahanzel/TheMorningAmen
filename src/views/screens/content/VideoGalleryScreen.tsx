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
    TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SearchIcon, StarIcon, PlayIcon } from '../../components/icons/CustomIcons';
import { SpiritualIcons } from '../../components/icons/SpiritualIcons';
import { WebView } from 'react-native-webview';
import { Modal } from 'react-native';


// Import video data
import videosData from '../../../models/data/videos.json';


const { width, height } = Dimensions.get('window');

interface Video {
    id: string;
    title: string;
    description: string;
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
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchModal, setShowSearchModal] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const cardAnims = useRef(videos.map(() => new Animated.Value(0))).current;
    const iconRotateAnims = useRef(videos.map(() => new Animated.Value(0))).current;
    const iconScaleAnims = useRef(videos.map(() => new Animated.Value(0))).current;


    useEffect(() => {
        startAnimations();
        startIconAnimations();
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

    // Function to convert YouTube URL to embed format
    const convertToEmbedUrl = (url: string) => {
        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    };

    // Play video function
    const playVideo = async (videoUrl: string, title: string) => {
        // Check if we're on web/desktop
        if (Platform.OS === 'web') {
            // On web, directly open YouTube URL in new tab
            window.open(videoUrl, '_blank');
        } else {
            // On mobile, show the choice alert
            Alert.alert(
                'Play Video',
                'How would you like to watch this video?',
                [
                    {
                        text: 'Watch in App',
                        onPress: () => {
                            setSelectedVideoUrl(convertToEmbedUrl(videoUrl));
                            setShowVideoModal(true);
                        }
                    },
                    {
                        text: 'Open YouTube',
                        onPress: async () => {
                            try {
                                const supported = await Linking.canOpenURL(videoUrl);
                                if (supported) {
                                    await Linking.openURL(videoUrl);
                                } else {
                                    Alert.alert('Error', 'Unable to open YouTube');
                                }
                            } catch (error) {
                                Alert.alert('Error', 'Unable to open YouTube');
                            }
                        }
                    },
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    }
                ]
            );
        }
    };

    // Function to start icon animations for all video cards
        const startIconAnimations = () => {
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

            // Add scale animation
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

    // Function to get custom icon for video category
    const getCategoryIcon = (category: string) => {
        const iconProps = { size: 48, gradient: false, color: '#FFFFFF' };
        switch (category) {
            case 'Purpose': return <SpiritualIcons.Purpose {...iconProps} />;
            case 'Prayer': return <SpiritualIcons.Peace {...iconProps} />;
            case 'Faith': return <SpiritualIcons.Faith {...iconProps} />;
            case 'Love': return <SpiritualIcons.Love {...iconProps} />;
            case 'Gratitude': return <SpiritualIcons.Gratitude {...iconProps} />;
            case 'Peace': return <SpiritualIcons.Peace {...iconProps} />;
            default: return <SpiritualIcons.Joy {...iconProps} />;
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
                                <StarIcon 
                                    size={20} 
                                    color={video.isFavorite ? '#FFD700' : 'rgba(255,255,255,0.8)'} 
                                    filled={video.isFavorite} 
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Video Thumbnail */}
                        <View style={styles.thumbnailContainer}>
                            <View style={styles.thumbnailBackground}>
                                <Animated.View 
                                    style={[
                                        styles.customIconContainer,
                                        {
                                            transform: [
                                                {
                                                    rotate: iconRotateAnims[index].interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: ['0deg', '360deg'],
                                                    }),
                                                },
                                            ],
                                        },
                                    ]}
                                >
                                    {getCategoryIcon(video.category)}
                                </Animated.View>
                                <View style={styles.playButton}>
                                    <LinearGradient
                                        colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                                        style={styles.playButtonGradient}
                                    >
                                        <PlayIcon size={14} color="#333333" />
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
                        
                        <TouchableOpacity 
                            style={styles.searchButton}
                            onPress={() => setShowSearchModal(true)}
                        >
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

        {/* Video Player Modal */}
            <Modal
                visible={showVideoModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowVideoModal(false)}
            >
                <View style={styles.videoModalContainer}>
                    <View style={styles.videoModalContent}>
                        <View style={styles.videoModalHeader}>
                            <Text style={styles.videoModalTitle}>Video Player</Text>
                            <TouchableOpacity
                                style={styles.videoCloseButton}
                                onPress={() => setShowVideoModal(false)}
                            >
                                <Text style={styles.videoCloseText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.videoPlayerContainer}>
                            <WebView
                                style={styles.videoPlayer}
                                source={{ uri: selectedVideoUrl }}
                                allowsFullscreenVideo={true}
                                mediaPlaybackRequiresUserAction={false}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                startInLoadingState={true}
                                renderLoading={() => (
                                    <View style={styles.videoLoadingContainer}>
                                        <Text style={styles.videoLoadingText}>Loading video...</Text>
                                    </View>
                                )}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

             {/* Search Modal */}
                <Modal
                    visible={showSearchModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowSearchModal(false)}
                >
                    <View style={styles.searchModalContainer}>
                        <View style={styles.searchModalContent}>
                            <View style={styles.searchModalHeader}>
                                <Text style={styles.searchModalTitle}>Search Videos</Text>
                                <TouchableOpacity
                                    style={styles.searchCloseButton}
                                    onPress={() => setShowSearchModal(false)}
                                >
                                    <Text style={styles.searchCloseText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                            
                            <View style={styles.searchInputContainer}>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search videos by title, author, or category..."
                                    placeholderTextColor="rgba(255,255,255,0.6)"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    autoFocus={true}
                                />
                            </View>
                            
                            <ScrollView style={styles.searchResults}>
                                {videos
                                    .filter(video => 
                                        searchQuery === '' || 
                                        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        video.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        video.category.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map((video, index) => (
                                        <TouchableOpacity
                                            key={video.id}
                                            style={styles.searchResultItem}
                                            onPress={() => {
                                                setShowSearchModal(false);
                                                playVideo(video.videoUrl, video.title);
                                            }}
                                        >
                                            <View style={styles.searchResultContent}>
                                                <Text style={styles.searchResultTitle}>{video.title}</Text>
                                                <Text style={styles.searchResultAuthor}>by {video.author}</Text>
                                                <Text style={styles.searchResultCategory}>{video.category} • {video.duration}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                }
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
                </>
            );
        }

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

    videoLoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },

    videoLoadingText: {
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        color: '#FFFFFF',
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

    customIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },

    videoModalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    videoModalContent: {
        width: '95%',
        height: '80%',
        backgroundColor: '#333333',
        borderRadius: 20,
        overflow: 'hidden',
    },

    videoModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#444444',
    },

    videoModalTitle: {
        fontSize: 18,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
    },

    videoCloseButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    videoCloseText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },

    videoPlayerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },

    videoPlayer: {
        flex: 1,
        backgroundColor: '#000000',
    },

    searchModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
},

searchModalContent: {
    width: '90%',
    height: '70%',
    backgroundColor: '#333333',
    borderRadius: 20,
    overflow: 'hidden',
},

searchModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#444444',
},

searchModalTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_600SemiBold',
    color: '#FFFFFF',
},

searchCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
},

searchCloseText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
},

searchInputContainer: {
    padding: 20,
},

searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
},

searchResults: {
    flex: 1,
    padding: 20,
},

searchResultItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
},

searchResultContent: {},

searchResultTitle: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
},

searchResultAuthor: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
},

searchResultCategory: {
    fontSize: 12,
    fontFamily: 'Outfit_300Light',
    color: 'rgba(255, 255, 255, 0.6)',
},

});