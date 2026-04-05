import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

const PAGES = [
  { no: 1, title: 'AI에게 첫 질문', href: '/learn/page-1' },
  { no: 2, title: '다시 시키는 법', href: '/learn/page-2' },
  { no: 3, title: '긴 글 정리하기', href: '/learn/page-3' },
  { no: 4, title: '파일 내용 질문', href: '/learn/page-4' },
];

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen academy-bg text-white">
      {/* ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-amber-500/[0.04] blur-[100px]" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Sidebar Progress */}
        <aside className="hidden w-56 flex-shrink-0 border-r border-white/[0.06] bg-white/[0.01] px-4 py-8 lg:flex lg:flex-col">
          <Link
            href="/start"
            className="mb-8 inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            <ChevronLeft size={13} />
            입문 허브
          </Link>

          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.18em] text-amber-400/60">
            입문 과정
          </p>
          <nav className="space-y-1">
            {PAGES.map((page) => (
              <Link
                key={page.no}
                href={page.href}
                className="flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white/80"
              >
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-white/[0.08] text-[10px] font-mono text-white/30">
                  {page.no}
                </span>
                {page.title}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-8">
            <Link
              href="/tracks"
              className="text-xs text-white/20 hover:text-amber-400/70 transition-colors"
            >
              실전 트랙으로 →
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
