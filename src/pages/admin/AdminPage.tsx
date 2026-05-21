import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Activity, Users, Settings, FileText } from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  status: "success" | "failed" | "warning";
}

const AUDIT_LOGS: AuditLog[] = [
  { id: "1", timestamp: "2026-05-21T08:30:00Z", user: "admin", action: "Approved dealer access request", module: "Approvals", status: "success" },
  { id: "2", timestamp: "2026-05-21T07:45:00Z", user: "dealer1", action: "Submitted PCC compliance data", module: "PCC", status: "success" },
  { id: "3", timestamp: "2026-05-20T16:20:00Z", user: "dealer2", action: "Failed login attempt", module: "Auth", status: "failed" },
  { id: "4", timestamp: "2026-05-20T15:00:00Z", user: "tech1", action: "Completed technical survey", module: "Surveys", status: "success" },
  { id: "5", timestamp: "2026-05-20T11:30:00Z", user: "admin", action: "Exported PCC report", module: "PCC", status: "success" },
  { id: "6", timestamp: "2026-05-19T14:15:00Z", user: "dealer1", action: "Registered for MT Meet", module: "MT Meet", status: "success" },
  { id: "7", timestamp: "2026-05-19T09:00:00Z", user: "dealer3", action: "Session expired - auto logout", module: "Auth", status: "warning" },
];

interface Module {
  name: string;
  enabled: boolean;
  description: string;
}

const MODULES: Module[] = [
  { name: "PCC Management", enabled: true, description: "Performance Center Program compliance" },
  { name: "Surveys", enabled: true, description: "Technical, Warranty and Workshop surveys" },
  { name: "MT Meet", enabled: true, description: "Management Training meeting management" },
  { name: "API Registration", enabled: true, description: "API key management" },
  { name: "Email Notifications", enabled: true, description: "Automated email alerts" },
  { name: "Export Module", enabled: false, description: "Data export functionality" },
];

export function AdminPage() {
  const [modules, setModules] = useState(MODULES);

  const toggleModule = (name: string) => {
    setModules((m) => m.map((mod) => mod.name === name ? { ...mod, enabled: !mod.enabled } : mod));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" /> Admin Console
        </h2>
        <p className="text-sm text-muted-foreground mt-1">System administration and audit logs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-xl font-bold">4</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-xl font-bold">7</p>
                <p className="text-xs text-muted-foreground">Activity Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-xl font-bold">{modules.filter((m) => m.enabled).length}</p>
                <p className="text-xs text-muted-foreground">Modules Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-xl font-bold">{AUDIT_LOGS.length}</p>
                <p className="text-xs text-muted-foreground">Audit Logs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" /> Module Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {modules.map((mod) => (
                <div key={mod.name} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{mod.name}</p>
                    <p className="text-xs text-muted-foreground">{mod.description}</p>
                  </div>
                  <button
                    onClick={() => toggleModule(mod.name)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${mod.enabled ? "bg-green-500" : "bg-muted"}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${mod.enabled ? "translate-x-4" : "translate-x-1"}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audit Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" /> Recent Audit Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {AUDIT_LOGS.map((log) => (
                <div key={log.id} className="flex items-start gap-2 py-1.5 border-b last:border-0">
                  <Badge
                    variant={log.status === "success" ? "success" : log.status === "failed" ? "destructive" : "warning"}
                    className="mt-0.5 text-[10px] px-1.5"
                  >
                    {log.status}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{log.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {log.user} · {log.module} · {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
