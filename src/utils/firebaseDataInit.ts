// src/utils/firebaseDataInit.ts
// Initialize Firebase with your local JSON data
// This script uploads local data to Firebase and provides feedback on success or failure

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

    import { FirebaseService } from '../models/services/FirebaseService';
    import { Alert, Platform } from 'react-native';

    // Initialize Firebase data
    export const initializeFirebaseData = async () => {
    try {
        console.log('Starting Firebase data initialization...');
        
        // Show loading message
        if (Platform.OS === 'web') {
        console.log('Uploading data to Firebase...');
        }
        
        const result = await FirebaseService.initializeFirebaseData();
        
        if (result.success) {
        console.log('Firebase initialization successful!');
        
        // Show success message
        if (Platform.OS === 'web') {
            window.alert('Firebase Data Initialized!\n\nAll your devotions, verses, videos, and other content have been uploaded to Firebase successfully!');
        } else {
            Alert.alert(
            'Success!', 
            'Firebase data initialized successfully!\n\nAll your content is now synced with the cloud.',
            [{ text: 'Great!', style: 'default' }]
            );
        }
        
        return result;
        } else {
        throw new Error(result.error);
        }
        
    } catch (error) {
        console.error('Firebase initialization failed:', error);
        
        if (Platform.OS === 'web') {
        const errorMessage = (error instanceof Error) ? error.message : String(error);
        window.alert(`Firebase Error: ${errorMessage}`);
        } else {
        const errorMessage = (error instanceof Error) ? error.message : String(error);
        Alert.alert('Error', `Firebase initialization failed: ${errorMessage}`);
        }
        
        const errorMessage = (error instanceof Error) ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
    };

    // Check document counts in collections
    export const checkFirebaseCollections = async () => {
    try {
        console.log('Checking Firebase collections...');
        
        const collections = ['devotions', 'affirmations', 'verses', 'videos', 'prayerRequests'];
        const counts: { [key: string]: number } = {};
        
        for (const collectionName of collections) {
        const count = await FirebaseService.getCollectionCount(collectionName);
        counts[collectionName] = count;
        console.log(`${collectionName}: ${count} documents`);
        }
        
        const totalDocuments = Object.values(counts).reduce((sum: number, count: number) => sum + count, 0);
        
        const message = `Firebase Collections Status:\n\n` +
        `• Devotions: ${counts['devotions']} documents\n` +
        `• Affirmations: ${counts['affirmations']} documents\n` +
        `• Verses: ${counts['verses']} documents\n` +
        `• Videos: ${counts['videos']} documents\n` +
        `• Prayer Requests: ${counts['prayerRequests']} documents\n\n` +
        `Total: ${totalDocuments} documents`;
        
        if (Platform.OS === 'web') {
        window.alert(message);
        } else {
        Alert.alert('Firebase Status', message);
        }
        
        return { success: true, counts, totalDocuments };
        
    } catch (error) {
        console.error('Error checking collections:', error);
        const errorMessage = (error instanceof Error) ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
    };

    // Clear all collections
    export const clearAllFirebaseData = async () => {
    try {
        const collections = ['devotions', 'affirmations', 'verses', 'videos', 'prayerRequests', 'userFavorites'];
        
        console.log('Clearing all Firebase collections...');
        
        for (const collectionName of collections) {
        await FirebaseService.clearCollection(collectionName);
        }
        
        console.log('All collections cleared successfully!');
        
        if (Platform.OS === 'web') {
        window.alert('All Firebase data cleared successfully!');
        } else {
        Alert.alert('Success', 'All Firebase data has been cleared.');
        }
        
        return { success: true };
        
    } catch (error) {
        console.error('Error clearing data:', error);
        const errorMessage = (error instanceof Error) ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
    };

    // Test specific collection operations
    export const testDevotionsCollection = async () => {
    try {
        console.log('Testing devotions collection...');
        
        const devotions = await FirebaseService.getAllDevotions();
        console.log(`Found ${devotions.length} devotions`);
        
        if (devotions.length > 0) {
        console.log('First devotion:', devotions[0]);
        }
        
        return { success: true, count: devotions.length, devotions };
        
    } catch (error) {
        console.error('Error testing devotions:', error);
        const errorMessage = (error instanceof Error) ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
    };

    // Test specific collection operations
    export const testPrayerRequestsCollection = async () => {
    try {
        console.log('Testing prayer requests collection...');
        
        const prayerRequests = await FirebaseService.getAllPrayerRequests();
        console.log(`Found ${prayerRequests.length} prayer requests`);
        
        if (prayerRequests.length > 0) {
        console.log('First prayer request:', prayerRequests[0]);
        }
        
        return { success: true, count: prayerRequests.length, prayerRequests };
        
    } catch (error) {
        console.error('Error testing prayer requests:', error);
        const errorMessage = (error instanceof Error) ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
    };