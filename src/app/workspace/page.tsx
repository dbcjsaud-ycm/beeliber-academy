import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { academyTracks } from '@/lib/academy-data';

const TRACK_META: Record<string, { accent: string; glow: string; border: string; icon: string }> = {
  marketing:        { accent: '#f59e0b', glow: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.22)', icon: '📣' },
  'image-to-video': { accent: '#06b6d4', glow: 'rgba(6,182,212,0.10)',  border: 'rgba(6,182,212,0.22)',  icon: '🎬' },
  'web-app':        { accent: '#7c3aed', glow: 'rgba(124,58,237,0.10)', border: 'rgba(124,58,237,0.22)', icon: '💻' },
  automation:       { accent: '#f59e0b', glow: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.22)', icon: '🤖' },
};

export default function WorkspacePage() {
  return (
    <div className="min-h-screen academy-bg text-white">
      {/* ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-amber-500/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-600/[0.04] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-14">
        {/* Header */}
        <div className="mb-16">
          <p className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-amber-400/70">
            <span className="h-px w-5 bg-amber-500/50" />
            AI 워크스페이스
          </p>
          <h1 className="font-fraunces text-4xl font-black text-white lg:text-5xl">
            실행하고, 저장하고,<br />버전으로 비교하세요
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/40">
            4개 트랙의 모든 수업은 실제 AI 프롬프트 실행 + 결과 저장 + 버전 관리까지 한 화면에서 완성됩니다
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/lab/marketing/campaign-copy-studio"
              className="flex items-center gap-2 rounded-[10px] bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-amber-400 transition-all active:scale-[0.98]"
            >
              샘플 수업 바로 열기
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/outputs"
              className="flex items-center gap-2 rounded-[10px] border border-white/[0.09] px-5 py-2.5 text-sm text-white/50 hover:border-white/20 hover:text-white/80 transition-all"
            >
              내 결과물 보기
            </Link>
          </div>
        </div>

        {/* Track cards */}
        <div className="grid gap-5 sm:grid-cols-2">
          {academyTracks.map((track) => {
            const meta = TRACK_META[track.slug] ?? TRACK_META.marketing;
            return (
              <div
                key={track.slug}
                className="flex flex-col rounded-[16px] border border-white/[0.07] bg-white/[0.02] p-6"
              >
                {/* header */}
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{meta.icon}</span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider" style={{ color: meta.accent }}>
                        {track.label}
                      </p>
                      <p className="text-sm font-bold text-white">{track.workspaceTitle}</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-white/[0.07] px-2 py-0.5 text-[11px] text-white/25">
                    {track.lessons.length}개 수업
                  </span>
                </div>

                <p className="mb-5 flex-1 text-xs leading-relaxed text-white/40">{track.workspaceSummary}</p>

                {/* outcomes */}
                <div className="mb-5 flex flex-wrap gap-1.5">
                  {track.outcomes.slice(0, 4).map((o) => (
                    <span
                      key={o}
                      className="rounded-full border px-2.5 py-0.5 text-[10px]"
                      style={{ color: meta.accent, borderColor: meta.border, background: meta.glow }}
                    >
                      {o}
                    </span>
                  ))}
                </div>

                {/* lessons preview */}
                <div className="mb-5 space-y-2">
                  {track.lessons.slice(0, 2).map((lesson, i) => (
                    <Link
                      key={lesson.slug}
                      href={`/lab/${track.slug}/${lesson.slug}`}
                      className="group flex items-center gap-3 rounded-[10px] border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 transition-all hover:border-white/10 hover:bg-white/[0.04]"
                    >
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-mono" style={{ background: meta.glow, color: meta.accent }}>
                        {i + 1}
                      </span>
                      <span className="flex-1 truncate text-xs text-white/60 group-hover:text-white/80 transition-colors">
                        {lesson.title}
                      </span>
                      <BookOpen size={11} className="text-white/20 flex-shrink-0" />
                    </Link>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={`/lab/${track.slug}/${track.lessons[0].slug}`}
                  className="flex items-center justify-center gap-2 rounded-[10px] py-2.5 text-sm font-semibold text-black transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: meta.accent }}
                >
                  첫 실습 열기
                  <ArrowRight size={13} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
