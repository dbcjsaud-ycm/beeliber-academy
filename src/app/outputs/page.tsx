'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, FileText, Clock, GitBranch, ArrowRight, Loader2, Inbox } from 'lucide-react';

type Doc = {
  id: string;
  track_slug: string;
  lesson_slug: string;
  title: string;
  status: string;
  current_version_no: number;
  updated_at: string;
  created_at: string;
};

const TRACK_LABELS: Record<string, { label: string; accent: string }> = {
  marketing:        { label: '마케팅',        accent: '#f59e0b' },
  'image-to-video': { label: '이미지투비디오', accent: '#06b6d4' },
  'web-app':        { label: '웹/앱 개발',    accent: '#7c3aed' },
  automation:       { label: '자동화',         accent: '#f59e0b' },
};

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function OutputsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/workspace')
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setDocs(json.documents ?? []);
        else setError(json.error ?? '불러오기 실패');
      })
      .catch(() => setError('네트워크 오류'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen academy-bg text-white">
      {/* ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-amber-500/[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 pb-24 pt-14">
        {/* Back */}
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          <ChevronLeft size={13} />
          홈으로
        </Link>

        {/* Header */}
        <div className="mb-12">
          <p className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-amber-400/70">
            <span className="h-px w-5 bg-amber-500/50" />
            내 결과물
          </p>
          <h1 className="font-fraunces text-4xl font-black text-white">
            저장된 결과물
          </h1>
          <p className="mt-3 text-sm text-white/40">
            실습에서 저장한 AI 결과물과 버전 이력을 확인하세요
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-white/30">
            <Loader2 size={20} className="animate-spin mr-2" />
            불러오는 중…
          </div>
        ) : error ? (
          <div className="rounded-[14px] border border-red-500/20 bg-red-500/[0.06] px-6 py-5 text-sm text-red-400">
            {error === 'UNAUTHORIZED'
              ? '로그인이 필요합니다. 로그인 후 다시 시도해주세요.'
              : error}
          </div>
        ) : docs.length === 0 ? (
          <div className="flex flex-col items-center gap-5 rounded-[18px] border border-white/[0.06] bg-white/[0.02] py-20 text-center">
            <Inbox size={32} className="text-white/20" />
            <div>
              <p className="text-base font-medium text-white/50">아직 저장된 결과물이 없어요</p>
              <p className="mt-1.5 text-sm text-white/25">실습을 완료하고 저장 버튼을 눌러보세요</p>
            </div>
            <Link
              href="/tracks"
              className="mt-2 flex items-center gap-2 rounded-[10px] bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-amber-400 transition-all"
            >
              실전 트랙 시작하기
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {docs.map((doc) => {
              const meta = TRACK_LABELS[doc.track_slug] ?? { label: doc.track_slug, accent: '#f59e0b' };
              return (
                <Link
                  key={doc.id}
                  href={`/lab/${doc.track_slug}/${doc.lesson_slug}`}
                  className="group flex items-center gap-5 rounded-[14px] border border-white/[0.07] bg-white/[0.02] px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-amber-500/20 hover:bg-white/[0.035]"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] border border-white/[0.07] bg-white/[0.04]">
                    <FileText size={16} className="text-white/40" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-white/85 transition-colors group-hover:text-white">
                        {doc.title}
                      </p>
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={{ color: meta.accent, background: `${meta.accent}18` }}
                      >
                        {meta.label}
                      </span>
                      {doc.status === 'draft' && (
                        <span className="rounded-full border border-white/[0.07] px-2 py-0.5 text-[10px] text-white/25">
                          초안
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-white/30">{doc.lesson_slug}</p>
                  </div>

                  <div className="flex flex-shrink-0 flex-col items-end gap-1.5 text-right">
                    <div className="flex items-center gap-1 text-[11px] text-white/30">
                      <GitBranch size={10} />
                      v{doc.current_version_no}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-white/20">
                      <Clock size={10} />
                      {fmtDate(doc.updated_at)}
                    </div>
                  </div>

                  <ArrowRight size={13} className="flex-shrink-0 text-white/15 transition-colors group-hover:text-amber-400/60" />
                </Link>
              );
            })}
          </div>
        )}

        {docs.length > 0 && (
          <div className="mt-10 flex items-center gap-3 text-sm text-white/20">
            <span className="h-px flex-1 bg-white/[0.05]" />
            <span>{docs.length}개 결과물</span>
            <span className="h-px flex-1 bg-white/[0.05]" />
          </div>
        )}
      </div>
    </div>
  );
}
