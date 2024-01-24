import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "./pages/login";
import HomeScreen from "./pages/Home";
import MenuScreen from "./pages/Menu";
import HomeIcon from "./assets/home2.png"
import HomeOff from "./assets/home1.png"
import MenuOff from "./assets/menu1.png"
import MenuIcon from "./assets/menu2.png"
import { Image } from "react-native";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ 
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Image
            source={focused ? HomeOff : HomeIcon}
            style={{ width: 20, height: 20 }}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Menu"
      component={MenuScreen}
      options={{ 
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Image
            source={focused ? MenuOff : MenuIcon}
            style={{ width: 20, height: 20 }}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeStack"
            component={HomeStack}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
