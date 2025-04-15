import { Text, type TextProps, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  FONTS,
  FONT_SIZES,
  LINE_HEIGHTS,
  TEXT_STYLES,
} from "@/lib/constants/Styles";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color, fontFamily: FONTS.REGULAR },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    ...TEXT_STYLES.body1,
  },
  defaultSemiBold: {
    ...TEXT_STYLES.body1,
    fontFamily: FONTS.SEMIBOLD,
  },
  title: {
    ...TEXT_STYLES.h1,
  },
  subtitle: {
    ...TEXT_STYLES.h4,
  },
  link: {
    ...TEXT_STYLES.link,
  },
});
