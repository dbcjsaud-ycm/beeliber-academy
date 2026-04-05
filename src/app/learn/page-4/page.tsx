'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Copy, Loader2, Sparkles, RotateCcw } from 'lucide-react';
import { getLearnLesson } from '@/lib/lesson-data';

const lesson = getLearnLesson(4)!;

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

const EXAMPLE_MEETING = `[회의록] 2026년 4월 5일 — 마케팅팀 주간회의
참석자: 김팀장, 이대리, 박인턴

1. 다음 달 SNS 캠페인 일정 확정 — 4월 20일 시작
2. 광고 소재 제작은 이대리 담당, 4월 15일까지 초안 완료
3. 박인턴은 경쟁사 레퍼런스 5개 수집해서 4월 12일까지 공유
4. 예산은 김팀장이 CFO와 협의 후 4월 10일까지 확정
5. 다음 회의는 4월 12일 오전 10시`;

// Step 1: 예시 회의록으로 3가지 다른 질문 연습
const QUESTIONS = [
  { id: 'summary', label: '전체 요약', prompt: '결정된 사항과 각자 해야 할 일을 정리해줘.', color: '#a78bfa' },
  { id: 'action', label: '담당자별 할 일', prompt: '담당자별로 할 일 목록을 만들어줘.', color: '#f59e0b' },
  { id: 'deadline', label: '마감일 정리', prompt: '마감일 순서로 정렬해줘.', color: '#34d399' },
];

