interface QualityCheckCardProps {
  checks: string[];
  outputFormat: string[];
}

export function QualityCheckCard({ checks, outputFormat }: QualityCheckCardProps) {
  return (
    <div className="rounded-[12px] border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.16em] text-white/30">결과 체크리스트</p>
      <ul className="mb-4 space-y-2">
        {checks.map((check) => (
          <li key={check} className="flex items-start gap-2.5 text-xs text-white/50">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-amber-500/50" />
            {check}
          </li>
        ))}
      </ul>

      {outputFormat.length > 0 && (
        <>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-white/20">출력 형식</p>
          <ul className="space-y-1.5">
            {outputFormat.map((fmt) => (
              <li key={fmt} className="text-[11px] text-white/35">
                · {fmt}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
