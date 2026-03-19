import { StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../constants/theme";

type QuickStartCardProps = {
  title: string;
  description: string;
};

export function QuickStartCard({ title, description }: QuickStartCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <View style={styles.iconDot} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: "rgba(10,16,32,0.78)",
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "rgba(37,224,255,0.12)",
    padding: spacing.md,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: radii.md,
    backgroundColor: "rgba(37,224,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconDot: {
    width: 14,
    height: 14,
    borderRadius: 999,
    backgroundColor: colors.accentStrong,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
