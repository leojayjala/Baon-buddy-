import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Wallet, Mail, Lock, ShieldCheck } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { useStore } from "@/lib/budget-store";
import { Field } from "./login";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !pw || !pw2) return setError("Please fill out all fields.");
    if (pw !== pw2) return setError("Passwords don't match.");
    register(email);
    navigate({ to: "/setup" });
  };

  return (
    <PhoneFrame>
      <div className="flex-1 flex flex-col px-7 pt-16 pb-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="size-12 rounded-2xl bg-gradient-hero grid place-items-center shadow-card">
            <Wallet className="size-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Baon</h1>
            <p className="text-xs text-muted-foreground">Budget Tracker</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Create account</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Start managing your baon in seconds.
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
            type="password"
            placeholder="Password"
            value={pw}
            onChange={setPw}
          />
          <Field
            icon={<ShieldCheck className="size-5" />}
            type="password"
            placeholder="Confirm password"
            value={pw2}
            onChange={setPw2}
          />

          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}

          <button
            type="submit"
            className="mt-4 w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base shadow-card hover:opacity-95 transition-base active:scale-[0.99]"
          >
            Create account
          </button>
        </form>

        <p className="mt-auto text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </PhoneFrame>
  );
}
