'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Copy, Loader2, Sparkles, RotateCcw } from 'lucide-react';
import { getLearnLesson } from '@/lib/lesson-data';

const lesson = getLearnLesson(2)!;

type StepState = 'idle' | 'running' | 'done';

async function callAI(prompt: string): Promise<string> {
  const res = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'AI_FAILED');
  return json.data?.text ?? json.text ?? json.rawText ?? JSON.stringify(json);
}

const BEFORE_AFTER = [
  { label: '원본', prompt: '운동 계획 알려줘.' },
  { label: '짧게', prompt: '운동 계획 알려줘. 더 짧게 줄여줘.' },
  { label: '표로', prompt: '운동 계획 알려줘. 표로 정리해줘.' },
  { label: '쉽게', prompt: '운동 계획 알려줘. 초보자도 이해하게 쉽게.' },
];

export default function LearnPage2() {
  // Step 1: 따라치기 (Before/After 비교)
  const [baIdx, setBaIdx] = useState(0);
  const [step1State, setStep1State] = useState<StepState>('idle');
  const [step1Results, setStep1Results] = useState<Record<number, string>>({});

  // Step 2: 수식어 붙이기
  const [step2Modifier, setStep2Modifier] = useState('');
  const [step2State, setStep2State] = useState<StepState>('idle');
  const [step2Result, setStep2Result] = useState<string | null>(null);
  const [step2Unlocked, setStep2Unlocked] = useState(false);

  // Step 3: 자유 작성
  const [step3Prompt, setStep3Prompt] = useState('');
  const [step3State, setStep3State] = useState<StepState>('idle');
  const [step3Result, setStep3Result] = useState<string | null>(null);
  const [step3Unlocked, setStep3Unlocked] = useState(false);

  const [copied, setCopied] = useState<string | null>(null);

  const completedSteps = [step1State === 'done', step2State === 'done', step3State === 'done'].filter(Boolean).length;
  const allDone = completedSteps === 3;

  async function runBA(idx: number) {
    setBaIdx(idx);
    if (step1Results[idx]) return; // cached
    setStep1State('running');
    try {
      const result = await callAI(BEFORE_AFTER[idx].prompt);
      setStep1Results((prev) => ({ ...prev, [idx]: result }));
      setStep1State('done');
      if (idx >= 1) setStep2Unlocked(true);
    } catch {
      setStep1State('idle');
    }
  }

  async function runStep2() {
    if (!step2Modifier.trim()) return;
    const prompt = `재택근무 장단점을 설명해줘. ${step2Modifier.trim()}`;
    setStep2State('running');
    try {
      const result = await callAI(prompt);
      setStep2Result(result);
      setStep2State('done');
      setStep3Unlocked(true);
    } catch {
      setStep2State('idle');
    }
  }

  async function runStep3() {
    if (!step3Prompt.trim()) return;
    setStep3State('running');
    try {
      const result = await callAI(step3Prompt);
      setStep3Result(result);
      setStep3State('done');
    } catch {
      setStep3State('idle');
    }
  }

  async function handleCopy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pb-32 pt-12">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-1.5 text-xs text-white/30">
        <Link href="/start" className="hover:text-white/60 transition-colors">입문 허브</Link>
        <ChevronRight size={11} />
        <span className="text-white/50">2 / 4</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-amber-400/60">입문 과정 · 레슨 2</p>
        <h1 className="mb-3 font-fraunces text-3xl font-black text-white lg:text-4xl">{lesson.title}</h1>
        <p className="mb-4 text-sm text-white/40">{lesson.subtitle}</p>
        <div className="flex flex-wrap gap-2">
          {lesson.outcomeBadges.map((b) => (
            <span key={b} className="rounded-full border border-amber-500/20 bg-amber-500/[0.06] px-2.5 py-1 text-[11px] text-amber-400">
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] text-white/25">오늘의 연습</p>
          <p className="text-[10px] font-medium text-white/40">{completedSteps} / 3 완료</p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-full rounded-full bg-amber-500 transition-all duration-500" style={{ width: `${(completedSteps / 3) * 100}%` }} />
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1 text-center">
          {['Before/After 비교', '수식어 연습', '자유 작성'].map((label, i) => (
            <p key={label} className={`text-[9px] transition-colors ${i < completedSteps ? 'text-amber-400' : 'text-white/20'}`}>
              {i < completedSteps ? '✓ ' : ''}{label}
            </p>
          ))}
        </div>
      </div>

      {/* Guide cards */}
      <div className="mb-8 grid grid-cols-2 gap-3">
        {lesson.guideCards.map((card) => (
          <div key={card.title} className="rounded-[12px] p-4" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            <p className="mb-2 text-[10px] font-semibold text-white/50">{card.title}</p>
            <ul className="space-y-1">
              {card.items.map((item) => (
                <li key={item} className="flex items-start gap-1.5 text-[11px] text-white/35">
                  <span className="mt-0.5 text-[9px]">·</span>{item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── STEP 1: Before/After 따라치기 ── */}
      <div
        className="mb-6 rounded-[16px] p-5"
        style={{
          border: `1px solid ${step1State === 'done' ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.07)'}`,
          background: step1State === 'done' ? 'rgba(245,158,11,0.04)' : 'rgba(255,255,255,0.02)',
        }}
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border text-xs font-bold"
            style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
            {step1State === 'done' ? '✓' : '1'}
          </span>
          <div>
            <p className="text-[9px] text-white/25">STEP 1</p>
            <p className="text-xs font-semibold text-white/60">{lesson.step1.label}</p>
          </div>
        </div>

        {/* Before/After 탭 */}
        <div className="mb-4">
          <p className="mb-2 text-[10px] text-white/30">같은 질문, 수식어만 달라요 — 탭을 눌러 비교해보세요</p>
          <div className="grid grid-cols-4 gap-1.5 mb-4">
            {BEFORE_AFTER.map((ba, i) => (
              <button
                key={ba.label}
                onClick={() => runBA(i)}
                className="rounded-[8px] py-2 text-[11px] font-medium transition-all"
                style={baIdx === i
                  ? { background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }
                  : { background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.06)' }
                }
              >
                {ba.label}
                {step1Results[i] && <span className="ml-1 text-[8px] opacity-60">✓</span>}
              </button>
            ))}
          </div>

          {/* Current prompt display */}
          <div className="mb-3 rounded-[10px] p-3 font-mono text-sm text-white/60"
            style={{ border: '1px solid rgba(245,158,11,0.12)', background: 'rgba(245,158,11,0.03)' }}>
            {BEFORE_AFTER[baIdx].prompt}
          </div>

          {/* Run button */}
          {!step1Results[baIdx] && (
            <button
              onClick={() => runBA(baIdx)}
              disabled={step1State === 'running'}
              className="flex w-full items-center justify-center gap-2 rounded-[10px] py-2.5 text-sm font-semibold text-black transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: '#f59e0b' }}
            >
              {step1State === 'running' ? <><Loader2 size={13} className="animate-spin" /> 실행 중…</> : <><Sparkles size={13} /> 실행하기</>}
            </button>
          )}

          {/* Result display */}
          {step1Results[baIdx] && (
            <div className="rounded-[10px] border border-white/[0.07] bg-white/[0.02] p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] text-white/30">AI 답변 ({BEFORE_AFTER[baIdx].label})</p>
                <button onClick={() => handleCopy(step1Results[baIdx], `ba${baIdx}`)}
                  className="text-[11px] text-white/35 hover:text-white/60 transition-colors">
                  <Copy size={10} className="inline mr-1" />{copied === `ba${baIdx}` ? '복사됨' : '복사'}
                </button>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/75">{step1Results[baIdx]}</p>
            </div>
          )}

          {Object.keys(step1Results).length >= 2 && step1State !== 'done' && (
            <button onClick={() => setStep1State('done')}
              className="mt-3 w-full rounded-[8px] py-2 text-xs text-amber-400 border border-amber-500/20 bg-amber-500/[0.05] transition-colors hover:bg-amber-500/[0.1]">
              ✓ 비교 완료 — 다음 단계로
            </button>
          )}
        </div>
      </div>

      {/* ── STEP 2: 수식어 붙이기 ── */}
      <div
        className={`mb-6 rounded-[16px] p-5 transition-all ${!step2Unlocked ? 'opacity-40 pointer-events-none' : ''}`}
        style={{
          border: `1px solid ${step2State === 'done' ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.07)'}`,
          background: step2State === 'done' ? 'rgba(245,158,11,0.04)' : 'rgba(255,255,255,0.02)',
        }}
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border text-xs font-bold"
            style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
            {step2State === 'done' ? '✓' : '2'}
          </span>
          <div>
            <p className="text-[9px] text-white/25">STEP 2</p>
            <p className="text-xs font-semibold text-white/60">{lesson.step2.label}</p>
          </div>
          {!step2Unlocked && <span className="ml-auto text-[10px] text-white/20">🔒</span>}
        </div>

        {/* Template builder */}
        <div className="mb-4 rounded-[10px] p-4" style={{ border: '1px solid rgba(245,158,11,0.12)', background: 'rgba(245,158,11,0.03)' }}>
          <p className="mb-2 text-[11px] text-amber-400/70 font-mono">재택근무 장단점을 설명해줘. <span className="underline underline-offset-2">___</span></p>
          <p className="mb-2 text-[10px] text-white/25">아래 수식어 칩을 클릭하거나 직접 입력하세요</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {lesson.promptChips.map((chip) => (
              <button key={chip}
                onClick={() => setStep2Modifier(chip)}
                className={`rounded-full px-3 py-1.5 text-xs transition-colors ${step2Modifier === chip ? 'text-amber-400' : 'text-white/40 hover:text-white/70'}`}
                style={step2Modifier === chip
                  ? { background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)' }
                  : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }
                }>
                {chip}
              </button>
            ))}
          </div>
          <input
            value={step2Modifier}
            onChange={(e) => setStep2Modifier(e.target.value)}
            placeholder="직접 입력해도 됩니다"
            className="w-full rounded-[8px] border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-amber-500/30 focus:outline-none"
          />
        </div>

        {step2State !== 'done' && (
          <button
            onClick={runStep2}
            disabled={!step2Modifier.trim() || step2State === 'running'}
            className="flex w-full items-center justify-center gap-2 rounded-[10px] py-3 text-sm font-semibold text-black transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: '#f59e0b' }}
          >
            {step2State === 'running' ? <><Loader2 size={14} className="animate-spin" /> 실행 중…</> : <><Sparkles size={14} /> 수식어 붙여서 실행</>}
          </button>
        )}

        {step2State === 'done' && step2Result && (
          <div className="mt-3 rounded-[10px] border border-white/[0.07] bg-white/[0.02] p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] text-white/30">수정된 답변</p>
              <div className="flex gap-2">
                <button onClick={() => handleCopy(step2Result!, 'step2')} className="text-[11px] text-white/35 hover:text-white/60">
                  <Copy size={10} className="inline mr-1" />{copied === 'step2' ? '복사됨' : '복사'}
                </button>
                <button onClick={() => setStep2State('idle')} className="text-[11px] text-white/35 hover:text-white/60">
                  <RotateCcw size={10} className="inline mr-1" />다시
                </button>
              </div>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/75">{step2Result}</p>
          </div>
        )}
      </div>

      {/* ── STEP 3: 자유 작성 ── */}
      <div
        className={`mb-6 rounded-[16px] p-5 transition-all ${!step3Unlocked ? 'opacity-40 pointer-events-none' : ''}`}
        style={{
          border: `1px solid ${step3State === 'done' ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.07)'}`,
          background: step3State === 'done' ? 'rgba(245,158,11,0.04)' : 'rgba(255,255,255,0.02)',
        }}
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border text-xs font-bold"
            style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' }}>
            {step3State === 'done' ? '✓' : '3'}
          </span>
          <div>
            <p className="text-[9px] text-white/25">STEP 3</p>
            <p className="text-xs font-semibold text-white/60">{lesson.step3.label}</p>
          </div>
          {!step3Unlocked && <span className="ml-auto text-[10px] text-white/20">🔒</span>}
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          {lesson.retryChips.map((chip) => (
            <button key={chip} onClick={() => setStep3Prompt((p) => p ? `${p} ${chip}` : chip)}
              className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-white/40 transition-colors hover:border-violet-500/25 hover:text-violet-400">
              {chip}
            </button>
          ))}
        </div>

        <textarea
          value={step3Prompt}
          onChange={(e) => setStep3Prompt(e.target.value)}
          placeholder={lesson.step3.placeholder}
          rows={3}
          disabled={step3State === 'running'}
          className="mb-2 w-full resize-none rounded-[10px] border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-violet-500/30 focus:outline-none transition-colors"
        />
        <p className="mb-4 text-[11px] text-white/25">{lesson.step3.hint}</p>

        {step3State !== 'done' && (
          <button
            onClick={runStep3}
            disabled={!step3Prompt.trim() || step3State === 'running'}
            className="flex w-full items-center justify-center gap-2 rounded-[10px] py-3 text-sm font-semibold text-black transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: '#a78bfa' }}
          >
            {step3State === 'running' ? <><Loader2 size={14} className="animate-spin" /> 실행 중…</> : <><Sparkles size={14} /> 내 방식으로 AI 실행</>}
          </button>
        )}

        {step3State === 'done' && step3Result && (
          <div className="mt-3 rounded-[10px] border border-white/[0.07] bg-white/[0.02] p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] text-white/30">AI 답변</p>
              <button onClick={() => handleCopy(step3Result!, 'step3')} className="text-[11px] text-white/35 hover:text-white/60">
                <Copy size={10} className="inline mr-1" />{copied === 'step3' ? '복사됨' : '복사'}
              </button>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/75">{step3Result}</p>
          </div>
        )}
      </div>

      {/* 완료 CTA */}
      {allDone ? (
        <div className="rounded-[16px] p-6 text-center" style={{ border: '1px solid rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.06)' }}>
          <p className="mb-1 text-2xl">⚡</p>
          <p className="mb-1 text-base font-semibold text-white">레슨 2 완료!</p>
          <p className="mb-5 text-sm text-white/40">수식어로 결과를 바꾸는 법을 익혔어요. 다음엔 긴 글을 AI로 정리합니다.</p>
          <Link href={lesson.nextPage!}
            className="inline-flex items-center gap-2 rounded-[10px] px-6 py-3 text-sm font-semibold text-black transition-all hover:opacity-90"
            style={{ background: '#f59e0b' }}>
            레슨 3: {lesson.nextTitle} <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <Link href={lesson.nextPage!}
          className="flex items-center justify-between rounded-[12px] border border-white/[0.07] bg-white/[0.02] px-5 py-4 transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]">
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">다음 레슨</p>
            <p className="text-sm font-medium text-white/70">{lesson.nextTitle}</p>
          </div>
          <ArrowRight size={15} className="text-white/30" />
        </Link>
      )}
    </div>
  );
}
