import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../constants/theme";

type CrossfaderControlProps = {
  value: number;
  onChange: (value: number) => void;
};

const STEPS = [0, 1, 2, 3, 4];

export function CrossfaderControl({ value, onChange }: CrossfaderControlProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.labels}>
        <Text style={styles.label}>Deck A</Text>
        <Text style={styles.centerLabel}>Crossfader</Text>
        <Text style={styles.label}>Deck B</Text>
      </View>
      <View style={styles.row}>
        {STEPS.map((step) => {
          const active = step === value;
          return (
            <Pressable
              key={step}
              onPress={() => onChange(step)}
              style={[styles.step, active && styles.stepActive]}
            >
              <Text style={[styles.stepText, active && styles.stepTextActive]}>
                {step === 0 ? "A" : step === 4 ? "B" : step === 2 ? "Mix" : step}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  centerLabel: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  step: {
    flex: 1,
    minHeight: 44,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(152,167,204,0.14)",
    backgroundColor: "rgba(8,12,24,0.66)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepActive: {
    borderColor: "rgba(37,224,255,0.34)",
    backgroundColor: "rgba(37,224,255,0.14)",
  },
  stepText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800",
  },
  stepTextActive: {
    color: colors.accentStrong,
  },
});
