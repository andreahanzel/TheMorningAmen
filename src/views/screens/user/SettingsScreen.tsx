// src/views/screens/user/SettingsScreen.tsx

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

    import React, { useState, useEffect, useRef } from 'react';
    import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Switch,
    Pressable,
    Alert,
    Platform,
    SafeAreaView,
    StatusBar,
    Animated,
    } from 'react-native';
    import { LinearGradient } from 'expo-linear-gradient';
    import { BlurView } from 'expo-blur';
    import { colors } from '../../../styles/colors';
    import { useNotifications } from '../../../controllers/hooks/useNotifications';
    import { NotificationSettings } from '../../../models/services/NotificationService';
    import { 
    checkNotificationPermissions, 
    handlePermissionFlow,
    getPermissionStatusText,
    getPermissionDescription 
    } from '../../../utils/notificationPermissions';
    import { 
    NotificationBanner, 
    PermissionRequestBanner, 
    SuccessBanner, 
    SettingsReminderBanner 
    } from '../../components/common/NotificationBanner';
    import { BellIcon, ClockIcon, PrayerIcon, StarIcon, ChevronRightIcon, TestTubeIcon } from '../../components/icons/CustomIcons';

    interface SettingsScreenProps {
    navigation: any;
    }

    export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
    const [notificationState, notificationActions] = useNotifications();
    const [selectedTime, setSelectedTime] = useState('08:00');
    const [showPermissionBanner, setShowPermissionBanner] = useState(false);
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);
    const [showSettingsBanner, setShowSettingsBanner] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState('unknown');

    // Animation references
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        loadPermissionStatus();
        startAnimations();
        
        // Load current settings
        if (notificationState.settings) {
        setSelectedTime(notificationState.settings.time);
        }
    }, []);

    useEffect(() => {
        // Check if we should show permission banner
        if (!notificationState.hasPermission && !notificationState.isLoading) {
        setTimeout(() => setShowPermissionBanner(true), 1000);
        }
    }, [notificationState.hasPermission, notificationState.isLoading]);

    const loadPermissionStatus = async () => {
        const status = await checkNotificationPermissions();
        setPermissionStatus(getPermissionStatusText(status));
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

    const handleNotificationToggle = async (setting: keyof NotificationSettings, value: boolean | string) => {
        if (!notificationState.settings) return;

        const newSettings = {
        ...notificationState.settings,
        [setting]: value,
        };

        await notificationActions.updateSettings(newSettings);
    };

    const handleTimeChange = (time: string) => {
        setSelectedTime(time);
        handleNotificationToggle('time', time);
    };

    const handleRequestPermissions = async () => {
        setShowPermissionBanner(false);
        
        try {
        const granted = await notificationActions.requestPermissions();
        if (granted) {
            setShowSuccessBanner(true);
            await loadPermissionStatus();
        } else {
            setShowSettingsBanner(true);
        }
        } catch (error) {
        console.error('Error requesting permissions:', error);
        }
    };

    const handleOpenSettings = () => {
        setShowSettingsBanner(false);
        // Open device settings - handled by permission utilities
        handlePermissionFlow();
    };

    const handleTestNotification = async () => {
        try {
        await notificationActions.sendTestNotification();
        Alert.alert(
            '🧪 Test Sent!', 
            'Check if you received the test notification. If not, make sure notifications are enabled in your device settings.',
            [{ text: 'OK' }]
        );
        } catch (error) {
        Alert.alert('Error', 'Failed to send test notification');
        }
    };

    const timeOptions = [
        { label: '6:00 AM', value: '06:00' },
        { label: '7:00 AM', value: '07:00' },
        { label: '8:00 AM', value: '08:00' },
        { label: '9:00 AM', value: '09:00' },
        { label: '10:00 AM', value: '10:00' },
        { label: '7:00 PM', value: '19:00' },
        { label: '8:00 PM', value: '20:00' },
    ];

    const SettingCard = ({ 
        title, 
        description, 
        icon, 
        children, 
        onPress 
    }: {
        title: string;
        description?: string;
        icon: React.ReactNode;
        children?: React.ReactNode;
        onPress?: () => void;
    }) => (
        <Pressable
        style={styles.settingCard}
        onPress={onPress}
        disabled={!onPress}
        >
        <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
            style={styles.cardGradient}
        >
            <BlurView intensity={10} style={styles.cardBlur}>
            <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                <View style={styles.cardIcon}>
                    {icon}
                </View>
                <View style={styles.cardText}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    {description && (
                    <Text style={styles.cardDescription}>{description}</Text>
                    )}
                </View>
                </View>
                {children && (
                <View style={styles.cardRight}>
                    {children}
                </View>
                )}
                {onPress && (
                <ChevronRightIcon size={20} color="rgba(255,255,255,0.6)" />
                )}
            </View>
            </BlurView>
        </LinearGradient>
        </Pressable>
    );

    const TimeSelector = () => (
        <View style={styles.timeSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {timeOptions.map((option) => (
            <Pressable
                key={option.value}
                style={[
                styles.timeOption,
                selectedTime === option.value && styles.timeOptionSelected
                ]}
                onPress={() => handleTimeChange(option.value)}
            >
                <Text style={[
                styles.timeOptionText,
                selectedTime === option.value && styles.timeOptionTextSelected
                ]}>
                {option.label}
                </Text>
            </Pressable>
            ))}
        </ScrollView>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary.coral} />
        
        {/* Notification Banners */}
        <PermissionRequestBanner
            visible={showPermissionBanner}
            onRequestPermission={handleRequestPermissions}
            onDismiss={() => setShowPermissionBanner(false)}
        />
        
        <SuccessBanner
            visible={showSuccessBanner}
            onDismiss={() => setShowSuccessBanner(false)}
        />
        
        <SettingsReminderBanner
            visible={showSettingsBanner}
            onOpenSettings={handleOpenSettings}
            onDismiss={() => setShowSettingsBanner(false)}
        />

        <LinearGradient
            colors={[colors.primary.sunrise, colors.primary.coral, colors.primary.amber]}
            style={styles.gradientContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <Animated.View
            style={[
                styles.content,
                {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                },
            ]}
            >
            {/* Header */}
            <View style={styles.header}>
                <Pressable
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                >
                <Text style={styles.backButtonText}>← Back</Text>
                </Pressable>
                <Text style={styles.headerTitle}>Notification Settings</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Notification Status */}
                <View style={styles.section}>
                <Text style={styles.sectionTitle}>📱 Notification Status</Text>
                <SettingCard
                    title={permissionStatus}
                    description={notificationState.hasPermission 
                    ? getPermissionDescription({ status: 'granted', canAskAgain: false, platform: Platform.OS as any })
                    : getPermissionDescription({ status: 'denied', canAskAgain: true, platform: Platform.OS as any })
                    }
                    icon={<BellIcon size={24} color="#FFFFFF" />}
                    onPress={!notificationState.hasPermission ? handleRequestPermissions : undefined}
                />
                </View>

                {/* Notification Types */}
                {notificationState.settings && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🔔 What You'll Receive</Text>
                    
                    <SettingCard
                    title="Daily Devotions"
                    description="Morning reminders for your spiritual journey"
                    icon={<BellIcon size={24} color="#FFFFFF" />}
                    >
                    <Switch
                        value={notificationState.settings.dailyDevotions}
                        onValueChange={(value) => handleNotificationToggle('dailyDevotions', value)}
                        trackColor={{ false: 'rgba(255,255,255,0.2)', true: colors.primary.gold }}
                        thumbColor={notificationState.settings.dailyDevotions ? '#FFFFFF' : 'rgba(255,255,255,0.8)'}
                        ios_backgroundColor="rgba(255,255,255,0.2)"
                    />
                    </SettingCard>

                    <SettingCard
                    title="Prayer Updates"
                    description="When someone prays for your requests"
                    icon={<PrayerIcon size={24} color="#FFFFFF" />}
                    >
                    <Switch
                        value={notificationState.settings.prayerUpdates}
                        onValueChange={(value) => handleNotificationToggle('prayerUpdates', value)}
                        trackColor={{ false: 'rgba(255,255,255,0.2)', true: colors.primary.gold }}
                        thumbColor={notificationState.settings.prayerUpdates ? '#FFFFFF' : 'rgba(255,255,255,0.8)'}
                        ios_backgroundColor="rgba(255,255,255,0.2)"
                    />
                    </SettingCard>

                    <SettingCard
                    title="Community Activity"
                    description="Updates from your faith community"
                    icon={<StarIcon size={24} color="#FFFFFF" />}
                    >
                    <Switch
                        value={notificationState.settings.communityActivity}
                        onValueChange={(value) => handleNotificationToggle('communityActivity', value)}
                        trackColor={{ false: 'rgba(255,255,255,0.2)', true: colors.primary.gold }}
                        thumbColor={notificationState.settings.communityActivity ? '#FFFFFF' : 'rgba(255,255,255,0.8)'}
                        ios_backgroundColor="rgba(255,255,255,0.2)"
                    />
                    </SettingCard>

                    <SettingCard
                    title="Spiritual Milestones"
                    description="Celebrate your faith journey progress"
                    icon={<StarIcon size={24} color="#FFFFFF" />}
                    >
                    <Switch
                        value={notificationState.settings.spiritualMilestones}
                        onValueChange={(value) => handleNotificationToggle('spiritualMilestones', value)}
                        trackColor={{ false: 'rgba(255,255,255,0.2)', true: colors.primary.gold }}
                        thumbColor={notificationState.settings.spiritualMilestones ? '#FFFFFF' : 'rgba(255,255,255,0.8)'}
                        ios_backgroundColor="rgba(255,255,255,0.2)"
                    />
                    </SettingCard>
                </View>
                )}

                {/* Timing Settings */}
                {notificationState.settings?.dailyDevotions && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⏰ Reminder Time</Text>
                    <SettingCard
                    title="Daily Devotion Time"
                    description="Choose when to receive your daily reminder"
                    icon={<ClockIcon size={24} color="#FFFFFF" />}
                    >
                    <TimeSelector />
                    </SettingCard>
                </View>
                )}

                {/* Test & Debug */}
                <View style={styles.section}>
                <Text style={styles.sectionTitle}>🧪 Test & Debug</Text>
                
                <SettingCard
                    title="Send Test Notification"
                    description="Check if notifications are working"
                    icon={<TestTubeIcon size={24} color="#FFFFFF" />}
                    onPress={handleTestNotification}
                />

                {notificationState.scheduledNotifications.length > 0 && (
                    <SettingCard
                    title="Scheduled Notifications"
                    description={`${notificationState.scheduledNotifications.length} upcoming reminders`}
                    icon={<ClockIcon size={24} color="#FFFFFF" />}
                    onPress={() => {
                        Alert.alert(
                        'Scheduled Notifications',
                        `You have ${notificationState.scheduledNotifications.length} scheduled notifications:\n\n${notificationState.scheduledNotifications.map(n => `• ${n.title}`).join('\n')}`,
                        [{ text: 'OK' }]
                        );
                    }}
                    />
                )}
                </View>

                {/* Loading State */}
                {notificationState.isLoading && (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading notification settings...</Text>
                </View>
                )}

                {/* Bottom spacing */}
                <View style={styles.bottomSpacing} />
            </ScrollView>
            </Animated.View>
        </LinearGradient>
        </SafeAreaView>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary.sunrise,
    },

    gradientContainer: {
        flex: 1,
    },

    content: {
        flex: 1,
        paddingHorizontal: 20,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 20 : 40,
        paddingBottom: 20,
    },

    backButton: {
        padding: 8,
    },

    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
    },

    headerRight: {
        width: 60, // Balance the header
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: 100,
    },

    section: {
        marginBottom: 30,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 15,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    settingCard: {
        marginBottom: 12,
        borderRadius: 16,
        overflow: 'hidden',
    },

    cardGradient: {
        borderRadius: 16,
    },

    cardBlur: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },

    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },

    cardLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },

    cardIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    cardText: {
        flex: 1,
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 2,
    },

    cardDescription: {
        fontSize: 13,
        fontWeight: '400',
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 16,
    },

    cardRight: {
        marginLeft: 12,
    },

    timeSelector: {
        marginTop: 8,
    },

    timeOption: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },

    timeOptionSelected: {
        backgroundColor: colors.primary.gold,
        borderColor: colors.primary.gold,
    },

    timeOptionText: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.8)',
    },

    timeOptionTextSelected: {
        color: '#FFFFFF',
        fontWeight: '600',
    },

    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },

    loadingText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },

    bottomSpacing: {
        height: 50,
    },
    });

    export default SettingsScreen;