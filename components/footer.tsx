import Link from "next/link";
import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/50 py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Mail className="h-6 w-6 text-primary" />
              <span>FollowBoost</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Never lose a client again with AI-powered follow-up emails that close more deals.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Product</h3>
            <ul className="space-y-2">
              <FooterLink href="/features">Features</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
              <FooterLink href="/roadmap">Roadmap</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <FooterLink href="/privacy">Privacy</FooterLink>
              <FooterLink href="/terms">Terms</FooterLink>
              <FooterLink href="/cookies">Cookies</FooterLink>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FollowBoost. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-muted-foreground hover:text-foreground transition-colors">
        {children}
      </Link>
    </li>
  );
}