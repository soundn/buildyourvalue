import type { IntakePreferences, IntakeQuestion } from "@byv/core";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { setPreferences } from "../lib/prefs";

// Guided intake (BR-064): the API decides the next of up to seven questions and maps the
// answers to preferences; this screen only renders chips and collects taps.
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";

type Step = { done: boolean; question: IntakeQuestion | null; progress: { answered: number; total: number }; preferences: IntakePreferences };

export default function IntakeScreen() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [step, setStep] = useState<Step | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [free, setFree] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function advance(next: Record<string, string[]>) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/v1/intake/next`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ answers: next }) });
      if (!res.ok) throw new Error(`API responded ${res.status}`);
      const s = (await res.json()) as Step;
      setStep(s);
      setPicked(s.question ? next[s.question.id] ?? [] : []);
      setFree("");
      if (s.done) {
        setPreferences(s.preferences);
        router.replace("/jobs");
      }
    } catch (e) {
      setError(`Could not reach the API at ${API_URL}: ${e instanceof Error ? e.message : "error"}`);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void advance({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const q = step?.question;
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Link href="/jobs" style={styles.link}>Browse jobs instead</Link>
      </View>
    );
  }
  if (!q) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0F6B3A" />
      </View>
    );
  }

  const toggle = (value: string) => {
    if (!q.multi) return setPicked([value]);
    setPicked((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : prev.length < (q.max ?? 99) ? [...prev, value] : prev));
  };
  const submit = () => {
    const values = [...picked, ...(free.trim() ? [free.trim()] : [])];
    if (!values.length) return;
    const next = { ...answers, [q.id]: values };
    setAnswers(next);
    void advance(next);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.progress}>
        Question {Math.min((step?.progress.answered ?? 0) + 1, step?.progress.total ?? 7)} of {step?.progress.total ?? 7}
      </Text>
      <Text style={styles.prompt}>{q.prompt}</Text>
      {q.help ? <Text style={styles.help}>{q.help}</Text> : null}
      <View style={styles.chips}>
        {q.options.map((o) => {
          const on = picked.includes(o.value);
          return (
            <Pressable key={o.value} onPress={() => toggle(o.value)} accessibilityRole="button" accessibilityState={{ selected: on }} style={[styles.chip, on && styles.chipOn]}>
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{o.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {q.allowFreeText ? <TextInput style={styles.input} placeholder="Or type your own" value={free} onChangeText={setFree} /> : null}
      <Pressable onPress={submit} disabled={busy || (!picked.length && !free.trim())} accessibilityRole="button" style={[styles.button, (busy || (!picked.length && !free.trim())) && styles.buttonOff]}>
        <Text style={styles.buttonText}>{busy ? "One moment" : "Continue"}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12, backgroundColor: "#F4F7F5", flexGrow: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  progress: { fontSize: 12, color: "#5B6B63" },
  prompt: { fontSize: 20, fontWeight: "700", color: "#14211B" },
  help: { fontSize: 14, color: "#5B6B63" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { minHeight: 44, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: "#DDE5E0", backgroundColor: "#FFFFFF", justifyContent: "center" },
  chipOn: { backgroundColor: "#0F6B3A", borderColor: "#0F6B3A" },
  chipText: { fontSize: 14, color: "#14211B" },
  chipTextOn: { color: "#FFFFFF" },
  input: { borderWidth: 1, borderColor: "#DDE5E0", borderRadius: 8, padding: 12, backgroundColor: "#FFFFFF", fontSize: 16 },
  button: { marginTop: 8, backgroundColor: "#0F6B3A", paddingVertical: 14, borderRadius: 8, alignItems: "center" },
  buttonOff: { opacity: 0.4 },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  error: { color: "#9B1C1C", textAlign: "center" },
  link: { color: "#0F6B3A", textDecorationLine: "underline" },
});
