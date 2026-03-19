import { StyleSheet, Text, View } from "react-native";

import { ActionChip } from "./ActionChip";
import { colors, radii, spacing } from "../constants/theme";

type SongLibraryCardProps = {
  id: string;
  songName: string;
  artist?: string;
  duration: string;
  fileType: string;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
  onReorder?: () => void;
  onAssignTrackA?: (id: string) => void;
  onAssignTrackB?: (id: string) => void;
};

export function SongLibraryCard({
  id,
  songName,
  artist,
  duration,
  fileType,
  onDelete,
  onAdd,
  onReorder,
  onAssignTrackA,
  onAssignTrackB,
}: SongLibraryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.copy}>
          <Text style={styles.songName}>{songName}</Text>
          <Text style={styles.meta}>
            {artist?.trim() ? `${artist} | ` : ""}
            {duration} | {fileType}
          </Text>
        </View>
        <View style={styles.reorderBadge}>
          <Text style={styles.reorderText}>Reorder</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <ActionChip label="Add song" onPress={onAdd} />
        <ActionChip label="Add to Track A" onPress={() => onAssignTrackA?.(id)} />
        <ActionChip label="Add to Track B" onPress={() => onAssignTrackB?.(id)} />
        <ActionChip label="Delete song" onPress={() => onDelete?.(id)} />
        <ActionChip label="Reorder songs" onPress={onReorder} />
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
  songName: {
    color: colors.textPrimary,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "800",
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
  },
  reorderBadge: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    backgroundColor: "rgba(139,92,246,0.16)",
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.22)",
  },
  reorderText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
