import { Stack, Redirect, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

export default function RootLayout() {
  const segments = useSegments();
  const { checkAuth, user, token } = useAuthStore();

  const inAuthScreen = segments[0] === "(auth)";
  const isSignedIn = user && token;

  if (!isSignedIn && !inAuthScreen) {
  return <Redirect href="/(auth)" />;
  }   
  if (isSignedIn && inAuthScreen) {
  return <Redirect href="/(tabs)" />;
  }
  return (
      <SafeAreaProvider>
        <SafeScreen>
          <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
          </Stack>
        </SafeScreen>
        <StatusBar style="dark"/>
      </SafeAreaProvider>
  )
}
