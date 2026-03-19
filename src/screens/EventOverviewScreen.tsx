import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { GlowCard } from "../components/GlowCard";
import { HubActionCard } from "../components/HubActionCard";
import { NeonButton } from "../components/NeonButton";
import { SummaryStatCard } from "../components/SummaryStatCard";
import { colors, radii, spacing } from "../constants/theme";
import { useAppState } from "../state/AppState";

export function EventOverviewScreen() {
  const navigation = useNavigation<any>();
  const { currentEvent, timelineItems, songs, announcements, selectedOutputLabel, isOnline } = useAppState();
  const isDemoEvent = currentEvent.status.toLowerCase().includes("demo event");
  const timelineReady = timelineItems.length > 0;
  const musicAssigned = timelineItems.length > 0 && timelineItems.every((item) => item.music.trim() && item.music.trim() !== "Select Song");
  const announcementsReady = announcements.length > 0;
  const outputReady = Boolean(selectedOutputLabel);
  const readinessItems = [
    { label: "Timeline added", ready: timelineReady },
    { label: "Music assigned", ready: musicAssigned },
    { label: "Announcements ready", ready: announcementsReady },
    { label: "Output device connected", ready: outputReady },
  ];

  return (
    <LinearGradient colors={["#04070F", "#071120", "#0A1730"]} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{isDemoEvent ? "Demo Event" : "Event Overview"}</Text>
          <Text style={styles.title}>{currentEvent.name || "Untitled Event"}</Text>
          <Text style={styles.meta}>
            {currentEvent.date && currentEvent.startTime
              ? `${currentEvent.date} at ${currentEvent.startTime}`
              : "Save an event to start building the run of show."}
          </Text>
        </View>

        <GlowCard style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroCopy}>
              <Text style={styles.statusLabel}>Current Status</Text>
              <Text style={styles.statusValue}>{currentEvent.status}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{currentEvent.type}</Text>
            </View>
          </View>
          <Text style={styles.heroBody}>
            {currentEvent.location || "Location not set"} | {currentEvent.packageType || "Package not set"}
          </Text>
          <View style={styles.statusRow}>
            <View style={[styles.infoPill, isOnline ? styles.infoPillSuccess : styles.infoPillWarning]}>
              <Text style={styles.infoPillText}>{isOnline ? "Online" : "Offline ready"}</Text>
            </View>
            <View style={[styles.infoPill, outputReady ? styles.infoPillCyan : styles.infoPillWarning]}>
              <Text style={styles.infoPillText}>{outputReady ? selectedOutputLabel : "No output selected"}</Text>
            </View>
          </View>
          <NeonButton label="Start Event" onPress={() => navigation.getParent()?.navigate("Live")} />
        </GlowCard>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pre-Event Readiness</Text>
          <GlowCard subtitle="Make sure the essentials are covered before going live.">
            <View style={styles.checklist}>
              {readinessItems.map((item) => (
                <View key={item.label} style={styles.checkRow}>
                  <View style={[styles.checkDot, item.ready ? styles.checkDotReady : styles.checkDotPending]} />
                  <View style={styles.checkCopy}>
                    <Text style={styles.checkLabel}>{item.label}</Text>
                    <Text style={[styles.checkState, item.ready ? styles.checkStateReady : styles.checkStatePending]}>
                      {item.ready ? "Ready" : "Needs attention"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </GlowCard>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Summary</Text>
          <View style={styles.summaryRow}>
            <SummaryStatCard label="timeline items" value={String(timelineItems.length)} />
            <SummaryStatCard label="songs uploaded" value={String(songs.length)} />
            <SummaryStatCard label="announcements" value={String(announcements.length)} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Controls</Text>
          <View style={styles.actionGrid}>
            <HubActionCard title="Edit Timeline" onPress={() => navigation.navigate("TimelineBuilder")} />
            <HubActionCard title="Music / Playlists" onPress={() => navigation.getParent()?.navigate("Music")} />
            <HubActionCard title="Announcements" onPress={() => navigation.navigate("Announcements")} />
            <HubActionCard title="Live Mode" onPress={() => navigation.getParent()?.navigate("Live")} />
            <HubActionCard
              title="DJ Mixing Board"
              onPress={() => navigation.getParent()?.navigate("Mixer")}
            />
            <HubActionCard title="Audio Output" onPress={() => navigation.getParent()?.navigate("Settings")} />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingTop: spacing.xl, paddingHorizontal: spacing.lg, paddingBottom: 120, gap: spacing.xl },
  header: { gap: spacing.xs },
  eyebrow: { color: colors.accent, textTransform: "uppercase", letterSpacing: 1.1, fontSize: 12, fontWeight: "800" },
  title: { color: colors.textPrimary, fontSize: 32, lineHeight: 36, fontWeight: "800" },
  meta: { color: colors.textSecondary, fontSize: 15, lineHeight: 22 },
  heroCard: { gap: spacing.lg },
  heroTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: spacing.md },
  heroCopy: { flex: 1, gap: 6 },
  statusLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1 },
  statusValue: { color: colors.textPrimary, fontSize: 28, lineHeight: 32, fontWeight: "800" },
  badge: { borderRadius: radii.pill, paddingHorizontal: spacing.md, paddingVertical: 10, backgroundColor: "rgba(139,92,246,0.18)", borderWidth: 1, borderColor: "rgba(139,92,246,0.24)" },
  badgeText: { color: colors.textPrimary, fontSize: 12, fontWeight: "700" },
  heroBody: { color: colors.textSecondary, fontSize: 14, lineHeight: 21 },
  statusRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  infoPill: { borderRadius: radii.pill, paddingHorizontal: spacing.md, paddingVertical: 8, borderWidth: 1 },
  infoPillSuccess: { backgroundColor: "rgba(62,224,137,0.12)", borderColor: "rgba(62,224,137,0.24)" },
  infoPillWarning: { backgroundColor: "rgba(255,176,32,0.12)", borderColor: "rgba(255,176,32,0.24)" },
  infoPillCyan: { backgroundColor: "rgba(37,224,255,0.12)", borderColor: "rgba(37,224,255,0.24)" },
  infoPillText: { color: colors.textPrimary, fontSize: 12, fontWeight: "800" },
  section: { gap: spacing.md },
  sectionTitle: { color: colors.textPrimary, fontSize: 21, fontWeight: "800" },
  checklist: { gap: spacing.md },
  checkRow: { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  checkDot: { width: 12, height: 12, borderRadius: radii.pill },
  checkDotReady: { backgroundColor: colors.success },
  checkDotPending: { backgroundColor: colors.warning },
  checkCopy: { flex: 1, gap: 2 },
  checkLabel: { color: colors.textPrimary, fontSize: 15, fontWeight: "700" },
  checkState: { fontSize: 12, fontWeight: "700" },
  checkStateReady: { color: colors.success },
  checkStatePending: { color: colors.warning },
  summaryRow: { flexDirection: "row", gap: spacing.sm },
  actionGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
});
