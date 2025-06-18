// src/controllers/contexts/AppContext.tsx

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

    import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
    import { Platform } from 'react-native';
    import { NotificationService, NotificationSettings } from '../../models/services/NotificationService';


    // Define the app state structure
    export interface AppState {
    // App-wide settings
    isInitialized: boolean;
    isLoading: boolean;
    theme: 'light' | 'dark';
    
    // User data
    user: {
        id: string | null;
        name: string | null;
        email: string | null;
        isAuthenticated: boolean;
        favoriteDevotions: string[];
        favoriteVerses: string[];
        prayerRequests: string[];
        readingStreak: number;
    };
    
    // Notification state
    notifications: {
        hasPermission: boolean;
        isEnabled: boolean;
        settings: NotificationSettings | null;
        pushToken: string | null;
        scheduledCount: number;
    };
    
    // App features
    features: {
        offlineMode: boolean;
        analyticsEnabled: boolean;
        crashReportingEnabled: boolean;
    };
    
    // UI state
    ui: {
        showOnboarding: boolean;
        showNotificationPrompt: boolean;
        currentScreen: string;
        tabBarVisible: boolean;
    };
    }

    // Define action types
    export type AppAction =
    | { type: 'SET_INITIALIZED'; payload: boolean }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_THEME'; payload: 'light' | 'dark' }
    | { type: 'SET_USER'; payload: Partial<AppState['user']> }
    | { type: 'SET_NOTIFICATIONS'; payload: Partial<AppState['notifications']> }
    | { type: 'UPDATE_NOTIFICATION_SETTINGS'; payload: NotificationSettings }
    | { type: 'SET_FEATURES'; payload: Partial<AppState['features']> }
    | { type: 'SET_UI'; payload: Partial<AppState['ui']> }
    | { type: 'ADD_FAVORITE'; payload: { type: 'devotion' | 'verse'; id: string } }
    | { type: 'REMOVE_FAVORITE'; payload: { type: 'devotion' | 'verse'; id: string } }
    | { type: 'INCREMENT_READING_STREAK' }
    | { type: 'RESET_READING_STREAK' }
    | { type: 'HIDE_NOTIFICATION_PROMPT' }
    | { type: 'RESET_APP_STATE' };

    // Initial state
    const initialState: AppState = {
    isInitialized: false,
    isLoading: true,
    theme: 'light',
    
    user: {
        id: null,
        name: null,
        email: null,
        isAuthenticated: false,
        favoriteDevotions: [],
        favoriteVerses: [],
        prayerRequests: [],
        readingStreak: 0,
    },
    
    notifications: {
        hasPermission: false,
        isEnabled: false,
        settings: null,
        pushToken: null,
        scheduledCount: 0,
    },
    
    features: {
        offlineMode: false,
        analyticsEnabled: true,
        crashReportingEnabled: true,
    },
    
    ui: {
        showOnboarding: true,
        showNotificationPrompt: true,
        currentScreen: 'Home',
        tabBarVisible: true,
    },
    };

    // Reducer function
    const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'SET_INITIALIZED':
        return { ...state, isInitialized: action.payload };
        
        case 'SET_LOADING':
        return { ...state, isLoading: action.payload };
        
        case 'SET_THEME':
        return { ...state, theme: action.payload };
        
        case 'SET_USER':
        return { 
            ...state, 
            user: { ...state.user, ...action.payload } 
        };
        
        case 'SET_NOTIFICATIONS':
        return { 
            ...state, 
            notifications: { ...state.notifications, ...action.payload } 
        };
        
        case 'UPDATE_NOTIFICATION_SETTINGS':
        return {
            ...state,
            notifications: {
            ...state.notifications,
            settings: action.payload,
            isEnabled: Object.values(action.payload).some(value => value === true),
            }
        };
        
        case 'SET_FEATURES':
        return { 
            ...state, 
            features: { ...state.features, ...action.payload } 
        };
        
        case 'SET_UI':
        return { 
            ...state, 
            ui: { ...state.ui, ...action.payload } 
        };
        
        case 'ADD_FAVORITE':
        const { type, id } = action.payload;
        const favoriteKey = type === 'devotion' ? 'favoriteDevotions' : 'favoriteVerses';
        const currentFavorites = state.user[favoriteKey];
        
        if (!currentFavorites.includes(id)) {
            return {
            ...state,
            user: {
                ...state.user,
                [favoriteKey]: [...currentFavorites, id]
            }
            };
        }
        return state;
        
        case 'REMOVE_FAVORITE':
        const { type: removeType, id: removeId } = action.payload;
        const removeFavoriteKey = removeType === 'devotion' ? 'favoriteDevotions' : 'favoriteVerses';
        
        return {
            ...state,
            user: {
            ...state.user,
            [removeFavoriteKey]: state.user[removeFavoriteKey].filter(favId => favId !== removeId)
            }
        };
        
        case 'INCREMENT_READING_STREAK':
        return {
            ...state,
            user: {
            ...state.user,
            readingStreak: state.user.readingStreak + 1
            }
        };
        
        case 'RESET_READING_STREAK':
        return {
            ...state,
            user: {
            ...state.user,
            readingStreak: 0
            }
        };
        
        case 'HIDE_NOTIFICATION_PROMPT':
        return {
            ...state,
            ui: {
            ...state.ui,
            showNotificationPrompt: false
            }
        };
        
        case 'RESET_APP_STATE':
        return { ...initialState, isInitialized: true };
        
        default:
        return state;
    }
    };

    // Context type
    interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
    
    // Convenience methods
    updateNotificationSettings: (settings: NotificationSettings) => void;
    toggleFavorite: (type: 'devotion' | 'verse', id: string) => void;
    isFavorite: (type: 'devotion' | 'verse', id: string) => boolean;
    incrementReadingStreak: () => void;
    setCurrentScreen: (screen: string) => void;
    hideNotificationPrompt: () => void;
    
    // Notification helpers
    requestNotificationPermissions: () => Promise<boolean>;
    sendTestNotification: () => Promise<void>;
    sendPrayerNotification: (prayerTitle: string) => Promise<void>;
    sendMilestoneNotification: (milestone: string) => Promise<void>;
    }

    // Create context
    const AppContext = createContext<AppContextType | undefined>(undefined);

    // Provider component
    export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);


    // Initialize app on mount
    useEffect(() => {
        initializeApp();
    }, []);



    const initializeApp = async () => {
        try {
        dispatch({ type: 'SET_LOADING', payload: true });

        // Initialize notification service
        await NotificationService.initialize();

        // Load user preferences and data
        // This would typically load from AsyncStorage or Firebase
        
        // Set app as initialized
        dispatch({ type: 'SET_INITIALIZED', payload: true });
        
        console.log('App initialized successfully');
        } catch (error) {
        console.error('Failed to initialize app:', error);
        } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    // Convenience methods
    const updateNotificationSettings = async (settings: NotificationSettings) => {
        dispatch({ type: 'UPDATE_NOTIFICATION_SETTINGS', payload: settings });
        await NotificationService.saveSettings(settings);
    };

    const toggleFavorite = (type: 'devotion' | 'verse', id: string) => {
        const isFav = isFavorite(type, id);
        if (isFav) {
        dispatch({ type: 'REMOVE_FAVORITE', payload: { type, id } });
        } else {
        dispatch({ type: 'ADD_FAVORITE', payload: { type, id } });
        }
    };

    const isFavorite = (type: 'devotion' | 'verse', id: string): boolean => {
        const favorites = type === 'devotion' 
        ? state.user.favoriteDevotions 
        : state.user.favoriteVerses;
        return favorites.includes(id);
    };

    const incrementReadingStreak = async () => {
        dispatch({ type: 'INCREMENT_READING_STREAK' });
        
        // Send milestone notification for significant streaks
        const newStreak = state.user.readingStreak + 1;
        if (newStreak % 7 === 0) { // Weekly milestone
            await NotificationService.sendMilestoneNotification(
                `completed ${newStreak} days of devotional reading! 🎉`
            );
        }
    };

    const setCurrentScreen = (screen: string) => {
        dispatch({ type: 'SET_UI', payload: { currentScreen: screen } });
    };

    const hideNotificationPrompt = () => {
        dispatch({ type: 'HIDE_NOTIFICATION_PROMPT' });
    };

    // Notification convenience methods
    const requestNotificationPermissions = async (): Promise<boolean> => {
        try {
            const granted = await NotificationService.requestPermissions();
            if (granted) {
                hideNotificationPrompt();
            }
            return granted;
        } catch (error) {
            console.error('Error requesting permissions:', error);
            return false;
        }
    };

    const sendTestNotification = async (): Promise<void> => {
        await NotificationService.sendTestNotification();
    };

    const sendPrayerNotification = async (prayerTitle: string): Promise<void> => {
        await NotificationService.sendPrayerNotification(prayerTitle);
    };

    const sendMilestoneNotification = async (milestone: string): Promise<void> => {
        await NotificationService.sendMilestoneNotification(milestone);
    };
    const contextValue: AppContextType = {
        state,
        dispatch,
        updateNotificationSettings,
        toggleFavorite,
        isFavorite,
        incrementReadingStreak,
        setCurrentScreen,
        hideNotificationPrompt,
        requestNotificationPermissions,
        sendTestNotification,
        sendPrayerNotification,
        sendMilestoneNotification,
    };

    return (
        <AppContext.Provider value={contextValue}>
        {children}
        </AppContext.Provider>
    );
    };

    // Hook to use the app context
    export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
    };

    // Selectors for specific state slices
    export const useAppState = () => {
    const { state } = useAppContext();
    return state;
    };

    export const useUserState = () => {
    const { state } = useAppContext();
    return state.user;
    };

    export const useNotificationState = () => {
    const { state } = useAppContext();
    return state.notifications;
    };

    export const useUIState = () => {
    const { state } = useAppContext();
    return state.ui;
    };

    export default AppContext;