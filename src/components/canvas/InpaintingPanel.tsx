'use client';

import { useState, useCallback } from 'react';
import { Paintbrush, Eraser, RotateCcw, Sparkles, X, Loader2 } from 'lucide-react';
import type { InfiniteCanvasHandle } from './InfiniteCanvas';
import type { RefObject } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';

interface InpaintingPanelProps {
  canvasRef: RefObject<InfiniteCanvasHandle | null>;
  onClose: () => void;
}

type BrushMode = 'paint' | 'erase';

export default function InpaintingPanel({ canvasRef, onClose }: InpaintingPanelProps) {
  const [brushSize, setBrushSize] = useState(30);
  const [brushMode, setBrushMode] = useState<BrushMode>('paint');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inpaintPrompt, setInpaintPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { selectedIds, elements } = useCanvasStore();

  const selectedElement = elements.find((e) => selectedIds[0] === e.id);
  const sourceImageUrl = selectedElement?.data?.src as string | undefined;

  const enableDrawing = useCallback(async () => {
    const fabric = await import('fabric');
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    setIsDrawing(true);
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color =
      brushMode === 'paint' ? 'rgba(139, 92, 246, 0.85)' : 'rgba(0,0,0,0)';
    canvas.freeDrawingBrush.width = brushSize;
  }, [canvasRef, brushMode, brushSize]);

  const disableDrawing = useCallback(() => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;
    canvas.isDrawingMode = false;
    setIsDrawing(false);
  }, [canvasRef]);

  const clearMask = useCallback(async () => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;
    // Remove all path objects drawn in mask mode (purple strokes)
    const pathsToRemove = canvas.getObjects('path');
    pathsToRemove.forEach((p) => {
      if ((p.stroke as string)?.includes('139, 92, 246')) {
        canvas.remove(p);
      }
    });
    canvas.requestRenderAll();
  }, [canvasRef]);

  const handleGenerate = async () => {
    if (!inpaintPrompt.trim()) {
      setError('인페인팅 프롬프트를 입력하세요.');
      return;
    }
    if (!sourceImageUrl) {
      setError('인페인팅할 이미지를 선택하세요.');
      return;
    }

    setError(null);
    setIsGenerating(true);
    disableDrawing();

    try {
      // Extract mask as data URL from canvas
      const canvas = canvasRef.current?.getCanvas();
      const maskDataUrl = canvas?.toDataURL({ format: 'png', multiplier: 1 }) ?? null;

      const res = await fetch('/api/generate/inpaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: sourceImageUrl,
          maskDataUrl,
          prompt: inpaintPrompt,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? '인페인팅 실패');

      // Replace selected element's image with inpainted result
      if (selectedIds[0] && data.data?.imageUrl) {
        await canvasRef.current?.addImageFromUrl(data.data.imageUrl, {
          label: `inpaint: ${inpaintPrompt}`,
        });
        clearMask();
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
          <Paintbrush size={14} className="text-violet-400" />
          <span className="text-sm font-medium text-white">인페인팅</span>
        </div>
        <button
          onClick={() => { disableDrawing(); onClose(); }}
          className="rounded-lg p-1 text-white/30 hover:bg-white/10 hover:text-white transition"
        >
          <X size={14} />
        </button>
      </div>

      {/* Source image preview */}
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

      {/* Brush controls */}
      <div className="flex gap-1.5">
        <button
          onClick={() => { setBrushMode('paint'); enableDrawing(); }}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-xs transition
            ${brushMode === 'paint' && isDrawing
              ? 'border-violet-500/50 bg-violet-600/20 text-violet-300'
              : 'border-white/10 bg-white/5 text-white/50 hover:text-white'
            }`}
        >
          <Paintbrush size={12} />
          브러시
        </button>
        <button
          onClick={() => { setBrushMode('erase'); enableDrawing(); }}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-xs transition
            ${brushMode === 'erase' && isDrawing
              ? 'border-amber-500/50 bg-amber-600/20 text-amber-300'
              : 'border-white/10 bg-white/5 text-white/50 hover:text-white'
            }`}
        >
          <Eraser size={12} />
          지우기
        </button>
        <button
          onClick={clearMask}
          className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-white/30 hover:text-white transition"
          title="마스크 초기화"
        >
          <RotateCcw size={12} />
        </button>
      </div>

      {/* Brush size */}
      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-white/40">
          <span>브러시 크기</span>
          <span>{brushSize}px</span>
        </div>
        <input
          type="range"
          min={5}
          max={100}
          value={brushSize}
          onChange={(e) => {
            const size = Number(e.target.value);
            setBrushSize(size);
            const canvas = canvasRef.current?.getCanvas();
            if (canvas?.freeDrawingBrush) canvas.freeDrawingBrush.width = size;
          }}
          className="w-full accent-violet-500"
        />
      </div>

      {/* Inpaint prompt */}
      <div>
        <label className="mb-1 block text-xs text-white/40">채울 내용</label>
        <textarea
          value={inpaintPrompt}
          onChange={(e) => setInpaintPrompt(e.target.value)}
          placeholder="마스크 영역에 무엇을 채울까요? (예: 파란 하늘, 꽃밭)"
          rows={3}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-violet-500/50"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !inpaintPrompt.trim()}
        className={`flex h-9 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all
          ${isGenerating || !inpaintPrompt.trim()
            ? 'cursor-not-allowed bg-white/5 text-white/20'
            : 'bg-violet-600 text-white hover:bg-violet-500 active:scale-95'
          }`}
      >
        {isGenerating ? (
          <><Loader2 size={14} className="animate-spin" /> 생성 중...</>
        ) : (
          <><Sparkles size={14} /> 인페인팅 생성</>
        )}
      </button>
    </div>
  );
}
