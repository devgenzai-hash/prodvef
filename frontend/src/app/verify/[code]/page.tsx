"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/Loading";
import { verifyApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  Calendar,
  Package,
  Hash,
  Globe,
  ScanLine,
  Flag,
  ArrowLeft,
} from "lucide-react";

interface VerificationResult {
  result: "VERIFIED" | "NOT_FOUND" | "SUSPICIOUS";
  message: string;
  code: string;
  product?: {
    name: string;
    category: string;
    batchNumber: string;
    manufacturingDate: string;
    expiryDate?: string;
    status: string;
    lifecycle: string;
  };
  company?: {
    name: string;
    logo?: string;
    website?: string;
    location: string;
    isVerifiedCompany: boolean;
  };
  scanInfo?: {
    totalScans: number;
    firstRegistered: string;
    verifiedAt?: string;
  };
}

export default function VerifyResultPage() {
  const params = useParams();
  const code = params.code as string;
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function verify() {
      try {
        const response = await verifyApi.verify(code);
        setResult(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Verification failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (code) verify();
  }, [code]);

  const getResultIcon = () => {
    if (!result) return null;
    switch (result.result) {
      case "VERIFIED":
        return <CheckCircle2 className="h-24 w-24 text-green-500" />;
      case "SUSPICIOUS":
        return <AlertTriangle className="h-24 w-24 text-orange-500" />;
      case "NOT_FOUND":
        return <XCircle className="h-24 w-24 text-red-500" />;
    }
  };

  const getResultBg = () => {
    if (!result) return "bg-gray-50";
    switch (result.result) {
      case "VERIFIED":
        return "bg-green-50 border-green-200";
      case "SUSPICIOUS":
        return "bg-orange-50 border-orange-200";
      case "NOT_FOUND":
        return "bg-red-50 border-red-200";
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            {/* Back button */}
            <Link
              href="/verify"
              className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Verify another product
            </Link>

            {loading && (
              <div className="py-20">
                <LoadingSpinner size="lg" text="Verifying product..." />
              </div>
            )}

            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="flex flex-col items-center gap-4 py-12">
                  <XCircle className="h-16 w-16 text-red-500" />
                  <h2 className="text-xl font-semibold text-red-800">Verification Error</h2>
                  <p className="text-red-600">{error}</p>
                  <Link href="/verify">
                    <Button>Try Again</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {result && (
              <div className="animate-fade-in space-y-6">
                {/* Result Banner */}
                <Card className={`border-2 ${getResultBg()}`}>
                  <CardContent className="flex flex-col items-center gap-4 py-10">
                    {getResultIcon()}
                    <h2 className="text-2xl font-bold">
                      {result.result === "VERIFIED" && "Product Verified ✅"}
                      {result.result === "SUSPICIOUS" && "⚠️ Suspicious Activity"}
                      {result.result === "NOT_FOUND" && "❌ Not Found"}
                    </h2>
                    <p className="max-w-md text-center text-muted-foreground">
                      {result.message}
                    </p>
                    <div className="rounded-lg bg-white/80 px-4 py-2 font-mono text-sm">
                      Code: <strong>{result.code}</strong>
                    </div>
                  </CardContent>
                </Card>

                {/* Product Details */}
                {result.product && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                        <Package className="h-5 w-5 text-blue-600" />
                        Product Details
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <InfoRow label="Product Name" value={result.product.name} />
                        <InfoRow label="Category" value={result.product.category} />
                        <InfoRow label="Batch Number" value={result.product.batchNumber} />
                        <InfoRow
                          label="Manufacturing Date"
                          value={formatDate(result.product.manufacturingDate)}
                        />
                        {result.product.expiryDate && (
                          <InfoRow
                            label="Expiry Date"
                            value={formatDate(result.product.expiryDate)}
                          />
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Status:</span>
                          <StatusBadge status={result.product.status} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Company Details */}
                {result.company && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        Manufacturer
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <InfoRow label="Company" value={result.company.name} />
                        {result.company.location && (
                          <InfoRow label="Location" value={result.company.location} />
                        )}
                        {result.company.website && (
                          <div>
                            <span className="text-sm text-muted-foreground">Website:</span>
                            <a
                              href={result.company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-sm text-blue-600 hover:underline"
                            >
                              {result.company.website}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Company Status:</span>
                          {result.company.isVerifiedCompany ? (
                            <span className="inline-flex items-center gap-1 text-sm text-green-700">
                              <CheckCircle2 className="h-4 w-4" /> Verified
                            </span>
                          ) : (
                            <span className="text-sm text-yellow-600">Unverified</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Scan Info */}
                {result.scanInfo && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                        <ScanLine className="h-5 w-5 text-blue-600" />
                        Scan Information
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <InfoRow
                          label="Times Scanned"
                          value={`${result.scanInfo.totalScans} time(s)`}
                        />
                        <InfoRow
                          label="Registered"
                          value={formatDate(result.scanInfo.firstRegistered)}
                        />
                        {result.scanInfo.verifiedAt && (
                          <InfoRow
                            label="Verified On"
                            value={formatDate(result.scanInfo.verifiedAt)}
                          />
                        )}
                      </div>
                      {result.scanInfo.totalScans > 3 && (
                        <div className="mt-4 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
                          ⚠️ This product has been scanned multiple times. If you suspect this product
                          is counterfeit, please report it.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Report Button */}
                <div className="text-center">
                  <Link href={`/report-counterfeit/${result.code}`}>
                    <Button variant="outline" className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700">
                      <Flag className="h-4 w-4" />
                      Report Counterfeit Product
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span className="ml-2 text-sm font-medium">{value}</span>
    </div>
  );
}
