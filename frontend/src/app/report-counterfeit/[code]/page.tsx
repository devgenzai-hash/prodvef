"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { verifyApi } from "@/lib/api";
import { toast } from "sonner";
import { Flag, CheckCircle2 } from "lucide-react";

export default function ReportCounterfeitPage() {
  const params = useParams();
  const code = params.code as string;
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    reporterEmail: "",
    reporterName: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyApi.report({
        ...form,
        verificationCodeId: code,
      });
      setSubmitted(true);
      toast.success("Report submitted successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-lg">
            {submitted ? (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="flex flex-col items-center gap-4 py-12">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                  <h2 className="text-xl font-semibold text-green-800">
                    Report Submitted
                  </h2>
                  <p className="text-center text-green-600">
                    Thank you for reporting. Our team will investigate this matter
                    and take appropriate action.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600">
                    <Flag className="h-6 w-6" />
                  </div>
                  <CardTitle>Report Counterfeit Product</CardTitle>
                  <CardDescription>
                    If you believe this product is counterfeit, please provide
                    details below. Our team will investigate.
                  </CardDescription>
                  {code && (
                    <div className="mt-2 rounded-lg bg-gray-50 px-3 py-2 font-mono text-sm">
                      Product Code: <strong>{code}</strong>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Your Email *"
                      type="email"
                      placeholder="your@email.com"
                      value={form.reporterEmail}
                      onChange={(e) =>
                        setForm({ ...form, reporterEmail: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="Your Name (Optional)"
                      placeholder="John Doe"
                      value={form.reporterName}
                      onChange={(e) =>
                        setForm({ ...form, reporterName: e.target.value })
                      }
                    />
                    <div className="space-y-1">
                      <label className="text-sm font-medium">
                        Description *
                      </label>
                      <textarea
                        className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Please describe why you believe this product is counterfeit. Include details like where you purchased it, any visual differences, etc."
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading || !form.reporterEmail || !form.description}
                    >
                      {loading ? "Submitting..." : "Submit Report"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
