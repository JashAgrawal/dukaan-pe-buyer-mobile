import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "@/global.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import { queryClient } from "@/lib/query/queryClient";
// Import stores
import "@/stores/authStore";
import "@/stores/locationStore";
import "@/stores/useSearchStore";

// Import components
import LocationDetector from "@/components/location/LocationDetector";
import FontProvider from "@/components/providers/FontProvider";
import { TabBarProvider } from "@/components/ui/TabBarContext";

// Import hooks
import { useSearchInit } from "@/hooks/useSearchInit";
import { useCategoriesInit } from "@/hooks/useCategoriesInit";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Initialize search store and categories
  useSearchInit();
  useCategoriesInit();
  const [loaded] = useFonts({
    // Load Jost font family
    "Jost-Regular": require("../assets/fonts/Jost-Regular.ttf"),
    "Jost-Medium": require("../assets/fonts/Jost.ttf"),
    "Jost-Bold": require("../assets/fonts/Jost.ttf"),
    Jost: require("../assets/fonts/Jost-Regular.ttf"),

    // Load Montserrat font family
    "Montserrat-Regular": require("../assets/fonts/Montserrat.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat.ttf"),
    Montserrat: require("../assets/fonts/Montserrat.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <TabBarProvider>
          <FontProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "white" },
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="auth" />
              <Stack.Screen name="location" />
              <Stack.Screen name="search" />
              <Stack.Screen name="store" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <LocationDetector />
            <StatusBar style="auto" />
          </FontProvider>
        </TabBarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
