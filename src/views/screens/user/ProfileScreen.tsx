// src/views/screens/user/ProfileScreen.tsx

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

// Beautiful Profile Screen with edit functionality and Firestore integration

    import React, { useState, useRef, useEffect } from 'react';
    import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Animated,
    Dimensions,
    StatusBar,
    Alert,
    Platform,
    Image,
    } from 'react-native';
    import { LinearGradient } from 'expo-linear-gradient';
    import { BlurView } from 'expo-blur';
    import * as ImagePicker from 'expo-image-picker';
    import { useAuth } from '../../../controllers/contexts/AuthContext';
    import { User } from '../../../models/services/AuthService';
    import { SpiritualIcons } from '../../components/icons/SpiritualIcons';
    import { 
    BackIcon, 
    EditIcon, 
    SaveIcon,
    CameraIcon,
    UserIcon,
    EmailIcon,
    CalendarIcon
    } from '../../components/icons/CustomIcons';

    const { width, height } = Dimensions.get('window');

    interface ProfileScreenProps {
    navigation: any;
    }

    export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
    const { user, updateProfile } = useAuth();
    const [localUser, setLocalUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const editButtonScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        loadUserData();
        startAnimations();
    }, [user]); // Add user as dependency

    // Load user data from context
    const loadUserData = () => {
        if (user) {
        setLocalUser(user);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setProfilePicture(user.profilePicture || null);
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
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
        }),
        ]).start();
    };

    const pickImage = async () => {
        try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfilePicture(result.assets[0].uri);
        }
        } catch (error) {
        Alert.alert('Error', 'Failed to select image');
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        
        // Animate edit button
        Animated.sequence([
        Animated.timing(editButtonScale, {
            toValue: 0.8,
            duration: 100,
            useNativeDriver: true,
        }),
        Animated.timing(editButtonScale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }),
        ]).start();
    };

    const handleSave = async () => {
        if (!firstName.trim() || !lastName.trim()) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
        }

        setIsLoading(true);

        try {
        if (!user) return;

        const updates: Partial<User> = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            profilePicture: profilePicture || undefined,
        };

        // Only include profilePicture if it's set
        const success = await updateProfile(updates);
        if (success) {
            setLocalUser({ ...user, ...updates });
            setIsEditing(false);
            Alert.alert('Success', 'Profile updated successfully! ✨');
        } else {
            Alert.alert('Error', 'Failed to update profile');
        }
        } catch (error) {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
        setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (!user) return;
        
        // Reset to original values
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setProfilePicture(user.profilePicture || null);
        setIsEditing(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        });
    };

    const getInitials = () => {
        if (!user) return 'U';
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    };

    if (!user) {
        return (
        <LinearGradient
            colors={['#ff9a56', '#ff6b35', '#f7931e']}
            style={styles.container}
        >
            <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
            </View>
        </LinearGradient>
        );
    }

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
            
            <Text style={styles.headerTitle}>My Profile</Text>
            
            <Animated.View style={{ transform: [{ scale: editButtonScale }] }}>
                <TouchableOpacity
                style={styles.editButton}
                onPress={isEditing ? handleSave : handleEdit}
                disabled={isLoading}
                activeOpacity={0.8}
                >
                <LinearGradient
                    colors={isEditing ? ['#4caf50', '#66bb6a'] : ['#ffeb3b', '#ff9800']}
                    style={styles.editButtonGradient}
                >
                    {isEditing ? (
                    <SaveIcon size={16} color="#FFFFFF" />
                    ) : (
                    <EditIcon size={16} color="#FFFFFF" />
                    )}
                </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
            </Animated.View>

            <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            >
            {/* Profile Card */}
            <Animated.View
                style={[
                styles.profileCard,
                {
                    opacity: fadeAnim,
                    transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim },
                    ],
                },
                ]}
            >
                <BlurView intensity={30} style={styles.cardBlur}>
                <LinearGradient
                    colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)']}
                    style={styles.cardGradient}
                >
                    {/* Profile Picture */}
                    <View style={styles.profilePictureContainer}>
                    <TouchableOpacity
                        style={styles.profilePictureWrapper}
                        onPress={isEditing ? pickImage : undefined}
                        disabled={!isEditing}
                        activeOpacity={isEditing ? 0.8 : 1}
                    >
                        {profilePicture ? (
                        <Image
                            source={{ uri: profilePicture }}
                            style={styles.profilePicture}
                        />
                        ) : (
                        <LinearGradient
                            colors={['#ffeb3b', '#ff9800', '#ff6b35']}
                            style={styles.defaultAvatar}
                        >
                            <Text style={styles.avatarText}>{getInitials()}</Text>
                        </LinearGradient>
                        )}
                        
                        {isEditing && (
                        <View style={styles.cameraOverlay}>
                            <CameraIcon size={20} color="#FFFFFF" />
                        </View>
                        )}
                    </TouchableOpacity>
                    
                    <View style={styles.profileBadge}>
                        <SpiritualIcons.Love size={16} gradient />
                    </View>
                    </View>

                    {/* User Info */}
                    <View style={styles.userInfo}>
                    {isEditing ? (
                        <View style={styles.editingContainer}>
                        <View style={styles.nameRow}>
                            <View style={styles.nameField}>
                            <Text style={styles.fieldLabel}>First Name</Text>
                            <TextInput
                                style={styles.nameInput}
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="First name"
                                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                maxLength={30}
                            />
                            </View>
                            
                            <View style={styles.nameField}>
                            <Text style={styles.fieldLabel}>Last Name</Text>
                            <TextInput
                                style={styles.nameInput}
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Last name"
                                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                maxLength={30}
                            />
                            </View>
                        </View>
                        </View>
                    ) : (
                        <>
                        <Text style={styles.userName}>
                            {user.firstName} {user.lastName}
                        </Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                        <View style={styles.providerBadge}>
                            <Text style={styles.providerText}>
                            {user.provider.toUpperCase()} ACCOUNT
                            </Text>
                        </View>
                        </>
                    )}
                    </View>

                    {/* Edit Actions */}
                    {isEditing && (
                    <View style={styles.editActions}>
                        <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={handleCancel}
                        activeOpacity={0.8}
                        >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        disabled={isLoading}
                        activeOpacity={0.8}
                        >
                        <LinearGradient
                            colors={['#4caf50', '#66bb6a']}
                            style={styles.saveButtonGradient}
                        >
                            <Text style={styles.saveButtonText}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                            </Text>
                        </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    )}
                </LinearGradient>
                </BlurView>
            </Animated.View>

            {/* Account Details */}
            <Animated.View
                style={[
                styles.detailsCard,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
                ]}
            >
                <BlurView intensity={20} style={styles.cardBlur}>
                <LinearGradient
                    colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                    style={styles.cardGradient}
                >
                    <Text style={styles.sectionTitle}>Account Details</Text>
                    
                    <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                        <EmailIcon size={16} color="#FFFFFF" />
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Email Address</Text>
                        <Text style={styles.detailValue}>{user.email}</Text>
                    </View>
                    </View>

                    <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                        <CalendarIcon size={16} color="#FFFFFF" />
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Member Since</Text>
                        <Text style={styles.detailValue}>{formatDate(user.createdAt)}</Text>
                    </View>
                    </View>

                    <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                        <UserIcon size={16} color="#FFFFFF" />
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Account Type</Text>
                        <Text style={styles.detailValue}>
                        {user.provider.charAt(0).toUpperCase() + user.provider.slice(1)} Account
                        </Text>
                    </View>
                    </View>

                {/* COMMENTED OUT: Email Verification Status
                    <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                        <SpiritualIcons.Peace size={16} gradient />
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Email Verified</Text>
                        <Text style={[
                        styles.detailValue,
                        { color: user.isEmailVerified ? '#4caf50' : '#ff6b35' }
                        ]}>
                        {user.isEmailVerified ? 'Verified ✓' : 'Not Verified'}
                        </Text>
                    </View>
                    </View>
                    */}
                    
                </LinearGradient>
                </BlurView>
            </Animated.View>

            <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Background particles */}
            <View style={styles.particlesContainer}>
            {[...Array(8)].map((_, index) => (
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
        </LinearGradient>
        </>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    loadingText: {
        fontSize: 18,
        fontFamily: 'Outfit_500Medium',
        color: '#FFFFFF',
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

    headerTitle: {
        fontSize: 24,
        fontFamily: 'Outfit_700Bold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    editButton: {
        borderRadius: 22,
        shadowColor: '#ffeb3b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },

    editButtonGradient: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 20,
    },

    profileCard: {
        marginBottom: 20,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },

    detailsCard: {
        marginBottom: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },

    cardBlur: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    cardGradient: {
        padding: 24,
    },

    profilePictureContainer: {
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
    },

    profilePictureWrapper: {
        position: 'relative',
    },

    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },

    defaultAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },

    avatarText: {
        fontSize: 32,
        fontFamily: 'Outfit_700Bold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    cameraOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },

    profileBadge: {
        position: 'absolute',
        bottom: -10,
        right: width / 2 - 70,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 12,
        padding: 6,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },

    userInfo: {
        alignItems: 'center',
    },

    userName: {
        fontSize: 28,
        fontFamily: 'Outfit_700Bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    userEmail: {
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: 12,
    },

    providerBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    providerText: {
        fontSize: 12,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },

    editingContainer: {
        width: '100%',
    },

    nameRow: {
        flexDirection: 'row',
        gap: 12,
    },

    nameField: {
        flex: 1,
    },

    fieldLabel: {
        fontSize: 14,
        fontFamily: 'Outfit_500Medium',
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 8,
    },

    nameInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    editActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },

    cancelButton: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    cancelButtonText: {
        fontSize: 14,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
    },

    saveButton: {
        flex: 2,
        borderRadius: 12,
        shadowColor: '#4caf50',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },

    saveButtonGradient: {
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },

    saveButtonText: {
        fontSize: 14,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
    },

    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Outfit_700Bold',
        color: '#FFFFFF',
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },

    detailIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    detailContent: {
        flex: 1,
    },

    detailLabel: {
        fontSize: 14,
        fontFamily: 'Outfit_500Medium',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 2,
    },

    detailValue: {
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        color: '#FFFFFF',
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
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },

    bottomSpacing: {
        height: 40,
    },
    });