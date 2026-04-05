'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Copy, Loader2, RotateCcw, Sparkles } from 'lucide-react';
import { getLearnLesson } from '@/lib/lesson-data';

const lesson = getLearnLesson(1)!;

export default function LearnPage1() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRun() {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'AI_FAILED');
      setResult(json.data?.text ?? json.text ?? json.rawText ?? JSON.stringify(json));
    } catch (e) {
      setError('AI 실행 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pb-32 pt-12">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-1.5 text-xs text-white/30">
        <Link href="/start" className="hover:text-white/60 transition-colors">입문 허브</Link>
        <ChevronRight size={11} />
        <span className="text-white/50">1 / 4</span>
      </div>

      {/* Header */}
      <div className="mb-10">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-amber-400/60">
          입문 과정 · 레슨 1
        </p>
        <h1 className="mb-3 font-fraunces text-3xl font-black text-white lg:text-4xl">
          {lesson.title}
        </h1>
        <p className="text-sm text-white/40">{lesson.goal}</p>
      </div>

      {/* Professor Note */}
      <div className="mb-8 rounded-[12px] border border-amber-500/[0.15] bg-amber-500/[0.04] px-5 py-4">
        <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-amber-400/60">교수 가이드</p>
        <p className="text-sm leading-relaxed text-white/70">{lesson.professorNote}</p>
      </div>

      {/* Steps */}
      <div className="mb-8">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-white/30">따라하기</p>
        <ol className="space-y-2">
          {lesson.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-white/50">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-white/[0.08] font-mono text-[10px] text-white/30">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Prompt Chips */}
      <div className="mb-4">
        <p className="mb-2.5 text-[10px] font-medium uppercase tracking-wider text-white/30">예시 프롬프트</p>
        <div className="flex flex-wrap gap-2">
          {lesson.promptChips.map((chip) => (
            <button
              key={chip}
              onClick={() => setPrompt(chip)}
              className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/50 transition-colors hover:border-amber-500/30 hover:bg-amber-500/[0.06] hover:text-white/80"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="mb-4">
        <label className="mb-2 block text-xs font-medium text-white/40">{lesson.inputLabel}</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={lesson.inputPlaceholder}
          rows={4}
          className="w-full resize-none rounded-[10px] border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-amber-500/30 focus:outline-none focus:ring-0 transition-colors"
        />
      </div>

      {/* Run Button */}
      <button
        onClick={handleRun}
        disabled={isGenerating || !prompt.trim()}
        className="mb-6 flex w-full items-center justify-center gap-2 rounded-[10px] bg-amber-500 py-3 text-sm font-semibold text-black transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
      >
        {isGenerating ? (
          <><Loader2 size={15} className="animate-spin" /> AI 실행 중…</>
        ) : (
          <><Sparkles size={15} /> AI 실행하기</>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-[10px] border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mb-6 rounded-[12px] border border-white/[0.07] bg-white/[0.02] p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">AI 결과</p>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white/70"
              >
                <Copy size={11} />
                {copied ? '복사됨' : '복사'}
              </button>
              <button
                onClick={() => { setResult(null); handleRun(); }}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white/70"
              >
                <RotateCcw size={11} />
                다시 시키기
              </button>
            </div>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/80">{result}</p>
        </div>
      )}

      {/* Quality Checks */}
      {result && (
        <div className="mb-8 rounded-[10px] border border-white/[0.05] bg-white/[0.015] p-4">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-white/25">결과 체크리스트</p>
          <ul className="space-y-2">
            {lesson.qualityChecks.map((check) => (
              <li key={check} className="flex items-center gap-2.5 text-xs text-white/45">
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500/50" />
                {check}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Retry Bar */}
      {result && (
        <div className="mb-8">
          <p className="mb-2.5 text-[10px] font-medium uppercase tracking-wider text-white/25">다시 시키기</p>
          <div className="flex flex-wrap gap-2">
            {['더 짧게 줄여줘', '더 쉽게 설명해줘', '표로 정리해줘', '순서대로 번호 매겨줘'].map((action) => (
              <button
                key={action}
                onClick={() => { setPrompt(`${prompt}\n\n${action}`); }}
                className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-white/40 transition-colors hover:border-amber-500/25 hover:text-white/70"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Next */}
      <Link
        href={lesson.nextPage!}
        className="flex items-center justify-between rounded-[12px] border border-white/[0.07] bg-white/[0.02] px-5 py-4 transition-colors hover:border-amber-500/20 hover:bg-white/[0.04]"
      >
        <div>
          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">다음 레슨</p>
          <p className="text-sm font-medium text-white/70">AI에게 다시 시키는 법</p>
        </div>
        <ArrowRight size={15} className="text-amber-400/60" />
      </Link>
    </div>
  );
}
