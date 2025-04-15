import { Stack } from "expo-router";
import React from "react";

export default function StoreLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="[id]" />
      <Stack.Screen name="[id]/gallery" />
      <Stack.Screen name="[id]/reviews" />
      <Stack.Screen name="[id]/add-review" />
    </Stack>
  );
}
