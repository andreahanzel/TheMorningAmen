// src/components/icons/SpiritualIcons.tsx
// Custom spiritual-themed icons 
// This file contains a set of spiritual icons designed to represent various themes such as joy, strength, purpose, rest, hope, peace, trust, love, renewal, and new life.
// Using React Native SVG for scalable, customizable icons

    import React from 'react';
    import Svg, { 
    Path, 
    Circle, 
    Ellipse, 
    G, 
    Defs, 
    LinearGradient, 
    Stop,
    Polygon,
    Rect
    } from 'react-native-svg';

    interface IconProps {
    size?: number;
    color?: string;
    gradient?: boolean;
    }

    // Joy Icon - Radiant Sun with Cross
    export const JoyIcon: React.FC<IconProps> = ({ size = 24, color = '#ffeb3b', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
        {gradient && (
            <LinearGradient id="joyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#ffeb3b" />
            <Stop offset="50%" stopColor="#ffc107" />
            <Stop offset="100%" stopColor="#ff9800" />
            </LinearGradient>
        )}
        </Defs>
        
        {/* Radiant rays */}
        <G stroke={gradient ? "url(#joyGradient)" : color} strokeWidth="2" strokeLinecap="round">
        <Path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </G>
        
        {/* Sun center */}
        <Circle 
        cx="12" 
        cy="12" 
        r="5" 
        fill={gradient ? "url(#joyGradient)" : color}
        opacity="0.8"
        />
        
        {/* Small cross in center */}
        <G stroke="white" strokeWidth="1.5" strokeLinecap="round">
        <Path d="M12 10v4M10 12h4" />
        </G>
    </Svg>
    );

    // Strength Icon - Mountain with Cross
    export const StrengthIcon: React.FC<IconProps> = ({ size = 24, color = '#ff6b35', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
        {gradient && (
            <LinearGradient id="strengthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#ff6b35" />
            <Stop offset="50%" stopColor="#ff8c42" />
            <Stop offset="100%" stopColor="#ffa726" />
            </LinearGradient>
        )}
        </Defs>
        
        {/* Mountain peaks */}
        <Path 
        d="M3 20L8 8L12 12L16 6L21 20H3Z" 
        fill={gradient ? "url(#strengthGradient)" : color}
        opacity="0.8"
        />
        
        {/* Cross on highest peak */}
        <G stroke="white" strokeWidth="2" strokeLinecap="round">
        <Path d="M16 6v-3M14.5 4.5h3" />
        </G>
        
        {/* Base line */}
        <Path d="M3 20h18" stroke={gradient ? "url(#strengthGradient)" : color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
    );

    // Purpose Icon - Compass with Cross
    export const PurposeIcon: React.FC<IconProps> = ({ size = 24, color = '#ff7043', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
        {gradient && (
            <LinearGradient id="purposeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#ff7043" />
            <Stop offset="50%" stopColor="#ff5722" />
            <Stop offset="100%" stopColor="#f4511e" />
            </LinearGradient>
        )}
        </Defs>
        
        {/* Compass circle */}
        <Circle 
        cx="12" 
        cy="12" 
        r="9" 
        fill="none" 
        stroke={gradient ? "url(#purposeGradient)" : color} 
        strokeWidth="2"
        />
        
        {/* Compass points */}
        <G stroke={gradient ? "url(#purposeGradient)" : color} strokeWidth="1.5" strokeLinecap="round">
        <Path d="M12 3v2M12 19v2M21 12h-2M5 12H3" />
        </G>
        
        {/* Cross needle pointing up */}
        <G fill={gradient ? "url(#purposeGradient)" : color}>
        <Path d="M12 6l2 6-2-1-2 1z" />
        <Circle cx="12" cy="12" r="1.5" fill="white" stroke={gradient ? "url(#purposeGradient)" : color} strokeWidth="1" />
        </G>
        
        {/* Small cross at top */}
        <G stroke="white" strokeWidth="1" strokeLinecap="round">
        <Path d="M12 5v2M11 6h2" />
        </G>
    </Svg>
    );

    // Rest Icon - Peaceful Dove
    export const RestIcon: React.FC<IconProps> = ({ size = 24, color = '#81c784', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
        {gradient && (
            <LinearGradient id="restGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#81c784" />
            <Stop offset="50%" stopColor="#66bb6a" />
            <Stop offset="100%" stopColor="#4caf50" />
            </LinearGradient>
        )}
        </Defs>
        
        {/* Dove body */}
        <Path 
        d="M8 12c0-3 2-5 5-5s5 2 5 5-2 5-5 5-3-1-4-2" 
        fill={gradient ? "url(#restGradient)" : color}
        opacity="0.8"
        />
        
        {/* Dove wing */}
        <Path 
        d="M13 9c2-1 4-1 6 0-1 2-3 3-6 2z" 
        fill={gradient ? "url(#restGradient)" : color}
        opacity="0.6"
        />
        
        {/* Olive branch */}
        <G stroke={gradient ? "url(#restGradient)" : color} strokeWidth="1.5" strokeLinecap="round" fill="none">
        <Path d="M6 14c-2 0-3 1-3 2s1 1 2 1c1-1 2-2 1-3z" />
        <Circle cx="5" cy="16" r="0.5" fill={gradient ? "url(#restGradient)" : color} />
        <Circle cx="4" cy="15.5" r="0.5" fill={gradient ? "url(#restGradient)" : color} />
        </G>
        
        {/* Dove eye */}
        <Circle cx="14" cy="11" r="1" fill="white" />
        <Circle cx="14" cy="11" r="0.5" fill="#333" />
    </Svg>
    );

    // Hope Icon - Rainbow with Cross
    export const HopeIcon: React.FC<IconProps> = ({ size = 24, color = '#64b5f6', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
        {gradient && (
            <LinearGradient id="hopeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#64b5f6" />
            <Stop offset="50%" stopColor="#42a5f5" />
            <Stop offset="100%" stopColor="#2196f3" />
            </LinearGradient>
        )}
        </Defs>
        
        {/* Rainbow arcs */}
        <G fill="none" strokeWidth="2" strokeLinecap="round">
        <Path d="M4 18c0-7 3-10 8-10s8 3 8 10" stroke="#ff6b6b" />
        <Path d="M5 18c0-6 2.5-8.5 7-8.5s7 2.5 7 8.5" stroke="#ffa726" />
        <Path d="M6 18c0-5 2-7 6-7s6 2 6 7" stroke="#ffeb3b" />
        <Path d="M7 18c0-4 1.5-5.5 5-5.5s5 1.5 5 5.5" stroke="#66bb6a" />
        <Path d="M8 18c0-3 1-4 4-4s4 1 4 4" stroke={gradient ? "url(#hopeGradient)" : color} />
        </G>
        
        {/* Cross at the end */}
        <G stroke="white" strokeWidth="2" strokeLinecap="round" fill={gradient ? "url(#hopeGradient)" : color}>
        <Path d="M18 15v6M16 18h4" />
        </G>
    </Svg>
    );

    // Peace Icon - Praying Hands
    export const PeaceIcon: React.FC<IconProps> = ({ size = 24, color = '#ba68c8', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
        {gradient && (
            <LinearGradient id="peaceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#ba68c8" />
            <Stop offset="50%" stopColor="#ab47bc" />
            <Stop offset="100%" stopColor="#9c27b0" />
            </LinearGradient>
        )}
        </Defs>
        
        {/* Praying hands */}
        <G fill={gradient ? "url(#peaceGradient)" : color} opacity="0.8">
        {/* Left hand */}
        <Path d="M10 6c-1 0-2 1-2 2v8c0 1 1 2 2 2h1v-2h-1v-8c0-0.5 0.5-1 1-1v-1z" />
        {/* Right hand */}
        <Path d="M14 6c1 0 2 1 2 2v8c0 1-1 2-2 2h-1v-2h1v-8c0-0.5-0.5-1-1-1v-1z" />
        {/* Joined fingers */}
        <Path d="M11 6h2v12h-2z" />
        </G>
        
        {/* Light rays from above */}
        <G stroke={gradient ? "url(#peaceGradient)" : color} strokeWidth="1" strokeLinecap="round" opacity="0.6">
        <Path d="M12 2v2M9 3l1 1M15 3l-1 1" />
        </G>
    </Svg>
    );

    // Trust Icon - Anchor with Cross
    export const TrustIcon: React.FC<IconProps> = ({ size = 24, color = '#ffb74d', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
        {gradient && (
            <LinearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#ffb74d" />
            <Stop offset="50%" stopColor="#ffa726" />
            <Stop offset="100%" stopColor="#ff9800" />
            </LinearGradient>
        )}
        </Defs>
        
        {/* Anchor shaft */}
        <Rect 
        x="11" 
        y="6" 
        width="2" 
        height="12" 
        fill={gradient ? "url(#trustGradient)" : color}
        />
        
        {/* Anchor arms */}
        <G stroke={gradient ? "url(#trustGradient)" : color} strokeWidth="2" strokeLinecap="round" fill="none">
        <Path d="M8 16c0 2 2 4 4 4s4-2 4-4" />
        <Path d="M8 16l-2-2M16 16l2-2" />
        </G>
        
        {/* Cross at top */}
        <G stroke={gradient ? "url(#trustGradient)" : color} strokeWidth="2" strokeLinecap="round">
        <Path d="M12 2v6M9 5h6" />
        </G>
        
        {/* Ring */}
        <Circle 
        cx="12" 
        cy="6" 
        r="2" 
        fill="none" 
        stroke={gradient ? "url(#trustGradient)" : color} 
        strokeWidth="2"
        />
    </Svg>
    );

    // Love Icon - Heart with Cross
    export const LoveIcon: React.FC<IconProps> = ({ size = 24, color = '#f06292', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
        {gradient && (
            <LinearGradient id="loveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#f06292" />
            <Stop offset="50%" stopColor="#ec407a" />
            <Stop offset="100%" stopColor="#e91e63" />
            </LinearGradient>
        )}
        </Defs>
        
        {/* Heart shape */}
        <Path 
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill={gradient ? "url(#loveGradient)" : color}
        opacity="0.8"
        />
        
        {/* Cross in center */}
        <G stroke="white" strokeWidth="2" strokeLinecap="round">
        <Path d="M12 10v4M10 12h4" />
        </G>
    </Svg>
    );

    // Renewal Icon - Phoenix/Eagle with Cross
    export const RenewalIcon: React.FC<IconProps> = ({ size = 24, color = '#4db6ac', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
        {gradient && (
            <LinearGradient id="renewalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#4db6ac" />
            <Stop offset="50%" stopColor="#26a69a" />
            <Stop offset="100%" stopColor="#009688" />
            </LinearGradient>
        )}
        </Defs>
        
        {/* Eagle body */}
        <Ellipse 
        cx="12" 
        cy="14" 
        rx="2" 
        ry="4" 
        fill={gradient ? "url(#renewalGradient)" : color}
        opacity="0.8"
        />
        
        {/* Wings spread */}
        <G fill={gradient ? "url(#renewalGradient)" : color} opacity="0.6">
        <Path d="M6 12c2-2 4-2 6-1-1 1-3 2-6 1z" />
        <Path d="M18 12c-2-2-4-2-6-1 1 1 3 2 6 1z" />
        </G>
        
        {/* Eagle head */}
        <Circle 
        cx="12" 
        cy="8" 
        r="2" 
        fill={gradient ? "url(#renewalGradient)" : color}
        opacity="0.8"
        />
        
        {/* Cross above eagle */}
        <G stroke="white" strokeWidth="1.5" strokeLinecap="round">
        <Path d="M12 3v3M10.5 4.5h3" />
        </G>
        
        {/* Renewal circular arrow */}
        <Path 
        d="M6 8c0-3 3-6 6-6M18 8c0-3-3-6-6-6" 
        stroke={gradient ? "url(#renewalGradient)" : color} 
        strokeWidth="1.5" 
        fill="none" 
        strokeLinecap="round"
        />
    </Svg>
    );

    // New Life Icon - Sprouting Seed with Cross
    export const NewLifeIcon: React.FC<IconProps> = ({ size = 24, color = '#aed581', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
        {gradient && (
            <LinearGradient id="newLifeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#aed581" />
            <Stop offset="50%" stopColor="#9ccc65" />
            <Stop offset="100%" stopColor="#8bc34a" />
            </LinearGradient>
        )}
        </Defs>
        
        {/* Soil line */}
        <Path 
        d="M4 18h16" 
        stroke="#8d6e63" 
        strokeWidth="3" 
        strokeLinecap="round"
        />
        
        {/* Plant stem */}
        <Path 
        d="M12 18v-6" 
        stroke={gradient ? "url(#newLifeGradient)" : color} 
        strokeWidth="2" 
        strokeLinecap="round"
        />
        
        {/* Leaves */}
        <G fill={gradient ? "url(#newLifeGradient)" : color} opacity="0.8">
        <Path d="M10 14c-2-1-3 0-3 1s1 2 3 1c0-1 0-2 0-2z" />
        <Path d="M14 12c2-1 3 0 3 1s-1 2-3 1c0-1 0-2 0-2z" />
        </G>
        
        {/* Cross at the top */}
        <G stroke={gradient ? "url(#newLifeGradient)" : color} strokeWidth="2" strokeLinecap="round">
        <Path d="M12 8v4M10 10h4" />
        </G>
        
        {/* Light rays */}
        <G stroke={gradient ? "url(#newLifeGradient)" : color} strokeWidth="1" strokeLinecap="round" opacity="0.6">
        <Path d="M8 6l1 1M16 6l-1 1M12 4v2" />
        </G>
    </Svg>
    );

    // Peace Icon - Ocean Wave (for "Finding Peace in the Storm")
    export const PeaceWaveIcon: React.FC<IconProps> = ({ size = 24, color = '#64b5f6', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
        {gradient && (
            <LinearGradient id="peaceWaveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#64b5f6" />
            <Stop offset="50%" stopColor="#42a5f5" />
            <Stop offset="100%" stopColor="#2196f3" />
            </LinearGradient>
        )}
        </Defs>
        
        {/* Ocean waves */}
        <G fill="none" stroke={gradient ? "url(#peaceWaveGradient)" : color} strokeWidth="2" strokeLinecap="round">
        <Path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
        <Path d="M3 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0" opacity="0.7" />
        <Path d="M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0" opacity="0.5" />
        </G>
        
        {/* Cross above waves */}
        <G stroke="white" strokeWidth="1.5" strokeLinecap="round">
        <Path d="M12 3v4M10 5h4" />
        </G>
    </Svg>
    );

    // Gratitude Icon - Hands with Heart
    export const GratitudeIcon: React.FC<IconProps> = ({ size = 24, color = '#ff9800', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
        {gradient && (
            <LinearGradient id="gratitudeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#ffeb3b" />
            <Stop offset="50%" stopColor="#ffc107" />
            <Stop offset="100%" stopColor="#ff9800" />
            </LinearGradient>
        )}
        </Defs>
        
        {/* Cupped hands */}
        <G fill={gradient ? "url(#gratitudeGradient)" : color} opacity="0.8">
        <Path d="M6 14c-1 0-2 1-2 2v3c0 1 1 2 2 2h3v-7H6z" />
        <Path d="M18 14c1 0 2 1 2 2v3c0 1-1 2-2 2h-3v-7h3z" />
        </G>
        
        {/* Heart in hands */}
        <Path 
        d="M12 8c-2-2-5-2-5 1s2 4 5 6c3-2 5-3 5-6s-3-3-5-1z"
        fill="#e91e63"
        opacity="0.9"
        />
    </Svg>
    );

    // Faith Icon - Path with Cross
    export const FaithPathIcon: React.FC<IconProps> = ({ size = 24, color = '#9c27b0', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
        {gradient && (
            <LinearGradient id="faithGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#ba68c8" />
            <Stop offset="50%" stopColor="#ab47bc" />
            <Stop offset="100%" stopColor="#9c27b0" />
            </LinearGradient>
        )}
        </Defs>
        
        {/* Winding path */}
        <Path 
        d="M3 20c2-3 4-5 6-3s2 4 4 2 4-6 6-4"
        stroke={gradient ? "url(#faithGradient)" : color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        />
        
        {/* Footsteps on path */}
        <G fill={gradient ? "url(#faithGradient)" : color} opacity="0.6">
        <Circle cx="6" cy="18" r="1" />
        <Circle cx="10" cy="16" r="1" />
        <Circle cx="14" cy="14" r="1" />
        <Circle cx="18" cy="12" r="1" />
        </G>
        
        {/* Cross at destination */}
        <G stroke="white" strokeWidth="1.5" strokeLinecap="round">
        <Path d="M20 6v4M18 8h4" />
        </G>
    </Svg>
    );

    // Mindfulness Icon - Present Gift Box
    export const MindfulnessIcon: React.FC<IconProps> = ({ size = 24, color = '#4caf50', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
        {gradient && (
            <LinearGradient id="mindfulnessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#81c784" />
            <Stop offset="50%" stopColor="#66bb6a" />
            <Stop offset="100%" stopColor="#4caf50" />
            </LinearGradient>
        )}
        </Defs>
        
        {/* Gift box */}
        <Rect 
        x="6" 
        y="10" 
        width="12" 
        height="8" 
        rx="2"
        fill={gradient ? "url(#mindfulnessGradient)" : color}
        opacity="0.8"
        />
        
        {/* Ribbon vertical */}
        <Rect x="11" y="6" width="2" height="12" fill="#ff9800" />
        
        {/* Ribbon horizontal */}
        <Rect x="6" y="13" width="12" height="2" fill="#ff9800" />
        
        {/* Bow */}
        <G fill="#ff6b35">
        <Path d="M10 6c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z" />
        <Path d="M8 8l4-2 4 2-2 1-2-1-2 1z" />
        </G>
    </Svg>
    );

    // Patience Icon - Hourglass with Cross
    export const PatienceIcon: React.FC<IconProps> = ({ size = 24, color = '#795548', gradient = true }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
        {gradient && (
            <LinearGradient id="patienceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#a1887f" />
            <Stop offset="50%" stopColor="#8d6e63" />
            <Stop offset="100%" stopColor="#795548" />
            </LinearGradient>
        )}
        </Defs>
        
        {/* Hourglass frame */}
        <G stroke={gradient ? "url(#patienceGradient)" : color} strokeWidth="2" fill="none">
        <Path d="M8 4h8v4l-4 4 4 4v4H8v-4l4-4-4-4V4z" />
        </G>
        
        {/* Sand */}
        <G fill={gradient ? "url(#patienceGradient)" : color} opacity="0.6">
        <Path d="M9 5h6v2l-3 2-3-2V5z" />
        <Path d="M9 19h6v-2l-3-2-3 2v2z" />
        </G>
        
        {/* Cross on top */}
        <G stroke="white" strokeWidth="1" strokeLinecap="round">
        <Path d="M12 2v2M11 3h2" />
        </G>
    </Svg>
    );

    // Export all icons
    export const SpiritualIcons = {
    Joy: JoyIcon,
    Strength: StrengthIcon,
    Purpose: PurposeIcon,
    Rest: RestIcon,
    Hope: HopeIcon,
    Peace: PeaceWaveIcon,      
    Trust: TrustIcon,
    Love: LoveIcon,
    Renewal: RenewalIcon,
    'New Life': NewLifeIcon,
    Gratitude: GratitudeIcon,
    Faith: FaithPathIcon,
    Mindfulness: MindfulnessIcon,
    Patience: PatienceIcon,
    };