import { Tabs, router } from "expo-router";
import React, { useEffect } from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { View, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "@/hooks/useLocation";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { tabBarTranslateY } from "@/components/ui/ScrollAwareWrapper";

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

  // Create animated style for the tab bar
  const tabBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: tabBarTranslateY.value }],
    };
  });

  // Custom tab bar component that wraps the default tab bar with animation
  const renderTabBar = (props: BottomTabBarProps) => {
    return (
      <Animated.View style={[styles.tabBarContainer, tabBarAnimatedStyle]}>
        <View style={styles.tabBarContent}>
          {/* @ts-ignore - This is the default tab bar */}
          <Tabs.DefaultTabBar {...props} />
        </View>
      </Animated.View>
    );
  };

  return (
    <Tabs
      tabBar={renderTabBar}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: 90,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: "Jost-Medium",
          fontSize: 12,
          marginTop: 4,
        },
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

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  tabBarContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
});
