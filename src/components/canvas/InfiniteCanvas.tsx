'use client';

import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import type { Canvas as FabricCanvas } from 'fabric';
import { useCanvasStore } from '@/stores/canvasStore';
import { nanoid } from '@/lib/utils';

export interface InfiniteCanvasHandle {
  addImageFromUrl: (url: string, opts?: { label?: string }) => Promise<void>;
  getCanvas: () => FabricCanvas | null;
  exportImage: () => string | null;
}

interface InfiniteCanvasProps {
  pageId: string;
  className?: string;
  onContextMenu?: (pos: { x: number; y: number }) => void;
}

const ZOOM_MIN = 0.1;
const ZOOM_MAX = 5;

const InfiniteCanvas = forwardRef<InfiniteCanvasHandle, InfiniteCanvasProps>(
  ({ pageId, className = '', onContextMenu }, ref) => {
    const canvasElRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<FabricCanvas | null>(null);
    const isPanningRef = useRef(false);
    const lastPosRef = useRef({ x: 0, y: 0 });

    const { setZoom, setPan, addElement, setSelectedIds, activeTool, elements } =
      useCanvasStore();

    // Init Fabric canvas
    useEffect(() => {
      if (!canvasElRef.current) return;

      // Each effect invocation gets its own `aborted` flag.
      // React Strict Mode fires cleanup before the async IIFE completes —
      // checking `aborted` after the await prevents double-initialization.
      let aborted = false;
      let ro: ResizeObserver | null = null;

      (async () => {
        const fabric = await import('fabric');
        // If cleanup ran while we were awaiting the import, bail out.
        if (aborted || !canvasElRef.current) return;

        const container = canvasElRef.current.parentElement!;
        const canvas = new fabric.Canvas(canvasElRef.current, {
          backgroundColor: '#0a0a0f',
          selection: true,
          preserveObjectStacking: true,
          width: container.clientWidth,
          height: container.clientHeight,
        });

        fabricRef.current = canvas;

        // ── Zoom on wheel ──────────────────────────────────────────────
        canvas.on('mouse:wheel', (opt) => {
          const delta = opt.e.deltaY;
          let zoom = canvas.getZoom();
          zoom *= 0.999 ** delta;
          zoom = Math.min(Math.max(zoom, ZOOM_MIN), ZOOM_MAX);
          canvas.zoomToPoint(new fabric.Point(opt.e.offsetX, opt.e.offsetY), zoom);
          setZoom(zoom);
          opt.e.preventDefault();
          opt.e.stopPropagation();
        });

        // ── Pan with Space+drag or middle-mouse ────────────────────────
        canvas.on('mouse:down', (opt) => {
          const evt = opt.e as MouseEvent;
          const isSpacePan = (evt as MouseEvent & { isSpacePan?: boolean }).isSpacePan;
          if (isSpacePan || evt.button === 1) {
            isPanningRef.current = true;
            canvas.selection = false;
            lastPosRef.current = { x: evt.clientX, y: evt.clientY };
          }
        });

        canvas.on('mouse:move', (opt) => {
          if (!isPanningRef.current) return;
          const evt = opt.e as MouseEvent;
          const vpt = canvas.viewportTransform!;
          vpt[4] += evt.clientX - lastPosRef.current.x;
          vpt[5] += evt.clientY - lastPosRef.current.y;
          canvas.requestRenderAll();
          lastPosRef.current = { x: evt.clientX, y: evt.clientY };
          setPan(vpt[4], vpt[5]);
        });

        canvas.on('mouse:up', () => {
          isPanningRef.current = false;
          if (fabricRef.current) fabricRef.current.selection = true;
        });

        // ── Selection tracking ─────────────────────────────────────────
        canvas.on('selection:created', (opt) => {
          const ids = opt.selected?.map((o) => (o as { id?: string }).id ?? '') ?? [];
          setSelectedIds(ids.filter(Boolean));
        });
        canvas.on('selection:updated', (opt) => {
          const ids = opt.selected?.map((o) => (o as { id?: string }).id ?? '') ?? [];
          setSelectedIds(ids.filter(Boolean));
        });
        canvas.on('selection:cleared', () => setSelectedIds([]));

        // ── Resize observer ────────────────────────────────────────────
        ro = new ResizeObserver(() => {
          if (!container || !fabricRef.current) return;
          fabricRef.current.setWidth(container.clientWidth);
          fabricRef.current.setHeight(container.clientHeight);
          fabricRef.current.requestRenderAll();
        });
        ro.observe(container);
      })();

      return () => {
        aborted = true;
        ro?.disconnect();
        if (fabricRef.current) {
          fabricRef.current.dispose();
          fabricRef.current = null;
        }
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Space key for pan mode ─────────────────────────────────────────
    useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space' && fabricRef.current) {
          e.preventDefault();
          fabricRef.current.defaultCursor = 'grab';
          fabricRef.current.hoverCursor = 'grab';
          fabricRef.current.on('mouse:down', (opt) => {
            (opt.e as MouseEvent & { isSpacePan?: boolean }).isSpacePan = true;
          });
        }
      };
      const onKeyUp = (e: KeyboardEvent) => {
        if (e.code === 'Space' && fabricRef.current) {
          fabricRef.current.defaultCursor = 'default';
          fabricRef.current.hoverCursor = 'move';
        }
      };
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);
      return () => {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
      };
    }, []);

    // ── Sync activeTool → fabric cursor/mode ──────────────────────────
    useEffect(() => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      if (activeTool === 'hand') {
        canvas.defaultCursor = 'grab';
        canvas.selection = false;
        canvas.forEachObject((o) => { o.selectable = false; });
      } else {
        canvas.defaultCursor = 'default';
        canvas.selection = true;
        canvas.forEachObject((o) => { o.selectable = true; });
      }
    }, [activeTool]);

    // ── Add image from URL ─────────────────────────────────────────────
    const addImageFromUrl = useCallback(
      async (url: string, opts?: { label?: string }) => {
        const fabric = await import('fabric');
        const canvas = fabricRef.current;
        if (!canvas) return;

        const img = await fabric.FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
        const id = nanoid();

        // Scale to fit within 512x512 while preserving aspect ratio
        const maxSize = 512;
        const scale = Math.min(maxSize / img.width!, maxSize / img.height!, 1);
        img.scale(scale);

        // Place near center with slight offset per element count
        const offset = elements.length * 20;
        const centerX = canvas.getWidth() / 2 / canvas.getZoom() - img.getScaledWidth() / 2 + offset;
        const centerY = canvas.getHeight() / 2 / canvas.getZoom() - img.getScaledHeight() / 2 + offset;

        img.set({
          left: centerX,
          top: centerY,
          id,
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();

        addElement({
          id,
          type: 'image',
          x: centerX,
          y: centerY,
          width: img.getScaledWidth(),
          height: img.getScaledHeight(),
          rotation: 0,
          zIndex: elements.length,
          pageId,
          data: { src: url, label: opts?.label ?? '' },
        });
      },
      [addElement, elements.length, pageId]
    );

    const getCanvas = useCallback(() => fabricRef.current, []);

    const exportImage = useCallback(() => {
      return fabricRef.current?.toDataURL({ format: 'png', multiplier: 1 }) ?? null;
    }, []);

    useImperativeHandle(ref, () => ({ addImageFromUrl, getCanvas, exportImage }), [
      addImageFromUrl,
      getCanvas,
      exportImage,
    ]);

    return (
      <div
        className={`relative h-full w-full overflow-hidden bg-neutral-900 ${className}`}
        onContextMenu={(e) => {
          e.preventDefault();
          onContextMenu?.({ x: e.clientX, y: e.clientY });
        }}
      >
        {/* Empty state */}
        {elements.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-8 py-6 text-center">
              <p className="text-lg font-medium text-white/60">첫 이미지를 생성해보세요</p>
              <p className="mt-1 text-sm text-white/30">
                오른쪽 패널에서 프롬프트를 입력하거나 우클릭하세요
              </p>
            </div>
          </div>
        )}
        <canvas ref={canvasElRef} />
      </div>
    );
  }
);

InfiniteCanvas.displayName = 'InfiniteCanvas';

export default InfiniteCanvas;
