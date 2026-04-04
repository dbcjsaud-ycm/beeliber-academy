'use client';

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ChevronLeft,
  LayoutGrid,
  Share2,
  Download,
  Image as ImageIcon,
  Layers,
  Save,
} from 'lucide-react';

import CanvasToolbar from '@/components/canvas/CanvasToolbar';
import ContextActionBar from '@/components/canvas/ContextActionBar';
import ModelSelector from '@/components/generate/ModelSelector';
import PromptInput from '@/components/generate/PromptInput';
import GenerateButton from '@/components/generate/GenerateButton';
import { useCanvasStore } from '@/stores/canvasStore';
import { useGenerateStore } from '@/stores/generateStore';
import { useCanvasPersist } from '@/lib/pikaso/useCanvasPersist';
import { getCreditsBalance } from '@/lib/pikaso/spaces';
import type { InfiniteCanvasHandle } from '@/components/canvas/InfiniteCanvas';

// Dynamic import to avoid SSR issues with Fabric.js
const InfiniteCanvas = dynamic(
  () => import('@/components/canvas/InfiniteCanvas'),
  { ssr: false }
);

const DEFAULT_PAGE_ID = 'page-1';

export default function SpacePage({ params }: { params: { id: string } }) {
  const canvasRef = useRef<InfiniteCanvasHandle>(null);
  const [panelTab, setPanelTab] = useState<'generate' | 'layers'>('generate');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');

  const { selectedIds, elements, viewport } = useCanvasStore();
  const { creditsBalance, activeGenerations, setGenerationState } = useGenerateStore();

  // Autosave to Supabase
  useCanvasPersist(true);

  // Load real credits from Supabase on mount
  useEffect(() => {
    getCreditsBalance().then((balance) => {
      if (balance > 0) {
        useGenerateStore.setState({ creditsBalance: balance });
      }
    }).catch(() => {}); // Graceful fail if not logged in
  }, []);

  // Show save indicator when elements change
  useEffect(() => {
    if (elements.length === 0) return;
    setSaveStatus('saving');
    const t = setTimeout(() => setSaveStatus('saved'), 2200);
    return () => clearTimeout(t);
  }, [elements]);

  const spaceTitle = `스페이스 ${params.id.slice(0, 8)}`;
  const pendingCount = activeGenerations.filter(
    (g) => g.status === 'queued' || g.status === 'processing'
  ).length;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-950 text-white">
      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-white/[0.07] px-4">
        <Link
          href="/academy/workflow-canvas"
          className="flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition"
        >
          <ChevronLeft size={16} />
          <span>워크플로우</span>
        </Link>

        <div className="h-4 w-px bg-white/10" />

        <span className="text-sm font-medium text-white/80">{spaceTitle}</span>

        <div className="ml-auto flex items-center gap-2">
          {/* Save status */}
          {saveStatus !== 'idle' && (
            <div className="flex items-center gap-1 text-xs text-white/30">
              <Save size={11} />
              <span>{saveStatus === 'saving' ? '저장 중...' : '저장됨'}</span>
            </div>
          )}

          {/* Credits badge */}
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
            <span className="text-white/40">크레딧</span>
            <span className={creditsBalance < 50 ? 'text-red-400' : 'text-violet-300'}>
              {creditsBalance.toLocaleString()}
            </span>
          </div>

          {/* Generation progress badge */}
          {pendingCount > 0 && (
            <div className="flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-600/10 px-3 py-1 text-xs text-violet-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
              </span>
              생성 중 {pendingCount}
            </div>
          )}

          <button
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white transition"
            onClick={() => canvasRef.current?.exportImage() && (() => {
              const url = canvasRef.current?.exportImage();
              if (!url) return;
              const a = document.createElement('a');
              a.href = url;
              a.download = `${spaceTitle}.png`;
              a.click();
            })()}
          >
            <Download size={13} />
            내보내기
          </button>

          <button className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white transition">
            <Share2 size={13} />
            공유
          </button>
        </div>
      </header>

      {/* ── Main 3-panel layout ─────────────────────────────────────────── */}
      <div className="relative flex flex-1 overflow-hidden">

        {/* Left: Canvas Toolbar (floating) */}
        <div className="absolute left-3 top-1/2 z-20 -translate-y-1/2">
          <CanvasToolbar canvasRef={canvasRef} />
        </div>

        {/* Center: Canvas */}
        <div className="relative flex-1">
          {/* Context action bar (appears on selection) */}
          {selectedIds.length > 0 && (
            <div className="absolute left-1/2 top-3 z-20 -translate-x-1/2">
              <ContextActionBar canvasRef={canvasRef} />
            </div>
          )}

          {/* Zoom indicator */}
          <div className="absolute bottom-4 left-16 z-10 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white/30 backdrop-blur-sm">
            {Math.round(viewport.zoom * 100)}%
          </div>

          {/* Element count */}
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white/30 backdrop-blur-sm">
            <LayoutGrid size={11} />
            {elements.length} 요소
          </div>

          <InfiniteCanvas
            ref={canvasRef}
            pageId={DEFAULT_PAGE_ID}
            className="h-full w-full"
          />
        </div>

        {/* Right: Generation / Layers Panel */}
        <div className="flex w-72 shrink-0 flex-col border-l border-white/[0.07] bg-neutral-950">
          {/* Panel tab header */}
          <div className="flex border-b border-white/[0.07]">
            <button
              onClick={() => setPanelTab('generate')}
              className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs transition
                ${panelTab === 'generate'
                  ? 'border-b-2 border-amber-500 text-white'
                  : 'text-white/30 hover:text-white/60'
                }`}
            >
              <ImageIcon size={13} />
              생성
            </button>
            <button
              onClick={() => setPanelTab('layers')}
              className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs transition
                ${panelTab === 'layers'
                  ? 'border-b-2 border-amber-500 text-white'
                  : 'text-white/30 hover:text-white/60'
                }`}
            >
              <Layers size={13} />
              레이어 ({elements.length})
            </button>
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-y-auto p-4">
            {panelTab === 'generate' ? (
              <div className="flex flex-col gap-4">
                {/* Model selector */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/40">모델</label>
                  <ModelSelector />
                </div>

                {/* Prompt input */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/40">프롬프트</label>
                  <PromptInput />
                </div>

                {/* Generate button + aspect ratio */}
                <GenerateButton canvasRef={canvasRef} />

                {/* Generation history */}
                {activeGenerations.length > 0 && (
                  <div>
                    <label className="mb-2 block text-xs font-medium text-white/40">
                      생성 기록
                    </label>
                    <div className="flex flex-col gap-2">
                      {[...activeGenerations].reverse().slice(0, 5).map((gen) => (
                        <div
                          key={gen.id}
                          className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-xs"
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                              gen.status === 'completed'
                                ? 'bg-emerald-400'
                                : gen.status === 'failed'
                                ? 'bg-red-400'
                                : 'bg-violet-400 animate-pulse'
                            }`}
                          />
                          <span className="flex-1 truncate text-white/50">{gen.modelId}</span>
                          <span className="text-white/25">
                            {gen.status === 'completed' ? `${gen.creditsCost}cr` : gen.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Layers panel */
              <div className="flex flex-col gap-1">
                {elements.length === 0 ? (
                  <p className="py-8 text-center text-xs text-white/20">
                    캔버스에 요소가 없습니다
                  </p>
                ) : (
                  [...elements].reverse().map((el) => (
                    <div
                      key={el.id}
                      className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-xs"
                    >
                      <ImageIcon size={12} className="text-white/30 shrink-0" />
                      <span className="flex-1 truncate text-white/60">
                        {(el.data.label as string) || el.type}
                      </span>
                      <span className="text-white/20">
                        {Math.round(el.width)}×{Math.round(el.height)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
