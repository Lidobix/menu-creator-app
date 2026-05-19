import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import PressableIcon from '@components/PressableIcon';
import { COLORS, LAYOUT, SHADOWS } from '@config';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { usePizzaCreation } from '@features/menu-editor/contexts/PizzaCreationContext';
import { useRouter } from 'expo-router';

export default function CreatePizzaNameScreen() {
  const { push, back } = useRouter();
  const { pizza, setName, setDescription, resetPizza } = usePizzaCreation();

  const [localName, setLocalName] = useState(pizza.name);
  const [localDesc, setLocalDesc] = useState(pizza.description);

  const canContinue = localName.trim().length > 0;

  const handleNext = () => {
    setName(localName.trim());
    setDescription(localDesc.trim());
    push('/create-pizza/choose-base');
  };

  const handleBack = () => {
    resetPizza();
    back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <PressableIcon
            type={'arrow-back'}
            onPress={handleBack}
            hitSlop={8}
            color={COLORS.textSecondary}
            containerStyle={styles.backButton}
            iconSize={22}></PressableIcon>

          <View style={styles.steps}>
            <View style={[styles.step, styles.stepActive]} />
            <View style={styles.step} />
            <View style={styles.step} />
            <View style={styles.step} />
          </View>
          <View style={styles.backButton} />
        </View>

        <Text style={styles.screenTitle}>Nouvelle pizza</Text>
        <Text style={styles.screenSubtitle}>Donnez un nom à votre création</Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>
              Nom de la pizza <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={localName}
              onChangeText={setLocalName}
              placeholder="Ex: Margherita, Regina..."
              placeholderTextColor={COLORS.textMuted}
              autoFocus
              returnKeyType="next"
              maxLength={50}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              Description <Text style={styles.optional}>(facultatif)</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={localDesc}
              onChangeText={setLocalDesc}
              placeholder="Décrivez votre pizza en quelques mots..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </View>
        </View>

        <Pressable
          style={[styles.nextButton, !canContinue && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canContinue}>
          <Text style={styles.nextButtonText}>Suivant</Text>
          <MaterialIcons name="arrow-forward" size={20} color={COLORS.surface} />
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: LAYOUT.contentPadding,
    paddingTop: 52,
    maxWidth: LAYOUT.contentMaxWidth,
    width: '100%',
    alignSelf: 'center',
    gap: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: SHADOWS.sm,
  },
  steps: {
    flexDirection: 'row',
    gap: 6,
  },
  step: {
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.stepPending,
  },
  stepActive: {
    backgroundColor: COLORS.stepActive,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: -8,
  },
  form: {
    gap: 20,
    marginTop: 8,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  required: {
    color: COLORS.primary,
  },
  optional: {
    fontWeight: '400',
    color: COLORS.textMuted,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.textPrimary,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  inputMultiline: {
    height: 90,
    textAlignVertical: 'top',
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 17,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  nextButtonDisabled: {
    opacity: 0.4,
  },
  nextButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});
