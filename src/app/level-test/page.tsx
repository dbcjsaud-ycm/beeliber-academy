'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, Sparkles } from 'lucide-react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';

type Question = {
  q: string;
  options: { label: string; score: number }[];
};

const QUESTIONS: Question[] = [
  {
    q: 'AI(ChatGPT, Gemini 등)를 사용해본 적 있나요?',
    options: [
      { label: '한 번도 없어요', score: 0 },
      { label: '몇 번 써봤어요', score: 1 },
      { label: '가끔 씁니다', score: 2 },
      { label: '자주 씁니다', score: 3 },
    ],
  },
  {
    q: 'AI에게 원하는 결과가 안 나왔을 때 어떻게 하시나요?',
    options: [
      { label: '그냥 포기해요', score: 0 },
      { label: '다시 물어보긴 하는데 방법을 모르겠어요', score: 1 },
      { label: '"더 짧게", "표로" 같은 말로 수정 요청해요', score: 2 },
      { label: '역할, 형식, 예시까지 구체적으로 지시해요', score: 3 },
    ],
  },
  {
    q: 'AI를 어떤 용도로 활용하고 싶으신가요?',
    options: [
      { label: '일단 뭔지 알고 싶어요 (탐색)', score: 0 },
      { label: '업무 문서 작성 · 정리', score: 1 },
      { label: '마케팅 콘텐츠 · 영상 제작', score: 2 },
      { label: '자동화 파이프라인 구축', score: 3 },
    ],
  },
  {
    q: 'SNS 게시물이나 광고 문구를 AI로 만들어본 적 있나요?',
    options: [
      { label: '없어요', score: 0 },
      { label: '한두 번 해봤어요', score: 1 },
      { label: '종종 합니다', score: 2 },
      { label: '프로세스로 만들어서 씁니다', score: 3 },
    ],
  },
  {
    q: 'AI 이미지 생성 도구(Midjourney, DALL-E 등)를 써본 적 있나요?',
    options: [
      { label: '없어요', score: 0 },
      { label: '한번 해봤어요', score: 1 },
      { label: '가끔 씁니다', score: 2 },
      { label: '프롬프트 최적화까지 합니다', score: 3 },
    ],
  },
];

type RecommendedCourse = {
  level: string;
  levelColor: string;
  title: string;
  desc: string;
  href: string;
  emoji: string;
};

function getRecommendation(total: number): RecommendedCourse {
  if (total <= 3) {
    return {
      level: '초초급',
      levelColor: '#34d399',
      title: 'AI 처음 시작하기',
      desc: 'AI가 낯설어도 괜찮습니다. 4단계로 천천히 첫 경험을 만들어 드립니다.',
      href: '/start',
      emoji: '🌱',
    };
  } else if (total <= 7) {
    return {
      level: '초급',
      levelColor: '#f59e0b',
      title: '마케팅 AI 실전',
      desc: 'AI 기초는 갖췄습니다. 광고 문구·해시태그·SEO 콘텐츠를 실전으로 완성해보세요.',
      href: '/tracks/marketing',
      emoji: '📣',
    };
  } else if (total <= 11) {
    return {
      level: '중급',
      levelColor: '#06b6d4',
      title: '이미지 투 비디오',
      desc: '마케팅 기초를 넘어 AI 이미지·영상 파이프라인을 직접 구축할 준비가 됐습니다.',
      href: '/tracks/image-to-video',
      emoji: '🎬',
    };
  } else {
    return {
      level: '고급',
      levelColor: '#f97316',
      title: '업무 자동화',
      desc: '고급 프롬프팅 기법(Tree of Thoughts, RAG)으로 반복 업무를 자동화 파이프라인으로 만들 차례입니다.',
      href: '/tracks/automation',
      emoji: '🤖',
    };
  }
}

