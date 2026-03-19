import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { colors } from "../constants/theme";
import { AnnouncementsScreen } from "../screens/AnnouncementsScreen";
import { CreateEventScreen } from "../screens/CreateEventScreen";
import { DashboardScreen } from "../screens/DashboardScreen";
import { DJMixingBoardScreen } from "../screens/DJMixingBoardScreen";
import { EventOverviewScreen } from "../screens/EventOverviewScreen";
import { FeedbackScreen } from "../screens/FeedbackScreen";
import { LiveEventModeScreen } from "../screens/LiveEventModeScreen";
import { MusicUploadScreen } from "../screens/MusicUploadScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { TimelineBuilderScreen } from "../screens/TimelineBuilderScreen";
import { WelcomeScreen } from "../screens/WelcomeScreen";

const Tab = createBottomTabNavigator();
const EventsStack = createNativeStackNavigator();
const LiveStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  Dashboard: "grid",
  Events: "calendar",
  Live: "radio",
  Mixer: "disc",
  Music: "musical-notes",
  Settings: "settings",
};

function EventsNavigator() {
  return (
    <EventsStack.Navigator
      initialRouteName="EventOverview"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: "slide_from_right",
      }}
    >
      <EventsStack.Screen name="CreateEvent" component={CreateEventScreen} />
      <EventsStack.Screen name="EventOverview" component={EventOverviewScreen} />
      <EventsStack.Screen name="TimelineBuilder" component={TimelineBuilderScreen} />
      <EventsStack.Screen name="Announcements" component={AnnouncementsScreen} />
    </EventsStack.Navigator>
  );
}

function LiveNavigator() {
  return (
    <LiveStack.Navigator
      initialRouteName="LiveEventMode"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: "slide_from_right",
      }}
    >
      <LiveStack.Screen name="LiveEventMode" component={LiveEventModeScreen} />
      <LiveStack.Screen name="DJMixingBoard" component={DJMixingBoardScreen} />
    </LiveStack.Navigator>
  );
}

function MainTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accentStrong,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 2,
        },
        tabBarStyle: {
          position: "absolute",
          left: 14,
          right: 14,
          bottom: 14,
          height: 78,
          paddingTop: 10,
          paddingBottom: 12,
          borderTopWidth: 1,
          borderColor: "rgba(37,224,255,0.08)",
          borderRadius: 24,
          backgroundColor: "rgba(10,16,32,0.96)",
        },
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons
            name={iconMap[route.name] ?? "ellipse"}
            size={focused ? size + 2 : size}
            color={color}
          />
        ),
        sceneStyle: {
          backgroundColor: colors.bg,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Events" component={EventsNavigator} />
      <Tab.Screen name="Live" component={LiveNavigator} />
      <Tab.Screen name="Mixer" component={DJMixingBoardScreen} />
      <Tab.Screen name="Music" component={MusicUploadScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <RootStack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        animation: "fade",
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <RootStack.Screen name="Welcome" component={WelcomeScreen} />
      <RootStack.Screen name="Feedback" component={FeedbackScreen} />
      <RootStack.Screen name="MainTabs" component={MainTabsNavigator} />
    </RootStack.Navigator>
  );
}
