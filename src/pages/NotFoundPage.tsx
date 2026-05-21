import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#002733]">
      <div className="text-center text-white">
        <h1 className="text-8xl font-black text-[#C2FE06] mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-white/60 mb-8">The page you are looking for does not exist.</p>
        <Button asChild className="bg-[#C2FE06] text-[#002733] hover:bg-[#C2FE06]/90">
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
