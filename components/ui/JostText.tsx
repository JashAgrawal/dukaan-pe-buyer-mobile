import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { FONTS } from "@/lib/constants/Styles";

export type JostTextProps = TextProps & {
  weight?: "regular" | "medium" | "semibold" | "bold" | "black";
};

/**
 * A Text component that uses Jost font by default with weight options
 */
export function JostText(props: JostTextProps) {
  const { style, weight = "regular", ...rest } = props;

  // Determine font family based on weight
  let fontFamily = FONTS.REGULAR;
  if (weight === "medium") fontFamily = FONTS.MEDIUM;
  if (weight === "semibold") fontFamily = FONTS.SEMIBOLD;
  if (weight === "bold") fontFamily = FONTS.BOLD;
  if (weight === "black") fontFamily = FONTS.BLACK;

  return <Text style={[{ fontFamily }, style]} {...rest} />;
}

export default JostText;
