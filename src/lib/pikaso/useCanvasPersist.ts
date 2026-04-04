'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { upsertElement, deleteElement } from './spaces';

const DEBOUNCE_MS = 2000; // 2s after last change

/**
 * Autosave canvas elements to Supabase.
 * Call this hook inside the canvas page.
 * Elements added/updated are upserted; removed elements are deleted.
 */
export function useCanvasPersist(enabled = true) {
  const { elements } = useCanvasStore();
  const prevIdsRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(async (currentElements: typeof elements) => {
    const currentIds = new Set(currentElements.map((e) => e.id));

    // Upsert all current elements
    await Promise.all(currentElements.map((el) => upsertElement(el)));

    // Delete elements that were removed since last save
    const removed = [...prevIdsRef.current].filter((id) => !currentIds.has(id));
    await Promise.all(removed.map((id) => deleteElement(id)));

    prevIdsRef.current = currentIds;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      save(elements);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [elements, enabled, save]);
}
