// src/utils/notificationPermissions.ts

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

    import { Platform, Alert, Linking } from 'react-native';
    import * as Notifications from 'expo-notifications';

    export interface PermissionStatus {
    status: 'granted' | 'denied' | 'undetermined';
    canAskAgain: boolean;
    platform: 'web' | 'ios' | 'android';
    }

    export interface PermissionRequestResult {
    granted: boolean;
    showSettingsPrompt: boolean;
    message: string;
    }

    // Check current notification permission status
    export const checkNotificationPermissions = async (): Promise<PermissionStatus> => {
    try {
        if (Platform.OS === 'web') {
        if (!('Notification' in window)) {
            return {
            status: 'denied',
            canAskAgain: false,
            platform: 'web'
            };
        }

        const permission = Notification.permission;
        return {
            status: permission === 'default' ? 'undetermined' : permission,
            canAskAgain: permission === 'default',
            platform: 'web'
        };
        }

        // Mobile (iOS/Android)
        const permissionResponse = await Notifications.getPermissionsAsync();
        const status = permissionResponse.status;
        // Some platforms may not provide canAskAgain; default to true if undefined
        const canAskAgain = (permissionResponse as any).canAskAgain !== undefined
            ? (permissionResponse as any).canAskAgain
            : true;
        
        return {
        status: status === 'undetermined' ? 'undetermined' : 
                status === 'granted' ? 'granted' : 'denied',
        canAskAgain: canAskAgain,
        platform: Platform.OS as 'ios' | 'android'
        };
    } catch (error) {
        console.error('Error checking notification permissions:', error);
        return {
        status: 'denied',
        canAskAgain: false,
        platform: Platform.OS as any
        };
    }
    };

    // Request notification permissions with user-friendly messaging
    export const requestNotificationPermissions = async (): Promise<PermissionRequestResult> => {
    try {
        const currentStatus = await checkNotificationPermissions();
        
        // Already granted
        if (currentStatus.status === 'granted') {
        return {
            granted: true,
            showSettingsPrompt: false,
            message: 'Notifications are already enabled! 🎉'
        };
        }

        // Cannot ask again - user needs to go to settings
        if (!currentStatus.canAskAgain && currentStatus.status === 'denied') {
        return {
            granted: false,
            showSettingsPrompt: true,
            message: getSettingsMessage(currentStatus.platform)
        };
        }

        // Request permission
        if (Platform.OS === 'web') {
        const permission = await Notification.requestPermission();
        return {
            granted: permission === 'granted',
            showSettingsPrompt: permission === 'denied',
            message: permission === 'granted' 
            ? 'Great! You\'ll receive faith-filled notifications'
            : 'Notifications blocked. You can enable them in your browser settings.'
        };
        } else {
        // Mobile permission request
        const { status } = await Notifications.requestPermissionsAsync();
        
        return {
            granted: status === 'granted',
            showSettingsPrompt: status === 'denied',
            message: status === 'granted'
            ? 'Perfect! Daily blessings coming your way'
            : getSettingsMessage(Platform.OS as 'ios' | 'android')
        };
        }
    } catch (error) {
        console.error('Error requesting notification permissions:', error);
        return {
        granted: false,
        showSettingsPrompt: false,
        message: 'Unable to request notification permissions. Please try again.'
        };
    }
    };

    // Get platform-specific settings message
    const getSettingsMessage = (platform: 'web' | 'ios' | 'android'): string => {
    switch (platform) {
        case 'web':
        return 'To receive daily devotions, please enable notifications in your browser settings. Look for the 🔒 icon in your address bar.';
        case 'ios':
        return 'To receive daily blessings, please enable notifications in Settings > The Morning Amen > Notifications.';
        case 'android':
        return 'To receive daily inspiration, please enable notifications in Settings > Apps > The Morning Amen > Notifications.';
        default:
        return 'Please enable notifications in your device settings to receive daily spiritual content.';
    }
    };

    // Show settings prompt with appropriate messaging
    export const showPermissionSettingsPrompt = async (platform: 'web' | 'ios' | 'android'): Promise<boolean> => {
    const title = '🙏 Enable Notifications for Daily Blessings';
    const message = getSettingsMessage(platform);
    const settingsText = platform === 'web' ? 'Browser Settings' : 'Open Settings';

    return new Promise((resolve) => {
        if (Platform.OS === 'web') {
        const result = window.confirm(`${title}\n\n${message}`);
        resolve(result);
        } else {
        Alert.alert(
            title,
            message,
            [
            {
                text: 'Not Now',
                style: 'cancel',
                onPress: () => resolve(false)
            },
            {
                text: settingsText,
                onPress: () => {
                if (Platform.OS !== 'web') {
                    Linking.openSettings();
                }
                resolve(true);
                }
            }
            ]
        );
        }
    });
    };

    // Smart permission request with user education
    export const requestPermissionsWithEducation = async (): Promise<PermissionRequestResult> => {
    try {
        // First, educate the user about why we need notifications
        const shouldContinue = await showEducationalPrompt();
        if (!shouldContinue) {
        return {
            granted: false,
            showSettingsPrompt: false,
            message: 'No worries! You can enable notifications later in settings.'
        };
        }

        // Then request permissions
        return await requestNotificationPermissions();
    } catch (error) {
        console.error('Error in smart permission request:', error);
        return {
        granted: false,
        showSettingsPrompt: false,
        message: 'Something went wrong. Please try again later.'
        };
    }
    };

    // Show educational prompt about notification benefits
    const showEducationalPrompt = async (): Promise<boolean> => {
    const title = '🌅 Start Each Day with Faith';
    const message = `The Morning Amen would like to send you:

    ✨ Daily devotional reminders
    ✨ Prayer request updates  
    ✨  Spiritual milestone celebrations
    ✨ Encouraging verses

    These gentle notifications help you stay connected to your faith journey.`;

    return new Promise((resolve) => {
        if (Platform.OS === 'web') {
        const result = window.confirm(`${title}\n\n${message}\n\nWould you like to enable notifications?`);
        resolve(result);
        } else {
        Alert.alert(
            title,
            message,
            [
            {
                text: 'Maybe Later',
                style: 'cancel',
                onPress: () => resolve(false)
            },
            {
                text: 'Yes, Enable!',
                onPress: () => resolve(true)
            }
            ]
        );
        }
    });
    };

    // Check if notifications are supported on this device/browser
    export const areNotificationsSupported = (): boolean => {
    if (Platform.OS === 'web') {
        return 'Notification' in window && 'serviceWorker' in navigator;
    }
    return true; // Mobile platforms support notifications via Expo
    };

    // Get user-friendly permission status text
    export const getPermissionStatusText = (status: PermissionStatus): string => {
    switch (status.status) {
        case 'granted':
        return '🟢 Notifications Enabled';
        case 'denied':
        return '🔴 Notifications Blocked';
        case 'undetermined':
        return '🟡 Not Set Up Yet';
        default:
        return '❓ Unknown Status';
    }
    };

    // Get user-friendly permission description
    export const getPermissionDescription = (status: PermissionStatus): string => {
    switch (status.status) {
        case 'granted':
        return 'You\'ll receive daily devotions and prayer updates.';
        case 'denied':
        return status.canAskAgain 
            ? 'Tap to enable daily spiritual notifications.'
            : 'Enable in device settings to receive daily blessings.';
        case 'undetermined':
        return 'Tap to set up daily devotional reminders.';
        default:
        return 'Notification status unknown.';
    }
    };

    // Utility to handle permission flow in components
    export const handlePermissionFlow = async (): Promise<void> => {
    try {
        const result = await requestPermissionsWithEducation();
        
        if (result.granted) {
        // Success feedback
        if (Platform.OS === 'web') {
            console.log('Notifications enabled successfully');
        } else {
            Alert.alert('🎉 Success!', result.message);
        }
        } else if (result.showSettingsPrompt) {
        // Show settings prompt
        const currentStatus = await checkNotificationPermissions();
        await showPermissionSettingsPrompt(currentStatus.platform);
        } else {
        // Handle other cases (user declined, etc.)
        console.log('ℹNotification setup cancelled by user');
        }
    } catch (error) {
        console.error('Error in permission flow:', error);
        if (Platform.OS !== 'web') {
        Alert.alert('Error', 'Unable to set up notifications. Please try again.');
        }
    }
    };