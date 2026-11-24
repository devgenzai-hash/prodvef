"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { ScanLine, Keyboard, Shield, ArrowRight } from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [mode, setMode] = useState<"choice" | "manual" | "scan">("choice");

  const handleManualVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      router.push(`/verify/${code.trim()}`);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              <Shield className="h-4 w-4" />
              Product Authenticity Check
            </div>
            <h1 className="mb-4 text-3xl font-bold md:text-5xl">
              Verify Your Product
            </h1>
            <p className="mb-10 text-lg text-muted-foreground">
              Enter the verification code found on your product&apos;s packaging
              or scan the QR code to instantly check authenticity.
            </p>

            {mode === "choice" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Card
                  className="cursor-pointer transition-all hover:border-blue-300 hover:shadow-lg"
                  onClick={() => setMode("manual")}
                >
                  <CardContent className="flex flex-col items-center gap-4 p-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                      <Keyboard className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Enter Code</h3>
                      <p className="text-sm text-muted-foreground">
                        Type the verification code manually
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer transition-all hover:border-blue-300 hover:shadow-lg"
                  onClick={() => setMode("scan")}
                >
                  <CardContent className="flex flex-col items-center gap-4 p-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                      <ScanLine className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Scan QR Code</h3>
                      <p className="text-sm text-muted-foreground">
                        Use your camera to scan the QR code
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {mode === "manual" && (
              <Card className="mx-auto max-w-md">
                <CardHeader>
                  <CardTitle className="text-xl">Enter Verification Code</CardTitle>
                  <CardDescription>
                    Find the code on your product&apos;s label or packaging
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleManualVerify} className="space-y-4">
                    <Input
                      placeholder="e.g. TV-ACME-A1B2C3D4-2026"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="text-center text-lg tracking-wider"
                      autoFocus
                    />
                    <Button type="submit" className="w-full gap-2" size="lg" disabled={!code.trim()}>
                      Verify Product
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => setMode("choice")}
                    >
                      ← Back to options
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {mode === "scan" && (
              <Card className="mx-auto max-w-md">
                <CardHeader>
                  <CardTitle className="text-xl">Scan QR Code</CardTitle>
                  <CardDescription>
                    Point your camera at the QR code on the product
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-blue-200 bg-blue-50">
                    <div className="text-center">
                      <ScanLine className="mx-auto mb-2 h-12 w-12 text-blue-400" />
                      <p className="text-sm text-muted-foreground">
                        Camera scanner will activate here.
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        (Requires html5-qrcode integration)
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setMode("choice")}
                  >
                    ← Back to options
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold">
              Where to Find Your Code
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-lg font-bold">
                  1
                </div>
                <h4 className="font-medium">Product Packaging</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Look for the QR code or alphanumeric code on the box
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-lg font-bold">
                  2
                </div>
                <h4 className="font-medium">Product Label</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Check for a verification sticker on the product itself
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-lg font-bold">
                  3
                </div>
                <h4 className="font-medium">Inside the Package</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Some products include a verification card inside
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
