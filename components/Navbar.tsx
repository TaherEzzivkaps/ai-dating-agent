'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Activity, Shield, Users, Grid, Zap } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Launch Agent', icon: Zap },
    { href: '/demo', label: 'Demo 25 Hub', icon: Users, badge: 'Instant' },
    { href: '/matrix', label: 'Heatmap Matrix', icon: Grid },
    { href: '/about', label: 'Privacy & System', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#0c0c0e]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary-accent to-secondary-accent flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.35)] group-hover:scale-105 transition-transform">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-display font-bold text-base sm:text-lg text-white tracking-tight whitespace-nowrap">
            Agentic Dating
          </span>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                  isActive
                    ? 'text-white bg-white/[0.08] border border-white/10 shadow-sm'
                    : 'text-on-surface-variant hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-secondary-container/80 text-secondary border border-secondary/20">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/demo"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-accent to-secondary-accent text-white font-medium text-xs sm:text-sm shadow-[0_0_15px_rgba(244,63,94,0.25)] hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
          >
            <Activity className="h-3.5 w-3.5" />
            <span>25-Person Demo</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
