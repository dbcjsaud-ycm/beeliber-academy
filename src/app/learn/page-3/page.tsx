'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Copy, Loader2, Sparkles, RotateCcw } from 'lucide-react';
import { getLearnLesson } from '@/lib/lesson-data';

const lesson = getLearnLesson(3)!;

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

const TRANSFORMS = [
  { id: 'summary', label: '3줄 요약', chip: '핵심만 3줄로 요약해줘.', color: '#06b6d4' },
  { id: 'easy', label: '쉬운 설명', chip: '초등학생도 이해할 수 있게 쉽게 설명해줘.', color: '#34d399' },
  { id: 'bullets', label: '핵심 bullet', chip: '핵심 내용을 bullet 포인트로 정리해줘.', color: '#f59e0b' },
];

const EXAMPLE_TEXT = `인공지능(AI)은 컴퓨터가 인간의 지능적 행동을 모방할 수 있도록 하는 기술입니다. 머신러닝, 딥러닝, 자연어처리 등 다양한 분야를 포함하며, 최근 챗봇, 이미지 생성, 자동화 도구 등 일상 속 다양한 서비스에 활용되고 있습니다. 특히 생성형 AI는 텍스트, 이미지, 코드 등 새로운 콘텐츠를 만들어내는 능력으로 주목받고 있으며, 교육, 의료, 금융 등 여러 산업에서 혁신적인 변화를 이끌고 있습니다.`;

