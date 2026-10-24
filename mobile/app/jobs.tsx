import type { Job } from "@byv/core";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

// The API is the only service that scores, matches or screens listings; the app just
// renders what GET /v1/jobs returns (listings that passed the scam screen or were
// approved by a human). Plain React Native styling for now; NativeWind is the planned
// styling layer per the mobile ADR.
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";

type JobsResponse = { count: number; items: Array<Job & { reports: number }> };

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; jobs: Job[] };

export default function JobsScreen() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${API_URL}/v1/jobs`, { signal: controller.signal });
        if (!res.ok) throw new Error(`API responded ${res.status}`);
        const body = (await res.json()) as JobsResponse;
        setState({ status: "ready", jobs: body.items });
      } catch (err) {
        if (controller.signal.aborted) return;
        const message = err instanceof Error ? err.message : "Unknown error";
        setState({ status: "error", message: `Could not load jobs from ${API_URL}: ${message}` });
      }
    })();
    return () => controller.abort();
  }, []);

  if (state.status === "loading") {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1B7F3B" />
      </View>
    );
  }

  if (state.status === "error") {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{state.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={state.jobs}
      keyExtractor={(job) => job.id}
      contentContainerStyle={styles.list}
      ListEmptyComponent={<Text style={styles.empty}>No listings yet.</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.meta}>
            {item.company} · {item.location} · {item.workType}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "#FFFFFF" },
  list: { padding: 16, gap: 12, backgroundColor: "#FFFFFF", flexGrow: 1 },
  card: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  jobTitle: { fontSize: 17, fontWeight: "600", color: "#111111" },
  meta: { marginTop: 4, fontSize: 14, color: "#555555" },
  empty: { textAlign: "center", color: "#555555", marginTop: 32 },
  error: { color: "#B00020", textAlign: "center" },
});
