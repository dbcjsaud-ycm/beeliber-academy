'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, ChevronRight, Copy, Loader2, RotateCcw, Sparkles } from 'lucide-react';
import { getLearnLesson } from '@/lib/lesson-data';

const lesson = getLearnLesson(4)!;

const EXAMPLE_DOC = `[회의록] 2026년 4월 5일 — 마케팅팀 주간회의

참석자: 김팀장, 이대리, 박인턴

논의 내용:
1. 다음 달 SNS 캠페인 일정 확정 — 4월 20일 시작
2. 광고 소재 제작은 이대리 담당, 4월 15일까지 초안 완료
3. 박인턴은 경쟁사 레퍼런스 5개 수집해서 4월 12일까지 공유
4. 예산은 김팀장이 CFO와 협의 후 4월 10일까지 확정
5. 다음 회의는 4월 12일 오전 10시`;

export default function LearnPage4() {
  const [doc, setDoc] = useState('');
  const [question, setQuestion] = useState('결정된 사항과 각자 해야 할 일을 정리해줘.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function buildPrompt() {
    const docBody = doc.trim() || EXAMPLE_DOC;
    return `다음 내용을 읽고, ${question}\n\n---\n${docBody}\n---`;
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

  return (
    <div className="mx-auto max-w-2xl px-6 pb-32 pt-12">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-1.5 text-xs text-white/30">
        <Link href="/start" className="hover:text-white/60 transition-colors">입문 허브</Link>
        <ChevronRight size={11} />
        <Link href="/learn/page-3" className="hover:text-white/60 transition-colors">레슨 3</Link>
        <ChevronRight size={11} />
        <span className="text-white/50">4 / 4</span>
      </div>

      {/* Header */}
      <div className="mb-10">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-amber-400/60">
          입문 과정 · 레슨 4
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

      {/* Doc input */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-medium text-white/40">문서 내용 붙여넣기</label>
          <button
            onClick={() => setDoc(EXAMPLE_DOC)}
            className="text-[11px] text-amber-400/60 hover:text-amber-400 transition-colors"
          >
            예시 회의록 사용 →
          </button>
        </div>
        <textarea
          value={doc}
          onChange={(e) => setDoc(e.target.value)}
          placeholder="PDF나 문서 내용을 여기 붙여넣으세요"
          rows={7}
          className="mb-4 w-full resize-none rounded-[10px] border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-amber-500/30 focus:outline-none focus:ring-0 transition-colors"
        />
      </div>

      {/* Question input */}
      <div className="mb-4">
        <label className="mb-2 block text-xs font-medium text-white/40">질문 / 요청</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="이 내용에서 무엇을 알고 싶으세요?"
          className="w-full rounded-[10px] border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-amber-500/30 focus:outline-none focus:ring-0 transition-colors"
        />
      </div>

      {/* Question chips */}
      <div className="mb-5">
        <p className="mb-2.5 text-[10px] font-medium uppercase tracking-wider text-white/30">질문 예시 — 클릭하면 질문 입력</p>
        <div className="flex flex-wrap gap-2">
          {lesson.promptChips.map((chip) => (
            <button
              key={chip}
              onClick={() => setQuestion(chip)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                question === chip
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
          <><Sparkles size={15} /> AI에게 질문하기</>
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

      {/* Completion */}
      {result && (
        <div className="rounded-[14px] border border-amber-500/20 bg-amber-500/[0.06] p-6 text-center">
          <CheckCircle size={28} className="mx-auto mb-3 text-amber-400" />
          <h3 className="mb-2 text-base font-bold text-white">입문 과정 완료!</h3>
          <p className="mb-5 text-sm text-white/50">AI 기초 4단계를 모두 마쳤습니다. 이제 실전 트랙으로 이동하세요.</p>
          <Link
            href="/tracks"
            className="inline-flex items-center gap-2 rounded-[10px] bg-amber-500 px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-amber-400 active:scale-[0.98]"
          >
            실전 트랙 선택하기 →
          </Link>
        </div>
      )}
    </div>
  );
}
