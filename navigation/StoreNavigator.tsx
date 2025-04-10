import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StoresScreen from "../screens/StoresScreen";
import StoreCardDemoScreen from "../screens/StoreCardDemoScreen";

export type StoreStackParamList = {
  StoresList: undefined;
  StoreDetails: { storeId: string };
  StoreCardDemo: undefined;
};

const Stack = createStackNavigator<StoreStackParamList>();

const StoreNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="StoresList" component={StoresScreen} />
      <Stack.Screen name="StoreCardDemo" component={StoreCardDemoScreen} />
      {/* Add StoreDetails screen when implemented */}
    </Stack.Navigator>
  );
};

export default StoreNavigator;
