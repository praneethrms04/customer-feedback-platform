import type { Metadata } from "next";
import { FeedbackForm } from "@/features/feedback/FeedbackForm";
import Link from "next/link";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Submit Feedback — FeedbackHub",
  description: "Share your feedback with us. Help us improve by submitting your experience, suggestions, or bug reports.",
};

export default function SubmitPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <MessageSquare className="size-6 text-primary" />
            <span className="text-lg font-semibold">FeedbackHub</span>
          </Link>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            <ArrowLeft className="mr-1 size-3.5" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <FeedbackForm />
      </main>

      <footer className="border-t px-4 py-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FeedbackHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
