import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ActionChip } from "../components/ActionChip";
import { GlowCard } from "../components/GlowCard";
import { ScreenShell } from "../components/ScreenShell";
import { SelectionPill } from "../components/SelectionPill";
import { colors, radii, spacing } from "../constants/theme";
import { useAppState } from "../state/AppState";

const outputOptions = ["Bluetooth Speaker", "PA System", "Smart Speaker", "Venue Sound System"];

export function SettingsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { isOnline, selectedOutputLabel, setSelectedOutputLabel } = useAppState();
  const scrollRef = useRef<ScrollView | null>(null);
  const [howToUseY, setHowToUseY] = useState(0);

  const scrollToHowToUse = () => {
    if (route.params?.scrollTo !== "how-to-use") {
      return;
    }

    scrollRef.current?.scrollTo({
      y: Math.max(0, howToUseY - spacing.lg),
      animated: true,
    });
  };

  useEffect(() => {
    if (!howToUseY) {
      return;
    }
    const timeout = setTimeout(scrollToHowToUse, 80);
    return () => clearTimeout(timeout);
  }, [howToUseY, route.params?.scrollTo]);

  return (
    <ScreenShell
      scrollRef={scrollRef}
      onContentSizeChange={scrollToHowToUse}
      eyebrow="Settings"
      title="Audio output and event safety"
      description="Keep your output path clear, practical, and easy to recover during a real event."
    >
      <GlowCard title="Connectivity" subtitle="CrowdKue is designed to stay useful even without internet.">
        <View style={styles.statusRow}>
          <View style={[styles.statusPill, isOnline ? styles.onlinePill : styles.offlinePill]}>
            <Text style={styles.statusPillText}>{isOnline ? "Online" : "Offline"}</Text>
          </View>
          <Text style={styles.statusText}>
            {isOnline
              ? "Internet-dependent extras are available."
              : "Local event playback and manual control can still continue offline."}
          </Text>
        </View>
      </GlowCard>

      <GlowCard title="Output Device" subtitle="Choose the output path you plan to use before going live.">
        <View style={styles.optionWrap}>
          {outputOptions.map((option) => (
            <SelectionPill
              key={option}
              label={option}
              active={selectedOutputLabel === option}
              onPress={() => setSelectedOutputLabel(option)}
            />
          ))}
        </View>
        <Text style={styles.helperText}>
          {selectedOutputLabel
            ? `Current output plan: ${selectedOutputLabel}. You can reconnect audio output at any time.`
            : "No output selected yet. You can still run the event, and manual control is available while you connect audio."}
        </Text>
      </GlowCard>

      <GlowCard title="How to Connect" subtitle="Simple, real-world guidance for typical event audio setups.">
        <View style={styles.stack}>
          <LinearGradient colors={["rgba(37,224,255,0.1)", "rgba(12,18,35,0.85)"]} style={styles.guideCard}>
            <Text style={styles.guideTitle}>Bluetooth speakers</Text>
            <Text style={styles.guideBody}>1. Pair the phone or tablet in device Bluetooth settings.</Text>
            <Text style={styles.guideBody}>2. Play a short test track before guests arrive.</Text>
            <Text style={styles.guideBody}>3. Keep the device within range and charged.</Text>
          </LinearGradient>
          <LinearGradient colors={["rgba(139,92,246,0.12)", "rgba(12,18,35,0.85)"]} style={styles.guideCard}>
            <Text style={styles.guideTitle}>PA systems</Text>
            <Text style={styles.guideBody}>1. Connect through the venue mixer, adapter, or aux input.</Text>
            <Text style={styles.guideBody}>2. Confirm the correct channel is live with the venue team.</Text>
            <Text style={styles.guideBody}>3. Leave a backup cable nearby if possible.</Text>
          </LinearGradient>
          <LinearGradient colors={["rgba(62,224,137,0.12)", "rgba(12,18,35,0.85)"]} style={styles.guideCard}>
            <Text style={styles.guideTitle}>Smart speakers / external systems</Text>
            <Text style={styles.guideBody}>1. Confirm the speaker is already connected to the same local device.</Text>
            <Text style={styles.guideBody}>2. Keep system volume moderate and test announcements clearly.</Text>
            <Text style={styles.guideBody}>3. If anything drops, reconnect audio output to continue.</Text>
          </LinearGradient>
        </View>
      </GlowCard>

      <GlowCard title="Calm recovery" subtitle="If anything is interrupted, the event can continue.">
        <View style={styles.stack}>
          <Text style={styles.recoveryText}>Manual control is available.</Text>
          <Text style={styles.recoveryText}>You can resume the event at any time.</Text>
          <Text style={styles.recoveryText}>Reconnect audio output to continue if needed.</Text>
        </View>
      </GlowCard>

      <GlowCard
        title="How to use CrowdKue"
        subtitle="A step-by-step guide for building the event, running autopilot, and taking manual control when needed."
      >
        <View style={styles.stack} onLayout={(event) => setHowToUseY(event.nativeEvent.layout.y)}>
          <LinearGradient colors={["rgba(37,224,255,0.1)", "rgba(12,18,35,0.85)"]} style={styles.guideCard}>
            <Text style={styles.guideTitle}>1. Create your event</Text>
            <Text style={styles.guideBody}>Start on the Dashboard and tap Create New Event to enter the event name, type, date, time, location, and package details.</Text>
          </LinearGradient>
          <LinearGradient colors={["rgba(139,92,246,0.12)", "rgba(12,18,35,0.85)"]} style={styles.guideCard}>
            <Text style={styles.guideTitle}>2. Add timeline items</Text>
            <Text style={styles.guideBody}>Open the event hub, go to Timeline Builder, and add each key moment in order so CrowdKue knows what should happen next.</Text>
          </LinearGradient>
          <LinearGradient colors={["rgba(255,92,138,0.12)", "rgba(12,18,35,0.85)"]} style={styles.guideCard}>
            <Text style={styles.guideTitle}>3. Add announcements</Text>
            <Text style={styles.guideBody}>Open Announcements, create each message, and optionally attach it to a timeline item so it can trigger at the right cue.</Text>
          </LinearGradient>
          <LinearGradient colors={["rgba(62,224,137,0.12)", "rgba(12,18,35,0.85)"]} style={styles.guideCard}>
            <Text style={styles.guideTitle}>4. Add or upload songs</Text>
            <Text style={styles.guideBody}>Use the Music screen to add your event songs and playlists, then keep the music library saved locally for event-day playback.</Text>
          </LinearGradient>
          <LinearGradient colors={["rgba(37,224,255,0.1)", "rgba(12,18,35,0.85)"]} style={styles.guideCard}>
            <Text style={styles.guideTitle}>5. Assign songs to Track A and Track B</Text>
            <Text style={styles.guideBody}>In Uploaded Songs or Playlists, tap Add to Track A or Add to Track B to load a song into the left or right mixer deck before going live.</Text>
          </LinearGradient>
          <LinearGradient colors={["rgba(139,92,246,0.12)", "rgba(12,18,35,0.85)"]} style={styles.guideCard}>
            <Text style={styles.guideTitle}>6. Use autoplay / event autopilot</Text>
            <Text style={styles.guideBody}>Go to Live Event Mode and tap Start Event Autopilot so CrowdKue can move through the event timeline and trigger cues in sequence.</Text>
          </LinearGradient>
          <LinearGradient colors={["rgba(255,92,138,0.12)", "rgba(12,18,35,0.85)"]} style={styles.guideCard}>
            <Text style={styles.guideTitle}>7. Switch to manual mixer control</Text>
            <Text style={styles.guideBody}>Open the Mixer or manually load a deck track to take control directly. Manual override lets you decide exactly what plays next.</Text>
          </LinearGradient>
          <LinearGradient colors={["rgba(62,224,137,0.12)", "rgba(12,18,35,0.85)"]} style={styles.guideCard}>
            <Text style={styles.guideTitle}>8. Return to auto event flow</Text>
            <Text style={styles.guideBody}>When the manual track ends or you stop it, CrowdKue can return to the event autoplay flow so the rest of the timeline continues cleanly.</Text>
          </LinearGradient>
          <LinearGradient colors={["rgba(37,224,255,0.1)", "rgba(12,18,35,0.85)"]} style={styles.guideCard}>
            <Text style={styles.guideTitle}>9. Use live controls</Text>
            <Text style={styles.guideBody}>The Live Controls section lets you start, pause, resume, skip, restart, go back, open the mixer, or reset live progress during the event.</Text>
          </LinearGradient>
          <LinearGradient colors={["rgba(139,92,246,0.12)", "rgba(12,18,35,0.85)"]} style={styles.guideCard}>
            <Text style={styles.guideTitle}>10. Understand how announcements work</Text>
            <Text style={styles.guideBody}>Announcements can be previewed manually, triggered by a live cue, or spoken automatically when the timeline reaches the linked event moment.</Text>
          </LinearGradient>
          <LinearGradient colors={["rgba(255,176,32,0.12)", "rgba(12,18,35,0.85)"]} style={styles.guideCard}>
            <Text style={styles.guideTitle}>11. Prepare before an event</Text>
            <Text style={styles.guideBody}>Before guests arrive, confirm the timeline is complete, songs are assigned, announcements are ready, and your output device is connected and tested.</Text>
          </LinearGradient>
        </View>
      </GlowCard>

      <View style={styles.feedbackRow}>
        <ActionChip label="Send Feedback" onPress={() => navigation.getParent()?.navigate("Feedback")} />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  statusRow: { gap: spacing.md },
  statusPill: {
    alignSelf: "flex-start",
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderWidth: 1,
  },
  onlinePill: {
    backgroundColor: "rgba(62,224,137,0.12)",
    borderColor: "rgba(62,224,137,0.24)",
  },
  offlinePill: {
    backgroundColor: "rgba(255,176,32,0.12)",
    borderColor: "rgba(255,176,32,0.28)",
  },
  statusPillText: { color: colors.textPrimary, fontSize: 12, fontWeight: "800" },
  statusText: { color: colors.textPrimary, fontSize: 14, lineHeight: 21 },
  optionWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  helperText: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginTop: spacing.md },
  stack: { gap: spacing.md },
  guideCard: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "rgba(152,167,204,0.14)",
    padding: spacing.md,
    gap: spacing.sm,
  },
  guideTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: "800" },
  guideBody: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  recoveryText: { color: colors.textPrimary, fontSize: 14, lineHeight: 21 },
  feedbackRow: { alignItems: "flex-start" },
});
