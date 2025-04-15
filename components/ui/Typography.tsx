import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type TypographyProps = TextProps & {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body1"
    | "body2"
    | "caption"
    | "button";
  font?: "jost" | "montserrat";
  weight?: "regular" | "medium" | "semibold" | "bold" | "black";
  color?: string;
  lightColor?: string;
  darkColor?: string;
};

export function Typography({
  style,
  variant = "body1",
  font = "jost",
  weight = "regular",
  color,
  lightColor,
  darkColor,
  children,
  ...rest
}: TypographyProps) {
  const themeColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );
  const textColor = color || themeColor;

  // Determine font family based on font and weight
  let fontFamily = "Jost-Regular";
  if (font === "montserrat") {
    // For Montserrat, we only have Bold available
    fontFamily = "Montserrat-Bold";
  } else {
    // For Jost, we have all weights
    if (weight === "regular") fontFamily = "Jost-Regular";
    if (weight === "medium") fontFamily = "Jost-Medium";
    if (weight === "bold") fontFamily = "Jost-Bold";
    // Additional weights
    if (weight === "semibold") fontFamily = "Jost-SemiBold";
    if (weight === "black") fontFamily = "Jost-Black";
  }

  return (
    <Text
      style={[
        { color: textColor, fontFamily },
        styles[variant],
        weight === "medium" && styles.medium,
        weight === "bold" && styles.bold,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    lineHeight: 26,
  },
  h6: {
    fontSize: 16,
    lineHeight: 24,
  },
  body1: {
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    lineHeight: 24,
    textTransform: "uppercase",
  },
  medium: {
    fontWeight: "500",
  },
  bold: {
    fontWeight: "bold",
  },
});

// Export convenience components
export const H1 = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="h1" weight="bold" {...props} />
);

export const H2 = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="h2" weight="bold" {...props} />
);

export const H3 = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="h3" weight="bold" {...props} />
);

export const H4 = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="h4" weight="bold" {...props} />
);

export const H5 = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="h5" weight="bold" {...props} />
);

export const H6 = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="h6" weight="bold" {...props} />
);

export const Body1 = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="body1" {...props} />
);

export const Body2 = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="body2" {...props} />
);

export const Caption = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="caption" {...props} />
);

export const Button = (props: Omit<TypographyProps, "variant">) => (
  <Typography variant="button" weight="medium" {...props} />
);
