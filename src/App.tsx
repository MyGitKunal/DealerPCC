import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoginPage } from "@/pages/LoginPage";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { AccessRequestPage } from "@/pages/AccessRequestPage";
import { ApprovalRequestsPage } from "@/pages/ApprovalRequestsPage";
import { PCCPage } from "@/pages/pcc/PCCPage";
import { SurveyPage } from "@/pages/survey/SurveyPage";
import { MTMeetPage } from "@/pages/mtmeet/MTMeetPage";
import { APIRegistrationPage } from "@/pages/api/APIRegistrationPage";
import { AdminPage } from "@/pages/admin/AdminPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 5 * 60 * 1000 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/access-request" element={<AccessRequestPage />} />

            {/* Protected routes with layout */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<HomePage />} />
              <Route path="/pcc" element={<PCCPage />} />
              <Route path="/survey" element={<SurveyPage />} />
              <Route path="/mtmeet" element={<MTMeetPage />} />
              <Route path="/api-registration" element={<APIRegistrationPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/approval-requests" element={<ApprovalRequestsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
