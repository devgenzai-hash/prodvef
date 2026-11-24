"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { PageLoading } from "@/components/ui/Loading";
import { adminApi } from "@/lib/api";
import { AlertTriangle, ScanLine } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function FraudAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const response = await adminApi.getFraudAlerts();
        setAlerts(response.data.data);
      } catch (error) {
        console.error("Failed to fetch fraud alerts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  if (loading) return <PageLoading />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Fraud Alerts</h1>
        <p className="text-muted-foreground">Products with suspicious scanning activity</p>
      </div>

      {alerts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16">
            <AlertTriangle className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">No fraud alerts</h3>
            <p className="text-muted-foreground">No suspicious activity detected</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.id} className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <h3 className="font-semibold">{alert.productName}</h3>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Company: {alert.companyName} · Code: <span className="font-mono">{alert.uniqueCode}</span>
                    </p>
                    <p className="mt-1 text-sm font-medium text-orange-600">
                      Scanned {alert.scanCount} times (threshold: 5)
                    </p>
                  </div>
                  <StatusBadge status="SUSPICIOUS" />
                </div>

                {alert.recentScans?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Recent Scans:</p>
                    <div className="space-y-1">
                      {alert.recentScans.map((scan: any, i: number) => (
                        <div key={i} className="flex items-center gap-4 text-xs text-muted-foreground">
                          <ScanLine className="h-3 w-3" />
                          <span>{formatDateTime(scan.scannedAt)}</span>
                          <span>{[scan.city, scan.country].filter(Boolean).join(", ") || "Unknown location"}</span>
                          <span className="font-mono">{scan.ipAddress}</span>
                        </div>
                      ))}
                    </div>
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
