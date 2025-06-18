// src/controllers/hooks/useNotifications.ts

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

    import { useState, useEffect, useCallback } from 'react';
    import { Platform } from 'react-native';
    import * as Notifications from 'expo-notifications';
    import { NotificationService, NotificationSettings, ScheduledNotification } from '../../models/services/NotificationService';

    export interface NotificationState {
    isEnabled: boolean;
    hasPermission: boolean;
    settings: NotificationSettings | null;
    scheduledNotifications: ScheduledNotification[];
    isLoading: boolean;
    pushToken: string | null;
    }

    export interface NotificationActions {
    requestPermissions: () => Promise<boolean>;
    updateSettings: (settings: NotificationSettings) => Promise<void>;
    sendTestNotification: () => Promise<void>;
    sendPrayerNotification: (prayerTitle: string) => Promise<void>;
    sendMilestoneNotification: (milestone: string) => Promise<void>;
    refreshScheduledNotifications: () => Promise<void>;
    cancelAllNotifications: () => Promise<void>;
    }

    export const useNotifications = (): [NotificationState, NotificationActions] => {
    const [state, setState] = useState<NotificationState>({
        isEnabled: false,
        hasPermission: false,
        settings: null,
        scheduledNotifications: [],
        isLoading: true,
        pushToken: null,
    });

    // Initialize notifications on mount
    useEffect(() => {
        initializeNotifications();
        setupNotificationListeners();

        // Cleanup handled by individual listener subscriptions
        // No global cleanup needed here

    }, []);

    // Initialize notification service
    const initializeNotifications = useCallback(async () => {
        try {
        setState(prev => ({ ...prev, isLoading: true }));

        // Initialize the notification service
        const isInitialized = await NotificationService.initialize();
        
        // Check current permission status
        const hasPermission = await checkPermissionStatus();
        
        // Load current settings
        const settings = await NotificationService.getSettings();
        
        // Get scheduled notifications
        const scheduledNotifications = await NotificationService.getScheduledNotifications();

        setState(prev => ({
            ...prev,
            isEnabled: isInitialized,
            hasPermission,
            settings,
            scheduledNotifications,
            isLoading: false,
        }));

        console.log('🔔 useNotifications initialized:', {
            isInitialized,
            hasPermission,
            settingsCount: Object.keys(settings).length,
            scheduledCount: scheduledNotifications.length
        });

        } catch (error) {
        console.error('❌ Failed to initialize notifications:', error);
        setState(prev => ({
            ...prev,
            isLoading: false,
            isEnabled: false,
            hasPermission: false,
        }));
        }
    }, []);

    // Check permission status
    const checkPermissionStatus = useCallback(async (): Promise<boolean> => {
        try {
        if (Platform.OS === 'web') {
            return 'Notification' in window && Notification.permission === 'granted';
        }

        const { status } = await Notifications.getPermissionsAsync();
        return status === 'granted';
        } catch (error) {
        console.error('Error checking permission status:', error);
        return false;
        }
    }, []);

    // Setup notification listeners for incoming notifications
    const setupNotificationListeners = useCallback(() => {
        if (Platform.OS === 'web') {
        // Web notification handling would go here
        return;
        }

        // Mobile notification listeners
        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
        console.log('📬 Notification received:', notification);
        // Handle notification received while app is open
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('👆 Notification tapped:', response);
        // Handle notification tap - navigate to appropriate screen
        const data = response.notification.request.content.data;
        if (data?.screen) {
            // Navigation logic would go here
            console.log(`Navigate to: ${data.screen}`);
        }
        });

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
}, []);

    // Request notification permissions
    const requestPermissions = useCallback(async (): Promise<boolean> => {
        try {
        setState(prev => ({ ...prev, isLoading: true }));

        const granted = await NotificationService.requestPermissions();
        
        setState(prev => ({ 
            ...prev, 
            hasPermission: granted,
            isEnabled: granted,
            isLoading: false 
        }));

        if (granted) {
            // Reinitialize to set up push token and schedule notifications
            await initializeNotifications();
        }

        return granted;
        } catch (error) {
        console.error('Error requesting permissions:', error);
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
        }
    }, [initializeNotifications]);

    // Update notification settings
    const updateSettings = useCallback(async (newSettings: NotificationSettings): Promise<void> => {
        try {
        setState(prev => ({ ...prev, isLoading: true }));

        await NotificationService.saveSettings(newSettings);
        
        // Refresh scheduled notifications
        const scheduledNotifications = await NotificationService.getScheduledNotifications();

        setState(prev => ({
            ...prev,
            settings: newSettings,
            scheduledNotifications,
            isLoading: false,
        }));

        console.log('✅ Notification settings updated:', newSettings);
        } catch (error) {
        console.error('Error updating settings:', error);
        setState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    // Send test notification
    const sendTestNotification = useCallback(async (): Promise<void> => {
        try {
        await NotificationService.sendTestNotification();
        console.log('🧪 Test notification sent');
        } catch (error) {
        console.error('Error sending test notification:', error);
        }
    }, []);

    // Send prayer notification
    const sendPrayerNotification = useCallback(async (prayerTitle: string): Promise<void> => {
        try {
        await NotificationService.sendPrayerNotification(prayerTitle);
        console.log('🙏 Prayer notification sent for:', prayerTitle);
        } catch (error) {
        console.error('Error sending prayer notification:', error);
        }
    }, []);

    // Send milestone notification
    const sendMilestoneNotification = useCallback(async (milestone: string): Promise<void> => {
        try {
        await NotificationService.sendMilestoneNotification(milestone);
        console.log('🎉 Milestone notification sent:', milestone);
        } catch (error) {
        console.error('Error sending milestone notification:', error);
        }
    }, []);

    // Refresh scheduled notifications list
    const refreshScheduledNotifications = useCallback(async (): Promise<void> => {
        try {
        const scheduledNotifications = await NotificationService.getScheduledNotifications();
        setState(prev => ({ ...prev, scheduledNotifications }));
        } catch (error) {
        console.error('Error refreshing scheduled notifications:', error);
        }
    }, []);

    // Cancel all notifications
    const cancelAllNotifications = useCallback(async (): Promise<void> => {
        try {
        await NotificationService.cancelAllNotifications();
        setState(prev => ({ ...prev, scheduledNotifications: [] }));
        console.log('🚫 All notifications cancelled');
        } catch (error) {
        console.error('Error cancelling notifications:', error);
        }
    }, []);

    const actions: NotificationActions = {
        requestPermissions,
        updateSettings,
        sendTestNotification,
        sendPrayerNotification,
        sendMilestoneNotification,
        refreshScheduledNotifications,
        cancelAllNotifications,
    };

    return [state, actions];
    };