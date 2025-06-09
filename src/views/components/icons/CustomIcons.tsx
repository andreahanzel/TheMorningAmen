// src/components/icons/CustomIcons.tsx
// SVG icons matching The Morning Amen brand colors
// This file contains custom SVG icons for a React Native application
// Each icon is designed with a modern aesthetic, using gradients and shadows
// Each icon features gradients, shadows, and detailed design elements

import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop, RadialGradient, Ellipse, Rect } from 'react-native-svg';

interface IconProps {
    size?: number;
    color?: string;
    filled?: boolean;
}

// Prayer/Heart Icon - Beautiful gradient heart with glow
export const PrayerIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
            <LinearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#ff6b6b" />
                <Stop offset="50%" stopColor="#ff8e53" />
                <Stop offset="100%" stopColor="#ff6289" />
            </LinearGradient>
            <RadialGradient id="heartGlow" cx="50%" cy="30%">
                <Stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                <Stop offset="70%" stopColor="rgba(255,255,255,0.1)" />
                <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </RadialGradient>
        </Defs>
        {/* Shadow */}
        <Path
            d="M12 22.35l-1.45-1.32C5.4 16.36 2 13.28 2 9.5 2 6.42 4.42 4 7.5 4c1.74 0 3.41.81 4.5 2.09C13.09 4.81 14.76 4 16.5 4 19.58 4 22 6.42 22 9.5c0 3.78-3.4 6.86-8.55 11.54L12 22.35z"
            fill="rgba(0,0,0,0.2)"
        />
        {/* Main heart */}
        <Path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="url(#heartGradient)"
        />
        {/* Highlight */}
        <Path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="url(#heartGlow)"
        />
    </Svg>
);

// Bible/Open Book Icon - Detailed with golden pages and cross
export const BibleIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
            <LinearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#ffd700" />
                <Stop offset="50%" stopColor="#ffb347" />
                <Stop offset="100%" stopColor="#ff8c42" />
            </LinearGradient>
            <LinearGradient id="pageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#fffef7" />
                <Stop offset="100%" stopColor="#f5f5dc" />
            </LinearGradient>
            <LinearGradient id="spineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#8b4513" />
                <Stop offset="50%" stopColor="#a0522d" />
                <Stop offset="100%" stopColor="#8b4513" />
            </LinearGradient>
        </Defs>
        
        {/* Book shadow */}
        <Path
            d="M3 7c0-1.1.9-2 2-2h6v14H5c-1.1 0-2-.9-2-2V7z"
            fill="rgba(0,0,0,0.1)"
            transform="translate(1,1)"
        />
        <Path
            d="M13 5h6c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2h-6V5z"
            fill="rgba(0,0,0,0.1)"
            transform="translate(1,1)"
        />
        
        {/* Left page */}
        <Path
            d="M3 6c0-1.1.9-2 2-2h6v14H5c-1.1 0-2-.9-2-2V6z"
            fill="url(#pageGradient)"
            stroke="#e6d3a3"
            strokeWidth="0.5"
        />
        
        {/* Right page */}
        <Path
            d="M13 4h6c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2h-6V4z"
            fill="url(#pageGradient)"
            stroke="#e6d3a3"
            strokeWidth="0.5"
        />
        
        {/* Center binding/spine */}
        <Path
            d="M11 4h2v14h-2V4z"
            fill="url(#spineGradient)"
        />
        
        {/* Left page text lines */}
        <G stroke="#8b7355" strokeWidth="0.3" strokeLinecap="round">
            <Path d="M5 7h4" />
            <Path d="M5 8.5h3.5" />
            <Path d="M5 10h4" />
            <Path d="M5 11.5h3" />
            <Path d="M5 13h3.5" />
            <Path d="M5 14.5h2.5" />
        </G>
        
        {/* Right page text lines */}
        <G stroke="#8b7355" strokeWidth="0.3" strokeLinecap="round">
            <Path d="M15 7h4" />
            <Path d="M15 8.5h3.5" />
            <Path d="M15 10h4" />
            <Path d="M15 11.5h3" />
            <Path d="M15 13h3.5" />
            <Path d="M15 14.5h2.5" />
        </G>
        
        {/* Golden cross on left page */}
        <G transform="translate(6.5, 9)">
            <Path
                d="M-1 0h2M0 -1.5v3"
                stroke="url(#bookGradient)"
                strokeWidth="1.2"
                strokeLinecap="round"
            />
            <Path
                d="M-0.8 0h1.6M0 -1.3v2.6"
                stroke="#ffd700"
                strokeWidth="0.6"
                strokeLinecap="round"
            />
        </G>
        
        {/* Book corner decorations */}
        <Circle cx="5" cy="6" r="0.8" fill="#ffd700" opacity="0.3" />
        <Circle cx="19" cy="6" r="0.8" fill="#ffd700" opacity="0.3" />
    </Svg>
);

