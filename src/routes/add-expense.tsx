import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Coffee, Bus, BookOpen, ShoppingBag, Utensils } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import {
  computeBudgetMetrics,
  formatPeso,
  useStore,
} from "@/lib/budget-store";

export const Route = createFileRoute("/add-expense")({
  component: AddExpensePage,
});

const QUICK = [
  { icon: Utensils, label: "Lunch", amount: 80 },
  { icon: Coffee, label: "Snack", amount: 30 },
  { icon: Bus, label: "Fare", amount: 25 },
  { icon: BookOpen, label: "School", amount: 50 },
  { icon: ShoppingBag, label: "Other", amount: 100 },
] as const;

function AddExpensePage() {
  const { user, budget, addExpense } = useStore();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  if (!user) return <Navigate to="/login" />;
  if (!budget) return <Navigate to="/setup" />;

  const m = computeBudgetMetrics(budget);
  const a = Number(amount) || 0;
  const newRemaining = Math.max(m.remaining - a, 0);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (a <= 0) return;
    addExpense(a, note || undefined);
    navigate({ to: "/dashboard" });
  };

  return (
    <PhoneFrame>
      <div className="flex-1 overflow-y-auto pb-6">
        <div className="px-6 pt-12 pb-4 flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="size-10 rounded-full bg-muted grid place-items-center hover:bg-accent transition-base"
            aria-label="Back"
          >
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="text-xl font-bold">Add expense</h1>
        </div>

        <div className="px-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Amount spent
          </p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-4xl font-bold text-muted-foreground">₱</span>
            <input
              autoFocus
              inputMode="decimal"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value.replace(/[^\d.]/g, ""))
              }
              placeholder="0"
              className="flex-1 bg-transparent outline-none text-6xl font-bold tracking-tight placeholder:text-muted-foreground/30"
            />
          </div>
          <div className="h-px bg-border mt-2" />

          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-6">
            Quick add
          </p>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {QUICK.map((q) => {
              const Icon = q.icon;
              return (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => {
                    setAmount(String(q.amount));
                    setNote(q.label);
                  }}
                  className="shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl bg-card shadow-card hover:bg-primary-soft transition-base min-w-[80px]"
                >
                  <Icon className="size-5 text-primary" />
                  <span className="text-xs font-semibold">{q.label}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatPeso(q.amount)}
                  </span>
                </button>
              );
            })}
          </div>

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider">
                Note (optional)
              </label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Lunch with classmates"
                className="mt-2 w-full h-14 px-4 rounded-2xl bg-muted/70 border border-transparent focus:border-primary focus:bg-surface outline-none transition-base text-[15px]"
              />
            </div>

            <div className="rounded-3xl bg-card p-5 shadow-card">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current balance</span>
                <span className="font-semibold">{formatPeso(m.remaining)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">This expense</span>
                <span className="font-semibold text-destructive">
                  -{formatPeso(a)}
                </span>
              </div>
              <div className="h-px bg-border my-3" />
              <div className="flex items-center justify-between">
                <span className="font-semibold">New balance</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPeso(newRemaining)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={a <= 0}
              className="mt-2 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base shadow-card hover:opacity-95 transition-base active:scale-[0.99] disabled:opacity-40"
            >
              Add expense
            </button>
          </form>
        </div>
      </div>
      <BottomNav />
    </PhoneFrame>
  );
}
