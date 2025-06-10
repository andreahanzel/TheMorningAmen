// src/styles/theme.ts

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

// Main theme configuration combining colors and typography
// This file defines the overall theme for the app, including colors, typography, spacing, shadows, and component sizes.

import { colors } from './colors';
import { typography } from './typography';

export const theme = {
    colors,
    typography,
    
    // Spacing system (multiples of 4)
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 48,
        '3xl': 64,
        '4xl': 96,
    },
    
    // Border radius
    borderRadius: {
        none: 0,
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        '2xl': 24,
        full: 9999,
    },
    
    // Shadows (for elevation)
    shadows: {
        sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        },
        md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        },
        lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
        },
        xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 16,
        },
    },
    
    // Component sizes
    sizes: {
        button: {
        sm: { height: 36, paddingHorizontal: 16 },
        md: { height: 44, paddingHorizontal: 20 },
        lg: { height: 52, paddingHorizontal: 24 },
        },
        icon: {
        sm: 16,
        md: 24,
        lg: 32,
        xl: 48,
        },
    },
    
    // Animation durations
    animation: {
        fast: 150,
        normal: 250,
        slow: 350,
    },
    };

export type Theme = typeof theme;
export default theme;