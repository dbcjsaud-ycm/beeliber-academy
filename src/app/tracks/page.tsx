'use client';

import Link from 'next/link';
import { ArrowRight, ChevronLeft } from 'lucide-react';

const TRACKS = [
  {
    no: '01',
    icon: '📣',
    label: '마케팅',
    tagline: 'SNS · SEO · GEO 전략',
    desc: 'Super Gems 활용, GEO 전략, SNS-SEO 연결 워크플로우를 AI로 완성하세요.',
    outputs: [
      { text: '광고 제목 10개 + 설명 3개' },
      { text: 'CTA 5개 + 해시태그 15개' },
      { text: '썸네일 문구 세트' },
    ],
    href: '/lab/marketing/campaign-copy-studio',
    time: '2–3시간',
    level: '초급–중급',
    accent: '#f59e0b',
    glow: 'rgba(245,158,11,0.14)',
    border: 'rgba(245,158,11,0.25)',
  },
  {
    no: '02',
    icon: '🎬',
    label: '이미지 투 비디오',
    tagline: '기준이미지 → 첫프레임 → 영상',
    desc: '기준 이미지를 먼저 생성하고 첫 프레임으로 고정해 영상으로 만드는 파이프라인.',
    outputs: [
      { text: '기준 이미지 프롬프트' },
      { text: '장면별 영상 프롬프트' },
      { text: '자막 + 업로드 패키지' },
    ],
    href: '/tracks/image-to-video',
    time: '3–4시간',
    level: '중급',
    accent: '#06b6d4',
    glow: 'rgba(6,182,212,0.12)',
    border: 'rgba(6,182,212,0.22)',
  },
  {
    no: '03',
    icon: '💻',
    label: '웹/앱 개발',
    tagline: '기획 → 구조 → 작업지시서',
    desc: '서비스 소개부터 화면 구조, 기능 목록, 개발 작업지시서까지 AI로 완성.',
    outputs: [
      { text: '서비스 소개 + 화면 구조' },
      { text: '핵심 기능 목록' },
      { text: '개발 작업지시서' },
    ],
    href: '/tracks/web-app',
    time: '3–5시간',
    level: '중급–고급',
    accent: '#7c3aed',
    glow: 'rgba(124,58,237,0.12)',
    border: 'rgba(124,58,237,0.22)',
  },
  {
    no: '04',
    icon: '🤖',
    label: '자동화',
    tagline: 'Tree of Thoughts · RAG · Self-Reflection',
    desc: '반복 업무를 AI 파이프라인으로 자동화하는 고급 프롬프팅 기법을 실습.',
    outputs: [
      { text: '반복업무 정의 + 입출력 구조' },
      { text: '단계별 요청문' },
      { text: '최종 출력 형식' },
    ],
    href: '/tracks/automation',
    time: '4–6시간',
    level: '중급–고급',
    accent: '#f59e0b',
    glow: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.22)',
  },
];

export default function TracksPage() {
  return (
    <div className="min-h-screen academy-bg text-white">
      {/* ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-amber-500/[0.05] blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-600/[0.05] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-16">
        {/* Back */}
        <Link href="/" className="mb-12 inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
          <ChevronLeft size={13} />
          홈으로
        </Link>

        {/* Header */}
        <div className="mb-16">
          <p className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-amber-400/70">
            <span className="h-px w-5 bg-amber-500/50" />
            실전 세션
          </p>
          <h1 className="font-fraunces text-4xl font-black text-white lg:text-5xl">
            어떤 결과물을<br />만들 건가요?
          </h1>
          <p className="mt-4 max-w-md text-white/40">
            4개 트랙 중 하나를 선택해 실제 AI 프롬프트와 결과물을 만들어보세요
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {TRACKS.map((t) => (
            <div
              key={t.no}
              className="group relative flex flex-col overflow-hidden rounded-[14px] border border-white/[0.07] bg-white/[0.02] p-7 transition-all duration-200 hover:-translate-y-0.5"
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = t.border;
                el.style.boxShadow = `0 8px 40px ${t.glow}`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(255,255,255,0.07)';
                el.style.boxShadow = '';
              }}
            >
              {/* header */}
              <div className="mb-6 flex items-start justify-between gap-3">
                <span className="font-mono text-xs font-medium tracking-widest" style={{ color: t.accent }}>
                  {t.no}
                </span>
                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                    style={{ color: t.accent, borderColor: t.border, background: t.glow }}
                  >
                    {t.level}
                  </span>
                  <span className="text-[11px] text-white/25">⏱ {t.time}</span>
                </div>
              </div>

              <h2 className="mb-1 text-xl font-bold text-white">{t.label}</h2>
              <p className="mb-1 text-xs font-medium" style={{ color: t.accent }}>{t.tagline}</p>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-white/45">{t.desc}</p>

              {/* outputs */}
              <div className="mb-6 space-y-2 rounded-[10px] border border-white/[0.05] bg-white/[0.025] p-4">
                <p className="mb-2 text-[11px] font-medium text-white/25 uppercase tracking-wider">결과물</p>
                {t.outputs.map((o) => (
                  <div key={o.text} className="flex items-center gap-2.5 text-xs text-white/50">
                    <span className="h-1 w-1 flex-shrink-0 rounded-full" style={{ background: t.accent }} />
                    {o.text}
                  </div>
                ))}
              </div>

              {/* CTA — always amber per DESIGN.md (violet is secondary only) */}
              <Link
                href={t.href}
                className="flex items-center justify-center gap-2 rounded-[10px] py-2.5 text-sm font-semibold text-black transition-all hover:bg-amber-400 active:scale-[0.98]"
                style={{ background: '#f59e0b' }}
              >
                {t.label} 트랙 시작
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        {/* bottom hint */}
        <div className="mt-12 flex items-center gap-3 text-sm text-white/25">
          <span className="h-px flex-1 bg-white/[0.05]" />
          <span>아직 방향을 모르겠다면?</span>
          <Link href="/academy/level-check" className="text-amber-400 hover:text-amber-300 transition-colors">
            AI 레벨 체크 →
          </Link>
          <span className="h-px flex-1 bg-white/[0.05]" />
        </div>
      </div>
    </div>
  );
}
