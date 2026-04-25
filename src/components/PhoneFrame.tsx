import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-gradient-soft flex items-center justify-center p-0 sm:p-6">
      <div className="relative w-full sm:max-w-[420px] sm:rounded-[2.5rem] sm:border sm:border-border sm:shadow-elevated bg-background overflow-hidden min-h-screen sm:min-h-[860px] sm:max-h-[860px]">
        <div className="flex flex-col h-screen sm:h-[860px]">{children}</div>
      </div>
    </div>
  );
}
