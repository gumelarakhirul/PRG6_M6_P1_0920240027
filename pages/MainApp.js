import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./LoginScreen";
import ListScreen from "./ListScreen";
import DetailScreen from "./DetailScreen";

const Stack = createNativeStackNavigator();

export default function MainApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="List Riwayat" component={ListScreen} />
        <Stack.Screen name="Form Laporan" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

