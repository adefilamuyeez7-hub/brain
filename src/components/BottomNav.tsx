import { Link, useLocation } from "@tanstack/react-router";
import { Home, LayoutGrid, Sparkles, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/explore", label: "Explore", icon: LayoutGrid },
  { to: "/create", label: "Create", icon: Sparkles },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-4 left-1/2 z-30 w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
      <div className="flex items-center justify-between rounded-full bg-ink px-3 py-2.5 shadow-pop">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                active
                  ? "bg-background text-ink"
                  : "text-ink-foreground/70 hover:text-ink-foreground"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={2.2} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
