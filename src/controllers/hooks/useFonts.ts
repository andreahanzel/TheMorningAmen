// src\controllers\hooks\useFonts.ts
// This file defines a custom hook to load and manage fonts in the app.

import { useFonts } from 'expo-font';
import {
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_900Black,
    } from '@expo-google-fonts/outfit';

    import {
    NunitoSans_300Light,
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    } from '@expo-google-fonts/nunito-sans';

    import {
    LibreBaskerville_400Regular,
    LibreBaskerville_400Regular_Italic,
    LibreBaskerville_700Bold,
    } from '@expo-google-fonts/libre-baskerville';

    export const useAppFonts = () => {
    const [fontsLoaded] = useFonts({
        Outfit_300Light,
        Outfit_400Regular,
        Outfit_600SemiBold,
        Outfit_700Bold,
        Outfit_900Black,
        NunitoSans_300Light,
        NunitoSans_400Regular,
        NunitoSans_600SemiBold,
        NunitoSans_700Bold,
        LibreBaskerville_400Regular,
        LibreBaskerville_400Regular_Italic,
        LibreBaskerville_700Bold,
    });

    return { fontsLoaded };
};