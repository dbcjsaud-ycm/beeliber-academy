'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Sparkles, ArrowRight, ChevronRight } from 'lucide-react';

const SplineScene = dynamic(() => import('@/components/landing/SplineScene'), { ssr: false });

/* ── Track data ─────────────────────────────────────────────────────── */
const TRACKS = [
  {
    no: '01',
    label: '마케팅',
    sub: 'SNS · SEO · GEO 전략',
    desc: 'Super Gems 활용, GEO 전략, SNS-SEO 연결 워크플로우를 AI로 완성합니다.',
    outputs: ['광고 제목 10개 + 설명 3개', 'CTA 5개 + 해시태그 15개', '썸네일 문구 세트'],
    href: '/lab/marketing/campaign-copy-studio',
    time: '2–3h',
    accent: 'rgba(245,158,11,1)',
    glow: 'rgba(245,158,11,0.15)',
    border: 'rgba(245,158,11,0.25)',
  },
  {
    no: '02',
    label: '이미지 투 비디오',
    sub: '기준이미지 → 첫프레임 → 영상',
    desc: '기준 이미지를 먼저 생성하고 첫 프레임으로 고정해 영상으로 만드는 파이프라인.',
    outputs: ['기준 이미지 프롬프트', '장면별 영상 프롬프트', '자막 + 업로드 패키지'],
    href: '/tracks/image-to-video',
    time: '3–4h',
    accent: 'rgba(6,182,212,1)',
    glow: 'rgba(6,182,212,0.12)',
    border: 'rgba(6,182,212,0.22)',
  },
  {
    no: '03',
    label: '웹/앱 개발',
    sub: '기획 → 구조 → 작업지시서',
    desc: '화면 구조, 기능 목록, 개발 작업지시서까지 AI로 완성합니다.',
    outputs: ['서비스 소개 + 화면 구조', '핵심 기능 목록', '개발 작업지시서'],
    href: '/tracks/web-app',
    time: '3–5h',
    accent: 'rgba(124,58,237,1)',
    glow: 'rgba(124,58,237,0.12)',
    border: 'rgba(124,58,237,0.22)',
  },
  {
    no: '04',
    label: '자동화',
    sub: 'Tree of Thoughts · RAG · Reflection',
    desc: '반복 업무를 AI 파이프라인으로 자동화하는 고급 프롬프팅 기법을 실습합니다.',
    outputs: ['반복업무 정의 + 입출력 구조', '단계별 요청문', '최종 출력 형식'],
    href: '/tracks/automation',
    time: '4–6h',
    accent: 'rgba(245,158,11,1)',
    glow: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.22)',
  },
];

const STEPS = [
  { n: '01', label: '교수 설명', desc: '핵심 개념과 따라하기 순서를 읽습니다.' },
  { n: '02', label: '프롬프트 입력', desc: '예시 칩을 클릭하거나 직접 작성합니다.' },
  { n: '03', label: 'AI 실행', desc: 'Gemini · GPT · Claude가 즉시 응답합니다.' },
  { n: '04', label: '자동 검수', desc: '품질·정책·목적을 자동으로 체크합니다.' },
  { n: '05', label: '결과 저장', desc: '버전 단위로 Supabase에 저장됩니다.' },
];

