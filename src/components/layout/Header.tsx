import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-6">
      <div>
        <h1 className="text-sm font-semibold text-foreground">ONE.AfterSales</h1>
        <p className="text-xs text-muted-foreground">Škoda | Volkswagen Dealer Management Platform</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
        </button>
        {user && (
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium">{user.username}</p>
              {user.dealerName && <p className="text-xs text-muted-foreground">{user.dealerName}</p>}
            </div>
            <Badge variant="outline" className="text-xs capitalize">
              {user.role.replace(/_/g, " ")}
            </Badge>
          </div>
        )}
      </div>
    </header>
  );
}
