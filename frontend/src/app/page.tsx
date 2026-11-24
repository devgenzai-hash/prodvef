import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import {
  Shield,
  ScanLine,
  Building2,
  CheckCircle2,
  QrCode,
  BarChart3,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              <Shield className="h-4 w-4" />
              Trusted by 500+ brands worldwide
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Verify Product{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Authenticity
              </span>{" "}
              Instantly
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Bridge the trust gap between manufacturers and customers. Register your products,
              generate unique QR codes, and let customers verify authenticity in seconds.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/verify">
                <Button size="lg" className="gap-2 text-base">
                  <ScanLine className="h-5 w-5" />
                  Verify a Product
                </Button>
              </Link>
              <Link href="/company/register">
                <Button size="lg" variant="outline" className="gap-2 text-base">
                  <Building2 className="h-5 w-5" />
                  Register Your Company
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Background decoration */}
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-blue-100 opacity-50 blur-3xl" />
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-cyan-100 opacity-50 blur-3xl" />
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">How It Works</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Three simple steps to verify any product&apos;s authenticity
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="group relative rounded-2xl border p-8 transition-all hover:border-blue-200 hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <Building2 className="h-7 w-7" />
              </div>
              <div className="mb-2 text-sm font-medium text-blue-600">Step 1</div>
              <h3 className="mb-3 text-xl font-semibold">Company Registers</h3>
              <p className="text-muted-foreground">
                Companies sign up, get verified, and register their products on the platform with unique identifiers.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group relative rounded-2xl border p-8 transition-all hover:border-blue-200 hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white">
                <QrCode className="h-7 w-7" />
              </div>
              <div className="mb-2 text-sm font-medium text-green-600">Step 2</div>
              <h3 className="mb-3 text-xl font-semibold">QR Codes Generated</h3>
              <p className="text-muted-foreground">
                Each product gets a unique verification code and QR code that&apos;s printed on the packaging.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group relative rounded-2xl border p-8 transition-all hover:border-blue-200 hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div className="mb-2 text-sm font-medium text-purple-600">Step 3</div>
              <h3 className="mb-3 text-xl font-semibold">Customer Verifies</h3>
              <p className="text-muted-foreground">
                Customers scan the QR code or enter the code to instantly verify the product is authentic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Why TrustVerify?</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Comprehensive tools for brands and peace of mind for customers
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<QrCode className="h-6 w-6" />}
              title="Unique QR Codes"
              description="Every product gets a cryptographically unique code that can't be duplicated."
            />
            <FeatureCard
              icon={<ScanLine className="h-6 w-6" />}
              title="Instant Verification"
              description="Customers can verify products in under 3 seconds — no app download required."
            />
            <FeatureCard
              icon={<AlertTriangle className="h-6 w-6" />}
              title="Fraud Detection"
              description="Automatic alerts when suspicious scanning patterns are detected."
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Analytics Dashboard"
              description="Track scans, locations, and customer engagement in real time."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Verified Brands"
              description="All companies go through a verification process before they can register products."
            />
            <FeatureCard
              icon={<CheckCircle2 className="h-6 w-6" />}
              title="Consumer Trust"
              description="Build lasting trust with customers by proving your product's authenticity."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Protect Your Brand?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-blue-100">
            Join hundreds of companies already using TrustVerify to protect their products and build customer trust.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/company/register">
              <Button size="lg" className="gap-2 bg-white text-blue-600 hover:bg-blue-50">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/verify">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white text-white hover:bg-white/10"
              >
                Verify a Product
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-6 transition-all hover:shadow-md">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
