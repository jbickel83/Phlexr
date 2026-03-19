import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../constants/theme";

type EventPreviewCardProps = {
  name: string;
  date: string;
  venue: string;
  phase: string;
  status: string;
  accent: string;
  onPress?: () => void;
};

export function EventPreviewCard({
  name,
  date,
  venue,
  phase,
  status,
  accent,
  onPress,
}: EventPreviewCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
      <LinearGradient
        colors={["rgba(7,11,20,0.98)", "rgba(16,24,46,0.96)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.topRow}>
          <View style={[styles.accentBar, { backgroundColor: accent }]} />
          <Text style={styles.status}>{status}</Text>
        </View>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.venue}>{venue}</Text>
        <Text style={styles.phase}>{phase}</Text>
        <View style={styles.footer}>
          <Text style={styles.footerPill}>Timeline armed</Text>
          <Text style={styles.footerPill}>Local audio</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: radii.lg,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  card: {
    width: 280,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: "rgba(37,224,255,0.12)",
    padding: spacing.lg,
    marginRight: spacing.md,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accentBar: {
    width: 44,
    height: 6,
    borderRadius: radii.pill,
  },
  status: {
    color: colors.accentStrong,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  date: {
    color: colors.textSecondary,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "800",
  },
  venue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  phase: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  footerPill: {
    color: colors.textPrimary,
    backgroundColor: "rgba(37,224,255,0.08)",
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    fontSize: 11,
    fontWeight: "700",
    overflow: "hidden",
  },
});
