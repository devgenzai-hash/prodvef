import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Shield, Users, Globe, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">About TrustVerify</h1>
            <p className="text-lg text-muted-foreground">
              We&apos;re on a mission to eliminate counterfeit products and build trust
              between brands and consumers worldwide.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4 text-2xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                Counterfeit products are a global problem affecting consumer safety, brand reputation,
                and economic growth. TrustVerify provides a simple, accessible platform that enables
                companies to register and verify their products, while giving consumers the power to
                instantly check if what they&apos;re buying is genuine.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div className="rounded-xl border p-6">
                <Shield className="mb-3 h-8 w-8 text-blue-600" />
                <h3 className="mb-2 text-lg font-semibold">Trust & Security</h3>
                <p className="text-sm text-muted-foreground">
                  Every company is verified before they can register products.
                  Every product gets a cryptographically unique verification code.
                </p>
              </div>
              <div className="rounded-xl border p-6">
                <Users className="mb-3 h-8 w-8 text-green-600" />
                <h3 className="mb-2 text-lg font-semibold">Consumer First</h3>
                <p className="text-sm text-muted-foreground">
                  No app downloads, no registration. Just scan and verify. We make it
                  as easy as possible for customers.
                </p>
              </div>
              <div className="rounded-xl border p-6">
                <Globe className="mb-3 h-8 w-8 text-purple-600" />
                <h3 className="mb-2 text-lg font-semibold">Global Reach</h3>
                <p className="text-sm text-muted-foreground">
                  Our platform works globally, supporting companies and customers from
                  any country or region.
                </p>
              </div>
              <div className="rounded-xl border p-6">
                <Award className="mb-3 h-8 w-8 text-orange-600" />
                <h3 className="mb-2 text-lg font-semibold">Brand Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced fraud detection, scan analytics, and counterfeit reporting
                  help brands protect their reputation.
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
