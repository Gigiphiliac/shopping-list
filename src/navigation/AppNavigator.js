import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { themeColor, useTheme } from "react-native-rapi-ui";
import TabBarIcon from "../components/utils/TabBarIcon";
import TabBarText from "../components/utils/TabBarText";

import Journal from "../screens/Journal";
import SecondScreen from "../screens/SecondScreen";
import NewEntry from "../screens/NewEntry";
import MyPlants from "../screens/MyPlants";

const MainStack = createNativeStackNavigator();
const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen
        name="MainTabs"
        component={MainTabs}
      />
      <MainStack.Screen
        name="SecondScreen"
        component={SecondScreen}
      />
    </MainStack.Navigator>
  );
};

const Tabs = createBottomTabNavigator();
const MainTabs = () => {
  const { isDarkmode } = useTheme();
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopColor: isDarkmode ? themeColor.dark100 : "#c0c0c0",
          backgroundColor: isDarkmode ? themeColor.dark200 : "#ffffff",
        },
      }}
    >
      {/* These icons using Ionicons */}
      <Tabs.Screen
        name="Journal"
        component={Journal}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText
              focused={focused}
              title="Journal"
            />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={"book"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="New Entry"
        component={NewEntry}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText
              focused={focused}
              title="New Entry"
            />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={"add-circle"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="My Plants"
        component={MyPlants}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText
              focused={focused}
              title="My Plants"
            />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={"leaf"}
            />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default () => {
  return (
    <NavigationContainer>
      <Main />
    </NavigationContainer>
  );
};
