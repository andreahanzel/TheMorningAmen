// src/models/services/FirebaseService.ts
// Firebase service for managing all collections and data operations
// This file contains methods for CRUD operations and data initialization

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

    import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    limit,
    writeBatch,
    increment
    } from 'firebase/firestore';
    import { db } from '../../../firebase.config';

    // Import your local data
    import devotionsData from '../data/devotions.json';
    import affirmationsData from '../data/affirmations.json';
    import versesData from '../data/verses.json';
    import videosData from '../data/videos.json';


    export class FirebaseService {
    
    // ========== DEVOTIONS ==========
    static async getAllDevotions() {
        try {
        const querySnapshot = await getDocs(
            query(collection(db, 'devotions'), orderBy('date', 'desc'))
        );
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        } catch (error) {
        console.error('Error fetching devotions:', error);
        throw error;
        }
    }

    static async addDevotion(devotion: any) {
        try {
        const docRef = await addDoc(collection(db, 'devotions'), {
            ...devotion,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        return docRef.id;
        } catch (error) {
        console.error('Error adding devotion:', error);
        throw error;
        }
    }

    // ========== AFFIRMATIONS ==========
    static async getAllAffirmations() {
        try {
        const querySnapshot = await getDocs(collection(db, 'affirmations'));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        } catch (error) {
        console.error('Error fetching affirmations:', error);
        throw error;
        }
    }

    static async addAffirmation(affirmation: any) {
        try {
        const docRef = await addDoc(collection(db, 'affirmations'), {
            ...affirmation,
            createdAt: new Date().toISOString()
        });
        return docRef.id;
        } catch (error) {
        console.error('Error adding affirmation:', error);
        throw error;
        }
    }

    // ========== VERSES ==========
    static async getAllVerses() {
        try {
        const querySnapshot = await getDocs(collection(db, 'verses'));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        } catch (error) {
        console.error('Error fetching verses:', error);
        throw error;
        }
    }

    static async getTodaysVerse() {
        try {
        const today = new Date().toISOString().split('T')[0];
        const q = query(
            collection(db, 'verses'), 
            where('date', '==', today),
            limit(1)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        }
        
        // If no verse for today, get a random one
        const allVerses = await this.getAllVerses();
        const randomIndex = Math.floor(Math.random() * allVerses.length);
        return allVerses[randomIndex];
        } catch (error) {
        console.error('Error fetching today\'s verse:', error);
        throw error;
        }
    }

    // ========== VIDEOS ==========
    static async getAllVideos() {
        try {
        const querySnapshot = await getDocs(
            query(collection(db, 'videos'), orderBy('date', 'desc'))
        );
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        } catch (error) {
        console.error('Error fetching videos:', error);
        throw error;
        }
    }

    static async addVideo(video: any) {
        try {
        const docRef = await addDoc(collection(db, 'videos'), {
            ...video,
            createdAt: new Date().toISOString(),
            viewCount: 0
        });
        return docRef.id;
        } catch (error) {
        console.error('Error adding video:', error);
        throw error;
        }
    }

    // ========== PRAYER REQUESTS ==========
    static async getAllPrayerRequests() {
        try {
        const querySnapshot = await getDocs(
            query(collection(db, 'prayerRequests'), orderBy('date', 'desc'))
        );
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        } catch (error) {
        console.error('Error fetching prayer requests:', error);
        throw error;
        }
    }

    static async addPrayerRequest(prayerRequest: any) {
        try {
        const docRef = await addDoc(collection(db, 'prayerRequests'), {
            ...prayerRequest,
            date: new Date().toISOString(),
            prayerCount: 0,
            comments: [],
            commentsCount: 0
        });
        return docRef.id;
        } catch (error) {
        console.error('Error adding prayer request:', error);
        throw error;
        }
    }

    static async addPrayerToPrayerRequest(prayerRequestId: string) {
        try {
        const prayerRef = doc(db, 'prayerRequests', prayerRequestId);
        await updateDoc(prayerRef, {
            prayerCount: increment(1)
        });
        } catch (error) {
        console.error('Error adding prayer:', error);
        throw error;
        }
    }

    // ========== USER FAVORITES ==========
    static async getUserFavorites(userId: string) {
        try {
        const querySnapshot = await getDocs(
            query(collection(db, 'userFavorites'), where('userId', '==', userId))
        );
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        } catch (error) {
        console.error('Error fetching user favorites:', error);
        throw error;
        }
    }

    static async addToFavorites(userId: string, itemType: string, itemId: string, itemData: any) {
        try {
        const docRef = await addDoc(collection(db, 'userFavorites'), {
            userId,
            itemType,
            itemId,
            itemData,
            createdAt: new Date().toISOString()
        });
        return docRef.id;
        } catch (error) {
        console.error('Error adding to favorites:', error);
        throw error;
        }
    }

    static async removeFromFavorites(favoriteId: string) {
        try {
        await deleteDoc(doc(db, 'userFavorites', favoriteId));
        } catch (error) {
        console.error('Error removing from favorites:', error);
        throw error;
        }
    }

    // ========== DATA INITIALIZATION ==========
    // This method uploads your local JSON data to Firebase
    static async initializeFirebaseData() {
        try {
        console.log('Starting Firebase data initialization...');
        const batch = writeBatch(db);

        // Upload Devotions
        devotionsData.forEach((devotion: any) => {
            const devotionRef = doc(collection(db, 'devotions'));
            batch.set(devotionRef, {
            ...devotion,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
            });
        });

        // Upload Affirmations
        affirmationsData.forEach((affirmation: any) => {
            const affirmationRef = doc(collection(db, 'affirmations'));
            batch.set(affirmationRef, {
            ...affirmation,
            createdAt: new Date().toISOString()
            });
        });

        // Upload Verses
        versesData.forEach((verse: any) => {
            const verseRef = doc(collection(db, 'verses'));
            batch.set(verseRef, {
            ...verse,
            createdAt: new Date().toISOString()
            });
        });

        // Upload Videos
        videosData.forEach((video: any) => {
            const videoRef = doc(collection(db, 'videos'));
            batch.set(videoRef, {
            ...video,
            createdAt: new Date().toISOString(),
            viewCount: 0
            });
        });

        // Sample Prayer Requests
        const samplePrayerRequests = [
            {
            text: 'Please pray for my family during this difficult time. We need God\'s peace and guidance as we navigate through these challenges.',
            category: 'Family',
            isAnonymous: true,
            date: new Date().toISOString(),
            prayerCount: 12,
            authorId: 'sample1',
            comments: [],
            commentsCount: 0
            },
            {
            text: 'Seeking prayers for healing and strength during my recovery. Thank you for your support.',
            category: 'Health',
            isAnonymous: false,
            date: new Date().toISOString(),
            prayerCount: 8,
            authorId: 'sample2',
            comments: [],
            commentsCount: 0
            }
        ];

        samplePrayerRequests.forEach((prayer: any) => {
            const prayerRef = doc(collection(db, 'prayerRequests'));
            batch.set(prayerRef, prayer);
        });

        // Commit the batch
        await batch.commit();
        console.log('Firebase data initialization completed!');
        
        return { success: true, message: 'All data uploaded successfully!' };

        } catch (error) {
        console.error('Firebase initialization failed:', error);
        return { success: false, error: error instanceof Error ? error.message : String(error) };
        }
    }

    // ========== UTILITY METHODS ==========
    static async clearCollection(collectionName: string) {
        try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const batch = writeBatch(db);
        
        querySnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        
        await batch.commit();
        console.log(`Collection ${collectionName} cleared successfully`);
        } catch (error) {
        console.error(`Error clearing collection ${collectionName}:`, error);
        throw error;
        }
    }

    static async getCollectionCount(collectionName: string) {
        try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        return querySnapshot.size;
        } catch (error) {
        console.error(`Error getting count for ${collectionName}:`, error);
        return 0;
        }
    }

    // ========== USER MANAGEMENT ==========
        static async updateUserPushToken(userId: string, token: string): Promise<void> {
        try {
            // This is a placeholder - implement if needed
            console.log('Update push token for user:', userId, token);
        } catch (error) {
            console.error('Error updating push token:', error);
        }
    }
}