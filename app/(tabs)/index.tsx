import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS, LAYOUT, SHADOWS } from '@config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useMenu } from '@features/menus/contexts/MenuContext';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { push, navigate } = useRouter();
  const { menu } = useMenu();

  const handleCreatePizza = () => {
    if (typeof document !== 'undefined') {
      (document.activeElement as HTMLElement)?.blur();
    }
    push('/create-pizza');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🍕</Text>
        <Text style={styles.heroTitle}>Menu Creator</Text>
        <Text style={styles.heroSubtitle}>Créez et gérez le menu de votre pizzeria</Text>
      </View>

      <Pressable style={styles.createButton} onPress={handleCreatePizza}>
        <MaterialIcons name="add-circle" size={22} color="#fff" />
        <Text style={styles.createButtonText}>Créer une pizza</Text>
      </Pressable>

      <Pressable style={styles.menuCard} onPress={() => navigate('/(tabs)/menu')}>
        <View>
          <Text style={styles.menuCardCount}>{menu.length}</Text>
          <Text style={styles.menuCardLabel}>
            {menu.length === 0
              ? 'Aucune pizza au menu'
              : menu.length === 1
                ? 'Pizza au menu'
                : 'Pizzas au menu'}
          </Text>
        </View>
        <View style={styles.menuCardLink}>
          <Text style={styles.menuCardLinkText}>Voir le menu</Text>
          <MaterialIcons name="chevron-right" size={20} color={COLORS.primary} />
        </View>
      </Pressable>

      {menu.length === 0 && (
        <View style={styles.tip}>
          <MaterialIcons name="lightbulb-outline" size={18} color={COLORS.warning} />
          <Text style={styles.tipText}>
            Commencez par créer votre première pizza en cliquant sur le bouton ci-dessus !
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: LAYOUT.contentPadding,
    paddingTop: 56,
    maxWidth: LAYOUT.contentMaxWidth,
    width: '100%',
    alignSelf: 'center',
    gap: 20,
  },
  hero: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    boxShadow: SHADOWS.primaryBtn,
  },
  createButtonText: {
    color: COLORS.surface,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  menuCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: SHADOWS.md,
  },
  menuCardCount: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.primary,
    lineHeight: 40,
  },
  menuCardLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  menuCardLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  menuCardLinkText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  tip: {
    backgroundColor: COLORS.warningBg,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warningBorder,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.warningText,
    lineHeight: 20,
  },
});
