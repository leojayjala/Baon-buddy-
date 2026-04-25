import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";

import { auth } from "../firebase/config";

export default function DashboardScreen({ navigation }) {
  const handleLogout = async () => {
    // Firebase logout
    await signOut(auth);

    // Navigation logic:
    // `replace` prevents going "back" to Dashboard after logout
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome User</Text>
      <Text style={styles.subtitle}>{auth.currentUser?.email ?? ""}</Text>

      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", gap: 12 },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  subtitle: { fontSize: 14, textAlign: "center", color: "#444" },
  button: {
    backgroundColor: "#111",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "700" },
});

