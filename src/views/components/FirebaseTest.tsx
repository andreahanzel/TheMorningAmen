// src/components/FirebaseTest.tsx
// Simple component to test Firebase connection

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { testFirebaseConnection } from '../../utils/firebaseTest';

    export const FirebaseTest: React.FC = () => {
    const [status, setStatus] = useState<string>('Not tested');
    const [isLoading, setIsLoading] = useState(false);

    const runTest = async () => {
        setIsLoading(true);
        setStatus('Testing...');
        
        try {
        const result = await testFirebaseConnection();
        if (result.success) {
            setStatus(`Success! Doc ID: ${result.documentId}`);
        } else {
            setStatus(`Failed: ${result.error}`);
        }
        } catch (error) {
        if (error instanceof Error) {
            setStatus(`Error: ${error.message}`);
        } else {
            setStatus('An unknown error occurred.');
        }
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Firebase Connection Test</Text>
        <Text style={styles.status}>{status}</Text>
        <TouchableOpacity 
            style={styles.button} 
            onPress={runTest}
            disabled={isLoading}
        >
            <Text style={styles.buttonText}>
            {isLoading ? 'Testing...' : 'Test Firebase'}
            </Text>
        </TouchableOpacity>
        </View>
    );
    };

    const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        margin: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    status: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#ff6b35',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    });