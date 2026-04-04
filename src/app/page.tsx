'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, Sparkles, ChevronRight } from 'lucide-react';

const SplineScene = dynamic(() => import('@/components/landing/SplineScene'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-transparent" />,
});

const TRACKS = [
  {
    no: '01', label: '마케팅', sub: 'SNS · SEO · GEO 전략',
    desc: 'Super Gems 활용, GEO 전략, SNS-SEO 연결 워크플로우를 AI로 완성합니다.',
    outputs: ['광고 제목 10개 + 설명 3개', 'CTA 5개 + 해시태그 15개', '썸네일 문구 세트'],
    href: '/lab/marketing/campaign-copy-studio', time: '2–3h',
    accent: '#f59e0b', glow: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.22)',
  },
  {
    no: '02', label: '이미지 투 비디오', sub: '기준이미지 → 첫프레임 → 영상',
    desc: '기준 이미지를 먼저 생성하고 첫 프레임으로 고정해 영상으로 만드는 파이프라인.',
    outputs: ['기준 이미지 프롬프트', '장면별 영상 프롬프트', '자막 + 업로드 패키지'],
    href: '/tracks/image-to-video', time: '3–4h',
    accent: '#06b6d4', glow: 'rgba(6,182,212,0.10)', border: 'rgba(6,182,212,0.20)',
  },
  {
    no: '03', label: '웹/앱 개발', sub: '기획 → 구조 → 작업지시서',
    desc: '화면 구조, 기능 목록, 개발 작업지시서까지 AI로 완성합니다.',
    outputs: ['서비스 소개 + 화면 구조', '핵심 기능 목록', '개발 작업지시서'],
    href: '/tracks/web-app', time: '3–5h',
    accent: '#7c3aed', glow: 'rgba(124,58,237,0.10)', border: 'rgba(124,58,237,0.20)',
  },
  {
    no: '04', label: '자동화', sub: 'Tree of Thoughts · RAG · Reflection',
    desc: '반복 업무를 AI 파이프라인으로 자동화하는 고급 프롬프팅 기법을 실습합니다.',
    outputs: ['반복업무 정의 + 입출력 구조', '단계별 요청문', '최종 출력 형식'],
    href: '/tracks/automation', time: '4–6h',
    accent: '#f59e0b', glow: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.20)',
  },
];

