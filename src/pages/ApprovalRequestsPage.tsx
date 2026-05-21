import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAccessRequests, approveRequest, rejectRequest } from "@/utils/dealerRequests";
import { sendApprovalEmail, sendRejectionEmail } from "@/utils/emailService";
import type { DealerAccessRequest } from "@/types";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, UserCheck, UserX } from "lucide-react";

export function ApprovalRequestsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<DealerAccessRequest[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [action, setAction] = useState<{ id: string; type: "approve" | "reject" } | null>(null);

  const [approveForm, setApproveForm] = useState({ mfgDetails: "", username: "", password: "", confirm: "" });
  const [rejectForm, setRejectForm] = useState({ reason: "" });

  useEffect(() => {
    if (user?.role !== "super_admin") {
      navigate("/");
    }
    setRequests(getAccessRequests());
  }, [user, navigate]);

  const refresh = () => setRequests(getAccessRequests());

  const handleApprove = (req: DealerAccessRequest) => {
    if (!approveForm.username.trim()) {
      toast.error("Preferred username is required");
      return;
    }
    if (approveForm.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (approveForm.password !== approveForm.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    approveRequest(req.id, approveForm.mfgDetails, approveForm.username, approveForm.password, user!.username);
    sendApprovalEmail(req.officialDealerEmail, req.employeeFullName, approveForm.username, approveForm.password, req.dealerName);
    toast.success(`Request approved. Credentials sent to ${req.officialDealerEmail}`);
    setAction(null);
    setApproveForm({ mfgDetails: "", username: "", password: "", confirm: "" });
    refresh();
  };

  const handleReject = (req: DealerAccessRequest) => {
    if (!rejectForm.reason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }
    rejectRequest(req.id, rejectForm.reason);
    sendRejectionEmail(req.officialDealerEmail, req.employeeFullName, rejectForm.reason);
    toast.success("Request rejected and notification sent");
    setAction(null);
    setRejectForm({ reason: "" });
    refresh();
  };

  const pending = requests.filter((r) => r.status === "pending");
  const processed = requests.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold">Dealer Approval Requests</h2>
        <p className="text-sm text-muted-foreground mt-1">Review and manage dealer access requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{pending.length}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-green-600">{requests.filter((r) => r.status === "approved").length}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-red-600">{requests.filter((r) => r.status === "rejected").length}</p>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <div>
        <h3 className="font-semibold mb-3">Pending Requests ({pending.length})</h3>
        {pending.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground text-sm">
              No pending requests
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pending.map((req) => (
              <Card key={req.id}>
                <CardContent className="pt-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpanded(expanded === req.id ? null : req.id)}
                  >
                    <div>
                      <p className="font-medium">{req.employeeFullName}</p>
                      <p className="text-sm text-muted-foreground">{req.dealerName} · {req.brand}</p>
                      <p className="text-xs text-muted-foreground">{req.role} · ID: {req.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="warning">Pending</Badge>
                      {expanded === req.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>

                  {expanded === req.id && (
                    <div className="mt-4 border-t pt-4 space-y-4">
                      {/* Details */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><span className="text-muted-foreground">Email: </span>{req.officialDealerEmail}</div>
                        <div><span className="text-muted-foreground">Mobile: </span>{req.officialMobileNumber}</div>
                        <div><span className="text-muted-foreground">KVPS: </span>{req.dealerWorkshopCode}</div>
                        <div><span className="text-muted-foreground">Location: </span>{req.locationBranch}</div>
                        <div><span className="text-muted-foreground">Employee ID: </span>{req.employeeId}</div>
                        <div><span className="text-muted-foreground">Requested: </span>{new Date(req.requestDate).toLocaleDateString()}</div>
                      </div>

                      {/* Action buttons */}
                      {action?.id !== req.id && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => setAction({ id: req.id, type: "approve" })}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <UserCheck className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setAction({ id: req.id, type: "reject" })}
                          >
                            <UserX className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      )}

                      {/* Approve form */}
                      {action?.id === req.id && action.type === "approve" && (
                        <div className="border rounded-lg p-4 space-y-3 bg-green-50 dark:bg-green-950/20">
                          <h4 className="font-medium text-sm text-green-800 dark:text-green-400">Approval Details</h4>
                          <div className="space-y-1">
                            <Label className="text-xs">Manufacturer Details (optional)</Label>
                            <Textarea
                              value={approveForm.mfgDetails}
                              onChange={(e) => setApproveForm((f) => ({ ...f, mfgDetails: e.target.value }))}
                              placeholder="Additional notes..."
                              rows={2}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs">Username *</Label>
                              <Input
                                value={approveForm.username}
                                onChange={(e) => setApproveForm((f) => ({ ...f, username: e.target.value }))}
                                placeholder="dealer_user"
                                className="h-8 text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Password *</Label>
                              <Input
                                type="password"
                                value={approveForm.password}
                                onChange={(e) => setApproveForm((f) => ({ ...f, password: e.target.value }))}
                                placeholder="Min 6 chars"
                                className="h-8 text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Confirm Password *</Label>
                              <Input
                                type="password"
                                value={approveForm.confirm}
                                onChange={(e) => setApproveForm((f) => ({ ...f, confirm: e.target.value }))}
                                placeholder="Repeat password"
                                className="h-8 text-xs"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(req)}>
                              Confirm Approval
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setAction(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Reject form */}
                      {action?.id === req.id && action.type === "reject" && (
                        <div className="border rounded-lg p-4 space-y-3 bg-red-50 dark:bg-red-950/20">
                          <h4 className="font-medium text-sm text-red-800 dark:text-red-400">Rejection Reason</h4>
                          <Textarea
                            value={rejectForm.reason}
                            onChange={(e) => setRejectForm({ reason: e.target.value })}
                            placeholder="Reason for rejection..."
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" variant="destructive" onClick={() => handleReject(req)}>
                              Confirm Rejection
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setAction(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Processed Requests */}
      {processed.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Processed Requests ({processed.length})</h3>
          <div className="space-y-2">
            {processed.map((req) => (
              <Card key={req.id}>
                <CardContent className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{req.employeeFullName}</p>
                      <p className="text-xs text-muted-foreground">{req.dealerName} · {req.role}</p>
                    </div>
                    <Badge variant={req.status === "approved" ? "success" : "destructive"}>
                      {req.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
