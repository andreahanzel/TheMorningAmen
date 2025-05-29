// src/views/components/common/AnimatedLogo.tsx
// Animated 3D-style logo component for React Native
// Morning Amen's beautiful rotating logo with particles and animations

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AnimatedLogoProps {
    onAnimationComplete?: () => void;
    }

    export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ onAnimationComplete }) => {
    const rotateValue = useRef(new Animated.Value(0)).current;
    const scaleValue = useRef(new Animated.Value(0.8)).current;
    const floatValue = useRef(new Animated.Value(0)).current;
    const fadeValue = useRef(new Animated.Value(0)).current;
    const particleRotate1 = useRef(new Animated.Value(0)).current;
    const particleRotate2 = useRef(new Animated.Value(0)).current;
    const particleRotate3 = useRef(new Animated.Value(0)).current;
    const particleRotate4 = useRef(new Animated.Value(0)).current;
    const pulseValue = useRef(new Animated.Value(1)).current;
    const textGlow = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        startAnimations();
        
        // Optional callback after initial animation
        const timer = setTimeout(() => {
        onAnimationComplete?.();
        }, 2000);
        
        return () => clearTimeout(timer);
    }, []);

    const startAnimations = () => {
        // Initial fade in
        Animated.timing(fadeValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        }).start();

        // Initial scale up
        Animated.spring(scaleValue, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
        }).start();

        // Continuous rotation (slower for elegance)
        Animated.loop(
        Animated.timing(rotateValue, {
            toValue: 1,
            duration: 12000, // 12 seconds for smooth rotation
            useNativeDriver: true,
        })
        ).start();

        // Gentle floating motion
        Animated.loop(
        Animated.sequence([
            Animated.timing(floatValue, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
            }),
            Animated.timing(floatValue, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
            }),
        ])
        ).start();

        // Pulsing effect for outer ring
        Animated.loop(
        Animated.sequence([
            Animated.timing(pulseValue, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
            }),
            Animated.timing(pulseValue, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
            }),
        ])
        ).start();

        // Text glow effect
        Animated.loop(
        Animated.sequence([
            Animated.timing(textGlow, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false, // textShadow doesn't support native driver
            }),
            Animated.timing(textGlow, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: false,
            }),
        ])
        ).start();

        // Particle orbits with different speeds
        const particleAnimations = [
        { particle: particleRotate1, duration: 15000, delay: 0 },
        { particle: particleRotate2, duration: 18000, delay: 1000 },
        { particle: particleRotate3, duration: 12000, delay: 2000 },
        { particle: particleRotate4, duration: 20000, delay: 3000 },
        ];

        particleAnimations.forEach(({ particle, duration, delay }) => {
        setTimeout(() => {
            Animated.loop(
            Animated.timing(particle, {
                toValue: 1,
                duration,
                useNativeDriver: true,
            })
            ).start();
        }, delay);
        });
    };

    const rotation = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const float = floatValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -15],
    });

    const particleRotations = [
        particleRotate1.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
        }),
        particleRotate2.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-360deg'],
        }),
        particleRotate3.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
        }),
        particleRotate4.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-360deg'],
        }),
    ];

    return (
        <Animated.View
        style={[
            styles.container,
            {
            opacity: fadeValue,
            transform: [
                { scale: scaleValue },
                { translateY: float },
            ],
            },
        ]}
        >
        {/* Outer Pulsing Ring */}
        <Animated.View
            style={[
            styles.outerRing,
            {
                transform: [{ scale: pulseValue }],
            },
            ]}
        />
        
        {/* Accent Ring */}
        <View style={styles.accentRing} />
        
        {/* Main Rotating Circle */}
        <Animated.View
            style={[
            styles.mainCircle,
            {
                transform: [{ rotate: rotation }],
            },
            ]}
        >
            <LinearGradient
            colors={['#ffeb3b', '#ff9800', '#ff5722']}
            style={styles.circleGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            >
            {/* Inner Circle with different rotation */}
            <Animated.View
                style={[
                styles.innerCircleContainer,
                {
                    transform: [{ rotate: rotation }], // Counter-rotation for effect
                },
                ]}
            >
                <LinearGradient
                colors={['#ffa726', '#ff7043', '#ff5722']}
                style={styles.innerCircle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                />
            </Animated.View>
            </LinearGradient>
        </Animated.View>

        {/* Text Layer with Glow */}
        <View style={styles.textLayer}>
            <Animated.Text 
            style={[
                styles.mainTitle,
                {
                textShadowRadius: textGlow.interpolate({
                    inputRange: [0, 1],
                    outputRange: [4, 8],
                }),
                },
            ]}
            >
            THE MORNING{'\n'}AMEN
            </Animated.Text>
        </View>

        {/* Orbiting Particles */}
        {particleRotations.map((rotation, index) => {
            const particleStyleNames = ['particle1', 'particle2', 'particle3', 'particle4'] as const;
            const particleStyle = styles[particleStyleNames[index]];
            return (
            <Animated.View
                key={index}
                style={[
                styles.particleOrbit,
                {
                    transform: [{ rotate: rotation }],
                },
                ]}
            >
                <View style={[styles.particle, particleStyle]} />
            </Animated.View>
            );
        })}

        {/* Cross Symbol */}
        <View style={styles.crossSymbol}>
            <View style={styles.crossHorizontal} />
            <View style={styles.crossVertical} />
        </View>

        {/* Morning Sun Symbol */}
        <View style={styles.morningSymbol}>
            <LinearGradient
            colors={['#ffeb3b', '#ffc107']}
            style={styles.sunGradient}
            />
            {/* Sun rays */}
            <View style={styles.sunRays}>
            {[...Array(8)].map((_, i) => (
                <View
                key={i}
                style={[
                    styles.sunRay,
                    {
                    transform: [{ rotate: `${i * 45}deg` }],
                    },
                ]}
                />
            ))}
            </View>
        </View>

        {/* Microphone Icon */}
        <View style={styles.microphoneIcon}>
            <LinearGradient
            colors={['#ffeb3b', '#ff9800']}
            style={styles.micBackground}
            >
            <View style={styles.micShape} />
            </LinearGradient>
        </View>
        </Animated.View>
    );
    };

    const styles = StyleSheet.create({
    container: {
        width: 280,
        height: 280,
        position: 'relative',
        alignSelf: 'center',
    },
    
    outerRing: {
        position: 'absolute',
        width: 280,
        height: 280,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 140,
        top: 0,
        left: 0,
    },
    
    accentRing: {
        position: 'absolute',
        width: 260,
        height: 260,
        top: 10,
        left: 10,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 130,
    },
    
    mainCircle: {
        position: 'absolute',
        width: 220,
        height: 220,
        top: 30,
        left: 30,
        borderRadius: 110,
    },
    
    circleGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 110,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#ff9800',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 15,
    },
    
    innerCircleContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
    },
    
    innerCircle: {
        width: '100%',
        height: '100%',
        borderRadius: 70,
        opacity: 0.8,
    },
    
    textLayer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -65 }, { translateY: -20 }],
        zIndex: 10,
    },
    
    mainTitle: {
        fontSize: 20,
        fontFamily: 'Outfit_900Black',
        color: '#FFFFFF',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        letterSpacing: 1,
        lineHeight: 22,
    },
    
    particleOrbit: {
        position: 'absolute',
        width: 280,
        height: 280,
        top: 0,
        left: 0,
    },
    
    particle: {
        position: 'absolute',
        width: 6,
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 3,
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
    },
    
    particle1: {
        top: 50,
        left: 140,
    },
    
    particle2: {
        top: 140,
        left: 230,
    },
    
    particle3: {
        top: 230,
        left: 140,
    },
    
    particle4: {
        top: 140,
        left: 50,
    },
    
    crossSymbol: {
        position: 'absolute',
        top: 50,
        left: 40,
        width: 18,
        height: 22,
        zIndex: 5,
    },
    
    crossHorizontal: {
        position: 'absolute',
        top: '30%',
        left: '50%',
        width: 12,
        height: 2,
        backgroundColor: '#FFFFFF',
        transform: [{ translateX: -6 }, { translateY: -1 }],
        borderRadius: 1,
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 8,
    },
    
    crossVertical: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 2,
        height: 18,
        backgroundColor: '#FFFFFF',
        transform: [{ translateX: -1 }, { translateY: -9 }],
        borderRadius: 1,
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 8,
    },
    
    morningSymbol: {
        position: 'absolute',
        top: 60,
        right: 40,
        width: 26,
        height: 26,
        borderRadius: 13,
        zIndex: 5,
    },
    
    sunGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 13,
        shadowColor: '#ffeb3b',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 10,
    },
    
    sunRays: {
        position: 'absolute',
        top: -8,
        left: -8,
        right: -8,
        bottom: -8,
    },
    
    sunRay: {
        position: 'absolute',
        top: 0,
        left: '50%',
        width: 2,
        height: 6,
        backgroundColor: 'rgba(255, 235, 59, 0.6)',
        borderRadius: 1,
        marginLeft: -1,
    },
    
    microphoneIcon: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        width: 28,
        height: 28,
        borderRadius: 14,
        zIndex: 5,
    },
    
    micBackground: {
        width: '100%',
        height: '100%',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#ff9800',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 6,
    },
    
    micShape: {
        width: 12,
        height: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
});