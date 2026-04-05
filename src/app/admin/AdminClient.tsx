'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, X, Eye, EyeOff, Users, BarChart3, AlertTriangle, CheckCircle, Loader2, Coins } from 'lucide-react';
import { TRACKS, MODULES } from '@/lib/academy/data';
import { Badge } from '@/components/ui/badge';

interface Employee {
  id: string;
  name: string;
  loginId: string;
  password: string;
  role: string;
  team: string;
  status: 'active' | 'inactive' | 'suspended';
  progress: number;
  passRate: number;
  submissions: number;
}

interface ProfileRow {
  id: string;
  email: string;
  display_name: string;
  account_type: string;
  is_active: boolean;
  metadata: Record<string, unknown> | null;
}

function profileToEmployee(p: ProfileRow): Employee {
  const meta = p.metadata ?? {};
  return {
    id: p.id,
    name: p.display_name ?? '',
    loginId: (meta.loginId as string) ?? p.email ?? '',
    password: '',
    role: p.account_type ?? 'student',
    team: (meta.team as string) ?? '',
    status: (meta.status as Employee['status']) ?? (p.is_active ? 'active' : 'inactive'),
    progress: (meta.progress as number) ?? 0,
    passRate: (meta.passRate as number) ?? 0,
    submissions: (meta.submissions as number) ?? 0,
  };
}

const ROLE_OPTIONS = ['student', 'marketer', 'developer', 'automation', 'reviewer', 'admin'];
const ROLE_COLORS: Record<string, string> = {
  student: 'rgba(59,130,246,0.18)',
  marketer: 'rgba(34,197,94,0.18)',
  developer: 'rgba(168,85,247,0.18)',
  automation: 'rgba(245,158,11,0.18)',
  reviewer: 'rgba(249,115,22,0.18)',
  admin: 'rgba(239,68,68,0.18)',
};
const ROLE_TEXT: Record<string, string> = {
  student: 'rgb(96,165,250)',
  marketer: 'rgb(74,222,128)',
  developer: 'rgb(192,132,252)',
  automation: 'rgb(251,191,36)',
  reviewer: 'rgb(251,146,60)',
  admin: 'rgb(248,113,113)',
};

const CREDIT_PRESETS = [100, 500, 1000, 3000];

