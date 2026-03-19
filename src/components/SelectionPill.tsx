import { Pressable, StyleSheet, Text } from "react-native";

import { colors, radii, spacing } from "../constants/theme";

type SelectionPillProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export function SelectionPill({ label, active = false, onPress }: SelectionPillProps) {
  return (
    <Pressable onPress={onPress} style={[styles.pill, active && styles.activePill]}>
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(152,167,204,0.14)",
    backgroundColor: "rgba(9,14,28,0.7)",
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
  },
  activePill: {
    borderColor: "rgba(37,224,255,0.28)",
    backgroundColor: "rgba(37,224,255,0.12)",
  },
  label: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  activeLabel: {
    color: colors.accentStrong,
  },
});
