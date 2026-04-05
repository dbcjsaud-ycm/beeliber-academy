'use client';

const RETRY_ACTIONS = [
  '더 짧게',
  '더 쉽게',
  '순서대로',
  '초보자용으로',
  '표로 정리',
  '핵심만 다시',
];

interface RetryActionBarProps {
  onAction: (action: string) => void;
  disabled?: boolean;
}

export function RetryActionBar({ onAction, disabled = false }: RetryActionBarProps) {
  return (
    <div className="sticky bottom-0 z-10 border-t border-white/[0.10] bg-[#1a1825]/85 px-4 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <p className="flex-shrink-0 text-[10px] font-medium uppercase tracking-wider text-white/40">
          다시 시키기
        </p>
        <div className="flex flex-wrap gap-2">
          {RETRY_ACTIONS.map((action) => (
            <button
              key={action}
              onClick={() => onAction(action)}
              disabled={disabled}
              className="rounded-full border border-white/[0.14] bg-white/[0.05] px-3 py-1.5 text-[11px] text-white/60 transition-colors hover:border-amber-500/40 hover:bg-amber-500/[0.08] hover:text-white/85 disabled:pointer-events-none disabled:opacity-30"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
