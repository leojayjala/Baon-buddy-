import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

export default function SetupScreen({ navigation }) {
  // State management (as required)
  const [totalMoney, setTotalMoney] = useState(""); // store as string from TextInput
  const [numberOfDays, setNumberOfDays] = useState(""); // store as string from TextInput
  const [dailyBudget, setDailyBudget] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [expenses, setExpenses] = useState([]); // will start empty

  const [errorMessage, setErrorMessage] = useState("");

  // handleCalculateBudget()
  // - dailyBudget = totalMoney / numberOfDays
  // - remainingBalance starts equal to totalMoney (before any expenses)
  const handleCalculateBudget = () => {
    setErrorMessage("");

    // Convert input strings to numbers.
    // We also remove commas/spaces so inputs like "1,300" work.
    const total = Number(String(totalMoney).replace(/[, ]/g, ""));
    const days = Number(String(numberOfDays).replace(/[, ]/g, ""));

    if (!Number.isFinite(total) || total <= 0) {
      setErrorMessage("Please enter a valid total money amount (greater than 0).");
      return;
    }
    if (!Number.isFinite(days) || days <= 0) {
      setErrorMessage("Please enter a valid number of days (greater than 0).");
      return;
    }

    // dailyBudget formula:
    // dailyBudget = totalMoney / numberOfDays
    // We round to 2 decimals for a cleaner display.
    const calculatedDailyBudget = Math.round((total / days) * 100) / 100;

    setDailyBudget(calculatedDailyBudget);
    setRemainingBalance(total);
    setExpenses([]);

    // Data flow:
    // Pass the calculated values to Dashboard using navigation params.
    // `replace` prevents going "back" to Setup after continuing.
    navigation.replace("Dashboard", {
      totalMoney: total,
      numberOfDays: days,
      dailyBudget: calculatedDailyBudget,
      remainingBalance: total,
      expenses: [],
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerTopTint} />
        <Text style={styles.brand}>Baon Budget Tracker</Text>
        <Text style={styles.headerTitle}>Budget Setup</Text>
        <Text style={styles.headerSubtitle}>Set your total money and days</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Total money</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 1300"
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          value={totalMoney}
          onChangeText={setTotalMoney}
        />

        <Text style={styles.label}>Number of days</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 13"
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          value={numberOfDays}
          onChangeText={setNumberOfDays}
        />

        {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

        <Pressable style={styles.button} onPress={handleCalculateBudget}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>

        {/* These states are stored here as practice, but the dashboard is the main place users will see them */}
        {(dailyBudget > 0 || remainingBalance > 0 || expenses.length > 0) && (
          <Text style={styles.hint}>Budget calculated. Redirecting to Dashboard…</Text>
        )}
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
    marginTop: 4,
  },
  buttonText: { color: "#fff", fontWeight: "900" },
  error: { color: "crimson", textAlign: "center", fontWeight: "700" },
  hint: { textAlign: "center", color: "#444" },
});
