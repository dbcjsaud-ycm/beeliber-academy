'use client';

import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useGenerateStore } from '@/stores/generateStore';
import type { InfiniteCanvasHandle } from '@/components/canvas/InfiniteCanvas';
import type { RefObject } from 'react';
import { nanoid } from '@/lib/utils';

interface GenerateButtonProps {
  canvasRef: RefObject<InfiniteCanvasHandle | null>;
}

const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3'] as const;

export default function GenerateButton({ canvasRef }: GenerateButtonProps) {
  const {
    prompt,
    selectedModel,
    negativePrompt,
    aspectRatio,
    setAspectRatio,
    generationState,
    setGenerationState,
    creditsBalance,
    setLastError,
    lastError,
    addGeneration,
    updateGeneration,
  } = useGenerateStore();

  const isGenerating = generationState === 'queued' || generationState === 'processing';
  const canGenerate = prompt.trim().length > 0 && !isGenerating && creditsBalance > 0;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLastError(null);
    setGenerationState('queued');

    const genId = nanoid();
    addGeneration({
      id: genId,
      status: 'queued',
      modelId: selectedModel,
      outputUrls: [],
      creditsCost: 0,
    });

    setGenerationState('processing');

    try {
      const res = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          modelId: selectedModel,
          negativePrompt: negativePrompt || undefined,
          aspectRatio,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? '이미지 생성에 실패했습니다.');
      }

      const imageUrl: string = data.data.imageUrl;

      updateGeneration(genId, {
        status: 'completed',
        outputUrls: [imageUrl],
        creditsCost: data.data.creditsCost ?? 0,
      });

      setGenerationState('placing');
      await canvasRef.current?.addImageFromUrl(imageUrl, {
        label: data.data.model ?? selectedModel,
      });
      setGenerationState('idle');
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류';
      setLastError(message);
      updateGeneration(genId, { status: 'failed', error: message });
      setGenerationState('error');
      setTimeout(() => setGenerationState('idle'), 3000);
    }
  };

  const buttonLabel = {
    idle: '이미지 생성',
    checking_credits: '크레딧 확인 중...',
    queued: '대기 중...',
    processing: '생성 중...',
    placing: '캔버스에 추가 중...',
    error: '오류 발생',
  }[generationState];

  return (
    <div className="flex flex-col gap-2">
      {/* Aspect ratio selector */}
      <div className="flex gap-1">
        {ASPECT_RATIOS.map((r) => (
          <button
            key={r}
            onClick={() => setAspectRatio(r)}
            className={`flex-1 rounded-lg border py-1 text-xs transition
              ${aspectRatio === r
                ? 'border-violet-500/50 bg-violet-600/20 text-violet-300'
                : 'border-white/10 bg-white/5 text-white/40 hover:border-white/20 hover:text-white/60'
              }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Credits display */}
      <div className="flex items-center justify-between text-xs text-white/30">
        <span>보유 크레딧</span>
        <span className={creditsBalance < 50 ? 'text-red-400' : 'text-white/50'}>
          {creditsBalance.toLocaleString()} cr
        </span>
      </div>

      {/* Error message */}
      {lastError && generationState === 'error' && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{lastError}</span>
        </div>
      )}

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all
          ${canGenerate
            ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30 hover:bg-violet-500 active:scale-95'
            : 'cursor-not-allowed bg-white/5 text-white/20'
          }`}
      >
        {isGenerating ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Sparkles size={16} />
        )}
        {buttonLabel}
      </button>

      {creditsBalance === 0 && (
        <p className="text-center text-xs text-red-400">크레딧이 부족합니다</p>
      )}
    </div>
  );
}
