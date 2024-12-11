import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView, StatusBar } from "react-native";
import SplashScreen from "./screens/splash";
import SigninandCreate from "./screens/signinandcreate";
import HomeScreen from "./screens/home";
import AboutUsScreen from "./screens/aboutus";
import SignIn from "./screens/signin";
import SignUp from "./screens/signup";
import ProfileScreen from "./screens/profile";

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />

        <Stack.Navigator initialRouteName="SplashScreen">
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="SigninandCreate"
            component={SigninandCreate}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="AboutUsScreen"
            component={AboutUsScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}
