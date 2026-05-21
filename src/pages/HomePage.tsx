import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, FileText, Calendar, Code2, Shield, UserCheck, ArrowRight } from "lucide-react";

interface ServiceCard {
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  roles: string[];
}

const SERVICE_CARDS: ServiceCard[] = [
  {
    title: "PCC Management",
    description: "Manage dealer participation in the Performance Center Program",
    path: "/pcc",
    icon: ClipboardList,
    color: "bg-blue-500",
    roles: ["master_technician", "manufacturer_admin", "super_admin"],
  },
  {
    title: "Surveys",
    description: "Technical, Warranty, and Workshop surveys for dealer feedback",
    path: "/survey",
    icon: FileText,
    color: "bg-green-500",
    roles: ["warranty_manager", "master_technician", "super_admin"],
  },
  {
    title: "MT Meet",
    description: "Event registration and management for Management Training meetings",
    path: "/mtmeet",
    icon: Calendar,
    color: "bg-purple-500",
    roles: ["service_manager", "super_admin"],
  },
  {
    title: "API Registration",
    description: "Register and manage API integrations for the dealer network",
    path: "/api-registration",
    icon: Code2,
    color: "bg-orange-500",
    roles: ["service_manager", "warranty_manager", "master_technician", "manufacturer_admin", "super_admin"],
  },
  {
    title: "Admin Console",
    description: "Audit logs, module management and system configuration",
    path: "/admin",
    icon: Shield,
    color: "bg-red-500",
    roles: ["super_admin", "manufacturer_admin"],
  },
  {
    title: "Dealer Approvals",
    description: "Review and approve dealer access requests",
    path: "/approval-requests",
    icon: UserCheck,
    color: "bg-teal-500",
    roles: ["super_admin"],
  },
];

export function HomePage() {
  const { user } = useAuth();

  const availableServices = SERVICE_CARDS.filter(
    (card) => card.roles.includes(user?.role || "")
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-[#002733] text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C2FE06]/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 right-24 w-32 h-32 bg-[#008C82]/20 rounded-full translate-y-16" />
        <div className="relative">
          <Badge className="bg-[#C2FE06] text-[#002733] mb-3 hover:bg-[#C2FE06]">
            {user?.accountType === "manufacturer" ? "Manufacturer Account" : "Dealer Account"}
          </Badge>
          <h2 className="text-2xl font-bold mb-1">
            Welcome back, {user?.username}
          </h2>
          {user?.dealerName && (
            <p className="text-white/70 text-sm">{user.dealerName}</p>
          )}
          {user?.brand && (
            <p className="text-white/50 text-xs mt-1">{user.brand} · {user?.kvps && `KVPS: ${user.kvps}`}</p>
          )}
          <p className="text-white/60 text-sm mt-2 capitalize">
            Role: {user?.role?.replace(/_/g, " ")}
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Services</h3>
        {availableServices.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No services available for your role. Contact your administrator.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableServices.map((service) => {
              const Icon = service.icon;
              return (
                <Link key={service.path} to={service.path}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
                    <CardHeader className="pb-3">
                      <div className={`w-10 h-10 rounded-lg ${service.color} flex items-center justify-center mb-2`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{service.title}</CardTitle>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
