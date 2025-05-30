// src/views/components/common/LoadingSpinner.tsx
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