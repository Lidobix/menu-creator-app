import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS, LAYOUT } from '@config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { PizzaCard } from '@features/menu-editor/components/PizzaCard';
import { usePizzaCreation } from '@features/menu-editor/contexts/PizzaCreationContext';
import { PIZZA_CATEGORIES } from '@features/menu-editor/data/categories';
import { useMenu } from '@features/menus/contexts/MenuContext';
import { Pizza } from '@types';
import { useRouter } from 'expo-router';

export default function MenuScreen() {
  const { menu, removePizza } = useMenu();
  const { loadForEdit } = usePizzaCreation();
  const { push } = useRouter();

  const handleEdit = (pizza: Pizza) => {
    if (typeof document !== 'undefined') {
      (document.activeElement as HTMLElement)?.blur();
    }
    loadForEdit(pizza);
    push('/create-pizza');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Le Menu</Text>
        <Text style={styles.subtitle}>
          {menu.length === 0
            ? "Aucune pizza pour l'instant"
            : `${menu.length} pizza${menu.length > 1 ? 's' : ''}`}
        </Text>
      </View>

      {PIZZA_CATEGORIES.map(category => {
        const pizzas = menu.filter(p => p.base === category.base);
        return (
          <View key={category.base} style={styles.category}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryEmoji}>{category.emoji}</Text>
              <Text style={styles.categoryLabel}>{category.label}</Text>
              <View style={[styles.countBadge, { backgroundColor: category.badgeBg }]}>
                <Text style={[styles.countBadgeText, { color: category.badgeText }]}>
                  {pizzas.length}
                </Text>
              </View>
            </View>

            {pizzas.length === 0 ? (
              <View style={styles.emptyCategory}>
                <MaterialIcons name="info-outline" size={15} color={COLORS.textMuted} />
                <Text style={styles.emptyCategoryText}>Aucune pizza dans cette catégorie</Text>
              </View>
            ) : (
              <View style={styles.list}>
                {pizzas.map(pizza => (
                  <PizzaCard
                    key={pizza.id}
                    pizza={pizza}
                    onDelete={() => removePizza(pizza.id)}
                    onEdit={() => handleEdit(pizza)}
                  />
                ))}
              </View>
            )}
          </View>
        );
      })}

      {menu.length === 0 && (
        <Pressable style={styles.createHint} onPress={() => push('/create-pizza')}>
          <MaterialIcons name="add-circle-outline" size={18} color={COLORS.primary} />
          <Text style={styles.createHintText}>Créer votre première pizza</Text>
        </Pressable>
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
    gap: 28,
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  category: {
    gap: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  countBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  list: {
    gap: 12,
  },
  emptyCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  emptyCategoryText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  createHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    alignSelf: 'center',
  },
  createHintText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
