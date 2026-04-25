import { Link, useLocation } from "@tanstack/react-router";
import { Home, PlusCircle, History, LogOut } from "lucide-react";
import { useStore } from "@/lib/budget-store";

const tabs = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/add-expense", icon: PlusCircle, label: "Add" },
  { to: "/history", icon: History, label: "History" },
] as const;

export function BottomNav() {
  const location = useLocation();
  const { logout } = useStore();

  return (
    <nav className="border-t border-border bg-surface/95 backdrop-blur px-2 py-2 pb-3 safe-area">
      <div className="flex items-center justify-around">
        {tabs.map((t) => {
          const active = location.pathname === t.to;
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-base ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                className={`size-6 ${active ? "fill-primary-soft" : ""}`}
                strokeWidth={active ? 2.4 : 2}
              />
              <span className="text-[11px] font-medium">{t.label}</span>
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-muted-foreground hover:text-destructive transition-base"
        >
          <LogOut className="size-6" />
          <span className="text-[11px] font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
}
