"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Menu, X, LogOut, TrendingUp, Zap, BookOpen, Target } from "lucide-react";
import { TRACKS, MODULES, ASSIGNMENTS, getModulesByTrack } from "@/lib/academy/data";
import { Badge } from "@/components/ui/badge";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const TRACK_ICONS: Record<string, string> = {
  common: "🏕️", tools: "🔧", supergems: "💎",
  multimodal: "🎨", "video-lab": "🎬", "use-cases": "🚀", optimization: "⚡",
};

/* accent per track */
const TRACK_ACCENT: Record<string, { bg: string; border: string; glow: string; dot: string }> = {
  common:       { bg: "rgba(16,185,129,0.06)",  border: "rgba(16,185,129,0.18)",  glow: "rgba(16,185,129,0.12)",  dot: "#10b981" },
  tools:        { bg: "rgba(255,255,255,0.04)",  border: "rgba(255,255,255,0.10)", glow: "rgba(255,255,255,0.11)", dot: "#9ca3af" },
  supergems:    { bg: "rgba(124,58,237,0.06)",   border: "rgba(124,58,237,0.20)",  glow: "rgba(124,58,237,0.10)", dot: "#7c3aed" },
  multimodal:   { bg: "rgba(251,146,60,0.06)",   border: "rgba(251,146,60,0.18)",  glow: "rgba(251,146,60,0.10)", dot: "#fb923c" },
  "video-lab":  { bg: "rgba(245,158,11,0.06)",   border: "rgba(245,158,11,0.18)",  glow: "rgba(245,158,11,0.10)", dot: "#f59e0b" },
  "use-cases":  { bg: "rgba(255,255,255,0.04)",  border: "rgba(255,255,255,0.10)", glow: "rgba(255,255,255,0.11)", dot: "#9ca3af" },
  optimization: { bg: "rgba(124,58,237,0.06)",   border: "rgba(124,58,237,0.20)",  glow: "rgba(124,58,237,0.10)", dot: "#7c3aed" },
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

type Section = "all" | "marketing" | "dev" | "automation";

const SECTION_TRACKS: Record<Section, string[]> = {
  all: ["common", "tools", "supergems", "multimodal", "video-lab", "use-cases", "optimization"],
  marketing: ["common", "multimodal", "video-lab", "use-cases"],
  dev: ["common", "tools", "supergems", "optimization"],
  automation: ["common", "tools", "supergems", "optimization", "use-cases"],
};

const SECTION_INFO: Record<Section, { icon: string; label: string; desc: string; accent: string; border: string; glow: string }> = {
  all:        { icon: "📚", label: "전체",      desc: "모든 학습 트랙",                        accent: "rgba(255,255,255,0.80)", border: "rgba(255,255,255,0.14)", glow: "rgba(255,255,255,0.11)" },
  marketing:  { icon: "📣", label: "마케팅",    desc: "SNS · 영상 제작 · 브랜드",              accent: "#10b981",                border: "rgba(16,185,129,0.28)",  glow: "rgba(16,185,129,0.08)"  },
  dev:        { icon: "💻", label: "웹/앱 개발",desc: "기술 도구 · 프롬프트 구조",             accent: "#06b6d4",                border: "rgba(6,182,212,0.28)",   glow: "rgba(6,182,212,0.08)"   },
  automation: { icon: "🤖", label: "자동화",    desc: "워크플로우 설계 · IGO 구조",            accent: "#7c3aed",                border: "rgba(124,58,237,0.28)",  glow: "rgba(124,58,237,0.08)"  },
};

/* ──────────────────────────────────────────────────────── */

export default function AcademyDashboard() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [section, setSection] = useState<Section>("all");
  const [user, setUser] = useState<{ name: string; role: string }>({ name: "...", role: "..." });

  useEffect(() => {
    const sb = createBrowserSupabaseClient();
    sb.auth.getUser().then(async ({ data }) => {
      const authUser = data.user;
      if (!authUser) return;
      const { data: profile } = await sb
        .from("profiles")
        .select("display_name, account_type")
        .eq("id", authUser.id)
        .single();
      setUser({
        name: profile?.display_name ?? authUser.email?.split("@")[0] ?? "사용자",
        role: profile?.account_type ?? "member",
      });
    });
  }, []);

  async function handleLogout() {
    const sb = createBrowserSupabaseClient();
    await sb.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div style={{ minHeight: "100vh", background: "#1a1825", color: "#fff", overflowX: "hidden" }}>

      {/* ── ambient background orbs ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: -200, left: "20%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 65%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", top: 400, right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 65%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: 0, left: "30%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.03) 0%, transparent 65%)", filter: "blur(40px)" }} />
      </div>

      {/* ── Header ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.11)",
        background: "rgba(26,24,37,0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}>
        <div className="max-w-7xl mx-auto px-4" style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/academy" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
            <span style={{ fontSize: 18 }}>🐝</span>
            <span className="font-sans" style={{ fontSize: 14, fontWeight: 700 }}>
              <span style={{ color: "#fff" }}>bee</span>
              <span style={{ color: "#f59e0b", fontStyle: "italic" }}>liber</span>
              <span style={{ color: "rgba(255,255,255,0.52)", marginLeft: 6, fontWeight: 400, fontSize: 12 }}>Academy</span>
            </span>
          </Link>

          {/* 데스크톱 네비 */}
          <nav className="hidden md:flex" style={{ gap: 24, alignItems: "center" }}>
            {NAV_ITEMS.map((item) => (
              <Link key={item.label} href={item.href}
                className="font-sans"
                style={{ fontSize: 12, color: "rgba(255,255,255,0.62)", textDecoration: "none", transition: "color 150ms" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#fff"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.62)"}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="md:hidden" style={{ color: "rgba(255,255,255,0.50)", background: "none", border: "none", cursor: "pointer" }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <Badge style={{ background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.60)", border: "1px solid rgba(255,255,255,0.13)", fontSize: 11 }} className="hidden sm:flex">{user.role}</Badge>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg, #fcd34d, #f59e0b)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#000", fontSize: 12, fontWeight: 800,
              boxShadow: "0 0 12px rgba(245,158,11,0.35)",
            }}>
              {user.name[0]}
            </div>
            <button onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.52)", transition: "color 150ms", padding: 0, display: "flex" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.80)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.52)"}>
              <LogOut size={15} />
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {mobileMenuOpen && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV_ITEMS.map((item) => (
              <Link key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)}
                style={{ padding: "8px 0", fontSize: 14, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4" style={{ paddingTop: 32, paddingBottom: 64, position: "relative", zIndex: 1 }}>

        {/* ── 환영 히어로 카드 ── */}
        <section style={{ marginBottom: 28 }}>
          <div style={{
            position: "relative", overflow: "hidden",
            borderRadius: 20,
            border: "1px solid rgba(245,158,11,0.18)",
            background: "linear-gradient(135deg, rgba(245,158,11,0.07) 0%, rgba(26,24,37,0.60) 60%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            padding: "36px 40px",
            boxShadow: "0 0 60px rgba(245,158,11,0.08), 0 1px 0 rgba(255,255,255,0.11) inset",
          }}>
            {/* 우상단 glow */}
            <div style={{ position: "absolute", top: -60, right: -40, width: 260, height: 260, borderRadius: "50%", background: "rgba(245,158,11,0.06)", filter: "blur(60px)", pointerEvents: "none" }} />

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px rgba(16,185,129,0.8)", flexShrink: 0 }} />
                  <span className="font-mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(16,185,129,0.85)" }}>
                    {user.name}님, 환영합니다
                  </span>
                </div>
                <h2 className="font-display" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: 10 }}>
                  교육은 이론이 아니라{" "}
                  <span style={{
                    background: "linear-gradient(115deg, #fcd34d 0%, #f59e0b 55%, #d97706 100%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>
                    실행 결과물
                  </span>
                  을 만든다
                </h2>
                <p className="font-sans" style={{ fontSize: 13, color: "rgba(255,255,255,0.62)", lineHeight: 1.65, maxWidth: 480, marginBottom: 24 }}>
                  Planner → Generator → Evaluator → Coach 하네스 엔지니어링 구조로<br />실무 역량을 키웁니다.
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link href="/academy/level-check" style={{ textDecoration: "none" }}>
                    <button className="font-sans" style={{
                      display: "inline-flex", alignItems: "center", gap: 7,
                      padding: "9px 20px", borderRadius: 10, cursor: "pointer",
                      background: "#f59e0b", color: "#000", fontSize: 13, fontWeight: 700, border: "none",
                      boxShadow: "0 0 24px rgba(245,158,11,0.30)",
                    }}>
                      🐣 내 AI 레벨 체크 <ChevronRight size={13} strokeWidth={2.5} />
                    </button>
                  </Link>
                  <Link href="/academy/playground" style={{ textDecoration: "none" }}>
                    <button className="font-sans" style={{
                      display: "inline-flex", alignItems: "center", gap: 7,
                      padding: "9px 18px", borderRadius: 10, cursor: "pointer",
                      background: "rgba(16,185,129,0.08)", color: "#10b981", fontSize: 13, fontWeight: 600,
                      border: "1px solid rgba(16,185,129,0.22)",
                    }}>
                      <Zap size={12} /> AI 플레이그라운드
                    </button>
                  </Link>
                  <Link href="/academy/workflow-canvas" style={{ textDecoration: "none" }}>
                    <button className="font-sans" style={{
                      display: "inline-flex", alignItems: "center", gap: 7,
                      padding: "9px 18px", borderRadius: 10, cursor: "pointer",
                      background: "rgba(6,182,212,0.08)", color: "#06b6d4", fontSize: 13, fontWeight: 600,
                      border: "1px solid rgba(6,182,212,0.22)",
                    }}>
                      🔗 워크플로우 캔버스
                    </button>
                  </Link>
                </div>
              </div>

              {/* 오른쪽 스탯 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 160 }}>
                {[
                  { icon: <TrendingUp size={14} />, label: "진행률", value: "0%", color: "#06b6d4" },
                  { icon: <BookOpen size={14} />, label: "완료 모듈", value: `0 / ${MODULES.length}`, color: "#f59e0b" },
                  { icon: <Target size={14} />, label: "과제 통과", value: `0 / ${ASSIGNMENTS.length}`, color: "#10b981" },
                ].map(({ icon, label, value, color }) => (
                  <div key={label} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", borderRadius: 10,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    backdropFilter: "blur(12px)",
                  }}>
                    <span style={{ color }}>{icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="font-mono" style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.55)", marginBottom: 1 }}>{label}</p>
                      <p className="font-mono" style={{ fontSize: 14, fontWeight: 700, color }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 진행률 바 ── */}
        <section style={{ marginBottom: 28 }}>
          <div style={{
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.025)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            padding: "16px 24px",
            boxShadow: "0 1px 0 rgba(255,255,255,0.10) inset",
            display: "flex", alignItems: "center", gap: 20,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span className="font-sans" style={{ fontSize: 12, color: "rgba(255,255,255,0.40)", fontWeight: 600 }}>전체 진행률</span>
                <span className="font-mono" style={{ fontSize: 12, fontWeight: 700, color: "#06b6d4" }}>0%</span>
              </div>
              <div style={{ width: "100%", background: "rgba(255,255,255,0.10)", borderRadius: 99, height: 6, overflow: "hidden" }}>
                <div style={{ width: "0%", height: "100%", background: "linear-gradient(90deg, #06b6d4, #7c3aed)", borderRadius: 99, transition: "width 0.8s ease" }} />
              </div>
            </div>
            <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.11)" }} />
            <span className="font-sans" style={{ fontSize: 11, color: "rgba(255,255,255,0.52)", whiteSpace: "nowrap" }}>추천 역할 <strong style={{ color: "#f59e0b" }}>—</strong></span>
          </div>
        </section>

        {/* ── 직군별 섹션 선택 ── */}
        <section style={{ marginBottom: 28 }}>
          <SectionLabel icon="🎯" text="내 직군 선택" />
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 10 }}>
            {(["all", "marketing", "dev", "automation"] as Section[]).map((s) => {
              const info = SECTION_INFO[s];
              const isActive = section === s;
              return (
                <button key={s} onClick={() => setSection(s)}
                  style={{
                    padding: "16px", borderRadius: 14, cursor: "pointer",
                    textAlign: "left", border: "none",
                    background: isActive ? info.glow : "rgba(255,255,255,0.025)",
                    borderWidth: 1, borderStyle: "solid",
                    borderColor: isActive ? info.border : "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    boxShadow: isActive ? `0 0 24px ${info.glow}, 0 1px 0 rgba(255,255,255,0.11) inset` : "0 1px 0 rgba(255,255,255,0.04) inset",
                    transition: "all 200ms ease",
                  }}
                >
                  <span style={{ fontSize: 22, display: "block", marginBottom: 8 }}>{info.icon}</span>
                  <p className="font-sans" style={{ fontSize: 13, fontWeight: 700, color: isActive ? info.accent : "#fff", marginBottom: 3 }}>{info.label}</p>
                  <p className="font-mono" style={{ fontSize: 10, color: isActive ? info.accent : "rgba(255,255,255,0.52)", letterSpacing: "0.04em", lineHeight: 1.4 }}>{info.desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── 마감 임박 과제 ── */}
        <section style={{ marginBottom: 28 }}>
          <SectionLabel icon="🔥" text="마감 임박 과제" />
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 12 }}>
            {dueAssignments.map((a) => (
              <Link key={a.id} href={`/academy/assignments/${a.id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  height: "100%", padding: "20px",
                  borderRadius: 14, cursor: "pointer",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.13)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.20), 0 1px 0 rgba(255,255,255,0.11) inset",
                  transition: "all 200ms ease",
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(239,68,68,0.28)";
                    el.style.background = "rgba(239,68,68,0.04)";
                    el.style.transform = "translateY(-2px)";
                    el.style.boxShadow = "0 8px 32px rgba(239,68,68,0.10), 0 1px 0 rgba(255,255,255,0.13) inset";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(255,255,255,0.13)";
                    el.style.background = "rgba(255,255,255,0.03)";
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.20), 0 1px 0 rgba(255,255,255,0.11) inset";
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px rgba(16,185,129,0.8)", animation: "pulse 2s infinite" }} />
                    <span style={{
                      padding: "2px 8px", borderRadius: 4,
                      background: "rgba(239,68,68,0.12)", color: "#f87171",
                      border: "1px solid rgba(239,68,68,0.22)",
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                    }}>D-{a.due_days}</span>
                  </div>
                  <h4 className="font-sans" style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: "#fff" }}>{a.title}</h4>
                  <p className="font-sans" style={{ fontSize: 12, color: "rgba(255,255,255,0.60)", lineHeight: 1.6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{a.description}</p>
                  <div style={{ marginTop: 12 }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: 4,
                      background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.32)",
                      border: "1px solid rgba(255,255,255,0.12)", fontSize: 10,
                    }}>{a.submission_type}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 학습 트랙 ── */}
        <section style={{ marginBottom: 28 }}>
          <SectionLabel icon="📡" text="학습 트랙" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 12 }}>
            {TRACKS.filter((t) => SECTION_TRACKS[section].includes(t.slug)).map((track) => {
              const modules = getModulesByTrack(track.id);
              const accent = TRACK_ACCENT[track.slug] ?? TRACK_ACCENT.tools;
              return (
                <Link key={track.id} href={`/academy/${track.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    height: "100%", padding: "20px",
                    borderRadius: 14, cursor: "pointer",
                    background: accent.bg,
                    border: `1px solid ${accent.border}`,
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    boxShadow: `0 4px 24px rgba(0,0,0,0.20), 0 1px 0 rgba(255,255,255,0.11) inset`,
                    transition: "all 200ms ease",
                  }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.boxShadow = `0 8px 32px ${accent.glow}, 0 1px 0 rgba(255,255,255,0.13) inset`;
                      el.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.boxShadow = `0 4px 24px rgba(0,0,0,0.20), 0 1px 0 rgba(255,255,255,0.11) inset`;
                      el.style.transform = "translateY(0)";
                    }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                      <span style={{ fontSize: 24 }}>{TRACK_ICONS[track.slug]}</span>
                      <span style={{
                        padding: "2px 8px", borderRadius: 4, fontSize: 10,
                        background: "rgba(255,255,255,0.11)", color: "rgba(255,255,255,0.40)",
                        border: "1px solid rgba(255,255,255,0.13)",
                      }}>{modules.length}개 모듈</span>
                    </div>
                    <h4 className="font-sans" style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{track.title}</h4>
                    <p className="font-sans" style={{ fontSize: 11, color: "rgba(255,255,255,0.40)", marginBottom: 14, lineHeight: 1.55 }}>{track.description}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: accent.dot, flexShrink: 0 }} />
                      <div style={{ flex: 1, background: "rgba(255,255,255,0.11)", borderRadius: 99, height: 4, overflow: "hidden" }}>
                        <div style={{ width: "0%", height: "100%", background: accent.dot, borderRadius: 99 }} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── 하네스 엔지니어링 구조 ── */}
        <section>
          <SectionLabel icon="⚙️" text="하네스 엔지니어링 구조" />
          <div style={{
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.025)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            padding: "28px 32px",
            boxShadow: "0 1px 0 rgba(255,255,255,0.10) inset",
          }}>
            <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 12, marginBottom: 20 }}>
              {[
                { name: "Planner", desc: "학습 경로 설계\n과제 기준 정의",   grad: ["#3b82f6","#2563eb"], glow: "rgba(59,130,246,0.18)" },
                { name: "Generator", desc: "과제 초안 생성\n실습 샘플 제작",  grad: ["#10b981","#059669"], glow: "rgba(16,185,129,0.18)" },
                { name: "Evaluator", desc: "브랜드 위반 탐지\n자동 검수 실행", grad: ["#ef4444","#dc2626"], glow: "rgba(239,68,68,0.18)" },
                { name: "Coach",     desc: "피드백 제공\n재제출 가이드",      grad: ["#7c3aed","#6d28d9"], glow: "rgba(124,58,237,0.18)" },
              ].map(({ name, desc, grad, glow }) => (
                <div key={name} style={{
                  textAlign: "center",
                  padding: "20px 12px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.13)",
                  backdropFilter: "blur(12px)",
                  boxShadow: `0 0 24px ${glow}, 0 1px 0 rgba(255,255,255,0.11) inset`,
                }}>
                  <div style={{
                    width: 44, height: 44,
                    background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`,
                    borderRadius: 12, margin: "0 auto 12px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, fontWeight: 800, color: "#fff",
                    boxShadow: `0 4px 16px ${glow}`,
                  }}>
                    {name[0]}
                  </div>
                  <p className="font-sans" style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{name}</p>
                  <p className="font-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.32)", lineHeight: 1.6, whiteSpace: "pre-line" }}>{desc}</p>
                </div>
              ))}
            </div>
            <p className="font-sans" style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.52)" }}>
              AI는 생성보다 <strong style={{ color: "#f59e0b" }}>검수/피드백 보조</strong>에 더 많이 사용됩니다
            </p>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.10)",
        padding: "20px 24px",
        textAlign: "center",
        position: "relative", zIndex: 1,
      }}>
        <span className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", letterSpacing: "0.06em" }}>
          Academy v1.0 — 하네스 엔지니어링 기반 실무 훈련 시스템
        </span>
      </footer>
    </div>
  );
}

/* ── 섹션 라벨 공통 컴포넌트 ── */
function SectionLabel({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span className="font-sans" style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em" }}>{text}</span>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.10)" }} />
    </div>
  );
}
