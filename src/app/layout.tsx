import './globals.css';
import { SiteHeader } from '@/components/layout/SiteHeader';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <SiteHeader />
        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 md:px-6">{children}</main>
      </body>
    </html>
  );
}
