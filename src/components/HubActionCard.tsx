import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../constants/theme";

type HubActionCardProps = {
  title: string;
  onPress?: () => void;
};

export function HubActionCard({ title, onPress }: HubActionCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.dot} />
        <Text style={styles.plus}>+</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
    backgroundColor: "rgba(12,18,35,0.86)",
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.18)",
    padding: spacing.md,
    gap: spacing.md,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.accentStrong,
  },
  plus: {
    color: colors.accentSecondary,
    fontSize: 18,
    fontWeight: "800",
  },
  title: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700",
  },
});
