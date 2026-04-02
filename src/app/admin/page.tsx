"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight, Plus, Pencil, Trash2, X, Eye, EyeOff, Users, BarChart3, AlertTriangle, CheckCircle } from "lucide-react";
import { TRACKS, MODULES } from "@/lib/academy/data";
import { Badge } from "@/components/ui/badge";

// ─── Types ───────────────────────────────────────────
interface Employee {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "student" | "marketer" | "developer" | "automation" | "reviewer" | "admin";
  team: string;
  status: "active" | "inactive" | "suspended";
  progress: number;
  passRate: number;
  submissions: number;
}

// ─── Initial Data (빌리버 직원) ──────────────────────
const INITIAL_EMPLOYEES: Employee[] = [
  { id: "u1", name: "오현정", email: "oh@beeliber.com", password: "", role: "marketer", team: "SNS·브랜드·전략", status: "active", progress: 0, passRate: 0, submissions: 0 },
  { id: "u2", name: "박진호", email: "park@beeliber.com", password: "", role: "marketer", team: "Hub Ops / 지점 관리", status: "active", progress: 0, passRate: 0, submissions: 0 },
  { id: "u3", name: "진영주", email: "jin@beeliber.com", password: "", role: "marketer", team: "파트너 지점 활성화", status: "active", progress: 0, passRate: 0, submissions: 0 },
  { id: "u4", name: "류천명", email: "ryu@beeliber.com", password: "", role: "developer", team: "앱 제작 / Google Ads", status: "active", progress: 0, passRate: 0, submissions: 0 },
  { id: "u5", name: "임재원", email: "lim@beeliber.com", password: "", role: "developer", team: "인천공항 데이터", status: "active", progress: 0, passRate: 0, submissions: 0 },
  { id: "u6", name: "김동교", email: "kim@beeliber.com", password: "", role: "automation", team: "자동화 / 요금 체계", status: "active", progress: 0, passRate: 0, submissions: 0 },
];

const ROLE_OPTIONS = ["student", "marketer", "developer", "automation", "reviewer", "admin"];
const ROLE_COLORS: Record<string, string> = {
  student: "bg-blue-500/20 text-blue-400",
  marketer: "bg-green-500/20 text-green-400",
  developer: "bg-purple-500/20 text-purple-400",
  automation: "bg-amber-500/20 text-amber-400",
  reviewer: "bg-orange-500/20 text-orange-400",
  admin: "bg-red-500/20 text-red-400",
};

const MOCK_VIOLATIONS = [
  { rule: '"저렴한" 사용', count: 12, trend: "down" },
  { rule: '"택배" 사용', count: 8, trend: "down" },
  { rule: 'bee-liber.com 누락', count: 7, trend: "up" },
  { rule: '"호텔 픽업" 언급', count: 3, trend: "same" },
  { rule: '운영 시간 오류', count: 2, trend: "down" },
];

const MOCK_PENDING = [
  { user: "오현정", assignment: "Gemini 전략 3안 생성", status: "ai_reviewed", score: 72 },
  { user: "박진호", assignment: "금지 표현 찾기 리포트", status: "submitted", score: null },
  { user: "류천명", assignment: "Opal IGO 설계서", status: "ai_reviewed", score: 85 },
];

type Tab = "dashboard" | "employees";

