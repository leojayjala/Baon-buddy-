import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { NavigationContainer, CommonActions, createNavigationContainerRef } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase/config";
import AppNavigator from "./navigation/AppNavigator";

const navigationRef = createNavigationContainerRef();

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [navReady, setNavReady] = useState(false);
  const lastResetRouteNameRef = useRef(null);

  useEffect(() => {
    // Auth state persistence:
    // This runs on app open and whenever the user logs in/out.
    // If user is logged in -> we show Dashboard
    // If not -> we show Login/Register
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (checkingAuth || !navReady || !navigationRef.isReady()) return;

    // Navigation logic:
    // When auth state changes, reset the stack so users can't go "back" to screens
    // that no longer make sense (e.g., going back to Login after logging in).
    const targetRouteName = user ? "Dashboard" : "Login";
    if (lastResetRouteNameRef.current === targetRouteName) return;

    lastResetRouteNameRef.current = targetRouteName;
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: targetRouteName }],
      })
    );
  }, [checkingAuth, navReady, user]);

  // Simple loading screen while we check saved auth state
  if (checkingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef} onReady={() => setNavReady(true)}>
      <AppNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
});
