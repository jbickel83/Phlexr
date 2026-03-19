import { PropsWithChildren, ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../constants/theme";

type ScreenShellProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
  footer?: ReactNode;
}>;

export function ScreenShell({ eyebrow, title, description, footer, children }: ScreenShellProps) {
  return (
    <LinearGradient
      colors={["#050811", "#091121", "#0B1630"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.bg}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.body}>{children}</View>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  hero: {
    gap: spacing.sm,
  },
  eyebrow: {
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontSize: 12,
    fontWeight: "800",
  },
  title: {
    color: colors.textPrimary,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "800",
  },
  description: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 360,
  },
  body: {
    gap: spacing.lg,
  },
  footer: {
    marginTop: spacing.sm,
  },
});
