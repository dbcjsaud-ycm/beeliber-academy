"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight, Menu, X, LogOut } from "lucide-react";
import { TRACKS, MODULES, ASSIGNMENTS, getModulesByTrack } from "@/lib/academy/data";
import { Badge } from "@/components/ui/badge";

const MOCK_USER = { name: "오현정", role: "marketer" as const };

const TRACK_ICONS: Record<string, string> = {
  common: "🏕️", tools: "🔧", supergems: "💎",
  multimodal: "🎨", "video-lab": "🎬", "use-cases": "🚀", optimization: "⚡",
};

const TRACK_GLOW: Record<string, string> = {
  common: "node-card-green", tools: "node-card", supergems: "node-card-purple",
  multimodal: "node-card-orange", "video-lab": "node-card-amber", "use-cases": "node-card", optimization: "node-card-purple",
};

const NAV_ITEMS = [
  { label: "대시보드", href: "/academy" },
  { label: "AI 플레이그라운드", href: "/academy/playground" },
  { label: "워크플로우 캔버스", href: "/academy/workflow-canvas" },
  { label: "AI 레벨체크", href: "/academy/level-check" },
  { label: "과제 센터", href: "/academy/assignments" },
  { label: "관리자", href: "/admin" },
];

const dueAssignments = ASSIGNMENTS.slice(0, 3);

export default function AcademyDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen academy-bg text-white">
      {/* 상단 Phase 경고 */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-400 text-center py-1.5 text-xs font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block mr-2 animate-pulse" />
        Phase 1 기준 운영 · 미운영 서비스 언급 절대 금지 · 금지 표현 10개 정책 적용 중
      </div>

      {/* 헤더 */}
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/academy" className="text-lg font-semibold">
              <span className="text-white">bee</span>
              <span className="text-amber-400 italic">liber</span>
              <span className="text-white/30 ml-1.5 text-sm font-normal">Academy</span>
            </Link>
          </div>

          {/* 데스크톱 네비 */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <Link key={item.label} href={item.href} className="text-xs text-white/50 hover:text-white transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* 모바일 메뉴 버튼 */}
            <button className="md:hidden text-white/50 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Badge className="bg-white/5 text-white/40 border-white/10 text-xs hidden sm:flex">{MOCK_USER.role}</Badge>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black text-xs font-bold">
              {MOCK_USER.name[0]}
            </div>
            <Link href="/" className="text-white/30 hover:text-white/60">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-white/5 px-4 py-3 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-white/60 hover:text-white">
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 환영 */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="glass-panel p-8">
            <p className="text-blue-400 text-sm font-semibold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              {MOCK_USER.name}님, 환영합니다
            </p>
            <h2 className="text-3xl font-black mb-2">
              교육은 이론이 아니라 <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">실행 결과물</span>을 만든다
            </h2>
            <p className="text-secondary-dark mb-6 text-sm">
              Planner → Generator → Evaluator → Coach 하네스 엔지니어링 구조로 실무 역량을 키웁니다.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/academy/level-check">
                <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white/90">
                  🐣 내 AI 레벨 체크 <ChevronRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/academy/playground">
                <button className="rounded-full border border-green-500/30 bg-transparent px-5 py-2.5 text-sm text-green-400 hover:bg-green-500/10">
                  ⚡ AI 플레이그라운드
                </button>
              </Link>
              <Link href="/academy/workflow-canvas">
                <button className="rounded-full border border-blue-500/30 bg-transparent px-5 py-2.5 text-sm text-blue-400 hover:bg-blue-500/10">
                  🔗 워크플로우 캔버스
                </button>
              </Link>
            </div>
          </div>
        </motion.section>

        {/* 내 진행률 */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm">내 진행률</h3>
              <span className="text-2xl font-black text-blue-400">0%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-3 mb-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{ width: "0%" }} />
            </div>
            <div className="flex gap-6 text-xs text-secondary-dark">
              <span>완료 모듈: <strong className="text-white">0/{MODULES.length}</strong></span>
              <span>과제 통과: <strong className="text-white">0/{ASSIGNMENTS.length}</strong></span>
              <span>추천 역할: <strong className="text-amber-400">—</strong></span>
            </div>
          </div>
        </motion.section>

        {/* 마감 임박 과제 */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
          <h3 className="font-bold mb-4 text-sm">마감 임박 과제</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dueAssignments.map((a) => (
              <Link key={a.id} href={`/academy/assignments/${a.id}`}>
                <div className="node-card p-5 h-full cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">D-{a.due_days}</Badge>
                  </div>
                  <h4 className="font-semibold mb-2 text-sm">{a.title}</h4>
                  <p className="text-xs text-secondary-dark line-clamp-2">{a.description}</p>
                  <Badge className="mt-3 bg-white/5 text-secondary-dark border-white/10 text-xs">{a.submission_type}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* 학습 트랙 */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
          <h3 className="font-bold mb-4 text-sm">학습 트랙</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TRACKS.map((track) => {
              const modules = getModulesByTrack(track.id);
              return (
                <Link key={track.id} href={`/academy/${track.slug}`}>
                  <div className={`node-card ${TRACK_GLOW[track.slug]} p-5 h-full cursor-pointer`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{TRACK_ICONS[track.slug]}</span>
                      <Badge className="bg-white/5 text-secondary-dark border-white/10 text-xs">{modules.length}개 모듈</Badge>
                    </div>
                    <h4 className="font-bold mb-1 text-sm">{track.title}</h4>
                    <p className="text-xs text-secondary-dark mb-3">{track.description}</p>
                    <div className="w-full bg-white/5 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full" style={{ width: "0%" }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.section>

        {/* 하네스 구조 */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-8">
          <div className="glass-panel p-8">
            <h3 className="font-bold mb-6 text-sm text-center">하네스 엔지니어링 구조</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Planner", desc: "학습 경로 설계\n과제 기준 정의", color: "from-blue-500 to-blue-600" },
                { name: "Generator", desc: "과제 초안 생성\n실습 샘플 제작", color: "from-green-500 to-green-600" },
                { name: "Evaluator", desc: "브랜드 위반 탐지\n자동 검수 실행", color: "from-red-500 to-red-600" },
                { name: "Coach", desc: "피드백 제공\n재제출 가이드", color: "from-purple-500 to-purple-600" },
              ].map((agent) => (
                <div key={agent.name} className="text-center glass-panel-light p-4 rounded-xl">
                  <div className={`w-12 h-12 bg-gradient-to-br ${agent.color} rounded-xl mx-auto mb-3 flex items-center justify-center font-bold text-lg shadow-lg`}>
                    {agent.name[0]}
                  </div>
                  <p className="font-semibold text-xs mb-1">{agent.name}</p>
                  <p className="text-[10px] text-secondary-dark whitespace-pre-line">{agent.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-[10px] text-secondary-dark mt-4">
              AI는 생성보다 <strong className="text-amber-400">검수/피드백 보조</strong>에 더 많이 사용됩니다
            </p>
          </div>
        </motion.section>
      </main>

      <footer className="border-t border-white/5 py-6 text-center text-xs text-secondary-dark">
        Beeliber Academy v1.0 — 하네스 엔지니어링 기반 실무 훈련 시스템
      </footer>
    </div>
  );
}
