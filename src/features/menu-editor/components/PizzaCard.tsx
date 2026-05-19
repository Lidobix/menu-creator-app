import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, SHADOWS } from '@config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { Pizza } from '../types';

interface PizzaCardProps {
  pizza: Pizza;
  onDelete: () => void;
  onEdit: () => void;
}

export const PizzaCard = memo(function PizzaCard({ pizza, onDelete, onEdit }: PizzaCardProps) {
  const isTomate = pizza.base === 'tomate';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{pizza.name}</Text>
          <View style={[styles.baseBadge, isTomate ? styles.tomateBadge : styles.cremeBadge]}>
            <Text style={[styles.baseBadgeText, isTomate ? styles.tomateText : styles.cremeText]}>
              Base {pizza.base}
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={onEdit} hitSlop={8}>
            <MaterialIcons name="edit" size={20} color={COLORS.textMuted} />
          </Pressable>
          <Pressable style={styles.actionButton} onPress={onDelete} hitSlop={8}>
            <MaterialIcons name="delete-outline" size={20} color={COLORS.textMuted} />
          </Pressable>
        </View>
      </View>

      {pizza.description ? <Text style={styles.description}>{pizza.description}</Text> : null}

      <View style={styles.ingredientsSection}>
        <Text style={styles.ingredientsLabel}>
          {pizza.ingredients.length} ingrédient{pizza.ingredients.length !== 1 ? 's' : ''}
        </Text>
        <View style={styles.ingredientsList}>
          {pizza.ingredients.map(ing => (
            <View key={ing.id} style={styles.ingredientChip}>
              <Text style={styles.ingredientChipText}>{ing.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    boxShadow: SHADOWS.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerLeft: {
    flex: 1,
    gap: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  baseBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  tomateBadge: {
    backgroundColor: COLORS.tomateBadgeBg,
  },
  cremeBadge: {
    backgroundColor: COLORS.cremeBadgeBg,
  },
  baseBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  tomateText: {
    color: COLORS.tomateBadgeText,
  },
  cremeText: {
    color: COLORS.cremeBadgeText,
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  ingredientsSection: {
    gap: 8,
  },
  ingredientsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  ingredientChip: {
    backgroundColor: COLORS.borderLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  ingredientChipText: {
    fontSize: 13,
    color: COLORS.textPrimary,
  },
});
