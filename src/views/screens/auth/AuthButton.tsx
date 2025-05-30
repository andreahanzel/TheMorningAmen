// src/views/screens/auth/AuthButton.tsx
// Reusable button component for authentication screens
// This component provides consistent styling and behavior across all auth screens

import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    GestureResponderEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export interface AuthButtonProps {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    disabled?: boolean;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'social';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
    gradientColors?: readonly string[];
}

export const AuthButton: React.FC<AuthButtonProps> = ({
    title,
    onPress,
    disabled = false,
    loading = false,
    variant = 'primary',
    size = 'medium',
    fullWidth = true,
    icon,
    style,
    textStyle,
    gradientColors,
}) => {
    
    const getButtonStyle = (): ViewStyle[] => {
        const baseStyles: ViewStyle[] = [styles.button];
        
        if (fullWidth) baseStyles.push(styles.fullWidth);
        if (disabled) baseStyles.push(styles.disabled);
        
        switch (size) {
            case 'small':
                baseStyles.push(styles.smallButton);
                break;
            case 'large':
                baseStyles.push(styles.largeButton);
                break;
            default:
                baseStyles.push(styles.mediumButton);
        }
        
        if (variant === 'outline') {
            baseStyles.push(styles.outlineButton);
        } else if (variant === 'secondary') {
            baseStyles.push(styles.secondaryButton);
        } else if (variant === 'social') {
            baseStyles.push(styles.socialButton);
        }
        
        return baseStyles;
    };
    
    const getTextStyle = (): TextStyle[] => {
        const baseStyles: TextStyle[] = [styles.buttonText];
        
        switch (size) {
            case 'small':
                baseStyles.push(styles.smallText);
                break;
            case 'large':
                baseStyles.push(styles.largeText);
                break;
            default:
                baseStyles.push(styles.mediumText);
        }
        
        if (variant === 'outline') {
            baseStyles.push(styles.outlineText);
        } else if (variant === 'secondary') {
            baseStyles.push(styles.secondaryText);
        }
        
        return baseStyles;
    };
    
    const getGradientColors = (): readonly string[] => {
    if (gradientColors) return gradientColors;
        
        switch (variant) {
            case 'primary':
                return disabled 
                    ? ['#999', '#666', '#444'] 
                    : ['#ffeb3b', '#ff9800', '#ff6b35'];
            case 'secondary':
                return ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'];
            default:
                return ['#ffeb3b', '#ff9800', '#ff6b35'];
        }
    };
    
    const buttonContent = (
        <>
            {icon && <>{icon}</>}
            <Text style={[...getTextStyle(), textStyle]}>
                {loading ? 'Loading...' : title}
            </Text>
        </>
    );
    
    if (variant === 'outline' || variant === 'secondary') {
        return (
            <TouchableOpacity
                style={[...getButtonStyle(), style]}
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={0.8}
            >
                {buttonContent}
            </TouchableOpacity>
        );
    }
    
    return (
        <TouchableOpacity
            style={[...getButtonStyle(), style]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.9}
        >
            <LinearGradient
                colors={getGradientColors() as readonly [string, string, string]}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                {buttonContent}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 30,
        shadowColor: '#ffeb3b',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
        marginVertical: 8,
    },
    
    fullWidth: {
        width: '100%',
    },
    
    disabled: {
        shadowOpacity: 0.1,
        elevation: 2,
    },
    
    smallButton: {
        minHeight: 40,
    },
    
    mediumButton: {
        minHeight: 50,
    },
    
    largeButton: {
        minHeight: 60,
    },
    
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowOpacity: 0,
        elevation: 0,
    },
    
    secondaryButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowOpacity: 0.2,
        elevation: 4,
    },
    
    socialButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        paddingHorizontal: 28,
        paddingVertical: 16,
        minHeight: 52,
    },
    
    gradient: {
        paddingVertical: 18,
        paddingHorizontal: 40,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        minHeight: 50,
    },
    
    buttonText: {
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
        textAlign: 'center',
    },
    
    smallText: {
        fontSize: 14,
    },
    
    mediumText: {
        fontSize: 16,
    },
    
    largeText: {
        fontSize: 18,
    },
    
    outlineText: {
        color: '#FFFFFF',
        textShadowColor: 'transparent',
    },
    
    secondaryText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontFamily: 'Outfit_400Regular',
    },
});

// Export additional button variants for specific use cases
export const PrimaryButton: React.FC<Omit<AuthButtonProps, 'variant'>> = (props) => (
    <AuthButton {...props} variant="primary" />
);

export const SecondaryButton: React.FC<Omit<AuthButtonProps, 'variant'>> = (props) => (
    <AuthButton {...props} variant="secondary" />
);

export const OutlineButton: React.FC<Omit<AuthButtonProps, 'variant'>> = (props) => (
    <AuthButton {...props} variant="outline" />
);

export const SocialButton: React.FC<Omit<AuthButtonProps, 'variant'>> = (props) => (
    <AuthButton {...props} variant="social" />
);