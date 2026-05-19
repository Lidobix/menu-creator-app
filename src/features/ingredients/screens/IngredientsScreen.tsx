import { useRef, useState } from 'react';
import { memo } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { COLORS, LAYOUT, SHADOWS } from '@config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ingredient } from '@types';
import IngredientsList from '../components/IngredientsList';
import { useIngredients } from '../contexts/IngredientsContext';
import { CATEGORY_META, DEFAULT_META } from '../data/categories';
import { PendingItemProps } from '../types';

const PendingItem = memo(function PendingItem({
  item,
  isEditing,
  editingName,
  onStartEdit,
  onEditChange,
  onConfirmEdit,
  onDelete,
}: PendingItemProps) {
  return (
    <View style={styles.pendingItem}>
      {isEditing ? (
        <>
          <TextInput
            style={styles.pendingEditInput}
            value={editingName}
            onChangeText={onEditChange}
            onSubmitEditing={onConfirmEdit}
            autoFocus
            returnKeyType="done"
          />
          <Pressable style={styles.pendingAction} onPress={onConfirmEdit} hitSlop={6}>
            <MaterialIcons name="check" size={18} color={COLORS.success} />
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.pendingItemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Pressable style={styles.pendingAction} onPress={onStartEdit} hitSlop={6}>
            <MaterialIcons name="edit" size={16} color={COLORS.textMuted} />
          </Pressable>
        </>
      )}
      <Pressable style={styles.pendingAction} onPress={onDelete} hitSlop={6}>
        <MaterialIcons name="close" size={16} color={COLORS.textMuted} />
      </Pressable>
    </View>
  );
});

