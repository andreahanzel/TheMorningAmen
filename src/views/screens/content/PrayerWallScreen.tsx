// src/views/screens/content/PrayerWallScreen.tsx

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

// Enhanced Prayer Wall with custom icons, comments, images, and daily prayer tracking
//This file implements the Prayer Wall screen, allowing users to share prayer requests, view others' prayers, and interact with comments and images.

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
    TextInput,
    Platform,
    KeyboardAvoidingView,
    Alert,
    Modal,
    Image,
    RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { usePrayer } from '../../../controllers/contexts/PrayerContext';
import { SpiritualIcons } from '../../components/icons/SpiritualIcons';
import { 
    PrayerIcon, 
    CrossIcon, 
    BackIcon, 
    ShareIcon, 
    EditIcon, 
    DeleteIcon,
    CommentIcon,
    ImageIcon,
    HeartIcon,
    SendIcon
} from '../../components/icons/CustomIcons';

const { width, height } = Dimensions.get('window');

interface Comment {
    id: string;
    prayerId: string;
    text: string;
    authorName: string;
    isAnonymous: boolean;
    date: string;
    likes: number;
    userHasLiked: boolean;
}

interface Prayer {
    id: string;
    text: string;
    category: string;
    isAnonymous: boolean;
    authorName?: string;
    date: string;
    prayerCount: number;
    userHasPrayed: boolean;
    lastPrayedDate?: string;
    imageUri?: string;
    authorId: string; // To track who created the prayer
    comments: Comment[];
    commentsCount: number;
}

interface PrayerWallScreenProps {
    navigation: any;
}

