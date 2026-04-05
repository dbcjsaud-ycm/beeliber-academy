'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, Sparkles, ChevronRight, Zap, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';

function toEmail(id: string) {
  return id.includes('@') ? id : `${id}@beeliber.internal`;
}

const SplineScene = dynamic(() => import('@/components/landing/SplineScene'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%', background: 'transparent' }} />,
});

const TRACKS = [
  { no: '01', icon: '📣', label: '마케팅', sub: 'SNS · SEO · GEO 전략', desc: 'Super Gems 활용, GEO 전략, SNS-SEO 연결 워크플로우를 AI로 완성합니다.', outputs: ['광고 제목 10개 + 설명 3개', 'CTA 5개 + 해시태그 15개', '썸네일 문구 세트'], href: '/tracks/marketing', time: '2–3h', level: '초급', accent: '#f59e0b', glow: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.20)', gradStart: 'rgba(245,158,11,0.04)' },
  { no: '02', icon: '🎬', label: '이미지 투 비디오', sub: '기준이미지 → 첫프레임 → 영상', desc: '기준 이미지를 먼저 생성하고 첫 프레임으로 고정해 영상으로 만드는 파이프라인.', outputs: ['기준 이미지 프롬프트', '장면별 영상 프롬프트', '자막 + 업로드 패키지'], href: '/tracks/image-to-video', time: '3–4h', level: '중급', accent: '#06b6d4', glow: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.18)', gradStart: 'rgba(6,182,212,0.03)' },
  { no: '03', icon: '💻', label: '웹/앱 개발', sub: '기획 → 구조 → 작업지시서', desc: '화면 구조, 기능 목록, 개발 작업지시서까지 AI로 완성합니다.', outputs: ['서비스 소개 + 화면 구조', '핵심 기능 목록', '개발 작업지시서'], href: '/tracks/web-app', time: '3–5h', level: '중급', accent: '#7c3aed', glow: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.18)', gradStart: 'rgba(124,58,237,0.03)' },
  { no: '04', icon: '🤖', label: '자동화', sub: 'Tree of Thoughts · RAG · Reflection', desc: '반복 업무를 AI 파이프라인으로 자동화하는 고급 프롬프팅 기법을 실습합니다.', outputs: ['반복업무 정의 + 입출력 구조', '단계별 요청문', '최종 출력 형식'], href: '/tracks/automation', time: '4–6h', level: '고급', accent: '#f59e0b', glow: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.20)', gradStart: 'rgba(245,158,11,0.04)' },
];

