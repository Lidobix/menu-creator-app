import { memo } from 'react';
import { Text, TextInput, View } from 'react-native';
import { StyleSheet } from 'react-native';
import PressableIcon from '@components/PressableIcon';
import { COLORS, LAYOUT } from '@config';
import { Ingredient } from '@types';

interface IngredientRowProps {
  ingredient: Ingredient;
  isEditing: boolean;
  editName: string;
  onStartEdit: () => void;
  onEditChange: (v: string) => void;
  onConfirmEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
}

const IngredientRow = memo(function IngredientRow({
  ingredient,
  isEditing,
  editName,
  onStartEdit,
  onEditChange,
  onConfirmEdit,
  onCancelEdit,
  onDelete,
}: IngredientRowProps) {
  return (
    <View style={styles.row}>
      {isEditing ? (
        <>
          <TextInput
            style={styles.rowEditInput}
            value={editName}
            onChangeText={onEditChange}
            onSubmitEditing={onConfirmEdit}
            autoFocus
            returnKeyType="done"
          />
          <PressableIcon
            type={'check'}
            containerStyle={styles.rowAction}
            onPress={onConfirmEdit}
            iconSize={20}
            hitSlop={8}
            color={COLORS.success}></PressableIcon>
          <PressableIcon
            type={'close'}
            containerStyle={styles.rowAction}
            onPress={onCancelEdit}
            iconSize={20}
            hitSlop={8}
            color={COLORS.textMuted}></PressableIcon>
        </>
      ) : (
        <>
          <Text style={styles.rowName}>{ingredient.name}</Text>
          <PressableIcon
            type={'edit'}
            containerStyle={styles.rowAction}
            onPress={onStartEdit}
            iconSize={18}
            hitSlop={8}
            color={COLORS.textMuted}></PressableIcon>
          <PressableIcon
            type={'delete-outline'}
            containerStyle={styles.rowAction}
            onPress={onDelete}
            iconSize={18}
            hitSlop={8}
            color={COLORS.textMuted}></PressableIcon>
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.contentPadding,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: 4,
  },
  rowEditInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.primary,
    paddingVertical: 2,
    padding: 0,
  },
  rowName: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
  },

  rowAction: {
    padding: 6,
  },
});

export default IngredientRow;