export const PrayerWallScreen: React.FC<PrayerWallScreenProps> = ({ navigation }) => {
    const { prayers, loading, addPrayer, updatePrayer, deletePrayer, prayForRequest: contextPrayForRequest, addComment: contextAddComment, likeComment: contextLikeComment } = usePrayer();
    const [showAddForm, setShowAddForm] = useState(false);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [selectedPrayerId, setSelectedPrayerId] = useState<string>('');
    const [newPrayer, setNewPrayer] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('General');
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [authorName, setAuthorName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [editingPrayerId, setEditingPrayerId] = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');
    const [isCommentAnonymous, setIsCommentAnonymous] = useState(true);
    const [commentAuthorName, setCommentAuthorName] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [userId] = useState(() => Date.now().toString()); // Simple user ID generation

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const modalSlide = useRef(new Animated.Value(height)).current;
    const commentsModalSlide = useRef(new Animated.Value(height)).current;
    const cardAnims = useRef<Animated.Value[]>([]).current;

    const categories = ['General', 'Healing', 'Family', 'Guidance', 'Gratitude', 'Strength'];

    useEffect(() => {
        startAnimations();
        requestPermissions();
        initializeCardAnimations(prayers.length);
    }, [prayers.length]);

    useEffect(() => {
        console.log('Modal state changed:', { showAddForm });
    }, [showAddForm]);


    const requestPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
        }
    };



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


    const initializeCardAnimations = (count: number) => {
        cardAnims.length = 0;
        for (let i = 0; i < count; i++) {
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

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // Context automatically refreshes, just reset the loading state
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const showAddPrayerForm = () => {
    console.log('Opening add prayer form');
    setShowAddForm(true);
};

    // Function to hide the add prayer form
    const hideAddPrayerForm = () => {
    setShowAddForm(false);
    resetForm();
};

    const resetForm = () => {
        setNewPrayer('');
        setAuthorName('');
        setSelectedCategory('General');
        setIsAnonymous(true);
        setSelectedImage(null);
        setEditingPrayerId(null);
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to select image. Please try again.');
        }
    };

    const submitPrayer = async () => {
        if (!newPrayer.trim()) {
            Alert.alert('Prayer Required', 'Please enter your prayer request.');
            return;
        }

        if (!isAnonymous && !authorName.trim()) {
            Alert.alert('Name Required', 'Please enter your name or choose anonymous.');
            return;
        }

        setIsSubmitting(true);

        try {
            const prayerData = {
                text: newPrayer.trim(),
                category: selectedCategory,
                isAnonymous,
                authorName: isAnonymous ? undefined : authorName.trim(),
                imageUri: selectedImage || undefined,
                authorId: userId,
                userHasPrayed: false,
                comments: [],
            };

            if (editingPrayerId) {
                await updatePrayer(editingPrayerId, prayerData);
                Alert.alert('Success', 'Prayer updated successfully! 🙏');
            } else {
                await addPrayer(prayerData);
                Alert.alert('Success', 'Prayer shared successfully! 🙏');
            }

            hideAddPrayerForm();
        } catch (error) {
            Alert.alert('Error', 'Failed to submit prayer. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };



    // Check if user can pray for this request today
    const canPrayToday = (prayer: Prayer): boolean => {
        if (!prayer.lastPrayedDate) return true;
        
        const lastPrayed = new Date(prayer.lastPrayedDate);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - lastPrayed.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays >= 1;
    };

    // Function to handle praying for a request
    const handlePrayForRequest = async (prayerId: string) => {
        try {
            await contextPrayForRequest(prayerId);
            Alert.alert('Prayer Sent 🙏', 'Your prayer has been added to this request!');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to pray for request');
        }
    };

    // Wrapper to include canPrayToday check
    const editPrayer = (prayer: Prayer) => {
        if (prayer.authorId !== userId) {
            Alert.alert('Cannot Edit', 'You can only edit prayers you created.');
            return;
        }

        setEditingPrayerId(prayer.id);
        setNewPrayer(prayer.text);
        setSelectedCategory(prayer.category);
        setIsAnonymous(prayer.isAnonymous);
        setAuthorName(prayer.authorName || '');
        setSelectedImage(prayer.imageUri || null);
        showAddPrayerForm();
    };

    // Function to handle deleting a prayer
    const handleDeletePrayer = async (prayerId: string) => {
        Alert.alert(
            'Delete Prayer',
            'Are you sure you want to delete this prayer?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deletePrayer(prayerId);
                            Alert.alert('Success', 'Prayer deleted successfully');
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to delete prayer');
                        }
                    },
                },
            ]
        );
    };

    // Show comments modal
    const showComments = (prayerId: string) => {
        setSelectedPrayerId(prayerId);
        setShowCommentsModal(true);
        Animated.timing(commentsModalSlide, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const hideComments = () => {
        Animated.timing(commentsModalSlide, {
            toValue: height,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowCommentsModal(false);
            setNewComment('');
            setIsCommentAnonymous(true);
            setCommentAuthorName('');
        });
    };

        const submitComment = async () => {
        if (!newComment.trim()) {
            Alert.alert('Comment Required', 'Please enter your comment.');
            return;
        }

        if (!isCommentAnonymous && !commentAuthorName.trim()) {
            Alert.alert('Name Required', 'Please enter your name or choose anonymous.');
            return;
        }

        try {
            const comment: Comment = {
                id: Date.now().toString(),
                prayerId: selectedPrayerId,
                text: newComment.trim(),
                authorName: isCommentAnonymous ? 'Anonymous' : commentAuthorName.trim(),
                isAnonymous: isCommentAnonymous,
                date: new Date().toISOString(),
                likes: 0,
                userHasLiked: false,
            };

            const updatedPrayers = prayers.map(prayer => {
                if (prayer.id === selectedPrayerId) {
                    return {
                        ...prayer,
                        comments: [...prayer.comments, comment],
                        commentsCount: prayer.commentsCount + 1,
                    };
                }
                return prayer;
            });

            await contextAddComment(selectedPrayerId, comment);
            // Clear form and close modal
            setNewComment('');
            setIsCommentAnonymous(true);
            setCommentAuthorName('');
            
            // Force re-render by updating state
            setTimeout(() => {
                Alert.alert('Comment Added', 'Your comment has been added! 💬', [
                    { text: 'OK', onPress: () => {} }
                ]);
            }, 100);
            
        } catch (error) {
            console.error('Error adding comment:', error);
            Alert.alert('Error', 'Failed to add comment. Please try again.');
        }
    };

    
    const likeComment = async (commentId: string) => {
        try {
            const updatedPrayers = prayers.map(prayer => {
                if (prayer.id === selectedPrayerId) {
                    const updatedComments = prayer.comments.map(comment => {
                        if (comment.id === commentId) {
                            return {
                                ...comment,
                                likes: comment.userHasLiked ? comment.likes - 1 : comment.likes + 1,
                                userHasLiked: !comment.userHasLiked,
                            };
                        }
                        return comment;
                    });
                    return { ...prayer, comments: updatedComments };
                }
                return prayer;
            });

            await contextLikeComment(selectedPrayerId, commentId);
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    const getCategoryColors = (category: string): [string, string, string] => {
        switch (category) {
            case 'Healing':
                return ['#4caf50', '#66bb6a', '#81c784'];
            case 'Family':
                return ['#ff6b35', '#ff8c42', '#ffa726'];
            case 'Guidance':
                return ['#2196f3', '#42a5f5', '#64b5f6'];
            case 'Gratitude':
                return ['#ffeb3b', '#ffc107', '#ff9800'];
            case 'Strength':
                return ['#9c27b0', '#ab47bc', '#ba68c8'];
            case 'General':
            default:
                return ['#ff7043', '#ff5722', '#f4511e'];
        }
    };

    const getCategoryIcon = (category: string) => {
        const iconProps = { size: 16, gradient: true };
        switch (category) {
            case 'Healing': return <SpiritualIcons.Rest {...iconProps} />;
            case 'Family': return <SpiritualIcons.Love {...iconProps} />;
            case 'Guidance': return <SpiritualIcons.Purpose {...iconProps} />;
            case 'Gratitude': return <SpiritualIcons.Joy {...iconProps} />;
            case 'Strength': return <SpiritualIcons.Strength {...iconProps} />;
            case 'General':
            default: return <SpiritualIcons.Peace {...iconProps} />;
        }
    };

    const selectedPrayer = prayers.find(p => p.id === selectedPrayerId);

    // Prayer Card Component
    const PrayerCard = ({ prayer, index }: { prayer: Prayer; index: number }) => (
        <Animated.View
            style={[
                styles.prayerCard,
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
            <BlurView intensity={20} style={styles.cardBlur}>
                <LinearGradient
                    colors={getCategoryColors(prayer.category)}
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
                                {getCategoryIcon(prayer.category)}
                                <Text style={styles.categoryText}>{prayer.category}</Text>
                            </LinearGradient>
                        </View>
                        
                        <View style={styles.headerActions}>
                            {prayer.authorId === userId && (
                                <>
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => editPrayer(prayer)}
                                    >
                                        <EditIcon size={16} color="#FFFFFF" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => handleDeletePrayer(prayer.id)}
                                    >
                                        <DeleteIcon size={16} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </>
                            )}
                            <Text style={styles.dateText}>
                                {new Date(prayer.date).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>

                    {/* Image if present */}
                    {prayer.imageUri && (
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: prayer.imageUri }} style={styles.prayerImage} />
                        </View>
                    )}

                    {/* Prayer Text */}
                    <Text style={styles.prayerText}>{prayer.text}</Text>

                    {/* Footer */}
                    <View style={styles.cardFooter}>
                        <View style={styles.authorInfo}>
                            <Text style={styles.authorText}>
                                {prayer.isAnonymous ? 'Anonymous' : prayer.authorName}
                            </Text>
                            <Text style={styles.prayerCount}>
                                {prayer.prayerCount} prayers 
                            </Text>
                        </View>

                        <View style={styles.cardActions}>
                            <TouchableOpacity
                                style={styles.commentButton}
                                onPress={() => showComments(prayer.id)}
                            >
                                <CommentIcon size={16} color="#FFFFFF" />
                                <Text style={styles.commentButtonText}>{prayer.commentsCount}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.prayButton,
                                    !canPrayToday(prayer) && styles.prayButtonDisabled
                                ]}
                                onPress={() => handlePrayForRequest(prayer.id)}
                                disabled={!canPrayToday(prayer)}
                            >
                                <LinearGradient
                                    colors={
                                        !canPrayToday(prayer)
                                            ? ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']
                                            : ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.3)']
                                    }
                                    style={styles.prayButtonGradient}
                                >
                                    <View style={styles.prayButtonContent}>
                                        <Text style={styles.prayButtonText}>
                                            {!canPrayToday(prayer) ? 'Prayed Today' : 'Pray'}
                                        </Text>
                                        {!canPrayToday(prayer) ? 
                                            <CrossIcon size={12} color="#FFFFFF" /> : 
                                            <PrayerIcon size={12} color="#FFFFFF" />
                                        }
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
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
                            <Text style={styles.headerTitle}>Prayer Wall</Text>
                            <Text style={styles.headerSubtitle}>Share prayers & lift each other up</Text>
                        </View>
                        
                        <TouchableOpacity 
                            style={styles.addButton}
                            onPress={() => {
                                showAddPrayerForm();
                            }}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#ffeb3b', '#ff9800', '#ff6b35']}
                                style={styles.addButtonGradient}
                            >
                                <View style={styles.addButtonContent}>
                                    <Text style={styles.addButtonText}>Add Prayer</Text>
                                    <CrossIcon size={16} color="#FFFFFF" />
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Prayers List */}
                <ScrollView
                    style={styles.prayersList}
                    contentContainerStyle={styles.prayersContent}
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
                    {prayers.length === 0 ? (
                        <Animated.View
                            style={[
                                styles.emptyState,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }],
                                },
                            ]}
                        >
                            <PrayerIcon size={64} color="#FFFFFF" />
                            <Text style={styles.emptyStateTitle}>No Prayers Yet</Text>
                            <Text style={styles.emptyStateText}>
                                Be the first to share a prayer request or blessing with the community.
                            </Text>
                        </Animated.View>
                    ) : (
                        prayers.map((prayer, index) => (
                            <PrayerCard key={prayer.id} prayer={prayer} index={index} />
                        ))
                    )}
                    
                    <View style={styles.bottomSpacing} />
                </ScrollView>

                {/* Prayer Modal */}
                <Modal
                    visible={showAddForm}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={hideAddPrayerForm}
                    statusBarTranslucent={true}
                    presentationStyle="overFullScreen"
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.modalContainer}
                    >
                    <TouchableOpacity
                            style={styles.modalOverlay}
                            activeOpacity={1}
                            onPress={hideAddPrayerForm}
                        />
                        
                                <View style={styles.modalContent}>
                                    <BlurView intensity={40} style={styles.modalBlur}>
                                        {/* all your modal content */}
                                    </BlurView>
                                </View>
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
                                    style={styles.modalGradient}
                                >
                                    {/* Modal Header */}
                                    <View style={styles.modalHeader}>
                                        <View style={styles.modalHeaderLeft}>
                                            <PrayerIcon size={20} color="#333333" />
                                            <Text style={styles.modalTitle}>
                                                {editingPrayerId ? 'Edit Prayer' : 'Share Your Prayer'}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.closeButton}
                                            onPress={hideAddPrayerForm}
                                        >
                                            <Text style={styles.closeButtonText}>✕</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                                        {/* Prayer Input */}
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLabel}>Prayer Request or Blessing</Text>
                                            <TextInput
                                                style={styles.textInput}
                                                value={newPrayer}
                                                onChangeText={setNewPrayer}
                                                placeholder="Share what's on your heart..."
                                                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                                                multiline
                                                numberOfLines={4}
                                                maxLength={1500}
                                            />
                                            <Text style={styles.characterCount}>
                                                {newPrayer.length}/1500 characters
                                            </Text>
                                        </View>

                                        {/* Image Upload */}
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLabel}>Add Image (Optional)</Text>
                                            <TouchableOpacity
                                                style={styles.imageUploadButton}
                                                onPress={pickImage}
                                            >
                                                <LinearGradient
                                                    colors={['#ff6b35', '#ff8c42']}
                                                    style={styles.imageUploadGradient}
                                                >
                                                    <ImageIcon size={20} color="#FFFFFF" />
                                                    <Text style={styles.imageUploadText}>
                                                        {selectedImage ? 'Change Image' : 'Select Image'}
                                                    </Text>
                                                </LinearGradient>
                                            </TouchableOpacity>
                                            
                                            {selectedImage && (
                                                <View style={styles.selectedImageContainer}>
                                                    <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                                                    <TouchableOpacity
                                                        style={styles.removeImageButton}
                                                        onPress={() => setSelectedImage(null)}
                                                    >
                                                        <Text style={styles.removeImageText}>✕</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        </View>

                                        {/* Category Selection */}
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLabel}>Category</Text>
                                            <ScrollView
                                                horizontal
                                                showsHorizontalScrollIndicator={false}
                                                style={styles.categoriesScroll}
                                            >
                                                {categories.map((category) => (
                                                    <TouchableOpacity
                                                        key={category}
                                                        style={[
                                                            styles.categoryChip,
                                                            selectedCategory === category && styles.categoryChipSelected
                                                        ]}
                                                        onPress={() => setSelectedCategory(category)}
                                                    >
                                                        <View style={styles.categoryChipContent}>
                                                            {getCategoryIcon(category)}
                                                            <Text style={[
                                                                styles.categoryChipText,
                                                                selectedCategory === category && styles.categoryChipTextSelected
                                                            ]}>
                                                                {category}
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>

                                        {/* Author Options */}
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLabel}>How would you like to share?</Text>
                                            
                                            <TouchableOpacity
                                                style={styles.optionRow}
                                                onPress={() => setIsAnonymous(true)}
                                            >
                                                <View style={[
                                                    styles.radioButton,
                                                    isAnonymous && styles.radioButtonSelected
                                                ]}>
                                                    {isAnonymous && <View style={styles.radioButtonInner} />}
                                                </View>
                                                <Text style={styles.optionText}>Anonymous</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.optionRow}
                                                onPress={() => setIsAnonymous(false)}
                                            >
                                                <View style={[
                                                    styles.radioButton,
                                                    !isAnonymous && styles.radioButtonSelected
                                                ]}>
                                                    {!isAnonymous && <View style={styles.radioButtonInner} />}
                                                </View>
                                                <Text style={styles.optionText}>With my name</Text>
                                            </TouchableOpacity>

                                            {!isAnonymous && (
                                                <TextInput
                                                    style={styles.nameInput}
                                                    value={authorName}
                                                    onChangeText={setAuthorName}
                                                    placeholder="Enter your name"
                                                    placeholderTextColor="rgba(0, 0, 0, 0.5)"
                                                    maxLength={50}
                                                />
                                            )}
                                        </View>

                                        {/* Submit Button */}
                                        <TouchableOpacity
                                            style={styles.submitButton}
                                            onPress={submitPrayer}
                                            disabled={isSubmitting}
                                        >
                                            <LinearGradient
                                                colors={
                                                    isSubmitting
                                                        ? ['#cccccc', '#999999']
                                                        : ['#ff6b35', '#ff8c42', '#ffa726']
                                                }
                                                style={styles.submitButtonGradient}
                                            >
                                                <View style={styles.submitButtonContent}>
                                                    <Text style={styles.submitButtonText}>
                                                        {isSubmitting ? 'Submitting...' : (editingPrayerId ? 'Update Prayer' : 'Share Prayer')}
                                                    </Text>
                                                    {!isSubmitting && <PrayerIcon size={16} color="#FFFFFF" />}
                                                </View>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </LinearGradient>
                    </KeyboardAvoidingView>
                </Modal>

                {/* Comments Modal */}
                <Modal
                    visible={showCommentsModal}
                    transparent={true}
                    animationType="none"
                    onRequestClose={hideComments}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.modalContainer}
                        pointerEvents="box-none"
                    >
                        <TouchableOpacity
                            style={styles.modalOverlay}
                            activeOpacity={1}
                            onPress={hideComments}
                        />
                        
                        <Animated.View
                            style={[
                                styles.commentsModalContent,
                                {
                                    transform: [{ translateY: commentsModalSlide }],
                                },
                            ]}
                        >
                            <BlurView intensity={40} style={styles.modalBlur}>
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
                                    style={styles.modalGradient}
                                >
                                    {/* Comments Header */}
                                    <View style={styles.modalHeader}>
                                        <View style={styles.modalHeaderLeft}>
                                            <CommentIcon size={20} color="#333333" />
                                            <Text style={styles.modalTitle}>
                                                Comments ({selectedPrayer?.commentsCount || 0})
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.closeButton}
                                            onPress={hideComments}
                                        >
                                            <Text style={styles.closeButtonText}>✕</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Comments List */}
                                    <ScrollView 
                                        style={styles.commentsList} 
                                        showsVerticalScrollIndicator={false}
                                        nestedScrollEnabled={true}
                                        keyboardShouldPersistTaps="handled"
                                    >
                                        {selectedPrayer?.comments.length === 0 ? (
                                            <View style={styles.noCommentsContainer}>
                                                <CommentIcon size={48} color="#cccccc" />
                                                <Text style={styles.noCommentsText}>No comments yet</Text>
                                                <Text style={styles.noCommentsSubtext}>
                                                    Be the first to share encouragement
                                                </Text>
                                            </View>
                                        ) : (
                                            selectedPrayer?.comments.map((comment) => (
                                                <View key={comment.id} style={styles.commentCard}>
                                                    <View style={styles.commentHeader}>
                                                        <Text style={styles.commentAuthor}>
                                                            {comment.authorName}
                                                        </Text>
                                                        <Text style={styles.commentDate}>
                                                            {new Date(comment.date).toLocaleDateString()}
                                                        </Text>
                                                    </View>
                                                    <Text style={styles.commentText}>{comment.text}</Text>
                                                    <View style={styles.commentFooter}>
                                                        <TouchableOpacity
                                                            style={styles.likeButton}
                                                            onPress={() => likeComment(comment.id)}
                                                        >
                                                            <HeartIcon 
                                                                size={16} 
                                                                color={comment.userHasLiked ? "#ff6b35" : "#999999"} 
                                                                filled={comment.userHasLiked}
                                                            />
                                                            <Text style={[
                                                                styles.likeCount,
                                                                comment.userHasLiked && styles.likeCountActive
                                                            ]}>
                                                                {comment.likes}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            ))
                                        )}
                                    </ScrollView>

                                    {/* Add Comment Section */}
                                    <View style={styles.addCommentSection}>
                                        <Text style={styles.inputLabel}>Add Your Comment</Text>
                                        
                                        {/* Comment Input */}
                                        <TextInput
                                            style={styles.commentInput}
                                            value={newComment}
                                            onChangeText={setNewComment}
                                            placeholder="Share your thoughts or encouragement..."
                                            placeholderTextColor="rgba(0, 0, 0, 0.5)"
                                            multiline
                                            numberOfLines={2}
                                            maxLength={500}
                                        />

                                        {/* Comment Author Options */}
                                        <View style={styles.commentAuthorOptions}>
                                            <TouchableOpacity
                                                style={styles.optionRow}
                                                onPress={() => setIsCommentAnonymous(true)}
                                            >
                                                <View style={[
                                                    styles.radioButtonSmall,
                                                    isCommentAnonymous && styles.radioButtonSelected
                                                ]}>
                                                    {isCommentAnonymous && <View style={styles.radioButtonInnerSmall} />}
                                                </View>
                                                <Text style={styles.optionTextSmall}>Anonymous</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.optionRow}
                                                onPress={() => setIsCommentAnonymous(false)}
                                            >
                                                <View style={[
                                                    styles.radioButtonSmall,
                                                    !isCommentAnonymous && styles.radioButtonSelected
                                                ]}>
                                                    {!isCommentAnonymous && <View style={styles.radioButtonInnerSmall} />}
                                                </View>
                                                <Text style={styles.optionTextSmall}>With my name</Text>
                                            </TouchableOpacity>
                                        </View>

                                        {!isCommentAnonymous && (
                                            <TextInput
                                                style={styles.commentNameInput}
                                                value={commentAuthorName}
                                                onChangeText={setCommentAuthorName}
                                                placeholder="Your name"
                                                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                                                maxLength={30}
                                            />
                                        )}

                                        {/* Submit Comment Button */}
                                        <TouchableOpacity
                                            style={styles.submitCommentButton}
                                            onPress={submitComment}
                                        >
                                            <LinearGradient
                                                colors={['#ff6b35', '#ff8c42']}
                                                style={styles.submitCommentGradient}
                                            >
                                                <View style={styles.submitCommentContent}>
                                                    <Text style={styles.submitCommentText}>Post Comment</Text>
                                                    <SendIcon size={14} color="#FFFFFF" />
                                                </View>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                </LinearGradient>
                            </BlurView>
                        </Animated.View>
                    </KeyboardAvoidingView>
                </Modal>

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

    addButton: {
        borderRadius: 25,
        shadowColor: '#ffeb3b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },

    addButtonGradient: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
    },

    addButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    addButtonText: {
        fontSize: 14,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    prayersList: {
        flex: 1,
    },

    prayersContent: {
        paddingHorizontal: 20,
    },

    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
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
        paddingHorizontal: 40,
    },

    prayerCard: {
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
        marginBottom: 16,
    },

    categoryContainer: {},

    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        gap: 6,
    },

    categoryText: {
        fontSize: 12,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    actionButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    dateText: {
        fontSize: 12,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255, 255, 255, 0.8)',
    },

    imageContainer: {
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },

    prayerImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },

    prayerText: {
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        color: '#FFFFFF',
        lineHeight: 24,
        marginBottom: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    authorInfo: {
        flex: 1,
    },

    authorText: {
        fontSize: 14,
        fontFamily: 'Outfit_500Medium',
        color: 'rgba(255, 255, 255, 0.9)',
    },

    prayerCount: {
        fontSize: 12,
        fontFamily: 'Outfit_300Light',
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 2,
    },

    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    commentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },

    commentButtonText: {
        fontSize: 12,
        fontFamily: 'Outfit_500Medium',
        color: '#FFFFFF',
    },

    prayButton: {
        borderRadius: 16,
    },

    prayButtonDisabled: {
        opacity: 0.6,
    },

    prayButtonGradient: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    prayButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    prayButtonText: {
        fontSize: 12,
        fontFamily: 'Outfit_500Medium',
        color: '#FFFFFF',
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

    // Modal Styles
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },

    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalContent: {
        maxHeight: height * 0.9,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'transparent',
    },

    commentsModalContent: {
        height: height * 0.75,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
        marginTop: Platform.OS === 'ios' ? 60 : 40,
    },

    modalBlur: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
        flex: 1,
    },

    modalGradient: {
        padding: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        flex: 1,
    },

    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: Platform.OS === 'ios' ? 60 : 40,
        paddingTop: 0,
        paddingRight: 50,
    },

    modalHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    modalTitle: {
        fontSize: 20,
        fontFamily: 'Outfit_700Bold',
        color: '#333333',
    },

    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 2,
        right: 10,
        zIndex: 1000,
    },

    closeButtonText: {
        fontSize: 16,
        color: '#666666',
        fontWeight: 'bold',
    },

    modalScroll: {
        flex: 1,
    },

    inputContainer: {
        marginBottom: 20,
    },

    inputLabel: {
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
        color: '#333333',
        marginBottom: 12,
    },

    textInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        color: '#333333',
        minHeight: 100,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },

    characterCount: {
        fontSize: 12,
        fontFamily: 'Outfit_300Light',
        color: '#666666',
        textAlign: 'right',
        marginTop: 8,
    },

    imageUploadButton: {
        borderRadius: 16,
        overflow: 'hidden',
    },

    imageUploadGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 8,
    },

    imageUploadText: {
        fontSize: 16,
        fontFamily: 'Outfit_500Medium',
        color: '#FFFFFF',
    },

    selectedImageContainer: {
        marginTop: 12,
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
    },

    selectedImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },

    removeImageButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    removeImageText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },

    categoriesScroll: {
        marginTop: 8,
    },

    categoryChip: {
        borderRadius: 16,
        marginRight: 12,
        overflow: 'hidden',
    },

    categoryChipSelected: {
        transform: [{ scale: 1.05 }],
    },

    categoryChipContent: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        gap: 6,
    },

    categoryChipText: {
        fontSize: 14,
        fontFamily: 'Outfit_500Medium',
        color: '#333333',
    },

    categoryChipTextSelected: {
        color: '#ff6b35',
        fontWeight: 'bold',
    },

    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },

    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ff6b35',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    radioButtonSmall: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#ff6b35',
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },

    radioButtonSelected: {
        backgroundColor: '#ff6b35',
    },

    radioButtonInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
    },

    radioButtonInnerSmall: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
    },

    optionText: {
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        color: '#333333',
    },

    optionTextSmall: {
        fontSize: 14,
        fontFamily: 'Outfit_400Regular',
        color: '#333333',
    },

    nameInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        color: '#333333',
        marginTop: 12,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },

    submitButton: {
        borderRadius: 20,
        marginTop: 12,
        shadowColor: '#ff6b35',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },

    submitButtonGradient: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 20,
        alignItems: 'center',
    },

    submitButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    submitButtonText: {
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    // Comments Modal Styles
    commentsList: {
        maxHeight: height * 0.35,
        marginBottom: 20,
    },

    noCommentsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },

    noCommentsText: {
        fontSize: 18,
        fontFamily: 'Outfit_600SemiBold',
        color: '#999999',
        marginTop: 12,
    },

    noCommentsSubtext: {
        fontSize: 14,
        fontFamily: 'Outfit_400Regular',
        color: '#cccccc',
        marginTop: 4,
        textAlign: 'center',
    },

    commentCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },

    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },

    commentAuthor: {
        fontSize: 14,
        fontFamily: 'Outfit_600SemiBold',
        color: '#333333',
    },

    commentDate: {
        fontSize: 12,
        fontFamily: 'Outfit_400Regular',
        color: '#666666',
    },

    commentText: {
        fontSize: 14,
        fontFamily: 'Outfit_400Regular',
        color: '#333333',
        lineHeight: 20,
        marginBottom: 8,
    },

    commentFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    likeCount: {
        fontSize: 12,
        fontFamily: 'Outfit_500Medium',
        color: '#999999',
    },

    likeCountActive: {
        color: '#ff6b35',
    },

    addCommentSection: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
        paddingTop: 20,
    },

    commentInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        fontFamily: 'Outfit_400Regular',
        color: '#333333',
        minHeight: 60,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        marginBottom: 12,
    },

    commentAuthorOptions: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 12,
    },

    commentNameInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 8,
        padding: 8,
        fontSize: 14,
        fontFamily: 'Outfit_400Regular',
        color: '#333333',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        marginBottom: 12,
    },

    submitCommentButton: {
        borderRadius: 16,
        overflow: 'hidden',
    },

    submitCommentGradient: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 16,
        alignItems: 'center',
    },

    submitCommentContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    submitCommentText: {
        fontSize: 14,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
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