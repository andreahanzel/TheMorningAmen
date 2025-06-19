# The Morning Amen - Module 3: Cloud Database Implementation

## This project is protected by a custom license. See `LICENSE.txt` for details

## This project is licensed under a custom copyright license. Unauthorized reuse strictly prohibited

## © 2025 Andrea Toreki. All rights reserved. This app and its source code were developed as part of a private academic project for BYU–Idaho (CSE 310)  

**Not for commercial reuse, redistribution, or modification without written permission.**

![License: Custom](https://img.shields.io/badge/license-Custom-blue)

## Overview  - Module 3

The purpose of this phase of development was to deepen my understanding of cloud-based architectures and implement real-time, scalable functionality using Firebase. The Morning Amen has evolved from a local mobile app into a robust, cloud-connected spiritual platform capable of supporting dynamic user interaction, data synchronization across devices, and secure user authentication.

I developed a full cloud backend using Google Firebase, including Firestore for structured data storage, Firebase Authentication for multi-provider sign-in, and Firebase Cloud Messaging for push notifications. The app now features real-time prayer updates, favorites sync, multi-collection architecture, and intelligent notification workflows.

This implementation showcases my progression toward building enterprise-level mobile solutions that emphasize maintainability, type safety, cross-platform consistency, and a refined user experience.

[Software Demo Video](http://youtube.link.goes.here)

## Cloud Database

This application uses Google Firebase as its cloud platform. The primary database used is **Cloud Firestore**, structured with eight production collections:

- `users`: Stores each user's metadata, profile details, authentication identifiers, notification preferences, and cloud-linked favorites.
- `devotions`: Daily devotional content with topic tags, reading estimates, and sharing options.
- `prayerRequests`: Community-based prayer requests with interaction tracking.
- `verses`: Thematic scripture records with reflection notes.
- `videos`: A library of inspirational content with viewing history.
- `affirmations`: Short daily encouragement entries.
- `userFavorites`: Tracks saved content from multiple types (devotions, verses, videos).
- `test`: A sandbox collection for schema and performance testing.

All collections are managed through a service layer that abstracts Firestore operations, ensuring scalable, reusable code with proper TypeScript typing and error handling. Security rules in Firebase restrict access to authenticated users, with strict validation ensuring data integrity.

## Development Environment - Module 3

### Tools and Platforms

- Visual Studio Code
- Expo CLI and Expo Go
- Firebase Console
- Android Studio for emulator testing
- Git and GitHub for version control

### Languages and Libraries

- TypeScript
- React Native with Expo SDK 53
- Firebase SDK (Authentication, Firestore, Cloud Messaging)
- React Navigation
- AsyncStorage
- Expo modules for permissions, notifications, blur effects, and fonts
- React Context with Reducers for global state management

## Useful Cloud & Firebase Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Firebase Firestore Rules](https://firebase.google.com/docs/rules)
- [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/)

## Future Work

- Implement Apple Sign-In as an additional auth method
- Add journaling with secure cloud sync
- Expand admin control to upload and manage devotional content
- Integrate offline-first features for remote access
- Build streak tracking and personal analytics
- Develop in-app group discussions for shared prayers
- Refactor some logic into modular microservices
- Polish tablet UI and improve accessibility features

---

## The Morning Amen - Mobile Devotional App (Module 2)

## OVERVIEW - Module 2

As a software engineer passionate about both technology and faith, I created The Morning Amen to bridge the gap between spiritual growth and modern mobile technology. This React Native application serves as a daily companion for people seeking to strengthen their relationship with God through structured devotionals, inspirational videos, and community prayer support.

The Morning Amen is a cross-platform mobile app built with React Native and Expo, featuring a beautiful user interface inspired by sunrise gradients and peaceful morning aesthetics. The app provides users with daily devotional content, video messages, Bible verses, prayer submission capabilities, and an about section sharing the heart behind the ministry.

To run the development server on the computer:

1. Clone the repository from GitHub
2. Navigate to the project directory
3. Run `npm install` to install dependencies
4. Run `npx expo start` to start the development server
5. Use the Expo Go app on a mobile device to scan the QR code, or press 'i' for iOS simulator or 'a' for Android emulator

My purpose for writing this software was to deepen my understanding of React Native development while creating something meaningful that could impact people's spiritual lives. This project allowed me to explore mobile-specific features like AsyncStorage for data persistence, gesture handling for intuitive navigation, and creating responsive designs that work beautifully across different screen sizes.

[Software Demo Video](https://youtu.be/7sJDiy9GjiU)

## Mobile App Features

### Home Screen

The main dashboard welcomes users with a personalized greeting and provides quick access to all app features. Dynamic cards showcase today's featured devotion, prayer wall preview, and navigation to various sections. The screen includes animated floating particles, a beautiful gradient background, and smooth card animations that respond to user interactions.

### Devotions Screen & Detail View

The devotions feed displays a scrollable list of inspirational devotional entries, each presented in beautiful gradient cards with categories, reading time estimates, and favorite toggles. Users can tap any devotion to open a full-screen reading experience with the complete text, embedded Bible verses, reflection questions, and sharing capabilities. The detail view includes reading progress tracking and action buttons for journaling and sharing.

### Video Gallery

A grid-based video gallery showcases inspirational video messages with thumbnail previews, duration badges, and category filtering. Each video card includes play buttons that launch the video content, and users can mark videos as favorites. The interface uses dynamic color gradients based on video categories and includes smooth scroll animations.

### Verse of the Day

An interactive screen presenting daily Bible verses with swipe gestures for navigation between different verses. Each verse includes the biblical text, theme categorization, reflection prompts, and practical application suggestions. The interface supports touch interactions for expanding reflection content and sharing verses with others.

### Prayer Wall

A community-focused feature allowing users to submit prayer requests anonymously or with their name. The prayer wall displays submitted prayers in beautiful cards with category badges, submission dates, and "pray for this" counters. Users can add new prayers through a modal form with category selection and privacy options.

### About Screen

A personal story section sharing the heart and vision behind The Morning Amen app, including the developer's testimony, app mission, upcoming features, and contact information. The screen uses elegant typography and animated elements to create an engaging narrative experience.

All screens transition smoothly using React Navigation with custom animations, maintaining visual continuity through consistent design language and the signature orange-to-gold gradient theme throughout the app.

## Development Environment

### Development Tools

- Visual Studio Code with React Native extensions
- Expo CLI for project management and testing
- Expo Go mobile app for device testing
- Git and GitHub for version control
- npm for package management

### Programming Language & Framework

- TypeScript (primary language for type safety and better development experience)
- React Native with Expo SDK for cross-platform mobile development
- React Navigation for screen navigation and routing
- Expo LinearGradient for beautiful gradient backgrounds
- Expo Blur for glassmorphism effects
- AsyncStorage for local data persistence
- React Native Gesture Handler for touch interactions

### Key Libraries

- `@react-navigation/native` and `@react-navigation/bottom-tabs` for navigation
- `expo-linear-gradient` for gradient backgrounds
- `expo-blur` for blur effects
- `@react-native-async-storage/async-storage` for data persistence
- `expo-font` for custom typography
- `react-native-safe-area-context` for proper screen layout

## Useful Websites

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Documentation](https://reactnavigation.org/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Expo SDK Reference](https://docs.expo.dev/versions/latest/)
- [React Native AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Google Fonts for React Native](https://docs.expo.dev/guides/using-custom-fonts/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)

## Planned Features

- User Authentication: Implement secure login/signup with social media integration (Google, Apple)
- Cloud Synchronization: Add Firebase backend for syncing favorites and prayer requests across devices
- Push Notifications: Daily devotion reminders and prayer request notifications
- Offline Mode: Cache content for reading without internet connection
- Social Features: User profiles, prayer groups, and sharing devotions with friends
- Advanced Search: Search functionality across devotions, verses, and prayers
- Audio Integration: Add audio recordings of devotions and background music
- Personalization: Customizable themes, font sizes, and reading preferences
- Analytics Dashboard: Track reading streaks, favorite categories, and spiritual growth metrics
- Content Management: Admin panel for adding new devotions and managing community content
