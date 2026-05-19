import { memo } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { COLORS } from '@config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ingredient } from '@types';

interface PendingItemProps {
  item: Ingredient;
  isEditing: boolean;
  editingName: string;
  onStartEdit: () => void;
  onEditChange: (v: string) => void;
  onConfirmEdit: () => void;
  onDelete: () => void;
}

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

const styles = StyleSheet.create({
  pendingAction: {
    padding: 4,
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
});

export default PendingItem;
