import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import { BackLink } from "../components/BackLink";
import { GlowCard } from "../components/GlowCard";
import { NeonButton } from "../components/NeonButton";
import { SelectionPill } from "../components/SelectionPill";
import { TextFieldInput } from "../components/TextFieldInput";
import { colors, spacing } from "../constants/theme";
import { useAppState } from "../state/AppState";

const eventTypes = ["Wedding", "Corporate", "Private Event", "Fundraiser"];
const packageTypes = ["Essential", "Signature", "Full Autopilot"];

export function CreateEventScreen() {
  const navigation = useNavigation<any>();
  const { currentEvent, saveCurrentEventSnapshot } = useAppState();
  const [name, setName] = useState(currentEvent.name);
  const [eventType, setEventType] = useState(currentEvent.type);
  const [date, setDate] = useState(currentEvent.date);
  const [startTime, setStartTime] = useState(currentEvent.startTime);
  const [location, setLocation] = useState(currentEvent.location);
  const [packageType, setPackageType] = useState(currentEvent.packageType);

  const handleContinue = () => {
    saveCurrentEventSnapshot({
      name,
      type: eventType,
      date,
      startTime,
      location,
      packageType,
      status: "Event Created",
    });
    navigation.navigate("EventOverview");
  };

  return (
    <LinearGradient
      colors={["#04070F", "#071120", "#0A1730"]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackLink label="Back to Dashboard" onPress={() => navigation.getParent()?.navigate("Dashboard")} />
          <Text style={styles.eyebrow}>Create Event</Text>
          <Text style={styles.title}>Set up a new CrowdKue event.</Text>
          <Text style={styles.subtitle}>
            Start with the core event details, then continue into the timeline builder.
          </Text>
        </View>

        <GlowCard style={styles.formCard}>
          <TextFieldInput label="Event name" value={name} onChangeText={setName} placeholder="Enter event name" />

          <View style={styles.block}>
            <Text style={styles.blockTitle}>Event type</Text>
            <View style={styles.pillWrap}>
              {eventTypes.map((type) => (
                <SelectionPill key={type} label={type} active={eventType === type} onPress={() => setEventType(type)} />
              ))}
            </View>
          </View>

          <TextFieldInput label="Date" value={date} onChangeText={setDate} placeholder="Saturday, June 14" />
          <TextFieldInput label="Start time" value={startTime} onChangeText={setStartTime} placeholder="4:30 PM" />
          <TextFieldInput label="Location" value={location} onChangeText={setLocation} placeholder="Venue name" />

          <View style={styles.block}>
            <Text style={styles.blockTitle}>Package type</Text>
            <View style={styles.pillWrap}>
              {packageTypes.map((type) => (
                <SelectionPill key={type} label={type} active={packageType === type} onPress={() => setPackageType(type)} />
              ))}
            </View>
          </View>
        </GlowCard>

        <View style={styles.footer}>
          <NeonButton label="Continue to Timeline" onPress={handleContinue} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
    gap: spacing.xl,
  },
  header: {
    gap: spacing.sm,
  },
  eyebrow: {
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    fontSize: 12,
    fontWeight: "800",
  },
  title: {
    color: colors.textPrimary,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 320,
  },
  formCard: {
    gap: spacing.xl,
  },
  block: {
    gap: spacing.md,
  },
  blockTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  pillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  footer: {
    gap: spacing.sm,
  },
});
