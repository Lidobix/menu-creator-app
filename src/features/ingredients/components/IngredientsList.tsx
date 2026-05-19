import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { COLORS, LAYOUT } from '@config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import IngredientRow from '@ingredients/components/IngredientRow';
import { useIngredients } from '@ingredients/contexts/IngredientsContext';
import { CATEGORY_META, DEFAULT_META } from '@ingredients/data/categories';
import { Ingredient } from '@types';

interface EmptyListProps {
  icon: string;
  openModal: () => void;
}

interface IngredientsListProps {
  selectedCategory: string;
  openModal: () => void;
}

const EmptyList = ({ icon, openModal }: EmptyListProps) => {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>{icon}</Text>
      <Text style={styles.emptyText}>Aucun ingrédient dans cette catégorie</Text>
      <Pressable style={styles.emptyAdd} onPress={openModal}>
        <MaterialIcons name="add-circle-outline" size={16} color={COLORS.primary} />
        <Text style={styles.emptyAddText}>Ajouter un ingrédient</Text>
      </Pressable>
    </View>
  );
};

const IngredientsList = ({ selectedCategory, openModal }: IngredientsListProps) => {
  const { removeIngredient, updateIngredient, categoryMap } = useIngredients();

  const [rowEditId, setRowEditId] = useState<string | null>(null);
  const [rowEditName, setRowEditName] = useState('');
  const activeMeta = CATEGORY_META[selectedCategory] ?? DEFAULT_META;

  const handleStartRowEdit = (ing: Ingredient) => {
    setRowEditId(ing.id);
    setRowEditName(ing.name);
  };

  const handleConfirmRowEdit = () => {
    if (!rowEditName.trim() || !rowEditId) return;
    updateIngredient(selectedCategory, rowEditId, rowEditName.trim());
    setRowEditId(null);
  };
  const activeIngredients = categoryMap[selectedCategory] ?? [];

  return (
    <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
      {activeIngredients.length === 0 ? (
        <EmptyList icon={activeMeta.emoji} openModal={openModal}></EmptyList>
      ) : (
        activeIngredients.map(ing => (
          <IngredientRow
            key={ing.id}
            ingredient={ing}
            isEditing={rowEditId === ing.id}
            editName={rowEditName}
            onStartEdit={() => handleStartRowEdit(ing)}
            onEditChange={setRowEditName}
            onConfirmEdit={handleConfirmRowEdit}
            onCancelEdit={() => setRowEditId(null)}
            onDelete={() => removeIngredient(selectedCategory, ing.id)}
          />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  listContent: {
    maxWidth: LAYOUT.contentMaxWidth,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 56,
    paddingHorizontal: LAYOUT.contentPadding,
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
  },
  emptyAddText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default IngredientsList;
