'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';

type Course = {
  id: string;
  badge: string;
  level: string;
  levelColor: string;
  levelBg: string;
  icon: string;
  title: string;
  sub: string;
  desc: string;
  outcomes: string[];
  duration: string;
  href: string;
  accent: string;
  glow: string;
  border: string;
  gradStart: string;
  requiresLogin?: boolean;
};

const COURSES: Course[] = [
  {
    id: 'beginner-0',
    badge: '00',
    level: '초초급',
    levelColor: '#34d399',
    levelBg: 'rgba(52,211,153,0.08)',
    icon: '🌱',
    title: 'AI 처음 시작하기',
    sub: '첫 질문부터 파일 활용까지',
    desc: 'AI를 한 번도 써본 적 없어도 괜찮습니다. 4단계로 AI와 대화하는 법을 직접 체험해보세요.',
    outcomes: [
      'AI에게 첫 질문 해보기',
      '결과를 내 방식으로 바꾸는 법',
      '긴 글 요약 · 정리하기',
      '파일 내용으로 질문하기',
    ],
    duration: '30–40분',
    href: '/start',
    accent: '#34d399',
    glow: 'rgba(52,211,153,0.10)',
    border: 'rgba(52,211,153,0.22)',
    gradStart: 'rgba(52,211,153,0.05)',
  },
  {
    id: 'marketing',
    badge: '01',
    level: '초급',
    levelColor: '#f59e0b',
    levelBg: 'rgba(245,158,11,0.08)',
    icon: '📣',
    title: '마케팅 AI 실전',
    sub: 'SNS · SEO · GEO 전략',
    desc: 'Super Gems 활용, GEO 전략, SNS-SEO 연결 워크플로우를 AI로 완성합니다.',
    outcomes: [
      '광고 제목 10개 + 설명 3개',
      'CTA 5개 + 해시태그 15개',
      '썸네일 문구 세트',
    ],
    duration: '2–3시간',
    href: '/tracks/marketing',
    accent: '#f59e0b',
    glow: 'rgba(245,158,11,0.10)',
    border: 'rgba(245,158,11,0.22)',
    gradStart: 'rgba(245,158,11,0.04)',
  },
  {
    id: 'image-to-video',
    badge: '02',
    level: '중급',
    levelColor: '#06b6d4',
    levelBg: 'rgba(6,182,212,0.08)',
    icon: '🎬',
    title: '이미지 투 비디오',
    sub: '기준이미지 → 첫프레임 → 영상',
    desc: '기준 이미지를 먼저 생성하고 첫 프레임으로 고정해 영상으로 만드는 AI 파이프라인.',
    outcomes: [
      '기준 이미지 프롬프트',
      '장면별 영상 프롬프트',
      '자막 + 업로드 패키지',
    ],
    duration: '3–4시간',
    href: '/tracks/image-to-video',
    accent: '#06b6d4',
    glow: 'rgba(6,182,212,0.08)',
    border: 'rgba(6,182,212,0.20)',
    gradStart: 'rgba(6,182,212,0.03)',
  },
  {
    id: 'web-app',
    badge: '03',
    level: '중급',
    levelColor: '#7c3aed',
    levelBg: 'rgba(124,58,237,0.08)',
    icon: '💻',
    title: '웹/앱 개발 기획',
    sub: '기획 → 구조 → 작업지시서',
    desc: '화면 구조, 기능 목록, 개발 작업지시서까지 AI로 완성합니다.',
    outcomes: [
      '서비스 소개 + 화면 구조',
      '핵심 기능 목록',
      '개발 작업지시서',
    ],
    duration: '3–5시간',
    href: '/tracks/web-app',
    accent: '#7c3aed',
    glow: 'rgba(124,58,237,0.08)',
    border: 'rgba(124,58,237,0.20)',
    gradStart: 'rgba(124,58,237,0.03)',
  },
  {
    id: 'automation',
    badge: '04',
    level: '고급',
    levelColor: '#f97316',
    levelBg: 'rgba(249,115,22,0.08)',
    icon: '🤖',
    title: '업무 자동화',
    sub: 'Tree of Thoughts · RAG · Reflection',
    desc: '반복 업무를 AI 파이프라인으로 자동화하는 고급 프롬프팅 기법을 실습합니다.',
    outcomes: [
      '반복업무 정의 + 입출력 구조',
      '단계별 요청문',
      '최종 출력 형식',
    ],
    duration: '4–6시간',
    href: '/tracks/automation',
    accent: '#f97316',
    glow: 'rgba(249,115,22,0.08)',
    border: 'rgba(249,115,22,0.20)',
    gradStart: 'rgba(249,115,22,0.04)',
  },
];

