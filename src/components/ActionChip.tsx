import { Pressable, StyleSheet, Text } from "react-native";

import { colors, radii, spacing } from "../constants/theme";

type ActionChipProps = {
  label: string;
  onPress?: () => void;
};

export function ActionChip({ label, onPress }: ActionChipProps) {
  return (
    <Pressable onPress={onPress} style={styles.chip}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(37,224,255,0.16)",
    backgroundColor: "rgba(12, 18, 35, 0.9)",
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
  },
});
