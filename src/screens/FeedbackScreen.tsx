import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import { BackLink } from "../components/BackLink";
import { GlowCard } from "../components/GlowCard";
import { NeonButton } from "../components/NeonButton";
import { TextFieldInput } from "../components/TextFieldInput";
import { colors, spacing } from "../constants/theme";
import { useAppState } from "../state/AppState";

export function FeedbackScreen() {
  const navigation = useNavigation<any>();
  const { submitFeedback } = useAppState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <LinearGradient colors={["#04070F", "#071120", "#0A1730"]} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackLink label="Back" onPress={() => navigation.goBack()} />
          <Text style={styles.eyebrow}>CrowdKue Feedback</Text>
          <Text style={styles.title}>Send Feedback</Text>
          <Text style={styles.subtitle}>Tell us what worked, what felt confusing, or what you would want for a real event.</Text>
        </View>

        <GlowCard style={styles.formCard}>
          <TextFieldInput label="Name (optional)" value={name} onChangeText={setName} placeholder="Your name" />
          <TextFieldInput label="Email (optional)" value={email} onChangeText={setEmail} placeholder="you@example.com" />
          <TextFieldInput label="Message" value={message} onChangeText={setMessage} placeholder="Share your feedback..." multiline />
          <NeonButton
            label="Submit Feedback"
            onPress={() => {
              if (!message.trim()) {
                return;
              }
              submitFeedback({ name, email, message });
              setSubmitted(true);
              setName("");
              setEmail("");
              setMessage("");
            }}
          />
          {submitted ? <Text style={styles.successText}>Thanks. Your feedback was saved locally for this demo build.</Text> : null}
        </GlowCard>
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
  formCard: { gap: spacing.md },
  successText: { color: colors.success, fontSize: 14, lineHeight: 21 },
});
