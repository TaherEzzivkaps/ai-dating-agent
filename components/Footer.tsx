import Link from 'next/link';
import { ShieldCheck, Lock, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-surface-container-lowest py-10 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-on-surface-variant font-mono">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <p className="text-on-surface font-semibold text-sm">
            Agentic Dating — Autonomous Swarm Protocol
          </p>
          <p>
            Honesty Rule: Data is scraped live from public LinkedIn & Instagram. Dates are LLM-simulated multi-turn conversations.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link href="/about" className="hover:text-primary transition-colors flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Privacy & Public Data Notice</span>
          </Link>
          <Link href="/about#removal" className="hover:text-secondary transition-colors flex items-center gap-1">
            <Lock className="h-3.5 w-3.5" />
            <span>Request Profile Removal</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
