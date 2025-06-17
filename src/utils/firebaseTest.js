// src/utils/firebaseTest.js
// Test Firebase connection with Expo Web SDK
// This file tests basic Firestore operations to ensure connectivity and functionality.

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

import { db } from '../../firebase.config';
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { auth } from '../../firebase.config';

// Test Firebase connection and basic Firestore operations
  export const testFirebaseConnection = async () => {
      try {
          console.log('Testing Firebase connection...');
          
                
                // Test 1: Write a test document (no auth needed for test collection)
                const testDoc = {
                    message: 'Hello from The Morning Amen!',
                    timestamp: new Date().toISOString(),
                    testConnection: true,
                    platform: 'expo'
                };                       
                    
                const docRef = await addDoc(collection(db, 'test'), testDoc);
                console.log('Document written with ID:', docRef.id);
                
                // Test 2: Read documents
                const querySnapshot = await getDocs(collection(db, 'test'));
                console.log('Documents found:', querySnapshot.size);
                
                return { success: true, documentId: docRef.id };
                
            } catch (error) {
                console.error('Firebase connection failed:', error);
                return { success: false, error: error.message };
            }
        };
                                  
  // (Removed duplicate and misplaced code block)

  // Test Firestore CRUD operations
    export const testFirestoreOperations = async () => {
      try {
        console.log('Testing Firestore CRUD operations...');
        
        // CREATE - Add a sample devotion
        const sampleDevotion = {
          title: "Test Devotion",
          content: "This is a test devotion from Firebase",
          author: "System Test",
          date: new Date().toISOString(),
          category: "daily",
          isPublished: true
        };
        
        const devotionRef = await addDoc(collection(db, 'devotions'), sampleDevotion);
        console.log('CREATE: Devotion added with ID:', devotionRef.id);
        
        // READ - Fetch devotions
        const devotionsSnapshot = await getDocs(collection(db, 'devotions'));
        console.log('READ: Found devotions:', devotionsSnapshot.size);
        
        return { success: true, devotionId: devotionRef.id };
        
      } catch (error) {
        console.error('Firestore operations failed:', error);
        return { success: false, error: error.message };
      }
};