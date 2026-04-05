'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';

function toEmail(id: string) {
  return id.includes('@') ? id : `${id}@beeliber.internal`;
}

export default function LoginPage() {
  const router = useRouter();
  // support ?redirect= param so /level-test and /courses can bounce back after login
  const redirectTo = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('redirect') ?? '/level-test'
    : '/level-test';
  const [tab] = useState<'login'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');


  async function handleForgotPassword() {
    if (!loginId) { setError('아이디를 먼저 입력하세요'); return; }
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.resetPasswordForEmail(toEmail(loginId), {
        redirectTo: `${window.location.origin}/login?reset=true`,
      });
      if (error) throw new Error(error.message);
      setResetSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '재설정 실패');
    } finally {
      setIsLoading(false);
    }
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

return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-black to-black" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
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
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <h2 className="mb-6 text-center text-base font-semibold text-white/80">로그인</h2>

          {error && (
            <div
              className="mb-4 rounded-xl px-4 py-3 text-xs"
              style={{
                border: '1px solid rgba(239,68,68,0.25)',
                background: 'rgba(239,68,68,0.06)',
                color: 'rgb(248,113,113)',
              }}
            >
              {error}
            </div>
          )}

          {resetSent ? (
            <div className="text-center py-4 space-y-3">
              <p className="text-2xl">📬</p>
              <p className="text-sm text-white/80 font-medium">이메일을 확인하세요</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {toEmail(loginId)} 으로 비밀번호 재설정 링크를 보냈습니다.
              </p>
              <button
                onClick={() => setResetSent(false)}
                className="text-xs mt-2"
                style={{ color: 'rgba(245,158,11,0.8)' }}
              >
                ← 로그인으로 돌아가기
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block mb-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  아이디 또는 이메일
                </label>
                <input
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  autoComplete="username"
                  required
                  placeholder="hong 또는 hong@example.com"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20"
                  style={{
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.04)',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={loginPw}
                    onChange={(e) => setLoginPw(e.target.value)}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl px-4 py-3 pr-10 text-sm text-white outline-none transition-colors placeholder:text-white/20"
                    style={{
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.04)',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 보기'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors p-1"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full rounded-xl py-3 text-sm font-semibold text-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: isLoading ? '#d97706' : '#f59e0b' }}
              >
                {isLoading ? (
                  <><Loader2 size={14} className="animate-spin" /> 로그인 중…</>
                ) : (
                  '로그인'
                )}
              </button>
              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs transition-colors"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(245,158,11,0.8)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                >
                  비밀번호를 잊으셨나요?
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          <Link href="/" className="hover:text-white/50 transition-colors">← 홈으로 돌아가기</Link>
        </p>
      </div>
    </div>
  );
}
