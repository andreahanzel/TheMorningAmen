// src/views/screens/legal/TermsAndConditionsScreen.tsx

// © 2025 Andrea Toreki. All rights reserved.
// This source code is part of an academic project currently under development.
// Unauthorized reuse, reproduction, or distribution is strictly prohibited.
// Commercial release is planned; licensing details subject to change.

// Terms and Conditions Screen 
// This screen displays the complete terms of service for users that will be available in the app.

import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Platform,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface TermsAndConditionsScreenProps {
    navigation: any;
}

// Terms and Conditions Screen Component
export const TermsAndConditionsScreen: React.FC<TermsAndConditionsScreenProps> = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    // Animation for fade-in and slide-up effect
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#ff6b35" />
            <LinearGradient
                colors={['#ff9a56', '#ff6b35', '#f7931e']}
                style={styles.gradientContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Header */}
                <Animated.View
                    style={[
                        styles.header,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <BlurView intensity={20} style={styles.headerBlur}>
                        <View style={styles.headerContent}>
                            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                                <View style={styles.backIcon}>
                                    <View style={styles.backArrow} />
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Terms & Conditions</Text>
                            <View style={styles.placeholder} />
                        </View>
                    </BlurView>
                </Animated.View>

                {/* Content */}
                <Animated.View
                    style={[
                        styles.contentContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <BlurView intensity={15} style={styles.contentBlur}>
                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.content}>
                                <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</Text>
                                
                                <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                                <Text style={styles.paragraph}>
                                    By downloading, accessing, or using The Morning Amen mobile application ("App"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use our App.
                                </Text>

                                <Text style={styles.sectionTitle}>2. Description of Service</Text>
                                <Text style={styles.paragraph}>
                                    The Morning Amen is a faith-based mobile application that provides daily devotionals, inspirational videos, prayer requests, Bible verses, and spiritual content designed to support your spiritual journey and growth.
                                </Text>

                                <Text style={styles.sectionTitle}>3. User Accounts and Registration</Text>
                                <Text style={styles.paragraph}>
                                    To access certain features, you may need to create an account. You are responsible for:
                                </Text>
                                <Text style={styles.bulletPoint}>• Providing accurate and complete information</Text>
                                <Text style={styles.bulletPoint}>• Maintaining the security of your account credentials</Text>
                                <Text style={styles.bulletPoint}>• All activities that occur under your account</Text>
                                <Text style={styles.bulletPoint}>• Notifying us immediately of any unauthorized use</Text>

                                <Text style={styles.sectionTitle}>4. Acceptable Use Policy</Text>
                                <Text style={styles.paragraph}>
                                    You agree not to use the App to:
                                </Text>
                                <Text style={styles.bulletPoint}>• Post or share content that is offensive, harmful, or inappropriate</Text>
                                <Text style={styles.bulletPoint}>• Violate any applicable laws or regulations</Text>
                                <Text style={styles.bulletPoint}>• Infringe on intellectual property rights</Text>
                                <Text style={styles.bulletPoint}>• Transmit viruses or malicious code</Text>
                                <Text style={styles.bulletPoint}>• Attempt to gain unauthorized access to our systems</Text>
                                <Text style={styles.bulletPoint}>• Use the App for commercial purposes without permission</Text>

                                <Text style={styles.sectionTitle}>5. User-Generated Content</Text>
                                <Text style={styles.paragraph}>
                                    When you submit prayer requests or other content, you grant us a non-exclusive, royalty-free license to use, display, and distribute such content within the App. You retain ownership of your content and can request its removal at any time.
                                </Text>

                                <Text style={styles.sectionTitle}>6. Privacy and Data Protection</Text>
                                <Text style={styles.paragraph}>
                                    Your privacy is important to us. Our Privacy Policy, which is incorporated into these Terms, explains how we collect, use, and protect your information. By using the App, you consent to our privacy practices.
                                </Text>

                                <Text style={styles.sectionTitle}>7. Intellectual Property Rights</Text>
                                <Text style={styles.paragraph}>
                                    All content in the App, including text, graphics, logos, images, audio clips, and software, is owned by The Morning Amen or its licensors and is protected by copyright, trademark, and other intellectual property laws.
                                </Text>

                                <Text style={styles.sectionTitle}>8. Disclaimers and Limitations</Text>
                                <Text style={styles.paragraph}>
                                    The App is provided "as is" without warranties of any kind. We do not guarantee:
                                </Text>
                                <Text style={styles.bulletPoint}>• Uninterrupted or error-free service</Text>
                                <Text style={styles.bulletPoint}>• Accuracy or reliability of content</Text>
                                <Text style={styles.bulletPoint}>• Compatibility with all devices</Text>
                                <Text style={styles.bulletPoint}>• Security of data transmission</Text>

                                <Text style={styles.sectionTitle}>9. Limitation of Liability</Text>
                                <Text style={styles.paragraph}>
                                    To the maximum extent permitted by law, The Morning Amen shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or use, incurred by you or any third party.
                                </Text>

                                <Text style={styles.sectionTitle}>10. Termination</Text>
                                <Text style={styles.paragraph}>
                                    We may terminate or suspend your access to the App at any time, with or without cause or notice. Upon termination, your right to use the App will cease immediately.
                                </Text>

                                <Text style={styles.sectionTitle}>11. Updates and Changes</Text>
                                <Text style={styles.paragraph}>
                                    We reserve the right to modify these Terms at any time. We will notify users of material changes through the App or via email. Continued use after changes constitutes acceptance of the new Terms.
                                </Text>

                                <Text style={styles.sectionTitle}>12. Governing Law</Text>
                                <Text style={styles.paragraph}>
                                    These Terms are governed by and construed in accordance with the laws of [Your State/Country], without regard to conflict of law principles.
                                </Text>

                                <Text style={styles.sectionTitle}>13. Contact Information</Text>
                                <Text style={styles.paragraph}>
                                    If you have questions about these Terms, please contact us at:
                                </Text>
                                <Text style={styles.contactInfo}>
                                    Email: legal@themorningamen.com{'\n'}
                                    Address: [Your Business Address]{'\n'}
                                    Phone: [Your Phone Number]
                                </Text>

                                <Text style={styles.sectionTitle}>14. Severability</Text>
                                <Text style={styles.paragraph}>
                                    If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
                                </Text>

                                <Text style={styles.footer}>
                                    By using The Morning Amen, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                                </Text>
                            </View>
                        </ScrollView>
                    </BlurView>
                </Animated.View>
            </LinearGradient>
        </SafeAreaView>
    );
};

// Styles for the Terms and Conditions Screen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ff6b35',
    },
    
    gradientContainer: {
        flex: 1,
    },
    
    header: {
        paddingTop: Platform.OS === 'ios' ? 10 : 20,
        paddingBottom: 10,
        paddingHorizontal: 20,
    },
    
    headerBlur: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    backIcon: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    backArrow: {
        width: 12,
        height: 12,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#FFFFFF',
        transform: [{ rotate: '45deg' }],
    },
    
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    
    placeholder: {
        width: 40,
    },
    
    contentContainer: {
        flex: 1,
        marginHorizontal: 20,
        marginBottom: 20,
    },
    
    contentBlur: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    
    scrollView: {
        flex: 1,
    },
    
    scrollContent: {
        padding: 25,
        paddingBottom: 40,
    },
    
    content: {
        flex: 1,
    },
    
    lastUpdated: {
        fontSize: 14,
        fontStyle: 'italic',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 25,
        textAlign: 'center',
    },
    
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 25,
        marginBottom: 15,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 15,
        textAlign: 'justify',
    },
    
    bulletPoint: {
        fontSize: 16,
        lineHeight: 24,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 8,
        marginLeft: 15,
    },
    
    contactInfo: {
        fontSize: 16,
        lineHeight: 24,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 15,
        fontFamily: 'monospace',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 15,
        borderRadius: 10,
    },
    
    footer: {
        fontSize: 16,
        lineHeight: 24,
        color: '#FFFFFF',
        marginTop: 30,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: '600',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 20,
        borderRadius: 15,
    },
});