/* ── Page ────────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="min-h-screen academy-bg text-white overflow-x-hidden">

      {/* ── Navigation ───────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-panel-light border-b border-white/[0.06]">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 text-sm font-bold tracking-tight">
            <span className="text-xl">🐝</span>
            <span className="text-white">beeliber</span>
            <span className="text-white/25 font-normal">academy</span>
          </Link>

          <div className="hidden items-center gap-7 text-sm md:flex">
            {[
              { label: '실전 세션', href: '/tracks' },
              { label: '실습 랩', href: '/lab/marketing/campaign-copy-studio' },
              { label: '워크스페이스', href: '/spaces/new' },
              { label: '대시보드', href: '/academy' },
            ].map(({ label, href }) => (
              <Link key={href} href={href} className="text-white/40 hover:text-white transition-colors duration-150">
                {label}
              </Link>
            ))}
          </div>

          <Link
            href="/academy"
            className="flex items-center gap-1.5 rounded-[10px] bg-amber-500 px-4 py-2 text-xs font-semibold text-black hover:bg-amber-400 transition-colors glow-amber-sm"
          >
            <Sparkles size={12} />
            무료로 시작
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-14">

        {/* ambient glow behind robot */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-full w-[60%] bg-gradient-to-l from-[rgba(6,182,212,0.05)] via-transparent to-transparent" />
          <div className="absolute right-[10%] top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[rgba(124,58,237,0.06)] blur-[120px]" />
          <div className="absolute right-[15%] top-[40%] h-[300px] w-[300px] rounded-full bg-[rgba(6,182,212,0.05)] blur-[80px]" />
          <div className="dot-grid absolute inset-0 opacity-30" />
          {/* left edge glow */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[600px] w-[2px] bg-gradient-to-b from-transparent via-amber-500/20 to-transparent" />
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-0 px-6 lg:grid-cols-[1fr_55%]">

          {/* Left: Copy */}
          <div className="flex flex-col gap-8 py-20 lg:py-0 lg:pr-12">

            {/* Eyebrow */}
            <div className="flex items-center gap-2.5">
              <span className="h-px w-6 bg-amber-500/60" />
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-amber-400/80">
                AI 실습 교육 플랫폼
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-fraunces text-[clamp(2.8rem,6vw,5rem)] font-black leading-[1.05] tracking-tight">
              <span className="block text-white">작은 질문이</span>
              <span className="block text-gradient-amber italic">거대한 변화를</span>
              <span className="block text-white">만듭니다</span>
            </h1>

            <p className="max-w-[420px] text-[1.0625rem] leading-[1.65] text-white/50">
              마케팅·영상·개발·자동화 4개 트랙.<br />
              실제 프롬프트 입력창과 결과 패널로 학습하고<br />
              결과물은 버전 단위로 저장됩니다.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/academy"
                className="group flex items-center gap-2 rounded-[10px] bg-amber-500 px-6 py-3 text-sm font-semibold text-black hover:bg-amber-400 transition-all glow-amber"
              >
                무료로 시작하기
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/lab/marketing/campaign-copy-studio"
                className="flex items-center gap-2 rounded-[10px] border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white/70 hover:bg-white/[0.08] hover:border-amber-500/30 hover:text-white transition-all"
              >
                샘플 수업 보기
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 border-t border-white/[0.06] pt-6">
              {[
                { v: '4', l: '실전 트랙' },
                { v: '28+', l: '실습 모듈' },
                { v: 'AI', l: '자동 검수' },
              ].map(({ v, l }) => (
                <div key={l}>
                  <div className="text-xl font-bold text-gradient-amber tabular-nums">{v}</div>
                  <div className="mt-0.5 text-xs text-white/35">{l}</div>
                </div>
              ))}
              <div className="ml-auto hidden text-xs text-white/20 lg:block">
                Gemini · GPT · Claude
              </div>
            </div>
          </div>

          {/* Right: Spline Robot */}
          <div className="relative hidden lg:block" style={{ height: '100vh' }}>
            <SplineScene />
          </div>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden flex-col items-center gap-2 text-white/15 lg:flex">
          <div className="h-8 w-px bg-gradient-to-b from-white/15 to-transparent" />
          <span className="text-[11px] tracking-widest uppercase">scroll</span>
        </div>
      </section>

      {/* ── Tracks ───────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-6 py-28">
        <div className="section-divider mb-20" />

        {/* Section header */}
        <div className="mb-14 flex items-end justify-between gap-4">
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-amber-400/70">
              <span className="h-px w-5 bg-amber-500/50" />
              실전 세션
            </p>
            <h2 className="text-3xl font-bold text-white lg:text-4xl">
              어떤 결과물을 만들 건가요?
            </h2>
          </div>
          <Link
            href="/tracks"
            className="hidden shrink-0 items-center gap-1.5 text-sm text-white/35 hover:text-white/70 transition-colors sm:flex"
          >
            전체 보기
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* 2×2 Track grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {TRACKS.map((t) => (
            <Link
              key={t.no}
              href={t.href}
              className="group relative flex flex-col overflow-hidden rounded-[14px] border border-white/[0.07] bg-white/[0.02] p-7 transition-all duration-200 hover:-translate-y-0.5"
              style={{ '--accent': t.accent, '--glow': t.glow, '--border-c': t.border } as React.CSSProperties}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = t.border;
                el.style.boxShadow = `0 8px 40px ${t.glow}`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(255,255,255,0.07)';
                el.style.boxShadow = '';
              }}
            >
              {/* Track number */}
              <div
                className="mb-5 flex items-center justify-between"
              >
                <span className="font-mono text-xs font-medium tracking-widest" style={{ color: t.accent }}>
                  {t.no}
                </span>
                <span className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide"
                  style={{ color: t.accent, borderColor: t.border, background: t.glow }}>
                  {t.time}
                </span>
              </div>

              <h3 className="mb-1 text-xl font-bold text-white">{t.label}</h3>
              <p className="mb-1 text-xs font-medium" style={{ color: t.accent }}>{t.sub}</p>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-white/45">{t.desc}</p>

              {/* Outputs */}
              <div className="mb-5 space-y-1.5 rounded-[10px] border border-white/[0.05] bg-white/[0.025] p-3.5">
                {t.outputs.map((o) => (
                  <div key={o} className="flex items-center gap-2.5 text-xs text-white/50">
                    <span className="h-1 w-1 flex-shrink-0 rounded-full" style={{ background: t.accent }} />
                    {o}
                  </div>
                ))}
              </div>

              <div
                className="flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5"
                style={{ color: t.accent }}
              >
                트랙 시작
                <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-6 pb-28">
        <div className="section-divider mb-20" />

        <div className="mb-12">
          <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-amber-400/70">
            <span className="h-px w-5 bg-amber-500/50" />
            학습 흐름
          </p>
          <h2 className="text-2xl font-bold text-white lg:text-3xl">
            한 번 해보면 바로 보입니다
          </h2>
        </div>

        <div className="relative grid gap-0 md:grid-cols-5">
          {/* connecting line */}
          <div className="absolute top-5 left-5 right-5 hidden h-px bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent md:block" />

          {STEPS.map((s, i) => (
            <div key={s.n} className="relative flex flex-col gap-3 p-5">
              {/* step number */}
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-bold text-amber-400">
                {s.n}
              </div>
              <div className="text-sm font-semibold text-white">{s.label}</div>
              <div className="text-xs leading-relaxed text-white/40">{s.desc}</div>
              {i < 4 && (
                <div className="absolute top-5 -right-2 hidden text-white/15 md:block">
                  <ChevronRight size={14} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="section-divider mb-20" />

        <div className="relative overflow-hidden rounded-[20px] border border-amber-500/15 bg-gradient-to-br from-amber-500/[0.07] via-transparent to-transparent px-10 py-14 md:px-16">
          {/* glow */}
          <div className="pointer-events-none absolute -top-20 -left-10 h-[300px] w-[300px] rounded-full bg-amber-500/10 blur-[80px]" />

          <div className="relative max-w-xl">
            <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-amber-400/70">
              <span className="h-px w-5 bg-amber-500/50" />
              지금 바로 시작하세요
            </p>
            <h2 className="mb-4 font-fraunces text-3xl font-black text-white lg:text-4xl">
              첫 질문이<br />모든 것을 바꿉니다
            </h2>
            <p className="mb-8 text-white/45">
              무료로 시작, 결과물은 영원히 내 것.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/academy"
                className="group flex items-center gap-2 rounded-[10px] bg-amber-500 px-7 py-3 text-sm font-semibold text-black hover:bg-amber-400 transition-all glow-amber"
              >
                <Sparkles size={14} />
                무료로 시작하기
              </Link>
              <Link
                href="/tracks"
                className="flex items-center gap-2 rounded-[10px] border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white/60 hover:border-amber-500/25 hover:text-white transition-all"
              >
                트랙 둘러보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-xs text-white/20">
          <div className="flex items-center gap-2">
            <span className="text-base">🐝</span>
            <span>beeliber academy</span>
          </div>
          <span>© 2026 Beeliber. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
