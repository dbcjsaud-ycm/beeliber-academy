'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { AcademyLesson } from '@/lib/academy-data';
import { GuideCard } from './GuideCard';

interface GuideRailProps {
  lesson: AcademyLesson;
  onChipClick: (chip: string) => void;
}

export function GuideRail({ lesson, onChipClick }: GuideRailProps) {
  const [open, setOpen] = useState(false);

  const inner = (
    <div className="space-y-4">
      {/* Goal */}
      <GuideCard title="오늘의 결과물" accent>
        <ul className="space-y-1.5">
          {lesson.outcomes.map((o) => (
            <li key={o} className="flex items-start gap-2 text-xs text-white/65">
              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-amber-500/60" />
              {o}
            </li>
          ))}
        </ul>
      </GuideCard>

      {/* Professor note */}
      <GuideCard title="교수 가이드">
        <p className="text-xs leading-relaxed text-white/55">{lesson.professorNote}</p>
      </GuideCard>

      {/* Mistakes */}
      <GuideCard title="실수 방지">
        <ul className="space-y-1.5">
          {lesson.risks.map((r) => (
            <li key={r} className="flex items-start gap-2 text-xs text-white/50">
              <span className="mt-0.5 text-[10px] text-amber-400/50">!</span>
              {r}
            </li>
          ))}
        </ul>
      </GuideCard>

      {/* Quick actions */}
      <GuideCard title="프롬프트 칩">
        <div className="flex flex-wrap gap-1.5">
          {lesson.quickActions.map((action) => (
            <button
              key={action}
              onClick={() => onChipClick(action)}
              className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/45 transition-colors hover:border-amber-500/30 hover:bg-amber-500/[0.06] hover:text-white/80"
            >
              {action}
            </button>
          ))}
        </div>
      </GuideCard>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-[220px] flex-shrink-0 lg:block">
        {inner}
      </aside>

      {/* Mobile accordion */}
      <div className="lg:hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-[10px] border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-white/60"
        >
          수업 가이드 보기
          <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && <div className="mt-3 space-y-3">{inner}</div>}
      </div>
    </>
  );
}
