"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { authApi } from "@/lib/api";
import { toast } from "sonner";
import { Building2 } from "lucide-react";

export default function CompanyRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    taxId: "",
    description: "",
    address: "",
    city: "",
    country: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      const response = await authApi.companyRegister(data);
      localStorage.setItem("token", response.data.data.token);
      toast.success("Registration successful! Awaiting admin approval.");
      router.push("/company/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-lg">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <Building2 className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl">Register Your Company</CardTitle>
                <CardDescription>
                  Create an account to start verifying your products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Company Name *"
                    placeholder="Acme Corporation"
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    required
                  />
                  <Input
                    label="Email *"
                    type="email"
                    placeholder="contact@company.com"
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    required
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Password *"
                      type="password"
                      placeholder="Min 8 characters"
                      value={form.password}
                      onChange={(e) => updateForm("password", e.target.value)}
                      required
                    />
                    <Input
                      label="Confirm Password *"
                      type="password"
                      placeholder="Repeat password"
                      value={form.confirmPassword}
                      onChange={(e) => updateForm("confirmPassword", e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Phone"
                      placeholder="+1-555-0100"
                      value={form.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                    />
                    <Input
                      label="Tax ID / GSTIN"
                      placeholder="TAX-12345"
                      value={form.taxId}
                      onChange={(e) => updateForm("taxId", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Company Description</label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Tell us about your company..."
                      value={form.description}
                      onChange={(e) => updateForm("description", e.target.value)}
                    />
                  </div>
                  <Input
                    label="Address"
                    placeholder="123 Business Street"
                    value={form.address}
                    onChange={(e) => updateForm("address", e.target.value)}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="City"
                      placeholder="San Francisco"
                      value={form.city}
                      onChange={(e) => updateForm("city", e.target.value)}
                    />
                    <Input
                      label="Country"
                      placeholder="United States"
                      value={form.country}
                      onChange={(e) => updateForm("country", e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Registering..." : "Register Company"}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/company/login" className="font-medium text-blue-600 hover:underline">
                      Login here
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
