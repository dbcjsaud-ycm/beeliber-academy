'use client';

import { ChevronDown, Zap } from 'lucide-react';
import { useState } from 'react';
import { IMAGE_MODELS } from '@/types/models';
import { useGenerateStore } from '@/stores/generateStore';

export default function ModelSelector() {
  const { selectedModel, setSelectedModel } = useGenerateStore();
  const [open, setOpen] = useState(false);

  const current = IMAGE_MODELS.find((m) => m.id === selectedModel) ?? IMAGE_MODELS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
      >
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-violet-400" />
          <span className="font-medium">{current.name}</span>
          <span className="text-xs text-white/40">
            {current.id === 'auto' ? '자동 선택' : `${current.credits.min} 크레딧`}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`text-white/40 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-xl">
          {IMAGE_MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                setSelectedModel(model.id);
                setOpen(false);
              }}
              className={`flex w-full items-start gap-3 px-3 py-2.5 text-left transition hover:bg-white/5
                ${selectedModel === model.id ? 'bg-violet-600/20' : ''}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{model.name}</span>
                  {model.id === 'auto' && (
                    <span className="rounded-full bg-violet-600/30 px-1.5 py-0.5 text-xs text-violet-300">
                      추천
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-white/40">{model.description}</p>
              </div>
              <div className="flex flex-col items-end gap-0.5 shrink-0">
                <span className="text-xs text-white/60">{model.estimatedTime}</span>
                <span className="text-xs text-violet-400">
                  {model.id === 'auto' ? '자동' : `${model.credits.min}cr`}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
