'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, Sparkles, ChevronRight, Zap } from 'lucide-react';

const SplineScene = dynamic(() => import('@/components/landing/SplineScene'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%', background: 'transparent' }} />,
});

const TRACKS = [
  {
    no: '01', icon: '📣', label: '마케팅', sub: 'SNS · SEO · GEO 전략',
    desc: 'Super Gems 활용, GEO 전략, SNS-SEO 연결 워크플로우를 AI로 완성합니다.',
    outputs: ['광고 제목 10개 + 설명 3개', 'CTA 5개 + 해시태그 15개', '썸네일 문구 세트'],
    href: '/lab/marketing/campaign-copy-studio', time: '2–3h', level: '초급',
    accent: '#f59e0b', glow: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.20)',
    gradStart: 'rgba(245,158,11,0.04)',
  },
  {
    no: '02', icon: '🎬', label: '이미지 투 비디오', sub: '기준이미지 → 첫프레임 → 영상',
    desc: '기준 이미지를 먼저 생성하고 첫 프레임으로 고정해 영상으로 만드는 파이프라인.',
    outputs: ['기준 이미지 프롬프트', '장면별 영상 프롬프트', '자막 + 업로드 패키지'],
    href: '/tracks/image-to-video', time: '3–4h', level: '중급',
    accent: '#06b6d4', glow: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.18)',
    gradStart: 'rgba(6,182,212,0.03)',
  },
  {
    no: '03', icon: '💻', label: '웹/앱 개발', sub: '기획 → 구조 → 작업지시서',
    desc: '화면 구조, 기능 목록, 개발 작업지시서까지 AI로 완성합니다.',
    outputs: ['서비스 소개 + 화면 구조', '핵심 기능 목록', '개발 작업지시서'],
    href: '/tracks/web-app', time: '3–5h', level: '중급',
    accent: '#7c3aed', glow: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.18)',
    gradStart: 'rgba(124,58,237,0.03)',
  },
  {
    no: '04', icon: '🤖', label: '자동화', sub: 'Tree of Thoughts · RAG · Reflection',
    desc: '반복 업무를 AI 파이프라인으로 자동화하는 고급 프롬프팅 기법을 실습합니다.',
    outputs: ['반복업무 정의 + 입출력 구조', '단계별 요청문', '최종 출력 형식'],
    href: '/tracks/automation', time: '4–6h', level: '고급',
    accent: '#f59e0b', glow: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.20)',
    gradStart: 'rgba(245,158,11,0.04)',
  },
];

