// src/views/components/common/LoadingSpinner.tsx

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

// This file defines a reusable loading spinner component

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export const LoadingSpinner = () => (
    <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFFFFF" />
    </View>
    );

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});