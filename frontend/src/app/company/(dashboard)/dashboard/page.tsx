"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { PageLoading } from "@/components/ui/Loading";
import { companyApi } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import { Package, CheckCircle2, Clock, ScanLine } from "lucide-react";

interface DashboardData {
  stats: {
    totalProducts: number;
    verifiedProducts: number;
    pendingProducts: number;
    totalScans: number;
  };
  recentScans: {
    id: string;
    productName: string;
    code: string;
    result: string;
    scannedAt: string;
    city?: string;
    country?: string;
  }[];
}

export default function CompanyDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await companyApi.getDashboard();
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) return <PageLoading />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Products"
          value={data?.stats.totalProducts || 0}
          icon={<Package className="h-5 w-5" />}
          color="blue"
        />
        <StatsCard
          title="Verified Products"
          value={data?.stats.verifiedProducts || 0}
          icon={<CheckCircle2 className="h-5 w-5" />}
          color="green"
        />
        <StatsCard
          title="Pending Review"
          value={data?.stats.pendingProducts || 0}
          icon={<Clock className="h-5 w-5" />}
          color="yellow"
        />
        <StatsCard
          title="Total Scans"
          value={data?.stats.totalScans || 0}
          icon={<ScanLine className="h-5 w-5" />}
          color="purple"
        />
      </div>

      {/* Recent Scans */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.recentScans.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No scans yet. Generate QR codes for your products to start tracking.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium">Code</th>
                    <th className="pb-3 font-medium">Result</th>
                    <th className="pb-3 font-medium">Location</th>
                    <th className="pb-3 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.recentScans.map((scan) => (
                    <tr key={scan.id} className="border-b last:border-0">
                      <td className="py-3 font-medium">{scan.productName}</td>
                      <td className="py-3 font-mono text-xs">{scan.code}</td>
                      <td className="py-3">
                        <StatusBadge status={scan.result} />
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {[scan.city, scan.country].filter(Boolean).join(", ") || "Unknown"}
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {formatDateTime(scan.scannedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "green" | "yellow" | "purple";
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
