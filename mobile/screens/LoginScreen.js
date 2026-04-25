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
      navigation.replace("Dashboard");
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Baon Budget Tracker</Text>
      <Text style={styles.subtitle}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>No account? Register</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", gap: 12 },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  subtitle: { fontSize: 18, fontWeight: "600", textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#111",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700" },
  link: { textAlign: "center", marginTop: 8, color: "#111" },
  error: { color: "crimson", textAlign: "center" },
});
