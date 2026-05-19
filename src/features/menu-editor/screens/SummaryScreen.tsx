import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import PressableIcon from '@components/PressableIcon';
import { COLORS, LAYOUT, SHADOWS } from '@config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { usePizzaCreation } from '@features/menu-editor/contexts/PizzaCreationContext';
import { useMenu } from '@features/menus/contexts/MenuContext';
import { useRouter } from 'expo-router';

export default function SummaryScreen() {
  const { back, navigate } = useRouter();
  const { pizza, resetPizza } = usePizzaCreation();
  const { addPizza, updatePizza } = useMenu();

  const isTomate = pizza.base === 'tomate';

  const handleSave = () => {
    if (!pizza.base) return;
    const data = {
      name: pizza.name,
      description: pizza.description || undefined,
      base: pizza.base,
      ingredients: pizza.ingredients,
    };
    if (pizza.editingId) {
      updatePizza(pizza.editingId, data);
    } else {
      addPizza(data);
    }
    resetPizza();
    navigate('/(tabs)/menu');
  };

  return (
    <View style={styles.root}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <PressableIcon
            type={'arrow-back'}
            onPress={back}
            hitSlop={8}
            color={COLORS.textMuted}
            iconSize={22}></PressableIcon>

          <View style={styles.steps}>
            <View style={[styles.step, styles.stepDone]} />
            <View style={[styles.step, styles.stepDone]} />
            <View style={[styles.step, styles.stepDone]} />
            <View style={[styles.step, styles.stepActive]} />
          </View>
          <View style={styles.backButton} />
        </View>

        <Text style={styles.screenTitle}>Récapitulatif</Text>
        <Text style={styles.screenSubtitle}>Vérifiez votre pizza avant de la sauvegarder</Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.pizzaName}>{pizza.name}</Text>
            <View style={[styles.baseBadge, isTomate ? styles.tomateBadge : styles.cremeBadge]}>
              <Text style={[styles.baseBadgeText, isTomate ? styles.tomateText : styles.cremeText]}>
                {isTomate ? '🍅' : '🥛'} Base {pizza.base}
              </Text>
            </View>
          </View>

          {pizza.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Description</Text>
              <Text style={styles.descriptionText}>{pizza.description}</Text>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Ingrédients ({pizza.ingredients.length})</Text>
            <View style={styles.chips}>
              {pizza.ingredients.map(ing => (
                <View key={ing.id} style={styles.chip}>
                  <Text style={styles.chipText}>{ing.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Pressable style={styles.PressableIcon} onPress={back}>
          <MaterialIcons name="edit" size={18} color={COLORS.primary} />
          <Text style={styles.PressableIconText}>Modifier les ingrédients</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <MaterialIcons name="check-circle" size={20} color={COLORS.surface} />
          <Text style={styles.saveButtonText}>Sauvegarder au Menu</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: LAYOUT.contentPadding,
    paddingTop: 52,
    paddingBottom: 16,
    maxWidth: LAYOUT.contentMaxWidth,
    width: '100%',
    alignSelf: 'center',
    gap: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: SHADOWS.sm,
  },
  steps: {
    flexDirection: 'row',
    gap: 6,
  },
  step: {
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.stepPending,
  },
  stepActive: {
    backgroundColor: COLORS.stepActive,
  },
  stepDone: {
    backgroundColor: COLORS.stepComplete,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: -8,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    gap: 20,
    boxShadow: SHADOWS.lg,
  },
  cardHeader: {
    gap: 10,
  },
  pizzaName: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  baseBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tomateBadge: {
    backgroundColor: COLORS.tomateBadgeBg,
  },
  cremeBadge: {
    backgroundColor: COLORS.cremeBadgeBg,
  },
  baseBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tomateText: {
    color: COLORS.tomateBadgeText,
  },
  cremeText: {
    color: COLORS.cremeBadgeText,
  },
  section: {
    gap: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: COLORS.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  PressableIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
  },
  PressableIconText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    maxWidth: LAYOUT.contentMaxWidth,
    width: '100%',
    alignSelf: 'center',
  },
  saveButton: {
    backgroundColor: COLORS.success,
    borderRadius: 16,
    paddingVertical: 17,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});
