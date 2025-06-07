// src/views/components/cards/DevotionCard.tsx
// Reusable devotion card component with glassmorphism design
// This component displays a devotion with a title, excerpt, verse, author, and category.
// It includes a favorite toggle button and supports animations for smooth transitions.
// The card uses a linear gradient background and a blur effect for a modern look.

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// Define the structure of a Devotion object
export interface Devotion {
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
    image: string;
    isFavorite: boolean;
}

// Props for the DevotionCard component
interface DevotionCardProps {
    devotion: Devotion;
    onPress: () => void;
    onToggleFavorite: (id: string) => void;
    animValue?: Animated.Value;
    style?: any;
}

// DevotionCard component
export const DevotionCard: React.FC<DevotionCardProps> = ({
    devotion,
    onPress,
    onToggleFavorite,
    animValue,
    style,
}) => {
    const handleFavoritePress = (e: any) => {
        e.stopPropagation();
        onToggleFavorite(devotion.id);
    };

    const cardStyle = animValue
        ? [
            styles.container,
            style,
            {
                opacity: animValue,
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
                            outputRange: [0.9, 1],
                        }),
                    },
                ],
            },
        ]
        : [styles.container, style];

    return (
        <Animated.View style={cardStyle}>
            <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
                <BlurView intensity={20} style={styles.blur}>
                    <LinearGradient
                        colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']}
                        style={styles.gradient}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.categoryContainer}>
                                <LinearGradient
                                    colors={['rgba(255,235,59,0.3)', 'rgba(255,152,0,0.3)']}
                                    style={styles.categoryBadge}
                                >
                                    <Text style={styles.categoryText}>{devotion.category}</Text>
                                </LinearGradient>
                            </View>
                            
                            <TouchableOpacity
                                style={styles.favoriteButton}
                                onPress={handleFavoritePress}
                            >
                                <Text style={[
                                    styles.favoriteIcon,
                                    { color: devotion.isFavorite ? '#FFD700' : 'rgba(255,255,255,0.6)' }
                                ]}>
                                    {devotion.isFavorite ? '⭐' : '☆'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Content */}
                        <View style={styles.content}>
                            <Text style={styles.emoji}>{devotion.image}</Text>
                            <Text style={styles.title}>{devotion.title}</Text>
                            <Text style={styles.excerpt}>{devotion.excerpt}</Text>
                            
                            <View style={styles.verseContainer}>
                                <Text style={styles.verseText}>"{devotion.verseText}"</Text>
                                <Text style={styles.verseReference}>- {devotion.verse}</Text>
                            </View>
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <View style={styles.authorInfo}>
                                <Text style={styles.authorName}>{devotion.author}</Text>
                                <Text style={styles.readTime}>{devotion.readTime}</Text>
                            </View>
                            <Text style={styles.date}>
                                {new Date(devotion.date).toLocaleDateString()}
                            </Text>
                        </View>

                        {/* Floating particles */}
                        <View style={styles.particles}>
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

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        borderRadius: 24,
    },

    blur: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    gradient: {
        padding: 24,
        position: 'relative',
    },

    header: {
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
        borderColor: 'rgba(255, 255, 255, 0.2)',
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

    content: {
        alignItems: 'center',
        marginBottom: 20,
    },

    emoji: {
        fontSize: 48,
        marginBottom: 16,
    },

    title: {
        fontSize: 22,
        fontFamily: 'Outfit_700Bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 12,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    excerpt: {
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },

    verseContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
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

    footer: {
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

    date: {
        fontSize: 12,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255, 255, 255, 0.7)',
    },

    particles: {
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
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
});