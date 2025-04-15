import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";

export type JostTextProps = TextProps & {
  weight?: "regular" | "medium" | "semibold" | "bold" | "black";
};

/**
 * A Text component that uses Jost font by default with weight options
 */
export function JostText(props: JostTextProps) {
  const { style, weight = "regular", ...rest } = props;

  // Determine font family based on weight
  let fontFamily = "Jost-Regular";
  if (weight === "medium") fontFamily = "Jost-Medium";
  if (weight === "semibold") fontFamily = "Jost-SemiBold";
  if (weight === "bold") fontFamily = "Jost-Bold";
  if (weight === "black") fontFamily = "Jost-Black";

  return <Text style={[{ fontFamily }, style]} {...rest} />;
}

export default JostText;
