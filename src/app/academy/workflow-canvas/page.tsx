"use client";

import { useState } from "react";
import Link from "next/link";
import WorkflowCanvas, { type CanvasPreset } from "@/components/academy/canvas/WorkflowCanvas";

// ═══════════════════════════════════════════════
// 프리셋 1: 웹/앱 개발 워크플로우
// ═══════════════════════════════════════════════

const DEV_PRESET: CanvasPreset = {
  title: "웹/앱 개발 워크플로우",
  subtitle: "Beeliber Academy 교육 웹의 하네스 엔지니어링 구조를 직접 설계해보세요",
  guide: [
    "노드를 드래그하여 위치를 조정하세요",
    "출력 포트(●) 클릭 → 입력 포트(●) 클릭으로 연결",
    "빈 캔버스를 마우스로 드래그하면 화면 이동",
    "마우스 휠로 스크롤, Ctrl+휠로 줌",
    "하네스 구조: Planner → Generator → Evaluator → Coach",
    "좌측 팔레트에서 새 노드를 추가할 수 있어요",
  ],
  nodes: [
    {
      id: "user-input", name: "사용자 입력", type: "trigger", icon: "👤",
      color: "#06b6d4", glowColor: "rgba(6, 182, 212, 0.3)",
      position: { x: 60, y: 60 },
      fields: [{ label: "이벤트", value: "과제 제출" }, { label: "데이터", value: "텍스트 / 파일" }],
      inputs: 0, outputs: 1,
      description: "학생이 과제를 제출하면 워크플로우가 시작됩니다",
    },
    {
      id: "planner", name: "Planner", type: "AI Agent", icon: "🧠",
      color: "#3b82f6", glowColor: "rgba(59, 130, 246, 0.3)",
      position: { x: 60, y: 280 },
      fields: [{ label: "역할", value: "과제 기준 정의" }, { label: "출력", value: "루브릭 + 평가 기준" }],
      inputs: 1, outputs: 1,
      description: "과제 조건과 평가 루브릭을 정의합니다",
    },
    {
      id: "generator", name: "Generator", type: "AI Agent", icon: "⚡",
      color: "#22c55e", glowColor: "rgba(34, 197, 94, 0.3)",
      position: { x: 420, y: 60 },
      fields: [{ label: "역할", value: "초안 생성 보조" }, { label: "모델", value: "Gemini / Claude" }],
      inputs: 1, outputs: 1,
      description: "AI로 과제 초안 생성을 보조합니다 (학생이 직접 수정)",
    },
    {
      id: "evaluator", name: "Evaluator", type: "AI Agent", icon: "🔍",
      color: "#f97316", glowColor: "rgba(249, 115, 22, 0.3)",
      position: { x: 420, y: 280 },
      fields: [{ label: "역할", value: "브랜드/정책 검수" }, { label: "규칙", value: "금지어 10개 + RLS" }],
      inputs: 1, outputs: 1,
      description: "금지어, 운영정책, 브랜드 톤 자동 검수",
    },
    {
      id: "coach", name: "Coach", type: "AI Agent", icon: "💬",
      color: "#a855f7", glowColor: "rgba(168, 85, 247, 0.3)",
      position: { x: 780, y: 170 },
      fields: [{ label: "역할", value: "피드백 제공" }, { label: "출력", value: "수정 가이드" }],
      inputs: 2, outputs: 1,
      description: "학생에게 왜 틀렸는지, 어떻게 수정할지 안내",
    },
    {
      id: "database", name: "Supabase DB", type: "storage", icon: "💾",
      color: "#14b8a6", glowColor: "rgba(20, 184, 166, 0.3)",
      position: { x: 1100, y: 60 },
      fields: [{ label: "테이블", value: "submissions / reviews" }, { label: "상태", value: "passed / revision" }],
      inputs: 1, outputs: 0,
      description: "제출물, 검수 결과, 피드백을 저장",
    },
    {
      id: "admin-dash", name: "관리자 대시보드", type: "output", icon: "📊",
      color: "#ec4899", glowColor: "rgba(236, 72, 153, 0.3)",
      position: { x: 1100, y: 280 },
      fields: [{ label: "표시", value: "KPI / 위반 TOP5" }, { label: "기능", value: "배치 추천" }],
      inputs: 1, outputs: 0,
      description: "관리자가 전체 학습 현황을 모니터링",
    },
  ],
  connections: [
    { id: "c1", from: "user-input", to: "generator" },
    { id: "c2", from: "user-input", to: "planner" },
    { id: "c3", from: "generator", to: "evaluator" },
    { id: "c4", from: "planner", to: "evaluator" },
    { id: "c5", from: "evaluator", to: "coach" },
    { id: "c6", from: "generator", to: "coach" },
    { id: "c7", from: "coach", to: "database" },
    { id: "c8", from: "coach", to: "admin-dash" },
  ],
  extraNodes: [
    { name: "API Route", type: "processor", icon: "🔌", color: "#8b5cf6", glowColor: "rgba(139, 92, 246, 0.3)", fields: [{ label: "엔드포인트", value: "/api/submit" }], inputs: 1, outputs: 1, description: "Next.js API 라우트 핸들러" },
    { name: "Auth Guard", type: "processor", icon: "🔐", color: "#ef4444", glowColor: "rgba(239, 68, 68, 0.3)", fields: [{ label: "권한", value: "student / admin" }], inputs: 1, outputs: 1, description: "Supabase Auth 기반 역할 검사" },
    { name: "File Storage", type: "storage", icon: "📁", color: "#06b6d4", glowColor: "rgba(6, 182, 212, 0.3)", fields: [{ label: "버킷", value: "academy-submissions" }], inputs: 1, outputs: 0, description: "Supabase Storage 파일 업로드" },
    { name: "Email 알림", type: "output", icon: "📧", color: "#f43f5e", glowColor: "rgba(244, 63, 94, 0.3)", fields: [{ label: "트리거", value: "검수 완료 시" }], inputs: 1, outputs: 0, description: "학생에게 검수 결과 이메일 발송" },
    { name: "Webhook", type: "trigger", icon: "🔔", color: "#eab308", glowColor: "rgba(234, 179, 8, 0.3)", fields: [{ label: "이벤트", value: "제출 완료" }], inputs: 0, outputs: 1, description: "외부 시스템 연동 트리거" },
  ],
};

