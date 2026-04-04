'use client';

import { useRef } from 'react';
import { useGenerateStore } from '@/stores/generateStore';

const QUICK_PROMPTS = [
  '미래 도시 풍경, 사이버펑크 스타일',
  '귀여운 고양이 캐릭터, 파스텔 색상',
  '우주 배경, 행성과 별, 서사시적',
  '일본 벚꽃 거리, 봄날 아침',
  '추상적인 수채화, 차분한 색감',
];

export default function PromptInput() {
  const { prompt, setPrompt, negativePrompt, setNegativePrompt } = useGenerateStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChipClick = (text: string) => {
    setPrompt(text);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Quick prompt chips */}
      <div className="flex flex-wrap gap-1.5">
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => handleChipClick(p)}
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60 transition hover:border-violet-500/50 hover:bg-violet-600/10 hover:text-violet-300"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Main prompt */}
      <div className="relative rounded-xl border border-white/10 bg-white/5 focus-within:border-violet-500/50 focus-within:bg-violet-600/5 transition">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="이미지 설명을 입력하세요... (예: 황금 빛 석양이 지는 해변, 파도, 따뜻한 분위기)"
          rows={4}
          maxLength={4000}
          className="w-full resize-none bg-transparent px-4 py-3 text-sm text-white placeholder-white/30 outline-none"
        />
        <div className="flex items-center justify-between px-4 pb-2">
          <span className="text-xs text-white/20">{prompt.length}/4000</span>
          {prompt.length > 200 && (
            <span className="text-xs text-amber-400/70">긴 프롬프트 → GPT 모델로 자동 전환</span>
          )}
        </div>
      </div>

      {/* Negative prompt (collapsed by default) */}
      <details className="group">
        <summary className="cursor-pointer list-none text-xs text-white/30 hover:text-white/50 transition">
          <span className="group-open:hidden">+ 네거티브 프롬프트 추가</span>
          <span className="hidden group-open:inline">− 네거티브 프롬프트</span>
        </summary>
        <textarea
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          placeholder="생성에서 제외할 요소... (예: 흐림, 저품질, 왜곡)"
          rows={2}
          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/20 outline-none focus:border-white/20"
        />
      </details>
    </div>
  );
}
