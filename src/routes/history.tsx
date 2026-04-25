import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Coffee, CalendarDays } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import {
  computeBudgetMetrics,
  formatPeso,
  useStore,
} from "@/lib/budget-store";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const { user, budget } = useStore();
  if (!user) return <Navigate to="/login" />;
  if (!budget) return <Navigate to="/setup" />;

  const m = computeBudgetMetrics(budget);

  // Group by day
  const groups = new Map<string, typeof budget.expenses>();
  for (const e of budget.expenses) {
    const key = new Date(e.date).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(e);
  }

  return (
    <PhoneFrame>
      <div className="flex-1 overflow-y-auto pb-6">
        <div className="px-6 pt-12 pb-4 flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-primary-soft grid place-items-center text-primary">
            <CalendarDays className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Spending history</h1>
            <p className="text-xs text-muted-foreground">
              {formatPeso(m.spent)} spent of {formatPeso(budget.totalAmount)}
            </p>
          </div>
        </div>

        <div className="px-5 mt-2 flex flex-col gap-5">
          {groups.size === 0 && (
            <div className="rounded-2xl bg-muted/60 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No expenses logged yet.
              </p>
            </div>
          )}

          {Array.from(groups.entries()).map(([day, items]) => {
            const dayTotal = items.reduce((s, e) => s + e.amount, 0);
            const overDaily = dayTotal > m.dailyBudget;
            return (
              <div key={day}>
                <div className="flex items-center justify-between px-1 mb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {day}
                  </p>
                  <span
                    className={`text-xs font-bold ${
                      overDaily ? "text-destructive" : "text-primary"
                    }`}
                  >
                    {formatPeso(dayTotal)}
                  </span>
                </div>
                <div className="rounded-3xl bg-card shadow-card overflow-hidden">
                  {items.map((e, idx) => (
                    <div
                      key={e.id}
                      className={`flex items-center gap-3 p-3 ${
                        idx > 0 ? "border-t border-border" : ""
                      }`}
                    >
                      <div className="size-10 rounded-xl bg-primary-soft grid place-items-center text-primary">
                        <Coffee className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {e.note || "Expense"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(e.date).toLocaleTimeString("en-PH", {
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
            );
          })}
        </div>
      </div>
      <BottomNav />
    </PhoneFrame>
  );
}
