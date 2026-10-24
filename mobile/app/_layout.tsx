import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

// Root navigator. Every file in app/ is a screen; this Stack wraps them all.
// Styling is plain React Native for now; NativeWind is the planned styling layer
// per the mobile ADR and will replace these StyleSheet objects.
export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#1B7F3B" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "600" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Build Your Value" }} />
        <Stack.Screen name="jobs" options={{ title: "Jobs" }} />
      </Stack>
    </>
  );
}
