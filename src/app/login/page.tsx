'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';

function toEmail(id: string) {
  return id.includes('@') ? id : `${id}@beeliber.internal`;
}

type View = 'login' | 'signup' | 'forgot';

export default function LoginPage() {
  const router = useRouter();
  const redirectTo = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('redirect') ?? '/level-test'
    : '/level-test';

  const [view, setView] = useState<View>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // login
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');

  // signup
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPw, setSignupPw] = useState('');
  const [signupPwConfirm, setSignupPwConfirm] = useState('');
  const [signupDone, setSignupDone] = useState(false);

  // forgot
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  function goTo(v: View) {
    setView(v);
    setError(null);
    setShowPw(false);
    setShowConfirmPw(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: toEmail(loginId),
        password: loginPw,
      });
      if (error) throw new Error('아이디 또는 비밀번호가 올바르지 않습니다');
      router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '로그인 실패');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (signupPw !== signupPwConfirm) { setError('비밀번호가 일치하지 않습니다'); return; }
    if (signupPw.length < 6) { setError('비밀번호는 6자 이상이어야 합니다'); return; }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail, password: signupPw, name: signupName, loginId: signupEmail }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? '회원가입 실패');
      const supabase = createBrowserSupabaseClient();
      const { error: loginError } = await supabase.auth.signInWithPassword({ email: signupEmail, password: signupPw });
      if (loginError) { setSignupDone(true); return; }
      router.push('/level-test');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '회원가입 실패');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    if (!forgotEmail) { setError('이메일을 입력하세요'); return; }
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.resetPasswordForEmail(toEmail(forgotEmail), {
        redirectTo: `${window.location.origin}/login?reset=true`,
      });
      if (error) throw new Error(error.message);
      setForgotSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '재설정 메일 발송 실패');
    } finally {
      setIsLoading(false);
    }
  }

  const inputCls = 'w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20';
  const inputStyle = { border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' };
  const focusAmber = (e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)');
  const blurGray   = (e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)');

  const titles: Record<View, string> = { login: '로그인', signup: '회원가입', forgot: '비밀번호 찾기' };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-black to-black" />
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-white">bee</span>
            <span className="text-2xl font-bold text-amber-400 italic">liber</span>
          </Link>
          <p className="mt-1 text-sm text-white/30">Academy</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(40px) saturate(160%)',
            WebkitBackdropFilter: 'blur(40px) saturate(160%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            {view !== 'login' && (
              <button
                type="button"
                onClick={() => goTo('login')}
                className="p-1 rounded-lg transition-colors"
                style={{ color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <h2 className="text-base font-semibold text-white/80">{titles[view]}</h2>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-xl px-4 py-3 text-xs" style={{ border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.06)', color: 'rgb(248,113,113)' }}>
              {error}
            </div>
          )}

          {/* ── LOGIN ── */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block mb-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>아이디 또는 이메일</label>
                <input
                  value={loginId} onChange={(e) => setLoginId(e.target.value)}
                  autoComplete="username" required placeholder="hong 또는 hong@example.com"
                  className={inputCls} style={inputStyle} onFocus={focusAmber} onBlur={blurGray}
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>비밀번호</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={loginPw} onChange={(e) => setLoginPw(e.target.value)}
                    autoComplete="current-password" required placeholder="••••••••"
                    className={`${inputCls} pr-10`} style={inputStyle} onFocus={focusAmber} onBlur={blurGray}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={isLoading}
                className="mt-2 w-full rounded-xl py-3 text-sm font-semibold text-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: isLoading ? '#d97706' : '#f59e0b' }}
              >
                {isLoading ? <><Loader2 size={14} className="animate-spin" /> 로그인 중…</> : '로그인'}
              </button>

              {/* Below login: forgot (left) + signup (right) */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button" onClick={() => goTo('forgot')}
                  className="text-xs transition-colors"
                  style={{ color: 'rgba(255,255,255,0.30)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(245,158,11,0.8)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.30)')}
                >
                  비밀번호 찾기
                </button>
                <button
                  type="button" onClick={() => goTo('signup')}
                  className="text-xs font-semibold px-4 py-1.5 rounded-lg transition-all"
                  style={{ border: '1px solid rgba(245,158,11,0.35)', color: 'rgba(245,158,11,0.9)', background: 'rgba(245,158,11,0.06)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(245,158,11,0.14)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.6)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(245,158,11,0.06)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.35)'; }}
                >
                  회원가입
                </button>
              </div>
            </form>
          )}

          {/* ── SIGNUP ── */}
          {view === 'signup' && (
            signupDone ? (
              <div className="text-center py-6 space-y-3">
                <p className="text-3xl">🎉</p>
                <p className="text-sm text-white/90 font-semibold">가입 완료!</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>로그인 탭에서 시작하세요.</p>
                <button onClick={() => goTo('login')} className="mt-4 w-full rounded-xl py-3 text-sm font-semibold text-black" style={{ background: '#f59e0b' }}>
                  로그인하러 가기
                </button>
              </div>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block mb-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>이름</label>
                  <input value={signupName} onChange={(e) => setSignupName(e.target.value)} required placeholder="홍길동" className={inputCls} style={inputStyle} onFocus={focusAmber} onBlur={blurGray} />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>이메일</label>
                  <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required placeholder="hong@example.com" className={inputCls} style={inputStyle} onFocus={focusAmber} onBlur={blurGray} />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>비밀번호</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'} value={signupPw} onChange={(e) => setSignupPw(e.target.value)}
                      autoComplete="new-password" required placeholder="6자 이상"
                      className={`${inputCls} pr-10`} style={inputStyle} onFocus={focusAmber} onBlur={blurGray}
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block mb-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>비밀번호 확인</label>
                  <div className="relative">
                    <input
                      type={showConfirmPw ? 'text' : 'password'} value={signupPwConfirm} onChange={(e) => setSignupPwConfirm(e.target.value)}
                      autoComplete="new-password" required placeholder="비밀번호 재입력"
                      className={`${inputCls} pr-10`}
                      style={{ ...inputStyle, borderColor: signupPwConfirm && signupPw !== signupPwConfirm ? 'rgba(239,68,68,0.5)' : undefined }}
                      onFocus={focusAmber}
                      onBlur={(e) => { e.currentTarget.style.borderColor = signupPwConfirm && signupPw !== signupPwConfirm ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'; }}
                    />
                    <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {showConfirmPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {signupPwConfirm && signupPw !== signupPwConfirm && (
                    <p className="mt-1 text-xs" style={{ color: 'rgba(239,68,68,0.8)' }}>비밀번호가 일치하지 않습니다</p>
                  )}
                </div>
                <button
                  type="submit" disabled={isLoading}
                  className="mt-2 w-full rounded-xl py-3 text-sm font-semibold text-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: isLoading ? '#d97706' : '#f59e0b' }}
                >
                  {isLoading ? <><Loader2 size={14} className="animate-spin" /> 가입 중…</> : '회원가입'}
                </button>
              </form>
            )
          )}

          {/* ── FORGOT PASSWORD ── */}
          {view === 'forgot' && (
            forgotSent ? (
              <div className="text-center py-4 space-y-3">
                <p className="text-3xl">📬</p>
                <p className="text-sm text-white/80 font-medium">이메일을 확인하세요</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <span className="text-white/60">{forgotEmail}</span>로 비밀번호 재설정 링크를 보냈습니다.
                </p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>링크를 클릭하면 새 비밀번호를 설정할 수 있어요.</p>
                <button onClick={() => goTo('login')} className="text-xs mt-2 transition-colors" style={{ color: 'rgba(245,158,11,0.8)' }}>
                  ← 로그인으로 돌아가기
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgot} className="space-y-4">
                <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  가입 시 사용한 이메일을 입력하면 비밀번호 재설정 링크를 보내드려요.
                </p>
                <div>
                  <label className="block mb-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>이메일</label>
                  <input
                    type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)}
                    required placeholder="hong@example.com"
                    className={inputCls} style={inputStyle} onFocus={focusAmber} onBlur={blurGray}
                  />
                </div>
                <button
                  type="submit" disabled={isLoading}
                  className="w-full rounded-xl py-3 text-sm font-semibold text-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: isLoading ? '#d97706' : '#f59e0b' }}
                >
                  {isLoading ? <><Loader2 size={14} className="animate-spin" /> 전송 중…</> : '재설정 링크 보내기'}
                </button>
              </form>
            )
          )}
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          <Link href="/" className="hover:text-white/50 transition-colors">← 홈으로 돌아가기</Link>
        </p>
      </div>
    </div>
  );
}
