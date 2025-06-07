// src/controllers/navigation/MainTabNavigator.tsx
// Features: Bottom tabs with beautiful icons, gradient backgrounds, and smooth animations
// Connects all main screens with professional mobile navigation

import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// Import screens
import { HomeScreen } from '../../views/screens/main/HomeScreen';
import { DevotionsScreen } from '../../views/screens/content/DevotionsScreen';
import { DevotionDetailScreen } from '../../views/screens/main/DevotionDetailScreen';


// Placeholder screens
const PrayerWallScreen = () => (
    <LinearGradient colors={['#ff9a56', '#ff6b35', '#f7931e']} style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>🙏 Prayer Wall</Text>
        <Text style={styles.placeholderSubtext}>Share your prayers</Text>
    </LinearGradient>
);

const VideoGalleryScreen = () => (
    <LinearGradient colors={['#ff9a56', '#ff6b35', '#f7931e']} style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>🎥 Video Gallery</Text>
        <Text style={styles.placeholderSubtext}>Inspirational videos</Text>
    </LinearGradient>
);

const ProfileScreen = () => (
    <LinearGradient colors={['#ff9a56', '#ff6b35', '#f7931e']} style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>👤 Profile</Text>
        <Text style={styles.placeholderSubtext}>Your spiritual journey</Text>
    </LinearGradient>
);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// STACK NAVIGATOR FOR DEVOTIONS 
const DevotionsStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                cardStyle: { flex: 1 },
                cardStyleInterpolator: ({ current, layouts }) => {
                    return {
                        cardStyle: {
                            transform: [
                                {
                                    translateX: current.progress.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [layouts.screen.width, 0],
                                    }),
                                },
                            ],
                        },
                    };
                },
            }}
        >
            <Stack.Screen name="DevotionsList" component={DevotionsScreen} />
            <Stack.Screen name="DevotionDetail" component={DevotionDetailScreen} />
        </Stack.Navigator>
    );
};

// Custom Tab Bar Icon Component
const TabIcon = ({ name, focused, icon }: { name: string; focused: boolean; icon: string }) => {
    return (
        <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
            {focused && (
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                    style={styles.tabIconBackground}
                />
            )}
            <Text style={[styles.tabIcon, focused && styles.tabIconTextFocused]}>
                {icon}
            </Text>
            <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
                {name}
            </Text>
        </View>
    );
};

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    return (
        <BlurView intensity={100} style={styles.tabBarContainer}>
            <LinearGradient
                colors={['rgba(255, 154, 86, 0.95)', 'rgba(255, 107, 53, 0.95)']}
                style={styles.tabBarGradient}
            >
                <View style={styles.tabBar}>
                    {state.routes.map((route: any, index: number) => {
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        const onLongPress = () => {
                            navigation.emit({
                                type: 'tabLongPress',
                                target: route.key,
                            });
                        };

                        // Define icons for each tab
                        const getTabIcon = (routeName: string) => {
                            switch (routeName) {
                                case 'Home':
                                    return '🏠';
                                case 'DevotionsStack': // Updated to match the stack name
                                    return '📖';
                                case 'PrayerWall':
                                    return '🙏';
                                case 'Videos':
                                    return '🎥';
                                case 'Profile':
                                    return '👤';
                                default:
                                    return '•';
                            }
                        };

                        const getTabName = (routeName: string) => {
                            switch (routeName) {
                                case 'Home':
                                    return 'Home';
                                case 'DevotionsStack': // Updated to match the stack name
                                    return 'Devotions';
                                case 'PrayerWall':
                                    return 'Prayer';
                                case 'Videos':
                                    return 'Videos';
                                case 'Profile':
                                    return 'Profile';
                                default:
                                    return routeName;
                            }
                        };

                        return (
                            <TouchableOpacity
                                key={route.key}
                                style={[styles.tabButton, isFocused && styles.tabButtonFocused]}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                activeOpacity={0.7}
                            >
                                <TabIcon
                                    name={getTabName(route.name)}
                                    focused={isFocused}
                                    icon={getTabIcon(route.name)}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </LinearGradient>
        </BlurView>
    );
};

const HomeStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                cardStyle: { flex: 1 }, // Ensure the card style takes full height
            }}
        >
            <Stack.Screen name="HomeMain" component={HomeScreen} />
            {/* We'll add other screens here as you create them */}
        </Stack.Navigator>
    );
};

export const MainTabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            tabBar={(props: any) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen 
                name="Home" 
                component={HomeStackNavigator}  // Use the stack navigator
                options={{
                    tabBarIcon: ({ color }) => <Text>🏠</Text>,
                }}
            />
            
            {/* Use the stack navigator instead of the screen directly */}
            <Tab.Screen 
                name="DevotionsStack" 
                component={DevotionsStackNavigator}
                options={{
                    tabBarLabel: 'Devotions',
                }}
            />
            
            <Tab.Screen 
                name="PrayerWall" 
                component={PrayerWallScreen}
                options={{
                    tabBarLabel: 'Prayer',
                }}
            />
            
            <Tab.Screen 
                name="Videos" 
                component={VideoGalleryScreen}
                options={{
                    tabBarLabel: 'Videos',
                }}
            />
            
            <Tab.Screen 
                name="Profile" 
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    // Placeholder screen styles
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    
    placeholderText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    
    placeholderSubtext: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        fontWeight: '300',
    },

    // Tab bar styles
    tabBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
            },
            android: {
                elevation: 20,
            },
        }),
    },
    
    tabBarGradient: {
        paddingBottom: Platform.OS === 'ios' ? 25 : 10,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
    },
    
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 15,
        marginHorizontal: 2,
    },
    
    tabButtonFocused: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    
    tabIconFocused: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    
    tabIconBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 12,
    },
    
    tabIcon: {
        fontSize: 22,
        marginBottom: 4,
    },
    
    tabIconTextFocused: {
        transform: [{ scale: 1.1 }],
    },
    
    tabLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    
    tabLabelFocused: {
        color: '#FFFFFF',
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});