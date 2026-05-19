import { memo } from 'react';
import { Text, TextInput, View } from 'react-native';
import { StyleSheet } from 'react-native';
import PressableIcon from '@components/PressableIcon';
import { COLORS } from '@config';
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
          <PressableIcon
            type={'check'}
            onPress={onConfirmEdit}
            hitSlop={6}
            color={COLORS.textMuted}
            containerStyle={styles.pendingAction}
            iconSize={18}></PressableIcon>
        </>
      ) : (
        <>
          <Text style={styles.pendingItemName} numberOfLines={1}>
            {item.name}
          </Text>
          <PressableIcon
            type={'edit'}
            containerStyle={styles.pendingAction}
            onPress={onStartEdit}
            hitSlop={6}
            color={COLORS.textMuted}
            iconSize={16}></PressableIcon>
        </>
      )}
      <PressableIcon
        type={'close'}
        containerStyle={styles.pendingAction}
        onPress={onDelete}
        hitSlop={6}
        color={COLORS.textMuted}
        iconSize={16}></PressableIcon>
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
