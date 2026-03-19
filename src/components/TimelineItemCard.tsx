import { StyleSheet, Text, View } from "react-native";

import { ActionChip } from "./ActionChip";
import { colors, radii, spacing } from "../constants/theme";

type TimelineItemCardProps = {
  id: string;
  title: string;
  time: string;
  music: string;
  announcementAttached: boolean;
  onDelete?: (id: string) => void;
  onReorder?: () => void;
  onEdit?: (id: string) => void;
};

export function TimelineItemCard({
  id,
  title,
  time,
  music,
  announcementAttached,
  onDelete,
  onReorder,
  onEdit,
}: TimelineItemCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.copy}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <View style={styles.orderBadge}>
          <Text style={styles.orderText}>Reorder</Text>
        </View>
      </View>

      <View style={styles.metaBlock}>
        <Text style={styles.metaLabel}>Assigned Music</Text>
        <Text style={styles.metaValue}>{music}</Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Announcement</Text>
        <Text style={[styles.announceValue, announcementAttached ? styles.announceOn : styles.announceOff]}>
          {announcementAttached ? "Attached" : "None"}
        </Text>
      </View>

      <View style={styles.actions}>
        <ActionChip label="Edit item" onPress={() => onEdit?.(id)} />
        <ActionChip label="Delete item" onPress={() => onDelete?.(id)} />
        <ActionChip label="Reorder items" onPress={onReorder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(12,18,35,0.88)",
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: "rgba(37,224,255,0.12)",
    padding: spacing.lg,
    gap: spacing.md,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    gap: 6,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "800",
  },
  time: {
    color: colors.accentStrong,
    fontSize: 13,
    fontWeight: "700",
  },
  orderBadge: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    backgroundColor: "rgba(139,92,246,0.16)",
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.22)",
  },
  orderText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: "700",
  },
  metaBlock: {
    gap: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  metaLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.9,
  },
  metaValue: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  announceValue: {
    fontSize: 13,
    fontWeight: "700",
  },
  announceOn: {
    color: colors.success,
  },
  announceOff: {
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
