import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Welcome screen. Plain React Native components only for now; NativeWind is the
// planned styling layer per the mobile ADR.
export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Build Your Value</Text>
      <Text style={styles.subtitle}>
        AI-assisted CVs, scam-screened job matches and skill-gap learning paths for
        Nigerian job seekers.
      </Text>
      <Text style={styles.trust}>We never charge you to apply.</Text>
      <Link href="/intake" asChild>
        <Pressable style={styles.button} accessibilityRole="button">
          <Text style={styles.buttonText}>Tell us what you want</Text>
        </Pressable>
      </Link>
      <Link href="/jobs" asChild>
        <Pressable style={styles.buttonSecondary} accessibilityRole="button">
          <Text style={styles.buttonSecondaryText}>Browse jobs</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1B7F3B",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#333333",
    textAlign: "center",
    lineHeight: 24,
  },
  trust: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1B7F3B",
    textAlign: "center",
  },
  button: {
    marginTop: 8,
    backgroundColor: "#1B7F3B",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  buttonSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDE5E0",
    backgroundColor: "#FFFFFF",
  },
  buttonSecondaryText: {
    color: "#14211B",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
