'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import type { AcademyLesson, AcademyTrack } from '@/lib/academy-data';
import type { WorkspaceDocument, WorkspaceDocumentVersion } from '@/lib/types';
import { GuideRail } from '@/components/lab/GuideRail';
import { OutputRail } from '@/components/lab/OutputRail';
import { RetryActionBar } from '@/components/lab/RetryActionBar';

type StructuredResult = {
  title: string;
  summary: string;
  sections: Array<{ title: string; body: string }>;
};

export function LessonWorkspace({ track, lesson }: { track: AcademyTrack; lesson: AcademyLesson }) {
  const [prompt, setPrompt] = useState(lesson.defaultPrompt);
  const [fields, setFields] = useState<Record<string, string>>(
    Object.fromEntries(lesson.inputFields.map((f) => [f.label, f.placeholder])),
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<StructuredResult>({
    title: lesson.mockResult.headline,
    summary: lesson.summary,
    sections: lesson.mockResult.sections,
  });
  const [rawText, setRawText] = useState(
    lesson.mockResult.sections.map((s) => `## ${s.title}\n${s.body}`).join('\n\n'),
  );
  const [documentState, setDocumentState] = useState<WorkspaceDocument | null>(null);
  const [versions, setVersions] = useState<WorkspaceDocumentVersion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSimulation, setIsSimulation] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const isImageTrack = track.slug === 'image-to-video';
  const quickActions = useMemo(() => lesson.quickActions, [lesson.quickActions]);

  function appendToPrompt(text: string) {
    setPrompt((prev) => `${prev.trimEnd()}\n\n${text}`);
  }

  async function handleRun() {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || 'AI_GENERATION_FAILED');
      }

      const text: string = json.data?.text ?? json.rawText ?? '';
      setRawText(text);
      setIsSimulation(!!json.isSimulation);
      setImageUrl(null); // 새 실행 시 이전 이미지 초기화

      // 이미지 트랙: 텍스트에서 시작 이미지 프롬프트 추출
      if (isImageTrack) {
        const extracted = extractImagePrompt(text);
        setImagePrompt(extracted);
      }

      if (json.structured) {
        setResult(json.structured);
      } else {
        setResult({ title: lesson.title, summary: '', sections: [{ title: '결과', body: text }] });
      }
    } catch (err) {
      console.error(err);
      setError('AI 실행 중 오류가 발생했습니다. 환경변수나 API 키를 확인해주세요.');
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleGenerateImage() {
    if (!imagePrompt) return;
    setIsGeneratingImage(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt }),
      });
      const json = await response.json();
      if (json.success && json.data?.imageUrl) {
        setImageUrl(json.data.imageUrl);
      } else {
        setError(json.error || '이미지 생성에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      setError('이미지 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGeneratingImage(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    setError(null);

    const payload = {
      title: result.title || lesson.title,
      promptText: prompt,
      inputPayload: fields,
      outputPayload: { rawText, structured: result },
      aiProvider: 'auto',
      aiModel: 'auto',
      trackSlug: track.slug,
      lessonSlug: lesson.slug,
      notes: documentState
        ? `버전 ${documentState.current_version_no + 1}`
        : '첫 저장',
    };

    try {
      const response = await fetch(
        documentState ? `/api/workspace/${documentState.id}/versions` : '/api/workspace',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            documentState
              ? {
                  promptText: payload.promptText,
                  inputPayload: payload.inputPayload,
                  outputPayload: payload.outputPayload,
                  aiProvider: payload.aiProvider,
                  aiModel: payload.aiModel,
                  notes: payload.notes,
                }
              : payload,
          ),
        },
      );

      const json = await response.json();
      if (!response.ok || !json.ok) throw new Error(json.error || 'SAVE_FAILED');

      setDocumentState(json.document);
      setVersions((prev) => [json.version as WorkspaceDocumentVersion, ...prev]);
    } catch (err) {
      console.error(err);
      setError('저장에 실패했습니다. 로그인 세션과 Supabase 정책을 확인해주세요.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col academy-bg text-white">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-white/[0.05] px-6 py-4">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4">
          <Link
            href={`/tracks/${track.slug}`}
            className="inline-flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            <ChevronLeft size={13} />
            {track.label}
          </Link>
          <span className="text-white/10">/</span>
          <h1 className="flex-1 truncate text-sm font-medium text-white/70">{lesson.title}</h1>
          <span className="rounded-full border border-white/[0.08] px-2.5 py-0.5 text-[11px] text-white/30">
            {lesson.level}
          </span>
          {documentState && (
            <span className="rounded-full border border-amber-500/20 bg-amber-500/[0.06] px-2.5 py-0.5 text-[11px] text-amber-400/70">
              v{documentState.current_version_no}
            </span>
          )}
        </div>
      </header>

      {/* 3-panel body */}
      <div className="flex flex-1 gap-6 overflow-hidden px-6 py-6">
        <div className="mx-auto flex w-full max-w-[1400px] gap-6">
          {/* Left — GuideRail */}
          <GuideRail lesson={lesson} onChipClick={appendToPrompt} />

          {/* Center — PromptWorkspace */}
          <section className="flex min-w-0 flex-1 flex-col gap-4">
            {error && (
              <div className="rounded-[10px] border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {isSimulation && (
              <div className="rounded-[10px] border border-amber-500/20 bg-amber-500/[0.06] px-4 py-2.5 flex items-center gap-2">
                <span className="text-amber-400 text-xs">⚠️</span>
                <p className="text-xs text-amber-400/90">
                  <strong>시뮬레이션 모드</strong> — API 키 없이 예시 결과를 표시합니다.{' '}
                  <span className="text-amber-400/60">.env.local에 GOOGLE_AI_KEY를 추가하면 실제 Gemini가 응답합니다.</span>
                </p>
              </div>
            )}

            {/* Input fields */}
            {lesson.inputFields.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {lesson.inputFields.map((field) => (
                  <label
                    key={field.label}
                    className="rounded-[10px] border border-white/[0.07] bg-white/[0.02] px-4 py-3"
                  >
                    <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-white/30">
                      {field.label}
                    </p>
                    <input
                      value={fields[field.label] ?? ''}
                      onChange={(e) =>
                        setFields((prev) => ({ ...prev, [field.label]: e.target.value }))
                      }
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                      placeholder={field.placeholder}
                    />
                  </label>
                ))}
              </div>
            )}

            {/* Prompt textarea */}
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={10}
              className="min-h-[220px] flex-1 resize-none rounded-[12px] border border-white/[0.08] bg-white/[0.02] px-5 py-4 text-sm text-white placeholder:text-white/20 focus:border-amber-500/30 focus:outline-none transition-colors"
              placeholder="프롬프트를 입력하세요"
            />

            {/* Run + reset row */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleRun}
                disabled={isGenerating}
                className="flex items-center gap-2 rounded-[10px] bg-amber-500 px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-amber-400 disabled:opacity-40 active:scale-[0.98]"
              >
                {isGenerating ? (
                  <><Loader2 size={14} className="animate-spin" /> 실행 중…</>
                ) : (
                  <><Sparkles size={14} /> 실행하기</>
                )}
              </button>
              <button
                onClick={() => setPrompt(lesson.defaultPrompt)}
                className="rounded-[10px] border border-white/[0.07] px-4 py-2.5 text-sm text-white/40 transition-colors hover:border-white/[0.12] hover:text-white/70"
              >
                기본 프롬프트
              </button>

              {/* 이미지 트랙 전용: 시작 이미지 생성 버튼 */}
              {isImageTrack && imagePrompt && (
                <button
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage}
                  className="flex items-center gap-2 rounded-[10px] border border-cyan-500/30 bg-cyan-500/10 px-5 py-2.5 text-sm font-semibold text-cyan-400 transition-all hover:bg-cyan-500/20 disabled:opacity-40 active:scale-[0.98]"
                >
                  {isGeneratingImage ? (
                    <><Loader2 size={14} className="animate-spin" /> 이미지 생성 중…</>
                  ) : (
                    <>🖼 시작 이미지 생성</>
                  )}
                </button>
              )}
            </div>

            {/* 이미지 프롬프트 미리보기 (이미지 트랙에서 텍스트 실행 후) */}
            {isImageTrack && imagePrompt && !imageUrl && (
              <div className="rounded-[10px] border border-cyan-500/15 bg-cyan-500/[0.04] px-4 py-3">
                <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-cyan-400/60">추출된 시작 이미지 프롬프트</p>
                <p className="text-xs text-white/55 leading-relaxed">{imagePrompt}</p>
                <p className="mt-2 text-[10px] text-cyan-400/50">위 &apos;시작 이미지 생성&apos; 버튼을 눌러 실제 이미지를 만들어보세요</p>
              </div>
            )}
          </section>

          {/* Right — OutputRail */}
          <div className="hidden w-[280px] flex-shrink-0 xl:block">
            <OutputRail
              title={result.title}
              rawText={rawText}
              sections={result.sections}
              qualityChecks={lesson.qualityChecks}
              outputFormat={lesson.outputFormat}
              isSaving={isSaving}
              onSave={handleSave}
              onRetry={handleRun}
              imageUrl={imageUrl ?? undefined}
              isGeneratingImage={isGeneratingImage}
            />
          </div>
        </div>
      </div>

      {/* Mobile output — below the fold */}
      <div className="xl:hidden border-t border-white/[0.05] px-6 py-6">
        <OutputRail
          title={result.title}
          rawText={rawText}
          sections={result.sections}
          qualityChecks={lesson.qualityChecks}
          outputFormat={lesson.outputFormat}
          isSaving={isSaving}
          onSave={handleSave}
          onRetry={handleRun}
          imageUrl={imageUrl ?? undefined}
          isGeneratingImage={isGeneratingImage}
        />
      </div>

      {/* Sticky retry bar */}
      <RetryActionBar onAction={appendToPrompt} disabled={isGenerating} />
    </div>
  );
}

