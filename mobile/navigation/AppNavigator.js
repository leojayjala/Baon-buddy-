// React Navigation setup (Native Stack)
// All screens live in one stack, but App.js resets the stack on auth changes.
// This prevents logged-in users from going back to Login/Register.

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DashboardScreen from "../screens/DashboardScreen";
import SetupScreen from "../screens/SetupScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Setup" component={SetupScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: "Add Expense" }} />
    </Stack.Navigator>
  );
}