const STEPS = [
  { n: '01', label: '교수 설명', desc: '핵심 개념과 따라하기 순서' },
  { n: '02', label: '프롬프트 입력', desc: '예시 칩 클릭 또는 직접 작성' },
  { n: '03', label: 'AI 실행', desc: 'Gemini · GPT · Claude 즉시 응답' },
  { n: '04', label: '자동 검수', desc: '품질·정책·목적 자동 체크' },
  { n: '05', label: '결과 저장', desc: '버전 단위 Supabase 저장' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">

      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.05]"
        style={{ background: 'rgba(5,5,8,0.75)', backdropFilter: 'blur(20px)' }}>
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-xl leading-none">🐝</span>
            <span className="font-sans text-sm font-semibold tracking-tight text-white">beeliber</span>
            <span className="font-sans text-sm font-normal text-white/25">academy</span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {[
              { label: '실전 세션', href: '/tracks' },
              { label: '실습 랩', href: '/lab/marketing/campaign-copy-studio' },
              { label: '워크스페이스', href: '/spaces/new' },
              { label: '대시보드', href: '/academy' },
            ].map(({ label, href }) => (
              <Link key={href} href={href}
                className="font-sans text-[13px] font-normal text-white/40 transition-colors hover:text-white/80">
                {label}
              </Link>
            ))}
          </div>

          <Link href="/academy"
            className="flex items-center gap-1.5 rounded-[10px] bg-amber-500 px-4 py-[7px] font-sans text-xs font-semibold text-black transition-colors hover:bg-amber-400"
            style={{ boxShadow: '0 0 16px rgba(245,158,11,0.30)' }}>
            <Sparkles size={11} strokeWidth={2.5} />
            무료로 시작
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', height: '100vh', minHeight: 700, overflow: 'hidden' }}>

        {/* Spline — 풀스크린 백그라운드 */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <SplineScene />
        </div>

        {/* 우측 텍스트 영역 veil */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
          {/* 우측 패널 어둡게 */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to left, rgba(5,5,8,0.97) 30%, rgba(5,5,8,0.88) 50%, rgba(5,5,8,0.30) 72%, transparent 100%)',
          }} />
          {/* 상단 */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 96,
            background: 'linear-gradient(to bottom, rgba(5,5,8,0.70), transparent)' }} />
          {/* 하단 */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 160,
            background: 'linear-gradient(to top, rgba(5,5,8,1), transparent)' }} />
        </div>

        {/* Content — 우측, z-10 */}
        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', zIndex: 10 }}>
          <div className="mx-auto w-full max-w-7xl px-6">
            <div className="ml-auto flex max-w-[520px] flex-col gap-7">

              {/* eyebrow */}
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-[4px] border border-cyan-500/20 px-3 py-1"
                  style={{ background: 'rgba(6,182,212,0.06)' }}>
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 opacity-80"
                    style={{ boxShadow: '0 0 6px rgba(6,182,212,0.8)', animation: 'pulse-glow 2.5s ease-in-out infinite' }} />
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-cyan-400/90">
                    AI 실습 교육 플랫폼
                  </span>
                </span>
              </div>

              {/* headline */}
              <h1 className="font-display text-[clamp(2.6rem,5.5vw,4.5rem)] font-black leading-[1.06] tracking-[-0.02em]">
                <span className="block text-white">작은 질문이</span>
                <span className="block italic"
                  style={{
                    background: 'linear-gradient(120deg, #fcd34d 0%, #f59e0b 55%, #d97706 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                  거대한 변화를
                </span>
                <span className="block text-white">만듭니다</span>
              </h1>

              {/* body */}
              <p className="font-sans text-[15px] font-normal leading-[1.7] text-white/50">
                마케팅·영상·개발·자동화 4개 트랙.<br />
                실제 프롬프트 입력창과 결과 패널로 학습하고<br />
                결과물은 버전 단위로 저장됩니다.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/academy"
                  className="group flex items-center gap-2 rounded-[10px] bg-amber-500 px-6 py-3 font-sans text-[13px] font-semibold text-black transition-all hover:bg-amber-400"
                  style={{ boxShadow: '0 0 28px rgba(245,158,11,0.35)' }}>
                  무료로 시작하기
                  <ArrowRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link href="/lab/marketing/campaign-copy-studio"
                  className="flex items-center gap-2 rounded-[10px] border border-white/[0.10] bg-white/[0.04] px-6 py-3 font-sans text-[13px] font-medium text-white/60 transition-all hover:border-cyan-500/25 hover:bg-white/[0.07] hover:text-white">
                  샘플 수업 보기
                </Link>
              </div>

              {/* stats */}
              <div className="flex items-center gap-6 border-t border-white/[0.06] pt-5">
                {[
                  { v: '04', l: '실전 트랙' },
                  { v: '28+', l: '실습 모듈' },
                  { v: 'AI', l: '자동 검수' },
                ].map(({ v, l }) => (
                  <div key={l} className="flex flex-col gap-0.5">
                    <div className="font-mono text-[1.1rem] font-bold leading-none tracking-tight"
                      style={{
                        background: 'linear-gradient(135deg, #fcd34d, #f59e0b)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}>
                      {v}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/25">{l}</div>
                  </div>
                ))}
                <div className="ml-auto flex items-center gap-1.5 rounded-[4px] border border-white/[0.06] px-2.5 py-1"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <span className="font-mono text-[10px] text-white/20 tracking-wider">PWR BY</span>
                  <span className="font-mono text-[10px] font-semibold text-white/40 tracking-wide">GEMINI · GPT · CLAUDE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ zIndex: 10 }}>
          <div className="h-9 w-px bg-gradient-to-b from-white/20 to-transparent" />
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/15 uppercase">scroll</span>
        </div>
      </section>

      {/* ── Tracks ───────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 flex items-end justify-between gap-4">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-[4px] border border-amber-500/15 px-3 py-1"
              style={{ background: 'rgba(245,158,11,0.04)' }}>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-400/80">
                실전 세션
              </span>
            </div>
            <h2 className="font-display text-[2rem] font-black leading-tight text-white lg:text-[2.5rem]">
              어떤 결과물을 만들 건가요?
            </h2>
            <p className="mt-2 font-sans text-[14px] text-white/35">
              4개 트랙 중 하나를 선택해 실제 프롬프트와 결과물을 만들어보세요
            </p>
          </div>
          <Link href="/tracks"
            className="hidden shrink-0 items-center gap-1 font-sans text-sm text-white/25 transition-colors hover:text-white/60 sm:flex">
            전체 보기 <ChevronRight size={13} />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {TRACKS.map((t) => (
            <Link key={t.no} href={t.href}
              className="group relative flex flex-col overflow-hidden rounded-[14px] border border-white/[0.07] p-6 transition-all duration-150 hover:-translate-y-px"
              style={{ background: 'rgba(255,255,255,0.025)' }}
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
              {/* number + time */}
              <div className="mb-5 flex items-center justify-between">
                <span className="font-mono text-[11px] font-semibold tracking-[0.18em]" style={{ color: t.accent }}>
                  {t.no}
                </span>
                <span className="rounded-[4px] border px-2 py-[3px] font-mono text-[10px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: t.accent, borderColor: t.border, background: t.glow }}>
                  {t.time}
                </span>
              </div>

              <h3 className="mb-0.5 font-sans text-[1.1rem] font-bold leading-tight text-white">{t.label}</h3>
              <p className="mb-1 font-sans text-[11px] font-medium tracking-wide" style={{ color: t.accent }}>{t.sub}</p>
              <p className="mb-5 flex-1 font-sans text-[13px] leading-relaxed text-white/40">{t.desc}</p>

              {/* outputs */}
              <div className="mb-5 space-y-1.5 rounded-[8px] border border-white/[0.05] p-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
                {t.outputs.map((o) => (
                  <div key={o} className="flex items-center gap-2 font-sans text-[12px] text-white/45">
                    <span className="h-[3px] w-[3px] flex-shrink-0 rounded-full" style={{ background: t.accent }} />
                    {o}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] transition-all group-hover:gap-2.5"
                style={{ color: t.accent }}>
                트랙 시작
                <ArrowRight size={12} strokeWidth={2.5} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-[4px] border border-white/[0.08] px-3 py-1"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
              학습 흐름
            </span>
          </div>
          <h2 className="font-display text-[2rem] font-black text-white">한 번 해보면 바로 보입니다</h2>
        </div>

        <div className="relative grid gap-0 md:grid-cols-5">
          <div className="pointer-events-none absolute top-4 left-4 right-4 hidden h-px md:block"
            style={{ background: 'linear-gradient(90deg, rgba(245,158,11,0.25), rgba(245,158,11,0.08) 60%, transparent)' }} />

          {STEPS.map((s, i) => (
            <div key={s.n} className="relative flex flex-col gap-2.5 p-4">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-[6px] border border-amber-500/20 font-mono text-[10px] font-bold text-amber-400"
                style={{ background: 'rgba(245,158,11,0.06)' }}>
                {s.n}
              </div>
              <div className="font-sans text-[13px] font-semibold text-white">{s.label}</div>
              <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/30">{s.desc}</div>
              {i < 4 && (
                <div className="absolute top-4 -right-1.5 hidden text-white/15 md:block">
                  <ChevronRight size={11} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-[20px] border border-amber-500/[0.12] px-10 py-14 md:px-16"
          style={{ background: 'linear-gradient(120deg, rgba(245,158,11,0.06) 0%, rgba(5,5,8,0) 60%)' }}>
          <div className="pointer-events-none absolute -top-24 -left-12 h-72 w-72 rounded-full blur-[90px]"
            style={{ background: 'rgba(245,158,11,0.08)' }} />

          <div className="relative max-w-lg">
            <div className="mb-4 inline-flex items-center gap-2 rounded-[4px] border border-amber-500/20 px-3 py-1"
              style={{ background: 'rgba(245,158,11,0.05)' }}>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400"
                style={{ boxShadow: '0 0 6px rgba(245,158,11,0.7)', animation: 'pulse-glow 2.5s ease-in-out infinite' }} />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-400/90">
                지금 바로 시작하세요
              </span>
            </div>
            <h2 className="mb-4 font-display text-[2.25rem] font-black leading-tight text-white lg:text-[2.75rem]">
              첫 질문이<br />모든 것을 바꿉니다
            </h2>
            <p className="mb-8 font-sans text-[14px] text-white/40">
              무료로 시작, 결과물은 영원히 내 것.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/academy"
                className="flex items-center gap-2 rounded-[10px] bg-amber-500 px-7 py-3 font-sans text-[13px] font-semibold text-black transition-all hover:bg-amber-400"
                style={{ boxShadow: '0 0 28px rgba(245,158,11,0.30)' }}>
                <Sparkles size={13} strokeWidth={2.5} />
                무료로 시작하기
              </Link>
              <Link href="/tracks"
                className="flex items-center gap-2 rounded-[10px] border border-white/[0.09] bg-white/[0.04] px-6 py-3 font-sans text-[13px] font-medium text-white/50 transition-all hover:border-amber-500/20 hover:text-white/80">
                트랙 둘러보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.04] px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 font-sans text-[12px] text-white/15">
            <span className="text-base">🐝</span>
            beeliber academy
          </div>
          <span className="font-sans text-[12px] text-white/15">© 2026 Beeliber. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
