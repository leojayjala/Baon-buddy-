import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Wallet, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { useStore } from "@/lib/budget-store";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    login(email);
    navigate({ to: "/" });
  };

  return (
    <PhoneFrame>
      <div className="flex-1 flex flex-col px-7 pt-16 pb-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="size-12 rounded-2xl bg-gradient-hero grid place-items-center shadow-card">
            <Wallet className="size-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Baon</h1>
            <p className="text-xs text-muted-foreground">Budget Tracker</p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Welcome back 👋</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Sign in to keep your baon on track.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Field
            icon={<Mail className="size-5" />}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={setEmail}
          />
          <Field
            icon={<Lock className="size-5" />}
            type={showPw ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={setPassword}
            trailing={
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Toggle password visibility"
              >
                {showPw ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            }
          />

          <button
            type="button"
            className="text-xs text-primary font-medium self-end -mt-1"
          >
            Forgot password?
          </button>

          <button
            type="submit"
            className="mt-4 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base shadow-card hover:opacity-95 transition-base active:scale-[0.99]"
          >
            Log in
          </button>
        </form>

        <p className="mt-auto text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/register" className="text-primary font-semibold">
            Create an account
          </Link>
        </p>
      </div>
    </PhoneFrame>
  );
}

export function Field({
  icon,
  type,
  placeholder,
  value,
  onChange,
  trailing,
  inputMode,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  trailing?: React.ReactNode;
  inputMode?: "text" | "numeric" | "decimal" | "email";
}) {
  return (
    <label className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-muted/70 border border-transparent focus-within:border-primary focus-within:bg-surface transition-base">
      <span className="text-muted-foreground">{icon}</span>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground/70 text-[15px]"
      />
      {trailing}
    </label>
  );
}
