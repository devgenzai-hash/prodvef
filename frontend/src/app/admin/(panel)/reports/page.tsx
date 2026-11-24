"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { PageLoading } from "@/components/ui/Loading";
import { adminApi } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import { FileWarning } from "lucide-react";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchReports = async () => {
    try {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      const response = await adminApi.getReports(params);
      setReports(response.data.data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await adminApi.updateReportStatus(id, status);
      toast.success(`Report marked as ${status}`);
      fetchReports();
    } catch {
      toast.error("Failed to update report");
    }
  };

  if (loading) return <PageLoading />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Counterfeit Reports</h1>
        <p className="text-muted-foreground">Review and manage counterfeit reports from customers</p>
      </div>

      <div className="mb-6">
        <select
          className="h-10 rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="INVESTIGATING">Investigating</option>
          <option value="RESOLVED">Resolved</option>
          <option value="DISMISSED">Dismissed</option>
        </select>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16">
            <FileWarning className="h-16 w-16 text-muted-foreground/50" />
            <p className="text-muted-foreground">No reports found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{report.description.substring(0, 100)}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Reporter: {report.reporterEmail}
                      {report.reporterName && ` (${report.reporterName})`}
                    </p>
                    {report.verificationCode && (
                      <p className="text-sm text-muted-foreground">
                        Product: {report.verificationCode.product?.name} ·
                        Company: {report.verificationCode.product?.company?.name}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Filed: {formatDateTime(report.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={report.status} />
                </div>

                {report.status === "PENDING" && (
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => updateStatus(report.id, "INVESTIGATING")}>
                      Investigate
                    </Button>
                    <Button size="sm" variant="success" onClick={() => updateStatus(report.id, "RESOLVED")}>
                      Resolve
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => updateStatus(report.id, "DISMISSED")}>
                      Dismiss
                    </Button>
                  </div>
                )}
                {report.status === "INVESTIGATING" && (
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="success" onClick={() => updateStatus(report.id, "RESOLVED")}>
                      Mark Resolved
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => updateStatus(report.id, "DISMISSED")}>
                      Dismiss
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
