"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { PageLoading } from "@/components/ui/Loading";
import { adminApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Building2, CheckCircle2, XCircle } from "lucide-react";

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchCompanies = async () => {
    try {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      const response = await adminApi.getCompanies(params);
      setCompanies(response.data.data);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [statusFilter]);

  const handleApprove = async (id: string) => {
    try {
      await adminApi.approveCompany(id);
      toast.success("Company approved!");
      fetchCompanies();
    } catch (err: any) {
      toast.error("Failed to approve company");
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Reason for rejection:");
    if (reason === null) return;
    try {
      await adminApi.rejectCompany(id, reason);
      toast.success("Company rejected");
      fetchCompanies();
    } catch (err: any) {
      toast.error("Failed to reject company");
    }
  };

  if (loading) return <PageLoading />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manage Companies</h1>
        <p className="text-muted-foreground">Review and manage company registrations</p>
      </div>

      <div className="mb-6">
        <select
          className="h-10 rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="space-y-4">
        {companies.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-16">
              <Building2 className="h-16 w-16 text-muted-foreground/50" />
              <p className="text-muted-foreground">No companies found</p>
            </CardContent>
          </Card>
        ) : (
          companies.map((company) => (
            <Card key={company.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{company.name}</h3>
                    <p className="text-sm text-muted-foreground">{company.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {[company.city, company.country].filter(Boolean).join(", ")} ·
                      Tax ID: {company.taxId || "N/A"} ·
                      Products: {company._count?.products || 0} ·
                      Joined: {formatDate(company.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={company.status} />
                  {company.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleApprove(company.id)}
                        className="gap-1"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(company.id)}
                        className="gap-1"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
