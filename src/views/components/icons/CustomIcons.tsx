// src/components/icons/CustomIcons.tsx
// Enhanced Custom Icons with Spiritual Animation Style
// This file contains a set of custom icons designed with a spiritual and divine theme
// Each icon features gradients, animations, and detailed spiritual design elements

import React from 'react';
import Svg, { 
    Path, 
    Circle, 
    Ellipse, 
    G, 
    Defs, 
    LinearGradient, 
    Stop,
    RadialGradient,
    Polygon,
    Rect
} from 'react-native-svg';

interface IconProps {
    size?: number;
    color?: string;
    gradient?: boolean;
    filled?: boolean; // Added to support icons like StarIcon and HeartIcon
}

// Bible Icon - Sacred Book with Divine Light
export const BibleIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            {gradient && (
                <LinearGradient id="bibleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#ffd700" />
                    <Stop offset="50%" stopColor="#ffb347" />
                    <Stop offset="100%" stopColor="#ff8c42" />
                </LinearGradient>
            )}
            <RadialGradient id="bibleGlow" cx="50%" cy="30%">
                <Stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                <Stop offset="70%" stopColor="rgba(255,255,255,0.1)" />
                <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </RadialGradient>
        </Defs>
        
        {/* Book shadow */}
        <G fill="rgba(0,0,0,0.15)" transform="translate(1,1)">
            <Path d="M4 6c0-1.1.9-2 2-2h5v14H6c-1.1 0-2-.9-2-2V6z" />
            <Path d="M13 4h5c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2h-5V4z" />
        </G>
        
        {/* Left page with divine glow */}
        <Path
            d="M4 5c0-1.1.9-2 2-2h5v14H6c-1.1 0-2-.9-2-2V5z"
            fill={gradient ? "url(#bibleGradient)" : color}
            opacity="0.9"
        />
        
        {/* Right page */}
        <Path
            d="M13 3h5c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2h-5V3z"
            fill={gradient ? "url(#bibleGradient)" : color}
            opacity="0.9"
        />
        
        {/* Sacred spine */}
        <Rect 
            x="11" 
            y="3" 
            width="2" 
            height="14" 
            fill={gradient ? "url(#bibleGradient)" : color}
            opacity="0.8"
        />
        
        {/* Divine cross on left page */}
        <G transform="translate(6.5, 9)">
            <G stroke="white" strokeWidth="2" strokeLinecap="round">
                <Path d="M0 -2v4M-2 0h4" />
            </G>
            <G stroke={gradient ? "#ffd700" : color} strokeWidth="1" strokeLinecap="round">
                <Path d="M0 -1.5v3M-1.5 0h3" />
            </G>
        </G>
        
        {/* Sacred text lines */}
        <G stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" strokeLinecap="round">
            <Path d="M5 7h3M5 8.5h2.5M5 10h3" />
            <Path d="M15 7h3M15 8.5h2.5M15 10h3" />
        </G>
        
        {/* Divine light effect */}
        <Path
            d="M4 5c0-1.1.9-2 2-2h5v14H6c-1.1 0-2-.9-2-2V5z"
            fill="url(#bibleGlow)"
        />
        
        {/* Blessing sparkles */}
        <G fill="rgba(255,255,255,0.8)" opacity="0.7">
            <Circle cx="7" cy="6" r="0.5" />
            <Circle cx="16" cy="7" r="0.4" />
            <Circle cx="8" cy="15" r="0.3" />
        </G>
    </Svg>
);

