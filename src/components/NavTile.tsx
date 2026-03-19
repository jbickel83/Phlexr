import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../constants/theme";

type NavTileProps = {
  title: string;
  description: string;
  onPress?: () => void;
};

export function NavTile({ title, description, onPress }: NavTileProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <View style={styles.dot} />
        <Text style={styles.chevron}>+</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
    backgroundColor: "rgba(10, 16, 32, 0.76)",
    borderWidth: 1,
    borderColor: "rgba(37,224,255,0.14)",
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  chevron: {
    color: colors.accentStrong,
    fontSize: 18,
    fontWeight: "700",
  },
  title: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  description: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
});
