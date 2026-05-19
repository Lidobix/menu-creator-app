import React, { memo, useRef, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import PressableIcon from '@components/PressableIcon';
import { COLORS, LAYOUT, SHADOWS } from '@config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useIngredients } from '@features/ingredients/contexts/IngredientsContext';
import { usePizzaCreation } from '@features/pizzaEditor/contexts/PizzaCreationContext';
import type { Ingredient } from '@types';
import { useRouter } from 'expo-router';

const MAX_DROPDOWN_ITEMS = 6;

interface DropdownRowProps {
  item: Ingredient;
  showBorder: boolean;
  onSelect: (item: Ingredient) => void;
}

const DropdownRow = memo(function DropdownRow({ item, showBorder, onSelect }: DropdownRowProps) {
  return (
    <Pressable
      style={[styles.dropdownItem, showBorder && styles.dropdownItemBorder]}
      onPress={() => onSelect(item)}>
      <View style={styles.dropdownItemContent}>
        <Text style={styles.dropdownItemName}>{item.name}</Text>
        <Text style={styles.dropdownItemCategory}>{item.category}</Text>
      </View>
      <MaterialIcons name="add" size={20} color={COLORS.primary} />
    </Pressable>
  );
});

export default function PizzaIngredientsScreen() {
  const { push, back } = useRouter();
  const { pizza, addIngredient, removeIngredient } = usePizzaCreation();
  const { allIngredients } = useIngredients();
  const [query, setQuery] = useState('');
  const inputRef = useRef<TextInput>(null);

  const filtered = query.trim()
    ? allIngredients
        .filter(
          ing =>
            ing.name.toLowerCase().includes(query.toLowerCase()) &&
            !pizza.ingredients.find(s => s.id === ing.id),
        )
        .slice(0, MAX_DROPDOWN_ITEMS)
    : [];

  const showDropdown = filtered.length > 0;

  const handleSelect = (ingredient: Ingredient) => {
    addIngredient(ingredient);
    setQuery('');
    inputRef.current?.focus();
  };

  const canValidate = pizza.ingredients.length > 0;

  return (
    <View style={styles.root}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <PressableIcon
            type={'arrow-back'}
            onPress={back}
            hitSlop={8}
            color={COLORS.textSecondary}
            containerStyle={styles.backButton}
            iconSize={22}></PressableIcon>

          <View style={styles.steps}>
            <View style={[styles.step, styles.stepDone]} />
            <View style={[styles.step, styles.stepDone]} />
            <View style={[styles.step, styles.stepActive]} />
            <View style={styles.step} />
          </View>
          <View style={styles.backButton} />
        </View>

        <Text style={styles.screenTitle}>Ingrédients</Text>
        <Text style={styles.screenSubtitle}>
          Recherchez et ajoutez les ingrédients de votre pizza
        </Text>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color={COLORS.textMuted} />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Rechercher un ingrédient..."
              placeholderTextColor={COLORS.textMuted}
              returnKeyType="search"
            />
            {query.length > 0 ? (
              <PressableIcon
                type={'close'}
                onPress={() => setQuery('')}
                hitSlop={8}
                color={COLORS.textMuted}
                iconSize={18}></PressableIcon>
            ) : null}
          </View>

          {showDropdown ? (
            <View style={styles.dropdown}>
              <FlatList
                data={filtered}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                renderItem={({ item, index }) => (
                  <DropdownRow
                    item={item}
                    showBorder={index < filtered.length - 1}
                    onSelect={handleSelect}
                  />
                )}
              />
            </View>
          ) : null}

          {query.trim().length > 0 && filtered.length === 0 ? (
            <View style={styles.noResult}>
              <Text style={styles.noResultText}>Aucun ingrédient trouvé pour "{query}"</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.selectedSection}>
          <Text style={styles.selectedTitle}>
            Ingrédients sélectionnés ({pizza.ingredients.length})
          </Text>
          {pizza.ingredients.length === 0 ? (
            <View style={styles.emptySelection}>
              <MaterialIcons name="info-outline" size={16} color={COLORS.textMuted} />
              <Text style={styles.emptySelectionText}>
                Aucun ingrédient sélectionné. Utilisez la barre de recherche ci-dessus.
              </Text>
            </View>
          ) : (
            <View style={styles.chips}>
              {pizza.ingredients.map(ing => (
                <View key={ing.id} style={styles.chip}>
                  <Text style={styles.chipText}>{ing.name}</Text>

                  <PressableIcon
                    type={'close'}
                    onPress={() => removeIngredient(ing.id)}
                    hitSlop={6}
                    color={COLORS.textSecondary}
                    iconSize={16}></PressableIcon>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.validateButton, !canValidate && styles.validateButtonDisabled]}
          onPress={() => push('/create-pizza/summary')}
          disabled={!canValidate}>
          <MaterialIcons name="check-circle" size={20} color={COLORS.surface} />
          <Text style={styles.validateButtonText}>Valider la pizza</Text>
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
  searchContainer: {
    gap: 0,
  },
  searchBar: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    padding: 0,
  },
  dropdown: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    boxShadow: SHADOWS.dropdown,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  dropdownItemContent: {
    flex: 1,
    gap: 2,
  },
  dropdownItemName: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  dropdownItemCategory: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  noResult: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 14,
    marginTop: 4,
  },
  noResultText: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  selectedSection: {
    gap: 12,
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptySelection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  emptySelectionText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
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
  validateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 17,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  validateButtonDisabled: {
    opacity: 0.4,
  },
  validateButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});
