import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ModeToggle } from "./_components/mode-toggle";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans transition-colors duration-300">
      <header className="w-full flex justify-between items-center py-6 px-6 md:px-12">
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{
            background:
              "linear-gradient(90deg, var(--primary), var(--chart-2), var(--chart-4))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          MasteryMap
        </h1>
        <div className="flex gap-3 items-center">
          <ModeToggle />

          <SignedOut>
            <Link href="/sign-up">
              <Button variant="outline" className="font-semibold px-6">Sign Up</Button>
            </Link>
          </SignedOut>

          <SignedOut>
            <Link href="/sign-in">
              <Button variant="secondary" className="font-semibold px-6">
                Sign In
              </Button>
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
            />
          </SignedIn>

          <SignedIn>
            <Link href="/create">
              <Button variant="secondary" className="font-semibold px-6">
                Create Your Learning Goal
              </Button>
            </Link>
          </SignedIn>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-lg border border-border bg-card">
          <CardContent className="py-10 px-8 md:px-16 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              Visualize. Track.{" "}
              <span style={{ color: "var(--primary)" }}>Master</span> any Skill.
            </h2>
            <p className="text-lg mb-8 text-center text-muted-foreground">
              <span
                className="font-semibold"
                style={{ color: "var(--primary)" }}
              >
                MasteryMap
              </span>{" "}
              helps you break any skill into clear, achievable steps. Add a
              skill, get a custom roadmap, check off your progress, and stay
              motivated on your journey to mastery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">

                <Link href="/create">
                  <Button
                    size="lg"
                    className="font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Get Started
                  </Button>
                </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="w-full text-center text-sm text-muted-foreground py-4 opacity-80">
        &copy; {new Date().getFullYear()} MasteryMap. All rights reserved.
      </footer>
    </div>
  );
}
