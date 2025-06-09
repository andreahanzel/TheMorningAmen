// src/views/screens/legal/PrivacyPolicyScreen.tsx
// Privacy Policy Screen 
// This screen displays the complete privacy policy for users
// of the app, with a focus on readability and user experience.

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

interface PrivacyPolicyScreenProps {
    navigation: any;
}

// PrivacyPolicyScreen component
export const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    // Start animations when the component mounts
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

    // Render the Privacy Policy screen
    // This screen includes a header with a back button and a scrollable content area
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
                            <Text style={styles.headerTitle}>Privacy Policy</Text>
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
                                
                                <Text style={styles.intro}>
                                    At The Morning Amen, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, share, and safeguard your information when you use our mobile application.
                                </Text>

                                <Text style={styles.sectionTitle}>1. Information We Collect</Text>
                                
                                <Text style={styles.subSectionTitle}>Personal Information</Text>
                                <Text style={styles.paragraph}>
                                    When you create an account or use our services, we may collect:
                                </Text>
                                <Text style={styles.bulletPoint}>• Name and email address</Text>
                                <Text style={styles.bulletPoint}>• Account credentials (encrypted passwords)</Text>
                                <Text style={styles.bulletPoint}>• Profile information you choose to provide</Text>
                                <Text style={styles.bulletPoint}>• Prayer requests and spiritual content you submit</Text>

                                <Text style={styles.subSectionTitle}>Usage Data</Text>
                                <Text style={styles.paragraph}>
                                    We automatically collect information about how you interact with our App:
                                </Text>
                                <Text style={styles.bulletPoint}>• App usage patterns and features accessed</Text>
                                <Text style={styles.bulletPoint}>• Device information (type, operating system, unique identifiers)</Text>
                                <Text style={styles.bulletPoint}>• Log data (IP address, access times, app crashes)</Text>
                                <Text style={styles.bulletPoint}>• Analytics data to improve user experience</Text>

                                <Text style={styles.subSectionTitle}>Location Information</Text>
                                <Text style={styles.paragraph}>
                                    With your permission, we may collect location data to provide location-based features such as finding local churches or spiritual events.
                                </Text>

                                <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
                                <Text style={styles.paragraph}>
                                    We use your information to:
                                </Text>
                                <Text style={styles.bulletPoint}>• Provide and maintain our services</Text>
                                <Text style={styles.bulletPoint}>• Personalize your spiritual journey experience</Text>
                                <Text style={styles.bulletPoint}>• Send daily devotionals and spiritual content</Text>
                                <Text style={styles.bulletPoint}>• Respond to your inquiries and support requests</Text>
                                <Text style={styles.bulletPoint}>• Improve our App's functionality and features</Text>
                                <Text style={styles.bulletPoint}>• Ensure security and prevent fraud</Text>
                                <Text style={styles.bulletPoint}>• Comply with legal obligations</Text>

                                <Text style={styles.sectionTitle}>3. Information Sharing and Disclosure</Text>
                                <Text style={styles.paragraph}>
                                    We do not sell, trade, or rent your personal information. We may share information only in these circumstances:
                                </Text>
                                <Text style={styles.bulletPoint}>• With your explicit consent</Text>
                                <Text style={styles.bulletPoint}>• To comply with legal requirements or court orders</Text>
                                <Text style={styles.bulletPoint}>• To protect our rights, property, or safety</Text>
                                <Text style={styles.bulletPoint}>• With trusted service providers who assist our operations (under strict confidentiality agreements)</Text>
                                <Text style={styles.bulletPoint}>• In connection with a business transfer or merger</Text>

                                <Text style={styles.sectionTitle}>4. Data Security</Text>
                                <Text style={styles.paragraph}>
                                    We implement robust security measures to protect your information:
                                </Text>
                                <Text style={styles.bulletPoint}>• Encryption of data in transit and at rest</Text>
                                <Text style={styles.bulletPoint}>• Secure servers with regular security updates</Text>
                                <Text style={styles.bulletPoint}>• Access controls and authentication requirements</Text>
                                <Text style={styles.bulletPoint}>• Regular security audits and monitoring</Text>
                                <Text style={styles.bulletPoint}>• Employee training on privacy and security practices</Text>

                                <Text style={styles.sectionTitle}>5. Data Retention</Text>
                                <Text style={styles.paragraph}>
                                    We retain your information only as long as necessary to provide our services and fulfill the purposes outlined in this policy. When you delete your account, we will delete your personal information within 30 days, except where retention is required by law.
                                </Text>

                                <Text style={styles.sectionTitle}>6. Your Privacy Rights</Text>
                                <Text style={styles.paragraph}>
                                    You have the right to:
                                </Text>
                                <Text style={styles.bulletPoint}>• Access and review your personal information</Text>
                                <Text style={styles.bulletPoint}>• Correct inaccurate or incomplete data</Text>
                                <Text style={styles.bulletPoint}>• Delete your account and personal information</Text>
                                <Text style={styles.bulletPoint}>• Opt-out of marketing communications</Text>
                                <Text style={styles.bulletPoint}>• Request data portability</Text>
                                <Text style={styles.bulletPoint}>• Object to processing of your information</Text>

                                <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
                                <Text style={styles.paragraph}>
                                    Our App is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we discover that we have collected information from a child under 13, we will delete it immediately.
                                </Text>

                                <Text style={styles.sectionTitle}>8. Third-Party Services</Text>
                                <Text style={styles.paragraph}>
                                    Our App may contain links to third-party websites or integrate with third-party services. This Privacy Policy does not apply to these external services. We encourage you to review their privacy policies before providing any information.
                                </Text>

                                <Text style={styles.sectionTitle}>9. International Data Transfers</Text>
                                <Text style={styles.paragraph}>
                                    If you are located outside [Your Country], your information may be transferred to and processed in [Your Country]. We ensure appropriate safeguards are in place to protect your information during international transfers.
                                </Text>

                                <Text style={styles.sectionTitle}>10. Cookies and Tracking Technologies</Text>
                                <Text style={styles.paragraph}>
                                    We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your device preferences.
                                </Text>

                                <Text style={styles.sectionTitle}>11. Changes to This Privacy Policy</Text>
                                <Text style={styles.paragraph}>
                                    We may update this Privacy Policy periodically. We will notify you of material changes through the App or via email. Your continued use of the App after changes constitutes acceptance of the updated policy.
                                </Text>

                                <Text style={styles.sectionTitle}>12. Contact Us</Text>
                                <Text style={styles.paragraph}>
                                    If you have questions about this Privacy Policy or our privacy practices, please contact us:
                                </Text>
                                <Text style={styles.contactInfo}>
                                    Email: privacy@themorningamen.com{'\n'}
                                    Address: [Your Business Address]{'\n'}
                                    Phone: [Your Phone Number]{'\n'}
                                    Data Protection Officer: [DPO Email]
                                </Text>

                                <Text style={styles.sectionTitle}>13. State-Specific Rights</Text>
                                <Text style={styles.paragraph}>
                                    If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA). If you are an EU resident, you have rights under the General Data Protection Regulation (GDPR). Please contact us to exercise these rights.
                                </Text>

                                <Text style={styles.footer}>
                                    Your privacy is fundamental to our mission of providing a safe, secure spiritual community. We are committed to transparency and protecting your personal information while you grow in your faith journey.
                                </Text>
                            </View>
                        </ScrollView>
                    </BlurView>
                </Animated.View>
            </LinearGradient>
        </SafeAreaView>
    );
};

// Styles for the Privacy Policy screen
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
        marginBottom: 20,
        textAlign: 'center',
    },
    
    intro: {
        fontSize: 16,
        lineHeight: 24,
        color: '#FFFFFF',
        marginBottom: 25,
        textAlign: 'center',
        fontWeight: '500',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 20,
        borderRadius: 15,
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
    
    subSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginTop: 15,
        marginBottom: 10,
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