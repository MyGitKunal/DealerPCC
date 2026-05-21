import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Code2, CheckCircle, Copy } from "lucide-react";
import { toast } from "sonner";

interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
}

const ENDPOINTS: ApiEndpoint[] = [
  { method: "GET", path: "/api/dealers", description: "Get all dealer records" },
  { method: "GET", path: "/api/dealers/:kvps", description: "Get dealer by KVPS code" },
  { method: "POST", path: "/api/pcc/submit", description: "Submit PCC compliance data" },
  { method: "GET", path: "/api/surveys", description: "List available surveys" },
  { method: "POST", path: "/api/surveys/:id/submit", description: "Submit survey responses" },
  { method: "GET", path: "/api/mt-meets", description: "List MT Meet events" },
  { method: "POST", path: "/api/mt-meets/:id/register", description: "Register for MT Meet event" },
];

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-blue-500",
  POST: "bg-green-500",
  PUT: "bg-yellow-500",
  DELETE: "bg-red-500",
};

export function APIRegistrationPage() {
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ appName: "", contactEmail: "", description: "" });
  const [apiKey, setApiKey] = useState("");

  const generateApiKey = () => "sk_live_" + Math.random().toString(36).substring(2, 18) + Math.random().toString(36).substring(2, 18);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.appName || !form.contactEmail) {
      toast.error("App name and email are required");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setApiKey(generateApiKey());
      setRegistered(true);
      setLoading(false);
    }, 800);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey).then(() => toast.success("API key copied to clipboard"));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Code2 className="h-6 w-6" /> API Registration
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Register and manage API integrations</p>
      </div>

      {!registered ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Register New API Application</CardTitle>
            <CardDescription>Generate an API key to integrate with the Dealer Portal API</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4 max-w-md">
              <div className="space-y-1">
                <Label>Application Name *</Label>
                <Input
                  value={form.appName}
                  onChange={(e) => setForm((f) => ({ ...f, appName: e.target.value }))}
                  placeholder="My Dealer App"
                />
              </div>
              <div className="space-y-1">
                <Label>Contact Email *</Label>
                <Input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                  placeholder="dev@dealer.com"
                />
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of your application"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register & Generate API Key"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-800 dark:text-green-400">Registration Successful!</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Your API key has been generated. Store it securely — it will not be shown again.</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-background border rounded px-3 py-2 text-xs font-mono text-foreground break-all">
                {apiKey}
              </code>
              <Button size="sm" variant="outline" onClick={copyKey}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Reference</CardTitle>
          <CardDescription>Base URL: <code className="text-xs bg-muted px-1 rounded">https://api.dealerpcc.com/v1</code></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {ENDPOINTS.map((ep, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
                <span className={`px-2 py-0.5 rounded text-xs font-mono text-white ${METHOD_COLORS[ep.method]} w-14 text-center shrink-0`}>
                  {ep.method}
                </span>
                <code className="text-xs font-mono text-foreground w-48 shrink-0">{ep.path}</code>
                <span className="text-xs text-muted-foreground">{ep.description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
