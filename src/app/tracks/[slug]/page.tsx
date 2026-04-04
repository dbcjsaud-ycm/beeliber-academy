import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, BookOpen, Clock, BarChart2 } from 'lucide-react';
import { academyTracks } from '@/lib/academy-data';

const TRACK_META: Record<string, { accent: string; glow: string; border: string; icon: string }> = {
  marketing: {
    accent: '#f59e0b',
    glow: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.25)',
    icon: '📣',
  },
  'image-to-video': {
    accent: '#06b6d4',
    glow: 'rgba(6,182,212,0.10)',
    border: 'rgba(6,182,212,0.22)',
    icon: '🎬',
  },
  'web-app': {
    accent: '#7c3aed',
    glow: 'rgba(124,58,237,0.10)',
    border: 'rgba(124,58,237,0.22)',
    icon: '💻',
  },
  automation: {
    accent: '#f59e0b',
    glow: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.25)',
    icon: '🤖',
  },
};

const TRACK_TIME: Record<string, string> = {
  marketing: '2–3시간',
  'image-to-video': '3–4시간',
  'web-app': '3–5시간',
  automation: '4–6시간',
};

const TRACK_LEVEL: Record<string, string> = {
  marketing: '초급–중급',
  'image-to-video': '중급',
  'web-app': '중급–고급',
  automation: '중급–고급',
};

export default async function TrackHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const track = academyTracks.find((t) => t.slug === slug);
  if (!track) notFound();

  const meta = TRACK_META[slug] ?? {
    accent: '#f59e0b',
    glow: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.25)',
    icon: '📚',
  };
  const time = TRACK_TIME[slug] ?? '2–4시간';
  const level = TRACK_LEVEL[slug] ?? '초급';

  return (
    <div className="min-h-screen academy-bg text-white">
      {/* ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
          style={{ background: meta.glow.replace('0.12', '0.06') }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 pb-24 pt-16">
        {/* Back */}
        <Link
          href="/tracks"
          className="mb-10 inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          <ChevronLeft size={13} />
          트랙 목록
        </Link>

        {/* Header */}
        <div className="mb-14">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-3xl">{meta.icon}</span>
            <p
              className="text-xs font-medium uppercase tracking-[0.18em]"
              style={{ color: meta.accent }}
            >
              {track.label} 트랙
            </p>
          </div>
          <h1 className="font-fraunces text-4xl font-black text-white lg:text-5xl">
            {track.workspaceTitle}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/45">
            {track.workspaceSummary}
          </p>

          {/* badges */}
          <div className="mt-6 flex flex-wrap gap-3">
            <span
              className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
              style={{ color: meta.accent, borderColor: meta.border, background: meta.glow }}
            >
              <BarChart2 size={11} />
              {level}
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-white/[0.08] px-3 py-1 text-xs text-white/40">
              <Clock size={11} />
              {time}
            </span>
          </div>
        </div>

        {/* Outcomes */}
        <div
          className="mb-10 rounded-[14px] border p-6"
          style={{ borderColor: meta.border, background: meta.glow }}
        >
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-white/30">
            이 트랙에서 만드는 결과물
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {track.outcomes.map((outcome) => (
              <div key={outcome} className="flex items-center gap-2.5 text-sm text-white/70">
                <span
                  className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                  style={{ background: meta.accent }}
                />
                {outcome}
              </div>
            ))}
          </div>
        </div>

        {/* Lessons */}
        <div className="mb-10">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-white/25">
            수업 목록 — {track.lessons.length}개
          </p>
          <div className="space-y-3">
            {track.lessons.map((lesson, idx) => (
              <Link
                key={lesson.slug}
                href={`/lab/${track.slug}/${lesson.slug}`}
                className="group flex items-start gap-4 rounded-[14px] border border-white/[0.07] bg-white/[0.02] p-5 transition-all duration-200 hover:-translate-y-0.5"
                onMouseEnter={undefined}
                style={{ '--hover-border': meta.border } as React.CSSProperties}
              >
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[8px] text-xs font-bold"
                  style={{ background: meta.glow, color: meta.accent, border: `1px solid ${meta.border}` }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white text-sm">{lesson.title}</p>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{ background: meta.glow, color: meta.accent }}
                    >
                      {lesson.level}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-white/40 line-clamp-2">
                    {lesson.summary}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {lesson.outcomes.slice(0, 3).map((o) => (
                      <span key={o} className="rounded-full border border-white/[0.06] px-2 py-0.5 text-[10px] text-white/30">
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
                <BookOpen size={14} className="flex-shrink-0 text-white/20 group-hover:text-white/40 transition-colors mt-1" />
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href={`/lab/${track.slug}/${track.lessons[0].slug}`}
            className="flex items-center justify-center gap-2 rounded-[12px] px-8 py-3 text-sm font-bold text-black transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: meta.accent }}
          >
            첫 번째 수업 시작
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/tracks"
            className="text-sm text-white/30 hover:text-white/60 transition-colors"
          >
            다른 트랙 보기
          </Link>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return [
    { slug: 'marketing' },
    { slug: 'image-to-video' },
    { slug: 'web-app' },
    { slug: 'automation' },
  ];
}
