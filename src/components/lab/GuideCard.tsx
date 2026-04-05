import type { ReactNode } from 'react';

interface GuideCardProps {
  title: string;
  children: ReactNode;
  accent?: boolean;
}

export function GuideCard({ title, children, accent = false }: GuideCardProps) {
  return (
    <div
      className={`rounded-[12px] border p-4 ${
        accent
          ? 'border-amber-500/[0.18] bg-amber-500/[0.04]'
          : 'border-white/[0.06] bg-white/[0.02]'
      }`}
    >
      <p
        className={`mb-3 text-[10px] font-medium uppercase tracking-[0.16em] ${
          accent ? 'text-amber-400/70' : 'text-white/30'
        }`}
      >
        {title}
      </p>
      {children}
    </div>
  );
}
