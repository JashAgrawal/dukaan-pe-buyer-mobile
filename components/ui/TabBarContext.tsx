import React, { createContext, useContext } from 'react';
import { useSharedValue } from 'react-native-reanimated';

// Create a context for the tab bar animation
interface TabBarContextType {
  tabBarTranslateY: ReturnType<typeof useSharedValue<number>>;
}

const TabBarContext = createContext<TabBarContextType | null>(null);

// Provider component
export function TabBarProvider({ children }: { children: React.ReactNode }) {
  // Create the shared value inside a component
  const tabBarTranslateY = useSharedValue(0);

  return (
    <TabBarContext.Provider value={{ tabBarTranslateY }}>
      {children}
    </TabBarContext.Provider>
  );
}

// Hook to use the tab bar context
export function useTabBar() {
  const context = useContext(TabBarContext);
  if (!context) {
    throw new Error('useTabBar must be used within a TabBarProvider');
  }
  return context;
}