// Prayer Icon - Sacred Heart with Divine Radiance
export const PrayerIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            {gradient && (
                <LinearGradient id="prayerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#ff6b6b" />
                    <Stop offset="50%" stopColor="#ff8e53" />
                    <Stop offset="100%" stopColor="#ff6289" />
                </LinearGradient>
            )}
            <RadialGradient id="prayerGlow" cx="50%" cy="30%">
                <Stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                <Stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
                <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </RadialGradient>
        </Defs>
        
        {/* Heart shadow */}
        <Path
            d="M12 22.35l-1.45-1.32C5.4 16.36 2 13.28 2 9.5 2 6.42 4.42 4 7.5 4c1.74 0 3.41.81 4.5 2.09C13.09 4.81 14.76 4 16.5 4 19.58 4 22 6.42 22 9.5c0 3.78-3.4 6.86-8.55 11.54L12 22.35z"
            fill="rgba(0,0,0,0.2)"
            transform="translate(1,1)"
        />
        
        {/* Sacred heart */}
        <Path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={gradient ? "url(#prayerGradient)" : color}
            opacity="0.9"
        />
        
        {/* Divine light rays */}
        <G stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeLinecap="round" opacity="0.8">
            <Path d="M12 2v2M6 4l1 1M18 4l-1 1" />
            <Path d="M4 10l1.5 0.5M20 10l-1.5 0.5" />
        </G>
        
        {/* Sacred cross in center */}
        <G stroke="white" strokeWidth="1.5" strokeLinecap="round">
            <Path d="M12 10v4M10 12h4" />
        </G>
        
        {/* Divine glow effect */}
        <Path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="url(#prayerGlow)"
        />
        
        {/* Blessing sparkles */}
        <G fill="rgba(255,255,255,0.9)" opacity="0.8">
            <Circle cx="8" cy="7" r="0.4" />
            <Circle cx="16" cy="8" r="0.3" />
            <Circle cx="10" cy="16" r="0.5" />
        </G>
    </Svg>
);

// Play Icon - Divine Triangle with Heavenly Glow
export const PlayIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            {gradient && (
                <LinearGradient id="playGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#ff6b35" />
                    <Stop offset="50%" stopColor="#ff8c42" />
                    <Stop offset="100%" stopColor="#ffa726" />
                </LinearGradient>
            )}
            <RadialGradient id="playGlow" cx="30%" cy="30%">
                <Stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </RadialGradient>
        </Defs>
        
        {/* Play circle shadow */}
        <Circle cx="13" cy="13" r="10" fill="rgba(0,0,0,0.15)" />
        
        {/* Sacred play circle */}
        <Circle
            cx="12"
            cy="12"
            r="10"
            fill={gradient ? "url(#playGradient)" : color}
            opacity="0.9"
        />
        
        {/* Divine play triangle */}
        <Path
            d="M9 7v10l8-5z"
            fill="white"
            opacity="0.95"
        />
        
        {/* Inner triangle glow */}
        <Path
            d="M10 9v6l6-3z"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.5"
        />
        
        {/* Heavenly glow */}
        <Circle
            cx="12"
            cy="12"
            r="10"
            fill="url(#playGlow)"
        />
        
        {/* Divine light rays */}
        <G stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeLinecap="round" opacity="0.6">
            <Path d="M12 1v2M12 21v2M1 12h2M21 12h2" />
            <Path d="M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42" />
        </G>
        
        {/* Blessing sparkles */}
        <G fill="rgba(255,255,255,0.8)" opacity="0.7">
            <Circle cx="6" cy="6" r="0.4" />
            <Circle cx="18" cy="6" r="0.3" />
            <Circle cx="6" cy="18" r="0.5" />
            <Circle cx="18" cy="18" r="0.4" />
        </G>
    </Svg>
);

