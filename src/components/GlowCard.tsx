import { PropsWithChildren, ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

import { colors, radii, shadows, spacing } from "../constants/theme";

type GlowCardProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  style?: ViewStyle;
}>;

export function GlowCard({ title, subtitle, rightSlot, style, children }: GlowCardProps) {
  return (
    <LinearGradient
      colors={["rgba(37,224,255,0.18)", "rgba(139,92,246,0.12)", "rgba(18,26,48,0.96)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.shell, shadows.neon, style]}
    >
      {(title || subtitle || rightSlot) && (
        <View style={styles.header}>
          <View style={styles.headerText}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {rightSlot}
        </View>
      )}
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: "rgba(37,224,255,0.14)",
    padding: spacing.lg,
    backgroundColor: colors.card,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
