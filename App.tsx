import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { colors } from "./src/constants/theme";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { AppStateProvider } from "./src/state/AppState";

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.surface,
    text: colors.textPrimary,
    border: "transparent",
    primary: colors.accent,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
