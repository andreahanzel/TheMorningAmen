// src/controllers/contexts/PrayerContext.tsx

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

// Prayer Context with Firestore real-time integration
// Manages prayer requests, comments, and real-time updates

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    arrayUnion,
    arrayRemove,
    increment
} from 'firebase/firestore';
import { db } from '../../../firebase.config';
import { authService } from '../../models/services/AuthService';
import { useAuth } from './AuthContext';

export interface Comment {
    id: string;
    prayerId: string;
    text: string;
    authorName: string;
    isAnonymous: boolean;
    date: string;
    likes: number;
    userHasLiked: boolean;
}

export interface Prayer {
    id: string;
    text: string;
    category: string;
    isAnonymous: boolean;
    authorName?: string;
    date: string;
    prayerCount: number;
    userHasPrayed: boolean;
    lastPrayedDate?: string;
    imageUri?: string;
    authorId: string;
    comments: Comment[];
    commentsCount: number;
}

interface PrayerContextType {
    prayers: Prayer[];
    loading: boolean;
    error: string | null;
    addPrayer: (prayer: Omit<Prayer, 'id' | 'date' | 'prayerCount' | 'commentsCount'>) => Promise<void>;
    updatePrayer: (id: string, updates: Partial<Prayer>) => Promise<void>;
    deletePrayer: (id: string) => Promise<void>;
    prayForRequest: (prayerId: string) => Promise<void>;
    addComment: (prayerId: string, comment: Omit<Comment, 'id' | 'date' | 'likes' | 'userHasLiked'>) => Promise<void>;
    likeComment: (prayerId: string, commentId: string) => Promise<void>;
    refreshPrayers: () => Promise<void>;
}

const PrayerContext = createContext<PrayerContextType | undefined>(undefined);

export const usePrayer = () => {
    const context = useContext(PrayerContext);
    if (!context) {
        throw new Error('usePrayer must be used within a PrayerProvider');
    }
    return context;
};

interface PrayerProviderProps {
    children: ReactNode;
}

