import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { COLORS, SHADOWS } from '@config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export type CategoryDropdownItem = {
  value: string;
  label: string;
  emoji: string;
  count: number;
  isLast?: boolean;
};

type Props = {
  data: CategoryDropdownItem[];
  value: string;
  onChange: (value: string) => void;
};

export function CategoryDropdown({ data, value, onChange }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const selectedItem = data.find(item => item.value === value);

  return (
    <Dropdown
      data={data}
      labelField="label"
      valueField="value"
      value={value}
      onChange={item => onChange(item.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={[styles.trigger, isFocused && styles.triggerOpen]}
      containerStyle={styles.dropdownContainer}
      selectedTextStyle={styles.selectedText}
      activeColor="transparent"
      renderLeftIcon={() => <Text style={styles.emoji}>{selectedItem?.emoji ?? ''}</Text>}
      renderRightIcon={visible => (
        <View style={styles.rightSection}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{selectedItem?.count ?? 0}</Text>
          </View>
          <MaterialIcons
            name={visible ? 'expand-less' : 'expand-more'}
            size={20}
            color={COLORS.textSecondary}
          />
        </View>
      )}
      renderItem={(item, isSelected) => (
        <View
          style={[
            styles.option,
            !item.isLast && styles.optionBorder,
            !!isSelected && styles.optionActive,
          ]}>
          <Text style={styles.optionEmoji}>{item.emoji}</Text>
          <Text style={[styles.optionText, !!isSelected && styles.optionTextActive]}>
            {item.label}
          </Text>
          <View style={[styles.optionBadge, !!isSelected && styles.optionBadgeActive]}>
            <Text style={[styles.optionBadgeText, !!isSelected && styles.optionBadgeTextActive]}>
              {item.count}
            </Text>
          </View>
          {isSelected && <MaterialIcons name="check" size={16} color={COLORS.surface} />}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  trigger: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    boxShadow: SHADOWS.sm,
  } as object,
  triggerOpen: {
    borderColor: COLORS.primary,
  },
  selectedText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  emoji: {
    fontSize: 16,
    marginRight: 8,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 8,
  },
  badge: {
    backgroundColor: COLORS.borderLight,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    minWidth: 22,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  dropdownContainer: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    boxShadow: SHADOWS.md,
  } as object,
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  optionActive: {
    backgroundColor: COLORS.primary,
  },
  optionEmoji: {
    fontSize: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  optionTextActive: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  optionBadge: {
    backgroundColor: COLORS.borderLight,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    minWidth: 22,
    alignItems: 'center',
  },
  optionBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  optionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  optionBadgeTextActive: {
    color: COLORS.surface,
  },
});
