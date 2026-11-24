import Link from "next/link";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold">
                Trust<span className="text-blue-600">Verify</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Bridging the trust gap between manufacturers and customers through product verification.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/verify" className="hover:text-foreground">Verify a Product</Link></li>
              <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>

          {/* For Companies */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">For Companies</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/company/register" className="hover:text-foreground">Register Your Company</Link></li>
              <li><Link href="/company/login" className="hover:text-foreground">Company Login</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TrustVerify. All rights reserved. Built to protect consumers and brands.
        </div>
      </div>
    </footer>
  );
}
