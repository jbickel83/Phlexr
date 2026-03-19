import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

import { GlowCard } from "../components/GlowCard";
import { NeonButton } from "../components/NeonButton";
import { colors, radii, spacing } from "../constants/theme";
import { useAppState } from "../state/AppState";

export function WelcomeScreen() {
  const navigation = useNavigation<any>();
  const { startDemoEvent, beginNewEventDraft, isHydrating } = useAppState();

  return (
    <LinearGradient
      colors={["#04070F", "#071120", "#0A1730"]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.screen}
    >
      <View style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.logoRow}>
            <View style={styles.logoPulse} />
            <Text style={styles.brand}>CrowdKue</Text>
          </View>
          <Text style={styles.title}>Event autopilot for weddings and live celebrations.</Text>
          <Text style={styles.subtitle}>
            Run music timing, announcements, and event flow from local audio files with a polished live control experience.
          </Text>
        </View>

        <GlowCard style={styles.choiceCard}>
          <Text style={styles.choiceTitle}>Choose your starting point</Text>
          <Text style={styles.choiceBody}>
            Try the full wedding demo instantly or jump straight into building your own event.
          </Text>
          {isHydrating ? (
            <Text style={styles.loadingText}>Preparing your local CrowdKue workspace...</Text>
          ) : (
            <View style={styles.buttonStack}>
              <NeonButton
                label="Start Demo"
                onPress={() => {
                  startDemoEvent();
                  navigation.replace("MainTabs", { screen: "Events", params: { screen: "EventOverview" } });
                }}
              />
              <NeonButton
                label="Create Your Event"
                variant="secondary"
                onPress={() => {
                  beginNewEventDraft();
                  navigation.replace("MainTabs", { screen: "Events", params: { screen: "CreateEvent" } });
                }}
              />
            </View>
          )}
        </GlowCard>

        <GlowCard style={styles.demoCard}>
          <Text style={styles.demoEyebrow}>Demo Event</Text>
          <Text style={styles.demoTitle}>Jordan & Avery Wedding</Text>
          <Text style={styles.demoBody}>
            Preloaded with a complete timeline, music assignments, announcements, and live controls so you can run Event Autopilot immediately.
          </Text>
        </GlowCard>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: 72, paddingBottom: 36, justifyContent: "space-between", gap: spacing.xl },
  hero: { gap: spacing.md },
  logoRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  logoPulse: {
    width: 16,
    height: 16,
    borderRadius: radii.pill,
    backgroundColor: colors.accentStrong,
    shadowColor: colors.accentStrong,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 14,
    elevation: 8,
  },
  brand: { color: colors.textPrimary, fontSize: 22, fontWeight: "800", letterSpacing: 0.4 },
  title: { color: colors.textPrimary, fontSize: 38, lineHeight: 42, fontWeight: "800" },
  subtitle: { color: colors.textSecondary, fontSize: 15, lineHeight: 23, maxWidth: 340 },
  choiceCard: { gap: spacing.md },
  choiceTitle: { color: colors.textPrimary, fontSize: 22, fontWeight: "800" },
  choiceBody: { color: colors.textSecondary, fontSize: 14, lineHeight: 21 },
  loadingText: { color: colors.textSecondary, fontSize: 14, lineHeight: 21, marginTop: spacing.sm },
  buttonStack: { gap: spacing.sm, marginTop: spacing.sm },
  demoCard: { gap: spacing.sm },
  demoEyebrow: { color: colors.accent, fontSize: 12, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1 },
  demoTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: "800" },
  demoBody: { color: colors.textSecondary, fontSize: 14, lineHeight: 21 },
});
