'use client';

import { useState } from 'react';
import { Expand, Sparkles, X, Loader2 } from 'lucide-react';
import type { InfiniteCanvasHandle } from './InfiniteCanvas';
import type { RefObject } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';

interface OutpaintingPanelProps {
  canvasRef: RefObject<InfiniteCanvasHandle | null>;
  onClose: () => void;
}

type Preset = { label: string; top: number; bottom: number; left: number; right: number };

const PRESETS: Preset[] = [
  { label: '상하 확장',  top: 200, bottom: 200, left: 0,   right: 0   },
  { label: '좌우 확장',  top: 0,   bottom: 0,   left: 200, right: 200 },
  { label: '16:9',       top: 0,   bottom: 0,   left: 256, right: 256 },
  { label: '9:16',       top: 256, bottom: 256, left: 0,   right: 0   },
  { label: '전방향',     top: 150, bottom: 150, left: 150, right: 150 },
];

export default function OutpaintingPanel({ canvasRef, onClose }: OutpaintingPanelProps) {
  const [top, setTop]       = useState(0);
  const [bottom, setBottom] = useState(0);
  const [left, setLeft]     = useState(0);
  const [right, setRight]   = useState(0);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const { selectedIds, elements } = useCanvasStore();

  const selectedElement = elements.find((e) => selectedIds[0] === e.id);
  const sourceImageUrl = selectedElement?.data?.src as string | undefined;

  const applyPreset = (p: Preset) => {
    setTop(p.top); setBottom(p.bottom); setLeft(p.left); setRight(p.right);
  };

  const totalExpand = top + bottom + left + right;

  const handleGenerate = async () => {
    if (!sourceImageUrl) { setError('확장할 이미지를 선택하세요.'); return; }
    if (totalExpand === 0) { setError('확장할 방향을 하나 이상 선택하세요.'); return; }
    if (!prompt.trim()) { setError('확장 영역에 채울 내용을 입력하세요.'); return; }

    setError(null);
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate/outpaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: sourceImageUrl,
          expandTop: top,
          expandBottom: bottom,
          expandLeft: left,
          expandRight: right,
          prompt,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? '아웃페인팅 실패');

      if (data.data?.imageUrl) {
        await canvasRef.current?.addImageFromUrl(data.data.imageUrl, {
          label: `outpaint: ${prompt}`,
        });
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류 발생');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex w-64 flex-col gap-3 rounded-2xl border border-white/10 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Expand size={14} className="text-cyan-400" />
          <span className="text-sm font-medium text-white">아웃페인팅</span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-white/30 hover:bg-white/10 hover:text-white transition"
        >
          <X size={14} />
        </button>
      </div>

      {/* Source preview */}
      {sourceImageUrl ? (
        <div className="overflow-hidden rounded-xl border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sourceImageUrl} alt="source" className="h-24 w-full object-cover" />
        </div>
      ) : (
        <div className="flex h-16 items-center justify-center rounded-xl border border-dashed border-white/10 text-xs text-white/20">
          이미지를 먼저 선택하세요
        </div>
      )}

      {/* Presets */}
      <div className="flex flex-wrap gap-1">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => applyPreset(p)}
            className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/50 hover:border-cyan-500/40 hover:text-white transition"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Direction inputs */}
      <div className="grid grid-cols-3 gap-1.5 text-xs">
        <div />
        <ExpandInput label="위" value={top} onChange={setTop} />
        <div />
        <ExpandInput label="왼쪽" value={left} onChange={setLeft} />
        <div className="flex items-center justify-center text-white/20 text-[10px]">px</div>
        <ExpandInput label="오른쪽" value={right} onChange={setRight} />
        <div />
        <ExpandInput label="아래" value={bottom} onChange={setBottom} />
        <div />
      </div>

      {/* Prompt */}
      <div>
        <label className="mb-1 block text-xs text-white/40">확장 영역 내용</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="확장된 영역에 무엇을 채울까요? (예: 넓은 하늘, 도시 배경)"
          rows={2}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-cyan-500/50"
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        onClick={handleGenerate}
        disabled={isGenerating || totalExpand === 0 || !prompt.trim()}
        className={`flex h-9 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all
          ${isGenerating || totalExpand === 0 || !prompt.trim()
            ? 'cursor-not-allowed bg-white/5 text-white/20'
            : 'bg-cyan-600 text-white hover:bg-cyan-500 active:scale-95'
          }`}
      >
        {isGenerating ? (
          <><Loader2 size={14} className="animate-spin" /> 생성 중...</>
        ) : (
          <><Sparkles size={14} /> 아웃페인팅 생성</>
        )}
      </button>
    </div>
  );
}

function ExpandInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10px] text-white/30">{label}</span>
      <input
        type="number"
        min={0}
        max={1024}
        step={50}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-1 py-1 text-center text-xs text-white outline-none focus:border-cyan-500/50"
      />
    </div>
  );
}
