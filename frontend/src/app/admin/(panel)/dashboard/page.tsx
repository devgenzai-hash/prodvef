"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { PageLoading } from "@/components/ui/Loading";
import { adminApi } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import {
  Building2,
  Package,
  ScanLine,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileWarning,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await adminApi.getDashboard();
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch admin dashboard:", error);
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
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Companies" value={data?.stats.totalCompanies || 0} icon={<Building2 className="h-5 w-5" />} color="blue" />
        <StatCard title="Pending Companies" value={data?.stats.pendingCompanies || 0} icon={<Clock className="h-5 w-5" />} color="yellow" />
        <StatCard title="Verified Products" value={data?.stats.verifiedProducts || 0} icon={<CheckCircle2 className="h-5 w-5" />} color="green" />
        <StatCard title="Total Scans" value={data?.stats.totalScans || 0} icon={<ScanLine className="h-5 w-5" />} color="purple" />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Products" value={data?.stats.totalProducts || 0} icon={<Package className="h-5 w-5" />} color="blue" />
        <StatCard title="Counterfeit Reports" value={data?.stats.totalReports || 0} icon={<FileWarning className="h-5 w-5" />} color="red" />
        <StatCard title="Pending Reports" value={data?.stats.pendingReports || 0} icon={<AlertTriangle className="h-5 w-5" />} color="yellow" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Companies */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Companies</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.recentCompanies?.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">No companies yet</p>
            ) : (
              <div className="space-y-3">
                {data?.recentCompanies?.map((company: any) => (
                  <div key={company.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <p className="text-xs text-muted-foreground">{company.email}</p>
                    </div>
                    <StatusBadge status={company.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.recentReports?.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">No reports yet</p>
            ) : (
              <div className="space-y-3">
                {data?.recentReports?.map((report: any) => (
                  <div key={report.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{report.description.substring(0, 50)}...</p>
                      <p className="text-xs text-muted-foreground">
                        {report.reporterEmail} · {formatDateTime(report.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={report.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
  };
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[color]}`}>{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