export default function LearnPage3() {
  const [activeTransform, setActiveTransform] = useState(0);
  const [step1Results, setStep1Results] = useState<Record<string, string>>({});
  const [step1Running, setStep1Running] = useState<string | null>(null);
  const [step1Done, setStep1Done] = useState(false);

  const [step2Text, setStep2Text] = useState('');
  const [step2Transform, setStep2Transform] = useState('');
  const [step2State, setStep2State] = useState<StepState>('idle');
  const [step2Result, setStep2Result] = useState<string | null>(null);
  const [step2Unlocked, setStep2Unlocked] = useState(false);

  const [step3Prompt, setStep3Prompt] = useState('');
  const [step3State, setStep3State] = useState<StepState>('idle');
  const [step3Result, setStep3Result] = useState<string | null>(null);
  const [step3Unlocked, setStep3Unlocked] = useState(false);

  const [copied, setCopied] = useState<string | null>(null);

  const completedSteps = [step1Done, step2State === 'done', step3State === 'done'].filter(Boolean).length;
  const allDone = completedSteps === 3;

  async function runTransform(idx: number) {
    const t = TRANSFORMS[idx];
    setActiveTransform(idx);
    if (step1Results[t.id]) return;
    setStep1Running(t.id);
    try {
      const prompt = `다음 글을\n\n---\n${EXAMPLE_TEXT}\n---\n\n${t.chip}`;
      const result = await callAI(prompt);
      const updated = { ...step1Results, [t.id]: result };
      setStep1Results(updated);
      if (Object.keys(updated).length >= 2) {
        setStep1Done(true);
        setStep2Unlocked(true);
      }
    } finally {
      setStep1Running(null);
    }
  }

  async function runStep2() {
    if (!step2Text.trim() || !step2Transform.trim()) return;
    const prompt = `다음 글을\n\n---\n${step2Text.trim()}\n---\n\n${step2Transform}`;
    setStep2State('running');
    try {
      setStep2Result(await callAI(prompt));
      setStep2State('done');
      setStep3Unlocked(true);
    } catch { setStep2State('idle'); }
  }

  async function runStep3() {
    if (!step3Prompt.trim()) return;
    setStep3State('running');
    try {
      setStep3Result(await callAI(step3Prompt));
      setStep3State('done');
    } catch { setStep3State('idle'); }
  }

  async function handleCopy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  const ct = TRANSFORMS[activeTransform];

  return (
    <div className="mx-auto max-w-2xl px-6 pb-32 pt-12">
      <div className="mb-6 flex items-center gap-1.5 text-xs text-white/30">
        <Link href="/start" className="hover:text-white/60 transition-colors">입문 허브</Link>
        <ChevronRight size={11} /><span className="text-white/50">3 / 4</span>
      </div>

      <div className="mb-6">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-400/60">입문 과정 · 레슨 3</p>
        <h1 className="mb-3 font-fraunces text-3xl font-black text-white lg:text-4xl">{lesson.title}</h1>
        <p className="mb-4 text-sm text-white/40">{lesson.subtitle}</p>
        <div className="flex flex-wrap gap-2">
          {lesson.outcomeBadges.map((b) => (
            <span key={b} className="rounded-full border border-cyan-500/20 bg-cyan-500/[0.06] px-2.5 py-1 text-[11px] text-cyan-400">{b}</span>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] text-white/25">오늘의 연습</p>
          <p className="text-[10px] font-medium text-white/40">{completedSteps} / 3 완료</p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-full rounded-full bg-cyan-500 transition-all duration-500" style={{ width: `${(completedSteps / 3) * 100}%` }} />
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1 text-center">
          {['예시 글 3가지 변환', '내 글 붙여넣기', '자유 작성'].map((label, i) => (
            <p key={label} className={`text-[9px] ${i < completedSteps ? 'text-cyan-400' : 'text-white/20'}`}>
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

      {/* ── STEP 1: 3가지 변환 ── */}
      <div className="mb-6 rounded-[16px] p-5" style={{
        border: `1px solid ${step1Done ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.07)'}`,
        background: step1Done ? 'rgba(6,182,212,0.04)' : 'rgba(255,255,255,0.02)',
      }}>
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold"
            style={{ background: 'rgba(6,182,212,0.1)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.3)' }}>
            {step1Done ? '✓' : '1'}
          </span>
          <div>
            <p className="text-[9px] text-white/25">STEP 1</p>
            <p className="text-xs font-semibold text-white/60">{lesson.step1.label}</p>
          </div>
        </div>

        <div className="mb-4 rounded-[10px] p-4 text-sm leading-relaxed text-white/45"
          style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <p className="mb-2 text-[9px] text-white/25">원문 — AI란 무엇인가</p>
          {EXAMPLE_TEXT}
        </div>

        {/* Transform tabs */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          {TRANSFORMS.map((t, i) => (
            <button key={t.id} onClick={() => runTransform(i)} disabled={step1Running === t.id}
              className="rounded-[10px] py-2.5 text-xs font-medium transition-all"
              style={activeTransform === i
                ? { background: t.color + '18', color: t.color, border: `1px solid ${t.color}35` }
                : { background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.07)' }
              }>
              {step1Running === t.id && <Loader2 size={10} className="inline animate-spin mr-1" />}
              {t.label}
              {step1Results[t.id] && <span className="ml-1 opacity-50 text-[9px]">✓</span>}
            </button>
          ))}
        </div>

        {!step1Results[ct.id] && step1Running !== ct.id && (
          <button onClick={() => runTransform(activeTransform)}
            className="flex w-full items-center justify-center gap-2 rounded-[10px] py-2.5 text-sm font-semibold text-black transition-all hover:opacity-90"
            style={{ background: ct.color }}>
            <Sparkles size={13} /> {ct.label}로 변환하기
          </button>
        )}

        {step1Results[ct.id] && (
          <div className="rounded-[10px] border border-white/[0.07] bg-white/[0.02] p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] text-white/30">{ct.label} 결과</p>
              <button onClick={() => handleCopy(step1Results[ct.id], `t${ct.id}`)}
                className="text-[11px] text-white/35 hover:text-white/60">
                <Copy size={10} className="inline mr-1" />
                {copied === `t${ct.id}` ? '복사됨' : '복사'}
              </button>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/75">{step1Results[ct.id]}</p>
          </div>
        )}

        {Object.keys(step1Results).length >= 2 && !step1Done && (
          <button onClick={() => { setStep1Done(true); setStep2Unlocked(true); }}
            className="mt-3 w-full rounded-[8px] py-2 text-xs text-cyan-400 border border-cyan-500/20 bg-cyan-500/[0.05] hover:bg-cyan-500/[0.1]">
            ✓ 3가지 비교 완료 — 다음 단계로
          </button>
        )}
      </div>

      {/* ── STEP 2: 내 글 붙여넣기 ── */}
      <div className={`mb-6 rounded-[16px] p-5 transition-all ${!step2Unlocked ? 'opacity-40 pointer-events-none' : ''}`}
        style={{ border: `1px solid ${step2State === 'done' ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.07)'}`, background: step2State === 'done' ? 'rgba(6,182,212,0.04)' : 'rgba(255,255,255,0.02)' }}>
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold"
            style={{ background: 'rgba(6,182,212,0.1)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.3)' }}>
            {step2State === 'done' ? '✓' : '2'}
          </span>
          <div>
            <p className="text-[9px] text-white/25">STEP 2</p>
            <p className="text-xs font-semibold text-white/60">{lesson.step2.label}</p>
          </div>
          {!step2Unlocked && <span className="ml-auto text-[10px] text-white/20">🔒</span>}
        </div>

        <textarea value={step2Text} onChange={(e) => setStep2Text(e.target.value)}
          placeholder="뉴스 기사, 공지사항, 긴 메일 등 정리하고 싶은 글을 붙여넣으세요"
          rows={4} className="mb-3 w-full resize-none rounded-[10px] border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/30 focus:outline-none transition-colors" />

        <div className="mb-3">
          <p className="mb-2 text-[10px] text-white/25">어떻게 정리할까요?</p>
          <div className="flex flex-wrap gap-2">
            {lesson.promptChips.map((chip) => (
              <button key={chip} onClick={() => setStep2Transform(chip)}
                className={`rounded-full px-3 py-1.5 text-xs transition-colors ${step2Transform === chip ? 'text-cyan-400' : 'text-white/40 hover:text-white/70'}`}
                style={step2Transform === chip
                  ? { background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)' }
                  : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }
                }>{chip}</button>
            ))}
          </div>
        </div>

        {step2State !== 'done' && (
          <button onClick={runStep2} disabled={!step2Text.trim() || !step2Transform.trim() || step2State === 'running'}
            className="flex w-full items-center justify-center gap-2 rounded-[10px] py-3 text-sm font-semibold text-black transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: '#06b6d4' }}>
            {step2State === 'running' ? <><Loader2 size={14} className="animate-spin" /> 변환 중…</> : <><Sparkles size={14} /> 내 글 변환하기</>}
          </button>
        )}

        {step2State === 'done' && step2Result && (
          <div className="mt-3 rounded-[10px] border border-white/[0.07] bg-white/[0.02] p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] text-white/30">변환 결과</p>
              <div className="flex gap-2">
                <button onClick={() => handleCopy(step2Result!, 's2')} className="text-[11px] text-white/35 hover:text-white/60"><Copy size={10} className="inline mr-1" />{copied === 's2' ? '복사됨' : '복사'}</button>
                <button onClick={() => setStep2State('idle')} className="text-[11px] text-white/35 hover:text-white/60"><RotateCcw size={10} className="inline mr-1" />다시</button>
              </div>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/75">{step2Result}</p>
          </div>
        )}
      </div>

      {/* ── STEP 3: 자유 작성 ── */}
      <div className={`mb-6 rounded-[16px] p-5 transition-all ${!step3Unlocked ? 'opacity-40 pointer-events-none' : ''}`}
        style={{ border: `1px solid ${step3State === 'done' ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.07)'}`, background: step3State === 'done' ? 'rgba(6,182,212,0.04)' : 'rgba(255,255,255,0.02)' }}>
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold"
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
            <button key={chip} onClick={() => setStep3Prompt((p) => p ? p + ' ' + chip : chip)}
              className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-white/40 transition-colors hover:border-violet-500/25 hover:text-violet-400">
              {chip}
            </button>
          ))}
        </div>

        <textarea value={step3Prompt} onChange={(e) => setStep3Prompt(e.target.value)}
          placeholder={lesson.step3.placeholder} rows={4} disabled={step3State === 'running'}
          className="mb-2 w-full resize-none rounded-[10px] border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-violet-500/30 focus:outline-none transition-colors" />
        <p className="mb-4 text-[11px] text-white/25">{lesson.step3.hint}</p>

        {step3State !== 'done' && (
          <button onClick={runStep3} disabled={!step3Prompt.trim() || step3State === 'running'}
            className="flex w-full items-center justify-center gap-2 rounded-[10px] py-3 text-sm font-semibold text-black transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: '#a78bfa' }}>
            {step3State === 'running' ? <><Loader2 size={14} className="animate-spin" /> 실행 중…</> : <><Sparkles size={14} /> AI 실행</>}
          </button>
        )}

        {step3State === 'done' && step3Result && (
          <div className="mt-3 rounded-[10px] border border-white/[0.07] bg-white/[0.02] p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] text-white/30">AI 결과</p>
              <button onClick={() => handleCopy(step3Result!, 's3')} className="text-[11px] text-white/35 hover:text-white/60"><Copy size={10} className="inline mr-1" />{copied === 's3' ? '복사됨' : '복사'}</button>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/75">{step3Result}</p>
          </div>
        )}
      </div>

      {allDone ? (
        <div className="rounded-[16px] p-6 text-center" style={{ border: '1px solid rgba(6,182,212,0.2)', background: 'rgba(6,182,212,0.06)' }}>
          <p className="mb-1 text-2xl">📝</p>
          <p className="mb-1 text-base font-semibold text-white">레슨 3 완료!</p>
          <p className="mb-5 text-sm text-white/40">긴 글을 AI로 정리하는 법을 익혔어요. 마지막 레슨에서 내 문서를 직접 분석해봐요.</p>
          <Link href={lesson.nextPage!} className="inline-flex items-center gap-2 rounded-[10px] px-6 py-3 text-sm font-semibold text-black transition-all hover:opacity-90" style={{ background: '#06b6d4' }}>
            레슨 4: {lesson.nextTitle} <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <Link href={lesson.nextPage!} className="flex items-center justify-between rounded-[12px] border border-white/[0.07] bg-white/[0.02] px-5 py-4 transition-colors hover:border-white/[0.12]">
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
