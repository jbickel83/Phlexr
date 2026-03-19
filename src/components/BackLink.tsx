import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../constants/theme";

type BackLinkProps = {
  label: string;
  onPress?: () => void;
};

export function BackLink({ label, onPress }: BackLinkProps) {
  return (
    <Pressable onPress={onPress} style={styles.link}>
      <Text style={styles.arrow}>{"<"}</Text>
      <View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    alignSelf: "flex-start",
  },
  arrow: {
    color: colors.accentStrong,
    fontSize: 18,
    fontWeight: "800",
  },
  label: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
});
