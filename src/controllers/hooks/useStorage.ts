// src/controllers/hooks/useStorage.ts
// Custom hook for AsyncStorage operations with error handling and type safety
// This file defines a custom hook for managing storage operations using AsyncStorage in a React Native application.
// It provides functionalities to store, retrieve, and remove data with type safety and error handling.


import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage hook return type
    interface UseStorageReturn<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
    setData: (value: T) => Promise<void>;
    removeData: () => Promise<void>;
    refreshData: () => Promise<void>;
    }

    // Main storage hook
    export const useStorage = <T>(key: string, defaultValue?: T): UseStorageReturn<T> => {
    const [data, setStoredData] = useState<T | null>(defaultValue || null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load data from AsyncStorage
    const loadData = useCallback(async () => {
        try {
        setIsLoading(true);
        setError(null);
        
        const stored = await AsyncStorage.getItem(key);
        
        if (stored !== null) {
            const parsed = JSON.parse(stored) as T;
            setStoredData(parsed);
        } else if (defaultValue !== undefined) {
            setStoredData(defaultValue);
        }
        } catch (err) {
        setError(`Failed to load data for key: ${key}`);
        console.error('Storage load error:', err);
        } finally {
        setIsLoading(false);
        }
    }, [key, defaultValue]);

    // Save data to AsyncStorage
    const setData = useCallback(async (value: T) => {
        try {
        setError(null);
        await AsyncStorage.setItem(key, JSON.stringify(value));
        setStoredData(value);
        } catch (err) {
        setError(`Failed to save data for key: ${key}`);
        console.error('Storage save error:', err);
        throw err;
        }
    }, [key]);

    // Remove data from AsyncStorage
    const removeData = useCallback(async () => {
        try {
        setError(null);
        await AsyncStorage.removeItem(key);
        setStoredData(null);
        } catch (err) {
        setError(`Failed to remove data for key: ${key}`);
        console.error('Storage remove error:', err);
        throw err;
        }
    }, [key]);

    // Refresh data (re-load from AsyncStorage)
    const refreshData = useCallback(async () => {
        await loadData();
    }, [loadData]);

    // Initial load
    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        data,
        isLoading,
        error,
        setData,
        removeData,
        refreshData,
    };
    };

    // Hook for storing simple values
    export const useSimpleStorage = (key: string, defaultValue?: string): UseStorageReturn<string> => {
    return useStorage<string>(key, defaultValue);
    };

    // Hook for storing boolean values
    export const useBooleanStorage = (key: string, defaultValue: boolean = false): UseStorageReturn<boolean> => {
    return useStorage<boolean>(key, defaultValue);
    };

    // Hook for storing arrays
    export const useArrayStorage = <T>(key: string, defaultValue: T[] = []): UseStorageReturn<T[]> => {
    return useStorage<T[]>(key, defaultValue);
    };

    // Hook for storing objects
    export const useObjectStorage = <T extends Record<string, any>>(
    key: string, 
    defaultValue?: T
    ): UseStorageReturn<T> => {
    return useStorage<T>(key, defaultValue);
    };

    // Hook for user preferences
    export interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    biometricAuth: boolean;
    language: string;
    fontSize: 'small' | 'medium' | 'large';
    reminderTime: string;
    autoPlay: boolean;
    }

    export const useUserPreferences = (): UseStorageReturn<UserPreferences> => {
    const defaultPreferences: UserPreferences = {
        theme: 'auto',
        notifications: true,
        biometricAuth: false,
        language: 'en',
        fontSize: 'medium',
        reminderTime: '08:00',
        autoPlay: true,
    };

    return useStorage<UserPreferences>('@user_preferences', defaultPreferences);
    };

    // Hook for favorites management
    export interface FavoriteItem {
    id: string;
    type: 'devotion' | 'video' | 'verse' | 'prayer';
    title: string;
    dateAdded: string;
    }

    export const useFavorites = () => {
    const { data: favorites, setData, isLoading, error } = useArrayStorage<FavoriteItem>('@favorites');

    const addFavorite = useCallback(async (item: Omit<FavoriteItem, 'dateAdded'>) => {
        const newFavorite: FavoriteItem = {
        ...item,
        dateAdded: new Date().toISOString(),
        };
        
        const currentFavorites = favorites || [];
        const updatedFavorites = [...currentFavorites, newFavorite];
        await setData(updatedFavorites);
    }, [favorites, setData]);

    const removeFavorite = useCallback(async (id: string) => {
        const currentFavorites = favorites || [];
        const updatedFavorites = currentFavorites.filter(item => item.id !== id);
        await setData(updatedFavorites);
    }, [favorites, setData]);

    const isFavorite = useCallback((id: string): boolean => {
        return favorites?.some(item => item.id === id) || false;
    }, [favorites]);

    const getFavoritesByType = useCallback((type: FavoriteItem['type']): FavoriteItem[] => {
        return favorites?.filter(item => item.type === type) || [];
    }, [favorites]);

    return {
        favorites: favorites || [],
        isLoading,
        error,
        addFavorite,
        removeFavorite,
        isFavorite,
        getFavoritesByType,
    };
    };

    // Hook for reading history
    export interface ReadingHistoryItem {
    id: string;
    type: 'devotion' | 'verse';
    title: string;
    dateRead: string;
    progress?: number; // 0-100 for reading progress
    }

    export const useReadingHistory = () => {
    const { data: history, setData, isLoading, error } = useArrayStorage<ReadingHistoryItem>('@reading_history');

    const addToHistory = useCallback(async (item: Omit<ReadingHistoryItem, 'dateRead'>) => {
        const historyItem: ReadingHistoryItem = {
        ...item,
        dateRead: new Date().toISOString(),
        };
        
        const currentHistory = history || [];
        // Remove existing entry if it exists
        const filteredHistory = currentHistory.filter(h => h.id !== item.id);
        // Add new entry at the beginning
        const updatedHistory = [historyItem, ...filteredHistory];
        
        // Keep only last 100 items
        const trimmedHistory = updatedHistory.slice(0, 100);
        await setData(trimmedHistory);
    }, [history, setData]);

    const getRecentHistory = useCallback((limit: number = 10): ReadingHistoryItem[] => {
        return (history || []).slice(0, limit);
    }, [history]);

    const clearHistory = useCallback(async () => {
        await setData([]);
    }, [setData]);

    return {
        history: history || [],
        isLoading,
        error,
        addToHistory,
        getRecentHistory,
        clearHistory,
    };
    };

    // Hook for app settings
    export interface AppSettings {
    onboardingCompleted: boolean;
    lastAppVersion: string;
    crashReportingEnabled: boolean;
    analyticsEnabled: boolean;
    firstLaunchDate: string;
    launchCount: number;
    }

    export const useAppSettings = () => {
    const defaultSettings: AppSettings = {
        onboardingCompleted: false,
        lastAppVersion: '1.0.0',
        crashReportingEnabled: true,
        analyticsEnabled: true,
        firstLaunchDate: new Date().toISOString(),
        launchCount: 0,
    };

    const { data: settings, setData, isLoading, error } = useStorage<AppSettings>('@app_settings', defaultSettings);

    const updateSetting = useCallback(async <K extends keyof AppSettings>(
        key: K,
        value: AppSettings[K]
    ) => {
        if (settings) {
        const updatedSettings = { ...settings, [key]: value };
        await setData(updatedSettings);
        }
    }, [settings, setData]);

    const incrementLaunchCount = useCallback(async () => {
        if (settings) {
        await updateSetting('launchCount', settings.launchCount + 1);
        }
    }, [settings, updateSetting]);

    const completeOnboarding = useCallback(async () => {
        await updateSetting('onboardingCompleted', true);
    }, [updateSetting]);

    return {
        settings: settings || defaultSettings,
        isLoading,
        error,
        updateSetting,
        incrementLaunchCount,
        completeOnboarding,
    };
    };

    // Utility hook for batch storage operations
    export const useBatchStorage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const batchSet = useCallback(async (items: Array<[string, any]>) => {
        try {
        setIsLoading(true);
        setError(null);
        
        const stringifiedItems: Array<[string, string]> = items.map(([key, value]) => [
            key,
            JSON.stringify(value)
        ]);
        
        await AsyncStorage.multiSet(stringifiedItems);
        } catch (err) {
        setError('Batch set operation failed');
        console.error('Batch storage error:', err);
        throw err;
        } finally {
        setIsLoading(false);
        }
    }, []);

    const batchGet = useCallback(async (keys: string[]) => {
        try {
        setIsLoading(true);
        setError(null);
        
        const result = await AsyncStorage.multiGet(keys);
        const parsedResult: Record<string, any> = {};
        
        result.forEach(([key, value]) => {
            if (value !== null) {
            try {
                parsedResult[key] = JSON.parse(value);
            } catch {
                parsedResult[key] = value;
            }
            }
        });
        
        return parsedResult;
        } catch (err) {
        setError('Batch get operation failed');
        console.error('Batch storage error:', err);
        throw err;
        } finally {
        setIsLoading(false);
        }
    }, []);

    const batchRemove = useCallback(async (keys: string[]) => {
        try {
        setIsLoading(true);
        setError(null);
        await AsyncStorage.multiRemove(keys);
        } catch (err) {
        setError('Batch remove operation failed');
        console.error('Batch storage error:', err);
        throw err;
        } finally {
        setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        error,
        batchSet,
        batchGet,
        batchRemove,
    };
    };