import { StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../constants/theme";

type LiveStatusTileProps = {
  label: string;
  value: string;
  accent?: "cyan" | "green" | "purple";
};

export function LiveStatusTile({ label, value, accent = "cyan" }: LiveStatusTileProps) {
  const accentColor =
    accent === "green" ? colors.success : accent === "purple" ? colors.accentSecondary : colors.accentStrong;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 100,
    backgroundColor: "rgba(9, 14, 28, 0.74)",
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "rgba(37,224,255,0.1)",
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
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "800",
  },
});
