import { StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../constants/theme";

type ProgressStep = {
  id: string;
  label: string;
  time: string;
  state: "complete" | "current" | "upcoming";
};

type TimelineProgressIndicatorProps = {
  steps: ProgressStep[];
  completionLabel?: string;
};

export function TimelineProgressIndicator({ steps, completionLabel }: TimelineProgressIndicatorProps) {
  return (
    <View style={styles.wrap}>
      {completionLabel ? <Text style={styles.completionLabel}>{completionLabel}</Text> : null}
      {steps.map((step, index) => (
        <View key={step.id} style={[styles.row, step.state === "current" && styles.currentRow]}>
          <View style={styles.railCol}>
            <View
              style={[
                styles.dot,
                step.state === "complete" && styles.completeDot,
                step.state === "current" && styles.currentDot,
              ]}
            />
            {index < steps.length - 1 ? <View style={styles.rail} /> : null}
          </View>
          <View style={styles.copy}>
            <Text style={styles.time}>{step.time}</Text>
            <Text style={[styles.label, step.state === "current" && styles.currentLabel]}>{step.label}</Text>
            <Text style={[styles.stepState, step.state === "current" && styles.currentStepState]}>
              {step.state === "complete" ? "Completed" : step.state === "current" ? "Active now" : "Up next"}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  completionLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "stretch",
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  currentRow: {
    backgroundColor: "rgba(37,224,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(37,224,255,0.14)",
  },
  railCol: {
    alignItems: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: radii.pill,
    backgroundColor: "rgba(152,167,204,0.34)",
    marginTop: 3,
  },
  completeDot: {
    backgroundColor: colors.success,
  },
  currentDot: {
    backgroundColor: colors.accentStrong,
    shadowColor: colors.accentStrong,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  rail: {
    width: 2,
    flex: 1,
    marginTop: 6,
    marginBottom: -6,
    backgroundColor: "rgba(152,167,204,0.18)",
  },
  copy: {
    flex: 1,
    paddingBottom: spacing.md,
    gap: 4,
  },
  time: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  label: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700",
  },
  currentLabel: {
    color: colors.accentStrong,
  },
  stepState: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  currentStepState: {
    color: colors.accentStrong,
  },
});
