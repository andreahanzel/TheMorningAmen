// src/types/notifications.d.ts
declare module 'expo-notifications' {
    export interface NotificationBehavior {
        shouldShowAlert: boolean;
        shouldPlaySound: boolean;
        shouldSetBadge: boolean;
    }
    
    export interface NotificationHandler {
        handleNotification: () => Promise<NotificationBehavior>;
    }
    
    export interface NotificationRequest {
        identifier: string;
        content: {
        title?: string;
        body?: string;
        data?: any;
        };
        trigger: any;
    }
    
    export interface NotificationContent {
        title?: string;
        body?: string;
        data?: any;
        sound?: string;
    }

    export interface NotificationSubscription {
    remove(): void;
    }

    export interface Notification {
        request: NotificationRequest;
        date: number;
    }

    export interface NotificationResponse {
        notification: Notification;
    }
        
    export interface PermissionResponse {
        status: 'granted' | 'denied' | 'undetermined';
    }
    
    export interface ExpoPushToken {
        data: string;
    }

    
    
    // Functions
    export function setNotificationHandler(handler: NotificationHandler): void;
    export function getPermissionsAsync(): Promise<PermissionResponse>;
    export function requestPermissionsAsync(): Promise<PermissionResponse>;
    export function getExpoPushTokenAsync(): Promise<ExpoPushToken>;
    export function scheduleNotificationAsync(options: {
        content: NotificationContent;
        trigger: any;
    }): Promise<string>;
    export function getAllScheduledNotificationsAsync(): Promise<NotificationRequest[]>;
    export function cancelAllScheduledNotificationsAsync(): Promise<void>;
    }

    export function addNotificationReceivedListener(
        listener: (notification: Notification) => void
    ): NotificationSubscription;

    export function addNotificationResponseReceivedListener(
        listener: (response: NotificationResponse) => void
    ): NotificationSubscription;

    export function removeNotificationSubscription(
        subscription: NotificationSubscription
    ): void;