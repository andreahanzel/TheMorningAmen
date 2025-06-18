// firebase.config.ts
import 'react-native-get-random-values';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, initializeAuth, Auth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = Platform.select({
  android: {
    apiKey: "AIzaSyC3oaP4WU6OSQb0IXisxnrnlGHhi2XsEVo",
    authDomain: "themorningamen-4d513.firebaseapp.com",
    projectId: "themorningamen-4d513",
    storageBucket: "themorningamen-4d513.firebasestorage.app",
    messagingSenderId: "776065000004",
    appId: "1:776065000004:android:55342c1fd5d428e48d5211"
  },
  default: {
    apiKey: "AIzaSyA28YsuHnIl1pA6NZPyStW9Q7miOATVdFs",
    authDomain: "themorningamen-4d513.firebaseapp.com",
    projectId: "themorningamen-4d513",
    storageBucket: "themorningamen-4d513.firebasestorage.app",
    messagingSenderId: "776065000004",
    appId: "1:776065000004:ios:f9d27c39188fc5228d5211"
  }
});

// Initialize Firebase App
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
console.log('Firebase app initialized for:', Platform.OS);

// Initialize Firestore
export const db: Firestore = getFirestore(app);

// Initialize Auth with proper error handling and explicit typing
let auth: Auth;

try {
  if (Platform.OS === 'web') {
    auth = getAuth(app);
    console.log('Web auth initialized');
  } else {
    // For React Native, always use initializeAuth
    auth = initializeAuth(app);

    
    console.log('Mobile auth initialized with AsyncStorage');
  }
} catch (error: any) {
  console.log('Auth init error:', error.code);
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
    console.log('Using existing auth instance');
  } else {
    throw error;
  }
}

// Export with explicit type
export { auth };

export const getAuthInstance = (): Auth => {
  if (!auth) {
    throw new Error('Firebase Auth is not available');
  }
  return auth;
};

export const testFirebaseConnection = async () => {
  try {
    console.log('Firebase Test - Platform:', Platform.OS);
    console.log('Firebase Test - Auth ready:', !!auth);

    return { 
      success: true, 
      projectId: app.options.projectId,
      platform: Platform.OS,
      authReady: !!auth
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
};