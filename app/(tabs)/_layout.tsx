import { Tabs, router } from "expo-router";
import React, { useEffect } from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "@/hooks/useLocation";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/lib/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTabBar } from "@/components/ui/TabBarContext";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { isLocationSet, isLoading: isLocationLoading } = useLocation();
  const { tabBarTranslateY } = useTabBar();

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

  // Custom tab bar component with our own implementation
  const renderTabBar = (props: BottomTabBarProps) => {
    return (
      <Animated.View
        style={[
          styles.tabBarContainer,
          tabBarAnimatedStyle,
          { paddingBottom: insets.bottom || 10 },
        ]}
      >
        <View style={styles.tabBarContent}>
          <View style={styles.tabBar}>
            {props.state.routes.map((route, index) => {
              const { options } = props.descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name;

              const isFocused = props.state.index === index;

              const onPress = () => {
                const event = props.navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  props.navigation.navigate(route.name);
                }
              };

              const onLongPress = () => {
                props.navigation.emit({
                  type: "tabLongPress",
                  target: route.key,
                });
              };

              // Get the tab icon
              const icon = options.tabBarIcon
                ? options.tabBarIcon({
                    focused: isFocused,
                    color: isFocused
                      ? Colors[colorScheme ?? "light"].tint
                      : Colors[colorScheme ?? "light"].tabIconDefault,
                    size: 24,
                  })
                : null;

              return (
                <TouchableOpacity
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={
                    options.tabBarAccessibilityLabel as string | undefined
                  }
                  testID={(options as any).tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={styles.tabButton}
                >
                  {icon}
                  <Text
                    style={[
                      styles.tabLabel,
                      {
                        color: isFocused
                          ? Colors[colorScheme ?? "light"].tint
                          : Colors[colorScheme ?? "light"].tabIconDefault,
                      },
                    ]}
                  >
                    {label as string}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <Tabs
      tabBar={renderTabBar}
      screenOptions={{
        headerShown: false,
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
          title: "",
          tabBarIcon: ({ color }) => (
            <TouchableOpacity
              onPress={() => router.push("/scanner")}
              style={{
                padding: 5,
                paddingHorizontal: 12,
                backgroundColor: "#874BF9",
                borderRadius: 100,
              }}
            >
              <IconSymbol size={28} name="qrcode" color={"white"} />
            </TouchableOpacity>
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
    position: "absolute",
    bottom: -10,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
  },
  tabBarContent: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#874BF9",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  tabBar: {
    flexDirection: "row",
    height: 80,
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabLabel: {
    fontFamily: "Jost-Medium",
    fontSize: 12,
    marginTop: 4,
  },
});
