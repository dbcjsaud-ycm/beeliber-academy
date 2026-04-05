'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Copy, Loader2, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { getLearnLesson } from '@/lib/lesson-data';

const lesson = getLearnLesson(1)!;

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

export default function LearnPage1() {
  // Step 1: 따라치기
  const [step1State, setStep1State] = useState<StepState>('idle');
  const [step1Result, setStep1Result] = useState<string | null>(null);

  // Step 2: 빈칸 채우기
  const [step2Topic, setStep2Topic] = useState('');
  const [step2State, setStep2State] = useState<StepState>('idle');
  const [step2Result, setStep2Result] = useState<string | null>(null);
  const [step2Unlocked, setStep2Unlocked] = useState(false);

  // Step 3: 자유 작성
  const [step3Prompt, setStep3Prompt] = useState('');
  const [step3State, setStep3State] = useState<StepState>('idle');
  const [step3Result, setStep3Result] = useState<string | null>(null);
  const [step3Unlocked, setStep3Unlocked] = useState(false);

  const [copied, setCopied] = useState<string | null>(null);

  // 완료된 단계 수
  const completedSteps = [step1State === 'done', step2State === 'done', step3State === 'done'].filter(Boolean).length;
  const allDone = completedSteps === 3;

  async function runStep1() {
    setStep1State('running');
    try {
      const result = await callAI(lesson.step1.modelPrompt);
      setStep1Result(result);
      setStep1State('done');
      setStep2Unlocked(true);
    } catch {
      setStep1State('idle');
    }
  }

  async function runStep2() {
    if (!step2Topic.trim()) return;
    const prompt = lesson.step2.template.replace('___', step2Topic.trim());
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

  async function addRetryChip(chip: string, currentPrompt: string, runner: (p: string) => void) {
    runner(`${currentPrompt}\n\n${chip}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pb-32 pt-12">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-1.5 text-xs text-white/30">
        <Link href="/start" className="hover:text-white/60 transition-colors">입문 허브</Link>
        <ChevronRight size={11} />
        <span className="text-white/50">1 / 4</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-400/60">
          입문 과정 · 레슨 1
        </p>
        <h1 className="mb-3 font-fraunces text-3xl font-black text-white lg:text-4xl">
          {lesson.title}
        </h1>
        <p className="mb-4 text-sm text-white/40">{lesson.subtitle}</p>
        {/* Outcome badges */}
        <div className="flex flex-wrap gap-2">
          {lesson.outcomeBadges.map((b) => (
            <span key={b} className="rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-2.5 py-1 text-[11px] text-emerald-400">
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
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${(completedSteps / 3) * 100}%` }}
          />
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1 text-center">
          {['따라치기', '빈칸 채우기', '자유 작성'].map((label, i) => (
            <p key={label} className={`text-[9px] transition-colors ${i < completedSteps ? 'text-emerald-400' : 'text-white/20'}`}>
              {i < completedSteps ? '✓ ' : ''}{label}
            </p>
          ))}
        </div>
      </div>

      {/* Guide cards */}
      <div className="mb-8 grid grid-cols-2 gap-3">
        {lesson.guideCards.map((card) => (
          <div
            key={card.title}
            className="rounded-[12px] p-4"
            style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
          >
            <p className="mb-2 text-[10px] font-semibold text-white/50">{card.title}</p>
            <ul className="space-y-1">
              {card.items.map((item) => (
                <li key={item} className="flex items-start gap-1.5 text-[11px] text-white/35">
                  <span className="mt-0.5 text-[9px]">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── STEP 1: 따라치기 ── */}
      <StepCard
        stepNo={1}
        label={lesson.step1.label}
        state={step1State}
        color="#34d399"
      >
        {/* Model prompt display */}
        <div
          className="mb-4 rounded-[10px] p-4 font-mono text-sm leading-relaxed text-white/60"
          style={{ border: '1px solid rgba(52,211,153,0.15)', background: 'rgba(52,211,153,0.04)' }}
        >
          {lesson.step1.modelPrompt}
        </div>
        <p className="mb-4 text-xs text-white/35">{lesson.step1.hint}</p>

        {step1State === 'idle' && (
          <button
            onClick={runStep1}
            className="flex w-full items-center justify-center gap-2 rounded-[10px] py-3 text-sm font-semibold text-black transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: '#34d399' }}
          >
            <Sparkles size={14} />
            이 질문 그대로 보내기
          </button>
        )}

        {step1State === 'running' && (
          <div className="flex items-center justify-center gap-2 py-3 text-sm text-white/40">
            <Loader2 size={14} className="animate-spin" /> AI 답변 생성 중…
          </div>
        )}

        {step1State === 'done' && step1Result && (
          <ResultBox
            result={step1Result}
            onCopy={() => handleCopy(step1Result, 'step1')}
            copied={copied === 'step1'}
            onRetry={runStep1}
            retryChips={lesson.retryChips}
            onChip={(chip) => addRetryChip(chip, lesson.step1.modelPrompt, async (p) => {
              setStep1State('running');
              try { setStep1Result(await callAI(p)); setStep1State('done'); } catch { setStep1State('done'); }
            })}
            qualityChecks={lesson.qualityChecks}
          />
        )}
      </StepCard>

      {/* ── STEP 2: 빈칸 채우기 ── */}
      <StepCard
        stepNo={2}
        label={lesson.step2.label}
        state={step2State}
        color="#f59e0b"
        locked={!step2Unlocked}
      >
        {/* Template display */}
        <div
          className="mb-4 flex items-center gap-2 rounded-[10px] p-4 font-mono text-sm"
          style={{ border: '1px solid rgba(245,158,11,0.15)', background: 'rgba(245,158,11,0.04)' }}
        >
          <span className="text-white/40">{lesson.step2.template.split('___')[0]}</span>
          <input
            value={step2Topic}
            onChange={(e) => setStep2Topic(e.target.value)}
            placeholder={lesson.step2.placeholder}
            className="min-w-0 flex-1 rounded-md border border-amber-500/30 bg-amber-500/[0.06] px-2.5 py-1.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-0"
            disabled={step2State === 'running'}
          />
          <span className="text-white/40">{lesson.step2.template.split('___')[1]}</span>
        </div>

        {/* Chips */}
        <div className="mb-4">
          <p className="mb-2 text-[10px] text-white/25">예시 주제 칩</p>
          <div className="flex flex-wrap gap-2">
            {['AI', '재테크', '건강 식단', '여행 준비', '시간 관리'].map((chip) => (
              <button
                key={chip}
                onClick={() => setStep2Topic(chip)}
                className="rounded-full border border-amber-500/20 bg-amber-500/[0.04] px-3 py-1.5 text-xs text-amber-400/70 transition-colors hover:bg-amber-500/[0.1] hover:text-amber-400"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <p className="mb-4 text-xs text-white/35">{lesson.step2.hint}</p>

        {step2State !== 'done' && (
          <button
            onClick={runStep2}
            disabled={!step2Topic.trim() || step2State === 'running'}
            className="flex w-full items-center justify-center gap-2 rounded-[10px] py-3 text-sm font-semibold text-black transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
            style={{ background: '#f59e0b' }}
          >
            {step2State === 'running' ? (
              <><Loader2 size={14} className="animate-spin" /> 실행 중…</>
            ) : (
              <><Sparkles size={14} /> 내 주제로 AI 실행</>
            )}
          </button>
        )}

        {step2State === 'done' && step2Result && (
          <ResultBox
            result={step2Result}
            onCopy={() => handleCopy(step2Result, 'step2')}
            copied={copied === 'step2'}
            onRetry={runStep2}
            retryChips={lesson.retryChips}
            onChip={(chip) => addRetryChip(chip, `${lesson.step2.template.replace('___', step2Topic)}\n\n${chip}`, async (p) => {
              setStep2State('running');
              try { setStep2Result(await callAI(p)); setStep2State('done'); } catch { setStep2State('done'); }
            })}
            qualityChecks={lesson.qualityChecks}
          />
        )}
      </StepCard>

      {/* ── STEP 3: 자유 작성 ── */}
      <StepCard
        stepNo={3}
        label={lesson.step3.label}
        state={step3State}
        color="#a78bfa"
        locked={!step3Unlocked}
      >
        {/* Prompt chips */}
        <div className="mb-3">
          <p className="mb-2 text-[10px] text-white/25">예시 프롬프트 칩</p>
          <div className="flex flex-wrap gap-2">
            {lesson.promptChips.map((chip) => (
              <button
                key={chip}
                onClick={() => setStep3Prompt(chip)}
                className="rounded-full border border-violet-500/20 bg-violet-500/[0.04] px-3 py-1.5 text-xs text-violet-400/70 transition-colors hover:bg-violet-500/[0.1] hover:text-violet-400"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={step3Prompt}
          onChange={(e) => setStep3Prompt(e.target.value)}
          placeholder={lesson.step3.placeholder}
          rows={3}
          disabled={step3State === 'running'}
          className="mb-2 w-full resize-none rounded-[10px] border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-violet-500/30 focus:outline-none focus:ring-0 transition-colors"
        />
        <p className="mb-4 text-[11px] text-white/25">{lesson.step3.hint}</p>

        {step3State !== 'done' && (
          <button
            onClick={runStep3}
            disabled={!step3Prompt.trim() || step3State === 'running'}
            className="flex w-full items-center justify-center gap-2 rounded-[10px] py-3 text-sm font-semibold text-black transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
            style={{ background: '#a78bfa' }}
          >
            {step3State === 'running' ? (
              <><Loader2 size={14} className="animate-spin" /> 실행 중…</>
            ) : (
              <><Sparkles size={14} /> 내 질문으로 AI 실행</>
            )}
          </button>
        )}

        {step3State === 'done' && step3Result && (
          <ResultBox
            result={step3Result}
            onCopy={() => handleCopy(step3Result, 'step3')}
            copied={copied === 'step3'}
            onRetry={runStep3}
            retryChips={lesson.retryChips}
            onChip={(chip) => addRetryChip(chip, step3Prompt, async (p) => {
              setStep3State('running');
              try { setStep3Result(await callAI(p)); setStep3State('done'); } catch { setStep3State('done'); }
            })}
            qualityChecks={lesson.qualityChecks}
          />
        )}
      </StepCard>

      {/* ── 완료 CTA ── */}
      {allDone ? (
        <div
          className="rounded-[16px] p-6 text-center"
          style={{ border: '1px solid rgba(52,211,153,0.2)', background: 'rgba(52,211,153,0.06)' }}
        >
          <p className="mb-1 text-2xl">🎉</p>
          <p className="mb-1 text-base font-semibold text-white">레슨 1 완료!</p>
          <p className="mb-5 text-sm text-white/40">3단계를 모두 마쳤어요. 다음엔 같은 질문을 더 잘 나오게 바꾸는 법을 배울게요.</p>
          <Link
            href={lesson.nextPage!}
            className="inline-flex items-center gap-2 rounded-[10px] px-6 py-3 text-sm font-semibold text-black transition-all hover:opacity-90"
            style={{ background: '#34d399' }}
          >
            레슨 2: {lesson.nextTitle}
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <Link
          href={lesson.nextPage!}
          className="flex items-center justify-between rounded-[12px] border border-white/[0.07] bg-white/[0.02] px-5 py-4 transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]"
        >
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

// ── Sub-components ──

function StepCard({
  stepNo,
  label,
  state,
  color,
  locked = false,
  children,
}: {
  stepNo: number;
  label: string;
  state: StepState;
  color: string;
  locked?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`mb-6 rounded-[16px] p-5 transition-all ${locked ? 'opacity-40 pointer-events-none select-none' : ''}`}
      style={{
        border: `1px solid ${state === 'done' ? color + '30' : 'rgba(255,255,255,0.07)'}`,
        background: state === 'done' ? color + '06' : 'rgba(255,255,255,0.02)',
      }}
    >
      {/* Step header */}
      <div className="mb-4 flex items-center gap-3">
        <span
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
          style={{
            background: state === 'done' ? color + '20' : 'rgba(255,255,255,0.05)',
            color: state === 'done' ? color : 'rgba(255,255,255,0.3)',
            border: `1px solid ${state === 'done' ? color + '40' : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          {state === 'done' ? '✓' : stepNo}
        </span>
        <div className="flex-1">
          <p className="text-[9px] text-white/25">STEP {stepNo}</p>
          <p className="text-xs font-semibold text-white/60">{label}</p>
        </div>
        {locked && <span className="text-[10px] text-white/20">🔒 이전 단계 완료 후 열림</span>}
      </div>
      {children}
    </div>
  );
}

function ResultBox({
  result,
  onCopy,
  copied,
  onRetry,
  retryChips,
  onChip,
  qualityChecks,
}: {
  result: string;
  onCopy: () => void;
  copied: boolean;
  onRetry: () => void;
  retryChips: string[];
  onChip: (chip: string) => void;
  qualityChecks: string[];
}) {
  return (
    <div className="mt-4 space-y-3">
      {/* Result */}
      <div className="rounded-[10px] border border-white/[0.07] bg-white/[0.02] p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">AI 답변</p>
          <div className="flex gap-2">
            <button
              onClick={onCopy}
              className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-white/35 transition-colors hover:bg-white/[0.05] hover:text-white/60"
            >
              <Copy size={10} />
              {copied ? '복사됨' : '복사'}
            </button>
            <button
              onClick={onRetry}
              className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-white/35 transition-colors hover:bg-white/[0.05] hover:text-white/60"
            >
              <RotateCcw size={10} />
              다시
            </button>
          </div>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/75">{result}</p>
      </div>

      {/* Quality checks */}
      <div className="rounded-[10px] border border-white/[0.05] bg-white/[0.01] p-3">
        <p className="mb-2 text-[9px] text-white/25">체크리스트</p>
        <div className="space-y-1.5">
          {qualityChecks.map((check) => (
            <label key={check} className="flex cursor-pointer items-center gap-2 text-[11px] text-white/40 hover:text-white/60">
              <input type="checkbox" className="accent-amber-500" />
              {check}
            </label>
          ))}
        </div>
      </div>

      {/* Retry chips */}
      <div>
        <p className="mb-2 text-[9px] text-white/25">다시 시키기</p>
        <div className="flex flex-wrap gap-1.5">
          {retryChips.map((chip) => (
            <button
              key={chip}
              onClick={() => onChip(chip)}
              className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[11px] text-white/40 transition-colors hover:border-white/[0.12] hover:text-white/70"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