// Cross Icon - Majestic golden cross with rays
export const CrossIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
            <LinearGradient id="crossGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#ffd700" />
                <Stop offset="50%" stopColor="#ff8c42" />
                <Stop offset="100%" stopColor="#ff6b35" />
            </LinearGradient>
            <RadialGradient id="crossGlow" cx="50%" cy="50%">
                <Stop offset="0%" stopColor="rgba(255,215,0,0.8)" />
                <Stop offset="50%" stopColor="rgba(255,140,66,0.4)" />
                <Stop offset="100%" stopColor="rgba(255,107,53,0)" />
            </RadialGradient>
        </Defs>
        
        {/* Rays of light */}
        <G opacity="0.6">
            <Path d="M12 0L11 3h2L12 0z" fill="#ffd700" />
            <Path d="M24 12L21 11v2L24 12z" fill="#ffd700" />
            <Path d="M12 24L13 21h-2L12 24z" fill="#ffd700" />
            <Path d="M0 12L3 13v-2L0 12z" fill="#ffd700" />
            <Path d="M20.5 3.5L18 6l1.4 1.4L20.5 3.5z" fill="#ffb347" />
            <Path d="M20.5 20.5L18 18l1.4-1.4L20.5 20.5z" fill="#ffb347" />
            <Path d="M3.5 20.5L6 18l-1.4-1.4L3.5 20.5z" fill="#ffb347" />
            <Path d="M3.5 3.5L6 6l-1.4 1.4L3.5 3.5z" fill="#ffb347" />
        </G>
        
        {/* Cross shadow */}
        <Path
            d="M12 3C10.9 3 10 3.9 10 5V11H4C2.9 11 2 11.9 2 13S2.9 15 4 15H10V21C10 22.1 10.9 23 12 23S14 22.1 14 21V15H20C21.1 15 22 14.1 22 13S21.1 11 20 11H14V5C14 3.9 13.1 3 12 3Z"
            fill="rgba(0,0,0,0.2)"
            transform="translate(1,1)"
        />
        
        {/* Main cross */}
        <Path
            d="M12 2C10.9 2 10 2.9 10 4V10H4C2.9 10 2 10.9 2 12S2.9 14 4 14H10V20C10 21.1 10.9 22 12 22S14 21.1 14 20V14H20C21.1 14 22 13.1 22 12S21.1 10 20 10H14V4C14 2.9 13.1 2 12 2Z"
            fill="url(#crossGradient)"
        />
        
        {/* Cross highlight */}
        <Path
            d="M12 2C10.9 2 10 2.9 10 4V10H4C2.9 10 2 10.9 2 12S2.9 14 4 14H10V20C10 21.1 10.9 22 12 22S14 21.1 14 20V14H20C21.1 14 22 13.1 22 12S21.1 10 20 10H14V4C14 2.9 13.1 2 12 2Z"
            fill="url(#crossGlow)"
        />
    </Svg>
);

