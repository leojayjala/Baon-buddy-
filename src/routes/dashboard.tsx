import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Plus,
  Wallet,
  Coffee,
} from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import {
  computeBudgetMetrics,
  formatPeso,
  useStore,
} from "@/lib/budget-store";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user, budget } = useStore();
  if (!user) return <Navigate to="/login" />;
  if (!budget) return <Navigate to="/setup" />;

  const m = computeBudgetMetrics(budget);
  const recent = budget.expenses.slice(0, 4);

  return (
    <PhoneFrame>
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Header */}
        <div className="bg-gradient-hero text-primary-foreground px-6 pt-12 pb-24 rounded-b-[2rem]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-80">Hello,</p>
              <p className="font-semibold">
                {user.email.split("@")[0]} 👋
              </p>
            </div>
            <div className="size-10 rounded-full bg-white/20 grid place-items-center">
              <Wallet className="size-5" />
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs opacity-80 uppercase tracking-wider">
              Remaining balance
            </p>
            <p className="text-5xl font-bold mt-1 tracking-tight">
              {formatPeso(m.remaining)}
            </p>
            <div className="flex items-center gap-2 mt-2 text-sm">
              {m.onBudget ? (
                <>
                  <TrendingUp className="size-4" />
                  <span className="opacity-90">You're on budget 🎉</span>
                </>
              ) : (
                <>
                  <TrendingDown className="size-4" />
                  <span className="opacity-90">A bit over today's pace</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="px-5 -mt-16">
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={<Calendar className="size-5" />}
              label="Days left"
              value={`${m.daysLeft}`}
              suffix="days"
            />
            <StatCard
              icon={<Wallet className="size-5" />}
              label="Daily budget"
              value={formatPeso(m.dailyBudget)}
              suffix="/day"
            />
          </div>

          {/* Progress card */}
          <div className="mt-3 rounded-3xl bg-card p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold">Spending progress</p>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  m.onBudget
                    ? "bg-primary-soft text-primary"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {m.onBudget ? "On track" : "Overspending"}
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-base ${
                  m.onBudget ? "bg-primary" : "bg-destructive"
                }`}
                style={{ width: `${m.percentSpent}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <span>Spent {formatPeso(m.spent)}</span>
              <span>Total {formatPeso(budget.totalAmount)}</span>
            </div>
          </div>

          {/* Recent expenses */}
          <div className="mt-6 flex items-center justify-between">
            <h3 className="font-semibold">Recent expenses</h3>
            <Link
              to="/history"
              className="text-xs font-semibold text-primary"
            >
              See all
            </Link>
          </div>

          <div className="mt-3 flex flex-col gap-2">
            {recent.length === 0 && (
              <div className="rounded-2xl bg-muted/60 p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No expenses yet. Tap{" "}
                  <Link to="/add-expense" className="text-primary font-semibold">
                    + Add
                  </Link>{" "}
                  to log your first one.
                </p>
              </div>
            )}
            {recent.map((e) => (
              <div
                key={e.id}
                className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-card"
              >
                <div className="size-11 rounded-xl bg-primary-soft grid place-items-center text-primary">
                  <Coffee className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {e.note || "Expense"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(e.date).toLocaleString("en-PH", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <p className="font-bold text-destructive">
                  -{formatPeso(e.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAB */}
        <Link
          to="/add-expense"
          className="absolute right-5 bottom-24 size-14 rounded-2xl bg-primary text-primary-foreground grid place-items-center shadow-elevated hover:scale-105 transition-base"
          aria-label="Add expense"
        >
          <Plus className="size-7" strokeWidth={2.5} />
        </Link>
      </div>
      <BottomNav />
    </PhoneFrame>
  );
}

function StatCard({
  icon,
  label,
  value,
  suffix,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-3xl bg-card p-5 shadow-card">
      <div className="size-9 rounded-xl bg-primary-soft grid place-items-center text-primary">
        {icon}
      </div>
      <p className="text-xs text-muted-foreground mt-3">{label}</p>
      <p className="text-2xl font-bold mt-0.5">
        {value}
        {suffix && (
          <span className="text-sm font-medium text-muted-foreground ml-1">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}