export default function CoursesPage() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = createBrowserSupabaseClient();
    sb.auth.getUser().then(({ data }) => {
      setUser(data.user ? { email: data.user.email ?? '' } : null);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#1a1825', color: '#fff', overflowX: 'hidden' }}>

      {/* ── Nav ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        borderBottom: '1px solid rgba(255,255,255,0.10)',
        background: 'rgba(26,24,37,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}>
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span style={{ fontSize: 20, lineHeight: 1 }}>🐝</span>
            <span className="font-sans text-sm font-semibold tracking-tight text-white">beeliber</span>
            <span className="font-sans text-sm font-normal" style={{ color: 'rgba(255,255,255,0.50)' }}>academy</span>
          </Link>
          {!loading && (
            user ? (
              <Link href="/level-test"
                className="flex items-center gap-1.5 font-sans text-xs font-semibold text-black transition-all hover:bg-amber-400 active:scale-[0.97]"
                style={{ background: '#f59e0b', padding: '7px 16px', borderRadius: 10, boxShadow: '0 0 18px rgba(245,158,11,0.28)' }}>
                <Sparkles size={11} strokeWidth={2.5} />
                레벨 테스트
              </Link>
            ) : (
              <Link href="/login"
                className="flex items-center gap-1.5 font-sans text-xs font-semibold text-black transition-all hover:bg-amber-400 active:scale-[0.97]"
                style={{ background: '#f59e0b', padding: '7px 16px', borderRadius: 10, boxShadow: '0 0 18px rgba(245,158,11,0.28)' }}>
                로그인 / 시작하기
              </Link>
            )
          )}
        </div>
      </nav>

      {/* ── Header ── */}
      <div className="mx-auto max-w-7xl px-6" style={{ paddingTop: 96, paddingBottom: 48 }}>
        <div style={{ maxWidth: 600 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '4px 12px', borderRadius: 4, marginBottom: 16,
            border: '1px solid rgba(245,158,11,0.15)',
            background: 'rgba(245,158,11,0.04)',
          }}>
            <span className="font-mono" style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(245,158,11,0.80)',
            }}>전체 수업</span>
          </div>
          <h1 className="font-display" style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 900, lineHeight: 1.1, color: '#fff', marginBottom: 16,
          }}>
            내 수준에 맞는<br />수업을 골라보세요
          </h1>
          <p className="font-sans" style={{ fontSize: 15, color: 'rgba(255,255,255,0.40)', lineHeight: 1.7 }}>
            초초급부터 고급까지 — 실제 AI 실습과 결과물 저장이 한 화면에서 이어집니다.
          </p>

          {/* 레벨 테스트 CTA (로그인 여부에 따라) */}
          {!loading && (
            <div style={{ marginTop: 28 }}>
              {user ? (
                <Link href="/level-test"
                  className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-black transition-all hover:bg-amber-400 active:scale-[0.97]"
                  style={{ background: '#f59e0b', padding: '11px 24px', borderRadius: 10, boxShadow: '0 0 28px rgba(245,158,11,0.28)' }}>
                  <Sparkles size={14} strokeWidth={2.5} />
                  내 레벨 테스트 해보기
                  <ArrowRight size={13} strokeWidth={2.5} />
                </Link>
              ) : (
                <Link href="/login?redirect=/level-test"
                  className="inline-flex items-center gap-2 font-sans text-sm font-medium transition-all hover:text-white"
                  style={{
                    padding: '11px 22px', borderRadius: 10,
                    border: '1px solid rgba(245,158,11,0.20)',
                    background: 'rgba(245,158,11,0.04)',
                    color: 'rgba(245,158,11,0.75)',
                  }}>
                  <Lock size={13} strokeWidth={2.5} />
                  로그인 후 레벨 테스트 →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Course Grid ── */}
      <div className="mx-auto max-w-7xl px-6" style={{ paddingBottom: 96 }}>

        {/* 레벨 범례 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
          {[
            { label: '초초급', color: '#34d399', desc: 'AI 처음 접하는 분' },
            { label: '초급', color: '#f59e0b', desc: '기초 사용 경험 있음' },
            { label: '중급', color: '#06b6d4', desc: '실전 활용 목표' },
            { label: '고급', color: '#f97316', desc: '자동화 · 고급 기법' },
          ].map(({ label, color, desc }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '5px 12px', borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.11)',
              background: 'rgba(255,255,255,0.02)',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span className="font-mono" style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: '0.1em' }}>{label}</span>
              <span className="font-sans" style={{ fontSize: 11, color: 'rgba(255,255,255,0.52)' }}>{desc}</span>
            </div>
          ))}
        </div>

        {/* 수업 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {COURSES.map((c, idx) => (
            <Link
              key={c.id}
              href={c.href}
              style={{
                display: 'flex', alignItems: 'stretch',
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.12)',
                background: `linear-gradient(120deg, ${c.gradStart} 0%, rgba(255,255,255,0.012) 100%)`,
                textDecoration: 'none',
                overflow: 'hidden',
                transition: 'border-color 200ms, box-shadow 200ms',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = c.border;
                el.style.boxShadow = `0 8px 36px ${c.glow}`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(255,255,255,0.12)';
                el.style.boxShadow = '';
              }}
            >
              {/* 왼쪽 — 번호 컬럼 */}
              <div style={{
                width: 64, flexShrink: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 6,
                borderRight: '1px solid rgba(255,255,255,0.10)',
                padding: '20px 0',
                background: `linear-gradient(180deg, ${c.gradStart} 0%, transparent 100%)`,
              }}>
                <span style={{ fontSize: 20, lineHeight: 1 }}>{c.icon}</span>
                <span className="font-mono" style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.16em',
                  color: c.accent, opacity: 0.8,
                }}>{c.badge}</span>
              </div>

              {/* 중앙 — 콘텐츠 */}
              <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '2px 9px', borderRadius: 4,
                    border: `1px solid ${c.border}`,
                    background: c.levelBg,
                  }}>
                    <span className="font-mono" style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: c.levelColor,
                    }}>{c.level}</span>
                  </span>
                  <span style={{
                    padding: '2px 9px', borderRadius: 4,
                    border: '1px solid rgba(255,255,255,0.11)',
                    background: 'rgba(255,255,255,0.02)',
                  }}>
                    <span className="font-mono" style={{
                      fontSize: 9, color: 'rgba(255,255,255,0.52)', letterSpacing: '0.10em',
                    }}>{c.duration}</span>
                  </span>
                  {idx === 0 && (
                    <span style={{
                      padding: '2px 9px', borderRadius: 4,
                      border: '1px solid rgba(52,211,153,0.20)',
                      background: 'rgba(52,211,153,0.06)',
                    }}>
                      <span className="font-mono" style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: '#34d399',
                      }}>추천 시작점</span>
                    </span>
                  )}
                </div>

                <h3 className="font-sans" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                  {c.title}
                </h3>
                <p className="font-mono" style={{ fontSize: 11, color: c.accent, opacity: 0.85, letterSpacing: '0.04em', margin: 0 }}>
                  {c.sub}
                </p>
                <p className="font-sans" style={{ fontSize: 13, color: 'rgba(255,255,255,0.36)', lineHeight: 1.65, margin: 0 }}>
                  {c.desc}
                </p>

                {/* 결과물 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                  {c.outcomes.map((o) => (
                    <span key={o} style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '3px 9px', borderRadius: 5,
                      border: '1px solid rgba(255,255,255,0.11)',
                      background: 'rgba(255,255,255,0.025)',
                    }}>
                      <CheckCircle2 size={9} style={{ color: c.accent, opacity: 0.7, flexShrink: 0 }} />
                      <span className="font-sans" style={{ fontSize: 11, color: 'rgba(255,255,255,0.40)' }}>{o}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* 오른쪽 — CTA 화살표 */}
              <div style={{
                width: 52, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderLeft: '1px solid rgba(255,255,255,0.10)',
              }}>
                <ArrowRight size={15} style={{ color: c.accent, opacity: 0.6 }} />
              </div>
            </Link>
          ))}
        </div>

        {/* 하단 안내 */}
        <div style={{
          marginTop: 40, padding: '20px 24px', borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(255,255,255,0.015)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <div>
            <p className="font-sans" style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: 0 }}>
              어떤 수업부터 시작해야 할지 모르겠다면
            </p>
            <p className="font-sans" style={{ fontSize: 12, color: 'rgba(255,255,255,0.52)', marginTop: 4 }}>
              레벨 테스트 5문항으로 맞춤 수업을 추천해 드립니다
            </p>
          </div>
          {!loading && (
            user ? (
              <Link href="/level-test"
                className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-black transition-all hover:bg-amber-400 active:scale-[0.97]"
                style={{ background: '#f59e0b', padding: '10px 20px', borderRadius: 9, whiteSpace: 'nowrap' }}>
                <Sparkles size={13} />
                레벨 테스트 시작
              </Link>
            ) : (
              <Link href="/login?redirect=/level-test"
                className="inline-flex items-center gap-2 font-sans text-sm font-medium transition-all hover:text-white"
                style={{
                  padding: '10px 20px', borderRadius: 9,
                  border: '1px solid rgba(245,158,11,0.20)',
                  background: 'rgba(245,158,11,0.04)',
                  color: 'rgba(245,158,11,0.75)',
                  whiteSpace: 'nowrap',
                }}>
                로그인 후 레벨 테스트 →
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}