// News Icon - Sacred Scroll with Divine Wisdom
export const NewsIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            {gradient && (
                <LinearGradient id="newsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#667eea" />
                    <Stop offset="50%" stopColor="#764ba2" />
                    <Stop offset="100%" stopColor="#5a4fcf" />
                </LinearGradient>
            )}
            <RadialGradient id="newsGlow" cx="50%" cy="30%">
                <Stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </RadialGradient>
        </Defs>
        
        {/* Scroll shadow */}
        <G fill="rgba(0,0,0,0.15)" transform="translate(1,1)">
            <Rect x="5" y="4" width="14" height="16" rx="2" />
            <Rect x="3" y="6" width="2" height="12" rx="1" />
        </G>
        
        {/* Sacred scroll */}
        <Rect
            x="5"
            y="3"
            width="14"
            height="16"
            rx="2"
            fill={gradient ? "url(#newsGradient)" : color}
            opacity="0.9"
        />
        
        {/* Scroll handles */}
        <Rect x="3" y="5" width="2" height="12" rx="1" fill={gradient ? "url(#newsGradient)" : color} />
        <Rect x="19" y="5" width="2" height="12" rx="1" fill={gradient ? "url(#newsGradient)" : color} />
        
        {/* Sacred header */}
        <Rect
            x="5"
            y="3"
            width="14"
            height="4"
            fill="rgba(255,255,255,0.3)"
        />
        
        {/* Divine cross symbol */}
        <G transform="translate(12, 5)">
            <G stroke="white" strokeWidth="1.5" strokeLinecap="round">
                <Path d="M0 -1v2M-1 0h2" />
            </G>
        </G>
        
        {/* Sacred text lines */}
        <G stroke="rgba(255,255,255,0.8)" strokeWidth="0.6" strokeLinecap="round">
            <Path d="M7 9h10M7 11h8M7 13h10M7 15h6" />
        </G>
        
        {/* Divine glow */}
        <Rect
            x="5"
            y="3"
            width="14"
            height="16"
            rx="2"
            fill="url(#newsGlow)"
        />
        
        {/* Wisdom sparkles */}
        <G fill="rgba(255,255,255,0.8)" opacity="0.7">
            <Circle cx="8" cy="8" r="0.3" />
            <Circle cx="16" cy="10" r="0.4" />
            <Circle cx="9" cy="16" r="0.3" />
        </G>
    </Svg>
);

// Sunrise Icon - Sacred Dawn with Divine Light
export const SunriseIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            {gradient && (
                <RadialGradient id="sunriseGradient" cx="50%" cy="50%">
                    <Stop offset="0%" stopColor="#ffd700" />
                    <Stop offset="50%" stopColor="#ff8c42" />
                    <Stop offset="100%" stopColor="#ff6b35" />
                </RadialGradient>
            )}
            <LinearGradient id="skyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#ff8c42" />
                <Stop offset="50%" stopColor="#ffa726" />
                <Stop offset="100%" stopColor="#ff8c42" />
            </LinearGradient>
        </Defs>
        
        {/* Divine sun rays */}
        <G stroke={gradient ? "#ffd700" : color} strokeWidth="2" strokeLinecap="round" opacity="0.8">
            <Path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12" />
            <Path d="M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
        </G>
        
        {/* Sun shadow */}
        <Circle cx="13" cy="9" r="4.5" fill="rgba(0,0,0,0.1)" />
        
        {/* Sacred sun */}
        <Circle
            cx="12"
            cy="8"
            r="4.5"
            fill={gradient ? "url(#sunriseGradient)" : color}
            opacity="0.9"
        />
        
        {/* Divine cross in sun */}
        <G stroke="white" strokeWidth="1.5" strokeLinecap="round">
            <Path d="M12 6v4M10 8h4" />
        </G>
        
        {/* Sacred horizon */}
        <Path
            d="M2 15h20c0 4-4 8-10 8s-10-4-10-8z"
            fill="url(#skyGradient)"
            opacity="0.7"
        />
        
        {/* Sun highlight */}
        <Circle cx="10.5" cy="6.5" r="1.5" fill="rgba(255,255,255,0.5)" />
        
        {/* Morning sparkles */}
        <G fill="rgba(255,255,255,0.8)" opacity="0.8">
            <Circle cx="6" cy="6" r="0.4" />
            <Circle cx="18" cy="7" r="0.3" />
            <Circle cx="5" cy="15" r="0.5" />
            <Circle cx="19" cy="16" r="0.4" />
        </G>
        
        {/* Divine light beams */}
        <G stroke="rgba(255,215,0,0.4)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
            <Path d="M8 5l1 2M16 5l-1 2M6 10l2 1M18 10l-2 1" />
        </G>
    </Svg>
);

