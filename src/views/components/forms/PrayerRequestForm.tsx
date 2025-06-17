// src/views/components/forms/PrayerRequestForm.tsx

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

// Beautiful Prayer Request Form with animations and Firestore integration

    import React, { useState, useRef } from 'react';
    import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Animated,
    Alert,
    Platform,
    Image,
    } from 'react-native';
    import { LinearGradient } from 'expo-linear-gradient';
    import { BlurView } from 'expo-blur';
    import * as ImagePicker from 'expo-image-picker';
    import { usePrayer } from '../../../controllers/contexts/PrayerContext';
    import { authService } from '../../../models/services/AuthService';
    import { SpiritualIcons } from '../icons/SpiritualIcons';
    import { 
    PrayerIcon, 
    CrossIcon, 
    ImageIcon,
    SendIcon
    } from '../icons/CustomIcons';

    interface PrayerRequestFormProps {
    onSubmit?: () => void;
    onCancel?: () => void;
    editingPrayer?: any;
    }

    export const PrayerRequestForm: React.FC<PrayerRequestFormProps> = ({
    onSubmit,
    onCancel,
    editingPrayer
    }) => {
    const { addPrayer, updatePrayer } = usePrayer();
    const [prayerText, setPrayerText] = useState(editingPrayer?.text || '');
    const [selectedCategory, setSelectedCategory] = useState(editingPrayer?.category || 'General');
    const [isAnonymous, setIsAnonymous] = useState(editingPrayer?.isAnonymous ?? true);
    const [authorName, setAuthorName] = useState(editingPrayer?.authorName || '');
    const [selectedImage, setSelectedImage] = useState<string | null>(editingPrayer?.imageUri || null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Animation values
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        }).start();
    }, []);

    const categories = [
        { name: 'General', icon: SpiritualIcons.Peace },
        { name: 'Healing', icon: SpiritualIcons.Rest },
        { name: 'Family', icon: SpiritualIcons.Love },
        { name: 'Guidance', icon: SpiritualIcons.Purpose },
        { name: 'Gratitude', icon: SpiritualIcons.Joy },
        { name: 'Strength', icon: SpiritualIcons.Strength },
    ];

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
        Alert.alert('Error', 'Failed to select image');
        }
    };

    const handleSubmit = async () => {
        if (!prayerText.trim()) {
        Alert.alert('Prayer Required', 'Please enter your prayer request');
        return;
        }

        if (!isAnonymous && !authorName.trim()) {
        Alert.alert('Name Required', 'Please enter your name or choose anonymous');
        return;
        }

        setIsSubmitting(true);

        // Button press animation
        Animated.sequence([
        Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }),
        ]).start();

        try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            Alert.alert('Error', 'You must be logged in to submit a prayer');
            return;
        }

        const prayerData = {
            text: prayerText.trim(),
            category: selectedCategory,
            isAnonymous,
            authorName: isAnonymous ? undefined : authorName.trim(),
            imageUri: selectedImage || undefined,
            authorId: currentUser.id,
            userHasPrayed: false,
            comments: [],
        };

        if (editingPrayer) {
            await updatePrayer(editingPrayer.id, prayerData);
            Alert.alert('Success', 'Prayer updated successfully! 🙏');
        } else {
            await addPrayer(prayerData);
            Alert.alert('Success', 'Prayer shared successfully! 🙏');
        }

        // Reset form
        setPrayerText('');
        setAuthorName('');
        setSelectedCategory('General');
        setIsAnonymous(true);
        setSelectedImage(null);

        onSubmit?.();
        } catch (error) {
        Alert.alert('Error', 'Failed to submit prayer. Please try again.');
        } finally {
        setIsSubmitting(false);
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

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <LinearGradient
            colors={['#ff9a56', '#ff6b35', '#f7931e']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <BlurView intensity={20} style={styles.blurContainer}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                <View style={styles.headerIcon}>
                    <PrayerIcon size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.headerTitle}>
                    {editingPrayer ? 'Edit Prayer' : 'Share Your Prayer'}
                </Text>
                <Text style={styles.headerSubtitle}>
                    Your heart matters to God and to this community
                </Text>
                </View>

                {/* Prayer Text Input */}
                <View style={styles.section}>
                <Text style={styles.sectionTitle}>Prayer Request or Blessing</Text>
                <View style={styles.textInputContainer}>
                    <TextInput
                    style={styles.textInput}
                    value={prayerText}
                    onChangeText={setPrayerText}
                    placeholder="Share what's on your heart..."
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    multiline
                    numberOfLines={6}
                    maxLength={1500}
                    textAlignVertical="top"
                    />
                    <Text style={styles.characterCount}>
                    {prayerText.length}/1500
                    </Text>
                </View>
                </View>

                {/* Category Selection */}
                <View style={styles.section}>
                <Text style={styles.sectionTitle}>Category</Text>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesContainer}
                >
                    {categories.map((category) => {
                    const isSelected = selectedCategory === category.name;
                    const colors = getCategoryColors(category.name);
                    
                    return (
                        <TouchableOpacity
                        key={category.name}
                        style={styles.categoryChip}
                        onPress={() => setSelectedCategory(category.name)}
                        activeOpacity={0.8}
                        >
                        <LinearGradient
                            colors={isSelected ? colors : ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                            style={[
                            styles.categoryChipGradient,
                            isSelected && styles.categoryChipSelected
                            ]}
                        >
                            <category.icon size={16} gradient={isSelected} />
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
                </View>

                {/* Image Upload */}
                <View style={styles.section}>
                <Text style={styles.sectionTitle}>Add Image (Optional)</Text>
                <TouchableOpacity
                    style={styles.imageUploadButton}
                    onPress={pickImage}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                    colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
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

                {/* Author Options */}
                <View style={styles.section}>
                <Text style={styles.sectionTitle}>How would you like to share?</Text>
                
                <TouchableOpacity
                    style={styles.optionRow}
                    onPress={() => setIsAnonymous(true)}
                    activeOpacity={0.8}
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
                    activeOpacity={0.8}
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
                    <View style={styles.nameInputContainer}>
                    <TextInput
                        style={styles.nameInput}
                        value={authorName}
                        onChangeText={setAuthorName}
                        placeholder="Enter your name"
                        placeholderTextColor="rgba(255, 255, 255, 0.6)"
                        maxLength={50}
                    />
                    </View>
                )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                {onCancel && (
                    <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onCancel}
                    activeOpacity={0.8}
                    >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                )}

                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    activeOpacity={0.8}
                    >
                    <LinearGradient
                        colors={isSubmitting ? ['#cccccc', '#999999'] : ['#ffeb3b', '#ff9800', '#ff6b35']}
                        style={styles.submitButtonGradient}
                    >
                        <View style={styles.submitButtonContent}>
                        <Text style={styles.submitButtonText}>
                            {isSubmitting ? 'Sharing...' : (editingPrayer ? 'Update Prayer' : 'Share Prayer')}
                        </Text>
                        {!isSubmitting && <SendIcon size={16} color="#FFFFFF" />}
                        </View>
                    </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Floating particles */}
            <View style={styles.particlesContainer}>
                {[...Array(6)].map((_, index) => (
                <View
                    key={index}
                    style={[
                    styles.particle,
                    {
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                    },
                    ]}
                />
                ))}
            </View>
            </BlurView>
        </LinearGradient>
        </Animated.View>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    gradient: {
        flex: 1,
    },

    blurContainer: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
        margin: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    scrollView: {
        flex: 1,
    },

    header: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
    },

    headerIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    headerTitle: {
        fontSize: 24,
        fontFamily: 'Outfit_700Bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    headerSubtitle: {
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 22,
    },

    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },

    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
        marginBottom: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    textInputContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        overflow: 'hidden',
    },

    textInput: {
        padding: 16,
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        color: '#FFFFFF',
        minHeight: 120,
        textAlignVertical: 'top',
        backgroundColor: 'transparent',
    },

    characterCount: {
        fontSize: 12,
        fontFamily: 'Outfit_300Light',
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'right',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },

    categoriesContainer: {
        marginTop: 8,
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
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 20,
        gap: 8,
    },

    categoryChipSelected: {
        borderColor: 'rgba(255, 255, 255, 0.6)',
        transform: [{ scale: 1.05 }],
    },

    categoryChipText: {
        fontSize: 14,
        fontFamily: 'Outfit_500Medium',
        color: 'rgba(255, 255, 255, 0.8)',
    },

    categoryChipTextSelected: {
        color: '#FFFFFF',
        fontWeight: 'bold',
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
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 16,
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

    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },

    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    radioButtonSelected: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderColor: '#FFFFFF',
    },

    radioButtonInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
    },

    optionText: {
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        color: '#FFFFFF',
    },

    nameInputContainer: {
        marginTop: 8,
    },

    nameInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        gap: 12,
    },

    cancelButton: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    cancelButtonText: {
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
    },

    submitButton: {
        flex: 2,
        borderRadius: 16,
    },

    submitButtonGradient: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
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

    particlesContainer: {
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

    bottomSpacing: {
        height: 40,
    },
    });