// ─── Credit Modal ─────────────────────────────────────
function CreditModal({
  employee,
  currentBalance,
  onClose,
  onDone,
}: {
  employee: Employee;
  currentBalance: number;
  onClose: () => void;
  onDone: (newBalance: number) => void;
}) {
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<'add' | 'deduct'>('add');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const parsed = parseInt(amount, 10);
  const isValid = !isNaN(parsed) && parsed > 0;
  const preview = isValid
    ? mode === 'add'
      ? currentBalance + parsed
      : Math.max(0, currentBalance - parsed)
    : currentBalance;

  async function handleSubmit() {
    if (!isValid) return;
    setSaving(true);
    setErr(null);
    const delta = mode === 'add' ? parsed : -parsed;
    try {
      const res = await fetch('/api/admin/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: employee.id, amount: delta }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || '크레딧 변경 실패');
      onDone(json.data.balance);
      onClose();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : '오류 발생');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm mx-4 rounded-2xl p-6 shadow-2xl"
        style={{
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(18,18,26,0.98)',
          backdropFilter: 'blur(20px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-white">크레딧 관리</h3>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{employee.name}</p>
          </div>
          <button onClick={onClose} style={{ color: 'rgba(255,255,255,0.3)' }} className="hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current balance */}
        <div
          className="rounded-xl p-4 mb-5 text-center"
          style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.20)' }}
        >
          <p className="text-xs mb-1" style={{ color: 'rgba(245,158,11,0.6)' }}>현재 잔액</p>
          <p className="text-3xl font-black" style={{ color: '#f59e0b' }}>
            {currentBalance.toLocaleString()}
            <span className="text-sm font-normal ml-1" style={{ color: 'rgba(245,158,11,0.5)' }}>C</span>
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-xl p-1 mb-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {(['add', 'deduct'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 rounded-lg py-2 text-sm font-medium transition-all"
              style={
                mode === m
                  ? m === 'add'
                    ? { background: 'rgba(245,158,11,0.9)', color: '#000' }
                    : { background: 'rgba(239,68,68,0.15)', color: 'rgb(248,113,113)', border: '1px solid rgba(239,68,68,0.3)' }
                  : { color: 'rgba(255,255,255,0.35)' }
              }
            >
              {m === 'add' ? '+ 추가' : '− 차감'}
            </button>
          ))}
        </div>

        {/* Preset buttons */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {CREDIT_PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setAmount(String(p))}
              className="rounded-lg py-2 text-xs font-semibold transition-all"
              style={
                amount === String(p)
                  ? { background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', color: 'rgb(251,191,36)' }
                  : { border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.5)' }
              }
            >
              {p.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Custom input */}
        <div className="mb-4">
          <label className="text-xs block mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>직접 입력</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="크레딧 수량"
            className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
            style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </div>

        {/* Preview */}
        {isValid && (
          <div
            className="rounded-lg px-4 py-2.5 mb-4 flex items-center justify-between text-sm"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>적용 후 잔액</span>
            <span className="font-bold" style={{ color: mode === 'add' ? 'rgb(74,222,128)' : 'rgb(248,113,113)' }}>
              {preview.toLocaleString()} C
            </span>
          </div>
        )}

        {err && (
          <div
            className="mb-4 rounded-xl px-4 py-3 text-xs"
            style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: 'rgb(248,113,113)' }}
          >
            {err}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full py-2.5 text-sm"
            style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || saving}
            className="flex-1 rounded-full py-2.5 text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: mode === 'add' ? '#f59e0b' : 'rgba(239,68,68,0.8)', color: '#000' }}
          >
            {saving
              ? <><Loader2 size={13} className="animate-spin" /> 처리 중…</>
              : mode === 'add' ? `${parsed > 0 ? parsed.toLocaleString() + ' C' : ''} 추가` : `${parsed > 0 ? parsed.toLocaleString() + ' C' : ''} 차감`}
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── Employee Modal ──────────────────────────────────
function EmployeeModal({
  employee,
  onSave,
  onClose,
  isNew,
}: {
  employee: Employee;
  onSave: (emp: Employee) => Promise<void>;
  onClose: () => void;
  isNew: boolean;
}) {
  const [form, setForm] = useState<Employee>(employee);
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const update = (key: keyof Employee, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit() {
    setSaving(true);
    setErr(null);
    try {
      await onSave(form);
      onClose();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : '저장 실패');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg mx-4 rounded-2xl p-6 shadow-2xl"
        style={{
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(18,18,26,0.98)',
          backdropFilter: 'blur(20px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">{isNew ? '직원 등록' : '직원 정보 수정'}</h3>
          <button onClick={onClose} style={{ color: 'rgba(255,255,255,0.3)' }} className="hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {err && (
          <div
            className="mb-4 rounded-xl px-4 py-3 text-xs"
            style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: 'rgb(248,113,113)' }}
          >
            {err}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-xs block mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>이름</label>
            <input
              className="w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none"
              style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="홍길동"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs block mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>아이디 (로그인 ID)</label>
              <input
                className="w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none"
                style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}
                value={form.loginId}
                onChange={(e) => update('loginId', e.target.value)}
                placeholder="hong"
              />
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                비밀번호{!isNew && ' (변경 시만 입력)'}
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="w-full rounded-lg px-4 py-2.5 pr-10 text-sm text-white outline-none"
                  style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder={isNew ? '••••••••' : '변경 안 함'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs block mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>역할</label>
              <select
                className="w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none"
                style={{ border: '1px solid rgba(255,255,255,0.1)', background: '#0f1012' }}
                value={form.role}
                onChange={(e) => update('role', e.target.value)}
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>담당 영역</label>
              <input
                className="w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none"
                style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}
                value={form.team}
                onChange={(e) => update('team', e.target.value)}
                placeholder="SNS·브랜드·전략"
              />
            </div>
          </div>

          <div>
            <label className="text-xs block mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>상태</label>
            <div className="flex gap-2">
              {(['active', 'inactive', 'suspended'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => update('status', s)}
                  className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
                  style={
                    form.status === s
                      ? { border: '1px solid rgba(245,158,11,0.5)', background: 'rgba(245,158,11,0.1)', color: 'rgb(251,191,36)' }
                      : { border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.5)' }
                  }
                >
                  {s === 'active' ? '활성' : s === 'inactive' ? '비활성' : '정지'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-full py-2.5 text-sm transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 rounded-full py-2.5 text-sm font-semibold text-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: '#fff' }}
          >
            {saving ? <><Loader2 size={13} className="animate-spin" /> 저장 중…</> : isNew ? '등록' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Employee Row ────────────────────────────────────
function EmployeeRow({
  employee,
  balance,
  onEdit,
  onDelete,
  onCredit,
}: {
  employee: Employee;
  balance: number;
  onEdit: () => void;
  onDelete: () => void;
  onCredit: () => void;
}) {
  return (
    <tr
      className="transition-colors"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = '')}
    >
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-black text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}
          >
            {employee.name[0] ?? '?'}
          </div>
          <span className="font-medium text-sm text-white">{employee.name}</span>
        </div>
      </td>
      <td className="px-5 py-3.5 font-mono text-xs" style={{ color: 'rgba(245,158,11,0.8)' }}>
        {employee.loginId}
      </td>
      <td className="px-5 py-3.5">
        <span className="text-xs" style={{ color: employee.password ? 'rgb(74,222,128,0.6)' : 'rgba(255,255,255,0.2)' }}>
          {employee.password ? '설정됨' : '—'}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <span
          className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            background: ROLE_COLORS[employee.role] || 'rgba(255,255,255,0.1)',
            color: ROLE_TEXT[employee.role] || 'rgba(255,255,255,0.6)',
          }}
        >
          {employee.role}
        </span>
      </td>
      <td className="px-5 py-3.5 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{employee.team}</td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div className="w-16 rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div
              className="h-1.5 rounded-full"
              style={{
                width: `${employee.progress}%`,
                background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
              }}
            />
          </div>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{employee.progress}%</span>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <span
          className="inline-flex items-center gap-1.5 text-xs"
          style={{
            color:
              employee.status === 'active'
                ? 'rgb(74,222,128)'
                : employee.status === 'suspended'
                ? 'rgb(248,113,113)'
                : 'rgba(255,255,255,0.3)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background:
                employee.status === 'active'
                  ? 'rgb(74,222,128)'
                  : employee.status === 'suspended'
                  ? 'rgb(248,113,113)'
                  : 'rgba(255,255,255,0.3)',
            }}
          />
          {employee.status === 'active' ? '활성' : employee.status === 'inactive' ? '비활성' : '정지'}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <button
          onClick={onCredit}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: 'rgb(251,191,36)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(245,158,11,0.18)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(245,158,11,0.1)'; }}
        >
          <Coins className="h-3 w-3" />
          {balance > 0 ? balance.toLocaleString() : '0'}
        </button>
      </td>
      <td className="px-5 py-3.5 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg transition-all"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.3)';
              e.currentTarget.style.background = '';
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg transition-all"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgb(248,113,113)';
              e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.3)';
              e.currentTarget.style.background = '';
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

interface DashboardData {
  stats: {
    totalUsers: number;
    submissionRate: number;
    firstPassRate: number;
    revisionRate: number;
  };
  pending: { id: string; status: string; score: number | null; userName: string; assignmentTitle: string }[];
  violations: { rule: string; count: number }[];
  completedByTrack: Record<string, number>;
}

// ─── Main Client Component ───────────────────────────
export function AdminClient({
  initialProfiles,
  initialCreditMap,
  dashboardData,
}: {
  initialProfiles: ProfileRow[];
  initialCreditMap: Record<string, number>;
  dashboardData: DashboardData;
}) {
  const [tab, setTab] = useState<'dashboard' | 'employees'>('dashboard');
  const [employees, setEmployees] = useState<Employee[]>(initialProfiles.map(profileToEmployee));
  const [creditMap, setCreditMap] = useState<Record<string, number>>(initialCreditMap);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [creditEmployee, setCreditEmployee] = useState<Employee | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const newEmployeeTemplate: Employee = {
    id: '',
    name: '',
    loginId: '',
    password: '',
    role: 'student',
    team: '',
    status: 'active',
    progress: 0,
    passRate: 0,
    submissions: 0,
  };

  const stats = {
    totalUsers: employees.length,
    activeThisWeek: employees.filter((e) => e.status === 'active').length,
    submissionRate: dashboardData.stats.submissionRate,
    firstPassRate: dashboardData.stats.firstPassRate,
    revisionRate: dashboardData.stats.revisionRate,
    completionRate: 0,
    placementRate: 0,
  };

  async function handleSave(emp: Employee) {
    const isNew = !emp.id;
    const url = isNew ? '/api/admin/employees' : `/api/admin/employees/${emp.id}`;
    const res = await fetch(url, {
      method: isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: emp.name,
        loginId: emp.loginId,
        password: emp.password || undefined,
        role: emp.role,
        team: emp.team,
        status: emp.status,
      }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || '저장 실패');

    const saved = profileToEmployee(json.data);
    if (isNew) {
      setEmployees((prev) => [saved, ...prev]);
    } else {
      setEmployees((prev) => prev.map((e) => (e.id === saved.id ? saved : e)));
    }
  }

  function handleCreditDone(userId: string, newBalance: number) {
    setCreditMap((prev) => ({ ...prev, [userId]: newBalance }));
  }

  async function handleDelete(id: string) {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      return;
    }
    setDeleteConfirmId(null);
    const res = await fetch(`/api/admin/employees/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.success) {
      setDeleteError(json.error || '삭제 실패');
      return;
    }
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  }

  const cardStyle = {
    border: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(12px)',
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(127,0,0,0.05) 0%, #000 50%, rgba(0,0,127,0.05) 100%)' }} />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header
          className="px-6 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-lg font-semibold">
                <span className="text-white">bee</span>
                <span className="text-amber-400 italic">liber</span>
                <span className="ml-2 text-sm font-normal" style={{ color: 'rgba(255,255,255,0.3)' }}>Admin</span>
              </Link>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">슈퍼관리자</Badge>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/academy" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>
                학습 웹으로
              </Link>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}
              >
                A
              </div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="px-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="max-w-7xl mx-auto flex gap-1">
            {[
              { id: 'dashboard' as const, label: '대시보드', icon: <BarChart3 className="h-4 w-4" /> },
              { id: 'employees' as const, label: '직원 관리', icon: <Users className="h-4 w-4" /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all"
                style={
                  tab === t.id
                    ? { borderColor: '#f59e0b', color: '#fff' }
                    : { borderColor: 'transparent', color: 'rgba(255,255,255,0.4)' }
                }
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* ═══ 대시보드 탭 ═══ */}
          {tab === 'dashboard' && (
            <div className="space-y-6">
              {/* KPI row — 2 operational facts + 5 funnel metrics, visually separated */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { label: '전체 직원', value: stats.totalUsers, unit: '명', color: '#fff', operational: true },
                  { label: '이번 주 활성', value: stats.activeThisWeek, unit: '명', color: 'rgb(74,222,128)', operational: true },
                  { label: '제출률', value: stats.submissionRate, unit: '%', color: 'rgb(96,165,250)', operational: false },
                  { label: '1차 통과율', value: stats.firstPassRate, unit: '%', color: 'rgb(251,191,36)', operational: false },
                  { label: '수정 요청률', value: stats.revisionRate, unit: '%', color: 'rgb(251,146,60)', operational: false },
                  { label: '수료율', value: stats.completionRate, unit: '%', color: 'rgb(192,132,252)', operational: false },
                  { label: '배치 전환율', value: stats.placementRate, unit: '%', color: 'rgb(248,113,113)', operational: false },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className="rounded-xl p-4 text-center"
                    style={kpi.operational
                      ? { ...cardStyle, border: '1px solid rgba(245,158,11,0.20)', background: 'rgba(245,158,11,0.04)' }
                      : cardStyle}
                  >
                    <p className="text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{kpi.label}</p>
                    <p className="text-2xl font-black" style={{ color: kpi.color }}>
                      {kpi.value}
                      <span className="text-xs font-normal" style={{ color: 'rgba(255,255,255,0.3)' }}>{kpi.unit}</span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl p-5" style={cardStyle}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm">검토 대기 과제</h3>
                    <Badge className="bg-red-500/20 text-red-400 text-xs">{dashboardData.pending.length}건</Badge>
                  </div>
                  <div className="space-y-3">
                    {dashboardData.pending.length === 0 ? (
                      <p className="text-sm text-center py-6" style={{ color: 'rgba(255,255,255,0.2)' }}>검토 대기 과제 없음</p>
                    ) : (
                      dashboardData.pending.map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div>
                            <p className="text-sm font-medium">{p.assignmentTitle}</p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{p.userName}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {p.score !== null && (
                              <span className="text-sm font-bold" style={{ color: p.score >= 80 ? 'rgb(74,222,128)' : p.score >= 50 ? 'rgb(251,191,36)' : 'rgb(248,113,113)' }}>
                                {p.score}점
                              </span>
                            )}
                            <Badge className="bg-white/5 text-white/40 text-xs">
                              {p.status === 'submitted' ? '대기' : 'AI 완료'}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-2xl p-5" style={cardStyle}>
                  <h3 className="font-bold text-sm mb-4">가장 많이 틀리는 규칙 TOP 5</h3>
                  <div className="space-y-3">
                    {dashboardData.violations.length === 0 ? (
                      <p className="text-sm text-center py-6" style={{ color: 'rgba(255,255,255,0.2)' }}>아직 위반 데이터 없음</p>
                    ) : (
                      dashboardData.violations.map((v, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(239,68,68,0.1)', color: 'rgb(248,113,113)' }}>
                              {i + 1}
                            </span>
                            <span className="text-sm">{v.rule}</span>
                          </div>
                          <span className="text-sm font-bold">{v.count}회</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 rounded-2xl p-5" style={cardStyle}>
                  <h3 className="font-bold text-sm mb-4">트랙별 이수 현황</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {TRACKS.map((t) => {
                      const mods = MODULES.filter((m) => m.track_id === t.id);
                      const completed = dashboardData.completedByTrack[t.id] ?? 0;
                      const pct = stats.totalUsers > 0 ? Math.min(100, Math.round((completed / stats.totalUsers) * 100)) : 0;
                      return (
                        <div key={t.id} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <p className="text-xs font-semibold mb-2">{t.title}</p>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex-1 rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                              <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }} />
                            </div>
                            <span className="text-xs font-bold" style={{ color: 'rgb(96,165,250)' }}>{pct}%</span>
                          </div>
                          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{mods.length}개 모듈</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ 직원 관리 탭 ═══ */}
          {tab === 'employees' && (
            <div className="space-y-6">
              {deleteConfirmId && (
                <div
                  className="rounded-xl px-4 py-3 text-sm flex items-center justify-between gap-4"
                  style={{ border: '1px solid rgba(239,68,68,0.30)', background: 'rgba(239,68,68,0.08)', color: 'rgb(248,113,113)' }}
                >
                  <span>정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDelete(deleteConfirmId)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold"
                      style={{ background: 'rgba(239,68,68,0.25)', color: 'rgb(248,113,113)' }}
                    >
                      삭제 확인
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-3 py-1 rounded-lg text-xs"
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}
              {deleteError && (
                <div
                  className="rounded-xl px-4 py-3 text-sm flex items-center justify-between"
                  style={{ border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.06)', color: 'rgb(248,113,113)' }}
                >
                  <span>{deleteError}</span>
                  <button onClick={() => setDeleteError(null)} style={{ color: 'rgba(248,113,113,0.6)' }}>✕</button>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">직원 관리</h2>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    로그인 정보 등록, 수정, 역할 배정 — {employees.length}명
                  </p>
                </div>
                <button
                  onClick={() => { setEditingEmployee(null); setModalOpen(true); }}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-black transition-all"
                  style={{ background: '#fff' }}
                >
                  <Plus className="h-4 w-4" /> 직원 등록
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden" style={cardStyle}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>
                        <th className="px-5 py-3.5 font-medium">이름</th>
                        <th className="px-5 py-3.5 font-medium">아이디 (로그인)</th>
                        <th className="px-5 py-3.5 font-medium">비밀번호</th>
                        <th className="px-5 py-3.5 font-medium">역할</th>
                        <th className="px-5 py-3.5 font-medium">담당</th>
                        <th className="px-5 py-3.5 font-medium">진도율</th>
                        <th className="px-5 py-3.5 font-medium">상태</th>
                        <th className="px-5 py-3.5 font-medium">크레딧</th>
                        <th className="px-5 py-3.5 font-medium text-right">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-5 py-12 text-center text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
                            등록된 직원이 없습니다. 직원 등록 버튼을 눌러 추가하세요.
                          </td>
                        </tr>
                      ) : (
                        employees.map((emp) => (
                          <EmployeeRow
                            key={emp.id}
                            employee={emp}
                            balance={creditMap[emp.id] ?? 0}
                            onEdit={() => { setEditingEmployee(emp); setModalOpen(true); }}
                            onDelete={() => handleDelete(emp.id)}
                            onCredit={() => setCreditEmployee(emp)}
                          />
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: '활성 직원', value: employees.filter((e) => e.status === 'active').length, icon: <CheckCircle className="h-5 w-5" style={{ color: 'rgb(74,222,128)' }} /> },
                  { label: '비활성 직원', value: employees.filter((e) => e.status === 'inactive').length, icon: <AlertTriangle className="h-5 w-5" style={{ color: 'rgb(251,191,36)' }} /> },
                  { label: '전체 직원', value: employees.length, icon: <Users className="h-5 w-5" style={{ color: 'rgb(96,165,250)' }} /> },
                ].map((c) => (
                  <div key={c.label} className="rounded-xl p-5 flex items-center gap-4" style={cardStyle}>
                    {c.icon}
                    <div>
                      <p className="text-2xl font-black">{c.value}</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{c.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {modalOpen && (
        <EmployeeModal
          employee={editingEmployee ?? newEmployeeTemplate}
          isNew={!editingEmployee}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingEmployee(null); }}
        />
      )}

      {creditEmployee && (
        <CreditModal
          employee={creditEmployee}
          currentBalance={creditMap[creditEmployee.id] ?? 0}
          onClose={() => setCreditEmployee(null)}
          onDone={(newBalance) => {
            handleCreditDone(creditEmployee.id, newBalance);
            setCreditEmployee(null);
          }}
        />
      )}
    </div>
  );
}
