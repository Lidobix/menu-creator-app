import { Ingredient } from '@types';

export interface IngredientRowProps {
  ingredient: Ingredient;
  isEditing: boolean;
  editName: string;
  onStartEdit: () => void;
  onEditChange: (v: string) => void;
  onConfirmEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
}

export interface PendingItemProps {
  item: Ingredient;
  isEditing: boolean;
  editingName: string;
  onStartEdit: () => void;
  onEditChange: (v: string) => void;
  onConfirmEdit: () => void;
  onDelete: () => void;
}
