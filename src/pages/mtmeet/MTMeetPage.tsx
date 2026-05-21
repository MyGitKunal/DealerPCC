import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface MTMeetEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  capacity: number;
  registered: number;
  status: "upcoming" | "full" | "past";
  description: string;
}

const EVENTS: MTMeetEvent[] = [
  {
    id: "1",
    title: "MT Meet - New EV Model Briefing",
    date: "2026-06-15",
    location: "VW Training Center, Mumbai",
    capacity: 40,
    registered: 28,
    status: "upcoming",
    description: "Comprehensive briefing on the new EV lineup, charging infrastructure and service protocols.",
  },
  {
    id: "2",
    title: "Regional Service Manager Conference",
    date: "2026-06-28",
    location: "Hyatt Regency, Delhi",
    capacity: 60,
    registered: 60,
    status: "full",
    description: "Annual conference for service managers covering Q2 performance review and H2 targets.",
  },
  {
    id: "3",
    title: "Škoda Technical Training Workshop",
    date: "2026-07-10",
    location: "Škoda India HQ, Pune",
    capacity: 25,
    registered: 12,
    status: "upcoming",
    description: "Hands-on technical training for latest Škoda models including ADAS calibration.",
  },
  {
    id: "4",
    title: "Q1 Warranty Review Meeting",
    date: "2026-04-05",
    location: "Online (Zoom)",
    capacity: 100,
    registered: 87,
    status: "past",
    description: "Review of Q1 warranty claims, rejection rates and improvement plans.",
  },
];

export function MTMeetPage() {
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());

  const handleRegister = (event: MTMeetEvent) => {
    if (event.status === "full") {
      toast.error("This event is full");
      return;
    }
    setRegisteredIds((s) => new Set([...s, event.id]));
    toast.success(`Registered for "${event.title}"`);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6" /> MT Meet Events
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Management Training meetings and events</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{EVENTS.filter((e) => e.status === "upcoming").length}</p>
            <p className="text-xs text-muted-foreground">Upcoming Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{registeredIds.size}</p>
            <p className="text-xs text-muted-foreground">My Registrations</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {EVENTS.map((event) => {
          const isRegistered = registeredIds.has(event.id);
          const spotsLeft = event.capacity - event.registered;
          return (
            <Card key={event.id} className={event.status === "past" ? "opacity-70" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{event.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  </div>
                  <Badge
                    variant={
                      event.status === "upcoming" ? "default"
                      : event.status === "full" ? "warning"
                      : "secondary"
                    }
                    className="ml-4 shrink-0"
                  >
                    {event.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {event.registered}/{event.capacity} registered
                    {event.status === "upcoming" && ` (${spotsLeft} spots left)`}
                  </div>
                </div>

                {event.status !== "past" && (
                  isRegistered ? (
                    <Button size="sm" variant="outline" disabled className="text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" /> Registered
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleRegister(event)}
                      disabled={event.status === "full"}
                    >
                      {event.status === "full" ? "Event Full" : "Register"}
                    </Button>
                  )
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
