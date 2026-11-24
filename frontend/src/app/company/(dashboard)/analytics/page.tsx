"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PageLoading } from "@/components/ui/Loading";
import { productsApi } from "@/lib/api";
import { BarChart3, TrendingUp, Package, ScanLine } from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await productsApi.getAnalytics();
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) return <PageLoading />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your product performance and scan activity</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Products by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Products by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.productsByStatus?.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No data yet</p>
            ) : (
              <div className="space-y-3">
                {data?.productsByStatus?.map((item: any) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <span className="text-sm">{item.status}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 rounded-full bg-blue-200" style={{ width: `${Math.max(item._count * 20, 20)}px` }} />
                      <span className="text-sm font-bold">{item._count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Products by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.productsByCategory?.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No data yet</p>
            ) : (
              <div className="space-y-3">
                {data?.productsByCategory?.map((item: any) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <span className="text-sm">{item.category}</span>
                    <span className="text-sm font-bold">{item._count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Scanned Products */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Top Scanned Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.topScannedProducts?.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No scan data yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-3 font-medium">Product</th>
                      <th className="pb-3 font-medium">SKU</th>
                      <th className="pb-3 font-medium">Code</th>
                      <th className="pb-3 font-medium text-right">Scans</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.topScannedProducts?.map((item: any, i: number) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-3 font-medium">{item.productName}</td>
                        <td className="py-3">{item.sku}</td>
                        <td className="py-3 font-mono text-xs">{item.code}</td>
                        <td className="py-3 text-right font-bold">{item.scanCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
