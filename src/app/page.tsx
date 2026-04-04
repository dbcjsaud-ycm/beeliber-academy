'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Sparkles, Play, ChevronRight, Zap, Brain, Video, Code2, Bot, ArrowRight } from 'lucide-react';

const AIRobotScene = dynamic(() => import('@/components/landing/AIRobotScene'), { ssr: false });

/* ── Track data ─────────────────────────────────────────────── */
const TRACKS = [
  {
    icon: '📣',
    emoji: '📣',
    label: '마케팅',
    color: 'from-emerald-500/10 to-transparent',
    border: 'border-emerald-500/20 hover:border-emerald-400/50',
    accent: 'text-emerald-400',
    tag: 'bg-emerald-500/15 text-emerald-400',
    Icon: Zap,
    desc: 'Super Gems 활용, GEO 전략, SNS-SEO 연결 워크플로우',
    outputs: ['제목 10개 + 설명 3개', 'CTA 5개 + 해시태그 15개', '썸네일 문구 세트'],
    href: '/tracks/marketing',
  },
  {
    icon: '🎬',
    label: '이미지 투 비디오',
    color: 'from-amber-500/10 to-transparent',
    border: 'border-amber-500/20 hover:border-amber-400/50',
    accent: 'text-amber-400',
    tag: 'bg-amber-500/15 text-amber-400',
    Icon: Video,
    desc: '기준 이미지 먼저 생성 → 첫 프레임 고정 → 영상화 파이프라인',
    outputs: ['기준 이미지 프롬프트', '장면별 영상 프롬프트', '자막 + 업로드 패키지'],
    href: '/tracks/image-to-video',
  },
  {
    icon: '💻',
    label: '웹/앱 개발',
    color: 'from-blue-500/10 to-transparent',
    border: 'border-blue-500/20 hover:border-blue-400/50',
    accent: 'text-blue-400',
    tag: 'bg-blue-500/15 text-blue-400',
    Icon: Code2,
    desc: '화면 구조, 기능 목록, 개발 작업지시서까지 AI로 완성',
    outputs: ['서비스 소개 + 화면 구조', '핵심 기능 목록', '개발 작업지시서'],
    href: '/tracks/web-app',
  },
  {
    icon: '🤖',
    label: '자동화',
    color: 'from-amber-500/10 to-transparent',
    border: 'border-amber-500/20 hover:border-amber-400/50',
    accent: 'text-amber-400',
    tag: 'bg-amber-500/15 text-amber-400',
    Icon: Bot,
    desc: 'Tree of Thoughts, Self-Reflection, Meta-Prompting 실전 기법',
    outputs: ['반복업무 정의 + 입출력 구조', '단계별 요청문', '최종 출력 형식'],
    href: '/tracks/automation',
  },
];

const STATS = [
  { value: '4', label: '실전 트랙' },
  { value: '28+', label: '실습 모듈' },
  { value: 'AI', label: '자동 검수' },
];

