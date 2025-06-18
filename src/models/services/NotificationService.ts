// src/models/services/NotificationService.ts

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

    import * as Notifications from 'expo-notifications';
    import { Platform } from 'react-native';
    import AsyncStorage from '@react-native-async-storage/async-storage';
    import { FirebaseService } from './FirebaseService';

    // Configure notification behavior
    (Notifications as any).setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });

    export interface NotificationSettings {
    dailyDevotions: boolean;
    prayerUpdates: boolean;
    communityActivity: boolean;
    spiritualMilestones: boolean;
    time: string; // Format: "08:00"
    }

    export interface ScheduledNotification {
    id: string;
    type: 'devotion' | 'prayer' | 'community' | 'milestone';
    title: string;
    body: string;
    scheduledTime: Date;
    }

    class NotificationServiceClass {
    private static instance: NotificationServiceClass;
    private isInitialized = false;
    private expoPushToken: string | null = null;

    static getInstance(): NotificationServiceClass {
        if (!NotificationServiceClass.instance) {
        NotificationServiceClass.instance = new NotificationServiceClass();
        }
        return NotificationServiceClass.instance;
    }

    // Initialize notification service
    async initialize(): Promise<boolean> {
        try {
        if (this.isInitialized) return true;

        console.log('🔔 Initializing Notification Service...');

        // Request permissions
        const hasPermission = await this.requestPermissions();
        if (!hasPermission) {
            console.log('❌ Notification permissions denied');
            return false;
        }

        // Get push token for this device
        await this.registerForPushNotifications();

        // Load saved settings
        await this.loadSettings();

        // Schedule default notifications
        await this.scheduleDefaultNotifications();

        this.isInitialized = true;
        console.log('Notification Service initialized successfully');
        return true;
        } catch (error) {
        console.error('Failed to initialize NotificationService:', error);
        return false;
        }
    }

    // Request notification permissions
    async requestPermissions(): Promise<boolean> {
        try {
        if (Platform.OS === 'web') {
            // Web notification permissions
            if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
            }
            return false;
        }

        // Mobile notification permissions
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        return finalStatus === 'granted';
        } catch (error) {
        console.error('Error requesting notification permissions:', error);
        return false;
        }
    }

    // Register for push notifications
    async registerForPushNotifications(): Promise<string | null> {
        try {
        if (Platform.OS === 'web') {
            console.log('🌐 Web push notifications not implemented yet');
            return null;
        }

        // Get Expo push token
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        this.expoPushToken = token;
        
        console.log('📱 Expo Push Token:', token);

        // Save token to Firebase for future use
        const userId = await AsyncStorage.getItem('@current_user_id');
        if (userId && token) {
            await FirebaseService.updateUserPushToken(userId, token);
        }

        return token;
        } catch (error) {
        console.error('Error registering for push notifications:', error);
        return null;
        }
    }

    // Get current notification settings
    async getSettings(): Promise<NotificationSettings> {
        try {
        const settingsJson = await AsyncStorage.getItem('@notification_settings');
        if (settingsJson) {
            return JSON.parse(settingsJson);
        }
        } catch (error) {
        console.error('Error loading notification settings:', error);
        }

        // Return default settings
        return {
        dailyDevotions: true,
        prayerUpdates: true,
        communityActivity: false,
        spiritualMilestones: true,
        time: '08:00'
        };
    }

    // Save notification settings
    async saveSettings(settings: NotificationSettings): Promise<void> {
        try {
        await AsyncStorage.setItem('@notification_settings', JSON.stringify(settings));
        console.log('💾 Notification settings saved:', settings);

        // Reschedule notifications with new settings
        await this.scheduleDefaultNotifications();
        } catch (error) {
        console.error('Error saving notification settings:', error);
        }
    }

    // Load settings on initialization
    private async loadSettings(): Promise<void> {
        const settings = await this.getSettings();
        console.log('📋 Loaded notification settings:', settings);
    }

    // Schedule default daily notifications
    async scheduleDefaultNotifications(): Promise<void> {
        try {
        const settings = await this.getSettings();
        
        // Cancel existing scheduled notifications
        if (Platform.OS !== 'web') {
            await Notifications.cancelAllScheduledNotificationsAsync();
        }

        if (settings.dailyDevotions && Platform.OS !== 'web') {
            await this.scheduleDailyDevotion(settings.time);
        }

        if (settings.spiritualMilestones && Platform.OS !== 'web') {
            await this.scheduleWeeklyEncouragement();
        }

        console.log('📅 Default notifications scheduled');
        } catch (error) {
        console.error('Error scheduling default notifications:', error);
        }
    }

    // Schedule daily devotion reminder
    private async scheduleDailyDevotion(time: string): Promise<void> {
        try {
            const [hour, minute] = time.split(':').map(Number);
            
            if (Platform.OS !== 'web') {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: 'Good Morning! Your Faith Awaits',
                        body: 'Start your day with today\'s devotion and God\'s love',
                        data: { type: 'devotion', screen: 'Devotions' },
                        sound: 'default',
                    },
                    trigger: {
                        hour,
                        minute,
                        repeats: true,
                    } as any,
                });

                console.log(`📅 Daily devotion scheduled for ${time}`);
            }
        } catch (error) {
            console.error('Error scheduling daily devotion:', error);
        }
    }

    // Schedule weekly encouragement
    private async scheduleWeeklyEncouragement(): Promise<void> {
        try {
        await Notifications.scheduleNotificationAsync({
            content: {
            title: '✨ You\'re Growing in Faith!',
            body: 'Check your spiritual journey progress and see how far you\'ve come',
            data: { type: 'milestone', screen: 'Profile' },
            sound: 'default',
            },
            trigger: {
                weekday: 1,
                hour: 19,
                minute: 0,
                repeats: true,
            } as any,
        });

        console.log('📅 Weekly encouragement scheduled');
        } catch (error) {
        console.error('Error scheduling weekly encouragement:', error);
        }
    }

    // Send immediate notification for prayer updates
    async sendPrayerNotification(prayerTitle: string): Promise<void> {
        try {
        const settings = await this.getSettings();
        if (!settings.prayerUpdates) return;

        if (Platform.OS === 'web') {
            // Web notification
            if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🙏 Prayer Update', {
                body: `Someone is praying for: "${prayerTitle}"`,
                icon: '/icon.png',
                badge: '/icon.png'
            });
            }
            return;
        }

        // Mobile notification
        await Notifications.scheduleNotificationAsync({
            content: {
            title: '🙏 Prayer Update',
            body: `Someone is praying for: "${prayerTitle}"`,
            data: { type: 'prayer', screen: 'PrayerWall' },
            sound: 'default',
            },
            trigger: null, // Send immediately
        });

        console.log('🙏 Prayer notification sent');
        } catch (error) {
        console.error('Error sending prayer notification:', error);
        }
    }

    // Send community activity notification
    async sendCommunityNotification(message: string): Promise<void> {
        try {
        const settings = await this.getSettings();
        if (!settings.communityActivity) return;

        if (Platform.OS === 'web') {
            if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('👥 Community Update', {
                body: message,
                icon: '/icon.png'
            });
            }
            return;
        }

        await Notifications.scheduleNotificationAsync({
            content: {
            title: '👥 Community Update',
            body: message,
            data: { type: 'community', screen: 'PrayerWall' },
            sound: 'default',
            },
            trigger: null,
        });

        console.log('👥 Community notification sent');
        } catch (error) {
        console.error('Error sending community notification:', error);
        }
    }

    // Send milestone celebration
    async sendMilestoneNotification(milestone: string): Promise<void> {
        try {
        const settings = await this.getSettings();
        if (!settings.spiritualMilestones) return;

        const title = '🎉 Spiritual Milestone Achieved!';
        const body = `Congratulations! You've ${milestone}`;

        if (Platform.OS === 'web') {
            if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body,
                icon: '/icon.png'
            });
            }
            return;
        }

        await Notifications.scheduleNotificationAsync({
            content: {
            title,
            body,
            data: { type: 'milestone', screen: 'Profile' },
            sound: 'default',
            },
            trigger: null,
        });

        console.log('🎉 Milestone notification sent');
        } catch (error) {
        console.error('Error sending milestone notification:', error);
        }
    }

    // Get all scheduled notifications
    async getScheduledNotifications(): Promise<ScheduledNotification[]> {
        try {
        if (Platform.OS === 'web') return [];

        const notifications = await Notifications.getAllScheduledNotificationsAsync();
        return notifications.map(notification => ({
            id: notification.identifier,
            type: (notification.content.data?.type as ScheduledNotification['type']) || 'devotion',
            title: notification.content.title || '',
            body: notification.content.body || '',
            scheduledTime: new Date((notification.trigger as any)?.value || Date.now())
        }));
        } catch (error) {
        console.error('Error getting scheduled notifications:', error);
        return [];
        }
    }

    // Cancel all notifications
    async cancelAllNotifications(): Promise<void> {
        try {
        if (Platform.OS !== 'web') {
            await Notifications.cancelAllScheduledNotificationsAsync();
        }
        console.log('🚫 All notifications cancelled');
        } catch (error) {
        console.error('Error cancelling notifications:', error);
        }
    }

    // Test notification (for development)
    async sendTestNotification(): Promise<void> {
        try {
        const title = '🧪 Test Notification';
        const body = 'The Morning Amen notifications are working perfectly!';

        if (Platform.OS === 'web') {
            if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body, icon: '/icon.png' });
            } else {
            alert(`${title}\n${body}`);
            }
            return;
        }

        await Notifications.scheduleNotificationAsync({
            content: {
            title,
            body,
            data: { type: 'test' },
            sound: 'default',
            },
            trigger: null,
        });

        console.log('🧪 Test notification sent');
        } catch (error) {
        console.error('Error sending test notification:', error);
        }
    }
    }

    export const NotificationService = NotificationServiceClass.getInstance();