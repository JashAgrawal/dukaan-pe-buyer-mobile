import React from "react";
import { StyleSheet } from "react-native";

/**
 * FontProvider component that provides Jost font family to the app
 *
 * Note: We no longer override Text.render and TextInput.render directly
 * as it causes TypeScript errors. Instead, we use the Typography component
 * and global styles to apply fonts consistently.
 */
export function FontProvider({ children }: { children: React.ReactNode }) {
  // Simply pass through children - font styling is handled by Typography component
  // and global styles in global.css
  return <React.Fragment>{children}</React.Fragment>;
}

export default FontProvider;

// Note: If you need to apply Jost font to a specific component,
// use the Typography component or JostText component instead.
