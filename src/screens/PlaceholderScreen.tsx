import { StyleSheet, Text, View } from "react-native";

import { GlowCard } from "../components/GlowCard";
import { ScreenShell } from "../components/ScreenShell";
import { colors, spacing } from "../constants/theme";

type PlaceholderScreenProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PlaceholderScreen({ eyebrow, title, description }: PlaceholderScreenProps) {
  return (
    <ScreenShell eyebrow={eyebrow} title={title} description={description}>
      <GlowCard title="Coming Next" subtitle="This tab is intentionally UI-only for now.">
        <View style={styles.wrap}>
          <Text style={styles.text}>
            Frontend navigation is scaffolded, but no backend or event logic has been wired yet.
          </Text>
        </View>
      </GlowCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  text: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },
});
