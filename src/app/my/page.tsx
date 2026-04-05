'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, LogOut, ArrowRight, Clock, Image, Video, FileText, Sparkles, ChevronRight } from 'lucide-react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';

type Profile = {
  display_name: string;
  email: string;
  account_type: string;
};

type CreditAccount = {
  balance: number;
  monthly_allowance: number;
};

type Generation = {
  id: string;
  type: 'image' | 'video' | 'text';
  model_id: string;
  prompt: string;
  output_urls: string[];
  credits_cost: number;
  created_at: string;
  status: string;
};

function typeIcon(type: string) {
  if (type === 'image') return <Image size={13} />;
  if (type === 'video') return <Video size={13} />;
  return <FileText size={13} />;
}

function typeColor(type: string) {
  if (type === 'image') return '#f59e0b';
  if (type === 'video') return '#06b6d4';
  return '#7c3aed';
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

export default function MyPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [credits, setCredits] = useState<CreditAccount | null>(null);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const sb = createBrowserSupabaseClient();
    (async () => {
      const { data: { user } } = await sb.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUserId(user.id);

      const [profileRes, creditRes, genRes] = await Promise.all([
        sb.from('profiles').select('display_name, email, account_type').eq('id', user.id).single(),
        sb.from('credit_accounts').select('balance, monthly_allowance').eq('user_id', user.id).single(),
        sb.from('generations').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (creditRes.data) setCredits(creditRes.data);
      if (genRes.data) setGenerations(genRes.data);
      setLoading(false);
    })();
  }, [router]);

  async function handleLogout() {
    const sb = createBrowserSupabaseClient();
    await sb.auth.signOut();
    router.push('/');
    router.refresh();
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#050508', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(245,158,11,0.3)', borderTopColor: '#f59e0b', animation: 'spin 0.8s linear infinite' }} />
          <span className="font-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Loading</span>
        </div>
      </div>
    );
  }

  const usedCredits = (credits?.monthly_allowance ?? 300) - (credits?.balance ?? 0);
  const creditPct = Math.max(0, Math.min(100, ((credits?.balance ?? 0) / (credits?.monthly_allowance ?? 300)) * 100));

  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: '#fff' }}>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(5,5,8,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span style={{ fontSize: 18 }}>🐝</span>
            <span className="font-sans text-sm font-semibold text-white">beeliber</span>
            <span className="font-sans text-sm" style={{ color: 'rgba(255,255,255,0.22)' }}>academy</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/academy" className="font-sans text-[13px] transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.38)' }}>실습 시작</Link>
            <button onClick={handleLogout} className="flex items-center gap-1.5 font-sans text-[12px] transition-all hover:text-white" style={{ color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <LogOut size={13} />로그아웃
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-10">

        {/* 프로필 헤더 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* 아바타 */}
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(245,158,11,0.08))', border: '1px solid rgba(245,158,11,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="font-display" style={{ fontSize: 22, fontWeight: 900, color: '#f59e0b' }}>
                {(profile?.display_name ?? 'U')[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="font-sans" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                {profile?.display_name ?? '사용자'}
              </h1>
              <p className="font-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', margin: '3px 0 0', letterSpacing: '0.06em' }}>
                {profile?.email?.replace('@beeliber.internal', '') ?? ''}
              </p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 6, padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(245,158,11,0.18)', background: 'rgba(245,158,11,0.05)' }}>
                <span className="font-mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(245,158,11,0.80)' }}>
                  {profile?.account_type ?? 'student'}
                </span>
              </span>
            </div>
          </div>

          <Link href="/academy" className="flex items-center gap-2 font-sans text-[13px] font-semibold text-black transition-all hover:bg-amber-400 active:scale-[0.97]"
            style={{ background: '#f59e0b', padding: '10px 20px', borderRadius: 10, boxShadow: '0 0 24px rgba(245,158,11,0.24)', alignSelf: 'center' }}>
            <Sparkles size={13} strokeWidth={2.5} />실습 시작하기
          </Link>
        </div>

        {/* 크레딧 카드 */}
        <div style={{ borderRadius: 16, border: '1px solid rgba(245,158,11,0.15)', background: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(5,5,8,0) 60%)', padding: '24px 28px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={15} style={{ color: '#f59e0b' }} />
              <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,158,11,0.80)' }}>크레딧</span>
            </div>
            <span className="font-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.06em' }}>
              {usedCredits} 사용 / {credits?.monthly_allowance ?? 300} 총계
            </span>
          </div>

          {/* 크레딧 수치 */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 14 }}>
            <span className="font-display" style={{ fontSize: '2.8rem', fontWeight: 900, lineHeight: 1, background: 'linear-gradient(135deg, #fcd34d, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {credits?.balance ?? 0}
            </span>
            <span className="font-mono" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>크레딧 남음</span>
          </div>

          {/* 프로그레스 바 */}
          <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${creditPct}%`, borderRadius: 2, background: 'linear-gradient(90deg, #f59e0b, #fcd34d)', transition: 'width 0.6s ease' }} />
          </div>

          {/* 크레딧 사용처 안내 */}
          <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
            {[
              { label: '이미지 생성', cost: '5–150' },
              { label: '영상 생성', cost: '180–500' },
              { label: '텍스트 AI', cost: '1–10' },
            ].map(({ label, cost }) => (
              <span key={label} className="font-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>
                {label} <span style={{ color: 'rgba(245,158,11,0.55)' }}>{cost}cr</span>
              </span>
            ))}
          </div>
        </div>

        {/* 빠른 이동 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 32 }}>
          {[
            { icon: '📣', label: '마케팅 트랙', href: '/tracks/marketing', accent: '#f59e0b' },
            { icon: '🎬', label: '이미지 투 비디오', href: '/tracks/image-to-video', accent: '#06b6d4' },
            { icon: '🏛️', label: '워크스페이스', href: '/spaces/new', accent: '#7c3aed' },
          ].map(({ icon, label, href, accent }) => (
            <Link key={href} href={href} className="group flex items-center justify-between"
              style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', textDecoration: 'none', transition: 'border-color 180ms' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${accent}44`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span className="font-sans" style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.75)' }}>{label}</span>
              </div>
              <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.22)' }} />
            </Link>
          ))}
        </div>

        {/* 생성 이력 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={14} style={{ color: 'rgba(255,255,255,0.35)' }} />
              <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.40)' }}>생성 이력</span>
            </div>
            {userId && (
              <Link href="/outputs" className="flex items-center gap-1 font-sans text-[12px] transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.25)' }}>
                전체 보기 <ArrowRight size={11} />
              </Link>
            )}
          </div>

          {generations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
              <span style={{ fontSize: 32, display: 'block', marginBottom: 12 }}>✨</span>
              <p className="font-sans" style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', margin: 0 }}>아직 생성한 콘텐츠가 없습니다</p>
              <Link href="/academy" className="inline-flex items-center gap-2 font-sans text-[13px] font-semibold text-black mt-4 transition-all hover:bg-amber-400"
                style={{ background: '#f59e0b', padding: '8px 20px', borderRadius: 8 }}>
                첫 실습 시작하기 <ArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {generations.map((g) => (
                <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                  {/* 타입 아이콘 */}
                  <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: `${typeColor(g.type)}15`, border: `1px solid ${typeColor(g.type)}30`, color: typeColor(g.type) }}>
                    {typeIcon(g.type)}
                  </div>

                  {/* 썸네일 (이미지인 경우) */}
                  {g.type === 'image' && g.output_urls?.[0] && (
                    <div style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.07)' }}>
                      <img src={g.output_urls[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}

                  {/* 프롬프트 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="font-sans" style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {g.prompt}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 3 }}>
                      <span className="font-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.06em' }}>{g.model_id}</span>
                      <span style={{ width: 2, height: 2, borderRadius: '50%', background: 'rgba(255,255,255,0.14)' }} />
                      <span className="font-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)' }}>{timeAgo(g.created_at)}</span>
                    </div>
                  </div>

                  {/* 크레딧 */}
                  <span className="font-mono" style={{ fontSize: 11, fontWeight: 600, color: 'rgba(245,158,11,0.65)', flexShrink: 0 }}>
                    -{g.credits_cost}cr
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
