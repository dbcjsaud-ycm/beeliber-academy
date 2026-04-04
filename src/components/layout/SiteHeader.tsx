'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';

const NAV_LINKS = [
  { label: '실전 세션', href: '/tracks' },
  { label: '실습 랩', href: '/lab/marketing/campaign-copy-studio' },
  { label: '워크스페이스', href: '/spaces/new' },
  { label: '대시보드', href: '/academy' },
];

export function SiteHeader() {
  const path = usePathname();

  return (
    <header className="sticky top-0 z-50 glass-panel-light border-b border-white/[0.06]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 text-sm font-bold tracking-tight">
          <span className="text-xl">🐝</span>
          <span className="text-white">beeliber</span>
          <span className="text-white/25 font-normal">academy</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors duration-150 ${
                path.startsWith(href)
                  ? 'text-white font-medium'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/academy"
          className="flex items-center gap-1.5 rounded-[10px] bg-amber-500 px-4 py-2 text-xs font-semibold text-black hover:bg-amber-400 transition-colors glow-amber-sm"
        >
          <Sparkles size={12} />
          시작하기
        </Link>
      </div>
    </header>
  );
}
