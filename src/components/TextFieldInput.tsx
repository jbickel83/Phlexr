import { StyleSheet, Text, TextInput, View } from "react-native";

import { colors, radii, spacing } from "../constants/theme";

type TextFieldInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
};

export function TextFieldInput({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
}: TextFieldInputProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        multiline={multiline}
        style={[styles.input, multiline && styles.multilineInput]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(9, 14, 28, 0.72)",
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "rgba(152,167,204,0.12)",
    padding: spacing.md,
    gap: 8,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.9,
  },
  input: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    padding: 0,
  },
  multilineInput: {
    minHeight: 72,
    textAlignVertical: "top",
  },
});
