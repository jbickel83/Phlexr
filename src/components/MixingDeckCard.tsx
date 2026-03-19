import { StyleSheet, Text, View } from "react-native";

import { ActionChip } from "./ActionChip";
import { GlowCard } from "./GlowCard";
import { colors, radii, spacing } from "../constants/theme";

type MixingDeckCardProps = {
  side: "Left Deck" | "Right Deck";
  accent: "cyan" | "purple";
  trackName: string;
  cueLabel: string;
  statusLabel: string;
  timeLabel: string;
  volumeLabel: string;
  onPlayPause: () => void;
  onSkip: () => void;
  onVolumeDown: () => void;
  onVolumeUp: () => void;
};

export function MixingDeckCard({
  side,
  accent,
  trackName,
  cueLabel,
  statusLabel,
  timeLabel,
  volumeLabel,
  onPlayPause,
  onSkip,
  onVolumeDown,
  onVolumeUp,
}: MixingDeckCardProps) {
  const accentColor = accent === "cyan" ? colors.accentStrong : colors.accentSecondary;
  const ringColor = accent === "cyan" ? "rgba(37,224,255,0.2)" : "rgba(139,92,246,0.22)";

  return (
    <GlowCard style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.sideLabel, { color: accentColor }]}>{side}</Text>
        <View style={[styles.statusPill, { borderColor: ringColor, backgroundColor: ringColor }]}>
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>

      <View style={[styles.platterOuter, { borderColor: ringColor }]}>
        <View style={[styles.platterMiddle, { borderColor: ringColor }]}>
          <View style={[styles.platterInner, { backgroundColor: ringColor }]}>
            <Text style={styles.cueLabel}>{cueLabel}</Text>
          </View>
        </View>
      </View>

      <View style={styles.meta}>
        <Text style={styles.trackName}>{trackName}</Text>
        <Text style={styles.timeLabel}>{timeLabel}</Text>
        <Text style={styles.volumeLabel}>{volumeLabel}</Text>
      </View>

      <View style={styles.controls}>
        <ActionChip label="Vol -" onPress={onVolumeDown} />
        <ActionChip label="Play / Pause" onPress={onPlayPause} />
        <ActionChip label="Skip" onPress={onSkip} />
        <ActionChip label="Vol +" onPress={onVolumeUp} />
      </View>
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  sideLabel: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  statusPill: {
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  statusText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  platterOuter: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: "rgba(6,10,20,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  platterMiddle: {
    width: "78%",
    height: "78%",
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: "rgba(11,17,32,0.96)",
    alignItems: "center",
    justifyContent: "center",
  },
  platterInner: {
    width: "34%",
    height: "34%",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  cueLabel: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  meta: {
    gap: 4,
  },
  trackName: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "800",
  },
  timeLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
  },
  volumeLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  controls: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