// Star Icon - Sacred Star of Bethlehem
export const StarIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', gradient = true, filled = false }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            {gradient && (
                <LinearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#ffd700" />
                    <Stop offset="50%" stopColor="#ffb347" />
                    <Stop offset="100%" stopColor="#ff8c42" />
                </LinearGradient>
            )}
            <RadialGradient id="starGlow" cx="50%" cy="30%">
                <Stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </RadialGradient>
        </Defs>
        
        {/* Star shadow */}
        <Path
            d="M12 3l3.09 6.26L22 10.27l-5 4.87 1.18 6.88L12 18.77l-6.18 3.25L7 15.14 2 10.27l6.91-1.01L12 3z"
            fill="rgba(0,0,0,0.15)"
            transform="translate(1,1)"
        />
        
        {/* Sacred star */}
        <Path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={filled ? (gradient ? "url(#starGradient)" : color) : 'none'}
            stroke={filled ? "none" : (gradient ? "url(#starGradient)" : color)}
            strokeWidth={filled ? 0 : 2}
            opacity="0.9"
        />
        
        {/* Divine light rays from star */}
        <G stroke={gradient ? "#ffd700" : color} strokeWidth="1" strokeLinecap="round" opacity="0.6">
            <Path d="M12 0v2M12 22v2M0 12h2M22 12h2" />
            <Path d="M3.5 3.5l1.5 1.5M19 19l1.5 1.5M3.5 20.5l1.5-1.5M19 5l1.5-1.5" />
        </G>
        
        {/* Sacred cross in center */}
        {filled && (
            <G stroke="white" strokeWidth="1.2" strokeLinecap="round">
                <Path d="M12 10v4M10 12h4" />
            </G>
        )}
        
        {/* Divine glow effect */}
        {filled && (
            <Path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="url(#starGlow)"
            />
        )}
        
        {/* Bethlehem sparkles */}
        <G fill="rgba(255,255,255,0.9)" opacity="0.8">
            <Circle cx="6" cy="6" r="0.4" />
            <Circle cx="18" cy="8" r="0.3" />
            <Circle cx="5" cy="18" r="0.5" />
            <Circle cx="19" cy="17" r="0.4" />
        </G>
    </Svg>
);

// Search Icon - Sacred Magnifying Glass with Divine Light
export const SearchIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            {gradient && (
                <LinearGradient id="searchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#a8edea" />
                    <Stop offset="50%" stopColor="#fed6e3" />
                    <Stop offset="100%" stopColor="#667eea" />
                </LinearGradient>
            )}
            <RadialGradient id="searchGlow" cx="50%" cy="50%">
                <Stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </RadialGradient>
        </Defs>
        
        {/* Search handle shadow */}
        <Path
            d="M16.5 15h-.79l-.28-.27C16.41 13.59 17 12.11 17 10.5 17 6.91 14.09 4 10.5 4S4 6.91 4 10.5 6.91 17 10.5 17c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L21.49 20l-4.99-5z"
            fill="rgba(0,0,0,0.1)"
            transform="translate(1,1)"
        />
        
        {/* Sacred search circle */}
        <Circle
            cx="10.5"
            cy="10.5"
            r="6.5"
            fill="none"
            stroke={gradient ? "url(#searchGradient)" : color}
            strokeWidth="2.5"
            opacity="0.9"
        />
        
        {/* Divine search handle */}
        <Path
            d="M20.49 19l-4.99-5"
            stroke={gradient ? "url(#searchGradient)" : color}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.9"
        />
        
        {/* Sacred cross in center */}
        <G stroke={gradient ? "url(#searchGradient)" : color} strokeWidth="1.5" strokeLinecap="round">
            <Path d="M10.5 8.5v4M8.5 10.5h4" />
        </G>
        
        {/* Inner wisdom circle */}
        <Circle
            cx="10.5"
            cy="10.5"
            r="3"
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1"
        />
        
        {/* Divine glow */}
        <Circle
            cx="10.5"
            cy="10.5"
            r="6.5"
            fill="url(#searchGlow)"
        />
        
        {/* Enlightenment sparkles */}
        <G fill="rgba(255,255,255,0.8)" opacity="0.8">
            <Circle cx="6" cy="6" r="0.4" />
            <Circle cx="15" cy="5" r="0.3" />
            <Circle cx="18" cy="18" r="0.5" />
            <Circle cx="5" cy="15" r="0.4" />
        </G>
        
        {/* Wisdom rays */}
        <G stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round" opacity="0.6">
            <Path d="M10.5 3v1M10.5 17v1M3 10.5h1M17 10.5h1" />
        </G>
    </Svg>
);

