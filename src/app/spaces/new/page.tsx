'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSpace } from '@/lib/pikaso/spaces';
import { Loader2 } from 'lucide-react';

/**
 * Creates a new space and immediately redirects to it.
 * Shown briefly while the Supabase insert completes.
 */
export default function NewSpacePage() {
  const router = useRouter();

  useEffect(() => {
    createSpace('새 스페이스').then((id) => {
      if (id) {
        router.replace(`/spaces/${id}`);
      } else {
        // Fallback: go to a demo space if not logged in / creation fails
        router.replace('/spaces/demo');
      }
    });
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-950 text-white">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={24} className="animate-spin text-violet-400" />
        <p className="text-sm text-white/40">스페이스 생성 중...</p>
      </div>
    </div>
  );
}
