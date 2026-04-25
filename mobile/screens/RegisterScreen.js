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
      navigation.replace("Dashboard");
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

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

      <Pressable style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Registering..." : "Register"}</Text>
      </Pressable>

      <Pressable onPress={() => navigation.replace("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", gap: 12 },
  title: { fontSize: 20, fontWeight: "700", textAlign: "center" },
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
