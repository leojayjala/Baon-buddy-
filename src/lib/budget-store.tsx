import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Expense = {
  id: string;
  amount: number;
  date: string; // ISO
  note?: string;
};

type BudgetState = {
  totalAmount: number;
  totalDays: number;
  startDate: string; // ISO
  expenses: Expense[];
};

type AuthState = {
  email: string;
} | null;

type Store = {
  user: AuthState;
  budget: BudgetState | null;
  login: (email: string) => void;
  register: (email: string) => void;
  logout: () => void;
  setupBudget: (total: number, days: number) => void;
  addExpense: (amount: number, note?: string) => void;
  resetBudget: () => void;
};

const StoreContext = createContext<Store | null>(null);

const STORAGE_KEY = "baon-budget-state-v1";

type Persisted = { user: AuthState; budget: BudgetState | null };

function loadPersisted(): Persisted {
  if (typeof window === "undefined") return { user: null, budget: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, budget: null };
    return JSON.parse(raw) as Persisted;
  } catch {
    return { user: null, budget: null };
  }
}

export function BudgetStoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthState>(null);
  const [budget, setBudget] = useState<BudgetState | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const data = loadPersisted();
    setUser(data.user);
    setBudget(data.budget);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user, budget }),
    );
  }, [user, budget, hydrated]);

  const value = useMemo<Store>(
    () => ({
      user,
      budget,
      login: (email) => setUser({ email }),
      register: (email) => setUser({ email }),
      logout: () => {
        setUser(null);
      },
      setupBudget: (total, days) =>
        setBudget({
          totalAmount: total,
          totalDays: days,
          startDate: new Date().toISOString(),
          expenses: [],
        }),
      addExpense: (amount, note) =>
        setBudget((prev) =>
          prev
            ? {
                ...prev,
                expenses: [
                  {
                    id: crypto.randomUUID(),
                    amount,
                    date: new Date().toISOString(),
                    note,
                  },
                  ...prev.expenses,
                ],
              }
            : prev,
        ),
      resetBudget: () => setBudget(null),
    }),
    [user, budget],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside BudgetStoreProvider");
  return ctx;
}

export function computeBudgetMetrics(b: BudgetState) {
  const spent = b.expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = Math.max(b.totalAmount - spent, 0);

  const start = new Date(b.startDate);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const elapsedDays = Math.floor(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  const daysLeft = Math.max(b.totalDays - elapsedDays, 0);
  const dailyBudget = b.totalAmount / b.totalDays;
  const idealRemaining = b.totalAmount - dailyBudget * elapsedDays;
  const onBudget = remaining >= idealRemaining;
  const percentSpent = Math.min((spent / b.totalAmount) * 100, 100);

  return {
    spent,
    remaining,
    daysLeft,
    dailyBudget,
    onBudget,
    percentSpent,
    elapsedDays,
  };
}

export function formatPeso(n: number) {
  return `₱${n.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;
}
