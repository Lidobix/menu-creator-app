import { memo } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { COLORS, LAYOUT } from '@config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { IngredientRowProps } from '../types';

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
          <Pressable style={styles.rowAction} onPress={onConfirmEdit} hitSlop={8}>
            <MaterialIcons name="check" size={20} color={COLORS.success} />
          </Pressable>
          <Pressable style={styles.rowAction} onPress={onCancelEdit} hitSlop={8}>
            <MaterialIcons name="close" size={20} color={COLORS.textMuted} />
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.rowName}>{ingredient.name}</Text>
          <Pressable style={styles.rowAction} onPress={onStartEdit} hitSlop={8}>
            <MaterialIcons name="edit" size={18} color={COLORS.textMuted} />
          </Pressable>
          <Pressable style={styles.rowAction} onPress={onDelete} hitSlop={8}>
            <MaterialIcons name="delete-outline" size={18} color={COLORS.textMuted} />
          </Pressable>
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