/* ── Floating badge ─────────────────────────────────────────── */
function Badge3D({ text, className }: { text: string; className: string }) {
  return (
    <div className={`absolute glass-panel rounded-xl px-3 py-2 text-xs font-medium text-white/70 animate-float ${className}`}>
      {text}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="min-h-screen academy-bg text-white overflow-x-hidden">

      {/* ── Navigation ─────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-panel-light border-b border-white/[0.06]">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 text-base font-bold">
            <span className="text-xl">🐝</span>
            <span className="text-white">beeliber</span>
            <span className="text-white/30 font-normal">academy</span>
          </Link>

          <div className="hidden items-center gap-6 text-sm md:flex">
            {[
              { label: '실전 세션', href: '/tracks' },
              { label: '실습 랩', href: '/lab/marketing/campaign-copy-studio' },
              { label: '워크스페이스', href: '/spaces/new' },
              { label: '대시보드', href: '/academy' },
            ].map(({ label, href }) => (
              <Link key={href} href={href} className="text-white/50 hover:text-white transition-colors">
                {label}
              </Link>
            ))}
          </div>

          <Link
            href="/academy"
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 transition-colors glow-amber-sm"
          >
            <Sparkles size={13} />
            시작하기
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center pt-14">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full bg-violet-600/8 blur-[120px]" />
          <div className="absolute top-20 right-0 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-amber-500/5 blur-[80px]" />
          <div className="dot-grid absolute inset-0 opacity-40" />
        </div>

        <div className="relative mx-auto flex max-w-7xl items-center gap-8 px-6 py-20 lg:gap-0">

          {/* Left: Copy */}
          <div className="flex-1 space-y-8">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              AI 실습 교육 플랫폼
            </div>

            {/* Headline */}
            <h1 className="font-fraunces text-5xl font-black leading-[1.1] tracking-tight lg:text-6xl xl:text-7xl">
              <span className="block text-white">작은 질문이</span>
              <span className="block text-gradient-amber">거대한 변화를</span>
              <span className="block text-white">만듭니다</span>
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-white/55">
              마케팅·영상·개발·자동화 4개 트랙.
              실제 프롬프트 입력창과 결과 패널로 학습하고
              결과물은 버전 단위로 저장됩니다.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/academy"
                className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-base font-semibold text-black hover:bg-amber-400 transition-all hover:scale-[1.02] glow-amber"
              >
                <Brain size={18} />
                무료로 시작하기
              </Link>
              <Link
                href="/lab/marketing/campaign-copy-studio"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-base font-semibold text-white/80 hover:bg-white/[0.09] hover:border-amber-500/25 hover:text-white transition-all"
              >
                <Play size={16} className="text-amber-400" />
                샘플 수업 보기
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 pt-2">
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold text-gradient-amber">{value}</div>
                  <div className="text-xs text-white/40">{label}</div>
                </div>
              ))}
              <div className="h-8 w-px bg-white/10" />
              <p className="text-xs text-white/30 max-w-[120px] leading-relaxed">
                Gemini · GPT · Claude 기반 실습
              </p>
            </div>
          </div>

          {/* Right: 3D Robot */}
          <div className="relative hidden lg:flex w-[520px] flex-shrink-0 items-center justify-center xl:w-[580px]">
            {/* Glow behind robot */}
            <div className="absolute inset-0 rounded-full bg-violet-600/12 blur-[80px]" />

            {/* Floating info badges */}
            <Badge3D text="🧠 Neural Network"  className="top-8 left-0" />
            <Badge3D text="⚡ Flux 2 Pro"       className="bottom-12 left-4" style={{ animationDelay: '1s' } as React.CSSProperties} />
            <Badge3D text="🎨 Inpainting"       className="top-16 right-0" style={{ animationDelay: '0.5s' } as React.CSSProperties} />
            <Badge3D text="📊 크레딧 · 500"    className="bottom-8 right-4" style={{ animationDelay: '1.5s' } as React.CSSProperties} />

            <div className="h-[520px] w-full xl:h-[560px]">
              <AIRobotScene />
            </div>

            {/* Scan line effect */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl opacity-10">
              <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-violet-400 to-transparent" style={{ animation: 'scan-line 4s linear infinite' }} />
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/20 text-xs">
          <span>스크롤</span>
          <div className="h-6 w-px bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* ── Tracks ─────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.15em] text-amber-400">실전 세션</p>
          <h2 className="text-3xl font-bold text-white lg:text-4xl">
            어떤 결과물을 만들 건가요?
          </h2>
          <p className="mt-3 text-white/45">
            4개 트랙 중 하나를 선택해 실제 프롬프트와 결과물을 만들어보세요
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {TRACKS.map((track) => {
            const Icon = track.Icon;
            return (
              <Link
                key={track.label}
                href={track.href}
                className={`group relative flex flex-col rounded-2xl border bg-gradient-to-b p-6 transition-all duration-300 hover:-translate-y-1 ${track.color} ${track.border}`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-3xl">{track.icon}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${track.tag}`}>
                    <Icon size={10} className="inline mr-1" />
                    트랙
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-bold text-white">{track.label}</h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-white/50">{track.desc}</p>

                <ul className="mb-5 space-y-1.5">
                  {track.outputs.map((o) => (
                    <li key={o} className="flex items-start gap-2 text-xs text-white/55">
                      <span className={`mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${track.accent.replace('text-', 'bg-')}`} />
                      {o}
                    </li>
                  ))}
                </ul>

                <div className={`flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2 ${track.accent}`}>
                  트랙 시작
                  <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-10 text-center">
          <h2 className="mb-3 text-2xl font-bold text-white lg:text-3xl">
            학습은 이렇게 진행됩니다
          </h2>
          <p className="mb-10 text-sm text-white/40">교수 설명 → 프롬프트 입력 → 결과 확인 → 수정 → 저장</p>

          <div className="grid gap-6 sm:grid-cols-3 md:grid-cols-5">
            {[
              { step: '01', icon: '📖', label: '교수 설명', desc: '핵심 개념과 따라하기 순서' },
              { step: '02', icon: '✍️', label: '프롬프트 입력', desc: '예시 칩 클릭 or 직접 작성' },
              { step: '03', icon: '⚡', label: 'AI 실행', desc: 'Gemini · GPT · Claude 기반' },
              { step: '04', icon: '🔍', label: '자동 검수', desc: '품질·정책·목적 자동 체크' },
              { step: '05', icon: '💾', label: '결과 저장', desc: '버전 단위 Supabase 저장' },
            ].map(({ step, icon, label, desc }, i) => (
              <div key={step} className="flex flex-col items-center gap-2 text-center">
                {i > 0 && (
                  <div className="absolute hidden -left-3 top-5 text-white/15 md:block">
                    <ChevronRight size={14} />
                  </div>
                )}
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl glass-panel text-2xl">
                  {icon}
                  <span className="absolute -top-1.5 -right-1.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-black">
                    {step}
                  </span>
                </div>
                <div className="font-semibold text-sm text-white">{label}</div>
                <div className="text-xs text-white/35 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-900/10 via-transparent to-cyan-900/10 p-12 text-center">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 h-[300px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[80px]" />
          </div>
          <div className="relative">
            <p className="mb-2 text-sm font-medium text-amber-400">지금 바로 시작하세요</p>
            <h2 className="mb-4 text-3xl font-black text-white lg:text-4xl">
              첫 질문이 모든 것을 바꿉니다
            </h2>
            <p className="mb-8 text-white/50">무료로 시작, 결과물은 영원히 내 것</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/academy"
                className="flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-3.5 text-base font-bold text-black hover:bg-amber-400 transition-all hover:scale-[1.02] glow-amber"
              >
                <Sparkles size={16} />
                무료로 시작하기
              </Link>
              <Link
                href="/academy/workflow-canvas"
                className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-base font-semibold text-white/80 hover:bg-white/10 transition"
              >
                워크플로우 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-xs text-white/25">
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
