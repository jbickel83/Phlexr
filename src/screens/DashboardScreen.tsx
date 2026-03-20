import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ActionChip } from "../components/ActionChip";
import { EmptyStateCard } from "../components/EmptyStateCard";
import { EventPreviewCard } from "../components/EventPreviewCard";
import { GlowCard } from "../components/GlowCard";
import { NeonButton } from "../components/NeonButton";
import { QuickStartCard } from "../components/QuickStartCard";
import { SelectionPill } from "../components/SelectionPill";
import { TemplateCard } from "../components/TemplateCard";
import { TextFieldInput } from "../components/TextFieldInput";
import { colors, radii, spacing } from "../constants/theme";
import { quickStartItems, recentTemplates } from "../data/mockData";
import type { ValidationResponse } from "../state/AppState";
import { useAppState } from "../state/AppState";

export function DashboardScreen() {
  const navigation = useNavigation<any>();
  const {
    currentEvent,
    savedEvents,
    selectedEventId,
    timelineItems,
    songs,
    announcements,
    persistenceMessage,
    isHydrating,
    beginNewEventDraft,
    selectSavedEvent,
    deleteSavedEvent,
    submitValidationResponse,
  } = useAppState();
  const [interestResponse, setInterestResponse] = useState<ValidationResponse | null>(null);
  const [interestComment, setInterestComment] = useState("");
  const [validationSubmitted, setValidationSubmitted] = useState(false);

  useEffect(() => {
    setValidationSubmitted(false);
    setInterestResponse(null);
    setInterestComment("");
  }, [selectedEventId]);

  const confirmDeleteEvent = (eventId: string, eventName: string) => {
    const removeEvent = () => {
      deleteSavedEvent(eventId);
    };

    if (Platform.OS === "web" && typeof window !== "undefined") {
      if (window.confirm(`Delete ${eventName || "this event"}?`)) {
        removeEvent();
      }
      return;
    }

    Alert.alert("Delete event?", `Remove ${eventName || "this event"} from this device?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: removeEvent },
    ]);
  };

  const heroHeaderSection = (
    <View style={styles.hero}>
      <View style={styles.heroHeader}>
        <View style={styles.brandLockup}>
          <Text style={styles.eyebrow}>CrowdKue Dashboard</Text>
          <Text style={styles.title}>Run the room without a DJ.</Text>
          <Text style={styles.subtitle}>
            Cue music, announcements, and transitions from your own audio files with event-day confidence.
          </Text>
        </View>
        <View style={styles.heroActions}>
          <Pressable style={styles.helpButton} onPress={() => navigation.navigate("Settings", { scrollTo: "how-to-use", nonce: Date.now() })}>
            <Text style={styles.helpButtonText}>Help</Text>
          </Pressable>
          <View style={styles.statusOrb} />
        </View>
      </View>
    </View>
  );

  const createEventSection = (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Create new event</Text>
        <Text style={styles.sectionCaption}>Start from scratch or update the current event flow.</Text>
      </View>
      <GlowCard style={styles.ctaCard}>
        <Text style={styles.ctaTitle}>Build a new event autopilot</Text>
        <Text style={styles.ctaBody}>
          Set timing, import local music, automate announcements, and prep your live run screen.
        </Text>
        <View style={styles.ctaActions}>
          <NeonButton
            label="Create New Event"
            onPress={() => {
              beginNewEventDraft();
              navigation.navigate("Events", { screen: "CreateEvent" });
            }}
          />
          <ActionChip
            label="Open Event Hub"
            onPress={() =>
              navigation.navigate("Events", {
                screen: selectedEventId ? "EventOverview" : "CreateEvent",
              })
            }
          />
        </View>
      </GlowCard>
    </View>
  );

  const systemReadinessSection = (
    <View style={styles.hero}>
      <GlowCard style={styles.heroCard}>
        <View style={styles.heroCardTop}>
          <View>
            <Text style={styles.heroLabel}>System Readiness</Text>
            <Text style={styles.heroValue}>94%</Text>
          </View>
          <Text style={styles.heroMeta}>{currentEvent.status}</Text>
        </View>
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricNumber}>{savedEvents.length}</Text>
            <Text style={styles.metricText}>saved events</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricNumber}>{timelineItems.length}</Text>
            <Text style={styles.metricText}>timeline items</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricNumber}>{songs.length + announcements.length}</Text>
            <Text style={styles.metricText}>music + cues</Text>
          </View>
        </View>
      </GlowCard>
    </View>
  );

  const surveySection = (
    <View style={styles.section}>
      <View style={styles.stack}>
        <GlowCard
          title="Would you use CrowdKue for your event?"
          subtitle="A quick answer helps validate the product direction."
        >
          <View style={styles.responseRow}>
            {(["Yes", "Maybe", "No"] as ValidationResponse[]).map((option) => (
              <SelectionPill
                key={option}
                label={option}
                active={interestResponse === option}
                onPress={() => {
                  setInterestResponse(option);
                  setValidationSubmitted(false);
                }}
              />
            ))}
          </View>
          <TextFieldInput
            label="Optional comment"
            value={interestComment}
            onChangeText={(value) => {
              setInterestComment(value);
              setValidationSubmitted(false);
            }}
            placeholder="Tell us what would make CrowdKue a must-have."
            multiline
          />
          {validationSubmitted ? (
            <Text style={styles.successText}>Thanks. Your response was saved locally for this demo build.</Text>
          ) : null}
          <NeonButton
            label="Submit Response"
            onPress={() => {
              if (!interestResponse) {
                return;
              }
              submitValidationResponse({ response: interestResponse, comment: interestComment });
              setValidationSubmitted(true);
              setInterestComment("");
            }}
          />
        </GlowCard>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={["#04070F", "#071120", "#0A1730"]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {heroHeaderSection}
        {createEventSection}
        {systemReadinessSection}

        {persistenceMessage ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Local storage</Text>
              <Text style={styles.sectionCaption}>Persistence notices for this device.</Text>
            </View>
            <GlowCard style={styles.noticeCard}>
              <Text style={styles.noticeText}>{persistenceMessage}</Text>
            </GlowCard>
          </View>
        ) : null}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved events</Text>
            <Text style={styles.sectionCaption}>Locally stored events restore right back into the app flow.</Text>
          </View>
          {savedEvents.length === 0 ? (
            <View style={styles.stack}>
              <EmptyStateCard
                title={isHydrating ? "Restoring events" : "Create your first event"}
                description={
                  isHydrating
                    ? "Loading your locally saved CrowdKue events."
                    : "Build your first event and CrowdKue will keep it stored locally on this device."
                }
              />
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
              {savedEvents.map((record, index) => (
                <EventPreviewCard
                  key={record.id}
                  name={record.event.name || "Untitled Event"}
                  date={record.event.date || "Date not set"}
                  venue={record.event.location || "Location not set"}
                  phase={`${record.event.type} | ${record.event.packageType}${record.id === selectedEventId ? " | Active in app" : ""}`}
                  status={record.event.status}
                  accent={index === 0 ? "#25E0FF" : "#8B5CF6"}
                  onPress={() => {
                    selectSavedEvent(record.id);
                    navigation.navigate("Events", { screen: "EventOverview" });
                  }}
                  onDelete={() => confirmDeleteEvent(record.id, record.event.name || "this event")}
                />
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent templates</Text>
            <Text style={styles.sectionCaption}>Reusable event blueprints for fast setup.</Text>
          </View>
          <View style={styles.stack}>
            {recentTemplates.map((template) => (
              <TemplateCard key={template.id} name={template.name} category={template.category} detail={template.detail} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick start</Text>
            <Text style={styles.sectionCaption}>Fast actions that get an event ready sooner.</Text>
          </View>
          <View style={styles.quickHeaderAction}>
            <ActionChip label="Send Feedback" onPress={() => navigation.getParent()?.navigate("Feedback")} />
          </View>
          <View style={styles.stack}>
            {quickStartItems.map((item) => (
              <QuickStartCard key={item.id} title={item.title} description={item.description} />
            ))}
          </View>
        </View>

        {surveySection}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingTop: spacing.xl, paddingBottom: 120, gap: spacing.xl },
  hero: { paddingHorizontal: spacing.lg, gap: spacing.lg },
  heroHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: spacing.md },
  brandLockup: { flex: 1, gap: spacing.sm },
  heroActions: { alignItems: "flex-end", gap: spacing.sm },
  helpButton: {
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(37,224,255,0.24)",
    backgroundColor: "rgba(12,18,35,0.92)",
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    shadowColor: colors.accentStrong,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 4,
  },
  helpButtonText: {
    color: colors.accentStrong,
    fontSize: 12,
    fontWeight: "800",
  },
  eyebrow: { color: colors.accent, textTransform: "uppercase", letterSpacing: 1.1, fontSize: 12, fontWeight: "800" },
  title: { color: colors.textPrimary, fontSize: 34, lineHeight: 38, fontWeight: "800" },
  subtitle: { color: colors.textSecondary, fontSize: 15, lineHeight: 22, maxWidth: 310 },
  statusOrb: {
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: colors.accentStrong,
    shadowColor: colors.accentStrong,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 18,
    elevation: 10,
    marginTop: 6,
  },
  heroCard: { paddingBottom: spacing.lg },
  heroCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: spacing.md, marginBottom: spacing.lg },
  heroLabel: { color: colors.textSecondary, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  heroValue: { color: colors.textPrimary, fontSize: 42, fontWeight: "800" },
  heroMeta: { color: colors.success, fontSize: 12, fontWeight: "700", paddingTop: 8 },
  metricsRow: { flexDirection: "row", gap: spacing.sm },
  metric: { flex: 1, borderRadius: radii.md, backgroundColor: "rgba(5, 10, 20, 0.36)", padding: spacing.md, gap: 4 },
  metricNumber: { color: colors.textPrimary, fontSize: 24, fontWeight: "800" },
  metricText: { color: colors.textSecondary, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.7 },
  section: { gap: spacing.md },
  sectionHeader: { paddingHorizontal: spacing.lg, gap: 4 },
  sectionTitle: { color: colors.textPrimary, fontSize: 21, fontWeight: "800" },
  sectionCaption: { color: colors.textSecondary, fontSize: 13, lineHeight: 18 },
  ctaCard: { marginHorizontal: spacing.lg },
  noticeCard: { marginHorizontal: spacing.lg },
  noticeText: { color: colors.textPrimary, fontSize: 14, lineHeight: 21 },
  ctaTitle: { color: colors.textPrimary, fontSize: 20, lineHeight: 24, fontWeight: "800", marginBottom: spacing.sm },
  ctaBody: { color: colors.textSecondary, fontSize: 14, lineHeight: 21, marginBottom: spacing.lg },
  ctaActions: { gap: spacing.sm },
  horizontalList: { paddingLeft: spacing.lg, paddingRight: spacing.sm },
  quickHeaderAction: { paddingHorizontal: spacing.lg },
  stack: { paddingHorizontal: spacing.lg, gap: spacing.md },
  responseRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.md },
  successText: { color: colors.success, fontSize: 14, lineHeight: 21 },
});
