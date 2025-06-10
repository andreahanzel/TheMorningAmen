// src/styles/colors.ts

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.


// Color palette extracted from The Morning Amen logo design I designed
// This file defines a color palette for use in the app, including primary, secondary, neutral, spiritual, gradients, and status colors.
// The colors are inspired by the logo's gradient and spiritual themes, providing a cohesive and calming aesthetic.

export const colors = {
    // Primary colors from logo gradient
    primary: {
        sunrise: '#ff9a56',      // Main gradient start
        coral: '#ff6b35',        // Main gradient middle  
        amber: '#f7931e',        // Main gradient end
        gold: '#ffeb3b',         // Logo gold accent
        orange: '#ff9800',       // Logo orange tone
        deepOrange: '#ff5722',   // Logo deep orange
    },
    
    // Secondary colors from logo elements
    secondary: {
        lightGold: '#ffa726',    // Inner circle light
        mediumOrange: '#ff7043', // Inner circle medium
        warmCream: '#fff8e1',    // Subtitle color
        sunGlow: '#ffc107',      // Sun symbol color
    },
    
    // Neutral colors for UI
    neutral: {
        white: '#FFFFFF',
        lightGray: '#F5F5F5',
        gray: '#8E8E93',
        darkGray: '#3A3A3C',
        black: '#000000',
    },
    
    // Spiritual theme colors
    spiritual: {
        heavenly: '#E8F4FD',     // Light blue for peace
        peaceful: '#F0F8F0',     // Light green for growth
        warm: '#FFF5F0',         // Warm white for comfort
        divine: '#FFF8E7',       // Cream for sacred
    },
    
    // Gradients (for LinearGradient usage)
    gradients: {
        main: ['#ff9a56', '#ff6b35', '#f7931e'],
        golden: ['#ffeb3b', '#ff9800', '#ff5722'],
        warm: ['#ffa726', '#ff7043', '#ff5722'],
        heavenly: ['#E8F4FD', '#FFF8E7'],
        sunrise: ['#ff9a56', '#ffeb3b'],
    },
    
    // Status colors
    status: {
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3',
    },
    }

export default colors;