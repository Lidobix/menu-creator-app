import { useRef } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { StyleSheet } from 'react-native';
import PressableIcon from '@components/PressableIcon';
import { COLORS, SHADOWS } from '@config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ingredient } from '@types';
import { useIngredients } from '../contexts/IngredientsContext';
import PendingItem from './PendingItem';

interface IngredientModalEditorProps {
  modalOpen: boolean;
  closeModal: () => void;
  selectedCategory: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setPendingItems: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  setPendingEditId: React.Dispatch<React.SetStateAction<string | null>>;
  setPendingEditName: React.Dispatch<React.SetStateAction<string>>;
  query: string;
  pendingItems: Ingredient[];
  pendingEditId: string | null;
  pendingEditName: string;
}

const IngredientModalEditor = ({
  modalOpen,
  closeModal,
  selectedCategory,
  setQuery,
  setPendingItems,
  setPendingEditId,
  setPendingEditName,
  query,
  pendingEditId,
  pendingEditName,
  pendingItems,
}: IngredientModalEditorProps) => {
  const { categoryMap, addIngredients, allIngredients } = useIngredients();
  const inputRef = useRef<TextInput>(null);

  const currentList = categoryMap[selectedCategory] ?? [];

  const handleValidate = () => {
    if (pendingItems.length > 0) {
      addIngredients(selectedCategory, pendingItems);
    }
    closeModal();
  };

  const filteredDropdown =
    query.trim().length > 0
      ? allIngredients
          .filter(
            ing =>
              ing.category === selectedCategory &&
              ing.name.toLowerCase().includes(query.toLowerCase()) &&
              !pendingItems.find(i => i.id === ing.id),
          )
          .map(ing => ({ ...ing, alreadyPresent: !!currentList.find(i => i.id === ing.id) }))
          .slice(0, 6)
      : [];

  const canCreate =
    query.trim().length > 0 &&
    ![...currentList, ...pendingItems].find(
      i => i.name.toLowerCase() === query.trim().toLowerCase(),
    );

  const handleSelectDropdown = (ing: Ingredient) => {
    setPendingItems(prev => [...prev, ing]);
    setQuery('');
    inputRef.current?.focus();
  };
  const handleAddCustom = () => {
    const name = query.trim();
    if (!name) return;
    setPendingItems(prev => [
      ...prev,
      {
        id: `custom_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        name,
        category: selectedCategory,
      },
    ]);
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={closeModal}>
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={closeModal} />

        <View style={styles.dialog} onStartShouldSetResponder={() => true}>
          <View style={styles.dialogHeader}>
            <Text style={styles.dialogTitle} numberOfLines={1}>
              Ajouter à <Text style={styles.dialogTitleCategory}>"{selectedCategory}"</Text>
            </Text>
            <PressableIcon
              type={'close'}
              onPress={closeModal}
              hitSlop={8}
              color={COLORS.textMuted}
              iconSize={22}></PressableIcon>
          </View>

          <ScrollView style={styles.dialogBody} keyboardShouldPersistTaps="handled">
            <View style={styles.searchBar}>
              <MaterialIcons name="search" size={18} color={COLORS.textMuted} />

              <TextInput
                ref={inputRef}
                style={styles.searchInput}
                value={query}
                onChangeText={setQuery}
                placeholder="Rechercher ou saisir un nom..."
                placeholderTextColor={COLORS.textMuted}
                returnKeyType="done"
                onSubmitEditing={canCreate ? handleAddCustom : undefined}
                autoFocus
              />
              {query.length > 0 && (
                <PressableIcon
                  type={'close'}
                  onPress={() => setQuery('')}
                  hitSlop={8}
                  color={COLORS.textMuted}
                  iconSize={16}></PressableIcon>
              )}
            </View>

            {filteredDropdown.length > 0 && (
              <View style={styles.dropdown}>
                {filteredDropdown.map((ing, idx) => (
                  <Pressable
                    key={ing.id}
                    style={[
                      styles.dropdownItem,
                      idx < filteredDropdown.length - 1 && styles.dropdownItemBorder,
                      ing.alreadyPresent && styles.dropdownItemDisabled,
                    ]}
                    onPress={() => !ing.alreadyPresent && handleSelectDropdown(ing)}
                    disabled={ing.alreadyPresent}>
                    <Text
                      style={[
                        styles.dropdownItemText,
                        ing.alreadyPresent && styles.dropdownItemTextMuted,
                      ]}>
                      {ing.name}
                    </Text>
                    {ing.alreadyPresent ? (
                      <View style={styles.alreadyPresentBadge}>
                        <Text style={styles.alreadyPresentText}>Déjà présent</Text>
                      </View>
                    ) : (
                      <MaterialIcons name="add" size={18} color={COLORS.primary} />
                    )}
                  </Pressable>
                ))}
              </View>
            )}

            {canCreate && (
              <Pressable style={styles.createOption} onPress={handleAddCustom}>
                <MaterialIcons name="add-circle-outline" size={18} color={COLORS.primary} />
                <Text style={styles.createOptionText}>
                  Créer <Text style={styles.createOptionName}>"{query.trim()}"</Text>
                </Text>
              </Pressable>
            )}

            {pendingItems.length > 0 && (
              <View style={styles.pendingSection}>
                <Text style={styles.pendingLabel}>À ajouter ({pendingItems.length})</Text>
                {pendingItems.map(item => (
                  <PendingItem
                    key={item.id}
                    item={item}
                    isEditing={pendingEditId === item.id}
                    editingName={pendingEditName}
                    onStartEdit={() => {
                      setPendingEditId(item.id);
                      setPendingEditName(item.name);
                    }}
                    onEditChange={setPendingEditName}
                    onConfirmEdit={() => {
                      if (!pendingEditName.trim()) return;
                      setPendingItems(prev =>
                        prev.map(i =>
                          i.id === item.id ? { ...i, name: pendingEditName.trim() } : i,
                        ),
                      );
                      setPendingEditId(null);
                    }}
                    onDelete={() => setPendingItems(prev => prev.filter(i => i.id !== item.id))}
                  />
                ))}
              </View>
            )}
          </ScrollView>

          <View style={styles.dialogFooter}>
            <Pressable style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </Pressable>
            <Pressable
              style={[
                styles.validateButton,
                pendingItems.length === 0 && styles.validateButtonDisabled,
              ]}
              onPress={handleValidate}
              disabled={pendingItems.length === 0}>
              <Text style={styles.validateButtonText}>
                Valider{pendingItems.length > 0 ? ` (${pendingItems.length})` : ''}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialog: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    width: '90%',
    maxWidth: 480,
    maxHeight: '85%',
    overflow: 'hidden',
    boxShadow: SHADOWS.lg,
  },
  dialogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: 12,
  },
  dialogTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  dialogTitleCategory: {
    color: COLORS.primary,
  },
  dialogBody: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 8,
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
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: 8,
    boxShadow: SHADOWS.sm,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  dropdownItemText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    flex: 1,
  },
  dropdownItemDisabled: {
    backgroundColor: COLORS.background,
  },
  dropdownItemTextMuted: {
    color: COLORS.textMuted,
  },
  alreadyPresentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: COLORS.borderLight,
  },
  alreadyPresentText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  createOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  createOptionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  createOptionName: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  pendingSection: {
    gap: 4,
    paddingTop: 8,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    marginTop: 4,
  },
  dialogFooter: {
    flexDirection: 'row',
    gap: 10,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  validateButton: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  validateButtonDisabled: {
    opacity: 0.35,
  },
  validateButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.surface,
  },
  pendingLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
});

export default IngredientModalEditor;
