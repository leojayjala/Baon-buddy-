import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebase/config";
import { getAuthErrorMessage } from "../lib/getAuthErrorMessage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      // Firebase login with email/password
      await signInWithEmailAndPassword(auth, email.trim(), password);

      // Navigation logic:
      // `replace` prevents going back to Login after a successful login
      navigation.replace("Setup");
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerTopTint} />
        <Text style={styles.brand}>Baon Budget Tracker</Text>
        <Text style={styles.headerTitle}>Welcome back</Text>
        <Text style={styles.headerSubtitle}>Login to continue</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

        <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Register")} style={styles.linkWrap}>
          <Text style={styles.link}>
            No account? <Text style={styles.linkStrong}>Register</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f6f7fb" },
  header: {
    backgroundColor: "#16a34a",
    paddingTop: 56,
    paddingBottom: 22,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
  },
  headerTopTint: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: "#22c55e",
    opacity: 0.6,
  },
  brand: { color: "#dcfce7", fontWeight: "800", fontSize: 12, letterSpacing: 0.6 },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "900", marginTop: 8 },
  headerSubtitle: { color: "#dcfce7", marginTop: 6, fontWeight: "700" },
  card: {
    marginTop: -14,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eef2f7",
    gap: 10,
  },
  label: { color: "#475569", fontWeight: "800", fontSize: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700" },
  linkWrap: { marginTop: 6 },
  link: { textAlign: "center", color: "#475569", fontWeight: "700" },
  linkStrong: { color: "#16a34a", fontWeight: "900" },
  error: { color: "crimson", textAlign: "center", fontWeight: "700" },
});