// Cross Icon - Sacred Cross with Divine Radiance
export const CrossIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            {gradient && (
                <LinearGradient id="crossGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#ffd700" />
                    <Stop offset="50%" stopColor="#ff8c42" />
                    <Stop offset="100%" stopColor="#ff6b35" />
                </LinearGradient>
            )}
            <RadialGradient id="crossGlow" cx="50%" cy="50%">
                <Stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                <Stop offset="50%" stopColor="rgba(255,215,0,0.4)" />
                <Stop offset="100%" stopColor="rgba(255,215,0,0)" />
            </RadialGradient>
        </Defs>
        
        {/* Divine light rays */}
        <G stroke="rgba(255,215,0,0.6)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
            <Path d="M12 1v2M12 21v2M1 12h2M21 12h2" />
            <Path d="M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42" />
            <Path d="M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </G>
        
        {/* Cross shadow */}
        <Path
            d="M12 3C10.9 3 10 3.9 10 5V11H4C2.9 11 2 11.9 2 13S2.9 15 4 15H10V21C10 22.1 10.9 23 12 23S14 22.1 14 21V15H20C21.1 15 22 14.1 22 13S21.1 11 20 11H14V5C14 3.9 13.1 3 12 3Z"
            fill="rgba(0,0,0,0.2)"
            transform="translate(1,1)"
        />
        
        {/* Sacred cross */}
        <Path
            d="M12 2C10.9 2 10 2.9 10 4V10H4C2.9 10 2 10.9 2 12S2.9 14 4 14H10V20C10 21.1 10.9 22 12 22S14 21.1 14 20V14H20C21.1 14 22 13.1 22 12S21.1 10 20 10H14V4C14 2.9 13.1 2 12 2Z"
            fill={gradient ? "url(#crossGradient)" : color}
            opacity="0.9"
        />
        
        {/* Divine glow effect */}
        <Path
            d="M12 2C10.9 2 10 2.9 10 4V10H4C2.9 10 2 10.9 2 12S2.9 14 4 14H10V20C10 21.1 10.9 22 12 22S14 21.1 14 20V14H20C21.1 14 22 13.1 22 12S21.1 10 20 10H14V4C14 2.9 13.1 2 12 2Z"
            fill="url(#crossGlow)"
        />
        
        {/* Sacred heart at center */}
        <Circle cx="12" cy="12" r="2" fill="rgba(255,255,255,0.3)" />
        
        {/* Salvation sparkles */}
        <G fill="rgba(255,255,255,0.9)" opacity="0.8">
            <Circle cx="6" cy="6" r="0.4" />
            <Circle cx="18" cy="6" r="0.3" />
            <Circle cx="6" cy="18" r="0.5" />
            <Circle cx="18" cy="18" r="0.4" />
            <Circle cx="12" cy="3" r="0.3" />
            <Circle cx="12" cy="21" r="0.3" />
            <Circle cx="3" cy="12" r="0.3" />
            <Circle cx="21" cy="12" r="0.3" />
        </G>
    </Svg>
);

// Additional Icons for Complete Coverage

// Back Arrow Icon - Sacred Return Path
export const BackIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            {gradient && (
                <LinearGradient id="backGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <Stop offset="0%" stopColor="#667eea" />
                    <Stop offset="50%" stopColor="#764ba2" />
                    <Stop offset="100%" stopColor="#5a4fcf" />
                </LinearGradient>
            )}
            <RadialGradient id="backGlow" cx="30%" cy="50%">
                <Stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </RadialGradient>
        </Defs>
        
        {/* Arrow shadow */}
        <Path
            d="M20 12H7.83l5.59-5.59L12 5l-8 8 8 8 1.41-1.41L7.83 14H20v-2z"
            fill="rgba(0,0,0,0.15)"
            transform="translate(1,1)"
        />
        
        {/* Sacred return arrow */}
        <Path
            d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
            fill={gradient ? "url(#backGradient)" : color}
            opacity="0.9"
        />
        
        {/* Divine glow */}
        <Path
            d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
            fill="url(#backGlow)"
        />
        
        {/* Guidance sparkles */}
        <G fill="rgba(255,255,255,0.8)" opacity="0.7">
            <Circle cx="5" cy="8" r="0.3" />
            <Circle cx="6" cy="16" r="0.4" />
            <Circle cx="18" cy="11" r="0.3" />
        </G>
    </Svg>
);