// ═══════════════════════════════════════════════
// 프리셋 2: 영상 기획 워크플로우
// ═══════════════════════════════════════════════

const VIDEO_PRESET: CanvasPreset = {
  title: "영상 기획 워크플로우",
  subtitle: "릴스/숏폼 영상 제작 파이프라인을 노드로 설계해보세요",
  guide: [
    "노드를 드래그하여 위치를 조정하세요",
    "출력 포트(●) → 입력 포트(●) 클릭으로 연결",
    "빈 캔버스를 마우스로 드래그하면 화면 이동",
    "마우스 휠로 스크롤, Ctrl+휠로 줌",
    "영상 파이프라인: 기획 → 이미지 → 영상 → 편집 → 업로드",
    "각 노드의 파라미터를 수정해보세요",
  ],
  nodes: [
    {
      id: "story", name: "스토리보드", type: "기획", icon: "📋",
      color: "#3b82f6", glowColor: "rgba(59, 130, 246, 0.3)",
      position: { x: 60, y: 170 },
      fields: [{ label: "씬 수", value: "6씬 (45~60초)" }, { label: "구조", value: "후킹→문제→비유→핵심→사례→CTA" }],
      inputs: 0, outputs: 1,
      description: "릴스 스토리보드 작성 (6씬 구조)",
    },
    {
      id: "script", name: "대본 + TTS", type: "Generator", icon: "🎤",
      color: "#22c55e", glowColor: "rgba(34, 197, 94, 0.3)",
      position: { x: 400, y: 60 },
      fields: [{ label: "TTS 도구", value: "ElevenLabs / Typecast" }, { label: "음성", value: "밝고 친근한 20대 여성" }],
      inputs: 1, outputs: 1,
      description: "나레이션 대본 작성 → TTS 음성 생성",
    },
    {
      id: "image-gen", name: "이미지 생성", type: "Generator", icon: "🎨",
      color: "#f97316", glowColor: "rgba(249, 115, 22, 0.3)",
      position: { x: 400, y: 290 },
      fields: [{ label: "도구", value: "Freepik / Midjourney" }, { label: "스타일", value: "2D 플랫, 밝은 톤" }],
      inputs: 1, outputs: 1,
      description: "캐릭터, 배경, 에셋 이미지 AI 생성",
    },
    {
      id: "lipsync", name: "캐릭터 립싱크", type: "Generator", icon: "👄",
      color: "#ec4899", glowColor: "rgba(236, 72, 153, 0.3)",
      position: { x: 740, y: 60 },
      fields: [{ label: "도구", value: "Hedra / D-ID" }, { label: "설정", value: "Expression 0.7 / Motion 0.3" }],
      inputs: 2, outputs: 1,
      description: "TTS 오디오 + 캐릭터 이미지 → 말하는 캐릭터 영상",
    },
    {
      id: "i2v", name: "Image-to-Video", type: "Generator", icon: "🎬",
      color: "#a855f7", glowColor: "rgba(168, 85, 247, 0.3)",
      position: { x: 740, y: 290 },
      fields: [{ label: "도구", value: "Higgsfield / Runway" }, { label: "카메라", value: "Zoom In / Pan / Dolly" }],
      inputs: 1, outputs: 1,
      description: "정적 이미지에 카메라 무브를 입혀 영상 클립 생성",
    },
    {
      id: "edit", name: "CapCut 편집", type: "편집", icon: "✂️",
      color: "#06b6d4", glowColor: "rgba(6, 182, 212, 0.3)",
      position: { x: 1080, y: 170 },
      fields: [{ label: "레이어", value: "BGM + 나레이션 + 영상 + 에셋 + 자막" }, { label: "Export", value: "1080x1920 / 30fps" }],
      inputs: 2, outputs: 1,
      description: "모든 소스를 합쳐 최종 릴스 편집",
    },
    {
      id: "review", name: "Evaluator 검수", type: "Evaluator", icon: "🔍",
      color: "#ef4444", glowColor: "rgba(239, 68, 68, 0.3)",
      position: { x: 1380, y: 60 },
      fields: [{ label: "검수 항목", value: "금지어 / 브랜드톤 / 시간" }, { label: "기준", value: "25점 만점, 18점 이상 통과" }],
      inputs: 1, outputs: 1,
      description: "완성 영상의 브랜드 일관성, 금지어, 품질 검수",
    },
    {
      id: "upload", name: "업로드 예약", type: "output", icon: "📱",
      color: "#eab308", glowColor: "rgba(234, 179, 8, 0.3)",
      position: { x: 1380, y: 290 },
      fields: [{ label: "플랫폼", value: "인스타 릴스 / 스레드" }, { label: "시간", value: "월 19:00 / 수 12:00 / 금 20:00" }],
      inputs: 1, outputs: 0,
      description: "캡션 + 해시태그 + 예약 시간 설정 후 업로드",
    },
  ],
  connections: [
    { id: "v1", from: "story", to: "script" },
    { id: "v2", from: "story", to: "image-gen" },
    { id: "v3", from: "script", to: "lipsync" },
    { id: "v4", from: "image-gen", to: "lipsync" },
    { id: "v5", from: "image-gen", to: "i2v" },
    { id: "v6", from: "lipsync", to: "edit" },
    { id: "v7", from: "i2v", to: "edit" },
    { id: "v8", from: "edit", to: "review" },
    { id: "v9", from: "review", to: "upload" },
  ],
  extraNodes: [
    { name: "프레임 에셋", type: "디자인", icon: "🖼️", color: "#14b8a6", glowColor: "rgba(20, 184, 166, 0.3)", fields: [{ label: "종류", value: "인트로 / 스텝 / CTA" }], inputs: 0, outputs: 1, description: "릴스 위에 올라가는 UI 요소 (Canva/Figma)" },
    { name: "BGM 선택", type: "소스", icon: "🎵", color: "#8b5cf6", glowColor: "rgba(139, 92, 246, 0.3)", fields: [{ label: "볼륨", value: "-12dB (배경)" }], inputs: 0, outputs: 1, description: "저작권 프리 배경 음악 선택" },
    { name: "자막 생성", type: "편집", icon: "💬", color: "#06b6d4", glowColor: "rgba(6, 182, 212, 0.3)", fields: [{ label: "방법", value: "CapCut 자동자막" }], inputs: 1, outputs: 1, description: "나레이션 기반 자동 자막 + 수동 보정" },
    { name: "썸네일 제작", type: "디자인", icon: "📐", color: "#f43f5e", glowColor: "rgba(244, 63, 94, 0.3)", fields: [{ label: "규격", value: "1080x1080" }], inputs: 0, outputs: 1, description: "피드 그리드용 릴스 커버 이미지" },
    { name: "성과 분석", type: "분석", icon: "📈", color: "#22c55e", glowColor: "rgba(34, 197, 94, 0.3)", fields: [{ label: "지표", value: "도달/저장/공유" }], inputs: 1, outputs: 0, description: "업로드 후 성과 KPI 트래킹" },
  ],
};

