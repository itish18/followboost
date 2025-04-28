"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Mail, Menu, X } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Mail className="h-6 w-6 text-primary" />
              <span>FollowBoost</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/authenticate">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard">Try Demo</Link>
              </Button>
            </div>
            <ModeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <div className="flex flex-col space-y-3 p-4">
            <Link 
              href="#features" 
              className="py-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="#pricing" 
              className="py-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="#faq" 
              className="py-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/authenticate" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Try Demo</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}