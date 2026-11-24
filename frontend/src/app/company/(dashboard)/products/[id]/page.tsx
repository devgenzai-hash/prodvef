"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { PageLoading } from "@/components/ui/Loading";
import { productsApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  Package,
  QrCode,
  ArrowLeft,
  Download,
  Plus,
  Copy,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingCodes, setGeneratingCodes] = useState(false);
  const [codeCount, setCodeCount] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await productsApi.getById(productId);
      setProduct(response.data.data);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCodes = async () => {
    setGeneratingCodes(true);
    try {
      await productsApi.generateCodes(productId, codeCount);
      toast.success(`${codeCount} verification code(s) generated!`);
      fetchProduct();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to generate codes");
    } finally {
      setGeneratingCodes(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  if (loading) return <PageLoading />;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <Link
        href="/company/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      {/* Product Info */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Package className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <p className="text-muted-foreground">
                  SKU: {product.sku} · Batch: {product.batchNumber} · {product.category}
                </p>
                {product.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
                )}
              </div>
            </div>
            <StatusBadge status={product.status} />
          </div>

          <div className="mt-6 grid gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Manufacturing Date</p>
              <p className="font-medium">{formatDate(product.manufacturingDate)}</p>
            </div>
            {product.expiryDate && (
              <div>
                <p className="text-sm text-muted-foreground">Expiry Date</p>
                <p className="font-medium">{formatDate(product.expiryDate)}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Lifecycle</p>
              <StatusBadge status={product.lifecycle} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Codes */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <QrCode className="h-5 w-5 text-blue-600" />
            Generate Verification Codes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Number of codes</label>
              <input
                type="number"
                min="1"
                max="100"
                value={codeCount}
                onChange={(e) => setCodeCount(parseInt(e.target.value) || 1)}
                className="h-10 w-24 rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button
              onClick={handleGenerateCodes}
              disabled={generatingCodes || product.status !== "VERIFIED"}
              className="gap-2 mt-6"
            >
              <Plus className="h-4 w-4" />
              {generatingCodes ? "Generating..." : "Generate Codes"}
            </Button>
          </div>
          {product.status !== "VERIFIED" && (
            <p className="mt-2 text-sm text-yellow-600">
              ⚠️ Product must be verified by admin before generating codes.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Existing Codes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Verification Codes ({product.verificationCodes?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {product.verificationCodes?.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No verification codes generated yet.
            </p>
          ) : (
            <div className="grid gap-3">
              {product.verificationCodes?.map((code: any) => (
                <div
                  key={code.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    {code.qrCodeUrl && (
                      <img
                        src={code.qrCodeUrl}
                        alt="QR Code"
                        className="h-16 w-16 rounded"
                      />
                    )}
                    <div>
                      <p className="font-mono font-medium">{code.uniqueCode}</p>
                      <p className="text-sm text-muted-foreground">
                        Scans: {code.scanCount} · Created: {formatDate(code.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={code.status} />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyCode(code.uniqueCode)}
                      title="Copy code"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    {code.qrCodeUrl && (
                      <a href={code.qrCodeUrl} download={`qr-${code.uniqueCode}.png`}>
                        <Button variant="ghost" size="icon" title="Download QR">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
