import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";

import { auth } from "../firebase/config";

function formatMoney(value) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return "0.00";
  return numberValue.toFixed(2);
}

export default function DashboardScreen({ navigation, route }) {
  const username = auth.currentUser?.email?.split("@")?.[0] ?? "User";

  // Budget state (simple + beginner-friendly)
  // SetupScreen passes initial values using navigation params.
  const [totalMoney, setTotalMoney] = useState(route?.params?.totalMoney ?? 0);
  const [numberOfDays, setNumberOfDays] = useState(route?.params?.numberOfDays ?? 0);
  const [dailyBudget, setDailyBudget] = useState(route?.params?.dailyBudget ?? 0);
  const [expenses, setExpenses] = useState(route?.params?.expenses ?? []);

  // If Setup recalculates and replaces Dashboard with new params, we sync state here.
  useEffect(() => {
    if (!route?.params) return;

    const nextTotal = route.params.totalMoney;
    const nextDays = route.params.numberOfDays;
    const nextDaily = route.params.dailyBudget;

    if (typeof nextTotal === "number") setTotalMoney(nextTotal);
    if (typeof nextDays === "number") setNumberOfDays(nextDays);
    if (typeof nextDaily === "number") setDailyBudget(nextDaily);

    if (Array.isArray(route.params.expenses)) setExpenses(route.params.expenses);
  }, [route?.params]);

  // When AddExpenseScreen navigates back with { addedExpense }, add it to state once.
  useEffect(() => {
    const added = route?.params?.addedExpense;
    if (typeof added !== "number") return;

    setExpenses((prev) => [...prev, added]);

    // Clear the param so it doesn't re-add on re-render.
    navigation.setParams({ addedExpense: undefined });
  }, [navigation, route?.params?.addedExpense]);

  const spent = useMemo(() => expenses.reduce((sum, amount) => sum + amount, 0), [expenses]);

  // remainingBalance = totalMoney - sum(expenses)
  const remainingBalance = useMemo(() => totalMoney - spent, [totalMoney, spent]);

  // If user reaches Dashboard without setup, send them to Setup.
  useEffect(() => {
    if (!totalMoney || !numberOfDays) {
      navigation.replace("Setup");
    }
  }, [navigation, numberOfDays, totalMoney]);

  const handleLogout = async () => {
    // Firebase logout
    await signOut(auth);

    // Navigation logic:
    // `replace` prevents going "back" to Dashboard after logout
    navigation.replace("Login");
  };

  return (
    <View style={styles.screen}>
      {/* Header Section (green area) */}
      <View style={styles.header}>
        {/* Simple "gradient" look with layered colors (no extra libraries) */}
        <View style={styles.headerTopTint} />

        <Text style={styles.greeting}>Hello, {username} 👋</Text>
        <Text style={styles.balance}>₱{formatMoney(remainingBalance)}</Text>
        <Text style={styles.onBudget}>You&apos;re on budget 🎉</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Info Cards */}
        <View style={styles.row}>
          <View style={styles.infoCard}>
            <Text style={styles.icon}>📅</Text>
            <Text style={styles.cardLabel}>Days left</Text>
            <Text style={styles.cardValue}>{numberOfDays} days</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.icon}>💰</Text>
            <Text style={styles.cardLabel}>Daily budget</Text>
            <Text style={styles.cardValue}>₱{formatMoney(dailyBudget)}/day</Text>
          </View>
        </View>

        {/* Spending Progress */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Spending progress</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>On track</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          {/* Simple progress: spent / totalMoney (clamped from 0-100%) */}
          <View
            style={[
              styles.progressFill,
              {
                width: totalMoney > 0 ? `${Math.min(100, Math.max(0, (spent / totalMoney) * 100))}%` : "0%",
              },
            ]}
          />
        </View>
        <View style={styles.progressFooter}>
          <Text style={styles.muted}>Spent ₱{formatMoney(spent)}</Text>
          <Text style={styles.muted}>Total ₱{formatMoney(totalMoney)}</Text>
        </View>

        {/* Recent Expenses */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent expenses</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>
        <View style={styles.emptyStateCard}>
          {expenses.length === 0 ? (
            <Text style={styles.emptyStateText}>
              No expenses yet. Tap + Add to log your first one.
            </Text>
          ) : (
            <Text style={styles.emptyStateText}>You have {expenses.length} expense(s) logged.</Text>
          )}
        </View>
      </View>

      {/* Floating Action Button */}
      <Pressable style={styles.fab} onPress={() => navigation.navigate("AddExpense")}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      {/* Bottom Navigation Bar (UI only) */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem}>
          <Text style={[styles.navText, styles.navTextActive]}>🏠 Home</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => navigation.navigate("AddExpense")}>
          <Text style={styles.navText}>➕ Add</Text>
        </Pressable>
        <Pressable style={styles.navItem}>
          <Text style={styles.navText}>🕓 History</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={handleLogout}>
          <Text style={styles.navText}>🚪 Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f6f7fb" },
  header: {
    backgroundColor: "#16a34a",
    paddingTop: 44,
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
  greeting: { color: "#dcfce7", fontSize: 14, fontWeight: "700" },
  balance: { color: "#fff", fontSize: 36, fontWeight: "900", marginTop: 8 },
  onBudget: { color: "#dcfce7", fontSize: 13, marginTop: 6 },

  content: { flex: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 90, gap: 14 },
  row: { flexDirection: "row", gap: 12 },
  infoCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eef2f7",
    gap: 6,
  },
  icon: { fontSize: 18 },
  cardLabel: { color: "#64748b", fontSize: 12, fontWeight: "700" },
  cardValue: { color: "#0f172a", fontSize: 16, fontWeight: "900" },

  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { fontSize: 16, fontWeight: "900", color: "#0f172a" },
  seeAll: { color: "#16a34a", fontWeight: "800" },
  badge: { backgroundColor: "#dcfce7", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  badgeText: { color: "#16a34a", fontWeight: "900", fontSize: 12 },

  progressTrack: { height: 10, borderRadius: 999, backgroundColor: "#e5e7eb", overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#22c55e", borderRadius: 999 },
  progressFooter: { flexDirection: "row", justifyContent: "space-between" },
  muted: { color: "#64748b", fontWeight: "700" },

  emptyStateCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eef2f7",
  },
  emptyStateText: { color: "#475569", fontWeight: "700", lineHeight: 18 },

  fab: {
    position: "absolute",
    right: 18,
    bottom: 86,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabText: { color: "#fff", fontSize: 28, fontWeight: "900", marginTop: -2 },

  bottomNav: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: "#fff",
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#eef2f7",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navItem: { paddingHorizontal: 8, paddingVertical: 6 },
  navText: { color: "#64748b", fontWeight: "800" },
  navTextActive: { color: "#16a34a" },
});
