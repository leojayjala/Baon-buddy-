import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useStore } from "@/lib/budget-store";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user, budget } = useStore();
  if (!user) return <Navigate to="/login" />;
  if (!budget) return <Navigate to="/setup" />;
  return <Navigate to="/dashboard" />;
}