// Video Play Icon - Modern with gradient and glow
export const PlayIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
            <LinearGradient id="playGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#ff6b35" />
                <Stop offset="50%" stopColor="#ff8c42" />
                <Stop offset="100%" stopColor="#ffa726" />
            </LinearGradient>
            <RadialGradient id="playGlow" cx="30%" cy="30%">
                <Stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </RadialGradient>
        </Defs>
        
        {/* Play button shadow */}
        <Path
            d="M9 6v12l10-6z"
            fill="rgba(0,0,0,0.2)"
            transform="translate(1,1)"
        />
        
        {/* Main play triangle */}
        <Path
            d="M8 5v14l11-7z"
            fill="url(#playGradient)"
        />
        
        {/* Highlight */}
        <Path
            d="M8 5v14l11-7z"
            fill="url(#playGlow)"
        />
        
        {/* Inner highlight line */}
        <Path
            d="M10 8v8l7-4z"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.5"
        />
    </Svg>
);

// Sunrise/Morning Icon - Beautiful sun with warm colors
export const SunriseIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
            <RadialGradient id="sunGradient" cx="50%" cy="50%">
                <Stop offset="0%" stopColor="#ffd700" />
                <Stop offset="70%" stopColor="#ff8c42" />
                <Stop offset="100%" stopColor="#ff6b35" />
            </RadialGradient>
            <LinearGradient id="groundGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#ff8c42" />
                <Stop offset="50%" stopColor="#ffa726" />
                <Stop offset="100%" stopColor="#ff8c42" />
            </LinearGradient>
        </Defs>
        
        {/* Sun rays */}
        <G stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round">
            <Path d="M12 1v2" />
            <Path d="M12 21v2" />
            <Path d="M4.22 4.22l1.42 1.42" />
            <Path d="M18.36 18.36l1.42 1.42" />
            <Path d="M1 12h2" />
            <Path d="M21 12h2" />
            <Path d="M4.22 19.78l1.42-1.42" />
            <Path d="M18.36 5.64l1.42-1.42" />
        </G>
        
        {/* Sun shadow */}
        <Circle cx="13" cy="9" r="4" fill="rgba(0,0,0,0.1)" />
        
        {/* Main sun */}
        <Circle cx="12" cy="8" r="4" fill="url(#sunGradient)" />
        
        {/* Sun highlight */}
        <Circle cx="11" cy="7" r="1.5" fill="rgba(255,255,255,0.4)" />
        
        {/* Ground/horizon */}
        <Path
            d="M20 15H4c0 4.42 3.58 8 8 8s8-3.58 8-8z"
            fill="url(#groundGradient)"
            opacity="0.8"
        />
        
        {/* Ground highlight */}
        <Path
            d="M20 15H4c0 1 0.2 2 0.6 3h14.8c0.4-1 0.6-2 0.6-3z"
            fill="rgba(255,255,255,0.2)"
        />
    </Svg>
);

// Share Icon - Colorful network with connections
export const ShareIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
            <LinearGradient id="shareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#4facfe" />
                <Stop offset="50%" stopColor="#00f2fe" />
                <Stop offset="100%" stopColor="#4facfe" />
            </LinearGradient>
            <LinearGradient id="shareLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#4facfe" />
                <Stop offset="100%" stopColor="#00f2fe" />
            </LinearGradient>
        </Defs>
        
        {/* Connection lines */}
        <Path d="M8.91 12.7l7.05-4.11" stroke="url(#shareLineGradient)" strokeWidth="2" strokeLinecap="round" />
        <Path d="M8.91 11.3l7.12 4.16" stroke="url(#shareLineGradient)" strokeWidth="2" strokeLinecap="round" />
        
        {/* Node shadows */}
        <Circle cx="19" cy="6" r="3" fill="rgba(0,0,0,0.1)" />
        <Circle cx="7" cy="12" r="3" fill="rgba(0,0,0,0.1)" />
        <Circle cx="19" cy="19" r="3" fill="rgba(0,0,0,0.1)" />
        
        {/* Main nodes */}
        <Circle cx="18" cy="5" r="3" fill="url(#shareGradient)" />
        <Circle cx="6" cy="12" r="3" fill="url(#shareGradient)" />
        <Circle cx="18" cy="18" r="3" fill="url(#shareGradient)" />
        
        {/* Node highlights */}
        <Circle cx="17" cy="4" r="1" fill="rgba(255,255,255,0.5)" />
        <Circle cx="5" cy="11" r="1" fill="rgba(255,255,255,0.5)" />
        <Circle cx="17" cy="17" r="1" fill="rgba(255,255,255,0.5)" />
    </Svg>
);