export default function LevelTestPage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [answers, setAnswers] = useState<(number | null)[]>(QUESTIONS.map(() => null));
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // 비로그인 → 로그인 페이지로
  useEffect(() => {
    const sb = createBrowserSupabaseClient();
    sb.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace('/login?redirect=/level-test');
      } else {
        setAuthLoading(false);
      }
    });
  }, [router]);

  const total = answers.reduce<number>((acc, v) => acc + (v ?? 0), 0);
  const result = getRecommendation(total);
  const allAnswered = answers.every((a) => a !== null);

  function select(score: number) {
    const next = [...answers];
    next[current] = score;
    setAnswers(next);
    if (current < QUESTIONS.length - 1) {
      setTimeout(() => setCurrent((c) => c + 1), 280);
    }
  }

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#1a1825', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 24, height: 24, border: '2px solid rgba(245,158,11,0.3)', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1825', color: '#fff' }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        borderBottom: '1px solid rgba(255,255,255,0.10)',
        background: 'rgba(26,24,37,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}>
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <Link href="/courses" className="flex items-center gap-1.5 font-sans text-xs transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.55)' }}>
            <ChevronLeft size={13} />
            수업 목록
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>🐝</span>
            <span className="font-sans text-sm font-semibold">레벨 테스트</span>
          </div>
          <span className="font-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.50)' }}>
            {submitted ? '완료' : `${current + 1} / ${QUESTIONS.length}`}
          </span>
        </div>
      </nav>

      <div className="mx-auto max-w-xl px-6" style={{ paddingTop: 88, paddingBottom: 80 }}>

        {!submitted ? (
          <>
            {/* 진행바 */}
            <div style={{ height: 2, background: 'rgba(255,255,255,0.11)', borderRadius: 2, marginBottom: 48, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${((current + (answers[current] !== null ? 1 : 0)) / QUESTIONS.length) * 100}%`,
                background: 'linear-gradient(90deg, #f59e0b, #fcd34d)',
                borderRadius: 2,
                transition: 'width 300ms ease',
              }} />
            </div>

            {/* 질문 */}
            <div key={current} style={{ animation: 'fadeSlideIn 220ms ease' }}>
              <p className="font-mono" style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.20em', textTransform: 'uppercase',
                color: 'rgba(245,158,11,0.70)', marginBottom: 16,
              }}>
                질문 {current + 1}
              </p>
              <h2 className="font-sans" style={{
                fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                fontWeight: 700, lineHeight: 1.45, color: '#fff', marginBottom: 32,
              }}>
                {QUESTIONS[current].q}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {QUESTIONS[current].options.map((opt) => {
                  const selected = answers[current] === opt.score;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => select(opt.score)}
                      style={{
                        padding: '14px 18px',
                        borderRadius: 10,
                        border: selected ? '1px solid rgba(245,158,11,0.45)' : '1px solid rgba(255,255,255,0.13)',
                        background: selected ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.025)',
                        color: selected ? '#f59e0b' : 'rgba(255,255,255,0.62)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 160ms',
                        fontFamily: 'var(--font-geist-sans, sans-serif)',
                        fontSize: 14,
                        fontWeight: selected ? 600 : 400,
                      }}
                      onMouseEnter={(e) => {
                        if (!selected) {
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
                          (e.currentTarget as HTMLElement).style.color = '#fff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!selected) {
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.13)';
                          (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.62)';
                        }
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 하단 네비 */}
            <div style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
                style={{
                  padding: '9px 16px', borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'transparent',
                  color: current === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.36)',
                  cursor: current === 0 ? 'default' : 'pointer',
                  fontFamily: 'var(--font-geist-sans, sans-serif)',
                  fontSize: 13,
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <ChevronLeft size={13} /> 이전
              </button>

              {current < QUESTIONS.length - 1 ? (
                <button
                  onClick={() => answers[current] !== null && setCurrent((c) => c + 1)}
                  disabled={answers[current] === null}
                  style={{
                    padding: '9px 20px', borderRadius: 8,
                    background: answers[current] !== null ? '#f59e0b' : 'rgba(255,255,255,0.11)',
                    border: 'none',
                    color: answers[current] !== null ? '#000' : 'rgba(255,255,255,0.20)',
                    cursor: answers[current] !== null ? 'pointer' : 'default',
                    fontFamily: 'var(--font-geist-sans, sans-serif)',
                    fontSize: 13, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 5,
                    transition: 'all 150ms',
                  }}
                >
                  다음 <ArrowRight size={13} />
                </button>
              ) : (
                <button
                  onClick={() => allAnswered && setSubmitted(true)}
                  disabled={!allAnswered}
                  style={{
                    padding: '11px 24px', borderRadius: 9,
                    background: allAnswered ? '#f59e0b' : 'rgba(255,255,255,0.11)',
                    border: 'none',
                    color: allAnswered ? '#000' : 'rgba(255,255,255,0.20)',
                    cursor: allAnswered ? 'pointer' : 'default',
                    fontFamily: 'var(--font-geist-sans, sans-serif)',
                    fontSize: 14, fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: 6,
                    transition: 'all 150ms',
                    boxShadow: allAnswered ? '0 0 24px rgba(245,158,11,0.30)' : 'none',
                  }}
                >
                  <Sparkles size={14} />
                  결과 보기
                </button>
              )}
            </div>
          </>
        ) : (
          /* ── 결과 화면 ── */
          <div style={{ animation: 'fadeSlideIn 300ms ease' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{
                fontSize: 56, lineHeight: 1, marginBottom: 20,
                filter: 'drop-shadow(0 0 24px rgba(245,158,11,0.25))',
              }}>{result.emoji}</div>

              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '5px 14px', borderRadius: 6, marginBottom: 16,
                border: `1px solid ${result.levelColor}33`,
                background: `${result.levelColor}11`,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: result.levelColor }} />
                <span className="font-mono" style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: result.levelColor,
                }}>{result.level} 과정 추천</span>
              </div>

              <h2 className="font-display" style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 14,
              }}>
                {result.title}
              </h2>
              <p className="font-sans" style={{
                fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7,
                maxWidth: 420, margin: '0 auto',
              }}>
                {result.desc}
              </p>
            </div>

            {/* 점수 시각화 */}
            <div style={{
              padding: '16px 20px', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.02)',
              marginBottom: 28,
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div>
                <div className="font-mono" style={{
                  fontSize: 28, fontWeight: 800,
                  background: `linear-gradient(135deg, ${result.levelColor}, #fff)`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text', lineHeight: 1,
                }}>{total}</div>
                <div className="font-mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.50)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 3 }}>
                  / 15점
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(total / 15) * 100}%`,
                    background: `linear-gradient(90deg, ${result.levelColor}, #fff8)`,
                    borderRadius: 2,
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  {['초초급', '초급', '중급', '고급'].map((l) => (
                    <span key={l} className="font-mono" style={{ fontSize: 8, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.08em' }}>{l}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link
                href={result.href}
                className="flex items-center justify-center gap-2 font-sans font-semibold text-black transition-all hover:bg-amber-400 active:scale-[0.97]"
                style={{
                  padding: '14px 28px', borderRadius: 10,
                  background: '#f59e0b',
                  boxShadow: '0 0 32px rgba(245,158,11,0.30)',
                  fontSize: 15,
                }}>
                <Sparkles size={15} strokeWidth={2.5} />
                추천 수업 바로 시작하기
                <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
              <Link
                href="/courses"
                className="flex items-center justify-center gap-2 font-sans transition-all hover:text-white"
                style={{
                  padding: '13px 28px', borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.14)',
                  background: 'rgba(255,255,255,0.025)',
                  color: 'rgba(255,255,255,0.40)',
                  fontSize: 14,
                }}>
                전체 수업 목록 보기
              </Link>
              <button
                onClick={() => { setAnswers(QUESTIONS.map(() => null)); setCurrent(0); setSubmitted(false); }}
                className="font-sans transition-colors hover:text-white/60"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.18)', fontSize: 12, paddingTop: 8,
                }}>
                다시 테스트하기
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
