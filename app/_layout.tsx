import 'react-native-reanimated';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@src/hooks/use-color-scheme';
import { Href, Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Configuration pour forcer le groupe (tabs) comme route initiale
export const unstable_settings = {
  initialRouteName: '(tabs)',
};

/**
 * Composant pour l'affichage Desktop (Sidebar + Contenu)
 */
const DesktopLayout = () => {
  const router = useRouter();

  // Fonction de navigation typée pour Expo Router
  const navigateTo = (path: Href) => {
    router.push(path);
  };

  return (
    <View style={styles.desktopContainer}>
      {/* SIDEBAR GAUCHE */}
      <View style={styles.sidebar}>
        <Text style={styles.logo}>Mon MVP</Text>

        <View style={styles.navContainer}>
          <Pressable onPress={() => navigateTo('/(tabs)')} style={styles.navItem}>
            <Text style={styles.navText}>🏠 Accueil</Text>
          </Pressable>

          <Pressable onPress={() => navigateTo('/(tabs)/editor')} style={styles.navItem}>
            <Text style={styles.navText}>🖊️ Editer</Text>
          </Pressable>
          <Pressable onPress={() => navigateTo('/(tabs)/menus')} style={styles.navItem}>
            <Text style={styles.navText}>📜 Menus</Text>
          </Pressable>
          <Pressable onPress={() => navigateTo('/(tabs)/ingredients')} style={styles.navItem}>
            <Text style={styles.navText}>🍅 Ingrédients</Text>
          </Pressable>

          {/* Bouton pour ouvrir la modal */}
          <Pressable
            onPress={() => navigateTo('/modal')}
            style={[styles.navItem, styles.modalButton]}>
            <Text style={[styles.navText, { color: '#fff' }]}>✨ Action Modal</Text>
          </Pressable>
        </View>
      </View>

      {/* ZONE DE CONTENU DROITE */}
      <View style={styles.mainContent}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
};

/**
 * Composant pour l'affichage Mobile (Navigation standard)
 */
const MobileStackNavigator = () => (
  <Stack>
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    <Stack.Screen
      name="modal"
      options={{
        presentation: 'modal',
        title: 'Ma Modal',
      }}
    />
  </Stack>
);

/**
 * COMPOSANT ROOT PRINCIPAL
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { width, height } = useWindowDimensions();

  // On active le mode desktop uniquement sur Web ET si l'écran est large
  const isDesktop = Platform.OS === 'web' && width > 768;
  const isLandscapeMobile = Platform.OS === 'web' && width > height && width < 1024;
  if (isLandscapeMobile) {
    return (
      <View style={styles.rotateOverlay}>
        <Text style={styles.rotateText}>🔄</Text>
        <Text style={styles.rotateText}>Merci de retourner votre téléphone verticalement</Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>{isDesktop ? <DesktopLayout /> : <MobileStackNavigator />}</View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  // Mise en page globale Desktop
  rotateOverlay: {
    backgroundColor: '#1c31f1',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  rotateText: { fontSize: 40, color: 'white', textAlign: 'center' },
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  sidebar: {
    width: 280,
    backgroundColor: '#f8f9fa',
    borderRightWidth: 1,
    borderRightColor: '#e5e5e5',
    padding: 24,
  },
  navContainer: {
    flexDirection: 'column',
    minWidth: '100%',
    gap: 4, // Espacement entre les items (supporté par RN Web)
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },

  // Design des éléments
  logo: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 40,
    color: '#007AFF',
  },
  navItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  navText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  modalButton: {
    backgroundColor: '#007AFF',
    marginTop: 20,
    borderColor: '#0056b3',
  },
});