// ═══════════════════════════════════════════════

type CanvasMode = "dev" | "video";

export default function WorkflowCanvasPage() {
  const [mode, setMode] = useState<CanvasMode>("dev");

  return (
    <div className="h-screen flex flex-col academy-bg text-white overflow-hidden">
      {/* 헤더 */}
      <header className="glass-panel-light mx-3 mt-3 rounded-xl px-5 py-2.5 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3 text-sm">
          <Link href="/" className="text-secondary-dark hover:text-white">홈</Link>
          <span className="text-white/20">/</span>
          <span className="font-semibold">워크플로우 캔버스</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode("dev")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${mode === "dev" ? "bg-blue-500 text-white" : "bg-white/5 text-secondary-dark hover:bg-white/10"}`}
          >
            🔧 웹/앱 개발
          </button>
          <button
            onClick={() => setMode("video")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${mode === "video" ? "bg-purple-500 text-white" : "bg-white/5 text-secondary-dark hover:bg-white/10"}`}
          >
            🎬 영상 기획
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden mt-3 mx-3 mb-3">
        {mode === "dev" ? (
          <WorkflowCanvas key="dev" preset={DEV_PRESET} />
        ) : (
          <WorkflowCanvas key="video" preset={VIDEO_PRESET} />
        )}
      </div>
    </div>
  );
}
