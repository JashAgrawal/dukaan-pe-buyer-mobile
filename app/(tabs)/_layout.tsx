import { Tabs, router } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";

import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "@/hooks/useLocation";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { isLocationSet, isLoading: isLocationLoading } = useLocation();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/auth/phone");
    }
  }, [isAuthLoading, isAuthenticated]);

  // Redirect to location search if authenticated but location not set
  useEffect(() => {
    if (
      !isAuthLoading &&
      isAuthenticated &&
      !isLocationLoading &&
      !isLocationSet
    ) {
      router.push("/location/search" as any);
    }
  }, [isAuthLoading, isAuthenticated, isLocationLoading, isLocationSet]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
