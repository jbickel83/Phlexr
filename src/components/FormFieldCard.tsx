import { StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../constants/theme";

type FormFieldCardProps = {
  label: string;
  value: string;
  helper?: string;
};

export function FormFieldCard({ label, value, helper }: FormFieldCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
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
    gap: 6,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.9,
  },
  value: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  helper: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
});
