import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Settings, MapPin, UtensilsCrossed, LayoutGrid, LogOut, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const adminLinks = [
  { to: "/admin/dashboard", label: "Settings", icon: Settings },
  { to: "/admin/dashboard/locations", label: "Locations", icon: MapPin },
  { to: "/admin/dashboard/categories", label: "Categories", icon: LayoutGrid },
  { to: "/admin/dashboard/menu", label: "Menu Items", icon: UtensilsCrossed },
  { to: "/admin/dashboard/users", label: "Admins", icon: Users },
];

export default function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-12 w-48" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin" replace />;
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">You do not have admin privileges.</p>
          <Button onClick={signOut}>Sign Out</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30 p-4 hidden md:flex flex-col">
        <Link to="/" className="font-bold text-lg text-primary mb-8 block">
          ← Back to Site
        </Link>
        <nav className="space-y-1 flex-1">
          {adminLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        <Button variant="ghost" size="sm" onClick={signOut} className="gap-2 justify-start">
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-background p-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {adminLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
                location.pathname === link.to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground bg-muted"
              }`}
            >
              <link.icon className="h-3 w-3" />
              {link.label}
            </Link>
          ))}
          <Button variant="ghost" size="sm" onClick={signOut} className="ml-auto shrink-0">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8 mt-12 md:mt-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