// Share Icon - Sacred Connection Network
export const ShareIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            {gradient && (
                <LinearGradient id="shareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#4facfe" />
                    <Stop offset="50%" stopColor="#00f2fe" />
                    <Stop offset="100%" stopColor="#4facfe" />
                </LinearGradient>
            )}
            <RadialGradient id="shareGlow" cx="50%" cy="50%">
                <Stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </RadialGradient>
        </Defs>
        
        {/* Sacred connection lines */}
        <Path d="M8.91 12.7l7.05-4.11" stroke={gradient ? "url(#shareGradient)" : color} strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <Path d="M8.91 11.3l7.12 4.16" stroke={gradient ? "url(#shareGradient)" : color} strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        
        {/* Node shadows */}
        <Circle cx="19" cy="6" r="3.5" fill="rgba(0,0,0,0.1)" />
        <Circle cx="7" cy="12" r="3.5" fill="rgba(0,0,0,0.1)" />
        <Circle cx="19" cy="19" r="3.5" fill="rgba(0,0,0,0.1)" />
        
        {/* Sacred nodes */}
        <Circle cx="18" cy="5" r="3.5" fill={gradient ? "url(#shareGradient)" : color} opacity="0.9" />
        <Circle cx="6" cy="12" r="3.5" fill={gradient ? "url(#shareGradient)" : color} opacity="0.9" />
        <Circle cx="18" cy="18" r="3.5" fill={gradient ? "url(#shareGradient)" : color} opacity="0.9" />
        
        {/* Divine crosses in nodes */}
        <G stroke="white" strokeWidth="1.2" strokeLinecap="round">
            <Path d="M18 3.5v3M16.5 5h3" />
            <Path d="M6 10.5v3M4.5 12h3" />
            <Path d="M18 16.5v3M16.5 18h3" />
        </G>
        
        {/* Node highlights */}
        <Circle cx="17" cy="4" r="1.2" fill="rgba(255,255,255,0.6)" />
        <Circle cx="5" cy="11" r="1.2" fill="rgba(255,255,255,0.6)" />
        <Circle cx="17" cy="17" r="1.2" fill="rgba(255,255,255,0.6)" />
        
        {/* Unity sparkles */}
        <G fill="rgba(255,255,255,0.8)" opacity="0.7">
            <Circle cx="12" cy="8" r="0.3" />
            <Circle cx="12" cy="16" r="0.4" />
            <Circle cx="3" cy="6" r="0.3" />
            <Circle cx="21" cy="12" r="0.3" />
        </G>
    </Svg>
);

// Enhanced Icon Components with Spiritual Touches

