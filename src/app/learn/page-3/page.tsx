'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Copy, Loader2, RotateCcw, Sparkles } from 'lucide-react';
import { getLearnLesson } from '@/lib/lesson-data';

const lesson = getLearnLesson(3)!;

export default function LearnPage3() {
  const [text, setText] = useState('');
  const [command, setCommand] = useState('3줄로 요약해줘');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function buildPrompt() {
    const body = text.trim() || lesson.examplePrompt.split('---')[1]?.trim() || '';
    return `다음 텍스트를 ${command}.\n\n---\n${body}\n---`;
  }

  async function handleRun() {
    setIsGenerating(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: buildPrompt() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'AI_FAILED');
      setResult(json.data?.text ?? json.text ?? json.rawText ?? JSON.stringify(json));
    } catch {
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

  const EXAMPLE_TEXT = `인공지능(AI)은 컴퓨터가 인간의 지능적 행동을 모방할 수 있도록 하는 기술입니다.
머신러닝, 딥러닝, 자연어처리 등 다양한 분야를 포함하며, 최근 챗봇, 이미지 생성,
자동화 도구 등 일상 속 다양한 서비스에 활용되고 있습니다.
특히 생성형 AI는 텍스트, 이미지, 코드 등 새로운 콘텐츠를 만들어내는 능력으로
주목받고 있으며, 교육, 의료, 금융 등 여러 산업에서 혁신적인 변화를 이끌고 있습니다.`;

  return (
    <div className="mx-auto max-w-2xl px-6 pb-32 pt-12">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-1.5 text-xs text-white/30">
        <Link href="/start" className="hover:text-white/60 transition-colors">입문 허브</Link>
        <ChevronRight size={11} />
        <Link href="/learn/page-2" className="hover:text-white/60 transition-colors">레슨 2</Link>
        <ChevronRight size={11} />
        <span className="text-white/50">3 / 4</span>
      </div>

      {/* Header */}
      <div className="mb-10">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-amber-400/60">
          입문 과정 · 레슨 3
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

      {/* Example text shortcut */}
      <div className="mb-4 flex items-center justify-between">
        <label className="text-xs font-medium text-white/40">{lesson.inputLabel}</label>
        <button
          onClick={() => setText(EXAMPLE_TEXT)}
          className="text-[11px] text-amber-400/60 hover:text-amber-400 transition-colors"
        >
          예시 글 붙여넣기 →
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={lesson.inputPlaceholder}
        rows={7}
        className="mb-4 w-full resize-none rounded-[10px] border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-amber-500/30 focus:outline-none focus:ring-0 transition-colors"
      />

      {/* Command chips */}
      <div className="mb-5">
        <p className="mb-2.5 text-[10px] font-medium uppercase tracking-wider text-white/30">정리 방식 선택</p>
        <div className="flex flex-wrap gap-2">
          {lesson.promptChips.map((chip) => (
            <button
              key={chip}
              onClick={() => setCommand(chip)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                command === chip
                  ? 'border-amber-500/40 bg-amber-500/[0.1] text-amber-300'
                  : 'border-white/[0.08] bg-white/[0.03] text-white/50 hover:border-amber-500/25 hover:text-white/80'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Run Button */}
      <button
        onClick={handleRun}
        disabled={isGenerating}
        className="mb-6 flex w-full items-center justify-center gap-2 rounded-[10px] bg-amber-500 py-3 text-sm font-semibold text-black transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
      >
        {isGenerating ? (
          <><Loader2 size={15} className="animate-spin" /> AI 실행 중…</>
        ) : (
          <><Sparkles size={15} /> AI로 정리하기</>
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
                onClick={handleRun}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white/70"
              >
                <RotateCcw size={11} />
                다시 실행
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

      {/* Next */}
      <Link
        href={lesson.nextPage!}
        className="flex items-center justify-between rounded-[12px] border border-white/[0.07] bg-white/[0.02] px-5 py-4 transition-colors hover:border-amber-500/20 hover:bg-white/[0.04]"
      >
        <div>
          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">다음 레슨</p>
          <p className="text-sm font-medium text-white/70">파일 내용 가지고 질문하기</p>
        </div>
        <ArrowRight size={15} className="text-amber-400/60" />
      </Link>
    </div>
  );
}
