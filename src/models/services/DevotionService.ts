// src/models/services/DevotionService.ts
// Service for managing devotional content and favorites
// This service handles fetching, storing, and manipulating devotion data.

import AsyncStorage from '@react-native-async-storage/async-storage';
import devotionsData from '../data/devotions.json';

export interface Devotion {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    readTime: string;
    verse: string;
    verseText: string;
    author: string;
    category: string;
    image: string;
    isFavorite: boolean;
}

class DevotionService {
    private static instance: DevotionService;
    private devotions: Devotion[] = [];
    private favorites: string[] = [];

    private constructor() {
        this.initializeData();
    }

    public static getInstance(): DevotionService {
        if (!DevotionService.instance) {
            DevotionService.instance = new DevotionService();
        }
        return DevotionService.instance;
    }

    private async initializeData(): Promise<void> {
        try {
            // Load favorites from AsyncStorage
            const savedFavorites = await AsyncStorage.getItem('@devotion_favorites');
            this.favorites = savedFavorites ? JSON.parse(savedFavorites) : [];

            // Load devotions and mark favorites
            this.devotions = devotionsData.map(devotion => ({
                ...devotion,
                isFavorite: this.favorites.includes(devotion.id)
            }));
        } catch (error) {
            console.error('Error initializing devotion data:', error);
            this.devotions = devotionsData as Devotion[];
        }
    }

    // Get all devotions
    public async getAllDevotions(): Promise<Devotion[]> {
        if (this.devotions.length === 0) {
            await this.initializeData();
        }
        return this.devotions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    // Get devotions by category
    public async getDevotionsByCategory(category: string): Promise<Devotion[]> {
        const allDevotions = await this.getAllDevotions();
        if (category === 'All') {
            return allDevotions;
        }
        return allDevotions.filter(devotion => devotion.category === category);
    }

    // Get favorite devotions
    public async getFavoriteDevotions(): Promise<Devotion[]> {
        const allDevotions = await this.getAllDevotions();
        return allDevotions.filter(devotion => devotion.isFavorite);
    }

    // Get devotion by ID
    public async getDevotionById(id: string): Promise<Devotion | null> {
        const allDevotions = await this.getAllDevotions();
        return allDevotions.find(devotion => devotion.id === id) || null;
    }

    // Toggle favorite status
    public async toggleFavorite(devotionId: string): Promise<boolean> {
        try {
            const devotionIndex = this.devotions.findIndex(d => d.id === devotionId);
            if (devotionIndex === -1) return false;

            // Update devotion
            this.devotions[devotionIndex].isFavorite = !this.devotions[devotionIndex].isFavorite;

            // Update favorites array
            if (this.devotions[devotionIndex].isFavorite) {
                this.favorites.push(devotionId);
            } else {
                this.favorites = this.favorites.filter(id => id !== devotionId);
            }

            // Save to AsyncStorage
            await AsyncStorage.setItem('@devotion_favorites', JSON.stringify(this.favorites));

            return this.devotions[devotionIndex].isFavorite;
        } catch (error) {
            console.error('Error toggling favorite:', error);
            return false;
        }
    }

    // Get today's featured devotion
    public async getTodaysFeaturedDevotion(): Promise<Devotion | null> {
        const allDevotions = await this.getAllDevotions();
        if (allDevotions.length === 0) return null;

        // For demo purposes, return the most recent devotion
        // In a real app, you might have a specific "featured" flag or algorithm
        return allDevotions[0];
    }

    // Search devotions
    public async searchDevotions(query: string): Promise<Devotion[]> {
        const allDevotions = await this.getAllDevotions();
        const lowercaseQuery = query.toLowerCase();

        return allDevotions.filter(devotion =>
            devotion.title.toLowerCase().includes(lowercaseQuery) ||
            devotion.excerpt.toLowerCase().includes(lowercaseQuery) ||
            devotion.content.toLowerCase().includes(lowercaseQuery) ||
            devotion.category.toLowerCase().includes(lowercaseQuery) ||
            devotion.verseText.toLowerCase().includes(lowercaseQuery)
        );
    }

    // Get categories
    public async getCategories(): Promise<string[]> {
        const allDevotions = await this.getAllDevotions();
        const categories = [...new Set(allDevotions.map(d => d.category))];
        return ['All', ...categories.sort()];
    }

    // Mark devotion as read (for reading history)
    public async markAsRead(devotionId: string): Promise<void> {
        try {
            const readHistory = await AsyncStorage.getItem('@devotion_read_history');
            const history = readHistory ? JSON.parse(readHistory) : [];
            
            const readEntry = {
                devotionId,
                dateRead: new Date().toISOString(),
            };

            // Remove existing entry if it exists
            const filteredHistory = history.filter((entry: any) => entry.devotionId !== devotionId);
            
            // Add new entry at the beginning
            const updatedHistory = [readEntry, ...filteredHistory].slice(0, 100); // Keep last 100
            
            await AsyncStorage.setItem('@devotion_read_history', JSON.stringify(updatedHistory));
        } catch (error) {
            console.error('Error marking devotion as read:', error);
        }
    }

    // Get reading history
    public async getReadingHistory(): Promise<any[]> {
        try {
            const readHistory = await AsyncStorage.getItem('@devotion_read_history');
            return readHistory ? JSON.parse(readHistory) : [];
        } catch (error) {
            console.error('Error getting reading history:', error);
            return [];
        }
    }

    // Get reading stats
    public async getReadingStats(): Promise<{
        totalRead: number;
        favoriteCount: number;
        currentStreak: number;
        categoriesRead: string[];
    }> {
        try {
            const history = await this.getReadingHistory();
            const favorites = await this.getFavoriteDevotions();
            const allDevotions = await this.getAllDevotions();

            // Calculate reading streak
            let currentStreak = 0;
            const today = new Date();
            
            for (let i = 0; i < 30; i++) { // Check last 30 days
                const checkDate = new Date(today);
                checkDate.setDate(today.getDate() - i);
                const dateString = checkDate.toDateString();
                
                const readOnDate = history.some((entry: any) => 
                    new Date(entry.dateRead).toDateString() === dateString
                );
                
                if (readOnDate) {
                    currentStreak++;
                } else if (i > 0) { // Don't break streak for today if not read yet
                    break;
                }
            }

            // Get categories read
            const readDevotionIds = history.map((entry: any) => entry.devotionId);
            const readDevotions = allDevotions.filter(d => readDevotionIds.includes(d.id));
            const categoriesRead = [...new Set(readDevotions.map(d => d.category))];

            return {
                totalRead: history.length,
                favoriteCount: favorites.length,
                currentStreak,
                categoriesRead,
            };
        } catch (error) {
            console.error('Error getting reading stats:', error);
            return {
                totalRead: 0,
                favoriteCount: 0,
                currentStreak: 0,
                categoriesRead: [],
            };
        }
    }

    // Clear all data (for testing/reset)
    public async clearAllData(): Promise<void> {
        try {
            await AsyncStorage.multiRemove([
                '@devotion_favorites',
                '@devotion_read_history'
            ]);
            this.favorites = [];
            await this.initializeData();
        } catch (error) {
            console.error('Error clearing devotion data:', error);
        }
    }
}

// Export singleton instance
export const devotionService = DevotionService.getInstance();