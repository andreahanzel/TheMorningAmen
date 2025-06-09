// src/controllers/navigation/MainTabNavigator.tsx
// Updated to connect all new screens properly

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
import { VideoGalleryScreen } from '../../views/screens/content/VideoGalleryScreen';
import { PrayerWallScreen } from '../../views/screens/content/PrayerWallScreen';
import { VerseOfDayScreen } from '../../views/screens/content/VerseOfDayScreen';
import { AboutScreen } from '../../views/screens/community/AboutScreen';
import { NavigationIcons } from '../../views/components/icons/NavigationIcons';


// Profile placeholder - you can create this later
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

// STACK NAVIGATOR FOR VIDEOS
const VideosStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                cardStyle: { flex: 1 },
            }}
        >
            <Stack.Screen name="VideoGallery" component={VideoGalleryScreen} />
        </Stack.Navigator>
    );
};

// STACK NAVIGATOR FOR PRAYER
const PrayerStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                cardStyle: { flex: 1 },
            }}
        >
            <Stack.Screen name="PrayerWall" component={PrayerWallScreen} />
        </Stack.Navigator>
    );
};

// STACK NAVIGATOR FOR HOME (with all features accessible)
const HomeStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                cardStyle: { flex: 1 },
            }}
        >
            <Stack.Screen name="HomeMain" component={HomeScreen} />
            <Stack.Screen name="VerseOfDay" component={VerseOfDayScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            {/* Add other screens that can be accessed from Home */}
        </Stack.Navigator>
    );
};

// Define icons for each tab
const getTabIcon = (routeName: string, focused: boolean) => {
    switch (routeName) {
        case 'HomeStack':
            return <NavigationIcons.Home size={28} focused={focused} />;
        case 'DevotionsStack':
            return <NavigationIcons.Devotions size={28} focused={focused} />;
        case 'PrayerStack':
            return <NavigationIcons.Prayer size={28} focused={focused} />;
        case 'VideosStack':
            return <NavigationIcons.Videos size={28} focused={focused} />;
        case 'ProfileStack':
            return <NavigationIcons.Profile size={28} focused={focused} />;
        default:
            return <NavigationIcons.Home size={28} focused={focused} />;
    }
};

// STACK NAVIGATOR FOR PROFILE
const ProfileStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                cardStyle: { flex: 1 },
            }}
        >
            <Stack.Screen name="ProfileMain" component={ProfileScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            {/* Add settings and other profile-related screens here */}
        </Stack.Navigator>
    );
};

    // Custom Tab Bar Icon Component
    const TabIcon = ({ name, focused, routeName }: { name: string; focused: boolean; routeName: string }) => {
        return (
            <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
                {focused && (
                    <LinearGradient
                        colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                        style={styles.tabIconBackground}
                    />
                )}
                <View style={[styles.iconWrapper, focused && styles.iconWrapperFocused]}>
                    {getTabIcon(routeName, focused)}
                </View>
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

                        // Function to get the appropriate icon based on the route name
                        const getTabName = (routeName: string) => {
                            switch (routeName) {
                                case 'HomeStack':
                                    return 'Home';
                                case 'DevotionsStack':
                                    return 'Devotions';
                                case 'PrayerStack':
                                    return 'Prayer';
                                case 'VideosStack':
                                    return 'Videos';
                                case 'ProfileStack':
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
                                    routeName={route.name}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </LinearGradient>
        </BlurView>
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
                name="HomeStack" 
                component={HomeStackNavigator}
                options={{
                    tabBarLabel: 'Home',
                }}
            />
            
            <Tab.Screen 
                name="DevotionsStack" 
                component={DevotionsStackNavigator}
                options={{
                    tabBarLabel: 'Devotions',
                }}
            />
            
            <Tab.Screen 
                name="PrayerStack" 
                component={PrayerStackNavigator}
                options={{
                    tabBarLabel: 'Prayer',
                }}
            />
            
            <Tab.Screen 
                name="VideosStack" 
                component={VideosStackNavigator}
                options={{
                    tabBarLabel: 'Videos',
                }}
            />
            
            <Tab.Screen 
                name="ProfileStack" 
                component={ProfileStackNavigator}
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

    iconWrapper: {
        marginBottom: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },

    iconWrapperFocused: {
        transform: [{ scale: 1.1 }],
    },
});