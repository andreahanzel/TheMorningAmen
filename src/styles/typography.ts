// src/styles/typography.ts

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.


// Typography system for The Morning Amen logo
// This file defines the typography styles used in the app, including font families, sizes, weights, and predefined text styles that match the logo aesthetic.

export const typography = {
  // Font families
    fonts: {
        // Hero titles and headers - Clean, modern, impactful
        heading: 'Outfit_600SemiBold', // Primary heading font
        headingLight: 'Outfit_300Light',
        headingBold: 'Outfit_700Bold',
        headingBlack: 'Outfit_900Black',
        
        // UI text, body, buttons - Friendly, readable, professional
        body: 'NunitoSans_400Regular', // Primary body font
        bodyLight: 'NunitoSans_300Light',
        bodySemiBold: 'NunitoSans_600SemiBold',
        bodyBold: 'NunitoSans_700Bold',
        
        // Verses and spiritual quotes - Elegant, traditional, sacred
        verse: 'LibreBaskerville_400Regular', // For spiritual content
        verseItalic: 'LibreBaskerville_400Regular_Italic',
        verseBold: 'LibreBaskerville_700Bold',
        
        // Fallback
        mono: 'Courier New',
        system: 'System',
    },
    
    // Font sizes
    sizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 28,
        '4xl': 32,
        '5xl': 36,
        '6xl': 48,
    },
    
    // Font weights
    weights: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
    },
    
    // Line heights
    lineHeights: {
        tight: 1.2,
        normal: 1.4,
        relaxed: 1.6,
        loose: 1.8,
    },
    
    // Letter spacing
    letterSpacing: {
        tight: -0.5,
        normal: 0,
        wide: 0.5,
        wider: 1,
        widest: 2,
    },
    
    // Predefined text styles matching logo aesthetic
    styles: {
        // Main title style (like logo text) - Using Outfit
        heroTitle: {
        fontFamily: 'Outfit_900Black',
        fontSize: 32,
        letterSpacing: 1.2,
        lineHeight: 1.1,
        textTransform: 'uppercase' as const,
        },
        
        // Section headers - Using Outfit
        sectionHeader: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 24,
        letterSpacing: 0.5,
        lineHeight: 1.3,
        },
        
        // Card titles - Using Nunito Sans
        cardTitle: {
        fontFamily: 'NunitoSans_600SemiBold',
        fontSize: 18,
        lineHeight: 1.4,
        },
        
        // Body text - Using Nunito Sans
        body: {
        fontFamily: 'NunitoSans_400Regular',
        fontSize: 16,
        lineHeight: 1.6,
        },
        
        // Caption text - Using Nunito Sans
        caption: {
        fontFamily: 'NunitoSans_300Light',
        fontSize: 14,
        lineHeight: 1.4,
        letterSpacing: 0.5,
        },
        
        // Subtitle (like logo subtitle) - Using Outfit
        subtitle: {
        fontFamily: 'Outfit_300Light',
        fontSize: 14,
        letterSpacing: 3,
        textTransform: 'uppercase' as const,
        opacity: 0.95,
        },
        
        // Button text - Using Nunito Sans
        button: {
        fontFamily: 'NunitoSans_600SemiBold',
        fontSize: 16,
        letterSpacing: 0.5,
        textTransform: 'uppercase' as const,
        },
        
        // Verse text - Using Libre Baskerville
        verse: {
        fontFamily: 'LibreBaskerville_400Regular',
        fontSize: 18,
        lineHeight: 1.8,
        letterSpacing: 0.2,
        },
        
        // Verse quote - Using Libre Baskerville Italic
        verseQuote: {
        fontFamily: 'LibreBaskerville_400Regular_Italic',
        fontSize: 20,
        lineHeight: 1.7,
        letterSpacing: 0.3,
        textAlign: 'center' as const,
        },
        
        // Small verse reference - Using Libre Baskerville
        verseReference: {
        fontFamily: 'LibreBaskerville_700Bold',
        fontSize: 14,
        letterSpacing: 1,
        textAlign: 'right' as const,
        },
    },
}

export default typography;