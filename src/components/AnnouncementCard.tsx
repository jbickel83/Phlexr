import { StyleSheet, Text, View } from "react-native";

import { ActionChip } from "./ActionChip";
import { colors, radii, spacing } from "../constants/theme";

type AnnouncementCardProps = {
  id: string;
  title: string;
  timelineMoment: string;
  previewText: string;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onPlay?: (id: string) => void;
};

export function AnnouncementCard({
  id,
  title,
  timelineMoment,
  previewText,
  onDelete,
  onEdit,
  onPlay,
}: AnnouncementCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.moment}>{timelineMoment}</Text>
        </View>
      </View>
      <Text style={styles.preview}>{previewText}</Text>
      <View style={styles.actions}>
        <ActionChip label="Play announcement" onPress={() => onPlay?.(id)} />
        <ActionChip label="Edit announcement" onPress={() => onEdit?.(id)} />
        <ActionChip label="Delete announcement" onPress={() => onDelete?.(id)} />
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
  header: {
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
  moment: {
    color: colors.accentStrong,
    fontSize: 13,
    fontWeight: "700",
  },
  preview: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
