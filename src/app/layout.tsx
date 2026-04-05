import './globals.css';
import { Fraunces, Geist, Geist_Mono } from 'next/font/google';
import { PageTransition } from '@/components/layout/PageTransition';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['700', '800'],
  display: 'swap',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Beeliber Academy — AI 실습 교육 플랫폼',
  description: '마케팅·영상·개발·자동화 4개 트랙, 실제 프롬프트 입력창과 결과 패널로 학습하고 결과물은 버전 단위로 저장됩니다.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${fraunces.variable} ${geist.variable} ${geistMono.variable}`}>
      <body className="min-h-screen academy-bg text-white antialiased">
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
