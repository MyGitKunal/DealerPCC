import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClipboardList, Search, Download, TrendingUp, Award, AlertCircle } from "lucide-react";

interface PCCRecord {
  id: string;
  dealerName: string;
  kvps: string;
  brand: string;
  score: number;
  status: "compliant" | "non-compliant" | "pending";
  lastAudit: string;
  category: string;
}

const SAMPLE_RECORDS: PCCRecord[] = [
  { id: "1", dealerName: "VW Delhi Central", kvps: "12345", brand: "Volkswagen", score: 92, status: "compliant", lastAudit: "2026-04-15", category: "Workshop" },
  { id: "2", dealerName: "Škoda Mumbai West", kvps: "67890", brand: "Škoda", score: 78, status: "compliant", lastAudit: "2026-04-10", category: "Sales" },
  { id: "3", dealerName: "VW Bangalore South", kvps: "11111", brand: "Volkswagen", score: 54, status: "non-compliant", lastAudit: "2026-03-20", category: "Workshop" },
  { id: "4", dealerName: "Škoda Pune Central", kvps: "22222", brand: "Škoda", score: 88, status: "compliant", lastAudit: "2026-04-01", category: "After-Sales" },
  { id: "5", dealerName: "VW Chennai North", kvps: "33333", brand: "Volkswagen", score: 65, status: "pending", lastAudit: "2026-03-15", category: "Workshop" },
];

export function PCCPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const isDealer = user?.accountType === "dealer";
  const records = isDealer
    ? SAMPLE_RECORDS.filter((r) => r.kvps === user?.kvps)
    : SAMPLE_RECORDS.filter(
        (r) =>
          r.dealerName.toLowerCase().includes(search.toLowerCase()) ||
          r.kvps.includes(search)
      );

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ClipboardList className="h-6 w-6" /> PCC Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Performance Center Program compliance tracking</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" /> Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{SAMPLE_RECORDS.filter((r) => r.status === "compliant").length}</p>
                <p className="text-xs text-muted-foreground">Compliant</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{SAMPLE_RECORDS.filter((r) => r.status === "non-compliant").length}</p>
                <p className="text-xs text-muted-foreground">Non-Compliant</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{Math.round(SAMPLE_RECORDS.reduce((a, r) => a + r.score, 0) / SAMPLE_RECORDS.length)}%</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!isDealer && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by dealer name or KVPS..."
            className="pl-10"
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">PCC Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Dealer</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">KVPS</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Brand</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Score</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Last Audit</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-2 px-3 font-medium">{r.dealerName}</td>
                    <td className="py-2 px-3 font-mono text-muted-foreground">{r.kvps}</td>
                    <td className="py-2 px-3">{r.brand}</td>
                    <td className="py-2 px-3">{r.category}</td>
                    <td className="py-2 px-3">
                      <span className={r.score >= 80 ? "text-green-600 font-bold" : r.score >= 60 ? "text-yellow-600 font-bold" : "text-red-600 font-bold"}>
                        {r.score}%
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <Badge variant={r.status === "compliant" ? "success" : r.status === "non-compliant" ? "destructive" : "secondary"}>
                        {r.status}
                      </Badge>
                    </td>
                    <td className="py-2 px-3 text-muted-foreground">{new Date(r.lastAudit).toLocaleDateString()}</td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">No records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
