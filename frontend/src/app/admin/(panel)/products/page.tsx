"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { PageLoading } from "@/components/ui/Loading";
import { adminApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Package, CheckCircle2, XCircle } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchProducts = async () => {
    try {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      const response = await adminApi.getProducts(params);
      setProducts(response.data.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [statusFilter]);

  const handleVerify = async (id: string) => {
    try {
      await adminApi.verifyProduct(id);
      toast.success("Product verified!");
      fetchProducts();
    } catch {
      toast.error("Failed to verify product");
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Reason for rejection:");
    if (reason === null) return;
    try {
      await adminApi.rejectProduct(id, reason);
      toast.success("Product rejected");
      fetchProducts();
    } catch {
      toast.error("Failed to reject product");
    }
  };

  if (loading) return <PageLoading />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <p className="text-muted-foreground">Review and verify products from all companies</p>
      </div>

      <div className="mb-6">
        <select
          className="h-10 rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="VERIFIED">Verified</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16">
            <Package className="h-16 w-16 text-muted-foreground/50" />
            <p className="text-muted-foreground">No products found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      By: {product.company?.name} · SKU: {product.sku} · Batch: {product.batchNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Category: {product.category} · Codes: {product._count?.verificationCodes || 0} ·
                      Created: {formatDate(product.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={product.status} />
                  {product.status === "PENDING" && (
                    <>
                      <Button size="sm" variant="success" onClick={() => handleVerify(product.id)} className="gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Verify
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(product.id)} className="gap-1">
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
