import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import PressableIcon from '@components/PressableIcon';
import { COLORS, LAYOUT, SHADOWS } from '@config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { usePizzaCreation } from '@features/menu-editor/contexts/PizzaCreationContext';
import { PIZZA_CATEGORIES } from '@features/menu-editor/data/categories';
import type { PizzaBase } from '@types';
import { useRouter } from 'expo-router';

export default function ChooseBaseScreen() {
  const { push, back } = useRouter();
  const { setBase } = usePizzaCreation();

  const handleSelect = (base: PizzaBase) => {
    setBase(base);
    push('/create-pizza/ingredients');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <PressableIcon
          type={'arrow-back'}
          onPress={() => back()}
          hitSlop={8}
          color={COLORS.textSecondary}
          containerStyle={styles.backButton}
          iconSize={22}></PressableIcon>

        <View style={styles.steps}>
          <View style={[styles.step, styles.stepDone]} />
          <View style={[styles.step, styles.stepActive]} />
          <View style={styles.step} />
          <View style={styles.step} />
        </View>
        <View style={styles.backButton} />
      </View>

      <Text style={styles.screenTitle}>Choisissez votre base</Text>
      <Text style={styles.screenSubtitle}>La base détermine le goût principal de votre pizza</Text>

      <View style={styles.options}>
        {PIZZA_CATEGORIES.map(category => (
          <Pressable
            key={category.base}
            style={[
              styles.option,
              { backgroundColor: category.cardBg, borderColor: category.cardBorder },
            ]}
            onPress={() => handleSelect(category.base)}>
            <Text style={styles.optionEmoji}>{category.emoji}</Text>
            <View style={styles.optionInfo}>
              <Text style={[styles.optionLabel, { color: category.badgeText }]}>
                {category.label}
              </Text>
              <Text style={styles.optionDesc}>{category.description}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={category.badgeText} />
          </Pressable>
        ))}
      </View>
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
    paddingTop: 52,
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
  options: {
    gap: 16,
    marginTop: 8,
  },
  option: {
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1.5,
  },
  optionEmoji: {
    fontSize: 44,
  },
  optionInfo: {
    flex: 1,
    gap: 4,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  optionDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
