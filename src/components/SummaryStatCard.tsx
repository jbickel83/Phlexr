import { StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../constants/theme";

type SummaryStatCardProps = {
  label: string;
  value: string;
};

export function SummaryStatCard({ label, value }: SummaryStatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 96,
    backgroundColor: "rgba(9, 14, 28, 0.74)",
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "rgba(37,224,255,0.12)",
    padding: spacing.md,
    gap: 4,
  },
  value: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "800",
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
});