// Edit Icon - Sacred Quill
export const EditIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            {gradient && (
                <LinearGradient id="editGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#ff9a56" />
                    <Stop offset="50%" stopColor="#ff6b35" />
                    <Stop offset="100%" stopColor="#f7931e" />
                </LinearGradient>
            )}
        </Defs>
        
        <Path
            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
            stroke={gradient ? "url(#editGradient)" : color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
        <Path
            d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"
            stroke={gradient ? "url(#editGradient)" : color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
        
        {/* Sacred writing sparkles */}
        <G fill={gradient ? "#ffd700" : color} opacity="0.7">
            <Circle cx="8" cy="8" r="0.3" />
            <Circle cx="16" cy="16" r="0.4" />
            <Circle cx="20" cy="4" r="0.3" />
        </G>
    </Svg>
);

// Delete Icon - Sacred Cleansing
export const DeleteIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            {gradient && (
                <LinearGradient id="deleteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#ff6b6b" />
                    <Stop offset="50%" stopColor="#ff5252" />
                    <Stop offset="100%" stopColor="#f44336" />
                </LinearGradient>
            )}
        </Defs>
        
        <Path
            d="m3 6 18 0"
            stroke={gradient ? "url(#deleteGradient)" : color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            stroke={gradient ? "url(#deleteGradient)" : color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
        <Path
            d="m10 11 0 6"
            stroke={gradient ? "url(#deleteGradient)" : color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="m14 11 0 6"
            stroke={gradient ? "url(#deleteGradient)" : color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

// Comment Icon - Sacred Word
export const CommentIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            {gradient && (
                <LinearGradient id="commentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#4facfe" />
                    <Stop offset="50%" stopColor="#00f2fe" />
                    <Stop offset="100%" stopColor="#4facfe" />
                </LinearGradient>
            )}
        </Defs>
        
        <Path
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            stroke={gradient ? "url(#commentGradient)" : color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
        
        {/* Sacred words sparkles */}
        <G fill={gradient ? "#ffd700" : color} opacity="0.6">
            <Circle cx="8" cy="10" r="0.3" />
            <Circle cx="12" cy="10" r="0.3" />
            <Circle cx="16" cy="10" r="0.3" />
        </G>
    </Svg>
);

// Image Icon - Sacred Vision
export const ImageIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            {gradient && (
                <LinearGradient id="imageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#667eea" />
                    <Stop offset="50%" stopColor="#764ba2" />
                    <Stop offset="100%" stopColor="#5a4fcf" />
                </LinearGradient>
            )}
        </Defs>
        
        <Rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            ry="2"
            stroke={gradient ? "url(#imageGradient)" : color}
            strokeWidth="2"
            fill="none"
        />
        <Circle cx="9" cy="9" r="2" stroke={gradient ? "url(#imageGradient)" : color} strokeWidth="2" fill="none" />
        <Path
            d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"
            stroke={gradient ? "url(#imageGradient)" : color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        
        {/* Vision sparkles */}
        <G fill={gradient ? "#ffd700" : color} opacity="0.6">
            <Circle cx="7" cy="7" r="0.3" />
            <Circle cx="17" cy="7" r="0.3" />
            <Circle cx="7" cy="17" r="0.3" />
        </G>
    </Svg>
);

// Heart Icon - Sacred Love
export const HeartIcon: React.FC<IconProps & { filled?: boolean }> = ({ 
    size = 24, 
    color = '#FFFFFF',
    gradient = true,
    filled = false 
}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            {gradient && (
                <LinearGradient id="heartIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#ff6b6b" />
                    <Stop offset="50%" stopColor="#ff8e53" />
                    <Stop offset="100%" stopColor="#ff6289" />
                </LinearGradient>
            )}
        </Defs>
        
        <Path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            stroke={gradient ? "url(#heartIconGradient)" : color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={filled ? (gradient ? "url(#heartIconGradient)" : color) : "none"}
        />
        
        {/* Love sparkles */}
        <G fill={gradient ? "#ffd700" : color} opacity="0.7">
            <Circle cx="8" cy="8" r="0.3" />
            <Circle cx="16" cy="10" r="0.4" />
            <Circle cx="12" cy="18" r="0.3" />
        </G>
    </Svg>
);

// Send Icon - Sacred Message
export const SendIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
            {gradient && (
                <LinearGradient id="sendGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#4facfe" />
                    <Stop offset="50%" stopColor="#00f2fe" />
                    <Stop offset="100%" stopColor="#4facfe" />
                </LinearGradient>
            )}
        </Defs>
        
        <Path
            d="m22 2-7 20-4-9-9-4z"
            stroke={gradient ? "url(#sendGradient)" : color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
        <Path
            d="m22 2-11 9"
            stroke={gradient ? "url(#sendGradient)" : color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        
        {/* Message sparkles */}
        <G fill={gradient ? "#ffd700" : color} opacity="0.7">
            <Circle cx="20" cy="4" r="0.3" />
            <Circle cx="6" cy="18" r="0.4" />
            <Circle cx="15" cy="10" r="0.3" />
        </G>
    </Svg>
);

// Export all enhanced icons
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
    EditIcon,
    DeleteIcon,
    CommentIcon,
    ImageIcon,
    HeartIcon,
    SendIcon,
};