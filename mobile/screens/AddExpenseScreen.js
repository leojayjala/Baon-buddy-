import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

// Minimal logic:
// - validate amount
// - pass it back to Dashboard via navigation params

export default function AddExpenseScreen({ navigation }) {
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAdd = () => {
    setErrorMessage("");

    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setErrorMessage("Please enter a valid amount (greater than 0).");
      return;
    }

    // Pass the expense back to Dashboard.
    // Dashboard listens to `route.params.addedExpense` and updates its state.
    navigation.navigate("Dashboard", { addedExpense: parsed });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Expense</Text>
      <Text style={styles.subtitle}>Log what you spent today</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter amount (₱)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Pressable style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Expense</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", gap: 12, backgroundColor: "#f7f7f7" },
  title: { fontSize: 24, fontWeight: "800", textAlign: "center", color: "#0f172a" },
  subtitle: { fontSize: 14, textAlign: "center", color: "#475569", marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  error: { color: "crimson", textAlign: "center", fontWeight: "700" },
});
