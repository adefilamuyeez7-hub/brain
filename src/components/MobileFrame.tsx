import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-app-gradient">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-32 pt-6">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
