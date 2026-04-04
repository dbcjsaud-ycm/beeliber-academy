import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 md:px-6">
        <Link href="/" className="font-semibold tracking-tight">
          Academy
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <Link href="/workspace" className="hover:text-slate-900">Workspace</Link>
          <Link href="/tracks" className="hover:text-slate-900">Tracks</Link>
          <Link href="/outputs" className="hover:text-slate-900">Outputs</Link>
        </nav>
      </div>
    </header>
  );
}
