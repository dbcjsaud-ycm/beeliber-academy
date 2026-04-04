'use client';

import { useState } from 'react';
import { Paintbrush, Expand, Camera, Sun, Download, Trash2, Copy } from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';
import type { InfiniteCanvasHandle } from './InfiniteCanvas';
import type { RefObject } from 'react';
import InpaintingPanel from './InpaintingPanel';
import OutpaintingPanel from './OutpaintingPanel';

interface ContextActionBarProps {
  canvasRef: RefObject<InfiniteCanvasHandle | null>;
}

export default function ContextActionBar({ canvasRef }: ContextActionBarProps) {
  const { selectedIds, removeElement } = useCanvasStore();
  const [showInpaint, setShowInpaint]   = useState(false);
  const [showOutpaint, setShowOutpaint] = useState(false);

  if (selectedIds.length === 0) return null;

  const handleDownload = () => {
    const dataUrl = canvasRef.current?.exportImage();
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'canvas-export.png';
    a.click();
  };

  const handleDelete = () => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;
    const activeObjects = canvas.getActiveObjects();
    activeObjects.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    selectedIds.forEach((id) => removeElement(id));
  };

  const handleCopy = () => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    activeObject.clone().then((cloned: Parameters<typeof canvas.add>[0]) => {
      cloned.set({ left: (cloned.left ?? 0) + 20, top: (cloned.top ?? 0) + 20 });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.requestRenderAll();
    });
  };

  const ACTIONS = [
    {
      icon: Paintbrush,
      label: 'Inpaint',
      onClick: () => { setShowInpaint((v) => !v); setShowOutpaint(false); },
      active: showInpaint,
    },
    {
      icon: Expand,
      label: 'Outpaint',
      onClick: () => { setShowOutpaint((v) => !v); setShowInpaint(false); },
      active: showOutpaint,
    },
    { icon: Camera,   label: '시점 변경',   onClick: () => {} },
    { icon: Sun,      label: '조명 변경',   onClick: () => {} },
    { icon: Copy,     label: '복제',        onClick: handleCopy },
    { icon: Download, label: '다운로드',    onClick: handleDownload },
    { icon: Trash2,   label: '삭제',        onClick: handleDelete, danger: true },
  ] as const;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Action bar */}
      <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-2 py-1.5 backdrop-blur-sm">
        {ACTIONS.map((action, i) => {
          const Icon = action.icon;
          return (
            <button
              key={i}
              title={action.label}
              onClick={action.onClick}
              className={`group relative flex h-8 items-center gap-1.5 rounded-xl px-2.5 text-xs transition-all
                ${'danger' in action && action.danger
                  ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                  : 'active' in action && action.active
                  ? 'bg-violet-600/20 text-violet-300'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Inpainting panel */}
      {showInpaint && (
        <InpaintingPanel
          canvasRef={canvasRef}
          onClose={() => setShowInpaint(false)}
        />
      )}

      {/* Outpainting panel */}
      {showOutpaint && (
        <OutpaintingPanel
          canvasRef={canvasRef}
          onClose={() => setShowOutpaint(false)}
        />
      )}
    </div>
  );
}