export default function LearnPage4() {
  const [activeQ, setActiveQ] = useState(0);
  const [step1Results, setStep1Results] = useState<Record<string, string>>({});
  const [step1Running, setStep1Running] = useState<string | null>(null);
  const [step1Done, setStep1Done] = useState(false);

  const [step2Doc, setStep2Doc] = useState('');
  const [step2Question, setStep2Question] = useState('');
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

  async function runQuestion(idx: number) {
    const q = QUESTIONS[idx];
    setActiveQ(idx);
    if (step1Results[q.id]) return;
    setStep1Running(q.id);
    try {
      const prompt = `다음 회의록을 읽고, ${q.prompt}\n\n---\n${EXAMPLE_MEETING}\n---`;
      const result = await callAI(prompt);
      const updated = { ...step1Results, [q.id]: result };
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
    if (!step2Doc.trim() || !step2Question.trim()) return;
    const prompt = `다음 문서를 읽고, ${step2Question}\n\n---\n${step2Doc.trim()}\n---`;
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

  const cq = QUESTIONS[activeQ];

  return (
    <div className="mx-auto max-w-2xl px-6 pb-32 pt-12">
      <div className="mb-6 flex items-center gap-1.5 text-xs text-white/30">
        <Link href="/start" className="hover:text-white/60 transition-colors">입문 허브</Link>
        <ChevronRight size={11} /><span className="text-white/50">4 / 4</span>
      </div>

      <div className="mb-6">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-violet-400/60">입문 과정 · 레슨 4</p>
        <h1 className="mb-3 font-fraunces text-3xl font-black text-white lg:text-4xl">{lesson.title}</h1>
        <p className="mb-4 text-sm text-white/40">{lesson.subtitle}</p>
        <div className="flex flex-wrap gap-2">
          {lesson.outcomeBadges.map((b) => (
            <span key={b} className="rounded-full border border-violet-500/20 bg-violet-500/[0.06] px-2.5 py-1 text-[11px] text-violet-400">{b}</span>
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
          <div className="h-full rounded-full bg-violet-500 transition-all duration-500" style={{ width: `${(completedSteps / 3) * 100}%` }} />
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1 text-center">
          {['회의록 3가지 질문', '내 문서 붙여넣기', '자유 작성'].map((label, i) => (
            <p key={label} className={`text-[9px] ${i < completedSteps ? 'text-violet-400' : 'text-white/20'}`}>
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

      {/* ── STEP 1: 회의록 3가지 질문 ── */}
      <div className="mb-6 rounded-[16px] p-5" style={{
        border: `1px solid ${step1Done ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.07)'}`,
        background: step1Done ? 'rgba(167,139,250,0.04)' : 'rgba(255,255,255,0.02)',
      }}>
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold"
            style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' }}>
            {step1Done ? '✓' : '1'}
          </span>
          <div>
            <p className="text-[9px] text-white/25">STEP 1</p>
            <p className="text-xs font-semibold text-white/60">{lesson.step1.label}</p>
          </div>
        </div>

        {/* Example doc */}
        <div className="mb-4 rounded-[10px] p-4 font-mono text-xs leading-relaxed text-white/45"
          style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <p className="mb-2 text-[9px] text-white/25 font-sans">예시 회의록</p>
          {EXAMPLE_MEETING}
        </div>

        {/* Question tabs */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          {QUESTIONS.map((q, i) => (
            <button key={q.id} onClick={() => runQuestion(i)} disabled={step1Running === q.id}
              className="rounded-[10px] py-2.5 text-xs font-medium transition-all"
              style={activeQ === i
                ? { background: q.color + '18', color: q.color, border: `1px solid ${q.color}35` }
                : { background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.07)' }
              }>
              {step1Running === q.id && <Loader2 size={10} className="inline animate-spin mr-1" />}
              {q.label}
              {step1Results[q.id] && <span className="ml-1 opacity-50 text-[9px]">✓</span>}
            </button>
          ))}
        </div>

        {!step1Results[cq.id] && step1Running !== cq.id && (
          <button onClick={() => runQuestion(activeQ)}
            className="flex w-full items-center justify-center gap-2 rounded-[10px] py-2.5 text-sm font-semibold text-black transition-all hover:opacity-90"
            style={{ background: cq.color }}>
            <Sparkles size={13} /> {cq.label} 뽑아내기
          </button>
        )}

        {step1Results[cq.id] && (
          <div className="rounded-[10px] border border-white/[0.07] bg-white/[0.02] p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] text-white/30">{cq.label} 결과</p>
              <button onClick={() => handleCopy(step1Results[cq.id], `q${cq.id}`)}
                className="text-[11px] text-white/35 hover:text-white/60">
                <Copy size={10} className="inline mr-1" />
                {copied === `q${cq.id}` ? '복사됨' : '복사'}
              </button>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/75">{step1Results[cq.id]}</p>
          </div>
        )}

        {Object.keys(step1Results).length >= 2 && !step1Done && (
          <button onClick={() => { setStep1Done(true); setStep2Unlocked(true); }}
            className="mt-3 w-full rounded-[8px] py-2 text-xs text-violet-400 border border-violet-500/20 bg-violet-500/[0.05] hover:bg-violet-500/[0.1]">
            ✓ 3가지 질문 완료 — 다음 단계로
          </button>
        )}
      </div>

      {/* ── STEP 2: 내 문서 붙여넣기 ── */}
      <div className={`mb-6 rounded-[16px] p-5 transition-all ${!step2Unlocked ? 'opacity-40 pointer-events-none' : ''}`}
        style={{ border: `1px solid ${step2State === 'done' ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.07)'}`, background: step2State === 'done' ? 'rgba(167,139,250,0.04)' : 'rgba(255,255,255,0.02)' }}>
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold"
            style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' }}>
            {step2State === 'done' ? '✓' : '2'}
          </span>
          <div>
            <p className="text-[9px] text-white/25">STEP 2</p>
            <p className="text-xs font-semibold text-white/60">{lesson.step2.label}</p>
          </div>
          {!step2Unlocked && <span className="ml-auto text-[10px] text-white/20">🔒</span>}
        </div>

        <textarea value={step2Doc} onChange={(e) => setStep2Doc(e.target.value)}
          placeholder="공지사항, 계약서, 메일 내용, 회의록 등 분석하고 싶은 문서를 붙여넣으세요"
          rows={5} className="mb-3 w-full resize-none rounded-[10px] border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-violet-500/30 focus:outline-none transition-colors" />

        <div className="mb-3">
          <p className="mb-2 text-[10px] text-white/25">어떤 것이 궁금한가요?</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {lesson.promptChips.map((chip) => (
              <button key={chip} onClick={() => setStep2Question(chip)}
                className={`rounded-full px-3 py-1.5 text-xs transition-colors ${step2Question === chip ? 'text-violet-400' : 'text-white/40 hover:text-white/70'}`}
                style={step2Question === chip
                  ? { background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)' }
                  : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }
                }>{chip}</button>
            ))}
          </div>
          <input value={step2Question} onChange={(e) => setStep2Question(e.target.value)}
            placeholder="직접 입력해도 됩니다 (예: 핵심 내용 3개만 알려줘)"
            className="w-full rounded-[8px] border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-violet-500/30 focus:outline-none" />
        </div>

        {step2State !== 'done' && (
          <button onClick={runStep2} disabled={!step2Doc.trim() || !step2Question.trim() || step2State === 'running'}
            className="flex w-full items-center justify-center gap-2 rounded-[10px] py-3 text-sm font-semibold text-black transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: '#a78bfa' }}>
            {step2State === 'running' ? <><Loader2 size={14} className="animate-spin" /> 분석 중…</> : <><Sparkles size={14} /> 내 문서 분석하기</>}
          </button>
        )}

        {step2State === 'done' && step2Result && (
          <div className="mt-3 rounded-[10px] border border-white/[0.07] bg-white/[0.02] p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] text-white/30">분석 결과</p>
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
        style={{ border: `1px solid ${step3State === 'done' ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.07)'}`, background: step3State === 'done' ? 'rgba(167,139,250,0.04)' : 'rgba(255,255,255,0.02)' }}>
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
          placeholder={lesson.step3.placeholder} rows={5} disabled={step3State === 'running'}
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

      {/* ── 최종 완료 ── */}
      {allDone ? (
        <div className="rounded-[16px] p-6 text-center" style={{ border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.06)' }}>
          <p className="mb-2 text-3xl">🎓</p>
          <p className="mb-1 text-lg font-bold text-white">초초급 과정 완료!</p>
          <p className="mb-2 text-sm text-white/50">4개 레슨을 모두 마쳤어요.</p>
          <div className="mb-5 flex items-center justify-center gap-3 text-[11px] text-white/30">
            <span className="text-emerald-400">✓ 첫 질문</span>
            <span className="text-amber-400">✓ 수식어</span>
            <span className="text-cyan-400">✓ 글 정리</span>
            <span className="text-violet-400">✓ 문서 분석</span>
          </div>
          <p className="mb-5 text-sm text-white/40">이제 실전 트랙에서 마케팅, 영상, 웹앱, 자동화를 직접 만들어봐요.</p>
          <Link href="/tracks" className="inline-flex items-center gap-2 rounded-[10px] px-8 py-3.5 text-sm font-semibold text-black transition-all hover:opacity-90" style={{ background: '#f59e0b' }}>
            실전 트랙 선택하러 가기 <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <Link href={lesson.nextPage!} className="flex items-center justify-between rounded-[12px] border border-white/[0.07] bg-white/[0.02] px-5 py-4 transition-colors hover:border-white/[0.12]">
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">과정 완료 후</p>
            <p className="text-sm font-medium text-white/70">{lesson.nextTitle}</p>
          </div>
          <ArrowRight size={15} className="text-white/30" />
        </Link>
      )}
    </div>
  );
}
