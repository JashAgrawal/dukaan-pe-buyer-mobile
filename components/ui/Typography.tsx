import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FONTS, FONT_SIZES, LINE_HEIGHTS } from "@/lib/constants/Styles";

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
  const textColor = color || "#000000";

  // Determine font family based on font and weight
  let fontFamily = FONTS.REGULAR;
  if (font === "montserrat") {
    // For Montserrat, we only have Bold available
    fontFamily = FONTS.MONTSERRAT_BOLD;
  } else {
    // For Jost, we have all weights
    if (weight === "regular") fontFamily = FONTS.REGULAR;
    if (weight === "medium") fontFamily = FONTS.MEDIUM;
    if (weight === "bold") fontFamily = FONTS.BOLD;
    // Additional weights
    if (weight === "semibold") fontFamily = FONTS.SEMIBOLD;
    if (weight === "black") fontFamily = FONTS.BLACK;
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
    fontSize: FONT_SIZES.HUGE,
    lineHeight: LINE_HEIGHTS.XXXL,
  },
  h2: {
    fontSize: FONT_SIZES.XXXL,
    lineHeight: LINE_HEIGHTS.XXL,
  },
  h3: {
    fontSize: FONT_SIZES.XXL,
    lineHeight: LINE_HEIGHTS.XL,
  },
  h4: {
    fontSize: FONT_SIZES.XL,
    lineHeight: LINE_HEIGHTS.LG,
  },
  h5: {
    fontSize: FONT_SIZES.LG,
    lineHeight: LINE_HEIGHTS.MD,
  },
  h6: {
    fontSize: FONT_SIZES.MD,
    lineHeight: LINE_HEIGHTS.MD,
  },
  body1: {
    fontSize: FONT_SIZES.MD,
    lineHeight: LINE_HEIGHTS.MD,
  },
  body2: {
    fontSize: FONT_SIZES.SM,
    lineHeight: LINE_HEIGHTS.SM,
  },
  caption: {
    fontSize: FONT_SIZES.XS,
    lineHeight: LINE_HEIGHTS.XS,
  },
  button: {
    fontSize: FONT_SIZES.MD,
    lineHeight: LINE_HEIGHTS.MD,
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