// Star/Favorite Icon - Sparkling golden star
export const StarIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', filled = false }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
            <LinearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#ffd700" />
                <Stop offset="50%" stopColor="#ffb347" />
                <Stop offset="100%" stopColor="#ff8c42" />
            </LinearGradient>
            <RadialGradient id="starGlow" cx="50%" cy="30%">
                <Stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </RadialGradient>
        </Defs>
        
        {/* Star shadow */}
        <Path
            d="M12 3l3.09 6.26L22 10.27l-5 4.87 1.18 6.88L12 18.77l-6.18 3.25L7 15.14 2 10.27l6.91-1.01L12 3z"
            fill="rgba(0,0,0,0.1)"
            transform="translate(1,1)"
        />
        
        {/* Main star */}
        <Path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={filled ? "url(#starGradient)" : 'none'}
            stroke={filled ? "none" : "url(#starGradient)"}
            strokeWidth={filled ? 0 : 2}
        />
        
        {/* Star highlight */}
        {filled && (
            <Path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="url(#starGlow)"
            />
        )}
        
        {/* Sparkles around star */}
        <G fill="#ffd700" opacity="0.8">
            <Circle cx="6" cy="6" r="0.5" />
            <Circle cx="18" cy="8" r="0.3" />
            <Circle cx="5" cy="18" r="0.4" />
            <Circle cx="19" cy="17" r="0.3" />
        </G>
    </Svg>
);

// News Icon - Modern newspaper with colorful header
export const NewsIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
            <LinearGradient id="newsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#667eea" />
                <Stop offset="100%" stopColor="#764ba2" />
            </LinearGradient>
            <LinearGradient id="paperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#ffffff" />
                <Stop offset="100%" stopColor="#f8f9fa" />
            </LinearGradient>
        </Defs>
        
        {/* Newspaper shadow */}
        <Path
            d="M4 7H2v14c0 1.1.9 2 2 2h14v-2H4V7zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
            fill="rgba(0,0,0,0.1)"
            transform="translate(1,1)"
        />
        
        {/* Main newspaper */}
        <Path
            d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"
            fill="url(#paperGradient)"
            stroke="#e0e0e0"
            strokeWidth="0.5"
        />
        <Path
            d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
            fill="url(#paperGradient)"
            stroke="#e0e0e0"
            strokeWidth="0.5"
        />
        
        {/* Header section */}
        <Path
            d="M8 4h12c1.1 0 2 .9 2 2v2H6V6c0-1.1.9-2 2-2z"
            fill="url(#newsGradient)"
        />
        
        {/* Header text placeholder */}
        <G fill="white" opacity="0.9">
            <Path d="M9 5.5h8M9 6.5h6" stroke="white" strokeWidth="0.3" strokeLinecap="round" />
        </G>
        
        {/* Article columns */}
        <G fill="#666" opacity="0.6">
            <Path d="M9 10h10M9 11.5h8M9 13h10M9 14.5h7" stroke="#666" strokeWidth="0.2" strokeLinecap="round" />
        </G>
        
        {/* Featured article box */}
        <Path
            d="M15 10h4v3h-4z"
            fill="url(#newsGradient)"
            opacity="0.2"
        />
    </Svg>
);

