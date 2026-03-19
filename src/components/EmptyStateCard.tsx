import { StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../constants/theme";

type EmptyStateCardProps = {
  title: string;
  description: string;
};

export function EmptyStateCard({ title, description }: EmptyStateCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(10,16,32,0.7)",
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: "rgba(152,167,204,0.14)",
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "800",
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
});
