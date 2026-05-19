import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { BREAKPOINTS, COLORS, LAYOUT } from '@config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs, useRouter, useSegments } from 'expo-router';

const DESKTOP_MQL = `(min-width: ${BREAKPOINTS.desktop}px)`;

function subscribeMediaQuery(callback: () => void): () => void {
  const mql = window.matchMedia(DESKTOP_MQL);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

function useIsDesktop(): boolean {
  return useSyncExternalStore(
    subscribeMediaQuery,
    () => window.matchMedia(DESKTOP_MQL).matches,
    () => false,
  );
}

type NavItem = {
  route: string;
  label: string;
  icon: keyof (typeof MaterialIcons)['glyphMap'];
  segment: string;
};

const NAV_ITEMS: NavItem[] = [
  { route: '/(tabs)/', label: 'Accueil', icon: 'home', segment: 'index' },
  { route: '/(tabs)/menu', label: 'Le Menu', icon: 'menu-book', segment: 'menu' },
  {
    route: '/(tabs)/ingredients',
    label: 'Ingrédients',
    icon: 'restaurant-menu',
    segment: 'ingredients',
  },
];

function DesktopSidebar() {
  const { navigate } = useRouter();
  const segments = useSegments();
  const activeSegment = segments[1];

  return (
    <View style={styles.sidebar}>
      <View style={styles.sidebarHeader}>
        <Text style={styles.sidebarEmoji}>🍕</Text>
        <Text style={styles.sidebarTitle}>Menu Creator</Text>
        <Text style={styles.sidebarSubtitle}>Votre pizzeria</Text>
      </View>
      <View style={styles.sidebarNav}>
        {NAV_ITEMS.map(item => {
          const isActive = activeSegment === item.segment;
          return (
            <Pressable
              key={item.route}
              style={[styles.navButton, isActive && styles.navButtonActive]}
              onPress={() => navigate(item.route as Parameters<typeof navigate>[0])}>
              <MaterialIcons
                name={item.icon}
                size={20}
                color={isActive ? COLORS.sidebarText : COLORS.sidebarTextMuted}
              />
              <Text style={[styles.navButtonText, isActive && styles.navButtonTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function Loader() {
  return (
    <View style={styles.loader}>
      <Text style={styles.loaderEmoji}>🍕</Text>
      <ActivityIndicator color={COLORS.primary} size="small" style={styles.loaderSpinner} />
    </View>
  );
}

export default function TabLayout() {
  const isDesktop = useIsDesktop();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!mounted) return <Loader />;

  return (
    <View style={styles.root}>
      {isDesktop && <DesktopSidebar />}
      <View style={styles.content}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.tabBarInactive,
            tabBarStyle: isDesktop ? { display: 'none' } : styles.tabBar,
            tabBarLabelStyle: styles.tabBarLabel,
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Accueil',
              tabBarIcon: ({ color }) => <MaterialIcons name="home" size={26} color={color} />,
            }}
          />
          <Tabs.Screen
            name="menu"
            options={{
              title: 'Le Menu',
              tabBarIcon: ({ color }) => <MaterialIcons name="menu-book" size={26} color={color} />,
            }}
          />
          <Tabs.Screen
            name="ingredients"
            options={{
              title: 'Ingrédients',
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="restaurant-menu" size={26} color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loaderEmoji: {
    fontSize: 56,
  },
  loaderSpinner: {
    marginTop: 4,
  },
  root: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: LAYOUT.sidebarWidth,
    backgroundColor: COLORS.sidebarBg,
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sidebarHeader: {
    alignItems: 'center',
    marginBottom: 40,
    gap: 4,
  },
  sidebarEmoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  sidebarTitle: {
    color: COLORS.sidebarText,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sidebarSubtitle: {
    color: COLORS.sidebarTextInactive,
    fontSize: 12,
  },
  sidebarNav: {
    gap: 4,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  navButtonActive: {
    backgroundColor: COLORS.primary,
  },
  navButtonText: {
    color: COLORS.sidebarTextMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  navButtonTextActive: {
    color: COLORS.sidebarText,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: COLORS.tabBarBg,
    borderTopColor: COLORS.borderLight,
    borderTopWidth: 1,
    height: LAYOUT.tabBarHeight,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
