import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UserRole, AccountType } from "@/types";
import { toast } from "sonner";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("service_manager");
  const [accountType, setAccountType] = useState<AccountType>("dealer");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = login(username, password, role, accountType);
    setLoading(false);
    if (ok) {
      navigate("/");
    } else {
      toast.error("Invalid credentials. Please check your username, password, and role.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#002733]">
      <div className="w-full max-w-md px-4">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-[#C2FE06] flex items-center justify-center">
              <span className="text-[#002733] font-black text-lg">VW</span>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#4BA82E] flex items-center justify-center">
              <span className="text-white font-black text-lg">Š</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">ONE.AfterSales</h1>
          <p className="text-white/60 text-sm mt-1">Škoda | Volkswagen Dealer Portal</p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the portal</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type</Label>
                <Select value={accountType} onValueChange={(v) => setAccountType(v as AccountType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dealer">Dealer</SelectItem>
                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service_manager">Service Manager</SelectItem>
                    <SelectItem value="warranty_manager">Warranty Manager</SelectItem>
                    <SelectItem value="master_technician">Master Technician</SelectItem>
                    <SelectItem value="manufacturer_admin">Manufacturer Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username or Email</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username or email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-[#002733] hover:bg-[#003a4a]" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                New dealer?{" "}
                <Link to="/access-request" className="text-primary font-medium hover:underline">
                  Request Access
                </Link>
              </p>
            </div>

            <div className="mt-6 p-3 bg-muted rounded-md">
              <p className="text-xs font-medium text-muted-foreground mb-1">Demo Credentials:</p>
              <p className="text-xs text-muted-foreground">Super Admin: admin / admin123</p>
              <p className="text-xs text-muted-foreground">Service Manager: dealer1 / dealer123</p>
              <p className="text-xs text-muted-foreground">Warranty Manager: dealer2 / dealer123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
