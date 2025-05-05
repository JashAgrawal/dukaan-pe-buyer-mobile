import React from "react";
import { Stack } from "expo-router";

export default function CartLayout() {

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      {/* All cart functionality is now consolidated in the index page */}
    </Stack>
  );
}
