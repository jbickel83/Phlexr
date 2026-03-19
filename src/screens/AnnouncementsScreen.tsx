import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useMemo, useState } from "react";

import { AnnouncementCard } from "../components/AnnouncementCard";
import { BackLink } from "../components/BackLink";
import { EmptyStateCard } from "../components/EmptyStateCard";
import { GlowCard } from "../components/GlowCard";
import { NeonButton } from "../components/NeonButton";
import { SelectionPill } from "../components/SelectionPill";
import { TextFieldInput } from "../components/TextFieldInput";
import { colors, spacing } from "../constants/theme";
import { useAppState } from "../state/AppState";

export function AnnouncementsScreen() {
  const navigation = useNavigation<any>();
  const {
    announcements,
    timelineItems,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    saveCurrentEventSnapshot,
    isHydrating,
    availableVoiceOptions,
    selectedVoiceName,
    speechRate,
    speechSupported,
    speechSpeaking,
    speechMessage,
    speakAnnouncement,
    stopAnnouncementSpeech,
    setSelectedVoiceName,
    setSpeechRate,
  } = useAppState();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [messageText, setMessageText] = useState("");
  const [timelineMoment, setTimelineMoment] = useState("No assignment");

  const timelineAssignments = useMemo(() => ["No assignment", ...timelineItems.map((item) => item.title)], [timelineItems]);

  const startEditing = (id: string) => {
    const found = announcements.find((item) => item.id === id);
    if (!found) {
      return;
    }
    setEditingId(id);
    setTitle(found.title);
    setMessageText(found.previewText);
    setTimelineMoment(found.timelineMoment || "No assignment");
  };

  const resetEditor = () => {
    setEditingId(null);
    setTitle("");
    setMessageText("");
    setTimelineMoment("No assignment");
  };

  const previewAnnouncementText = messageText.trim() || announcements[0]?.previewText || "";
  const previewAnnouncementTitle = title.trim() || announcements[0]?.title || "Announcement Preview";
  const getVisibleVoiceLabel = (label: string) => (label === "US Male" ? "House Voice" : label);

  return (
    <LinearGradient colors={["#04070F", "#071120", "#0A1730"]} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackLink label="Back to Event Overview" onPress={() => navigation.goBack()} />
          <Text style={styles.eyebrow}>Announcements</Text>
          <Text style={styles.title}>Create and manage event announcements.</Text>
          <Text style={styles.subtitle}>
            Keep every guest-facing message organized, timed, and ready for live event control.
          </Text>
        </View>

        <GlowCard style={styles.editorCard}>
          <Text style={styles.sectionTitle}>{editingId ? "Edit announcement" : "Create announcement"}</Text>
          <View style={styles.editorFields}>
            <TextFieldInput label="Announcement title" value={title} onChangeText={setTitle} placeholder="Grand Entrance" />
            <TextFieldInput label="Message text" value={messageText} onChangeText={setMessageText} placeholder="Please welcome the wedding party..." multiline />
          </View>
          <View style={styles.assignmentBlock}>
            <Text style={styles.assignmentLabel}>Optional timeline assignment</Text>
            <View style={styles.pillWrap}>
              {timelineAssignments.map((item) => (
                <SelectionPill key={item} label={item} active={timelineMoment === item} onPress={() => setTimelineMoment(item)} />
              ))}
            </View>
          </View>
          <View style={styles.buttonStack}>
            <NeonButton
              label={editingId ? "Edit announcement" : "Add new announcement"}
              variant="secondary"
              onPress={() => {
                if (!title.trim() || !messageText.trim()) {
                  return;
                }
                if (editingId) {
                  updateAnnouncement(editingId, { title, messageText, timelineMoment });
                } else {
                  addAnnouncement({ title, messageText, timelineMoment });
                }
                resetEditor();
              }}
            />
            {editingId ? <NeonButton label="Cancel edit" variant="secondary" onPress={resetEditor} /> : null}
          </View>
        </GlowCard>

        <GlowCard style={styles.editorCard}>
          <Text style={styles.sectionTitle}>Voice Playback</Text>
          <Text style={styles.voiceBody}>
            {speechSupported
              ? "Use the device voice engine for announcement playback in preview and live mode."
              : "Voice playback is not available on this device or browser."}
          </Text>
          {speechMessage ? <Text style={styles.voiceNote}>{speechMessage}</Text> : null}
          {speechSupported ? (
            <>
              <View style={styles.assignmentBlock}>
                <Text style={styles.assignmentLabel}>Voice</Text>
                <Text style={styles.voiceHint}>Only the supported Google-style announcement voices are shown here.</Text>
                <View style={styles.pillWrap}>
                  {availableVoiceOptions.map((voiceOption) => (
                    <SelectionPill
                      key={voiceOption.label}
                      label={getVisibleVoiceLabel(voiceOption.label)}
                      active={selectedVoiceName === voiceOption.voiceName}
                      onPress={() => setSelectedVoiceName(voiceOption.voiceName)}
                    />
                  ))}
                </View>
              </View>
              <View style={styles.assignmentBlock}>
                <Text style={styles.assignmentLabel}>Speech rate</Text>
                <View style={styles.pillWrap}>
                  {[0.85, 1, 1.15].map((rate) => (
                    <SelectionPill
                      key={rate}
                      label={`${rate.toFixed(2)}x`}
                      active={Math.abs(speechRate - rate) < 0.01}
                      onPress={() => setSpeechRate(rate)}
                    />
                  ))}
                </View>
              </View>
              <View style={styles.buttonStack}>
                <NeonButton
                  label="Play Announcement"
                  variant="secondary"
                  onPress={() => speakAnnouncement({ title: previewAnnouncementTitle, text: previewAnnouncementText })}
                />
                <NeonButton label={speechSpeaking ? "Stop Announcement" : "Stop"} variant="secondary" onPress={stopAnnouncementSpeech} />
              </View>
            </>
          ) : null}
        </GlowCard>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Announcement library</Text>
          <View style={styles.list}>
            {isHydrating ? (
              <EmptyStateCard title="Restoring announcements" description="Loading locally saved event messaging." />
            ) : announcements.length === 0 ? (
              <EmptyStateCard title="Add announcements for key moments" description="Create guest-facing messaging for entrances, dances, dinner calls, and more." />
            ) : (
              announcements.map((item) => (
                <AnnouncementCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  timelineMoment={item.timelineMoment}
                  previewText={item.previewText}
                  onPlay={(id) => {
                    const announcement = announcements.find((entry) => entry.id === id);
                    if (!announcement) {
                      return;
                    }
                    speakAnnouncement({ title: announcement.title, text: announcement.previewText });
                  }}
                  onDelete={(id) =>
                    Alert.alert("Delete announcement?", "This removes the announcement from the event.", [
                      { text: "Cancel", style: "cancel" },
                      { text: "Delete", style: "destructive", onPress: () => deleteAnnouncement(id) },
                    ])
                  }
                  onEdit={startEditing}
                />
              ))
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <NeonButton
            label="Save Announcements"
            onPress={() => {
              saveCurrentEventSnapshot({ status: "Announcements Ready" });
              navigation.goBack();
            }}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingTop: spacing.xl, paddingHorizontal: spacing.lg, paddingBottom: 120, gap: spacing.xl },
  header: { gap: spacing.sm },
  eyebrow: { color: colors.accent, textTransform: "uppercase", letterSpacing: 1.1, fontSize: 12, fontWeight: "800" },
  title: { color: colors.textPrimary, fontSize: 32, lineHeight: 36, fontWeight: "800" },
  subtitle: { color: colors.textSecondary, fontSize: 15, lineHeight: 22, maxWidth: 330 },
  editorCard: { gap: spacing.md },
  section: { gap: spacing.md },
  sectionTitle: { color: colors.textPrimary, fontSize: 21, fontWeight: "800" },
  editorFields: { gap: spacing.md },
  assignmentBlock: { gap: spacing.sm },
  assignmentLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: "700" },
  pillWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  buttonStack: { gap: spacing.sm },
  voiceBody: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  voiceNote: { color: colors.accentStrong, fontSize: 13, lineHeight: 18 },
  voiceHint: { color: colors.textSecondary, fontSize: 12, lineHeight: 17 },
  list: { gap: spacing.md },
  footer: { gap: spacing.sm },
});
