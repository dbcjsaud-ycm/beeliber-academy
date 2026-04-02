"use client";

import { motion } from "motion/react";
import { ChevronRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState, lazy, Suspense } from "react";

const BubbleBackground = lazy(() => import("@/components/academy/BubbleBackground"));

// ─── Beeliber Logo ───────────────────────────────────
function BeeliberLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFC700" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="7" stroke="white" strokeWidth="1.2" fill="none" />
      <circle cx="11" cy="16" r="4.5" fill="url(#amberGrad)" />
      <circle cx="22" cy="10" r="2" fill="white" />
      <circle cx="22" cy="22" r="2" fill="white" />
      <path d="M15.5 16L20 10M15.5 16L20 22" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Header (랜딩 전용 — 네비 숨김) ─────────────────
function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between py-6"
    >
      <div className="flex items-center gap-2">
        <BeeliberLogo className="h-7 w-7" />
        <span className="text-lg font-semibold text-white">
          <span>bee</span>
          <span className="text-amber-400 italic">liber</span>
          <span className="text-white/40 ml-1.5 text-sm font-normal">Academy</span>
        </span>
      </div>
      <span className="text-xs text-white/20">로그인 후 모든 기능을 이용하세요</span>
    </motion.div>
  );
}

// ─── Login Form ──────────────────────────────────────
function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userId.trim()) { setError("아이디를 입력하세요"); return; }
    if (!password.trim()) { setError("비밀번호를 입력하세요"); return; }

    setLoading(true);

    // 로컬 세션 쿠키 설정 후 이동
    document.cookie = `academy_session=${userId}; path=/; max-age=86400`;
    document.cookie = `academy_user=${userId}; path=/; max-age=86400`;

    try {
      // Supabase Auth 시도 (이메일 형식으로 변환)
      const email = userId.includes("@") ? userId : `${userId}@beeliber.com`;
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = "/academy";
      } else {
        // Supabase 실패해도 로컬 세션으로 진입
        window.location.href = "/academy";
      }
    } catch {
      // 네트워크 실패 시에도 로컬 세션으로 진입
      window.location.href = "/academy";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full max-w-sm"
    >
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl shadow-2xl shadow-black/20">
        <h2 className="text-xl font-bold text-white mb-1">로그인</h2>
        <p className="text-sm text-white/50 mb-6">빌리버 Academy에 접속합니다</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-white/50 block mb-1.5">아이디</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="아이디를 입력하세요"
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-amber-400/50 focus:bg-white/[0.05]"
            />
          </div>

          <div>
            <label className="text-xs text-white/50 block mb-1.5">비밀번호</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-amber-400/50 focus:bg-white/[0.05] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-white/50 cursor-pointer">
              <input type="checkbox" className="rounded border-white/20 bg-white/5 text-amber-400" />
              로그인 유지
            </label>
            <button type="button" className="text-xs text-amber-400/80 hover:text-amber-400">
              비밀번호 찾기
            </button>
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-xs text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-white/90 hover:shadow-lg hover:shadow-white/20 disabled:opacity-50"
          >
            {loading ? "로그인 중..." : "시작하기"}
            <ChevronRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-4 text-center text-[10px] text-white/20">
          관리자에게 아이디를 발급받으세요
        </p>
      </div>
    </motion.div>
  );
}

// ─── Feature Cards (하단) ────────────────────────────
const FEATURES = [
  { icon: "🧠", title: "하네스 엔지니어링", desc: "Planner → Generator → Evaluator → Coach" },
  { icon: "🎬", title: "영상 솔루션 랩", desc: "Higgsfield / Freepik 실습" },
  { icon: "⚡", title: "AI 플레이그라운드", desc: "Gemini 실시간 결과 + 자동 검수" },
  { icon: "🔗", title: "워크플로우 캔버스", desc: "노드 기반 파이프라인 설계" },
];

// ─── Main Landing Page ───────────────────────────────
export default function LandingPage() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* 3D Bubble Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
          <BubbleBackground />
        </Suspense>
      </div>

      {/* 도트 그리드 오버레이만 */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Header />
        </div>

        {/* Hero + Login */}
        <div className="flex flex-1 items-center px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
            {/* 좌측: Hero Text */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/5 px-4 py-1.5 mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs text-amber-400">Phase 1 운영 중</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl font-normal tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                실습으로 배우는
                <br />
                <span className="font-semibold italic text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                  AI 실무 교육
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-6 max-w-md text-sm leading-relaxed text-white/50 lg:text-base"
              >
                빌리버 Academy는 일반 LMS가 아닙니다.{"\n"}
                하네스 엔지니어링 구조로 교육과 실무 검수를{"\n"}
                동시에 수행하는 실행형 훈련 시스템입니다.
              </motion.p>

              {/* Feature Pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start"
              >
                {FEATURES.map((f) => (
                  <div key={f.title} className="flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-4 py-2">
                    <span className="text-base">{f.icon}</span>
                    <div>
                      <p className="text-xs font-medium text-white/80">{f.title}</p>
                      <p className="text-[10px] text-white/30">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* 우측: Login Form */}
            <LoginForm />
          </div>
        </div>

        {/* 하단 Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 border-t border-white/5 pt-8">
            {[
              { value: "7", label: "학습 트랙" },
              { value: "19", label: "실습 모듈" },
              { value: "10+", label: "AI 과제" },
              { value: "6", label: "직원 교육" },
              { value: "32h", label: "총 교육 시간" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-white/30 tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
