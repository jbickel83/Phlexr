import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ActionChip } from "../components/ActionChip";
import { EmptyStateCard } from "../components/EmptyStateCard";
import { GlowCard } from "../components/GlowCard";
import { LiveStatusTile } from "../components/LiveStatusTile";
import { NeonButton } from "../components/NeonButton";
import { TimelineProgressIndicator } from "../components/TimelineProgressIndicator";
import { colors, radii, spacing } from "../constants/theme";
import { useAppState } from "../state/AppState";

function formatMillis(value: number) {
  if (!value || value <= 0) {
    return "0:00";
  }
  const totalSeconds = Math.floor(value / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function LiveEventModeScreen() {
  const navigation = useNavigation<any>();
  const {
    currentEvent,
    timelineItems,
    announcements,
    isOnline,
    selectedOutputLabel,
    liveIndex,
    autopilotRunning,
    manualOverride,
    countdownSeconds,
    activeAnnouncementTitle,
    announcementState,
    currentAnnouncementText,
    nextAnnouncementTitle,
    nextAnnouncementText,
    speechSupported,
    speechSpeaking,
    speechMessage,
    currentTrackName,
    playbackState,
    playbackPositionMillis,
    playbackDurationMillis,
    audioWarning,
    currentTrackFallback,
    startAutopilot,
    pauseAutopilot,
    resumeAutopilot,
    skipToNextTimelineItem,
    goToPreviousTimelineItem,
    restartCurrentTimelineItem,
    toggleManualOverride,
    triggerManualAnnouncement,
    dismissAnnouncement,
    stopAnnouncementSpeech,
    resetLiveProgress,
  } = useAppState();

  const currentItem = timelineItems[liveIndex] ?? null;
  const nextItem = currentItem ? timelineItems[liveIndex + 1] ?? null : null;
  const currentItemMissingMusic = Boolean(
    currentItem && (!currentItem.music.trim() || currentItem.music.trim() === "Select Song"),
  );
  const eventProgressPercent =
    timelineItems.length > 0 ? Math.round(((liveIndex + (currentItem ? 1 : 0)) / timelineItems.length) * 100) : 0;
  const progressSteps = timelineItems.map((item, index) => ({
    id: item.id,
    label: item.title,
    time: item.time,
    state: index < liveIndex ? ("complete" as const) : index === liveIndex ? ("current" as const) : ("upcoming" as const),
  }));
  const playbackProgress =
    playbackDurationMillis > 0 ? Math.min(playbackPositionMillis / playbackDurationMillis, 1) : 0;

  const canResumeEvent = !manualOverride && !autopilotRunning && liveIndex > 0;
  const primaryLabel = manualOverride
    ? "Resume Event Autopilot"
    : autopilotRunning
      ? "Pause Event Autopilot"
      : canResumeEvent
        ? "Resume Event"
        : "Start Event Autopilot";

  const handlePrimaryAction = () => {
    if (manualOverride) {
      resumeAutopilot();
      return;
    }
    if (autopilotRunning) {
      pauseAutopilot();
      return;
    }
    startAutopilot();
  };

  const liveStateLabel = manualOverride ? "Manual Override" : autopilotRunning ? "Autopilot Live" : "Autopilot Paused";
  const autoplayState = autopilotRunning && !manualOverride ? "ON" : "OFF";

  return (
    <LinearGradient colors={["#04070F", "#071120", "#0A1730"]} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Live Event Mode</Text>
          <Text style={styles.title}>{currentEvent.name || "Untitled Event"}</Text>
          <Text style={styles.subtitle}>Mission control for live cueing, automation oversight, and manual intervention.</Text>
        </View>

        <View style={styles.readinessBannerRow}>
          <View style={[styles.bannerCard, isOnline ? styles.bannerCardOnline : styles.bannerCardOffline]}>
            <Text style={styles.bannerTitle}>{isOnline ? "Online" : "Offline"}</Text>
            <Text style={styles.bannerText}>
              {isOnline
                ? "Internet-dependent extras are available."
                : "Local event playback can still continue. Internet-dependent extras may be unavailable."}
            </Text>
          </View>
          <View style={[styles.bannerCard, styles.bannerCardNeutral]}>
            <Text style={styles.bannerTitle}>Audio Output</Text>
            <Text style={styles.bannerText}>
              {selectedOutputLabel
                ? `${selectedOutputLabel} selected. Reconnect audio output to continue if needed.`
                : "No output selected yet. Manual control is available while you connect one."}
            </Text>
          </View>
        </View>

        {audioWarning ? (
          <View style={styles.warningCard}>
            <Text style={styles.warningLabel}>Local Audio Warning</Text>
            <Text style={styles.warningText}>{audioWarning}</Text>
          </View>
        ) : null}

        {currentItemMissingMusic ? (
          <View style={styles.warningCard}>
            <Text style={styles.warningLabel}>Timeline Audio Missing</Text>
            <Text style={styles.warningText}>
              The active timeline item does not have a song or playlist assigned yet. CrowdKue will stay in control mode and wait for the next cue.
            </Text>
          </View>
        ) : null}

        <GlowCard style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroCopy}>
              <Text style={styles.heroLabel}>Current Timeline Item</Text>
              <Text style={styles.heroValue}>{currentItem?.title ?? "No timeline item yet"}</Text>
            </View>
            <View style={[styles.liveBadge, manualOverride && styles.overrideBadge]}>
              <Text style={[styles.liveBadgeText, manualOverride && styles.overrideBadgeText]}>{liveStateLabel}</Text>
            </View>
          </View>

          <View style={styles.modeRow}>
            <View style={styles.modePill}>
              <Text style={styles.modeLabel}>Autoplay {autoplayState}</Text>
            </View>
            <View style={[styles.modePill, manualOverride && styles.modePillAlert]}>
              <Text style={[styles.modeLabel, manualOverride && styles.modeLabelAlert]}>
                {manualOverride ? "Manual override active" : "Auto cue control"}
              </Text>
            </View>
          </View>

          <View style={styles.countdownWrap}>
            <Text style={styles.countdownLabel}>Countdown Timer</Text>
            <Text style={styles.countdownValue}>{currentItem ? `00:${String(countdownSeconds).padStart(2, "0")}` : "--:--"}</Text>
          </View>

          <View style={styles.timelineSpotlightRow}>
            <View style={[styles.timelineSpotlightCard, styles.timelineSpotlightActive]}>
              <Text style={styles.timelineSpotlightLabel}>Active now</Text>
              <Text style={styles.timelineSpotlightTitle}>{currentItem?.title ?? "No timeline item yet"}</Text>
              <Text style={styles.timelineSpotlightMeta}>{currentItem?.time ?? "Waiting for timeline"}</Text>
            </View>
            <View style={styles.timelineSpotlightCard}>
              <Text style={styles.timelineSpotlightLabel}>Next up</Text>
              <Text style={styles.timelineSpotlightTitle}>{nextItem?.title ?? "No next item"}</Text>
              <Text style={styles.timelineSpotlightMeta}>{nextItem?.time ?? "End of event queue"}</Text>
            </View>
          </View>

          <View style={styles.statusGrid}>
            <LiveStatusTile label="Event status" value={currentEvent.status || "Ready"} accent="green" />
            <LiveStatusTile label="Autoplay status" value={autoplayState} accent="purple" />
            <LiveStatusTile label="Manual control" value={manualOverride ? "Override Active" : "Available"} accent="cyan" />
            <LiveStatusTile label="Track state" value={playbackState.toUpperCase()} accent="cyan" />
          </View>

          <View style={styles.statusGrid}>
            <LiveStatusTile
              label="Now playing track"
              value={currentTrackName ?? (currentItemMissingMusic ? "No song assigned" : "No track loaded")}
              accent="cyan"
            />
            <LiveStatusTile label="Event progress" value={`${eventProgressPercent}%`} accent="purple" />
            <LiveStatusTile label="Announcements" value={String(announcements.length)} accent="green" />
          </View>
        </GlowCard>

        {announcements.length === 0 ? (
          <EmptyStateCard
            title="Add announcements for key moments"
            description="Create guest-facing messages for entrances, dances, and key transitions to show them here during live control."
          />
        ) : (
          <GlowCard title="Announcement Control" subtitle="Linked announcements fire with timeline progression and can also be handled manually.">
            <View style={styles.announcementTopRow}>
              <View style={styles.announcementCopy}>
                <Text style={styles.announcementLabel}>Announcement State</Text>
                <Text
                  style={[
                    styles.announcementState,
                    announcementState === "active" && styles.announcementActive,
                    announcementState === "completed" && styles.announcementCompleted,
                    announcementState === "pending" && styles.announcementPending,
                  ]}
                >
                  {announcementState.toUpperCase()}
                </Text>
              </View>
              <View style={styles.announcementBadge}>
                <Text style={styles.announcementBadgeText}>{activeAnnouncementTitle ?? nextAnnouncementTitle ?? "No announcement"}</Text>
              </View>
            </View>
            <View style={styles.announcementPanel}>
              <Text style={styles.announcementTextTitle}>
                {announcementState === "pending"
                  ? "Next linked announcement"
                  : announcementState === "completed"
                    ? "Completed announcement"
                    : "Current announcement"}
              </Text>
              <Text style={styles.announcementText}>
                {currentAnnouncementText ??
                  (nextAnnouncementText ?? (nextAnnouncementTitle ? `${nextAnnouncementTitle} is queued for an upcoming timeline item.` : "No linked announcement is ready right now."))}
              </Text>
              <Text style={styles.announcementMeta}>
                {speechSupported
                  ? speechSpeaking
                    ? "Voice announcement is playing now."
                    : speechMessage ?? "Voice announcement is ready."
                  : "Voice playback is unavailable on this device. Manual control is still available."}
              </Text>
            </View>
            <View style={styles.secondaryControls}>
              <ActionChip label="Trigger Announcement" onPress={triggerManualAnnouncement} />
              <ActionChip label="Stop Announcement" onPress={stopAnnouncementSpeech} />
              <ActionChip label="Dismiss Announcement" onPress={dismissAnnouncement} />
            </View>
          </GlowCard>
        )}

        <GlowCard title="Playback" subtitle="Local audio playback only. No streaming integrations.">
          <View style={styles.playbackHeader}>
            <Text style={styles.playbackTrack}>{currentTrackName ?? "No track loaded"}</Text>
            <Text style={styles.playbackState}>{playbackState.toUpperCase()}</Text>
          </View>
          {currentTrackFallback ? <Text style={styles.fallbackText}>{currentTrackFallback}</Text> : null}
          {!selectedOutputLabel ? (
            <Text style={styles.fallbackText}>
              No output selected. Connect Bluetooth, PA, or another sound system to continue. Manual control is available.
            </Text>
          ) : null}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${playbackProgress * 100}%` }]} />
          </View>
          <View style={styles.progressMeta}>
            <Text style={styles.progressText}>{formatMillis(playbackPositionMillis)}</Text>
            <Text style={styles.progressText}>{formatMillis(playbackDurationMillis)}</Text>
          </View>
        </GlowCard>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Controls</Text>
          <View style={styles.primaryControls}>
            <NeonButton label={primaryLabel} onPress={handlePrimaryAction} />
            <NeonButton label={manualOverride ? "Exit Manual Override" : "Manual Override"} variant="secondary" onPress={toggleManualOverride} />
          </View>
          <View style={styles.secondaryControls}>
            <ActionChip label="Open DJ Mixing Board" onPress={() => navigation.getParent()?.navigate("Mixer")} />
            <ActionChip label="Go to previous item" onPress={goToPreviousTimelineItem} />
            <ActionChip label="Restart current item" onPress={restartCurrentTimelineItem} />
            <ActionChip label="Skip to next timeline item" onPress={skipToNextTimelineItem} />
            <ActionChip label="Reset Event" onPress={resetLiveProgress} />
          </View>
        </View>

        {timelineItems.length === 0 ? (
          <EmptyStateCard title="Add your first timeline moment" description="Build the event timeline before running Live Event Mode." />
        ) : (
          <GlowCard title="Event Progress" subtitle="Track what has completed, what is live now, and what is coming next.">
            <TimelineProgressIndicator steps={progressSteps} completionLabel={`${eventProgressPercent}% of event flow reached`} />
          </GlowCard>
        )}
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
  subtitle: { color: colors.textSecondary, fontSize: 15, lineHeight: 22, maxWidth: 330 },
  readinessBannerRow: { gap: spacing.sm },
  bannerCard: { borderRadius: radii.lg, padding: spacing.md, borderWidth: 1, gap: 6 },
  bannerCardOnline: { backgroundColor: "rgba(62,224,137,0.1)", borderColor: "rgba(62,224,137,0.22)" },
  bannerCardOffline: { backgroundColor: "rgba(255,176,32,0.1)", borderColor: "rgba(255,176,32,0.24)" },
  bannerCardNeutral: { backgroundColor: "rgba(37,224,255,0.08)", borderColor: "rgba(37,224,255,0.16)" },
  bannerTitle: { color: colors.textPrimary, fontSize: 12, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.8 },
  bannerText: { color: colors.textPrimary, fontSize: 14, lineHeight: 20 },
  warningCard: { borderRadius: radii.lg, padding: spacing.lg, backgroundColor: "rgba(255,176,32,0.12)", borderWidth: 1, borderColor: "rgba(255,176,32,0.28)", gap: 6 },
  warningLabel: { color: colors.warning, fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1 },
  warningText: { color: colors.textPrimary, fontSize: 14, lineHeight: 20 },
  heroCard: { gap: spacing.lg },
  heroTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: spacing.md },
  heroCopy: { flex: 1, gap: 6 },
  heroLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1 },
  heroValue: { color: colors.textPrimary, fontSize: 28, lineHeight: 32, fontWeight: "800" },
  liveBadge: { borderRadius: radii.pill, paddingHorizontal: spacing.md, paddingVertical: 10, backgroundColor: "rgba(37,224,255,0.14)", borderWidth: 1, borderColor: "rgba(37,224,255,0.24)" },
  liveBadgeText: { color: colors.accentStrong, fontSize: 12, fontWeight: "800" },
  overrideBadge: { backgroundColor: "rgba(255,92,138,0.14)", borderColor: "rgba(255,92,138,0.24)" },
  overrideBadgeText: { color: colors.danger },
  modeRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  modePill: { borderRadius: radii.pill, paddingHorizontal: spacing.md, paddingVertical: 8, backgroundColor: "rgba(12,18,35,0.88)", borderWidth: 1, borderColor: "rgba(37,224,255,0.12)" },
  modePillAlert: { borderColor: "rgba(255,92,138,0.28)", backgroundColor: "rgba(255,92,138,0.1)" },
  modeLabel: { color: colors.textPrimary, fontSize: 12, fontWeight: "800" },
  modeLabelAlert: { color: colors.danger },
  countdownWrap: { alignItems: "center", justifyContent: "center", backgroundColor: "rgba(8, 12, 24, 0.56)", borderRadius: radii.lg, paddingVertical: spacing.lg, gap: 8 },
  countdownLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1 },
  countdownValue: { color: colors.accentStrong, fontSize: 52, lineHeight: 58, fontWeight: "800" },
  timelineSpotlightRow: { gap: spacing.sm },
  timelineSpotlightCard: { borderRadius: radii.lg, padding: spacing.md, backgroundColor: "rgba(10,16,32,0.8)", borderWidth: 1, borderColor: "rgba(152,167,204,0.12)", gap: 4 },
  timelineSpotlightActive: { borderColor: "rgba(37,224,255,0.24)", backgroundColor: "rgba(37,224,255,0.08)" },
  timelineSpotlightLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.9 },
  timelineSpotlightTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: "800" },
  timelineSpotlightMeta: { color: colors.textSecondary, fontSize: 13, fontWeight: "700" },
  statusGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  announcementTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: spacing.md },
  announcementCopy: { flex: 1, gap: 6 },
  announcementLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1 },
  announcementState: { color: colors.textPrimary, fontSize: 26, fontWeight: "800" },
  announcementPending: { color: colors.warning },
  announcementActive: { color: colors.danger },
  announcementCompleted: { color: colors.success },
  announcementBadge: { borderRadius: radii.pill, paddingHorizontal: spacing.md, paddingVertical: 10, backgroundColor: "rgba(255,92,138,0.14)", borderWidth: 1, borderColor: "rgba(255,92,138,0.24)" },
  announcementBadgeText: { color: colors.textPrimary, fontSize: 12, fontWeight: "700" },
  announcementPanel: { borderRadius: radii.lg, backgroundColor: "rgba(255,92,138,0.08)", padding: spacing.lg, gap: spacing.sm },
  announcementTextTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: "800" },
  announcementText: { color: colors.textPrimary, fontSize: 15, lineHeight: 22 },
  announcementMeta: { color: colors.textSecondary, fontSize: 13, lineHeight: 18 },
  playbackHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.md },
  playbackTrack: { flex: 1, color: colors.textPrimary, fontSize: 17, fontWeight: "800" },
  playbackState: { color: colors.accentStrong, fontSize: 12, fontWeight: "800" },
  fallbackText: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginTop: spacing.sm },
  progressTrack: { height: 10, borderRadius: radii.pill, backgroundColor: "rgba(8,12,24,0.56)", overflow: "hidden", marginTop: spacing.md },
  progressFill: { height: "100%", backgroundColor: colors.accentStrong, borderRadius: radii.pill },
  progressMeta: { flexDirection: "row", justifyContent: "space-between", marginTop: spacing.sm },
  progressText: { color: colors.textSecondary, fontSize: 12, fontWeight: "700" },
  section: { gap: spacing.md },
  sectionTitle: { color: colors.textPrimary, fontSize: 21, fontWeight: "800" },
  primaryControls: { gap: spacing.sm },
  secondaryControls: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
});