// Back Arrow Icon - Stylized with gradient
export const BackIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
            <LinearGradient id="backGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#667eea" />
                <Stop offset="100%" stopColor="#764ba2" />
            </LinearGradient>
        </Defs>
        
        {/* Arrow shadow */}
        <Path
            d="M20 12H7.83l5.59-5.59L12 5l-8 8 8 8 1.41-1.41L7.83 14H20v-2z"
            fill="rgba(0,0,0,0.1)"
            transform="translate(1,1)"
        />
        
        {/* Main arrow */}
        <Path
            d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
            fill="url(#backGradient)"
        />
        
        {/* Arrow highlight */}
        <Path
            d="M19 11H8.83l4.59-4.59L12 5l-6 6 6 6 1.41-1.41L8.83 13H19v-2z"
            fill="rgba(255,255,255,0.2)"
        />
    </Svg>
);

// Search Icon - Magnifying glass with sparkle
export const SearchIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
            <LinearGradient id="searchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#a8edea" />
                <Stop offset="100%" stopColor="#fed6e3" />
            </LinearGradient>
            <LinearGradient id="handleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#667eea" />
                <Stop offset="100%" stopColor="#764ba2" />
            </LinearGradient>
        </Defs>
        
        {/* Search handle shadow */}
        <Path
            d="M16.5 15h-.79l-.28-.27C16.41 13.59 17 12.11 17 10.5 17 6.91 14.09 4 10.5 4S4 6.91 4 10.5 6.91 17 10.5 17c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L21.49 20l-4.99-5z"
            fill="rgba(0,0,0,0.1)"
            transform="translate(1,1)"
        />
        
        {/* Search circle */}
        <Circle
            cx="9.5"
            cy="9.5"
            r="6.5"
            fill="none"
            stroke="url(#searchGradient)"
            strokeWidth="2"
        />
        
        {/* Search handle */}
        <Path
            d="M20.49 19l-4.99-5 .27-.28c1.14-.98 1.73-2.46 1.73-4.22"
            stroke="url(#handleGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
        />
        
        {/* Inner circle highlight */}
        <Circle
            cx="8"
            cy="8"
            r="2"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
        />
        
        {/* Sparkle effect */}
        <G fill="#a8edea" opacity="0.8">
            <Circle cx="6" cy="6" r="0.5" />
            <Circle cx="13" cy="5" r="0.3" />
            <Circle cx="17" cy="17" r="0.4" />
        </G>
    </Svg>
);

    export const EditIcon: React.FC<IconProps> = ({ size = 24, color = '#000000' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
        <Path
        d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
    </Svg>
    );

    export const DeleteIcon: React.FC<IconProps> = ({ size = 24, color = '#000000' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
        d="m3 6 18 0"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
        <Path
        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
        <Path
        d="m10 11 0 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
        <Path
        d="m14 11 0 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
    </Svg>
    );

    export const CommentIcon: React.FC<IconProps> = ({ size = 24, color = '#000000' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
    </Svg>
    );

    export const ImageIcon: React.FC<IconProps> = ({ size = 24, color = '#000000' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        ry="2"
        stroke={color}
        strokeWidth="2"
        />
        <Circle cx="9" cy="9" r="2" stroke={color} strokeWidth="2" />
        <Path
        d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
    </Svg>
    );

    export const HeartIcon: React.FC<IconProps & { filled?: boolean }> = ({ 
    size = 24, 
    color = '#000000',
    filled = false 
    }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"}>
        <Path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
    </Svg>
    );

    export const SendIcon: React.FC<IconProps> = ({ size = 24, color = '#000000' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
        d="m22 2-7 20-4-9-9-4z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
        <Path
        d="m22 2-11 9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
    </Svg>
    );

export default {
    PrayerIcon,
    BibleIcon,
    CrossIcon,
    PlayIcon,
    SunriseIcon,
    ShareIcon,
    StarIcon,
    NewsIcon,
    BackIcon,
    SearchIcon,
};