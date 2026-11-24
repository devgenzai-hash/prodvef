"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { productsApi } from "@/lib/api";
import { toast } from "sonner";
import { Package, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    batchNumber: "",
    manufacturingDate: "",
    expiryDate: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await productsApi.create(form);
      toast.success("Product created successfully!");
      router.push("/company/products");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const categories = [
    "Electronics",
    "Pharmaceuticals",
    "Food & Beverages",
    "Cosmetics",
    "Clothing & Apparel",
    "Automotive Parts",
    "Home Appliances",
    "Sports Equipment",
    "Luxury Goods",
    "Other",
  ];

  return (
    <div>
      <Link
        href="/company/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Package className="h-6 w-6" />
            </div>
            <CardTitle>Add New Product</CardTitle>
            <CardDescription>
              Register a new product to generate verification codes and QR codes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Product Name *"
                placeholder="Premium Widget Pro"
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="SKU *"
                  placeholder="ACME-WIDGET-001"
                  value={form.sku}
                  onChange={(e) => updateForm("sku", e.target.value)}
                  required
                />
                <div className="space-y-1">
                  <label className="text-sm font-medium">Category *</label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={form.category}
                    onChange={(e) => updateForm("category", e.target.value)}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Input
                label="Batch Number *"
                placeholder="BATCH-2026-001"
                value={form.batchNumber}
                onChange={(e) => updateForm("batchNumber", e.target.value)}
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Manufacturing Date *"
                  type="date"
                  value={form.manufacturingDate}
                  onChange={(e) => updateForm("manufacturingDate", e.target.value)}
                  required
                />
                <Input
                  label="Expiry Date"
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => updateForm("expiryDate", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Describe your product..."
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Creating..." : "Create Product"}
                </Button>
                <Link href="/company/products">
                  <Button type="button" variant="outline">Cancel</Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
