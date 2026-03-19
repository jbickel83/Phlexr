import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useMemo, useState } from "react";

import { BackLink } from "../components/BackLink";
import { EmptyStateCard } from "../components/EmptyStateCard";
import { GlowCard } from "../components/GlowCard";
import { NeonButton } from "../components/NeonButton";
import { SelectionPill } from "../components/SelectionPill";
import { TextFieldInput } from "../components/TextFieldInput";
import { TimelineItemCard } from "../components/TimelineItemCard";
import { colors, spacing } from "../constants/theme";
import { useAppState } from "../state/AppState";

function parseTimelineTime(value: string) {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    return Number.MAX_SAFE_INTEGER;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();
  const normalizedHours = (hours % 12) + (meridiem === "PM" ? 12 : 0);
  return normalizedHours * 60 + minutes;
}

export function TimelineBuilderScreen() {
  const navigation = useNavigation<any>();
  const { timelineItems, announcements, songs, playlists, addTimelineItem, updateTimelineItem, deleteTimelineItem, reorderTimelineItems, saveCurrentEventSnapshot } =
    useAppState();
  const assignableMusic = useMemo(
    () => [...songs.map((song) => song.title || song.songName || "Track"), ...playlists.map((playlist) => playlist.name)],
    [songs, playlists],
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingItem = useMemo(
    () => timelineItems.find((item) => item.id === editingId),
    [editingId, timelineItems],
  );
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [music, setMusic] = useState("");
  const [announcementAttached, setAnnouncementAttached] = useState(false);

  const sortedTimeline = useMemo(
    () => [...timelineItems].sort((a, b) => parseTimelineTime(a.time) - parseTimelineTime(b.time)),
    [timelineItems],
  );
  const duplicateTimeConflict = useMemo(() => {
    const nextTime = time.trim();
    if (!nextTime) {
      return null;
    }
    const hasDuplicate = timelineItems.some((item) => item.time === nextTime && item.id !== editingId);
    return hasDuplicate ? "Another timeline moment already uses this scheduled time." : null;
  }, [editingId, time, timelineItems]);
  const orderConflict = useMemo(() => {
    const hasConflict = timelineItems.some((item, index) => item.id !== sortedTimeline[index]?.id);
    return hasConflict ? "Timeline order has conflicts. Save will keep the list in chronological order." : null;
  }, [sortedTimeline, timelineItems]);

  const hydrateEditor = (id: string) => {
    const item = timelineItems.find((entry) => entry.id === id);
    if (!item) {
      return;
    }
    setEditingId(id);
    setTitle(item.title);
    setTime(item.time);
    setMusic(item.music);
    setAnnouncementAttached(item.announcementAttached);
  };

  const resetEditor = () => {
    setEditingId(null);
    setTitle("");
    setTime("");
    setMusic("");
    setAnnouncementAttached(false);
  };

  return (
    <LinearGradient colors={["#04070F", "#071120", "#0A1730"]} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackLink label="Back to Event Overview" onPress={() => navigation.goBack()} />
          <Text style={styles.eyebrow}>Timeline Builder</Text>
          <Text style={styles.title}>Build the event run of show.</Text>
          <Text style={styles.subtitle}>
            Manage every timeline cue, assign music, and track whether an announcement is attached.
          </Text>
        </View>

        <GlowCard style={styles.utilityCard}>
          <Text style={styles.utilityTitle}>{editingId ? "Edit timeline item" : "Add timeline item"}</Text>
          <View style={styles.editorFields}>
            <TextFieldInput label="Title" value={title} onChangeText={setTitle} placeholder="Grand Entrance" />
            <TextFieldInput label="Scheduled time" value={time} onChangeText={setTime} placeholder="6:05 PM" />
            <TextFieldInput label="Assigned song or playlist" value={music} onChangeText={setMusic} placeholder="Wedding Party Intro Mix" />
          </View>
          {duplicateTimeConflict ? <Text style={styles.warningText}>{duplicateTimeConflict}</Text> : null}
          {orderConflict ? <Text style={styles.helperWarning}>{orderConflict}</Text> : null}
          <View style={styles.assignmentRow}>
            <Text style={styles.assignmentLabel}>Available songs / playlists</Text>
            <View style={styles.pillWrap}>
              {assignableMusic.length === 0 ? (
                <SelectionPill label="No local music yet" active />
              ) : (
                assignableMusic.map((item) => (
                  <SelectionPill key={item} label={item} active={music === item} onPress={() => setMusic(item)} />
                ))
              )}
            </View>
          </View>
          <View style={styles.assignmentRow}>
            <Text style={styles.assignmentLabel}>Announcement attached</Text>
            <View style={styles.pillWrap}>
              <SelectionPill label="No" active={!announcementAttached} onPress={() => setAnnouncementAttached(false)} />
              <SelectionPill label="Yes" active={announcementAttached} onPress={() => setAnnouncementAttached(true)} />
            </View>
          </View>
          <View style={styles.actionRow}>
            <NeonButton
              label={editingId ? "Edit timeline item" : "Add Timeline Item"}
              variant="secondary"
              onPress={() => {
                if (!title.trim() || !time.trim()) {
                  return;
                }
                if (duplicateTimeConflict) {
                  Alert.alert("Duplicate timeline time", duplicateTimeConflict);
                  return;
                }
                if (editingId && editingItem) {
                  updateTimelineItem(editingId, {
                    title: title.trim(),
                    time: time.trim(),
                    music: music.trim() || "Select Song",
                    announcementAttached,
                  });
                } else {
                  addTimelineItem({
                    title: title.trim(),
                    time: time.trim(),
                    music: music.trim() || "Select Song",
                    announcementAttached,
                  });
                }
                resetEditor();
              }}
            />
            {editingId ? <NeonButton label="Cancel edit" variant="secondary" onPress={resetEditor} /> : null}
          </View>
        </GlowCard>

        <View style={styles.list}>
          {timelineItems.length === 0 ? (
            <EmptyStateCard
              title="Add your first timeline moment"
              description="Build the run of show with the first cue, transition, or key event moment."
            />
          ) : (
            timelineItems.map((item) => (
              <TimelineItemCard
                key={item.id}
                id={item.id}
                title={item.title}
                time={item.time}
                music={item.music}
                announcementAttached={item.announcementAttached}
                onDelete={(id) =>
                  Alert.alert("Delete timeline item?", "This removes the moment from the event timeline.", [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: "destructive", onPress: () => deleteTimelineItem(id) },
                  ])
                }
                onReorder={reorderTimelineItems}
                onEdit={hydrateEditor}
              />
            ))
          )}
        </View>

        <Text style={styles.helperText}>
          {announcements.length === 0
            ? "No announcements linked yet."
            : `${announcements.length} announcements currently available for timeline attachment.`}
        </Text>

        <View style={styles.footer}>
          <NeonButton
            label="Save Timeline"
            onPress={() => {
              if (duplicateTimeConflict) {
                Alert.alert("Timeline conflict", duplicateTimeConflict);
                return;
              }
              if (orderConflict) {
                Alert.alert("Timeline order warning", "Use Reorder Items to place the timeline in chronological order before saving.");
                return;
              }
              saveCurrentEventSnapshot({ status: "Timeline Ready" });
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
  utilityCard: { gap: spacing.md },
  utilityTitle: { color: colors.textPrimary, fontSize: 19, fontWeight: "800" },
  editorFields: { gap: spacing.md },
  assignmentRow: { gap: spacing.sm },
  assignmentLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: "700" },
  pillWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  actionRow: { gap: spacing.sm },
  warningText: { color: colors.warning, fontSize: 13, lineHeight: 18 },
  helperWarning: { color: colors.accentStrong, fontSize: 12, lineHeight: 18 },
  list: { gap: spacing.md },
  helperText: { color: colors.textSecondary, fontSize: 13, lineHeight: 18 },
  footer: { gap: spacing.sm },
});