// ─── Employee Modal ──────────────────────────────────
function EmployeeModal({ employee, onSave, onClose }: {
  employee: Employee | null;
  onSave: (emp: Employee) => void;
  onClose: () => void;
}) {
  const isNew = !employee;
  const [form, setForm] = useState<Employee>(employee || {
    id: `u-${Date.now()}`, name: "", email: "", password: "", role: "student",
    team: "", status: "active", progress: 0, passRate: 0, submissions: 0,
  });
  const [showPw, setShowPw] = useState(false);

  const update = (key: keyof Employee, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#12121a]/95 p-6 shadow-2xl backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">{isNew ? "직원 등록" : "직원 정보 수정"}</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-4">
          {/* 이름 */}
          <div>
            <label className="text-xs text-white/50 block mb-1">이름</label>
            <input className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400/50"
              value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="홍길동" />
          </div>

          {/* 이메일 + 비밀번호 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/50 block mb-1">이메일 (로그인 ID)</label>
              <input className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400/50"
                value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="name@beeliber.com" />
            </div>
            <div>
              <label className="text-xs text-white/50 block mb-1">비밀번호</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400/50 pr-10"
                  value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* 역할 + 팀 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/50 block mb-1">역할</label>
              <select className="w-full rounded-lg border border-white/10 bg-[#0f1012] px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400/50"
                value={form.role} onChange={(e) => update("role", e.target.value)}>
                {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/50 block mb-1">담당 영역</label>
              <input className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400/50"
                value={form.team} onChange={(e) => update("team", e.target.value)} placeholder="SNS·브랜드·전략" />
            </div>
          </div>

          {/* 상태 */}
          <div>
            <label className="text-xs text-white/50 block mb-1">상태</label>
            <div className="flex gap-2">
              {(["active", "inactive", "suspended"] as const).map(s => (
                <button key={s} onClick={() => update("status", s)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all ${form.status === s ? "border-amber-400/50 bg-amber-400/10 text-amber-400" : "border-white/10 bg-white/[0.02] text-white/50 hover:bg-white/5"}`}>
                  {s === "active" ? "활성" : s === "inactive" ? "비활성" : "정지"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 rounded-full border border-white/10 bg-transparent py-2.5 text-sm text-white/70 hover:bg-white/5">취소</button>
          <button onClick={() => { onSave(form); onClose(); }}
            className="flex-1 rounded-full bg-white py-2.5 text-sm font-semibold text-black hover:bg-white/90 transition-all">
            {isNew ? "등록" : "저장"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Admin Page ─────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const stats = {
    totalUsers: employees.length,
    activeThisWeek: employees.filter(e => e.status === "active").length,
    submissionRate: 67,
    firstPassRate: 45,
    revisionRate: 38,
    completionRate: 25,
    placementRate: 17,
  };

  const handleSave = (emp: Employee) => {
    setEmployees(prev => {
      const exists = prev.find(e => e.id === emp.id);
      if (exists) return prev.map(e => e.id === emp.id ? emp : e);
      return [...prev, emp];
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/5 via-black to-blue-900/5" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="border-b border-white/5 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-lg font-semibold">
                <span className="text-white">bee</span><span className="text-amber-400 italic">liber</span>
                <span className="text-white/30 ml-2 text-sm font-normal">Admin</span>
              </Link>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">관리자</Badge>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/academy" className="text-sm text-white/50 hover:text-white">학습 웹으로</Link>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">A</div>
            </div>
          </div>
        </motion.header>

        {/* Tab Navigation */}
        <div className="border-b border-white/5 px-6">
          <div className="max-w-7xl mx-auto flex gap-1">
            {[
              { id: "dashboard" as Tab, label: "대시보드", icon: <BarChart3 className="h-4 w-4" /> },
              { id: "employees" as Tab, label: "직원 관리", icon: <Users className="h-4 w-4" /> },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all ${tab === t.id ? "border-amber-400 text-white" : "border-transparent text-white/40 hover:text-white/70"}`}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* ═══ 대시보드 탭 ═══ */}
          {tab === "dashboard" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* KPI 카드 */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { label: "전체 직원", value: stats.totalUsers, unit: "명", color: "text-white" },
                  { label: "이번 주 활성", value: stats.activeThisWeek, unit: "명", color: "text-green-400" },
                  { label: "제출률", value: stats.submissionRate, unit: "%", color: "text-blue-400" },
                  { label: "1차 통과율", value: stats.firstPassRate, unit: "%", color: "text-amber-400" },
                  { label: "수정 요청률", value: stats.revisionRate, unit: "%", color: "text-orange-400" },
                  { label: "수료율", value: stats.completionRate, unit: "%", color: "text-purple-400" },
                  { label: "배치 전환율", value: stats.placementRate, unit: "%", color: "text-red-400" },
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center backdrop-blur-sm">
                    <p className="text-[10px] text-white/30 mb-1">{kpi.label}</p>
                    <p className={`text-2xl font-black ${kpi.color}`}>{kpi.value}<span className="text-xs font-normal text-white/30">{kpi.unit}</span></p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 검토 대기 */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm">검토 대기 과제</h3>
                    <Badge className="bg-red-500/20 text-red-400 text-xs">{MOCK_PENDING.length}건</Badge>
                  </div>
                  <div className="space-y-3">
                    {MOCK_PENDING.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                        <div>
                          <p className="text-sm font-medium">{p.assignment}</p>
                          <p className="text-xs text-white/30">{p.user}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {p.score !== null && <span className={`text-sm font-bold ${p.score >= 80 ? "text-green-400" : p.score >= 50 ? "text-yellow-400" : "text-red-400"}`}>{p.score}점</span>}
                          <Badge className="bg-white/5 text-white/40 text-xs">{p.status === "submitted" ? "대기" : "AI 완료"}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 자주 틀리는 규칙 */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm">
                  <h3 className="font-bold text-sm mb-4">가장 많이 틀리는 규칙 TOP 5</h3>
                  <div className="space-y-3">
                    {MOCK_VIOLATIONS.map((v, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                          <span className="text-sm">{v.rule}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{v.count}회</span>
                          <span className="text-xs">{v.trend === "down" ? "📉" : v.trend === "up" ? "📈" : "➡️"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 트랙별 현황 */}
                <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm">
                  <h3 className="font-bold text-sm mb-4">트랙별 이수 현황</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {TRACKS.map((t) => {
                      const mods = MODULES.filter(m => m.track_id === t.id);
                      const completion = 0;
                      return (
                        <div key={t.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                          <p className="text-xs font-semibold mb-2">{t.title}</p>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex-1 bg-white/5 rounded-full h-1.5">
                              <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full" style={{ width: `${completion}%` }} />
                            </div>
                            <span className="text-xs font-bold text-blue-400">{completion}%</span>
                          </div>
                          <p className="text-[10px] text-white/30">{mods.length}개 모듈</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ 직원 관리 탭 ═══ */}
          {tab === "employees" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* 상단 액션 */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">직원 관리</h2>
                  <p className="text-sm text-white/40">로그인 정보 등록, 수정, 역할 배정</p>
                </div>
                <button onClick={() => { setEditingEmployee(null); setModalOpen(true); }}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white/90 transition-all">
                  <Plus className="h-4 w-4" /> 직원 등록
                </button>
              </div>

              {/* 직원 테이블 */}
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5 text-left text-white/30">
                        <th className="px-5 py-3.5 font-medium">이름</th>
                        <th className="px-5 py-3.5 font-medium">이메일 (로그인)</th>
                        <th className="px-5 py-3.5 font-medium">비밀번호</th>
                        <th className="px-5 py-3.5 font-medium">역할</th>
                        <th className="px-5 py-3.5 font-medium">담당</th>
                        <th className="px-5 py-3.5 font-medium">진도율</th>
                        <th className="px-5 py-3.5 font-medium">상태</th>
                        <th className="px-5 py-3.5 font-medium text-right">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((emp) => (
                        <EmployeeRow key={emp.id} employee={emp}
                          onEdit={() => { setEditingEmployee(emp); setModalOpen(true); }}
                          onDelete={() => handleDelete(emp.id)} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 요약 카드 */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "활성 직원", value: employees.filter(e => e.status === "active").length, icon: <CheckCircle className="h-5 w-5 text-green-400" /> },
                  { label: "비활성 직원", value: employees.filter(e => e.status === "inactive").length, icon: <AlertTriangle className="h-5 w-5 text-yellow-400" /> },
                  { label: "전체 직원", value: employees.length, icon: <Users className="h-5 w-5 text-blue-400" /> },
                ].map(c => (
                  <div key={c.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-5 flex items-center gap-4">
                    {c.icon}
                    <div>
                      <p className="text-2xl font-black">{c.value}</p>
                      <p className="text-xs text-white/30">{c.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Modal */}
      {modalOpen && (
        <EmployeeModal
          employee={editingEmployee}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingEmployee(null); }}
        />
      )}
    </div>
  );
}

// ─── Employee Row Component ──────────────────────────
function EmployeeRow({ employee, onEdit, onDelete }: { employee: Employee; onEdit: () => void; onDelete: () => void }) {
  const [showPw, setShowPw] = useState(false);

  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black text-xs font-bold">
            {employee.name[0]}
          </div>
          <span className="font-medium">{employee.name}</span>
        </div>
      </td>
      <td className="px-5 py-3.5 text-white/60 font-mono text-xs">{employee.email}</td>
      <td className="px-5 py-3.5">
        {employee.password ? (
          <span className="text-xs text-green-400/60">설정됨</span>
        ) : (
          <button onClick={onEdit} className="text-xs text-amber-400 hover:text-amber-300">비밀번호 설정 →</button>
        )}
      </td>
      <td className="px-5 py-3.5">
        <Badge className={`text-xs ${ROLE_COLORS[employee.role]}`}>{employee.role}</Badge>
      </td>
      <td className="px-5 py-3.5 text-xs text-white/40">{employee.team}</td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div className="w-16 bg-white/5 rounded-full h-1.5">
            <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full" style={{ width: `${employee.progress}%` }} />
          </div>
          <span className="text-xs text-white/40">{employee.progress}%</span>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <span className={`inline-flex items-center gap-1.5 text-xs ${employee.status === "active" ? "text-green-400" : employee.status === "inactive" ? "text-white/30" : "text-red-400"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${employee.status === "active" ? "bg-green-400" : employee.status === "inactive" ? "bg-white/30" : "bg-red-400"}`} />
          {employee.status === "active" ? "활성" : employee.status === "inactive" ? "비활성" : "정지"}
        </span>
      </td>
      <td className="px-5 py-3.5 text-right">
        <div className="flex items-center justify-end gap-1">
          <button onClick={onEdit} className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={onDelete} className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