/* ── 텍스트 결과에서 시작 이미지 프롬프트 추출 ─────────────────── */
function extractImagePrompt(text: string): string {
  // "시작 이미지 프롬프트" 섹션을 찾아서 첫 번째 의미있는 내용 추출
  const patterns = [
    /시작\s*이미지\s*프롬프트[:\n]+([\s\S]+?)(?:\n\n|\n[0-9]|\n[#*]|$)/i,
    /1[)\.]\s*시작\s*이미지[:\n]+([\s\S]+?)(?:\n\n|\n2[)\.]|$)/i,
    /start\s*image[:\n]+([\s\S]+?)(?:\n\n|\n[0-9]|$)/i,
    /image\s*prompt[:\n]+([\s\S]+?)(?:\n\n|\n[0-9]|$)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const extracted = match[1].trim().replace(/^["'`]+|["'`]+$/g, '').trim();
      if (extracted.length > 10) return extracted.slice(0, 600);
    }
  }

  // 패턴 미매칭 시 전체 텍스트 첫 2줄로 기본 프롬프트 생성
  const firstMeaningfulLine = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 20 && !l.startsWith('#') && !l.startsWith('-'))
    .slice(0, 2)
    .join('. ');

  return firstMeaningfulLine || text.slice(0, 300);
}
