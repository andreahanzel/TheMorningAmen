// src/views/screens/content/PrayerWallScreen.tsx
// Prayer wall with submission form and community prayers
// This screen allows users to submit prayers and view community prayers

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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface Prayer {
    id: string;
    text: string;
    category: string;
    isAnonymous: boolean;
    authorName?: string;
    date: string;
    prayerCount: number;
    userHasPrayed: boolean;
}

interface PrayerWallScreenProps {
    navigation: any;
}
// PrayerWallScreen component
export const PrayerWallScreen: React.FC<PrayerWallScreenProps> = ({ navigation }) => {
    const [prayers, setPrayers] = useState<Prayer[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPrayer, setNewPrayer] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('General');
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [authorName, setAuthorName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const modalSlide = useRef(new Animated.Value(height)).current;
    const cardAnims = useRef<Animated.Value[]>([]).current;

    const categories = ['General', 'Healing', 'Family', 'Guidance', 'Gratitude', 'Strength'];

    useEffect(() => {
        loadPrayers();
        startAnimations();
    }, []);

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

    // Load prayers from AsyncStorage or initialize with sample data
    const loadPrayers = async () => {
        try {
            const storedPrayers = await AsyncStorage.getItem('@prayers');
            if (storedPrayers) {
                const parsedPrayers = JSON.parse(storedPrayers);
                setPrayers(parsedPrayers);
                // Initialize animations for loaded prayers
                parsedPrayers.forEach(() => {
                    cardAnims.push(new Animated.Value(0));
                });
                animateCards();
            } else {
                // Add some sample prayers if none exist
                const samplePrayers: Prayer[] = [
                    {
                        id: '1',
                        text: 'Please pray for my family during this difficult time. We need God\'s peace and guidance.',
                        category: 'Family',
                        isAnonymous: true,
                        date: new Date().toISOString(),
                        prayerCount: 12,
                        userHasPrayed: false,
                    },
                    {
                        id: '2',
                        text: 'Grateful for God\'s blessings today. Praying for those who are struggling.',
                        category: 'Gratitude',
                        isAnonymous: false,
                        authorName: 'Sarah',
                        date: new Date(Date.now() - 86400000).toISOString(),
                        prayerCount: 8,
                        userHasPrayed: false,
                    },
                    {
                        id: '3',
                        text: 'Need wisdom for an important decision. Please pray for God\'s clear direction.',
                        category: 'Guidance',
                        isAnonymous: true,
                        date: new Date(Date.now() - 172800000).toISOString(),
                        prayerCount: 15,
                        userHasPrayed: true,
                    },
                ];
                setPrayers(samplePrayers);
                await AsyncStorage.setItem('@prayers', JSON.stringify(samplePrayers));
                samplePrayers.forEach(() => {
                    cardAnims.push(new Animated.Value(0));
                });
                animateCards();
            }
        } catch (error) {
            console.error('Error loading prayers:', error);
        }
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

    const showAddPrayerForm = () => {
        setShowAddForm(true);
        Animated.timing(modalSlide, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const hideAddPrayerForm = () => {
        Animated.timing(modalSlide, {
            toValue: height,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowAddForm(false);
            setNewPrayer('');
            setAuthorName('');
            setSelectedCategory('General');
            setIsAnonymous(true);
        });
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
            const prayer: Prayer = {
                id: Date.now().toString(),
                text: newPrayer.trim(),
                category: selectedCategory,
                isAnonymous,
                authorName: isAnonymous ? undefined : authorName.trim(),
                date: new Date().toISOString(),
                prayerCount: 0,
                userHasPrayed: false,
            };

            const updatedPrayers = [prayer, ...prayers];
            setPrayers(updatedPrayers);
            await AsyncStorage.setItem('@prayers', JSON.stringify(updatedPrayers));

            // Add animation for new card
            cardAnims.unshift(new Animated.Value(0));
            Animated.timing(cardAnims[0], {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();

            hideAddPrayerForm();
            Alert.alert('Prayer Submitted', 'Your prayer has been added to the wall. May God bless you! 🙏');
        } catch (error) {
            Alert.alert('Error', 'Failed to submit prayer. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const prayForRequest = async (prayerId: string) => {
        try {
            const updatedPrayers = prayers.map(prayer => {
                if (prayer.id === prayerId && !prayer.userHasPrayed) {
                    return {
                        ...prayer,
                        prayerCount: prayer.prayerCount + 1,
                        userHasPrayed: true,
                    };
                }
                return prayer;
            });

            setPrayers(updatedPrayers);
            await AsyncStorage.setItem('@prayers', JSON.stringify(updatedPrayers));

            // Show feedback
            Alert.alert('Prayer Sent 🙏', 'Your prayer has been added to this request.');
        } catch (error) {
            console.error('Error updating prayer:', error);
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

    const getCategoryEmoji = (category: string): string => {
        switch (category) {
            case 'Healing': return '🩹';
            case 'Family': return '👨‍👩‍👧‍👦';
            case 'Guidance': return '🧭';
            case 'Gratitude': return '🙏';
            case 'Strength': return '💪';
            case 'General':
            default: return '💭';
        }
    };

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
                                <Text style={styles.categoryEmoji}>{getCategoryEmoji(prayer.category)}</Text>
                                <Text style={styles.categoryText}>{prayer.category}</Text>
                            </LinearGradient>
                        </View>
                        
                        <Text style={styles.dateText}>
                            {new Date(prayer.date).toLocaleDateString()}
                        </Text>
                    </View>

                    {/* Prayer Text */}
                    <Text style={styles.prayerText}>{prayer.text}</Text>

                    {/* Footer */}
                    <View style={styles.cardFooter}>
                        <View style={styles.authorInfo}>
                            <Text style={styles.authorText}>
                                {prayer.isAnonymous ? 'Anonymous' : prayer.authorName}
                            </Text>
                            <Text style={styles.prayerCount}>
                                {prayer.prayerCount} prayers 🙏
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.prayButton,
                                prayer.userHasPrayed && styles.prayButtonDisabled
                            ]}
                            onPress={() => prayForRequest(prayer.id)}
                            disabled={prayer.userHasPrayed}
                        >
                            <LinearGradient
                                colors={
                                    prayer.userHasPrayed
                                        ? ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']
                                        : ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.3)']
                                }
                                style={styles.prayButtonGradient}
                            >
                                <Text style={styles.prayButtonText}>
                                    {prayer.userHasPrayed ? 'Prayed ✓' : 'Pray 🙏'}
                                </Text>
                            </LinearGradient>
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
                            onPress={showAddPrayerForm}
                        >
                            <LinearGradient
                                colors={['#ffeb3b', '#ff9800', '#ff6b35']}
                                style={styles.addButtonGradient}
                            >
                                <Text style={styles.addButtonText}>+ Add Prayer</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Prayers List */}
                <ScrollView
                    style={styles.prayersList}
                    contentContainerStyle={styles.prayersContent}
                    showsVerticalScrollIndicator={true}
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
                            <Text style={styles.emptyStateEmoji}>🙏</Text>
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

                {/* Add Prayer Modal */}
                <Modal
                    visible={showAddForm}
                    transparent={true}
                    animationType="none"
                    onRequestClose={hideAddPrayerForm}
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
                        
                        <Animated.View
                            style={[
                                styles.modalContent,
                                {
                                    transform: [{ translateY: modalSlide }],
                                },
                            ]}
                        >
                            <BlurView intensity={40} style={styles.modalBlur}>
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
                                    style={styles.modalGradient}
                                >
                                    {/* Modal Header */}
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalTitle}>🙏 Share Your Prayer</Text>
                                        <TouchableOpacity
                                            style={styles.closeButton}
                                            onPress={hideAddPrayerForm}
                                        >
                                            <Text style={styles.closeButtonText}>✕</Text>
                                        </TouchableOpacity>
                                    </View>

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
                                            {newPrayer.length}/500 characters
                                        </Text>
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
                                                    <Text style={styles.categoryChipEmoji}>
                                                        {getCategoryEmoji(category)}
                                                    </Text>
                                                    <Text style={[
                                                        styles.categoryChipText,
                                                        selectedCategory === category && styles.categoryChipTextSelected
                                                    ]}>
                                                        {category}
                                                    </Text>
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
                                            <Text style={styles.submitButtonText}>
                                                {isSubmitting ? 'Submitting...' : 'Share Prayer 🙏'}
                                            </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
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

    emptyStateEmoji: {
        fontSize: 64,
        marginBottom: 20,
    },

    emptyStateTitle: {
        fontSize: 24,
        fontFamily: 'Outfit_700Bold',
        color: '#FFFFFF',
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
    },

    categoryEmoji: {
        fontSize: 14,
        marginRight: 6,
    },

    categoryText: {
        fontSize: 12,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    dateText: {
        fontSize: 12,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255, 255, 255, 0.8)',
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
        maxHeight: height * 0.85,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },

    modalBlur: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },

    modalGradient: {
        padding: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },

    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
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
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    closeButtonText: {
        fontSize: 16,
        color: '#666666',
        fontWeight: 'bold',
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

    categoriesScroll: {
        marginTop: 8,
    },

    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        marginRight: 12,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },

    categoryChipSelected: {
        backgroundColor: '#ff6b35',
        borderColor: '#ff6b35',
    },

    categoryChipEmoji: {
        fontSize: 16,
        marginRight: 6,
    },

    categoryChipText: {
        fontSize: 14,
        fontFamily: 'Outfit_500Medium',
        color: '#333333',
    },

    categoryChipTextSelected: {
        color: '#FFFFFF',
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

    radioButtonSelected: {
        backgroundColor: '#ff6b35',
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

    submitButtonText: {
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
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