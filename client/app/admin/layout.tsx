"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Home,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { AuthProvider, AuthContext } from "@/providers/auth-provider";
import { useContext } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/feedback", label: "Feedback", icon: MessageSquare },
];

function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useContext(AuthContext);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r bg-muted/20">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <BarChart3 className="size-6 text-primary" />
          <span className="text-lg font-semibold">Admin</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-4 space-y-1">
          <div className="flex items-center gap-3 cursor-pointer rounded-lg px-2 py-2 text-sm text-muted-foreground">
            <ThemeToggle />
            <span>Toggle theme</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Home className="size-4" />
            Back to Site
          </Link>
          <Button
            variant="ghost"
            onClick={() => {
              auth?.logout();
              router.push("/admin/login");
            }}
            className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground"
          >
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </aside>

      <main id="main-content" className="ml-64 min-h-screen overflow-auto">
        <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useContext(AuthContext);

  const isLoginPage = pathname === "/admin/login";

  if (!auth) return null;

  if (auth.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );
  }

  if (!auth.isAuthenticated && !isLoginPage) {
    router.replace("/admin/login");
    return null;
  }

  if (auth.isAuthenticated && isLoginPage) {
    router.replace("/admin");
    return null;
  }

  return <>{children}</>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <AuthProvider>
      <AuthGuard>
        {isLoginPage ? (
          children
        ) : (
          <AdminSidebar>{children}</AdminSidebar>
        )}
      </AuthGuard>
    </AuthProvider>
  );
}
