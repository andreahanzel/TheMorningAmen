// src/views/components/common/AppText.tsx

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

// Reusable text component with built-in typography styles
// This component provides a consistent way to render text with different styles and colors throughout the app.
// It uses the typography system defined in src/styles/typography.ts and colors from src/styles/colors.ts.

import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { typography } from '../../../styles/typography';
import { colors } from '../../../styles/colors';

type TextVariant = 
    | 'heroTitle'
    | 'sectionHeader'
    | 'cardTitle'
    | 'body'
    | 'caption'
    | 'subtitle'
    | 'button'
    | 'verse'
    | 'verseQuote'
    | 'verseReference';

    interface AppTextProps extends TextProps {
    variant?: TextVariant;
    color?: string;
    children: React.ReactNode;
    }

    export const AppText: React.FC<AppTextProps> = ({
    variant = 'body',
    color = colors.neutral.black,
    style,
    children,
    ...props
    }) => {
    const textStyle = typography.styles[variant];
    
    return (
        <Text
        style={[
            textStyle,
            { color },
            style,
        ]}
        {...props}
        >
        {children}
        </Text>
    );
    };

    // Pre-styled components for common use cases
    export const HeroTitle: React.FC<Omit<AppTextProps, 'variant'>> = (props) => (
    <AppText variant="heroTitle" color={colors.neutral.white} {...props} />
    );

    export const SectionHeader: React.FC<Omit<AppTextProps, 'variant'>> = (props) => (
    <AppText variant="sectionHeader" color={colors.primary.coral} {...props} />
    );

    export const CardTitle: React.FC<Omit<AppTextProps, 'variant'>> = (props) => (
    <AppText variant="cardTitle" color={colors.neutral.darkGray} {...props} />
    );

    export const BodyText: React.FC<Omit<AppTextProps, 'variant'>> = (props) => (
    <AppText variant="body" color={colors.neutral.darkGray} {...props} />
    );

    export const CaptionText: React.FC<Omit<AppTextProps, 'variant'>> = (props) => (
    <AppText variant="caption" color={colors.neutral.gray} {...props} />
    );

    export const SubtitleText: React.FC<Omit<AppTextProps, 'variant'>> = (props) => (
    <AppText variant="subtitle" color={colors.secondary.warmCream} {...props} />
    );

    export const ButtonText: React.FC<Omit<AppTextProps, 'variant'>> = (props) => (
    <AppText variant="button" color={colors.neutral.white} {...props} />
    );

    export const VerseText: React.FC<Omit<AppTextProps, 'variant'>> = (props) => (
    <AppText variant="verse" color={colors.primary.deepOrange} {...props} />
    );

    export const VerseQuote: React.FC<Omit<AppTextProps, 'variant'>> = (props) => (
    <AppText variant="verseQuote" color={colors.primary.coral} {...props} />
    );

    export const VerseReference: React.FC<Omit<AppTextProps, 'variant'>> = (props) => (
    <AppText variant="verseReference" color={colors.secondary.mediumOrange} {...props} />
    );

// Usage example:
// <HeroTitle>Welcome to The Morning Amen</HeroTitle>
// <BodyText>This is body text using Nunito Sans</BodyText>
// <VerseQuote>"For I know the plans I have for you..."</VerseQuote>
// <VerseReference>Jeremiah 29:11</VerseReference>