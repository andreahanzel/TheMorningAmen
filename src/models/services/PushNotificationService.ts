// src/models/services/PushNotificationService.ts

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

    import { Platform } from 'react-native';
    import * as Notifications from 'expo-notifications';

    export interface PushMessage {
    title: string;
    body: string;
    data?: Record<string, any>;
    sound?: boolean;
    badge?: number;
    }

    export interface PushSubscription {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
    }

    class PushNotificationServiceClass {
    private static instance: PushNotificationServiceClass;
    private vapidPublicKey = 'your-vapid-public-key'; // You'd get this from Firebase
    private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

    static getInstance(): PushNotificationServiceClass {
        if (!PushNotificationServiceClass.instance) {
        PushNotificationServiceClass.instance = new PushNotificationServiceClass();
        }
        return PushNotificationServiceClass.instance;
    }

    // Initialize push notifications based on platform
    async initialize(): Promise<boolean> {
        try {
        if (Platform.OS === 'web') {
            return await this.initializeWebPush();
        } else {
            return await this.initializeMobilePush();
        }
        } catch (error) {
        console.error('Failed to initialize push notifications:', error);
        return false;
        }
    }

    // Initialize web push notifications
    private async initializeWebPush(): Promise<boolean> {
        try {
        // Check if service workers and push messaging are supported
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.log('Web push notifications not supported');
            return false;
        }

        // Register service worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        this.serviceWorkerRegistration = registration;
        console.log('Service Worker registered:', registration);

        // Check for existing subscription
        const existingSubscription = await registration.pushManager.getSubscription();
        if (existingSubscription) {
            console.log('Existing push subscription found');
            return true;
        }

        return true;
        } catch (error) {
        console.error('Error initializing web push:', error);
        return false;
        }
    }

    // Initialize mobile push notifications
    private async initializeMobilePush(): Promise<boolean> {
        try {
        // Configure notification handling
        (Notifications as any).setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
        });

        console.log('Mobile push notifications initialized');
        return true;
        } catch (error) {
        console.error('Error initializing mobile push:', error);
        return false;
        }
    }

    // Subscribe to web push notifications
    async subscribeWebPush(): Promise<PushSubscription | null> {
        try {
        if (Platform.OS !== 'web' || !this.serviceWorkerRegistration) {
            return null;
        }

        const subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
        });

        const subscriptionData: PushSubscription = {
            endpoint: subscription.endpoint,
            keys: {
            p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
            auth: this.arrayBufferToBase64(subscription.getKey('auth')!),
            },
        };

        console.log('Web push subscription created:', subscriptionData);
        return subscriptionData;
        } catch (error) {
        console.error('Error subscribing to web push:', error);
        return null;
        }
    }

    // Send push notification to device
    async sendPushNotification(
        token: string, 
        message: PushMessage
    ): Promise<boolean> {
        try {
        if (Platform.OS === 'web') {
            return await this.sendWebPushNotification(message);
        } else {
            return await this.sendMobilePushNotification(token, message);
        }
        } catch (error) {
        console.error('Error sending push notification:', error);
        return false;
        }
    }

    // Send web push notification
    private async sendWebPushNotification(message: PushMessage): Promise<boolean> {
        try {
        // In a real app, this would send to your backend server
        // which would then send the push notification via Firebase or web push protocol
        
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(message.title, {
            body: message.body,
            icon: '/icon.png',
            badge: '/icon-badge.png',
            data: message.data,
            requireInteraction: false,
            silent: !message.sound,
            });
            return true;
        }

        console.log('Web notifications not available or permission not granted');
        return false;
        } catch (error) {
        console.error('Error sending web push notification:', error);
        return false;
        }
    }

    // Send mobile push notification via Expo
    private async sendMobilePushNotification(
        token: string, 
        message: PushMessage
    ): Promise<boolean> {
        try {
        // In a real app, you'd send this to your backend server
        // which would then send via Expo's push notification service
        
        const pushMessage = {
            to: token,
            sound: message.sound ? 'default' : undefined,
            title: message.title,
            body: message.body,
            data: message.data,
            badge: message.badge,
        };

        // For now, we'll just schedule a local notification
        await Notifications.scheduleNotificationAsync({
            content: {
            title: message.title,
            body: message.body,
            data: message.data,
            sound: message.sound ? 'default' : undefined,
            },
            trigger: null, // Send immediately
        });

        console.log('Mobile push notification sent:', pushMessage);
        return true;
        } catch (error) {
        console.error('Error sending mobile push notification:', error);
        return false;
        }
    }

    // Batch send notifications to multiple devices
    async sendBatchNotifications(
        tokens: string[], 
        message: PushMessage
    ): Promise<{ success: number; failed: number }> {
        let success = 0;
        let failed = 0;

        await Promise.allSettled(
        tokens.map(async (token) => {
            try {
            const result = await this.sendPushNotification(token, message);
            if (result) {
                success++;
            } else {
                failed++;
            }
            } catch (error) {
            failed++;
            }
        })
        );

        console.log(`Batch notification results: ${success} success, ${failed} failed`);
        return { success, failed };
    }

    // Schedule notification for later delivery
    async scheduleNotification(
        token: string,
        message: PushMessage,
        scheduledDate: Date
    ): Promise<boolean> {
        try {
        if (Platform.OS === 'web') {
            // Web scheduled notifications would require backend implementation
            console.log('Web scheduled notifications not implemented');
            return false;
        }

        await Notifications.scheduleNotificationAsync({
            content: {
            title: message.title,
            body: message.body,
            data: message.data,
            sound: message.sound ? 'default' : undefined,
            },
            trigger: scheduledDate,
        });

        console.log(`Notification scheduled for ${scheduledDate}`);
        return true;
        } catch (error) {
        console.error('Error scheduling notification:', error);
        return false;
        }
    }

    // Utility function to convert VAPID key
    private urlBase64ToUint8Array(base64String: string): Uint8Array {
        if (Platform.OS !== 'web') {
            return new Uint8Array(0);
        }
        
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = (window as any).atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Utility function to convert ArrayBuffer to base64
    private arrayBufferToBase64(buffer: ArrayBuffer): string {
        if (Platform.OS !== 'web') {
            return '';
        }
        
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return (window as any).btoa(binary);
    }

    // Get push token for current device
    async getPushToken(): Promise<string | null> {
        try {
        if (Platform.OS === 'web') {
            const subscription = await this.subscribeWebPush();
            return subscription ? JSON.stringify(subscription) : null;
        } else {
            const token = await Notifications.getExpoPushTokenAsync();
            return token.data;
        }
        } catch (error) {
        console.error('Error getting push token:', error);
        return null;
        }
    }

    // Unsubscribe from push notifications
    async unsubscribe(): Promise<boolean> {
        try {
        if (Platform.OS === 'web' && this.serviceWorkerRegistration) {
            const subscription = await this.serviceWorkerRegistration.pushManager.getSubscription();
            if (subscription) {
            await subscription.unsubscribe();
            console.log('Unsubscribed from web push notifications');
            return true;
            }
        } else if (Platform.OS !== 'web') {
            // Cancel all scheduled notifications for mobile
            await Notifications.cancelAllScheduledNotificationsAsync();
            console.log('Cancelled all mobile notifications');
            return true;
        }
        return false;
        } catch (error) {
        console.error('Error unsubscribing from push notifications:', error);
        return false;
        }
    }

    // Check if push notifications are supported
    isSupported(): boolean {
        if (Platform.OS === 'web') {
        return (
            'serviceWorker' in navigator &&
            'PushManager' in window &&
            'Notification' in window
        );
        }
        return true; // Mobile platforms support push notifications via Expo
    }

    // Get notification permission status
    async getPermissionStatus(): Promise<'granted' | 'denied' | 'default'> {
        try {
        if (Platform.OS === 'web') {
            if ('Notification' in window) {
            return Notification.permission;
            }
            return 'denied';
        } else {
            const { status } = await Notifications.getPermissionsAsync();
            switch (status) {
            case 'granted':
                return 'granted';
            case 'denied':
                return 'denied';
            default:
                return 'default';
            }
        }
        } catch (error) {
        console.error('Error getting permission status:', error);
        return 'denied';
        }
    }
    }

    export const PushNotificationService = PushNotificationServiceClass.getInstance();