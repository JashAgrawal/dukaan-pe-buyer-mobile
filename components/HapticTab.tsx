import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

// Create an animated view for the animation
const AnimatedView = Animated.createAnimatedComponent(View);

export function HapticTab(props: BottomTabBarButtonProps) {
  // Animation values
  const scale = useSharedValue(1);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Pressable
      {...props}
      onPressIn={(ev) => {
        scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
        // Add a soft haptic feedback when pressing down on the tabs.
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        props.onPressIn?.(ev);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
    >
      <AnimatedView style={[styles.tabButton, animatedStyle, props.style]}>
        {props.children}
      </AnimatedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
});