const STEPS = [
  { n: '01', label: '교수 설명', desc: '핵심 개념과 따라하기 순서', icon: '📖' },
  { n: '02', label: '프롬프트 입력', desc: '예시 칩 클릭 또는 직접 작성', icon: '✍️' },
  { n: '03', label: 'AI 실행', desc: 'Gemini · GPT · Claude', icon: '⚡' },
  { n: '04', label: '자동 검수', desc: '품질·정책·목적 체크', icon: '✅' },
  { n: '05', label: '결과 저장', desc: '버전 단위 저장', icon: '💾' },
];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 8, color: '#fff', fontSize: 13,
  outline: 'none', boxSizing: 'border-box',
};

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; id: string; displayName: string } | null | undefined>(undefined);
  const [uid, setUid] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const sb = createBrowserSupabaseClient();
    sb.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setUser(null); return; }
      const { data: profile } = await sb
        .from('profiles')
        .select('display_name')
        .eq('id', data.user.id)
        .single();
      setUser({
        email: data.user.email ?? '',
        id: data.user.id,
        displayName: profile?.display_name || data.user.email?.replace('@beeliber.internal', '') || '',
      });
    });
  }, []);

  function authNavigate(href: string) {
    if (user) { router.push(href); }
    else { router.push(`/login?redirect=${encodeURIComponent(href)}`); }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setErr(null);
    try {
      const sb = createBrowserSupabaseClient();
      const { error } = await sb.auth.signInWithPassword({ email: toEmail(uid), password: pw });
      if (error) throw new Error('아이디 또는 비밀번호가 올바르지 않습니다');
      router.push('/level-test'); router.refresh();
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : '로그인 실패'); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d18', color: '#fff', overflowX: 'hidden' }}>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(13,13,24,0.80)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span style={{ fontSize: 20, lineHeight: 1 }}>🐝</span>
            <span className="font-sans text-sm font-semibold tracking-tight text-white">beeliber</span>
            <span className="font-sans text-sm font-normal" style={{ color: 'rgba(255,255,255,0.45)' }}>academy</span>
          </Link>
          <div className="hidden items-center gap-7 md:flex">
            {[{ label: '실전 세션', href: '/tracks' }, { label: '실습 랩', href: '/lab/marketing/campaign-copy-studio' }, { label: '워크스페이스', href: '/spaces/new' }, { label: '입문 과정', href: '/start' }].map(({ label, href }) => (
              <button key={href} onClick={() => authNavigate(href)} className="font-sans text-[13px] font-normal transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.58)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>{label}</button>
            ))}
          </div>
          {user ? (
            <Link href="/my" className="flex items-center gap-1.5 font-sans text-xs font-medium transition-all hover:text-white" style={{ color: 'rgba(255,255,255,0.55)', padding: '7px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.09)' }}>마이페이지</Link>
          ) : (
            <Link href="/login" className="flex items-center gap-1.5 font-sans text-xs font-semibold text-black transition-all hover:bg-amber-400 active:scale-[0.97]" style={{ background: '#f59e0b', padding: '7px 16px', borderRadius: 10, boxShadow: '0 0 18px rgba(245,158,11,0.28)' }}>
              <Sparkles size={11} strokeWidth={2.5} />무료로 시작
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', height: '100vh', minHeight: 700, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <SplineScene />
        </div>
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(13,13,24,0.65) 24%, rgba(13,13,24,0.38) 48%, rgba(13,13,24,0.10) 68%, transparent 100%)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(to bottom, rgba(13,13,24,0.40), transparent)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 180, background: 'linear-gradient(to top, rgba(13,13,24,0.85), transparent)' }} />
        </div>

        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', zIndex: 10 }}>
          <div className="mx-auto w-full max-w-7xl px-6">
            <div style={{ marginLeft: 'auto', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 22, background: 'rgba(13,13,24,0.52)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, padding: '32px 36px', boxShadow: '0 8px 48px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.06)' }}>

              {/* 배지 */}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 4, border: '1px solid rgba(6,182,212,0.18)', background: 'rgba(6,182,212,0.05)', alignSelf: 'flex-start' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 8px rgba(34,211,238,0.9)', flexShrink: 0 }} />
                <span className="font-mono" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(34,211,238,0.85)' }}>AI 실습 교육 플랫폼</span>
              </span>

              {/* 헤드라인 */}
              <h1 className="font-display" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', fontWeight: 900, lineHeight: 1.06, letterSpacing: '-0.02em', margin: 0 }}>
                <span style={{ display: 'block', color: '#fff' }}>작은 질문이</span>
                <span style={{ display: 'block', fontStyle: 'italic', background: 'linear-gradient(115deg, #fcd34d 0%, #f59e0b 50%, #d97706 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>거대한 변화를</span>
                <span style={{ display: 'block', color: '#fff' }}>만듭니다</span>
              </h1>

              {/* 본문 */}
              <p className="font-sans" style={{ fontSize: 14, lineHeight: 1.70, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                마케팅·영상·개발·자동화 4개 트랙.<br />
                실제 프롬프트와 결과 패널로 학습하고<br />
                결과물은 버전 단위로 저장됩니다.
              </p>

              {/* Auth 영역 */}
              {user === undefined ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
                  <Loader2 size={18} style={{ color: 'rgba(255,255,255,0.50)', animation: 'spin 1s linear infinite' }} />
                </div>
              ) : user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <p className="font-sans" style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                    <span style={{ color: '#f59e0b', fontWeight: 600 }}>{user.displayName}</span>님, 환영합니다
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link href="/academy" className="group flex items-center justify-center gap-2 font-sans text-[13px] font-semibold text-black transition-all hover:bg-amber-400 active:scale-[0.97]" style={{ background: '#f59e0b', padding: '10px 20px', borderRadius: 10, boxShadow: '0 0 28px rgba(245,158,11,0.28)', flex: 1 }}>
                      실습 시작하기 <ArrowRight size={13} strokeWidth={2.5} />
                    </Link>
                    <Link href="/my" className="flex items-center justify-center font-sans text-[13px] font-medium transition-all hover:text-white" style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.50)' }}>마이페이지</Link>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p className="font-sans" style={{ fontSize: 12, color: 'rgba(255,255,255,0.40)', margin: 0, textAlign: 'center' }}>로그인 후 실습을 시작하세요</p>
                  <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input placeholder="아이디 (또는 이메일)" value={uid} onChange={e => setUid(e.target.value)} required style={inputStyle} />
                    <div style={{ position: 'relative' }}>
                      <input type={showPw ? 'text' : 'password'} placeholder="비밀번호" value={pw} onChange={e => setPw(e.target.value)} required style={{ ...inputStyle, paddingRight: 36 }} />
                      <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'rgba(255,255,255,0.50)' }}>
                        {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {err && <p className="font-sans" style={{ fontSize: 12, color: '#f87171', margin: 0 }}>{err}</p>}
                    <button type="submit" disabled={loading} className="font-sans text-[13px] font-semibold text-black transition-all hover:bg-amber-400 active:scale-[0.97] disabled:opacity-60" style={{ background: '#f59e0b', padding: '10px 0', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 0 24px rgba(245,158,11,0.28)' }}>
                      {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={13} strokeWidth={2.5} />}
                      로그인
                    </button>
                  </form>
                </div>
              )}

              {/* 스탯 바 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {[{ v: '04', l: '실전 트랙' }, { v: '28+', l: '실습 모듈' }, { v: 'AI', l: '자동 검수' }].map(({ v, l }) => (
                  <div key={l} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span className="font-mono" style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1, background: 'linear-gradient(135deg, #fcd34d, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{v}</span>
                    <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.45)' }}>{l}</span>
                  </div>
                ))}
                <div style={{ marginLeft: 'auto' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                    <Zap size={9} style={{ color: 'rgba(245,158,11,0.5)' }} />
                    <span className="font-mono" style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.50)' }}>Gemini · GPT · Claude</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 스크롤 인디케이터 */}
        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 10 }}>
          <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)' }} />
          <span className="font-mono" style={{ fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>scroll</span>
        </div>
      </section>

      {/* AI 모델 스트립 */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="mx-auto max-w-7xl" style={{ padding: '14px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="font-mono" style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.52)', whiteSpace: 'nowrap', marginRight: 24 }}>지원 AI 엔진</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.04)', marginRight: 24 }} />
            {['Gemini 2.0', 'GPT-4o', 'Claude 3.7', 'Imagen 4', 'Kling 3', 'ElevenLabs'].map((name, i) => (
              <span key={name} className="font-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 500, padding: i === 0 ? '0 20px 0 0' : '0 20px', borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>{name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tracks */}
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <section className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="mb-14 flex items-end justify-between gap-4">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 4, marginBottom: 14, border: '1px solid rgba(245,158,11,0.15)', background: 'rgba(245,158,11,0.04)' }}>
                <span className="font-mono" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(245,158,11,0.80)' }}>실전 세션</span>
              </div>
              <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, lineHeight: 1.15, color: '#fff' }}>어떤 결과물을 만들 건가요?</h2>
              <p className="font-sans" style={{ marginTop: 8, fontSize: 14, color: 'rgba(255,255,255,0.52)' }}>4개 트랙 중 하나를 선택해 실제 프롬프트와 결과물을 만들어보세요</p>
            </div>
            <button onClick={() => authNavigate('/tracks')} className="hidden shrink-0 items-center gap-1 font-sans text-sm transition-colors hover:text-white sm:flex" style={{ color: 'rgba(255,255,255,0.45)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>전체 보기 <ChevronRight size={13} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {TRACKS.map((t) => (
              <button key={t.no} onClick={() => authNavigate(t.href)} className="group" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'transform 200ms ease, box-shadow 200ms ease', textDecoration: 'none', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', background: `linear-gradient(140deg, ${t.gradStart} 0%, rgba(255,255,255,0.015) 100%)`, padding: '24px', cursor: 'pointer', textAlign: 'left' }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = t.border; el.style.boxShadow = `0 12px 48px ${t.glow}, 0 1px 0 ${t.border} inset`; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.07)'; el.style.boxShadow = ''; }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22, lineHeight: 1 }}>{t.icon}</span>
                    <span className="font-mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: t.accent }}>{t.no}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ padding: '2px 8px', borderRadius: 4, border: `1px solid ${t.border}`, background: t.glow, color: t.accent }}><span className="font-mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{t.level}</span></span>
                    <span style={{ padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.025)' }}><span className="font-mono" style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.50)' }}>{t.time}</span></span>
                  </div>
                </div>
                <h3 className="font-sans" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: 3 }}>{t.label}</h3>
                <p className="font-mono" style={{ fontSize: 11, marginBottom: 6, color: t.accent, opacity: 0.9, letterSpacing: '0.04em' }}>{t.sub}</p>
                <p className="font-sans" style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(255,255,255,0.58)', flex: 1, marginBottom: 18 }}>{t.desc}</p>
                <div style={{ borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.20)', padding: '10px 12px', marginBottom: 18 }}>
                  <p className="font-mono" style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.52)', marginBottom: 8 }}>결과물</p>
                  {t.outputs.map((o) => (
                    <div key={o} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                      <span style={{ width: 3, height: 3, borderRadius: '50%', background: t.accent, flexShrink: 0, opacity: 0.7 }} />
                      <span className="font-sans" style={{ fontSize: 12, color: 'rgba(255,255,255,0.60)' }}>{o}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }} className="transition-all duration-150 group-hover:gap-2.5">
                  <span className="font-mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: t.accent }}>트랙 시작</span>
                  <ArrowRight size={11} strokeWidth={2.5} style={{ color: t.accent }} />
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* How it works */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '0 0 96px' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="mx-auto max-w-7xl px-6">
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 4, marginBottom: 14, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.025)' }}>
              <span className="font-mono" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>학습 흐름</span>
            </div>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.25rem)', fontWeight: 900, color: '#fff' }}>한 번 해보면 바로 보입니다</h2>
          </div>
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
            <div style={{ position: 'absolute', top: 18, left: 32, right: 32, height: 1, background: 'linear-gradient(90deg, rgba(245,158,11,0.20), rgba(245,158,11,0.06) 70%, transparent)', pointerEvents: 'none' }} />
            {STEPS.map((s, i) => (
              <div key={s.n} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
                <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid rgba(245,158,11,0.18)', background: 'rgba(245,158,11,0.05)', position: 'relative', zIndex: 1 }}>
                  <span style={{ fontSize: 15 }}>{s.icon}</span>
                </div>
                <span className="font-mono" style={{ fontSize: 9, fontWeight: 700, color: 'rgba(245,158,11,0.50)', letterSpacing: '0.14em' }}>{s.n}</span>
                <span className="font-sans" style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>{s.label}</span>
                <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'rgba(255,255,255,0.50)', lineHeight: 1.4 }}>{s.desc}</span>
                {i < 4 && <div style={{ position: 'absolute', top: 26, right: -4, zIndex: 2, color: 'rgba(255,255,255,0.28)' }}><ChevronRight size={10} /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 배너 */}
      <section style={{ padding: '0 24px 96px' }}>
        <div className="mx-auto max-w-7xl">
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 20, border: '1px solid rgba(245,158,11,0.12)', background: 'linear-gradient(120deg, rgba(245,158,11,0.05) 0%, rgba(13,13,24,0) 55%)', padding: '56px 64px' }}>
            <div style={{ position: 'absolute', top: -80, left: -40, width: 280, height: 280, borderRadius: '50%', background: 'rgba(245,158,11,0.07)', filter: 'blur(80px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -60, right: -20, width: 200, height: 200, borderRadius: '50%', background: 'rgba(124,58,237,0.05)', filter: 'blur(60px)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', maxWidth: 520 }}>
              <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, lineHeight: 1.12, color: '#fff', marginBottom: 16 }}>첫 질문이<br />모든 것을 바꿉니다</h2>
              <p className="font-sans" style={{ fontSize: 14, color: 'rgba(255,255,255,0.58)', marginBottom: 32 }}>무료로 시작, 크레딧 300 즉시 지급.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <Link href="/login" className="flex items-center gap-2 font-sans text-[13px] font-semibold text-black transition-all hover:bg-amber-400 active:scale-[0.97]" style={{ background: '#f59e0b', padding: '11px 28px', borderRadius: 10, boxShadow: '0 0 32px rgba(245,158,11,0.28)' }}>
                  <Sparkles size={13} strokeWidth={2.5} />무료로 시작하기
                </Link>
                <button onClick={() => authNavigate('/tracks')} className="flex items-center gap-2 font-sans text-[13px] font-medium transition-all hover:text-white" style={{ padding: '11px 24px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.45)', cursor: 'pointer' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.18)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}>트랙 둘러보기</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '28px 24px' }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15 }}>🐝</span>
            <span className="font-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.14)', letterSpacing: '0.06em' }}>beeliber academy</span>
          </div>
          <span className="font-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.42)', letterSpacing: '0.04em' }}>© 2026 Beeliber. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
