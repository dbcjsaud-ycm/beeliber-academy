import Link from 'next/link';
import { ArrowRight, Zap, Video, Code2, Bot, ChevronLeft } from 'lucide-react';

const TRACKS = [
  {
    icon: '📣',
    label: '마케팅',
    tagline: 'SNS · SEO · GEO 전략',
    desc: 'Super Gems 활용, GEO 전략, SNS-SEO 연결 워크플로우를 AI로 완성하세요.',
    color: 'from-emerald-900/20',
    border: 'border-emerald-500/15 hover:border-emerald-400/40',
    accent: 'text-emerald-400',
    glow: 'rgba(16,185,129,0.12)',
    Icon: Zap,
    iconBg: 'bg-emerald-500/15',
    btn: 'bg-emerald-600 hover:bg-emerald-500',
    outputs: [
      { emoji: '📋', text: '광고 제목 10개 + 설명 3개' },
      { emoji: '🔗', text: 'CTA 5개 + 해시태그 15개' },
      { emoji: '🖼️', text: '썸네일 문구 세트' },
    ],
    href: '/lab/marketing/campaign-copy-studio',
    time: '2–3시간',
    level: '초급–중급',
  },
  {
    icon: '🎬',
    label: '이미지 투 비디오',
    tagline: '기준이미지 → 첫프레임 → 영상',
    desc: '기준 이미지를 먼저 생성하고 첫 프레임으로 고정해 영상으로 만드는 파이프라인.',
    color: 'from-amber-900/20',
    border: 'border-amber-500/15 hover:border-amber-400/40',
    accent: 'text-amber-400',
    glow: 'rgba(245,158,11,0.12)',
    Icon: Video,
    iconBg: 'bg-amber-500/15',
    btn: 'bg-amber-600 hover:bg-amber-500',
    outputs: [
      { emoji: '🎨', text: '기준 이미지 프롬프트' },
      { emoji: '🎥', text: '장면별 영상 프롬프트' },
      { emoji: '📦', text: '자막 + 업로드 패키지' },
    ],
    href: '/tracks/image-to-video',
    time: '3–4시간',
    level: '중급',
  },
  {
    icon: '💻',
    label: '웹/앱 개발',
    tagline: '기획 → 구조 → 작업지시서',
    desc: '서비스 소개부터 화면 구조, 기능 목록, 개발 작업지시서까지 AI로 완성.',
    color: 'from-blue-900/20',
    border: 'border-blue-500/15 hover:border-blue-400/40',
    accent: 'text-blue-400',
    glow: 'rgba(59,130,246,0.12)',
    Icon: Code2,
    iconBg: 'bg-blue-500/15',
    btn: 'bg-blue-600 hover:bg-blue-500',
    outputs: [
      { emoji: '📄', text: '서비스 소개 + 화면 구조' },
      { emoji: '⚙️', text: '핵심 기능 목록' },
      { emoji: '📋', text: '개발 작업지시서' },
    ],
    href: '/tracks/web-app',
    time: '3–5시간',
    level: '중급–고급',
  },
  {
    icon: '🤖',
    label: '자동화',
    tagline: 'Tree of Thoughts · RAG · Self-Reflection',
    desc: '반복 업무를 AI 파이프라인으로 자동화하는 고급 프롬프팅 기법을 실습.',
    color: 'from-violet-900/20',
    border: 'border-violet-500/15 hover:border-violet-400/40',
    accent: 'text-violet-400',
    glow: 'rgba(139,92,246,0.12)',
    Icon: Bot,
    iconBg: 'bg-violet-500/15',
    btn: 'bg-violet-600 hover:bg-violet-500',
    outputs: [
      { emoji: '🔄', text: '반복업무 정의 + 입출력 구조' },
      { emoji: '📝', text: '단계별 요청문' },
      { emoji: '✅', text: '최종 출력 형식' },
    ],
    href: '/tracks/automation',
    time: '4–6시간',
    level: '중급–고급',
  },
];

export default function TracksPage() {
  return (
    <div className="min-h-screen academy-bg text-white">
      {/* Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/8 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-16">
        {/* Back */}
        <Link href="/" className="mb-10 inline-flex items-center gap-1.5 text-sm text-white/35 hover:text-white/70 transition-colors">
          <ChevronLeft size={14} />
          홈으로
        </Link>

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.15em] text-violet-400">실전 세션</p>
          <h1 className="text-4xl font-black text-white lg:text-5xl">
            어떤 결과물을 만들 건가요?
          </h1>
          <p className="mt-4 text-white/45">
            4개 트랙 중 하나를 선택해 실제 AI 프롬프트와 결과물을 만들어보세요
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {TRACKS.map((track) => {
            const Icon = track.Icon;
            return (
              <div
                key={track.label}
                className={`group relative flex flex-col rounded-2xl border bg-gradient-to-b p-7 transition-all duration-300 hover:-translate-y-1.5 ${track.color} ${track.border}`}
                style={{ boxShadow: `0 0 0 0 transparent` }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 40px ${track.glow}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '';
                }}
              >
                {/* Top */}
                <div className="mb-5 flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${track.iconBg}`}>
                    {track.icon}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`rounded-full bg-white/5 px-2.5 py-0.5 text-xs ${track.accent}`}>
                      {track.level}
                    </span>
                    <span className="text-xs text-white/30">⏱ {track.time}</span>
                  </div>
                </div>

                <h2 className="mb-1 text-xl font-bold text-white">{track.label}</h2>
                <p className={`mb-2 text-xs font-medium ${track.accent}`}>{track.tagline}</p>
                <p className="mb-5 flex-1 text-sm leading-relaxed text-white/50">{track.desc}</p>

                {/* Outputs */}
                <div className="mb-6 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 space-y-2">
                  <p className="mb-2 text-xs font-medium text-white/30">결과물</p>
                  {track.outputs.map((o) => (
                    <div key={o.text} className="flex items-center gap-2.5 text-sm text-white/60">
                      <span className="text-base">{o.emoji}</span>
                      {o.text}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={track.href}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all ${track.btn}`}
                >
                  {track.label} 트랙 시작
                  <ArrowRight size={15} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom hint */}
        <div className="mt-10 text-center">
          <p className="text-sm text-white/30">
            아직 방향을 모르겠다면?{' '}
            <Link href="/academy/level-check" className="text-violet-400 hover:text-violet-300 transition-colors">
              AI 레벨 체크 →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
