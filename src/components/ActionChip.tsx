import { Pressable, StyleSheet, Text } from "react-native";

import { colors, radii, spacing } from "../constants/theme";

type ActionChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export function ActionChip({ label, active = false, onPress }: ActionChipProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.chip, active && styles.activeChip, pressed && styles.pressedChip]}>
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
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
  activeChip: {
    borderColor: "rgba(37,224,255,0.36)",
    backgroundColor: "rgba(37,224,255,0.14)",
    shadowColor: colors.accentStrong,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 6,
  },
  pressedChip: {
    borderColor: "rgba(37,224,255,0.32)",
    backgroundColor: "rgba(37,224,255,0.18)",
    shadowColor: colors.accentStrong,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
    transform: [{ scale: 0.98 }],
  },
  label: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
  },
  activeLabel: {
    color: colors.accentStrong,
  },
});
