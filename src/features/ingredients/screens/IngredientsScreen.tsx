import { useCallback, useRef, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { COLORS, LAYOUT, SHADOWS } from '@config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ingredient } from '@types';
import IngredientModalEditor from '../components/IngredientModalEdirtor';
import IngredientsList from '../components/IngredientsList';
import { useIngredients } from '../contexts/IngredientsContext';
import { CATEGORY_META, DEFAULT_META } from '../data/categories';

export default function IngredientsScreen() {
  const { categoryMap, categoryNames, allIngredients } = useIngredients();

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

  const openModal = useCallback(() => {
    setModalOpen(true);
    setQuery('');
    setPendingItems([]);
    setPendingEditId(null);
    setPendingEditName('');
  }, [setModalOpen, setQuery, setPendingItems, setPendingEditId, setPendingEditName]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  const activeIngredients = categoryMap[selectedCategory] ?? [];
  const activeMeta = CATEGORY_META[selectedCategory] ?? DEFAULT_META;

  return (
    <View style={styles.root}>
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

      <IngredientsList selectedCategory={selectedCategory} openModal={openModal}></IngredientsList>

      <IngredientModalEditor
        modalOpen={modalOpen}
        closeModal={closeModal}
        selectedCategory={selectedCategory}
        setQuery={setQuery}
        setPendingItems={setPendingItems}
        setPendingEditId={setPendingEditId}
        setPendingEditName={setPendingEditName}
        pendingItems={pendingItems}
        pendingEditId={pendingEditId}
        pendingEditName={pendingEditName}
        query={query}></IngredientModalEditor>

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
});
