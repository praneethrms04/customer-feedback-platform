"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import type { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import type { FeedbackItem } from "@/types/feedback";
import { MessageSquare, Star, Clock, CheckCircle2 } from "lucide-react";
import { useAnalytics } from "@/hooks/use-analytics";
import { formatDateShort, getStatusBadgeVariant } from "@/lib/utils";

const BarChart = dynamic(() => import("recharts").then((m) => m.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((m) => m.Bar), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((m) => m.CartesianGrid), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false });

const statIcons = [MessageSquare, Star, Clock, CheckCircle2];

function StatCard({ title, value, description, icon: Icon, isLoading }: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isLoading: boolean;
}) {
  return (
    <Card className="group/card transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="rounded-lg bg-primary/10 p-1.5 text-primary transition-all duration-200 group-hover/card:scale-110 group-hover/card:bg-primary/15">
            <Icon className="size-4 transition-all duration-200 group-hover/card:scale-110" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight">
          {isLoading ? <Skeleton className="h-8 w-16" /> : value}
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading } = useAnalytics();

  const analytics = data?.data;
  const categoryDistribution = analytics?.categoryDistribution ?? [];
  const recentFeedback = analytics?.recentFeedback ?? [];

  const stats = [
    {
      title: "Total Feedback",
      value: analytics?.totalFeedback ?? 0,
      description: "All submitted feedback",
    },
    {
      title: "Average Rating",
      value: analytics?.averageRating ? `${Number(analytics.averageRating).toFixed(1)}/5` : "—",
      description: "Across all feedback",
    },
    {
      title: "Pending",
      value: analytics?.pendingCount ?? 0,
      description: "Awaiting review",
    },
    {
      title: "Resolved",
      value: analytics?.resolvedCount ?? 0,
      description: "Completed tickets",
    },
  ];

  const recentColumns: ColumnDef<FeedbackItem>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
      },
      {
        accessorKey: "category",
        header: "Category",
        enableSorting: true,
        cell: ({ row }) => (
          <Badge variant="secondary" className="capitalize">
            {row.getValue("category")}
          </Badge>
        ),
      },
      {
        accessorKey: "rating",
        header: "Rating",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Star className="size-3.5 fill-primary text-primary" />
            <span>{row.getValue("rating")}</span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: true,
          cell: ({ row }) => (
            <Badge variant={getStatusBadgeVariant(row.getValue("status"))}>
              {row.getValue("status")}
            </Badge>
          ),
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        enableSorting: true,
          cell: ({ row }) => (
          <span className="text-muted-foreground">
            {formatDateShort(row.getValue("createdAt"))}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Overview of feedback activity and current status.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={statIcons[i]}
            isLoading={isLoading}
          />
        ))}
      </div>

      <Card className="transition-all duration-200 hover:shadow-lg">
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {isLoading ? (
            <div className="flex h-full items-end gap-4 px-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="flex-1" style={{ height: `${40 + i * 15}%` }} />
              ))}
            </div>
          ) : categoryDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--border)",
                    background: "var(--popover)",
                    color: "var(--popover-foreground)",
                  }}
                />
                <Bar dataKey="count" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">No data yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="transition-all duration-200 hover:shadow-lg">
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable<FeedbackItem>
            columns={recentColumns}
            data={recentFeedback}
            isLoading={isLoading}
            emptyMessage="No feedback found."
          />
        </CardContent>
      </Card>
    </div>
  );
}
