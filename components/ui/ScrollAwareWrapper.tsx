import React, { ReactNode, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Create a shared value for tab bar animation that can be accessed globally
export const tabBarTranslateY = useSharedValue(0);

interface ScrollAwareWrapperProps {
  children: ReactNode;
  headerComponent: ReactNode;
}

export default function ScrollAwareWrapper({
  children,
  headerComponent,
}: ScrollAwareWrapperProps) {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  // Animation values using Reanimated
  const headerTranslateY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);

  // Update the global tab bar translate Y value when this component mounts
  useEffect(() => {
    // Reset tab bar position when component mounts
    tabBarTranslateY.value = 0;

    // No cleanup needed as we're using a global shared value
  }, []);

  // Handle scroll events
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;

    // Calculate the difference from the last scroll position
    const diff = currentScrollY - lastScrollY.value;

    // Update header position (hide when scrolling down, show when scrolling up)
    if (diff > 0 && currentScrollY > 50) {
      // Scrolling down and not at the top
      // Calculate header height (approx 120px + top insets)
      const headerHeight = 120 + insets.top;
      headerTranslateY.value = withTiming(-headerHeight, {
        duration: 300,
      });

      // Also hide tab bar
      tabBarTranslateY.value = withTiming(90, {
        duration: 300,
      });
    } else if (diff < 0) {
      // Scrolling up
      headerTranslateY.value = withTiming(0, {
        duration: 300,
      });

      // Show tab bar
      tabBarTranslateY.value = withTiming(0, {
        duration: 300,
      });
    }

    // Update last scroll position
    lastScrollY.value = currentScrollY;
  };

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        {headerComponent}
      </Animated.View>

      {/* Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 120 + insets.top }, // Match header height
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {children}
      </ScrollView>

      {/* No Tab Bar Overlay - we'll animate the actual tab bar */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
