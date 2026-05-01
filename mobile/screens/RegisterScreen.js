import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebase/config";
import { getAuthErrorMessage } from "../lib/getAuthErrorMessage";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      // Firebase register with email/password
      await createUserWithEmailAndPassword(auth, email.trim(), password);

      // After registration, the user is logged in automatically.
      // `replace` prevents going back to Register.
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
        <Text style={styles.headerTitle}>Create account</Text>
        <Text style={styles.headerSubtitle}>Start tracking your budget</Text>
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
          placeholder="At least 6 characters"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

        <Pressable style={styles.button} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Registering..." : "Register"}</Text>
        </Pressable>

        <Pressable onPress={() => navigation.replace("Login")} style={styles.linkWrap}>
          <Text style={styles.link}>
            Already have an account? <Text style={styles.linkStrong}>Login</Text>
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
