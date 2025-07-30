"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";

export default function DashboardHeader() {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome back 👋</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Track your learning goals and build your skills.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 justify-center items-center">
        <Button
          variant="outline"
          onClick={handleRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
        <Button onClick={() => router.push("/create")}>
          + Create Skill Goal
        </Button>
        <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
            />
          </SignedIn>
      </div>
    </div>
  );
}
