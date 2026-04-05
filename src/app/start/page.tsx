import Link from 'next/link';
import { ArrowRight, ChevronLeft } from 'lucide-react';

const STEPS = [
  {
    no: 1,
    title: 'AI에게 첫 질문',
    desc: '한 줄 질문 → 결과 확인 → 다시 요청',
    href: '/learn/page-1',
    time: '5분',
    badge: '따라치기',
    badgeColor: '#34d399',
    icon: '⌨️',
  },
  {
    no: 2,
    title: '다시 시키는 법',
    desc: '수식어 붙여서 결과 바꾸기',
    href: '/learn/page-2',
    time: '10분',
    badge: '수식어 연습',
    badgeColor: '#f59e0b',
    icon: '🔧',
  },
  {
    no: 3,
    title: '긴 글 정리하기',
    desc: '붙여넣기 → 요약 → 쉬운 설명',
    href: '/learn/page-3',
    time: '10분',
    badge: '조립 연습',
    badgeColor: '#06b6d4',
    icon: '📄',
  },
  {
    no: 4,
    title: '파일 내용 질문',
    desc: '내 문서 넣고 맞춤형 답변 받기',
    href: '/learn/page-4',
    time: '10분',
    badge: '자유 연습',
    badgeColor: '#a78bfa',
    icon: '🗂️',
  },
];

export default function StartPage() {
  return (
    <div className="min-h-screen academy-bg text-white">
      {/* ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-emerald-500/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] translate-y-1/2 rounded-full bg-amber-500/[0.03] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-xl px-6 pb-24 pt-16">
        {/* Back */}
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          <ChevronLeft size={13} />
          홈으로
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-medium text-emerald-400">초초급 과정 · 총 4단계</span>
          </div>
          <h1 className="mb-4 font-fraunces text-4xl font-black text-white">
            AI 타자 연습
          </h1>
          <p className="text-sm leading-relaxed text-white/40">
            한컴 타자 연습처럼 단계별로 익혀요.<br />
            따라치기 → 빈칸 채우기 → 자유 작성 순으로 진행됩니다.
          </p>
        </div>

        {/* 연습 방식 설명 */}
        <div
          className="mb-8 rounded-[14px] p-4"
          style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
        >
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/25">각 레슨 구성</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { step: '1단계', name: '따라치기', desc: '모델 프롬프트 그대로', color: '#34d399' },
              { step: '2단계', name: '빈칸 채우기', desc: '틀에서 내 것으로', color: '#f59e0b' },
              { step: '3단계', name: '자유 작성', desc: '내 말로 완성', color: '#a78bfa' },
            ].map((s) => (
              <div key={s.step} className="rounded-[10px] p-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <p className="mb-1 text-[9px] text-white/25">{s.step}</p>
                <p className="mb-1 text-xs font-semibold" style={{ color: s.color }}>{s.name}</p>
                <p className="text-[10px] text-white/35">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="mb-8 space-y-2.5">
          {STEPS.map((step, idx) => (
            <Link
              key={step.no}
              href={step.href}
              className="group flex items-center gap-4 rounded-[14px] border border-white/[0.07] bg-white/[0.02] px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-white/[0.04]"
            >
              {/* Step number */}
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/[0.08] font-mono text-sm font-medium text-white/30 transition-colors group-hover:border-white/20 group-hover:text-white/60">
                {step.no}
              </span>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                    {step.title}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[9px] font-medium"
                    style={{ background: `${step.badgeColor}15`, color: step.badgeColor, border: `1px solid ${step.badgeColor}30` }}
                  >
                    {step.badge}
                  </span>
                </div>
                <p className="truncate text-xs text-white/35">{step.desc}</p>
              </div>

              <div className="flex flex-shrink-0 items-center gap-3">
                <span className="text-[11px] text-white/20">⏱ {step.time}</span>
                <ArrowRight size={13} className="text-white/20 transition-colors group-hover:text-white/50" />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/learn/page-1"
          className="mb-8 flex w-full items-center justify-center gap-2 rounded-[12px] py-3.5 text-sm font-semibold text-black transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: '#34d399' }}
        >
          레슨 1 시작하기 — 따라치기
          <ArrowRight size={15} />
        </Link>

        {/* Level check hint */}
        <div className="flex items-center gap-3 text-sm text-white/25">
          <span className="h-px flex-1 bg-white/[0.05]" />
          <span className="text-xs">수준을 먼저 확인하고 싶다면?</span>
          <Link href="/level-test" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
            레벨 테스트 →
          </Link>
          <span className="h-px flex-1 bg-white/[0.05]" />
        </div>
      </div>
    </div>
  );
}