export const PrayerProvider: React.FC<PrayerProviderProps> = ({ children }) => {
    const [prayers, setPrayers] = useState<Prayer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<{id: string, name: string} | null>(null);
    

    const { user: authUser } = useAuth();

// Initialize user session from auth context
    useEffect(() => {
        if (authUser) {
            setCurrentUser({
                id: authUser.id,
                name: `${authUser.firstName} ${authUser.lastName}`
            });
        } else {
            // Fallback demo user for testing
            const demoUser = {
                id: 'demo_user_' + Date.now(),
                name: 'Demo User'
            };
            setCurrentUser(demoUser);
        }
    }, [authUser]);

    // Real-time listener for prayers
    useEffect(() => {
        const prayersQuery = query(
            collection(db, 'prayerRequests'),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(
            prayersQuery,
            (snapshot) => {
                const prayerData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Prayer[];
                
                setPrayers(prayerData);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('Error listening to prayers:', err);
                setError('Failed to load prayers');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const addPrayer = async (prayerData: Omit<Prayer, 'id' | 'date' | 'prayerCount' | 'commentsCount'>) => {
        try {
            // For now, allow anonymous prayer submissions
            const newPrayer = {
                ...prayerData,
                date: serverTimestamp(),
                prayerCount: 0,
                commentsCount: 0,
                comments: [],
                userHasPrayed: false
            };

            await addDoc(collection(db, 'prayerRequests'), newPrayer);
        } catch (err) {
            console.error('Error adding prayer:', err);
            setError('Failed to add prayer');
            throw err;
        }
    };

    const updatePrayer = async (id: string, updates: Partial<Prayer>) => {
        try {
            const prayerRef = doc(db, 'prayerRequests', id);
            await updateDoc(prayerRef, updates);
        } catch (err) {
            console.error('Error updating prayer:', err);
            setError('Failed to update prayer');
            throw err;
        }
    };

    const deletePrayer = async (id: string) => {
        try {
            console.log('PrayerContext: Starting delete for prayer ID:', id);
            
            // Check if the document exists first
            const prayerRef = doc(db, 'prayerRequests', id);
            console.log('PrayerContext: Created document reference:', prayerRef.path);
            
            // Attempt the deletion
            await deleteDoc(prayerRef);
            console.log('PrayerContext: Delete operation completed successfully');
            
            // Verify the prayer is removed from local state
            const stillExists = prayers.find(p => p.id === id);
            console.log('PrayerContext: Prayer still in local state?', !!stillExists);
            
        } catch (err) {
            console.error('PrayerContext: Error deleting prayer:', err);
            console.error('PrayerContext: Error details:', {
                name: err instanceof Error ? err.name : 'Unknown',
                message: err instanceof Error ? err.message : String(err),
                code: (err as any)?.code,
                details: (err as any)?.details
            });
            setError('Failed to delete prayer');
            throw err;
        }
    };

    const prayForRequest = async (prayerId: string) => {
        try {
            if (!currentUser) {
                throw new Error('Must be logged in to pray for requests');
            }

            const prayer = prayers.find(p => p.id === prayerId);
            if (!prayer) return;

            // Check if user can pray today
            if (prayer.lastPrayedDate) {
                const lastPrayed = new Date(prayer.lastPrayedDate);
                const today = new Date();
                const diffTime = Math.abs(today.getTime() - lastPrayed.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays < 1) {
                    throw new Error('You can only pray once per day for each request');
                }
            }

            const prayerRef = doc(db, 'prayerRequests', prayerId);

            await updateDoc(prayerRef, {
                prayerCount: increment(1),
                userHasPrayed: true,
                lastPrayedDate: new Date().toISOString()
            });

        } catch (err) {
            console.error('Error praying for request:', err);
            setError('Failed to pray for request');
            throw err;
        }
    };

    const addComment = async (prayerId: string, commentData: Omit<Comment, 'id' | 'date' | 'likes' | 'userHasLiked'>) => {
        try {
            if (!currentUser) {
                throw new Error('Must be logged in to comment');
            }

            const comment: Comment = {
                ...commentData,
                id: Date.now().toString(),
                date: new Date().toISOString(),
                likes: 0,
                userHasLiked: false
            };

            const prayerRef = doc(db, 'prayerRequests', prayerId);
            await updateDoc(prayerRef, {
                comments: arrayUnion(comment),
                commentsCount: increment(1)
            });

        } catch (err) {
            console.error('Error adding comment:', err);
            setError('Failed to add comment');
            throw err;
        }
    };

    const likeComment = async (prayerId: string, commentId: string) => {
        try {
            if (!currentUser) {
                throw new Error('Must be logged in to like comments');
            }

            const prayer = prayers.find(p => p.id === prayerId);
            if (!prayer) return;

            const comment = prayer.comments.find(c => c.id === commentId);
            if (!comment) return;

            const updatedComment = {
                ...comment,
                likes: comment.userHasLiked ? comment.likes - 1 : comment.likes + 1,
                userHasLiked: !comment.userHasLiked
            };

            const updatedComments = prayer.comments.map(c => 
                c.id === commentId ? updatedComment : c
            );

            const prayerRef = doc(db, 'prayerRequests', prayerId);
            await updateDoc(prayerRef, {
                comments: updatedComments
            });

        } catch (err) {
            console.error('Error liking comment:', err);
            setError('Failed to like comment');
            throw err;
        }
    };

    const refreshPrayers = async () => {
        setLoading(true);
        // The real-time listener will automatically update the prayers
    };

    const value: PrayerContextType = {
        prayers,
        loading,
        error,
        addPrayer,
        updatePrayer,
        deletePrayer,
        prayForRequest,
        addComment,
        likeComment,
        refreshPrayers
    };

    return (
        <PrayerContext.Provider value={value}>
            {children}
        </PrayerContext.Provider>
    );
};