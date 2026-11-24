"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Shield, Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-foreground">
            Trust<span className="text-blue-600">Verify</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/verify" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Verify Product
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/company/login">
              <Button variant="outline" size="sm">Company Login</Button>
            </Link>
            <Link href="/company/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t bg-white md:hidden">
          <div className="flex flex-col gap-2 p-4">
            <Link href="/" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <Link href="/verify" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent" onClick={() => setMobileOpen(false)}>
              Verify Product
            </Link>
            <Link href="/about" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent" onClick={() => setMobileOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent" onClick={() => setMobileOpen(false)}>
              Contact
            </Link>
            <hr />
            <Link href="/company/login" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full">Company Login</Button>
            </Link>
            <Link href="/company/register" onClick={() => setMobileOpen(false)}>
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