export default function IngredientsScreen() {
  const { categoryMap, categoryNames, allIngredients, addIngredients } = useIngredients();

  // Selected tab
  const [selectedCategory, setSelectedCategory] = useState<string>(() => categoryNames[0] ?? '');

  // Inline row editing
  const [, setRowEditId] = useState<string | null>(null);

  // Add modal
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [pendingItems, setPendingItems] = useState<Ingredient[]>([]);
  const [pendingEditId, setPendingEditId] = useState<string | null>(null);
  const [pendingEditName, setPendingEditName] = useState('');
  const inputRef = useRef<TextInput>(null);
  const selectorRowRef = useRef<View>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownMeasure, setDropdownMeasure] = useState({ top: 0, left: 0, width: 0 });

  const handleOpenDropdown = () => {
    selectorRowRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownMeasure({ top: y + height + 4, left: x, width });
      setDropdownOpen(true);
    });
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setRowEditId(null);
    setDropdownOpen(false);
  };

  // ── Add modal ────────────────────────────────────────────────────────────────

  const openModal = () => {
    setModalOpen(true);
    setQuery('');
    setPendingItems([]);
    setPendingEditId(null);
    setPendingEditName('');
  };

  const closeModal = () => setModalOpen(false);

  const handleValidate = () => {
    if (pendingItems.length > 0) {
      addIngredients(selectedCategory, pendingItems);
    }
    closeModal();
  };

  const currentList = categoryMap[selectedCategory] ?? [];

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

  // ── Active category ───────────────────────────────────────────────────────────

  const activeIngredients = categoryMap[selectedCategory] ?? [];
  const activeMeta = CATEGORY_META[selectedCategory] ?? DEFAULT_META;

  return (
    <View style={styles.root}>
      {/* ── Fixed header ──────────────────────────────────────────────────────── */}
      <View style={styles.headerArea}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Ingrédients</Text>
          <Text style={styles.subtitle}>{allIngredients.length} au total</Text>
        </View>

        <View ref={selectorRowRef} style={styles.selectorRow}>
          <Pressable
            style={[styles.categoryTrigger, dropdownOpen && styles.categoryTriggerOpen]}
            onPress={dropdownOpen ? () => setDropdownOpen(false) : handleOpenDropdown}>
            <Text style={styles.categoryTriggerEmoji}>{activeMeta.emoji}</Text>
            <Text style={styles.categoryTriggerText}>{selectedCategory}</Text>
            <View style={styles.categoryTriggerBadge}>
              <Text style={styles.categoryTriggerBadgeText}>{activeIngredients.length}</Text>
            </View>
            <MaterialIcons
              name={dropdownOpen ? 'expand-less' : 'expand-more'}
              size={20}
              color={COLORS.textSecondary}
            />
          </Pressable>
          <Pressable style={styles.addButton} onPress={openModal} hitSlop={8}>
            <MaterialIcons name="add" size={18} color={COLORS.primary} />
            <Text style={styles.addButtonText}>Ajouter</Text>
          </Pressable>
        </View>
      </View>

      {/* ── Ingredient list ───────────────────────────────────────────────────── */}

      <IngredientsList selectedCategory={selectedCategory}></IngredientsList>

      {/* ── Add Modal ─────────────────────────────────────────────────────────── */}
      <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={closeModal} />

          <View style={styles.dialog} onStartShouldSetResponder={() => true}>
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogTitle} numberOfLines={1}>
                Ajouter à <Text style={styles.dialogTitleCategory}>"{selectedCategory}"</Text>
              </Text>
              <Pressable onPress={closeModal} hitSlop={8}>
                <MaterialIcons name="close" size={22} color={COLORS.textMuted} />
              </Pressable>
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
                  <Pressable onPress={() => setQuery('')} hitSlop={8}>
                    <MaterialIcons name="close" size={16} color={COLORS.textMuted} />
                  </Pressable>
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

      {/* ── Category dropdown Modal ───────────────────────────────────────────── */}

      <Modal
        visible={dropdownOpen}
        transparent
        animationType="none"
        onRequestClose={() => setDropdownOpen(false)}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setDropdownOpen(false)} />
        <View
          style={[
            styles.dropdownList,
            {
              position: 'absolute',
              top: dropdownMeasure.top,
              left: dropdownMeasure.left,
              width: dropdownMeasure.width,
            },
          ]}>
          {categoryNames.map((cat, idx) => {
            const meta = CATEGORY_META[cat] ?? DEFAULT_META;
            const count = (categoryMap[cat] ?? []).length;
            const isActive = cat === selectedCategory;
            return (
              <Pressable
                key={cat}
                style={[
                  styles.dropdownOption,
                  idx < categoryNames.length - 1 && styles.dropdownOptionBorder,
                  isActive && styles.dropdownOptionActive,
                ]}
                onPress={() => handleSelectCategory(cat)}>
                <Text style={styles.dropdownOptionEmoji}>{meta.emoji}</Text>
                <Text
                  style={[styles.dropdownOptionText, isActive && styles.dropdownOptionTextActive]}>
                  {cat}
                </Text>
                <View
                  style={[
                    styles.dropdownOptionBadge,
                    isActive && styles.dropdownOptionBadgeActive,
                  ]}>
                  <Text
                    style={[
                      styles.dropdownOptionBadgeText,
                      isActive && styles.dropdownOptionBadgeTextActive,
                    ]}>
                    {count}
                  </Text>
                </View>
                {isActive && <MaterialIcons name="check" size={16} color={COLORS.surface} />}
              </Pressable>
            );
          })}
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
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

  // Category selector
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryTrigger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    boxShadow: SHADOWS.sm,
  },
  categoryTriggerOpen: {
    borderColor: COLORS.primary,
  },
  categoryTriggerEmoji: {
    fontSize: 16,
  },
  categoryTriggerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  categoryTriggerBadge: {
    backgroundColor: COLORS.borderLight,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    minWidth: 22,
    alignItems: 'center',
  },
  categoryTriggerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  dropdownList: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    boxShadow: SHADOWS.md,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  dropdownOptionActive: {
    backgroundColor: COLORS.primary,
  },
  dropdownOptionEmoji: {
    fontSize: 16,
  },
  dropdownOptionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  dropdownOptionTextActive: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  dropdownOptionBadge: {
    backgroundColor: COLORS.borderLight,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    minWidth: 22,
    alignItems: 'center',
  },
  dropdownOptionBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dropdownOptionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  dropdownOptionBadgeTextActive: {
    color: COLORS.surface,
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

  // Modal
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
  pendingLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  pendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    gap: 6,
  },
  pendingItemName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  pendingEditInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.primary,
    paddingVertical: 2,
    padding: 0,
  },
  pendingAction: {
    padding: 4,
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
});
