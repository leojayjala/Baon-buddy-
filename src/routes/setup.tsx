import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Wallet, Calendar, Sparkles } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { useStore, formatPeso } from "@/lib/budget-store";

export const Route = createFileRoute("/setup")({
  component: SetupPage,
});

function SetupPage() {
  const { user, setupBudget } = useStore();
  const navigate = useNavigate();
  const [total, setTotal] = useState("1300");
  const [days, setDays] = useState("13");

  if (!user) return <Navigate to="/login" />;

  const t = Number(total) || 0;
  const d = Number(days) || 0;
  const perDay = d > 0 ? t / d : 0;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (t <= 0 || d <= 0) return;
    setupBudget(t, d);
    navigate({ to: "/dashboard" });
  };

  return (
    <PhoneFrame>
      <div className="flex-1 flex flex-col px-7 pt-14 pb-8 overflow-y-auto">
        <div className="flex items-center gap-2 text-primary mb-4">
          <Sparkles className="size-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Quick setup
          </span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight leading-tight">
          Let's set your <span className="text-primary">baon</span>.
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Tell us how much money you have and how long it should last.
        </p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
          <BigInput
            icon={<Wallet className="size-5" />}
            label="Total money"
            prefix="₱"
            value={total}
            onChange={setTotal}
          />
          <BigInput
            icon={<Calendar className="size-5" />}
            label="Number of days"
            suffix="days"
            value={days}
            onChange={setDays}
          />

          <div className="rounded-3xl bg-gradient-hero p-6 text-primary-foreground shadow-elevated mt-2">
            <p className="text-xs uppercase tracking-wider opacity-80">
              Daily budget
            </p>
            <p className="text-4xl font-bold mt-1">
              {formatPeso(perDay)}
              <span className="text-base font-medium opacity-80"> /day</span>
            </p>
            <p className="text-xs opacity-80 mt-2">
              {formatPeso(t)} ÷ {d || 0} days
            </p>
          </div>

          <button
            type="submit"
            className="mt-4 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base shadow-card hover:opacity-95 transition-base active:scale-[0.99]"
          >
            Calculate Budget
          </button>
        </form>
      </div>
    </PhoneFrame>
  );
}

function BigInput({
  icon,
  label,
  prefix,
  suffix,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  prefix?: string;
  suffix?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      <div className="mt-2 flex items-center gap-3 h-16 px-5 rounded-2xl bg-muted/70 border border-transparent focus-within:border-primary focus-within:bg-surface transition-base">
        <span className="text-primary">{icon}</span>
        {prefix && (
          <span className="text-2xl font-bold text-foreground">{prefix}</span>
        )}
        <input
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ""))}
          className="flex-1 bg-transparent outline-none text-2xl font-bold text-foreground"
        />
        {suffix && (
          <span className="text-sm font-medium text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
