import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, CheckCircle, Clock, XCircle } from "lucide-react";

type SurveyType = "technical" | "warranty" | "workshop";

interface Survey {
  id: string;
  type: SurveyType;
  title: string;
  deadline: string;
  status: "pending" | "submitted" | "overdue";
  dealerName: string;
}

const SURVEYS: Survey[] = [
  { id: "1", type: "technical", title: "Q1 2026 Technical Training Survey", deadline: "2026-03-31", status: "submitted", dealerName: "VW Delhi Central" },
  { id: "2", type: "warranty", title: "Warranty Claims Analysis - Feb 2026", deadline: "2026-04-15", status: "pending", dealerName: "Škoda Mumbai West" },
  { id: "3", type: "workshop", title: "Workshop Facility Audit Q1 2026", deadline: "2026-04-20", status: "pending", dealerName: "VW Bangalore South" },
  { id: "4", type: "technical", title: "EV Service Readiness Survey", deadline: "2026-05-01", status: "pending", dealerName: "VW Delhi Central" },
  { id: "5", type: "warranty", title: "Warranty Rejection Rate Analysis", deadline: "2026-03-01", status: "overdue", dealerName: "Škoda Pune Central" },
];

const TYPE_COLORS: Record<SurveyType, string> = {
  technical: "bg-blue-500",
  warranty: "bg-green-500",
  workshop: "bg-purple-500",
};

export function SurveyPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | SurveyType>("all");

  const surveys = SURVEYS.filter((s) => filter === "all" || s.type === filter);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" /> Surveys
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Technical, Warranty and Workshop surveys</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" /> Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {(["technical", "warranty", "workshop"] as SurveyType[]).map((type) => (
          <Card key={type}>
            <CardContent className="pt-4">
              <div className={`inline-flex px-2 py-1 rounded text-xs text-white mb-2 ${TYPE_COLORS[type]}`}>
                {type}
              </div>
              <p className="text-2xl font-bold">{SURVEYS.filter((s) => s.type === type).length}</p>
              <p className="text-xs text-muted-foreground">Surveys</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "technical", "warranty", "workshop"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {surveys.map((survey) => (
          <Card key={survey.id}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs text-white ${TYPE_COLORS[survey.type]}`}>
                      {survey.type}
                    </span>
                    <p className="font-medium text-sm">{survey.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Deadline: {new Date(survey.deadline).toLocaleDateString()} · {survey.dealerName}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  {survey.status === "submitted" && (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle className="h-3 w-3" /> Submitted
                    </span>
                  )}
                  {survey.status === "pending" && (
                    <span className="flex items-center gap-1 text-xs text-yellow-600">
                      <Clock className="h-3 w-3" /> Pending
                    </span>
                  )}
                  {survey.status === "overdue" && (
                    <span className="flex items-center gap-1 text-xs text-red-600">
                      <XCircle className="h-3 w-3" /> Overdue
                    </span>
                  )}
                  {survey.status === "pending" && (
                    <Button size="sm" variant="outline">Start Survey</Button>
                  )}
                  {survey.status === "submitted" && (
                    <Button size="sm" variant="ghost">View</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
