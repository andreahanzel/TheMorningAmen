// src/views/components/common/NotificationBanner.tsx

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

    import React, { useState, useEffect, useRef } from 'react';
    import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Animated,
    Dimensions,
    Platform,
    } from 'react-native';
    import { LinearGradient } from 'expo-linear-gradient';
    import { BlurView } from 'expo-blur';
    import { colors } from '../../../styles/colors';
    import { BellIcon, CheckIcon, XIcon, SettingsIcon } from '../icons/CustomIcons';

    export interface NotificationBannerProps {
    visible: boolean;
    type: 'permission' | 'success' | 'error' | 'info';
    title: string;
    message: string;
    actionText?: string;
    onAction?: () => void;
    onDismiss?: () => void;
    autoHide?: boolean;
    duration?: number;
    }

    export const NotificationBanner: React.FC<NotificationBannerProps> = ({
    visible,
    type,
    title,
    message,
    actionText,
    onAction,
    onDismiss,
    autoHide = true,
    duration = 5000,
    }) => {
    const [isVisible, setIsVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(-200)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        if (visible) {
        showBanner();
        if (autoHide) {
            const timer = setTimeout(() => {
            hideBanner();
            }, duration);
            return () => clearTimeout(timer);
        }
        } else {
        hideBanner();
        }
    }, [visible, autoHide, duration]);

    const showBanner = () => {
        setIsVisible(true);
        
        Animated.parallel([
        Animated.spring(slideAnim, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 150,
            friction: 6,
            useNativeDriver: true,
        }),
        ]).start();
    };

    const hideBanner = () => {
        Animated.parallel([
        Animated.timing(slideAnim, {
            toValue: -200,
            duration: 300,
            useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
            toValue: 0.9,
            duration: 300,
            useNativeDriver: true,
        }),
        ]).start(() => {
        setIsVisible(false);
        });
    };

    const handleDismiss = () => {
        hideBanner();
        setTimeout(() => {
        onDismiss?.();
        }, 300);
    };

    const handleAction = () => {
        onAction?.();
        hideBanner();
    };

    const getIconComponent = () => {
        const iconProps = { size: 24, color: '#FFFFFF' };
        
        switch (type) {
        case 'permission':
            return <BellIcon {...iconProps} />;
        case 'success':
            return <CheckIcon {...iconProps} />;
        case 'error':
            return <XIcon {...iconProps} />;
        case 'info':
            return <SettingsIcon {...iconProps} />;
        default:
            return <BellIcon {...iconProps} />;
        }
    };

    const getGradientColors = (): [string, string, ...string[]] => {
        switch (type) {
        case 'permission':
            return [colors.primary.coral, colors.primary.amber];
        case 'success':
            return [colors.secondary.success, colors.primary.gold];
        case 'error':
            return [colors.secondary.error, colors.primary.coral];
        case 'info':
            return [colors.primary.sunrise, colors.primary.gold];
        default:
            return [colors.primary.coral, colors.primary.amber];
        }
    };

    if (!isVisible && !visible) {
        return null;
    }

    return (
        <Animated.View
        style={[
            styles.container,
            {
            width: screenWidth - 32,
            transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
            ],
            opacity: opacityAnim,
            },
        ]}
        >
        <LinearGradient
            colors={getGradientColors()}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <BlurView intensity={15} style={styles.blurContainer}>
            <View style={styles.content}>
                {/* Icon Section */}
                <View style={styles.iconContainer}>
                {getIconComponent()}
                </View>

                {/* Text Content */}
                <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>
                    {title}
                </Text>
                <Text style={styles.message} numberOfLines={2}>
                    {message}
                </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                {actionText && (
                    <Pressable
                    style={styles.actionButton}
                    onPress={handleAction}
                    >
                    <Text style={styles.actionText}>{actionText}</Text>
                    </Pressable>
                )}
                
                <Pressable
                    style={styles.dismissButton}
                    onPress={handleDismiss}
                >
                    <XIcon size={20} color="rgba(255,255,255,0.8)" />
                </Pressable>
                </View>
            </View>

            {/* Floating particles for visual appeal */}
            <View style={styles.particle1} />
            <View style={styles.particle2} />
            <View style={styles.particle3} />
            </BlurView>
        </LinearGradient>
        </Animated.View>
    );
    };

    // Permission Request Banner - Specialized component
    export const PermissionRequestBanner: React.FC<{
    visible: boolean;
    onRequestPermission: () => void;
    onDismiss: () => void;
    }> = ({ visible, onRequestPermission, onDismiss }) => (
    <NotificationBanner
        visible={visible}
        type="permission"
        title="🙏 Enable Daily Blessings"
        message="Get gentle reminders for devotions, prayers, and spiritual growth"
        actionText="Enable"
        onAction={onRequestPermission}
        onDismiss={onDismiss}
        autoHide={false}
    />
    );

    // Success Banner - For when permissions are granted
    export const SuccessBanner: React.FC<{
    visible: boolean;
    onDismiss: () => void;
    }> = ({ visible, onDismiss }) => (
    <NotificationBanner
        visible={visible}
        type="success"
        title="🎉 Notifications Enabled!"
        message="You'll receive daily devotions and prayer updates"
        onDismiss={onDismiss}
        duration={3000}
    />
    );

    // Settings Reminder Banner
    export const SettingsReminderBanner: React.FC<{
    visible: boolean;
    onOpenSettings: () => void;
    onDismiss: () => void;
    }> = ({ visible, onOpenSettings, onDismiss }) => (
    <NotificationBanner
        visible={visible}
        type="info"
        title="📱 Enable in Settings"
        message="To receive daily blessings, please enable notifications in your device settings"
        actionText="Settings"
        onAction={onOpenSettings}
        onDismiss={onDismiss}
        autoHide={false}
    />
    );

    const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 16,
        zIndex: 1000,
        borderRadius: 20,
        ...Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
        },
        android: {
            elevation: 12,
        },
        web: {
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        },
        }),
    },

    gradient: {
        borderRadius: 20,
        overflow: 'hidden',
    },

    blurContainer: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        overflow: 'hidden',
    },

    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingVertical: 18,
    },

    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    textContainer: {
        flex: 1,
        marginRight: 8,
        minWidth: 0,
    },

    title: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 2,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
        flexShrink: 1,
    },

    message: {
        fontSize: 12,
        fontWeight: '400',
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 16,
        flexShrink: 1,
    },

    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    actionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },

    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    dismissButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Floating particles for visual appeal
    particle1: {
        position: 'absolute',
        top: 10,
        right: 20,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },

    particle2: {
        position: 'absolute',
        top: 30,
        right: 40,
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },

    particle3: {
        position: 'absolute',
        bottom: 15,
        right: 60,
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    });