import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, LAYOUT } from '@config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { CategoryDropdown } from '@ingredients/components/CategoryDropdown';
import IngredientModalEditor from '@ingredients/components/IngredientModalEditor';
import IngredientsList from '@ingredients/components/IngredientsList';
import { useIngredients } from '@ingredients/contexts/IngredientsContext';
import { CATEGORIES, DEFAULT_CAT_EMOJI } from '@ingredients/data/categories';

export default function IngredientsScreen() {
  const { categoryMap, categoryNames, allIngredients } = useIngredients();

  const [selectedCategory, setSelectedCategory] = useState<string>(() => categoryNames[0] ?? '');
  const [modalOpen, setModalOpen] = useState(false);

  const dropdownData = categoryNames.map((cat, idx) => ({
    value: cat,
    label: cat,
    emoji: CATEGORIES.find(c => c.label === cat)?.emoji ?? DEFAULT_CAT_EMOJI,
    count: (categoryMap[cat] ?? []).length,
    isLast: idx === categoryNames.length - 1,
  }));

  const toggleModal = useCallback(() => setModalOpen(prev => !prev), []);

  return (
    <View style={styles.root}>
      <View style={styles.headerArea}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Ingrédients</Text>
          <Text style={styles.subtitle}>{allIngredients.length} au total</Text>
        </View>

        <View style={styles.selectorRow}>
          <CategoryDropdown
            data={dropdownData}
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
          <Pressable style={styles.addButton} onPress={toggleModal} hitSlop={8}>
            <MaterialIcons name="add" size={18} color={COLORS.primary} />
            <Text style={styles.addButtonText}>Ajouter</Text>
          </Pressable>
        </View>
      </View>

      <IngredientsList selectedCategory={selectedCategory} openModal={toggleModal} />

      <IngredientModalEditor
        modalOpen={modalOpen}
        toggleModal={toggleModal}
        selectedCategory={selectedCategory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerArea: {
    paddingTop: 56,
    paddingHorizontal: LAYOUT.contentPadding,
    paddingBottom: 16,
    maxWidth: LAYOUT.contentMaxWidth,
    width: '100%',
    alignSelf: 'center',
    gap: 16,
  },
  headerTop: {
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
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
