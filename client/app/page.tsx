import {
  MessageSquare,
  BarChart3,
  Bell,
  ArrowRight,
  Star,
  Shield,
  Users,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

const features = [
  {
    icon: MessageSquare,
    title: "Collect Feedback",
    description:
      "Capture valuable insights from your customers with beautiful, customizable forms that integrate seamlessly into your workflow.",
  },
  {
    icon: BarChart3,
    title: "Analyze Trends",
    description:
      "Visualize feedback data with powerful analytics and charts. Spot patterns, track sentiment, and make data-driven decisions.",
  },
  {
    icon: Bell,
    title: "Real-time Alerts",
    description:
      "Get instant notifications when critical feedback comes in. Never miss an important customer voice again.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Enterprise-grade security with encrypted data storage. Your customers' data is always protected.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Work together with your team to review, categorize, and respond to feedback efficiently.",
  },
  {
    icon: Star,
    title: "Smart Insights",
    description:
      "AI-powered analysis automatically categorizes and prioritizes feedback, so you focus on what matters most.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create a Form",
    description:
      "Design a feedback form tailored to your needs in minutes. No coding required.",
  },
  {
    number: "02",
    title: "Share with Customers",
    description:
      "Embed on your website, share via email, or use a direct link to start collecting responses.",
  },
  {
    number: "03",
    title: "Analyze & Act",
    description:
      "Review responses in real-time, identify trends, and take action to improve your product.",
  },
];

const testimonials = [
  {
    quote:
      "This platform transformed how we understand our customers. The insights we've gained are invaluable.",
    author: "Sarah Chen",
    role: "Product Manager",
  },
  {
    quote:
      "Setting up feedback forms took minutes, not hours. The analytics dashboard is incredibly intuitive.",
    author: "Marcus Johnson",
    role: "Engineering Lead",
  },
  {
    quote:
      "Our response rate increased by 300% after switching to this platform. Customers love how easy it is.",
    author: "Emily Rodriguez",
    role: "Customer Success",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-6 text-primary" />
            <span className="text-lg font-semibold">FeedbackHub</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              How it Works
            </Link>
            <Link
              href="#testimonials"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-1 md:gap-3">
            <ThemeToggle />
            <Link
              href="/feedback"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <MessageSquare className="mr-1 size-3.5" />
              Submit Feedback
            </Link>
            <Link
              href="/admin"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Sign In
            </Link>
            <Link
              href="/admin"
              className={cn(buttonVariants({ size: "sm" }))}
            >
              Get Started
              <ArrowRight className="ml-1 size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-24 sm:px-6 sm:pt-32 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,oklch(var(--primary)/0.06),transparent)]" />
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
              <Sparkles className="size-3.5 text-primary" />
              <span>Trusted by 1,000+ teams worldwide</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Turn Customer Feedback
              <br />
              <span className="text-primary">Into Growth</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Collect, analyze, and act on customer feedback with ease. Build
              products people love with insights that drive real results.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/feedback"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                <MessageSquare className="mr-2 size-4" />
                Submit Feedback
              </Link>
              <Link
                href="/admin"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Admin Dashboard
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-t bg-muted/30 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to understand your customers
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful tools that make feedback collection and analysis
              effortless.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                  <CardHeader>
                    <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section
        id="how-it-works"
        className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Get started in three simple steps
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From creation to insights in no time.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center transition-all duration-200 hover:-translate-y-0.5">
                <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="border-t bg-muted/30 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by teams everywhere
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Hear from the people using FeedbackHub every day.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.author} className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <CardContent className="pt-6">
                  <div className="mb-4 flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="size-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <blockquote className="text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="mt-6 border-t pt-4">
                    <p className="text-sm font-medium">{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 px-6 py-16 text-center sm:px-16 sm:py-24">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_50%,oklch(var(--primary)/0.08),transparent)]" />
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to transform your feedback?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Join thousands of teams already using FeedbackHub to build better
              products.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/admin"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Get Started Free
                <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link
                href="/admin"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-5 text-primary" />
              <span className="text-sm font-medium">FeedbackHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} FeedbackHub. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
