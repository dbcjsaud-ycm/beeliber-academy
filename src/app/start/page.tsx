import Link from 'next/link';
import { ArrowRight, ChevronLeft } from 'lucide-react';

const STEPS = [
  {
    no: 1,
    title: 'AI에게 첫 질문',
    desc: '처음이라 어색해도 괜찮습니다. 한 줄만 써보세요.',
    href: '/learn/page-1',
    time: '5분',
  },
  {
    no: 2,
    title: '다시 시키는 법',
    desc: '더 짧게, 표로, 쉽게 — 결과를 내 방식으로 바꾸기.',
    href: '/learn/page-2',
    time: '10분',
  },
  {
    no: 3,
    title: '긴 글 정리하기',
    desc: '뉴스, 공지, 회의록 — AI로 핵심만 뽑아냅니다.',
    href: '/learn/page-3',
    time: '10분',
  },
  {
    no: 4,
    title: '파일 내용 질문',
    desc: '문서를 붙여넣고 AI에게 맞춤형 답변 받기.',
    href: '/learn/page-4',
    time: '10분',
  },
];

export default function StartPage() {
  return (
    <div className="min-h-screen academy-bg text-white">
      {/* ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-amber-500/[0.05] blur-[120px]" />
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
        <div className="mb-14">
          <p className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-amber-400/70">
            <span className="h-px w-5 bg-amber-500/50" />
            입문 과정
          </p>
          <h1 className="mb-4 font-fraunces text-4xl font-black text-white">
            AI, 지금 바로<br />시작해 봐요
          </h1>
          <p className="text-sm leading-relaxed text-white/40">
            총 4단계 · 약 35분 · 설치 없음<br />
            지금 궁금한 것을 그대로 입력하면 됩니다.
          </p>
        </div>

        {/* Steps */}
        <div className="mb-12 space-y-3">
          {STEPS.map((step) => (
            <Link
              key={step.no}
              href={step.href}
              className="group flex items-center gap-5 rounded-[14px] border border-white/[0.07] bg-white/[0.02] px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-amber-500/25 hover:bg-white/[0.04]"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/[0.08] font-mono text-sm font-medium text-white/30 transition-colors group-hover:border-amber-500/30 group-hover:text-amber-400/70">
                {step.no}
              </span>
              <div className="min-w-0 flex-1">
                <p className="mb-0.5 text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                  {step.title}
                </p>
                <p className="truncate text-xs text-white/35">{step.desc}</p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-3">
                <span className="text-[11px] text-white/20">⏱ {step.time}</span>
                <ArrowRight size={13} className="text-white/20 transition-colors group-hover:text-amber-400/60" />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA — start from step 1 */}
        <Link
          href="/learn/page-1"
          className="mb-10 flex w-full items-center justify-center gap-2 rounded-[12px] bg-amber-500 py-3.5 text-sm font-semibold text-black transition-all hover:bg-amber-400 active:scale-[0.98]"
        >
          레슨 1부터 시작하기
          <ArrowRight size={15} />
        </Link>

        {/* Level check hint */}
        <div className="flex items-center gap-3 text-sm text-white/25">
          <span className="h-px flex-1 bg-white/[0.05]" />
          <span>수준을 먼저 확인하고 싶다면?</span>
          <Link href="/academy/level-check" className="text-amber-400 hover:text-amber-300 transition-colors">
            AI 레벨 체크 →
          </Link>
          <span className="h-px flex-1 bg-white/[0.05]" />
        </div>
      </div>
    </div>
  );
}
