import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text } from "react-native";

import { colors, radii, spacing } from "../constants/theme";

type NeonButtonProps = {
  label: string;
  variant?: "primary" | "secondary";
  onPress?: () => void;
};

export function NeonButton({ label, variant = "primary", onPress }: NeonButtonProps) {
  if (variant === "secondary") {
    return (
      <Pressable onPress={onPress} style={styles.secondary}>
        <Text style={styles.secondaryLabel}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={["#25E0FF", "#1BA6FF", "#8B5CF6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.primary}
      >
        <Text style={styles.primaryLabel}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    minHeight: 52,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  primaryLabel: {
    color: "#03111A",
    fontSize: 15,
    fontWeight: "800",
  },
  secondary: {
    minHeight: 52,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(37,224,255,0.28)",
    backgroundColor: "rgba(16, 24, 44, 0.85)",
  },
  secondaryLabel: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
});
