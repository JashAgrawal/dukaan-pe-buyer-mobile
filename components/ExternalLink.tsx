import { Link } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { type ComponentProps } from "react";
import { Platform, TouchableOpacity, Text } from "react-native";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  children?: React.ReactNode;
};

export function ExternalLink({ href, children, ...rest }: Props) {
  const handlePress = async (event: any) => {
    if (Platform.OS !== "web") {
      // Prevent the default behavior of linking to the default browser on native.
      event.preventDefault();
      // Open the link in an in-app browser.
      await openBrowserAsync(href);
    }
  };

  // On native platforms, use TouchableOpacity instead of Link
  if (Platform.OS !== "web") {
    return (
      <TouchableOpacity onPress={handlePress} {...rest}>
        {children}
      </TouchableOpacity>
    );
  }

  // On web, use Link with target="_blank"
  return (
    <Link
      target="_blank"
      {...rest}
      href={href as any} // Type assertion to fix TypeScript error
      onPress={handlePress}
    >
      {children}
    </Link>
  );
}
