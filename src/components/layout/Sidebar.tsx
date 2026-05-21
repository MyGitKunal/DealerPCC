import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Calendar,
  Code2,
  Shield,
  UserCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  {
    label: "PCC",
    path: "/pcc",
    icon: ClipboardList,
    roles: ["master_technician", "manufacturer_admin", "super_admin"],
  },
  {
    label: "Surveys",
    path: "/survey",
    icon: FileText,
    roles: ["warranty_manager", "master_technician", "super_admin"],
  },
  {
    label: "MT Meet",
    path: "/mtmeet",
    icon: Calendar,
    roles: ["service_manager", "super_admin"],
  },
  {
    label: "API Registration",
    path: "/api-registration",
    icon: Code2,
  },
  {
    label: "Admin",
    path: "/admin",
    icon: Shield,
    roles: ["super_admin", "manufacturer_admin"],
  },
  {
    label: "Approvals",
    path: "/approval-requests",
    icon: UserCheck,
    roles: ["super_admin"],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(user?.role || "")
  );

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo area */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-xs font-bold text-sidebar-primary uppercase tracking-widest">Škoda | VW</span>
            <span className="text-xs text-sidebar-foreground/60">Dealer Portal</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded-md hover:bg-sidebar-accent transition-colors text-sidebar-foreground/70 hover:text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User info & logout */}
      <div className="border-t border-sidebar-border p-4">
        {!collapsed && user && (
          <div className="mb-3">
            <p className="text-xs font-medium text-sidebar-foreground truncate">{user.username}</p>
            <p className="text-xs text-sidebar-foreground/50 truncate capitalize">{user.role.replace(/_/g, " ")}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-2 py-2 rounded-md text-sm text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive transition-colors"
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
