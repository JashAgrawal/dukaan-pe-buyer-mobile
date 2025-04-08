import { Tabs, router } from "expo-router";
import React, { useEffect } from "react";
// No need to import BottomTabBarProps here

import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "@/hooks/useLocation";

import CustomTabBar from "@/components/ui/CustomTabBar";
import { IconSymbol } from "@/components/ui/IconSymbol";
// import TabBarBackground from "@/components/ui/TabBarBackground";
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
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
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
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="heart.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: "Scanner",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="qrcode" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="list.bullet" color={color} />
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
