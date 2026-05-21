import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { createAccessRequest } from "@/utils/dealerRequests";
import { toast } from "sonner";
import { CheckCircle, ArrowLeft } from "lucide-react";

export function AccessRequestPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    brand: "",
    dealerWorkshopCode: "",
    dealerName: "",
    employeeFullName: "",
    officialDealerEmail: "",
    officialMobileNumber: "",
    role: "",
    locationBranch: "",
    employeeId: "",
    termsAgreed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.brand) errs.brand = "Brand is required";
    if (!/^\d{5}$/.test(form.dealerWorkshopCode)) errs.dealerWorkshopCode = "KVPS must be exactly 5 digits";
    if (!form.dealerName) errs.dealerName = "Dealer name is required";
    if (!form.employeeFullName) errs.employeeFullName = "Employee name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.officialDealerEmail)) errs.officialDealerEmail = "Valid email address required";
    if (!/^\d{10,}$/.test(form.officialMobileNumber.replace(/\D/g, ""))) errs.officialMobileNumber = "At least 10 digits required";
    if (!form.role) errs.role = "Role is required";
    if (!form.locationBranch) errs.locationBranch = "Location/Branch is required";
    if (!form.employeeId) errs.employeeId = "Employee ID is required";
    if (!form.termsAgreed) errs.termsAgreed = "You must agree to the terms and conditions";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const req = createAccessRequest(form);
      setRequestId(req.id);
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const set = (field: string, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#002733] px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-10 pb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Request Submitted!</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Your access request has been submitted successfully. The manufacturer admin will review your request.
            </p>
            <div className="bg-muted rounded-lg p-4 mb-6">
              <p className="text-xs text-muted-foreground mb-1">Your Request ID</p>
              <p className="font-mono font-bold text-lg">{requestId}</p>
              <p className="text-xs text-muted-foreground mt-1">Keep this for reference</p>
            </div>
            <Button asChild className="w-full">
              <Link to="/login">Back to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#002733] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/login")}
            className="text-white/60 hover:text-white flex items-center gap-1 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </button>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">Dealer Access Request</h1>
          <p className="text-white/60 text-sm mt-1">Škoda | Volkswagen Dealer Portal Registration</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registration Details</CardTitle>
            <CardDescription>
              Fill in your dealer information to request portal access. All fields are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Brand *</Label>
                  <Select value={form.brand} onValueChange={(v) => set("brand", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                      <SelectItem value="Škoda">Škoda</SelectItem>
                      <SelectItem value="VW Group">VW Group</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.brand && <p className="text-xs text-destructive">{errors.brand}</p>}
                </div>

                <div className="space-y-1">
                  <Label>KVPS (Dealer Workshop Code) *</Label>
                  <Input
                    value={form.dealerWorkshopCode}
                    onChange={(e) => set("dealerWorkshopCode", e.target.value)}
                    placeholder="5-digit code"
                    maxLength={5}
                  />
                  {errors.dealerWorkshopCode && <p className="text-xs text-destructive">{errors.dealerWorkshopCode}</p>}
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <Label>Dealer Name *</Label>
                  <Input
                    value={form.dealerName}
                    onChange={(e) => set("dealerName", e.target.value)}
                    placeholder="Enter dealership name"
                  />
                  {errors.dealerName && <p className="text-xs text-destructive">{errors.dealerName}</p>}
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <Label>Employee Full Name *</Label>
                  <Input
                    value={form.employeeFullName}
                    onChange={(e) => set("employeeFullName", e.target.value)}
                    placeholder="Enter your full name"
                  />
                  {errors.employeeFullName && <p className="text-xs text-destructive">{errors.employeeFullName}</p>}
                </div>

                <div className="space-y-1">
                  <Label>Official Email *</Label>
                  <Input
                    type="email"
                    value={form.officialDealerEmail}
                    onChange={(e) => set("officialDealerEmail", e.target.value)}
                    placeholder="email@dealer.com"
                  />
                  {errors.officialDealerEmail && <p className="text-xs text-destructive">{errors.officialDealerEmail}</p>}
                </div>

                <div className="space-y-1">
                  <Label>Mobile Number *</Label>
                  <Input
                    value={form.officialMobileNumber}
                    onChange={(e) => set("officialMobileNumber", e.target.value)}
                    placeholder="10+ digit number"
                  />
                  {errors.officialMobileNumber && <p className="text-xs text-destructive">{errors.officialMobileNumber}</p>}
                </div>

                <div className="space-y-1">
                  <Label>Role *</Label>
                  <Select value={form.role} onValueChange={(v) => set("role", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Service Head/Service Manager">Service Head / Service Manager</SelectItem>
                      <SelectItem value="Warranty Manager">Warranty Manager</SelectItem>
                      <SelectItem value="Master Technician">Master Technician</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
                </div>

                <div className="space-y-1">
                  <Label>Employee ID *</Label>
                  <Input
                    value={form.employeeId}
                    onChange={(e) => set("employeeId", e.target.value)}
                    placeholder="Enter employee ID"
                  />
                  {errors.employeeId && <p className="text-xs text-destructive">{errors.employeeId}</p>}
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <Label>Location / Branch *</Label>
                  <Input
                    value={form.locationBranch}
                    onChange={(e) => set("locationBranch", e.target.value)}
                    placeholder="City, State"
                  />
                  {errors.locationBranch && <p className="text-xs text-destructive">{errors.locationBranch}</p>}
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <Checkbox
                  id="terms"
                  checked={form.termsAgreed}
                  onCheckedChange={(v) => set("termsAgreed", !!v)}
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                  I agree to the Terms & Conditions and Privacy Policy of the Škoda | Volkswagen Dealer Portal.
                  I confirm that the information provided is accurate and complete.
                </label>
              </div>
              {errors.termsAgreed && <p className="text-xs text-destructive">{errors.termsAgreed}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Access Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
