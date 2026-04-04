'use client';

import { MousePointer2, Hand, Type, StickyNote, Upload } from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';
import type { InfiniteCanvasHandle } from './InfiniteCanvas';
import type { RefObject } from 'react';

interface CanvasToolbarProps {
  canvasRef: RefObject<InfiniteCanvasHandle | null>;
}

const TOOLS = [
  { id: 'select' as const, icon: MousePointer2, label: '선택 (V)' },
  { id: 'hand' as const, icon: Hand, label: '이동 (H)' },
  { id: 'text' as const, icon: Type, label: '텍스트 (T)' },
  { id: 'sticky' as const, icon: StickyNote, label: '메모 (N)' },
] as const;

export default function CanvasToolbar({ canvasRef }: CanvasToolbarProps) {
  const { activeTool, setActiveTool } = useCanvasStore();

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      await canvasRef.current?.addImageFromUrl(url, { label: file.name });
    };
    input.click();
  };

  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-sm">
      {TOOLS.map((tool) => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.id;
        return (
          <button
            key={tool.id}
            title={tool.label}
            onClick={() => setActiveTool(tool.id)}
            className={`group relative flex h-9 w-9 items-center justify-center rounded-xl transition-all
              ${isActive
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                : 'text-white/50 hover:bg-white/10 hover:text-white'
              }`}
          >
            <Icon size={18} />
            {/* Tooltip */}
            <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-lg border border-white/10 bg-neutral-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              {tool.label}
            </span>
          </button>
        );
      })}

      {/* Divider */}
      <div className="my-1 h-px w-6 bg-white/10" />

      {/* Upload button */}
      <button
        title="이미지 업로드"
        onClick={handleUpload}
        className="group relative flex h-9 w-9 items-center justify-center rounded-xl text-white/50 transition-all hover:bg-white/10 hover:text-white"
      >
        <Upload size={18} />
        <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-lg border border-white/10 bg-neutral-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          이미지 업로드
        </span>
      </button>
    </div>
  );
}
