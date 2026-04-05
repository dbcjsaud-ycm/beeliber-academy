'use client';

import { useState } from 'react';
import { Copy, RotateCcw, Save, Loader2 } from 'lucide-react';
import { QualityCheckCard } from './QualityCheckCard';

interface OutputRailProps {
  title: string;
  rawText: string;
  sections: Array<{ title: string; body: string }>;
  qualityChecks: string[];
  outputFormat: string[];
  isSaving: boolean;
  onSave: () => void;
  onRetry: () => void;
  imageUrl?: string;
  isGeneratingImage?: boolean;
}

export function OutputRail({
  title,
  rawText,
  sections,
  qualityChecks,
  outputFormat,
  isSaving,
  onSave,
  onRetry,
  imageUrl,
  isGeneratingImage,
}: OutputRailProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <aside className="space-y-4">
      {/* Result card */}
      <div className="rounded-[14px] border border-white/[0.07] bg-white/[0.02] p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/30">AI 결과</p>
          <div className="flex gap-1.5">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[11px] text-white/35 transition-colors hover:bg-white/[0.05] hover:text-white/70"
            >
              <Copy size={11} />
              {copied ? '복사됨' : '복사'}
            </button>
            <button
              onClick={onRetry}
              className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[11px] text-white/35 transition-colors hover:bg-white/[0.05] hover:text-white/70"
            >
              <RotateCcw size={11} />
              다시 실행
            </button>
          </div>
        </div>

        {/* 이미지 생성 결과 */}
        {isGeneratingImage && (
          <div className="mb-4 flex items-center justify-center gap-2 rounded-[10px] border border-cyan-500/15 bg-cyan-500/[0.04] py-8">
            <Loader2 size={16} className="animate-spin text-cyan-400" />
            <span className="text-xs text-cyan-400">이미지 생성 중…</span>
          </div>
        )}
        {imageUrl && !isGeneratingImage && (
          <div className="mb-4 overflow-hidden rounded-[10px] border border-cyan-500/20 bg-black/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="생성된 시작 이미지"
              className="w-full object-cover"
              style={{ aspectRatio: '9/16', maxHeight: 340, objectFit: 'cover' }}
            />
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-[10px] font-medium uppercase tracking-wider text-cyan-400/60">시작 이미지</span>
              <a
                href={imageUrl}
                download="start-image.png"
                className="text-[10px] text-cyan-400/70 hover:text-cyan-400 transition-colors"
              >
                ↓ 다운로드
              </a>
            </div>
          </div>
        )}

        {title && (
          <p className="mb-3 text-sm font-semibold text-white/80">{title}</p>
        )}

        {sections.length > 0 ? (
          <div className="space-y-3">
            {sections.map((s) => (
              <div key={s.title} className="rounded-[10px] border border-white/[0.05] bg-white/[0.02] p-3">
                <p className="mb-1.5 text-[11px] font-medium text-white/50">{s.title}</p>
                <p className="whitespace-pre-wrap text-xs leading-relaxed text-white/65">{s.body}</p>
              </div>
            ))}
          </div>
        ) : (
          <pre className="whitespace-pre-wrap text-xs leading-relaxed text-white/60">{rawText}</pre>
        )}

        {/* Save */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-[10px] bg-amber-500 py-2.5 text-xs font-semibold text-black transition-all hover:bg-amber-400 disabled:opacity-40 active:scale-[0.98]"
        >
          <Save size={12} />
          {isSaving ? '저장 중…' : '결과물 저장'}
        </button>
      </div>

      {/* Quality check */}
      <QualityCheckCard checks={qualityChecks} outputFormat={outputFormat} />
    </aside>
  );
}
