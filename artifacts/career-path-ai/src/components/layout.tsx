import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useLogout } from "@workspace/api-client-react";
import { 
  LayoutDashboard, 
  Compass, 
  Map as MapIcon, 
  MessageSquare, 
  TrendingUp, 
  Library, 
  User, 
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/careers", label: "Careers", icon: Compass },
  { href: "/roadmap", label: "Roadmap", icon: MapIcon },
  { href: "/chat", label: "Coach AI", icon: MessageSquare },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/resources", label: "Resources", icon: Library },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { logout } = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        logout();
        setLocation("/login");
      }
    });
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card h-full">
        <div className="p-6 border-b">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              C
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-primary">
              Career Path AI
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">Menu</div>
          {navItems.map((item) => {
            const active = location === item.href || location.startsWith(`${item.href}/`);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  active 
                    ? "bg-primary text-primary-foreground font-medium" 
                    : "text-muted-foreground hover:bg-secondary/10 hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-1">
          <Link href="/profile" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            location === "/profile" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-secondary/10 hover:text-foreground"
          }`}>
            <User className="w-5 h-5" />
            Profile
          </Link>
          <Link href="/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            location === "/settings" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-secondary/10 hover:text-foreground"
          }`}>
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 px-3 py-2.5"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-card flex items-center justify-around p-2 pb-safe z-50">
        {[navItems[0], navItems[1], navItems[2], navItems[3], { href: "/profile", label: "Profile", icon: User }].map((item) => {
          const active = location === item.href || location.startsWith(`${item.href}/`);
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-16 ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}