const STEPS = [
  { n: '01', label: '교수 설명', desc: '핵심 개념과 따라하기 순서', icon: '📖' },
  { n: '02', label: '프롬프트 입력', desc: '예시 칩 클릭 또는 직접 작성', icon: '✍️' },
  { n: '03', label: 'AI 실행', desc: 'Gemini · GPT · Claude', icon: '⚡' },
  { n: '04', label: '자동 검수', desc: '품질·정책·목적 체크', icon: '✅' },
  { n: '05', label: '결과 저장', desc: '버전 단위 저장', icon: '💾' },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: '#fff', overflowX: 'hidden' }}>

      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(5,5,8,0.80)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}>
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span style={{ fontSize: 20, lineHeight: 1 }}>🐝</span>
            <span className="font-sans text-sm font-semibold tracking-tight text-white">beeliber</span>
            <span className="font-sans text-sm font-normal" style={{ color: 'rgba(255,255,255,0.22)' }}>academy</span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {[
              { label: '실전 세션', href: '/tracks' },
              { label: '실습 랩', href: '/lab/marketing/campaign-copy-studio' },
              { label: '워크스페이스', href: '/spaces/new' },
              { label: '대시보드', href: '/academy' },
            ].map(({ label, href }) => (
              <Link key={href} href={href}
                className="font-sans text-[13px] font-normal transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.38)' }}>
                {label}
              </Link>
            ))}
          </div>

          <Link href="/academy"
            className="flex items-center gap-1.5 font-sans text-xs font-semibold text-black transition-all hover:bg-amber-400 active:scale-[0.97]"
            style={{
              background: '#f59e0b',
              padding: '7px 16px',
              borderRadius: 10,
              boxShadow: '0 0 18px rgba(245,158,11,0.28)',
            }}>
            <Sparkles size={11} strokeWidth={2.5} />
            무료로 시작
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', height: '100vh', minHeight: 700, overflow: 'hidden' }}>

        {/* Spline 로봇 — 풀스크린 */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <SplineScene />
        </div>

        {/* 우측 그라디언트 veil */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to left, rgba(5,5,8,0.96) 28%, rgba(5,5,8,0.84) 48%, rgba(5,5,8,0.22) 68%, transparent 100%)',
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 100,
            background: 'linear-gradient(to bottom, rgba(5,5,8,0.65), transparent)',
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 180,
            background: 'linear-gradient(to top, rgba(5,5,8,1), transparent)',
          }} />
        </div>

        {/* 우측 텍스트 콘텐츠 */}
        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', zIndex: 10 }}>
          <div className="mx-auto w-full max-w-7xl px-6">
            <div style={{ marginLeft: 'auto', maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 28 }}>

              {/* 상태 배지 */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '4px 12px',
                  borderRadius: 4,
                  border: '1px solid rgba(6,182,212,0.18)',
                  background: 'rgba(6,182,212,0.05)',
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#22d3ee',
                    boxShadow: '0 0 8px rgba(34,211,238,0.9)',
                    animation: 'pulse-glow 2.5s ease-in-out infinite',
                    flexShrink: 0,
                  }} />
                  <span className="font-mono" style={{
                    fontSize: 10, fontWeight: 600,
                    letterSpacing: '0.22em', textTransform: 'uppercase',
                    color: 'rgba(34,211,238,0.85)',
                  }}>
                    AI 실습 교육 플랫폼
                  </span>
                </span>
              </div>

              {/* 헤드라인 */}
              <h1 className="font-display" style={{
                fontSize: 'clamp(2.5rem, 5.2vw, 4.4rem)',
                fontWeight: 900,
                lineHeight: 1.06,
                letterSpacing: '-0.02em',
                margin: 0,
              }}>
                <span style={{ display: 'block', color: '#fff' }}>작은 질문이</span>
                <span style={{
                  display: 'block',
                  fontStyle: 'italic',
                  background: 'linear-gradient(115deg, #fcd34d 0%, #f59e0b 50%, #d97706 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  거대한 변화를
                </span>
                <span style={{ display: 'block', color: '#fff' }}>만듭니다</span>
              </h1>

              {/* 본문 */}
              <p className="font-sans" style={{
                fontSize: 15, lineHeight: 1.72,
                color: 'rgba(255,255,255,0.48)',
              }}>
                마케팅·영상·개발·자동화 4개 트랙.<br />
                실제 프롬프트 입력창과 결과 패널로 학습하고<br />
                결과물은 버전 단위로 저장됩니다.
              </p>

              {/* CTA 버튼 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <Link href="/academy"
                  className="group flex items-center gap-2 font-sans text-[13px] font-semibold text-black transition-all hover:bg-amber-400 active:scale-[0.97]"
                  style={{
                    background: '#f59e0b',
                    padding: '11px 24px',
                    borderRadius: 10,
                    boxShadow: '0 0 32px rgba(245,158,11,0.32)',
                  }}>
                  무료로 시작하기
                  <ArrowRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link href="/lab/marketing/campaign-copy-studio"
                  className="flex items-center gap-2 font-sans text-[13px] font-medium transition-all hover:text-white"
                  style={{
                    padding: '11px 22px',
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.09)',
                    background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(255,255,255,0.55)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(6,182,212,0.22)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(6,182,212,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.09)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                  }}>
                  샘플 수업 보기
                </Link>
              </div>

              {/* 스탯 바 */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 20,
                paddingTop: 20,
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}>
                {[
                  { v: '04', l: '실전 트랙' },
                  { v: '28+', l: '실습 모듈' },
                  { v: 'AI', l: '자동 검수' },
                ].map(({ v, l }) => (
                  <div key={l} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span className="font-mono" style={{
                      fontSize: '1.05rem', fontWeight: 700, lineHeight: 1,
                      background: 'linear-gradient(135deg, #fcd34d, #f59e0b)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>{v}</span>
                    <span className="font-mono" style={{
                      fontSize: 10, textTransform: 'uppercase',
                      letterSpacing: '0.14em', color: 'rgba(255,255,255,0.22)',
                    }}>{l}</span>
                  </div>
                ))}
                <div style={{ marginLeft: 'auto' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '3px 10px',
                    borderRadius: 4,
                    border: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(255,255,255,0.02)',
                  }}>
                    <Zap size={9} style={{ color: 'rgba(245,158,11,0.5)' }} />
                    <span className="font-mono" style={{
                      fontSize: 9, fontWeight: 600,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.28)',
                    }}>
                      Gemini · GPT · Claude
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 스크롤 인디케이터 */}
        <div style={{
          position: 'absolute', bottom: 28, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          zIndex: 10,
        }}>
          <div style={{
            width: 1, height: 36,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)',
          }} />
          <span className="font-mono" style={{
            fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.12)',
          }}>scroll</span>
        </div>
      </section>

      {/* ── AI 모델 스트립 ──────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="mx-auto max-w-7xl px-6" style={{ padding: '14px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <span className="font-mono" style={{
              fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.18)', whiteSpace: 'nowrap', marginRight: 24,
            }}>지원 AI 엔진</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.04)', marginRight: 24 }} />
            {['Gemini 2.0', 'GPT-4o', 'Claude 3.7', 'Imagen 4', 'Kling 3', 'ElevenLabs'].map((name, i) => (
              <span key={name} className="font-mono" style={{
                fontSize: 11, color: 'rgba(255,255,255,0.22)', fontWeight: 500,
                padding: i === 0 ? '0 20px 0 0' : '0 20px',
                borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)',
                whiteSpace: 'nowrap',
              }}>{name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 앰비언트 배경 ──────────────────────────────────────────────── */}
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* ── Tracks ───────────────────────────────────────────────────── */}
        <section className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="mb-14 flex items-end justify-between gap-4">
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '4px 12px', borderRadius: 4, marginBottom: 14,
                border: '1px solid rgba(245,158,11,0.15)',
                background: 'rgba(245,158,11,0.04)',
              }}>
                <span className="font-mono" style={{
                  fontSize: 10, fontWeight: 600,
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: 'rgba(245,158,11,0.80)',
                }}>실전 세션</span>
              </div>
              <h2 className="font-display" style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                fontWeight: 900, lineHeight: 1.15, color: '#fff',
              }}>
                어떤 결과물을 만들 건가요?
              </h2>
              <p className="font-sans" style={{
                marginTop: 8, fontSize: 14,
                color: 'rgba(255,255,255,0.32)',
              }}>
                4개 트랙 중 하나를 선택해 실제 프롬프트와 결과물을 만들어보세요
              </p>
            </div>
            <Link href="/tracks"
              className="hidden shrink-0 items-center gap-1 font-sans text-sm transition-colors hover:text-white sm:flex"
              style={{ color: 'rgba(255,255,255,0.22)' }}>
              전체 보기 <ChevronRight size={13} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {TRACKS.map((t) => (
              <Link key={t.no} href={t.href}
                className="group"
                style={{
                  display: 'flex', flexDirection: 'column', overflow: 'hidden',
                  transition: 'transform 200ms ease, box-shadow 200ms ease',
                  textDecoration: 'none',
                  borderRadius: 14,
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: `linear-gradient(140deg, ${t.gradStart} 0%, rgba(255,255,255,0.015) 100%)`,
                  padding: '24px',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = t.border;
                  el.style.boxShadow = `0 12px 48px ${t.glow}, 0 1px 0 ${t.border} inset`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(255,255,255,0.07)';
                  el.style.boxShadow = '';
                }}
              >
                {/* 상단: 번호 + 레벨 + 시간 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22, lineHeight: 1 }}>{t.icon}</span>
                    <span className="font-mono" style={{
                      fontSize: 10, fontWeight: 700,
                      letterSpacing: '0.2em', color: t.accent,
                    }}>{t.no}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 4,
                      border: `1px solid ${t.border}`,
                      background: t.glow,
                      color: t.accent,
                    }}>
                      <span className="font-mono" style={{
                        fontSize: 9, fontWeight: 700,
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                      }}>{t.level}</span>
                    </span>
                    <span style={{
                      padding: '2px 8px', borderRadius: 4,
                      border: '1px solid rgba(255,255,255,0.07)',
                      background: 'rgba(255,255,255,0.025)',
                    }}>
                      <span className="font-mono" style={{
                        fontSize: 9, fontWeight: 600,
                        letterSpacing: '0.12em', color: 'rgba(255,255,255,0.30)',
                      }}>{t.time}</span>
                    </span>
                  </div>
                </div>

                <h3 className="font-sans" style={{
                  fontSize: '1.1rem', fontWeight: 700, color: '#fff',
                  marginBottom: 3,
                }}>{t.label}</h3>
                <p className="font-mono" style={{
                  fontSize: 11, marginBottom: 6,
                  color: t.accent, opacity: 0.9,
                  letterSpacing: '0.04em',
                }}>{t.sub}</p>
                <p className="font-sans" style={{
                  fontSize: 13, lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.38)',
                  flex: 1, marginBottom: 18,
                }}>{t.desc}</p>

                {/* 결과물 */}
                <div style={{
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.05)',
                  background: 'rgba(0,0,0,0.20)',
                  padding: '10px 12px',
                  marginBottom: 18,
                }}>
                  <p className="font-mono" style={{
                    fontSize: 9, fontWeight: 600,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.20)', marginBottom: 8,
                  }}>결과물</p>
                  {t.outputs.map((o) => (
                    <div key={o} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      marginBottom: 5,
                    }}>
                      <span style={{
                        width: 3, height: 3, borderRadius: '50%',
                        background: t.accent, flexShrink: 0, opacity: 0.7,
                      }} />
                      <span className="font-sans" style={{
                        fontSize: 12, color: 'rgba(255,255,255,0.42)',
                      }}>{o}</span>
                    </div>
                  ))}
                </div>

                {/* 하단 CTA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}
                  className="transition-all duration-150 group-hover:gap-2.5">
                  <span className="font-mono" style={{
                    fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: t.accent,
                  }}>트랙 시작</span>
                  <ArrowRight size={11} strokeWidth={2.5} style={{ color: t.accent }} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '0 0 96px' }}>
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="mx-auto max-w-7xl px-6">
          <div style={{ marginBottom: 40 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '4px 12px', borderRadius: 4, marginBottom: 14,
              border: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(255,255,255,0.025)',
            }}>
              <span className="font-mono" style={{
                fontSize: 10, fontWeight: 600,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
              }}>학습 흐름</span>
            </div>
            <h2 className="font-display" style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.25rem)',
              fontWeight: 900, color: '#fff',
            }}>한 번 해보면 바로 보입니다</h2>
          </div>

          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
            {/* 연결선 */}
            <div style={{
              position: 'absolute', top: 18, left: 32, right: 32, height: 1,
              background: 'linear-gradient(90deg, rgba(245,158,11,0.20), rgba(245,158,11,0.06) 70%, transparent)',
              pointerEvents: 'none',
            }} />

            {STEPS.map((s, i) => (
              <div key={s.n} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
                <div style={{
                  width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 6,
                  border: '1px solid rgba(245,158,11,0.18)',
                  background: 'rgba(245,158,11,0.05)',
                  position: 'relative', zIndex: 1,
                }}>
                  <span style={{ fontSize: 15 }}>{s.icon}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span className="font-mono" style={{
                    fontSize: 9, fontWeight: 700,
                    color: 'rgba(245,158,11,0.50)',
                    letterSpacing: '0.14em',
                  }}>{s.n}</span>
                </div>
                <span className="font-sans" style={{
                  fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.3,
                }}>{s.label}</span>
                <span className="font-mono" style={{
                  fontSize: 10, textTransform: 'uppercase',
                  letterSpacing: '0.10em', color: 'rgba(255,255,255,0.28)',
                  lineHeight: 1.4,
                }}>{s.desc}</span>
                {i < 4 && (
                  <div style={{
                    position: 'absolute', top: 26, right: -4, zIndex: 2,
                    color: 'rgba(255,255,255,0.12)',
                  }}>
                    <ChevronRight size={10} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA 배너 ─────────────────────────────────────────────────── */}
      <section style={{ padding: '0 24px 96px' }}>
        <div className="mx-auto max-w-7xl">
          <div style={{
            position: 'relative', overflow: 'hidden',
            borderRadius: 20,
            border: '1px solid rgba(245,158,11,0.12)',
            background: 'linear-gradient(120deg, rgba(245,158,11,0.05) 0%, rgba(5,5,8,0) 55%)',
            padding: '56px 64px',
          }}>
            {/* 앰비언트 glow */}
            <div style={{
              position: 'absolute', top: -80, left: -40,
              width: 280, height: 280, borderRadius: '50%',
              background: 'rgba(245,158,11,0.07)',
              filter: 'blur(80px)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: -60, right: -20,
              width: 200, height: 200, borderRadius: '50%',
              background: 'rgba(124,58,237,0.05)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', maxWidth: 520 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '4px 12px', borderRadius: 4, marginBottom: 20,
                border: '1px solid rgba(245,158,11,0.18)',
                background: 'rgba(245,158,11,0.05)',
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#f59e0b',
                  boxShadow: '0 0 7px rgba(245,158,11,0.8)',
                  animation: 'pulse-glow 2.5s ease-in-out infinite',
                  flexShrink: 0,
                }} />
                <span className="font-mono" style={{
                  fontSize: 10, fontWeight: 600,
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: 'rgba(245,158,11,0.88)',
                }}>지금 바로 시작하세요</span>
              </div>

              <h2 className="font-display" style={{
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: 900, lineHeight: 1.12,
                color: '#fff', marginBottom: 16,
              }}>
                첫 질문이<br />모든 것을 바꿉니다
              </h2>
              <p className="font-sans" style={{
                fontSize: 14, color: 'rgba(255,255,255,0.38)',
                marginBottom: 32,
              }}>
                무료로 시작, 결과물은 영원히 내 것.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <Link href="/academy"
                  className="flex items-center gap-2 font-sans text-[13px] font-semibold text-black transition-all hover:bg-amber-400 active:scale-[0.97]"
                  style={{
                    background: '#f59e0b',
                    padding: '11px 28px',
                    borderRadius: 10,
                    boxShadow: '0 0 32px rgba(245,158,11,0.28)',
                  }}>
                  <Sparkles size={13} strokeWidth={2.5} />
                  무료로 시작하기
                </Link>
                <Link href="/tracks"
                  className="flex items-center gap-2 font-sans text-[13px] font-medium transition-all hover:text-white"
                  style={{
                    padding: '11px 24px',
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    color: 'rgba(255,255,255,0.45)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.18)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  }}>
                  트랙 둘러보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '28px 24px' }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15 }}>🐝</span>
            <span className="font-mono" style={{
              fontSize: 11, color: 'rgba(255,255,255,0.14)',
              letterSpacing: '0.06em',
            }}>beeliber academy</span>
          </div>
          <span className="font-mono" style={{
            fontSize: 11, color: 'rgba(255,255,255,0.12)',
            letterSpacing: '0.04em',
          }}>© 2026 Beeliber. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
