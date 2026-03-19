import { StyleSheet, Text, View } from "react-native";

import { ActionChip } from "./ActionChip";
import { colors, radii, spacing } from "../constants/theme";

type PlaylistCardProps = {
  name: string;
  detail: string;
  onCreate?: () => void;
  onAssign?: () => void;
};

export function PlaylistCard({ name, detail, onCreate, onAssign }: PlaylistCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.detail}>{detail}</Text>
      <View style={styles.actions}>
        <ActionChip label="Create playlist" onPress={onCreate} />
        <ActionChip label="Assign songs" onPress={onAssign} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(13,19,36,0.92)",
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.18)",
    padding: spacing.lg,
    gap: spacing.md,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "800",
  },
  detail: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
