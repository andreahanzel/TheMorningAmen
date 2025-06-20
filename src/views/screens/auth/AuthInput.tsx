// src/views/screens/auth/AuthInput.tsx

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

// Reusable input component for authentication screens
// This file defines the AuthInput component
// It provides a customizable input field with validation, error handling, and optional password visibility toggle

import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
    ViewStyle,
    TextInputProps,
} from 'react-native';

interface AuthInputProps extends TextInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    error?: string;
    isValid?: boolean;
    isFocused?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    showPasswordToggle?: boolean;
    secureTextEntry?: boolean;
    onTogglePassword?: () => void;
    containerStyle?: ViewStyle;
    inputStyle?: ViewStyle;
}

// AuthInput component
export const AuthInput: React.FC<AuthInputProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    isValid,
    isFocused,
    onFocus,
    onBlur,
    showPasswordToggle,
    secureTextEntry,
    onTogglePassword,
    containerStyle,
    inputStyle,
    ...textInputProps
}) => {
    
    const getInputWrapperStyle = (): ViewStyle[] => {
        const baseStyles: ViewStyle[] = [styles.inputWrapper];

        if (isFocused) baseStyles.push(styles.inputWrapperFocused);
        if (error) baseStyles.push(styles.inputWrapperError);
        else if (isValid) baseStyles.push(styles.inputWrapperSuccess);

        return baseStyles;
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={getInputWrapperStyle()}>
                <TextInput
                    style={[styles.input, inputStyle]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    selectionColor="rgba(255, 255, 255, 0.5)"
                    underlineColorAndroid="transparent"
                    onFocus={onFocus}
                    onBlur={onBlur}
                    secureTextEntry={secureTextEntry}
                    {...textInputProps}
                />
                
                {/* Password Toggle Button */}
                {showPasswordToggle && (
                    <TouchableOpacity
                        style={styles.visibilityButton}
                        onPress={onTogglePassword}
                    >
                        <View style={styles.eyeIcon}>
                            {!secureTextEntry ? (
                                <View style={styles.eyeContainer}>
                                    <View style={styles.eyeOuter} />
                                    <View style={styles.eyeInner} />
                                </View>
                            ) : (
                                <View style={styles.eyeContainer}>
                                    <View style={styles.eyeOuter} />
                                    <View style={styles.eyeSlash} />
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
                
                {/* Validation Icon */}
                {isValid && !error && (
                    <Text style={styles.validationIcon}>✓</Text>
                )}
            </View>
            
            {/* Error Message */}
            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    );
};

// Styles for the AuthInput component
const styles = StyleSheet.create({
    container: {
        marginBottom: 18,
    },
    
    inputLabel: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 10,
        marginLeft: 2,
    },
    
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 16,
        overflow: 'hidden',
        minWidth: 0,
    },
    
    inputWrapperFocused: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderColor: 'rgba(255, 255, 255, 0.4)',
        transform: [{ scale: 1.02 }],
    },
    
    inputWrapperSuccess: {
        borderColor: 'rgba(76, 175, 80, 0.6)',
        backgroundColor: 'rgba(76, 175, 80, 0.08)',
    },
    
    inputWrapperError: {
        borderColor: 'rgba(255, 68, 68, 0.6)',
        backgroundColor: 'rgba(255, 68, 68, 0.08)',
    },
    
    input: {
        flex: 1,
        fontFamily: 'NunitoSans_400Regular',
        fontSize: 16,
        color: '#FFFFFF',
        paddingVertical: 16,
        backgroundColor: 'transparent',
        paddingRight: 8,
        ...(Platform.OS === 'web' && {
            outlineWidth: 0,
            outlineColor: 'transparent',
            boxShadow: '0 0 0px 1000px transparent inset',
            transition: 'background-color 5000s ease-in-out 0s',
        }),
    },
    
    visibilityButton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    eyeIcon: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    eyeContainer: {
        width: 20,
        height: 14,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    eyeOuter: {
        width: 18,
        height: 12,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
    },
    
    eyeInner: {
        position: 'absolute',
        width: 6,
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 3,
    },
    
    eyeSlash: {
        position: 'absolute',
        width: 20,
        height: 1.5,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        transform: [{ rotate: '45deg' }],
    },
    
    validationIcon: {
        fontSize: 18,
        color: '#4caf50',
        fontWeight: 'bold',
        alignSelf: 'center',
        marginLeft: 8,
        marginTop: 1,
        minWidth: 20,
    },
    
    errorText: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 12,
        color: '#ff4444',
        marginTop: 6,
        marginLeft: 2,
    },
});