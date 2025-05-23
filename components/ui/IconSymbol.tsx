// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import React from "react";
import { OpaqueColorValue } from "react-native";

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  "house.fill": "home",
  "heart.fill": "favorite",
  "star.fill": "star",
  qrcode: "qr-code-scanner",
  "list.bullet": "category",
  "person.fill": "person",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "location-on": "location-on",
  search: "search",
  "keyboard-arrow-down": "keyboard-arrow-down",
  "arrow-back": "arrow-back",
  "00.circle.hi": "circle",
  "arrow.left": "chevron-left",
  // Add missing icon mappings
  "location.fill": "location-on",
  "bag.fill": "shopping-bag",
  "bell.fill": "notifications",
  "link.fill": "link",
  "lock.fill": "lock",
  "questionmark.circle.fill": "help",
  "doc.text.fill": "description",
} as Partial<
  Record<
    import("expo-symbols").SymbolViewProps["name"],
    React.ComponentProps<typeof MaterialIcons>["name"]
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: any;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      // @ts-ignore
      name={MAPPING[name] ?? name}
      style={style}
    />
  );
}
