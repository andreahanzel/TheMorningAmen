// src/components/icons/NavigationIcons.tsx
// Navigation icons 
// This file contains beautifully designed navigation icons with divine themes,

    import React from 'react';
    import Svg, { 
        Path, 
        Circle, 
        G, 
        Defs, 
        LinearGradient, 
        Stop,
        RadialGradient,
        Rect,
        Ellipse,
        Polygon
    } from 'react-native-svg';

    interface IconProps {
        size?: number;
        focused?: boolean;
    }

    // Home Icon - Majestic house with golden cross and heavenly glow
    export const HomeNavIcon: React.FC<IconProps> = ({ size = 24, focused = false }) => (
        <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
            <Defs>
                <LinearGradient id="homeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor={focused ? "#ffd700" : "rgba(255,255,255,0.9)"} />
                    <Stop offset="30%" stopColor={focused ? "#ff8c42" : "rgba(255,255,255,0.8)"} />
                    <Stop offset="70%" stopColor={focused ? "#ff6b35" : "rgba(255,255,255,0.7)"} />
                    <Stop offset="100%" stopColor={focused ? "#f7931e" : "rgba(255,255,255,0.6)"} />
                </LinearGradient>
                <RadialGradient id="homeGlow" cx="50%" cy="40%">
                    <Stop offset="0%" stopColor="rgba(255,215,0,0.6)" />
                    <Stop offset="50%" stopColor="rgba(255,140,66,0.3)" />
                    <Stop offset="100%" stopColor="rgba(255,107,53,0)" />
                </RadialGradient>
                <LinearGradient id="roofGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <Stop offset="0%" stopColor={focused ? "#ffeb3b" : "rgba(255,255,255,0.8)"} />
                    <Stop offset="100%" stopColor={focused ? "#ff9800" : "rgba(255,255,255,0.6)"} />
                </LinearGradient>
            </Defs>
            
            {/* Divine glow background when focused */}
            {focused && (
                <Circle cx="14" cy="14" r="13" fill="url(#homeGlow)" opacity="0.7" />
            )}
            
            {/* House shadow */}
            <Path
                d="M14 4l11 9v13H3V13l11-9z"
                fill="rgba(0,0,0,0.15)"
                transform="translate(1,1)"
            />
            
            {/* Main house structure */}
            <Path
                d="M14 3l11 9v13H3V12l11-9z"
                fill="url(#homeGradient)"
                stroke={focused ? "rgba(255,215,0,0.5)" : "rgba(255,255,255,0.3)"}
                strokeWidth="0.5"
            />
            
            {/* Beautiful roof with gradient */}
            <Path
                d="M14 3l11 9H3l11-9z"
                fill="url(#roofGradient)"
                stroke={focused ? "#ffd700" : "rgba(255,255,255,0.4)"}
                strokeWidth="0.5"
            />
            
            {/* Elegant door with golden handles */}
            <Rect
                x="11"
                y="17"
                width="6"
                height="8"
                rx="3"
                fill={focused ? "rgba(139,69,19,0.8)" : "rgba(0,0,0,0.4)"}
                stroke={focused ? "#ffd700" : "rgba(255,255,255,0.2)"}
                strokeWidth="0.5"
            />
            
            {/* Door handle */}
            <Circle 
                cx={focused ? "15.5" : "15"} 
                cy="21" 
                r="0.5" 
                fill={focused ? "#ffd700" : "rgba(255,255,255,0.6)"} 
            />
            
            {/* Beautiful windows with light */}
            <Rect x="6" y="15" width="3" height="3" rx="0.5" 
                fill={focused ? "rgba(255,235,59,0.9)" : "rgba(255,255,255,0.5)"} 
                stroke={focused ? "#ffd700" : "rgba(255,255,255,0.3)"} 
                strokeWidth="0.5" />
            <Rect x="19" y="15" width="3" height="3" rx="0.5" 
                fill={focused ? "rgba(255,235,59,0.9)" : "rgba(255,255,255,0.5)"} 
                stroke={focused ? "#ffd700" : "rgba(255,255,255,0.3)"} 
                strokeWidth="0.5" />
            
            {/* Window cross dividers */}
            <Path d="M7.5 15v3M6 16.5h3" stroke={focused ? "#333" : "rgba(0,0,0,0.3)"} strokeWidth="0.3" />
            <Path d="M20.5 15v3M19 16.5h3" stroke={focused ? "#333" : "rgba(0,0,0,0.3)"} strokeWidth="0.3" />
            
            {/* Majestic cross on roof with divine rays */}
            <G>
                {/* Cross rays when focused */}
                {focused && (
                    <G stroke="#ffd700" strokeWidth="0.5" opacity="0.8">
                        <Path d="M14 6l-1 1M14 6l1 1M14 6v-1M13 7l1-1M15 7l-1-1" />
                    </G>
                )}
                
                {/* Main cross */}
                <G stroke={focused ? "#fff" : "rgba(255,255,255,0.9)"} strokeWidth="1.5" strokeLinecap="round">
                    <Path d="M14 6v3M12.5 7.5h3" />
                </G>
                
                {/* Cross glow */}
                {focused && (
                    <G stroke="#ffd700" strokeWidth="0.8" opacity="0.6" strokeLinecap="round">
                        <Path d="M14 6v3M12.5 7.5h3" />
                    </G>
                )}
            </G>
            
            {/* Chimney with smoke when focused */}
            <Rect x="19" y="8" width="2" height="4" 
                fill={focused ? "url(#homeGradient)" : "rgba(255,255,255,0.6)"} />
            
            {focused && (
                <G fill="rgba(255,255,255,0.4)">
                    <Circle cx="20" cy="7" r="0.3" />
                    <Circle cx="19.5" cy="6.2" r="0.2" />
                    <Circle cx="20.5" cy="6.5" r="0.25" />
                </G>
            )}
            
            {/* Decorative foundation */}
            <Rect x="3" y="24" width="22" height="1" 
                fill={focused ? "url(#roofGradient)" : "rgba(255,255,255,0.4)"} 
                opacity="0.8" />
        </Svg>
    );

    // Devotions Icon - Sacred book with floating golden words and divine light
    export const DevotionsNavIcon: React.FC<IconProps> = ({ size = 24, focused = false }) => (
        <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
            <Defs>
                <LinearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor={focused ? "#ffd700" : "rgba(255,255,255,0.9)"} />
                    <Stop offset="50%" stopColor={focused ? "#ffb347" : "rgba(255,255,255,0.8)"} />
                    <Stop offset="100%" stopColor={focused ? "#ff8c42" : "rgba(255,255,255,0.6)"} />
                </LinearGradient>
                <LinearGradient id="pageGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <Stop offset="0%" stopColor={focused ? "#fffef7" : "rgba(255,255,255,0.95)"} />
                    <Stop offset="100%" stopColor={focused ? "#f5f5dc" : "rgba(255,255,255,0.8)"} />
                </LinearGradient>
                <RadialGradient id="bookGlow" cx="50%" cy="50%">
                    <Stop offset="0%" stopColor="rgba(255,215,0,0.5)" />
                    <Stop offset="100%" stopColor="rgba(255,215,0,0)" />
                </RadialGradient>
            </Defs>
            
            {/* Divine glow when focused */}
            {focused && (
                <Ellipse cx="14" cy="14" rx="12" ry="10" fill="url(#bookGlow)" opacity="0.6" />
            )}
            
            {/* Book shadow */}
            <G transform="translate(1,1)" opacity="0.2">
                <Path d="M4 7h9v16H6c-1.1 0-2-.9-2-2V7z" fill="#000" />
                <Path d="M15 7h9v14c0 1.1-.9 2-2 2h-7V7z" fill="#000" />
            </G>
            
            {/* Left page with beautiful details */}
            <Path
                d="M4 6h9v16H6c-1.1 0-2-.9-2-2V6z"
                fill="url(#pageGradient)"
                stroke={focused ? "#e6d3a3" : "rgba(255,255,255,0.4)"}
                strokeWidth="0.5"
            />
            
            {/* Right page */}
            <Path
                d="M15 6h9v14c0 1.1-.9 2-2 2h-7V6z"
                fill="url(#pageGradient)"
                stroke={focused ? "#e6d3a3" : "rgba(255,255,255,0.4)"}
                strokeWidth="0.5"
            />
            
            {/* Golden spine with ornate details */}
            <Rect x="13" y="6" width="2" height="16" fill="url(#bookGradient)" />
            <Circle cx="14" cy="10" r="0.5" fill={focused ? "#fff" : "rgba(255,255,255,0.6)"} />
            <Circle cx="14" cy="14" r="0.5" fill={focused ? "#fff" : "rgba(255,255,255,0.6)"} />
            <Circle cx="14" cy="18" r="0.5" fill={focused ? "#fff" : "rgba(255,255,255,0.6)"} />
            
            {/* Sacred text lines with beautiful typography */}
            <G stroke={focused ? "#8b7355" : "rgba(255,255,255,0.6)"} strokeWidth="0.4" strokeLinecap="round">
                {/* Left page */}
                <Path d="M6 9h5M6 10.5h4M6 12h5M6 13.5h3.5M6 15h4.5M6 16.5h3" />
                {/* Right page */}
                <Path d="M17 9h5M17 10.5h4M17 12h5M17 13.5h3.5M17 15h4.5M17 16.5h3" />
            </G>
            
            {/* Golden cross on left page */}
            <G transform="translate(8, 11)">
                <G stroke={focused ? "#ffd700" : "rgba(255,255,255,0.8)"} strokeWidth="1.2" strokeLinecap="round">
                    <Path d="M0 -1.5v3M-1.5 0h3" />
                </G>
                {focused && (
                    <G stroke="#fff" strokeWidth="0.6" strokeLinecap="round">
                        <Path d="M0 -1v2M-1 0h2" />
                    </G>
                )}
            </G>
            
            {/* Floating spiritual words when focused */}
            {focused && (
                <G fill="#ffd700" opacity="0.8">
                    <Circle cx="8" cy="4" r="0.5" />
                    <Circle cx="20" cy="5" r="0.4" />
                    <Circle cx="6" cy="24" r="0.3" />
                    <Circle cx="22" cy="23" r="0.4" />
                    <Circle cx="10" cy="3" r="0.3" />
                </G>
            )}
            
            {/* Page corner decorations */}
            <Circle cx="6" cy="8" r="0.5" fill={focused ? "#ffd700" : "rgba(255,255,255,0.5)"} opacity="0.6" />
            <Circle cx="22" cy="8" r="0.5" fill={focused ? "#ffd700" : "rgba(255,255,255,0.5)"} opacity="0.6" />
            
            {/* Bookmark ribbon */}
            <Rect x="13.5" y="3" width="1" height="6" fill={focused ? "#ff6b35" : "rgba(255,107,53,0.6)"} />
            <Path d="M13.5 8.5l0.5 1 0.5-1z" fill={focused ? "#ff6b35" : "rgba(255,107,53,0.6)"} />
        </Svg>
    );

    // Prayer Icon - Divine hands with heavenly light and floating prayers
    export const PrayerNavIcon: React.FC<IconProps> = ({ size = 24, focused = false }) => (
        <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
            <Defs>
                <LinearGradient id="prayerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor={focused ? "#e1bee7" : "rgba(255,255,255,0.9)"} />
                    <Stop offset="50%" stopColor={focused ? "#ce93d8" : "rgba(255,255,255,0.8)"} />
                    <Stop offset="100%" stopColor={focused ? "#ba68c8" : "rgba(255,255,255,0.6)"} />
                </LinearGradient>
                <RadialGradient id="divineGlow" cx="50%" cy="30%">
                    <Stop offset="0%" stopColor="rgba(255,215,0,0.7)" />
                    <Stop offset="50%" stopColor="rgba(186,104,200,0.4)" />
                    <Stop offset="100%" stopColor="rgba(186,104,200,0)" />
                </RadialGradient>
                <LinearGradient id="lightRays" x1="50%" y1="0%" x2="50%" y2="100%">
                    <Stop offset="0%" stopColor="rgba(255,235,59,0.8)" />
                    <Stop offset="100%" stopColor="rgba(255,235,59,0)" />
                </LinearGradient>
            </Defs>
            
            {/* Divine radiance when focused */}
            {focused && (
                <Ellipse cx="14" cy="12" rx="13" ry="8" fill="url(#divineGlow)" opacity="0.8" />
            )}
            
            {/* Heavenly light rays */}
            {focused && (
                <G stroke="#ffd700" strokeWidth="0.8" strokeLinecap="round" opacity="0.7">
                    <Path d="M14 2v3M10 3l1.5 1.5M18 3l-1.5 1.5" />
                    <Path d="M8 4l1 1.5M20 4l-1 1.5" />
                    <Path d="M7 6l0.8 1M21 6l-0.8 1" />
                </G>
            )}
            
            {/* Hands shadow */}
            <G fill="rgba(0,0,0,0.15)" transform="translate(1,1)">
                <Path d="M11 8c-1.5 0-2.5 1-2.5 2.5v10c0 1.5 1 2.5 2.5 2.5h1.5v-2.5H11v-10c0-0.8 0.7-1.5 1.5-1.5V8z" />
                <Path d="M17 8c1.5 0 2.5 1 2.5 2.5v10c0 1.5-1 2.5-2.5 2.5H15.5v-2.5H17v-10c0-0.8-0.7-1.5-1.5-1.5V8z" />
                <Path d="M12.5 8h3v15h-3z" />
            </G>
            
            {/* Beautiful praying hands */}
            <G fill="url(#prayerGradient)" opacity="0.95">
                {/* Left hand */}
                <Path d="M11 7c-1.5 0-2.5 1-2.5 2.5v10c0 1.5 1 2.5 2.5 2.5h1.5v-2.5H11v-10c0-0.8 0.7-1.5 1.5-1.5V7z" 
                    stroke={focused ? "rgba(255,215,0,0.3)" : "rgba(255,255,255,0.2)"} 
                    strokeWidth="0.5" />
                {/* Right hand */}
                <Path d="M17 7c1.5 0 2.5 1 2.5 2.5v10c0 1.5-1 2.5-2.5 2.5H15.5v-2.5H17v-10c0-0.8-0.7-1.5-1.5-1.5V7z" 
                    stroke={focused ? "rgba(255,215,0,0.3)" : "rgba(255,255,255,0.2)"} 
                    strokeWidth="0.5" />
                {/* Joined fingers */}
                <Path d="M12.5 7h3v15h-3z" 
                    stroke={focused ? "rgba(255,215,0,0.3)" : "rgba(255,255,255,0.2)"} 
                    strokeWidth="0.5" />
            </G>
            
            {/* Finger details */}
            <G stroke={focused ? "rgba(255,215,0,0.5)" : "rgba(255,255,255,0.4)"} strokeWidth="0.3">
                <Path d="M11 9v2M17 9v2" />
                <Path d="M11 12v2M17 12v2" />
                <Path d="M13 8v3M15 8v3" />
            </G>
            
            {/* Sacred heart in center when focused */}
            {focused && (
                <Path
                    d="M14 13c-1-1-2.5-1-2.5 0.5s1.5 2.5 2.5 3.5c1-1 2.5-2.5 2.5-3.5s-1.5-1.5-2.5-0.5z"
                    fill="#ff6b6b"
                    opacity="0.8"
                    stroke="#ffd700"
                    strokeWidth="0.3"
                />
            )}
            
            {/* Floating prayer symbols when focused */}
            {focused && (
                <G fill="#ffd700" opacity="0.6">
                    <Path d="M6 10l1 0.5-1 0.5z" />
                    <Path d="M22 12l-1 0.5 1 0.5z" />
                    <Circle cx="7" cy="16" r="0.4" />
                    <Circle cx="21" cy="18" r="0.4" />
                    <Path d="M8 22c0.5-0.5 1-0.5 1 0s-0.5 1-1 1-0.5-0.5 0-1z" />
                </G>
            )}
            
            {/* Divine blessing drops */}
            {focused && (
                <G fill="rgba(255,235,59,0.6)">
                    <Circle cx="10" cy="6" r="0.3" />
                    <Circle cx="18" cy="6" r="0.3" />
                    <Circle cx="14" cy="5" r="0.4" />
                </G>
            )}
        </Svg>
    );

    // Videos Icon - Cinematic masterpiece with film reel and magical sparkles
    export const VideosNavIcon: React.FC<IconProps> = ({ size = 24, focused = false }) => (
        <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
            <Defs>
                <LinearGradient id="videoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor={focused ? "#ff6b35" : "rgba(255,255,255,0.9)"} />
                    <Stop offset="30%" stopColor={focused ? "#ff8c42" : "rgba(255,255,255,0.8)"} />
                    <Stop offset="70%" stopColor={focused ? "#ffa726" : "rgba(255,255,255,0.7)"} />
                    <Stop offset="100%" stopColor={focused ? "#ffcc02" : "rgba(255,255,255,0.6)"} />
                </LinearGradient>
                <RadialGradient id="videoGlow" cx="50%" cy="50%">
                    <Stop offset="0%" stopColor="rgba(255,107,53,0.6)" />
                    <Stop offset="50%" stopColor="rgba(255,140,66,0.3)" />
                    <Stop offset="100%" stopColor="rgba(255,140,66,0)" />
                </RadialGradient>
                <LinearGradient id="filmGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <Stop offset="0%" stopColor={focused ? "rgba(255,107,53,0.3)" : "rgba(255,255,255,0.4)"} />
                    <Stop offset="50%" stopColor={focused ? "rgba(255,140,66,0.2)" : "rgba(255,255,255,0.3)"} />
                    <Stop offset="100%" stopColor={focused ? "rgba(255,107,53,0.3)" : "rgba(255,255,255,0.4)"} />
                </LinearGradient>
            </Defs>
            
            {/* Cinematic glow when focused */}
            {focused && (
                <Circle cx="14" cy="14" r="13" fill="url(#videoGlow)" opacity="0.7" />
            )}
            
            {/* Film strip background */}
            <Rect 
                x="2" 
                y="8" 
                width="24" 
                height="12" 
                rx="3"
                fill="url(#filmGradient)"
                stroke="url(#videoGradient)"
                strokeWidth="1"
            />
            
            {/* Film perforations */}
            <G fill={focused ? "#333" : "rgba(0,0,0,0.4)"}>
                {/* Left side holes */}
                <Circle cx="4.5" cy="10.5" r="0.7" />
                <Circle cx="4.5" cy="13" r="0.7" />
                <Circle cx="4.5" cy="15.5" r="0.7" />
                <Circle cx="4.5" cy="18" r="0.7" />
                {/* Right side holes */}
                <Circle cx="23.5" cy="10.5" r="0.7" />
                <Circle cx="23.5" cy="13" r="0.7" />
                <Circle cx="23.5" cy="15.5" r="0.7" />
                <Circle cx="23.5" cy="18" r="0.7" />
            </G>
            
            {/* Main play button with shadow */}
            <Circle cx="15" cy="15" r="5.5" fill="rgba(0,0,0,0.15)" />
            
            {/* Beautiful play button */}
            <Circle cx="14" cy="14" r="5.5" fill="url(#videoGradient)" 
                    stroke={focused ? "#ffd700" : "rgba(255,255,255,0.3)"} 
                    strokeWidth="0.8" />
            
            {/* Play triangle with perfect proportions */}
            <Path
                d="M11.5 10.5l7 3.5-7 3.5V10.5z"
                fill={focused ? "#fff" : "rgba(255,255,255,0.95)"}
                stroke={focused ? "rgba(255,215,0,0.3)" : "rgba(0,0,0,0.1)"}
                strokeWidth="0.3"
            />
            
            {/* Inner play button highlight */}
            <Circle cx="14" cy="14" r="3" fill="none" 
                    stroke={focused ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)"} 
                    strokeWidth="0.5" />
            
            {/* Film frames */}
            <G stroke={focused ? "rgba(255,107,53,0.4)" : "rgba(255,255,255,0.3)"} strokeWidth="0.3">
                <Rect x="7" y="9.5" width="3" height="2" rx="0.3" fill="none" />
                <Rect x="7" y="12.5" width="3" height="2" rx="0.3" fill="none" />
                <Rect x="7" y="15.5" width="3" height="2" rx="0.3" fill="none" />
                
                <Rect x="18" y="9.5" width="3" height="2" rx="0.3" fill="none" />
                <Rect x="18" y="12.5" width="3" height="2" rx="0.3" fill="none" />
                <Rect x="18" y="15.5" width="3" height="2" rx="0.3" fill="none" />
            </G>
            
            {/* Magical sparkles when focused */}
            {focused && (
                <G fill="#ffd700" opacity="0.9">
                    <Path d="M7 6l0.5 1.5L9 7l-1.5 0.5L7 6z" />
                    <Path d="M21 5l0.4 1.2L23 6l-1.6 0.4L21 5z" />
                    <Path d="M6 22l0.3 0.9L7 23l-0.7 0.3L6 22z" />
                    <Path d="M22 21l0.4 1.2L24 22l-1.6 0.4L22 21z" />
                    <Circle cx="9" cy="4" r="0.4" />
                    <Circle cx="19" cy="25" r="0.3" />
                </G>
            )}
            
            {/* Director's clapperboard corners */}
            <Rect x="2" y="8" width="4" height="1" fill={focused ? "#ffd700" : "rgba(255,255,255,0.6)"} />
            <Rect x="22" y="8" width="4" height="1" fill={focused ? "#ffd700" : "rgba(255,255,255,0.6)"} />
            
            {/* Lens flare effect when focused */}
            {focused && (
                <G opacity="0.6">
                    <Circle cx="14" cy="14" r="8" fill="none" stroke="rgba(255,215,0,0.2)" strokeWidth="0.5" />
                    <Circle cx="14" cy="14" r="10" fill="none" stroke="rgba(255,215,0,0.1)" strokeWidth="0.3" />
                </G>
            )}
        </Svg>
    );

    // Profile Icon - Majestic person with golden halo and divine features
    export const ProfileNavIcon: React.FC<IconProps> = ({ size = 24, focused = false }) => (
        <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
            <Defs>
                <LinearGradient id="profileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor={focused ? "#4facfe" : "rgba(255,255,255,0.9)"} />
                    <Stop offset="30%" stopColor={focused ? "#00f2fe" : "rgba(255,255,255,0.8)"} />
                    <Stop offset="70%" stopColor={focused ? "#43a3f5" : "rgba(255,255,255,0.7)"} />
                    <Stop offset="100%" stopColor={focused ? "#667eea" : "rgba(255,255,255,0.6)"} />
                </LinearGradient>
                <RadialGradient id="haloGlow" cx="50%" cy="30%">
                    <Stop offset="0%" stopColor="rgba(255,215,0,0.8)" />
                    <Stop offset="50%" stopColor="rgba(255,215,0,0.4)" />
                    <Stop offset="100%" stopColor="rgba(255,215,0,0)" />
                </RadialGradient>
                <LinearGradient id="faceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor={focused ? "#fff3e0" : "rgba(255,255,255,0.9)"} />
                    <Stop offset="100%" stopColor={focused ? "#ffe0b2" : "rgba(255,255,255,0.7)"} />
                </LinearGradient>
            </Defs>
            
            {/* Divine aura when focused */}
            {focused && (
                <Circle cx="14" cy="10" r="12" fill="url(#haloGlow)" opacity="0.7" />
            )}
            
            {/* Sacred halo */}
            {focused && (
                <G>
                    <Circle 
                        cx="14" 
                        cy="9" 
                        r="6.5" 
                        fill="none" 
                        stroke="#ffd700" 
                        strokeWidth="1.2" 
                        opacity="0.9"
                    />
                    <Circle 
                        cx="14" 
                        cy="9" 
                        r="5.5" 
                        fill="none" 
                        stroke="rgba(255,215,0,0.4)" 
                        strokeWidth="0.8" 
                    />
                    {/* Halo sparkles */}
                    <G fill="#ffd700" opacity="0.8">
                        <Circle cx="20" cy="6" r="0.4" />
                        <Circle cx="8" cy="6" r="0.4" />
                        <Circle cx="17.5" cy="3.5" r="0.3" />
                        <Circle cx="10.5" cy="3.5" r="0.3" />
                    </G>
                </G>
            )}
            
            {/* Body shadow */}
            <Path
                d="M14 16c-5 0-8 3-8 8h16c0-5-3-8-8-8z"
                fill="rgba(0,0,0,0.15)"
                transform="translate(1,1)"
            />
            
            {/* Head shadow */}
            <Circle cx="15" cy="10" r="4.5" fill="rgba(0,0,0,0.15)" />
            
            {/* Beautiful body */}
            <Path
                d="M14 15c-5 0-8 3-8 8h16c0-5-3-8-8-8z"
                fill="url(#profileGradient)"
                stroke={focused ? "rgba(255,215,0,0.3)" : "rgba(255,255,255,0.3)"}
                strokeWidth="0.5"
            />
            
            {/* Radiant head */}
            <Circle cx="14" cy="9" r="4.5" fill="url(#faceGradient)" 
                    stroke={focused ? "rgba(255,215,0,0.3)" : "rgba(255,255,255,0.3)"} 
                    strokeWidth="0.5" />
            
            {/* Beautiful facial features when focused */}
            {focused && (
                <G>
                    {/* Eyes with soul */}
                    <Circle cx="12.5" cy="8.5" r="0.6" fill="#333" />
                    <Circle cx="15.5" cy="8.5" r="0.6" fill="#333" />
                    <Circle cx="12.7" cy="8.3" r="0.2" fill="#fff" />
                    <Circle cx="15.7" cy="8.3" r="0.2" fill="#fff" />
                    
                    {/* Gentle smile */}
                    <Path d="M12 10.5c0.8 0.8 2.4 0.8 3.2 0" 
                        stroke="#333" 
                        strokeWidth="0.4" 
                        fill="none" 
                        strokeLinecap="round" />
                    
                    {/* Eyebrows */}
                    <Path d="M11.8 7.5c0.5-0.2 1.2-0.2 1.7 0" 
                        stroke="#8d6e63" 
                        strokeWidth="0.3" 
                        strokeLinecap="round" />
                    <Path d="M14.5 7.5c0.5-0.2 1.2-0.2 1.7 0" 
                        stroke="#8d6e63" 
                        strokeWidth="0.3" 
                        strokeLinecap="round" />
                    
                    {/* Nose */}
                    <Path d="M14 9.2v0.6" 
                        stroke="rgba(0,0,0,0.2)" 
                        strokeWidth="0.2" 
                        strokeLinecap="round" />
                </G>
            )}
            
            {/* Sacred heart on chest when focused */}
            {focused && (
                <Path
                    d="M14 18c-1.2-1.2-2.8-1.2-2.8 0.6s1.8 2.8 2.8 3.8c1-1 2.8-2.8 2.8-3.8s-1.6-1.8-2.8-0.6z"
                    fill="#ff6b6b"
                    opacity="0.8"
                    stroke="#ffd700"
                    strokeWidth="0.3"
                />
            )}
            
            {/* Spiritual crown when focused */}
            {focused && (
                <G stroke="#ffd700" strokeWidth="0.6" fill="none" opacity="0.7">
                    <Path d="M10 5l1 1.5 1-1.5 1 1.5 1-1.5 1 1.5 1-1.5 1 1.5 1-1.5" />
                </G>
            )}
            
            {/* Divine light rays emanating from person when focused */}
            {focused && (
                <G stroke="rgba(255,215,0,0.4)" strokeWidth="0.5" strokeLinecap="round">
                    <Path d="M5 12l2 1M23 12l-2 1" />
                    <Path d="M6 17l2 0.5M22 17l-2 0.5" />
                    <Path d="M8 21l1.5 0.3M20 21l-1.5 0.3" />
                </G>
            )}
            
            {/* Clothing details */}
            <G stroke={focused ? "rgba(255,215,0,0.3)" : "rgba(255,255,255,0.3)"} strokeWidth="0.3">
                <Path d="M10 19c1-0.5 3-0.5 4 0" />
                <Path d="M9 21c1.5-0.3 4.5-0.3 6 0" />
            </G>
            
            {/* Blessing hands gesture when focused */}
            {focused && (
                <G fill="url(#profileGradient)" opacity="0.8">
                    <Ellipse cx="9" cy="20" rx="1" ry="0.5" />
                    <Ellipse cx="19" cy="20" rx="1" ry="0.5" />
                </G>
            )}
            
            {/* Gentle glow around entire figure when focused */}
            {focused && (
                <G stroke="rgba(255,215,0,0.2)" fill="none" strokeWidth="0.5">
                    <Circle cx="14" cy="14" r="11" />
                    <Circle cx="14" cy="14" r="9" opacity="0.5" />
                </G>
            )}
        </Svg>
    );

    export const NavigationIcons = {
        Home: HomeNavIcon,
        Devotions: DevotionsNavIcon,
        Prayer: PrayerNavIcon,
        Videos: VideosNavIcon,
        Profile: ProfileNavIcon,
    };