import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../constants/theme";

type SectionHeaderProps = {
  title: string;
  caption?: string;
};

export function SectionHeader({ title, caption }: SectionHeaderProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 4,
    marginBottom: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "800",
  },
  caption: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
