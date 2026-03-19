import { StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../constants/theme";

type TemplateCardProps = {
  name: string;
  category: string;
  detail: string;
};

export function TemplateCard({ name, category, detail }: TemplateCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.category}>{category}</Text>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.detail}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(13,19,36,0.92)",
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.18)",
    padding: spacing.md,
    gap: 8,
  },
  category: {
    color: colors.accentSecondary,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.9,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  detail: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
