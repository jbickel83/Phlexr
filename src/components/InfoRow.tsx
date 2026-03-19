import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../constants/theme";

type InfoRowProps = {
  title: string;
  detail: string;
};

export function InfoRow({ title, detail }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.dot} />
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.detail}>{detail}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginTop: 6,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  detail: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
