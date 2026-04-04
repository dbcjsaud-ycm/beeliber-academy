"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import WorkflowCanvas, { type CanvasPreset } from "@/components/academy/canvas/WorkflowCanvas";

// ═══════════════════════════════════════════════
// 프리셋 1: 웹/앱 개발 워크플로우
// ═══════════════════════════════════════════════

const DEV_PRESET: CanvasPreset = {
  title: "웹/앱 개발 워크플로우",
  subtitle: "Academy 교육 웹의 하네스 엔지니어링 구조를 직접 설계해보세요",
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
// 프리셋 3: 이미지/영상 생성 아키텍처 (멀티모달 크리에이티브 워크스페이스)
// Pikaso Clone 구조 기반 — 무한 캔버스 + 생성 허브 + 이미지 편집기 + 모델 라우팅
// ═══════════════════════════════════════════════

const IMAGE_PRESET: CanvasPreset = {
  title: "이미지/영상 생성 아키텍처",
  subtitle: "무한 캔버스 + 생성 허브 + 편집기 + 모델 라우팅을 노드로 설계해보세요",
  guide: [
    "노드를 드래그하여 위치를 조정하세요",
    "출력 포트(●) → 입력 포트(●) 클릭으로 연결",
    "레퍼런스 시스템: style / character / element / color 카테고리",
    "모델 라우터: auto 선택 시 작업 성격에 따라 최적 모델 자동 배정",
    "기준 이미지를 먼저 생성하고 → 첫 프레임으로 고정해 영상화",
    "Inpaint/Outpaint로 생성 후 바로 편집하는 흐름을 연결해보세요",
  ],
  nodes: [
    {
      id: "canvas-core",
      name: "InfiniteCanvas",
      type: "캔버스",
      icon: "🖼️",
      color: "#3b82f6",
      glowColor: "rgba(59, 130, 246, 0.3)",
      position: { x: 60, y: 200 },
      fields: [
        { label: "기능", value: "줌/팬/선택/이미지 배치" },
        { label: "인터랙션", value: "휠 줌 · 드래그 팬 · Undo/Redo" },
      ],
      inputs: 0,
      outputs: 1,
      description: "무한 캔버스 — 모든 생성·편집 작업의 중심 공간. 요소를 자유롭게 배치하고 이동합니다.",
    },
    {
      id: "reference-system",
      name: "Reference System",
      type: "조건화",
      icon: "🎯",
      color: "#f97316",
      glowColor: "rgba(249, 115, 22, 0.3)",
      position: { x: 60, y: 420 },
      fields: [
        { label: "카테고리", value: "style · character · element · color" },
        { label: "최대", value: "레퍼런스 8개 동시 조합" },
      ],
      inputs: 1,
      outputs: 1,
      description: "스타일/캐릭터/요소/색감 레퍼런스 이미지를 등록해 생성 결과에 조건을 부여합니다. character는 IP-Adapter 기반, color/effect는 prompt suffix 방식.",
    },
    {
      id: "model-router",
      name: "Model Router",
      type: "AI Core",
      icon: "🧭",
      color: "#8b5cf6",
      glowColor: "rgba(139, 92, 246, 0.3)",
      position: { x: 380, y: 300 },
      fields: [
        { label: "모드", value: "auto / 수동 선택" },
        { label: "모델풀", value: "Gemini · Nanobanana · Veo · Flux · SDXL" },
      ],
      inputs: 2,
      outputs: 1,
      description: "modelId=auto 시 작업 성격·레퍼런스 유무에 따라 최적 모델 자동 선택. BullMQ 큐로 비동기 처리, 실패 시 fallback provider 재시도.",
    },
    {
      id: "image-gen",
      name: "Image Generator",
      type: "Generator",
      icon: "✨",
      color: "#22c55e",
      glowColor: "rgba(34, 197, 94, 0.3)",
      position: { x: 700, y: 160 },
      fields: [
        { label: "입력", value: "프롬프트 + 레퍼런스 조건" },
        { label: "출력", value: "생성 이미지 → 캔버스 배치" },
      ],
      inputs: 1,
      outputs: 2,
      description: "프롬프트와 레퍼런스 조건을 받아 이미지를 생성하고 캔버스에 배치합니다. 결과는 S3 저장 후 DB 기록.",
    },
    {
      id: "inpaint",
      name: "Inpainting",
      type: "편집기",
      icon: "🖌️",
      color: "#ec4899",
      glowColor: "rgba(236, 72, 153, 0.3)",
      position: { x: 1020, y: 60 },
      fields: [
        { label: "방식", value: "브러시 마스크 → 바이너리 마스크 추출" },
        { label: "활용", value: "얼굴·배경·오브젝트 부분 수정" },
      ],
      inputs: 1,
      outputs: 1,
      description: "생성된 이미지의 특정 영역을 브러시로 선택해 새로운 내용으로 교체합니다. 핵심 차별 기능.",
    },
    {
      id: "outpaint",
      name: "Outpainting",
      type: "편집기",
      icon: "↔️",
      color: "#06b6d4",
      glowColor: "rgba(6, 182, 212, 0.3)",
      position: { x: 1020, y: 260 },
      fields: [
        { label: "방식", value: "상하좌우 bounds 확장" },
        { label: "비율", value: "1:1 · 16:9 · 9:16 프리셋" },
      ],
      inputs: 1,
      outputs: 1,
      description: "이미지 경계 바깥으로 캔버스를 확장해 주변 장면을 AI로 채웁니다. 영상 첫 프레임 준비에 유용.",
    },
    {
      id: "camera-change",
      name: "Camera Change",
      type: "편집기",
      icon: "📷",
      color: "#eab308",
      glowColor: "rgba(234, 179, 8, 0.3)",
      position: { x: 1020, y: 460 },
      fields: [
        { label: "제어", value: "회전 · 세로 · 줌 · 틸트" },
        { label: "출력", value: "시점 변경 후보 이미지 다수 생성" },
      ],
      inputs: 1,
      outputs: 1,
      description: "동일 장면을 다른 카메라 앵글/줌으로 재생성합니다. 영상 시퀀스 다양화에 활용.",
    },
    {
      id: "relight",
      name: "Relight",
      type: "편집기",
      icon: "💡",
      color: "#f59e0b",
      glowColor: "rgba(245, 158, 11, 0.3)",
      position: { x: 1020, y: 660 },
      fields: [
        { label: "제어", value: "라이트 포지션 드래그" },
        { label: "프리셋", value: "자연광 · 골든아워 · 스튜디오 · 야경" },
      ],
      inputs: 1,
      outputs: 1,
      description: "이미지 내 광원 위치와 색온도를 재배치합니다. 씬 분위기를 일관되게 유지하는 데 필수.",
    },
    {
      id: "i2v",
      name: "Image-to-Video",
      type: "Generator",
      icon: "🎬",
      color: "#a855f7",
      glowColor: "rgba(168, 85, 247, 0.3)",
      position: { x: 1360, y: 300 },
      fields: [
        { label: "모델", value: "Veo 3.1 / Runway / Higgsfield" },
        { label: "카메라", value: "Zoom In · Dolly · Pan · Orbit" },
      ],
      inputs: 2,
      outputs: 1,
      description: "기준 이미지를 첫 프레임으로 고정해 영상 클립을 생성합니다. 캐릭터 일관성 유지의 핵심 단계.",
    },
    {
      id: "credits",
      name: "Credits Manager",
      type: "Billing",
      icon: "💳",
      color: "#14b8a6",
      glowColor: "rgba(20, 184, 166, 0.3)",
      position: { x: 380, y: 560 },
      fields: [
        { label: "흐름", value: "estimate → balance check → deduct" },
        { label: "이력", value: "credit_transactions 테이블 기록" },
      ],
      inputs: 0,
      outputs: 1,
      description: "모델별 과금 단가와 작업별 고정 비용을 관리합니다. BullMQ 작업 완료 후 사용량 차감.",
    },
    {
      id: "s3-storage",
      name: "S3 / CDN",
      type: "Storage",
      icon: "☁️",
      color: "#64748b",
      glowColor: "rgba(100, 116, 139, 0.3)",
      position: { x: 1360, y: 560 },
      fields: [
        { label: "저장", value: "원본 · 편집본 · 썸네일" },
        { label: "배포", value: "CloudFront CDN 가속" },
      ],
      inputs: 2,
      outputs: 0,
      description: "생성·편집된 이미지/영상을 S3에 저장하고 CloudFront로 빠르게 서빙합니다. DB 기록도 함께 갱신.",
    },
  ],
  connections: [
    { id: "i1", from: "canvas-core", to: "reference-system" },
    { id: "i2", from: "canvas-core", to: "model-router" },
    { id: "i3", from: "reference-system", to: "model-router" },
    { id: "i4", from: "credits", to: "model-router" },
    { id: "i5", from: "model-router", to: "image-gen" },
    { id: "i6", from: "image-gen", to: "inpaint" },
    { id: "i7", from: "image-gen", to: "outpaint" },
    { id: "i8", from: "image-gen", to: "camera-change" },
    { id: "i9", from: "image-gen", to: "relight" },
    { id: "i10", from: "outpaint", to: "i2v" },
    { id: "i11", from: "camera-change", to: "i2v" },
    { id: "i12", from: "image-gen", to: "s3-storage" },
    { id: "i13", from: "i2v", to: "s3-storage" },
  ],
  extraNodes: [
    {
      name: "Context Action Bar",
      type: "UI",
      icon: "⚡",
      color: "#3b82f6",
      glowColor: "rgba(59, 130, 246, 0.3)",
      fields: [{ label: "액션", value: "AI 편집 · 리사이즈 · 복제 · 레퍼런스 등록" }],
      inputs: 1, outputs: 1,
      description: "캔버스에서 요소를 선택했을 때 뜨는 AI 액션 바. 인라인 편집의 진입점.",
    },
    {
      name: "BullMQ Worker",
      type: "Queue",
      icon: "⚙️",
      color: "#f97316",
      glowColor: "rgba(249, 115, 22, 0.3)",
      fields: [{ label: "처리", value: "AI 생성 비동기 큐 · 재시도 · 완료 알림" }],
      inputs: 1, outputs: 1,
      description: "AI 생성 요청을 큐에 쌓아 순차·비동기 처리. 실패 시 fallback provider로 자동 재시도.",
    },
    {
      name: "Collaboration (Yjs)",
      type: "Realtime",
      icon: "👥",
      color: "#22c55e",
      glowColor: "rgba(34, 197, 94, 0.3)",
      fields: [{ label: "기술", value: "Yjs CRDT + y-websocket + Awareness" }],
      inputs: 1, outputs: 1,
      description: "다중 사용자가 같은 캔버스를 동시 편집. 커서 위치와 선택 상태를 실시간 브로드캐스트.",
    },
    {
      name: "Adjust / Filter",
      type: "편집기",
      icon: "🎚️",
      color: "#a855f7",
      glowColor: "rgba(168, 85, 247, 0.3)",
      fields: [{ label: "조정", value: "밝기 · 대비 · 채도 · 필터 프리셋" }],
      inputs: 1, outputs: 1,
      description: "생성 이미지의 색감·밝기·필터를 비파괴 방식으로 조정합니다.",
    },
    {
      name: "Template Preset",
      type: "재사용",
      icon: "📐",
      color: "#ec4899",
      glowColor: "rgba(236, 72, 153, 0.3)",
      fields: [{ label: "활용", value: "레퍼런스 조합 · 프롬프트 저장 · 재실행" }],
      inputs: 0, outputs: 1,
      description: "자주 쓰는 레퍼런스 조합과 프롬프트를 템플릿으로 저장해 재사용합니다.",
    },
  ],
};

// ═══════════════════════════════════════════════
// 프리셋 4: 구현 코드 로드맵 (개발자 작업지시서 원문 기준)
// 1단계(타입+캔버스) → 2단계(핵심모듈) → 3단계(기술설계) → 4단계(추가UI)
// ═══════════════════════════════════════════════

const CODE_PRESET: CanvasPreset = {
  title: "구현 코드 로드맵",
  subtitle: "개발자 작업지시서 4단계 — 타입 정의부터 배포까지 순서대로 연결해보세요",
  guide: [
    "노드를 드래그하여 위치를 조정하세요",
    "출력 포트(●) → 입력 포트(●) 클릭으로 연결",
    "단계별 구현: 1단계(타입·캔버스) → 2단계(모듈) → 3단계(DB·API) → 4단계(배포)",
    "각 노드의 '파일 경로' 필드가 실제 구현 파일 위치입니다",
    "Auto 모델: 레퍼런스 있으면 seedream-5-lite, 긴 프롬프트면 gpt, 기본은 flux-2-pro",
    "크레딧 차감은 반드시 SELECT FOR UPDATE 트랜잭션으로 처리",
  ],
  nodes: [
    // ── 1단계: 타입 정의 ──
    {
      id: "types",
      name: "1. 타입 정의",
      type: "1단계",
      icon: "📐",
      color: "#06b6d4",
      glowColor: "rgba(6, 182, 212, 0.3)",
      position: { x: 60, y: 60 },
      fields: [
        { label: "파일", value: "types/canvas.ts · models.ts · references.ts · credits.ts" },
        { label: "핵심", value: "CanvasElement · AIModel · ReferenceCategory · CreditAccount" },
      ],
      inputs: 0,
      outputs: 1,
      description: "CanvasElement(id/type/x/y/width/height/rotation/zIndex/pageId/data), AIModel(provider/type/credits/tags), ReferenceCategory(stock|style|character|element|color|effect|camera), ViewportState(x/y/zoom)",
    },
    // ── 1단계: 캔버스 코어 ──
    {
      id: "canvas",
      name: "2. InfiniteCanvas",
      type: "1단계",
      icon: "🖼️",
      color: "#3b82f6",
      glowColor: "rgba(59, 130, 246, 0.3)",
      position: { x: 60, y: 280 },
      fields: [
        { label: "파일", value: "components/canvas/InfiniteCanvas.tsx" },
        { label: "핵심", value: "Ctrl+휠=줌 · 휠=팬 · Space+drag=팬 · pageElements 필터링" },
      ],
      inputs: 1,
      outputs: 1,
      description: "handleWheel(Ctrl=줌/일반=팬), 팬 시작 setPanStart, 현재 pageId 기준 elements 필터, ImageElement/TextElement/StickyNote 렌더링, ContextActionBar(selectedIds>0), CanvasToolbar, StatusBar(PageManager+MiniMap+Zoom%)",
    },
    // ── 1단계: CanvasToolbar ──
    {
      id: "toolbar",
      name: "3. CanvasToolbar",
      type: "1단계",
      icon: "🔧",
      color: "#3b82f6",
      glowColor: "rgba(59, 130, 246, 0.3)",
      position: { x: 60, y: 500 },
      fields: [
        { label: "파일", value: "components/canvas/CanvasToolbar.tsx" },
        { label: "도구", value: "select(V) · hand(H) · crop(K) · sticky(T) · comment(C)" },
      ],
      inputs: 1,
      outputs: 1,
      description: "TOOLS 배열(id/icon/label/shortcut/subTools). 서브툴: crop→lasso, sticky→pen/sticker. 호버 시 서브툴 패널 노출. Undo/Redo 버튼. AddElementMenu: 이미지생성기/동영상생성기/어시스턴트/텍스트 + 업로드/에셋/스톡",
    },
    // ── 1단계: ModelSelector ──
    {
      id: "model-selector",
      name: "4. ModelSelector",
      type: "1단계",
      icon: "🧭",
      color: "#8b5cf6",
      glowColor: "rgba(139, 92, 246, 0.3)",
      position: { x: 400, y: 60 },
      fields: [
        { label: "파일", value: "components/generate/ModelSelector.tsx" },
        { label: "옵션", value: "Auto · 다중(4개 병렬) · 모든 모델(40개) → ModelBrowser 모달" },
      ],
      inputs: 1,
      outputs: 1,
      description: "RECOMMENDED: image=[flux-2-pro, seedream-5-lite, google-nano-banana-2], video=[seedance-2, kling-3, kling-3-omni]. Auto 선택: 레퍼런스있음→seedream-5-lite / 프롬프트>200→gpt / 기본→flux-2-pro",
    },
    // ── 1단계: ReferenceSystem ──
    {
      id: "reference",
      name: "5. ReferenceSystem",
      type: "1단계",
      icon: "🎯",
      color: "#f97316",
      glowColor: "rgba(249, 115, 22, 0.3)",
      position: { x: 400, y: 280 },
      fields: [
        { label: "파일", value: "components/generate/ReferenceSystem.tsx" },
        { label: "카테고리", value: "stock · style(IP-Adapter) · character(IP-Adapter) · element · color(suffix) · effect(suffix) · camera" },
      ],
      inputs: 1,
      outputs: 1,
      description: "최대 8개 레퍼런스 조합. 빠른추가버튼(스타일/캐릭터/추가). 선택된 레퍼런스 칩(thumbnail+name+x). ReferenceBrowser 모달: CategorySidebar / PresetGrid / MediaUploadZone / SearchBar. weight: 0.0~1.0",
    },
    // ── 2단계: Inpainting ──
    {
      id: "inpaint-code",
      name: "6. InpaintingPanel",
      type: "2단계",
      icon: "🖌️",
      color: "#ec4899",
      glowColor: "rgba(236, 72, 153, 0.3)",
      position: { x: 400, y: 500 },
      fields: [
        { label: "파일", value: "components/editor/InpaintingPanel.tsx" },
        { label: "흐름", value: "마스크 Canvas → 브러시 stroke → 바이너리 추출 → POST /api/generate/inpaint" },
      ],
      inputs: 1,
      outputs: 1,
      description: "maskRef(별도 canvas) + 브러시: size/hardness/opacity. drawBrushStroke: hardness<1이면 RadialGradient 소프트브러시. extractMask: 알파채널→흑백 바이너리 PNG Blob. maskHistory로 Undo. mode: replace|erase",
    },
    // ── 2단계: Credits ──
    {
      id: "credits-code",
      name: "7. Credits 시스템",
      type: "2단계",
      icon: "💳",
      color: "#14b8a6",
      glowColor: "rgba(20, 184, 166, 0.3)",
      position: { x: 740, y: 60 },
      fields: [
        { label: "파일", value: "lib/credits/pricing.ts · manager.ts" },
        { label: "단가", value: "flux-2-pro=50 · imagen-4=100 · gpt=150 · inpaint=40 · outpaint=60 · camera=80" },
      ],
      inputs: 1,
      outputs: 1,
      description: "IMAGE_PRICING / VIDEO_PRICING(perSecondMultiplier) / TASK_PRICING. CreditManager: getBalance / estimateCost / checkBalance / deduct(SELECT FOR UPDATE 트랜잭션) / addCredits. 영상: baseCost + durationSec * perSecond",
    },
    // ── 3단계: DB Schema ──
    {
      id: "db-schema",
      name: "8. DB Schema",
      type: "3단계",
      icon: "🗄️",
      color: "#64748b",
      glowColor: "rgba(100, 116, 139, 0.3)",
      position: { x: 740, y: 280 },
      fields: [
        { label: "파일", value: "lib/db/schema.ts (Drizzle ORM + PostgreSQL)" },
        { label: "테이블", value: "users · credit_accounts · spaces · pages · elements · generations · ai_models · reference_presets · templates · comments" },
      ],
      inputs: 1,
      outputs: 1,
      description: "elements.data: jsonb(image|text|video|audio|sticky|sticker|list). generations: userId/modelId/type/status/prompt/outputUrls/creditsCost. spaces.settings: jsonb(snapGuides/tooltips/edgeType/mouseWheelMode). space_collaborators: spaceId+userId UNIQUE",
    },
    // ── 3단계: API Routes ──
    {
      id: "api-routes",
      name: "9. API Routes",
      type: "3단계",
      icon: "🔌",
      color: "#22c55e",
      glowColor: "rgba(34, 197, 94, 0.3)",
      position: { x: 740, y: 500 },
      fields: [
        { label: "생성", value: "POST /api/generate/image|video|audio|3d|inpaint|outpaint|relight|camera|upscale" },
        { label: "기타", value: "GET /api/generate/:id/status · /api/models · /api/credits/estimate · WS /api/collaborate/:spaceId" },
      ],
      inputs: 1,
      outputs: 1,
      description: "ImageGenerateRequest: {modelId, prompt, references[], count(1~8), aspectRatio, enhancePrompt?, seed?}. 공통 에러코드: UNAUTHORIZED|INSUFFICIENT_CREDITS|MODEL_UNAVAILABLE|RATE_LIMITED|GENERATION_FAILED. 크레딧 견적: POST /api/credits/estimate → {estimatedCost, currentBalance, sufficient}",
    },
    // ── 3단계: Zustand + Collaboration ──
    {
      id: "state-collab",
      name: "10. State + Collab",
      type: "3단계",
      icon: "👥",
      color: "#a855f7",
      glowColor: "rgba(168, 85, 247, 0.3)",
      position: { x: 1080, y: 170 },
      fields: [
        { label: "파일", value: "stores/canvasStore.ts · generateStore.ts · creditStore.ts" },
        { label: "협업", value: "Yjs CRDT + y-websocket + Awareness(커서/선택 브로드캐스트)" },
      ],
      inputs: 2,
      outputs: 1,
      description: "canvasStore: viewport/elements/selectedIds/activeTool/pages/history(undo·redo·canUndo·canRedo)/clipboard. generateStore: activeType/selectedModel/references/prompt/activeGenerations(Map)/results. creditStore: balance/plan/monthlyUsed/estimateCost(). Redis: Yjs 영속성+rate limiting",
    },
    // ── 3단계: Model Router + BullMQ ──
    {
      id: "model-router-code",
      name: "11. Model Router",
      type: "3단계",
      icon: "⚙️",
      color: "#f59e0b",
      glowColor: "rgba(245, 158, 11, 0.3)",
      position: { x: 1080, y: 390 },
      fields: [
        { label: "파일", value: "lib/ai/model-router.ts" },
        { label: "흐름", value: "Credit Check → Auto 선택 → BullMQ Queue → Worker → S3 → deduct → 알림" },
      ],
      inputs: 1,
      outputs: 1,
      description: "MODEL_PROVIDER 맵: flux-2-pro→replicate(fallback:fal), flux-1-fast→fal, kling-3→fal, seedance-2→fal, wan-2.2→replicate, elevenlabs-v3→elevenlabs. 실패 시 fallback provider 재시도 최대 3회. Pro유저 큐 우선순위 높음. SSE 또는 폴링으로 진행률 전달",
    },
    // ── 배포 ──
    {
      id: "deploy",
      name: "12. 배포 인프라",
      type: "배포",
      icon: "🚀",
      color: "#ef4444",
      glowColor: "rgba(239, 68, 68, 0.3)",
      position: { x: 1400, y: 280 },
      fields: [
        { label: "스택", value: "Vercel(Next.js) · S3+CloudFront · PostgreSQL(Neon/Supabase) · Redis · BullMQ Worker" },
        { label: "순서", value: "캔버스MVP → 이미지생성기 → Inpaint/Outpaint → DB/크레딧 → 협업 → 배포" },
      ],
      inputs: 1,
      outputs: 0,
      description: "브라우저→CloudFront→Vercel→S3 / y-websocket WS Server / PostgreSQL / Redis / BullMQ Worker→AI Providers(Replicate·Fal.ai·OpenAI·Google Vertex·ElevenLabs). 우선순위: 1.캔버스코어 2.이미지생성 3.Inpaint/Outpaint 4.DB/API/크레딧 5.협업 6.배포",
    },
  ],
  connections: [
    { id: "c1", from: "types", to: "canvas" },
    { id: "c2", from: "types", to: "model-selector" },
    { id: "c3", from: "canvas", to: "toolbar" },
    { id: "c4", from: "canvas", to: "reference" },
    { id: "c5", from: "model-selector", to: "reference" },
    { id: "c6", from: "reference", to: "inpaint-code" },
    { id: "c7", from: "model-selector", to: "credits-code" },
    { id: "c8", from: "credits-code", to: "db-schema" },
    { id: "c9", from: "credits-code", to: "api-routes" },
    { id: "c10", from: "db-schema", to: "state-collab" },
    { id: "c11", from: "api-routes", to: "state-collab" },
    { id: "c12", from: "inpaint-code", to: "state-collab" },
    { id: "c13", from: "state-collab", to: "model-router-code" },
    { id: "c14", from: "model-router-code", to: "deploy" },
  ],
  extraNodes: [
    {
      name: "OutpaintingPanel",
      type: "2단계",
      icon: "↔️",
      color: "#06b6d4",
      glowColor: "rgba(6, 182, 212, 0.3)",
      fields: [{ label: "파일", value: "components/editor/OutpaintingPanel.tsx" }, { label: "방식", value: "상하좌우 bounds 확장 · 1:1/16:9/9:16 프리셋" }],
      inputs: 1, outputs: 1,
      description: "이미지 경계 바깥을 AI로 채움. bounds(top/bottom/left/right px 입력) + aspectRatio 프리셋. POST /api/generate/outpaint. 비용: 60 크레딧",
    },
    {
      name: "CameraChangePanel",
      type: "2단계",
      icon: "📷",
      color: "#eab308",
      glowColor: "rgba(234, 179, 8, 0.3)",
      fields: [{ label: "파일", value: "components/editor/CameraChangePanel.tsx" }, { label: "제어", value: "회전·세로·줌·틸트 → 후보 이미지 다수 생성" }],
      inputs: 1, outputs: 1,
      description: "동일 장면을 다른 앵글/줌으로 재생성. 후보 이미지 여러 장 중 선택. POST /api/generate/camera. 비용: 80 크레딧",
    },
    {
      name: "RelightPanel",
      type: "2단계",
      icon: "💡",
      color: "#f59e0b",
      glowColor: "rgba(245, 158, 11, 0.3)",
      fields: [{ label: "파일", value: "components/editor/RelightPanel.tsx" }, { label: "제어", value: "라이트 포지션 드래그 · 자연광/골든아워/스튜디오/야경 프리셋" }],
      inputs: 1, outputs: 1,
      description: "광원 위치·색온도 재배치. 프리셋 또는 드래그로 광원 위치 지정. POST /api/generate/relight. 비용: 50 크레딧",
    },
    {
      name: "ContextActionBar",
      type: "1단계",
      icon: "⚡",
      color: "#3b82f6",
      glowColor: "rgba(59, 130, 246, 0.3)",
      fields: [{ label: "파일", value: "components/canvas/ContextActionBar.tsx" }, { label: "액션", value: "AIWand · Resize · UseAsReference · Duplicate · Delete · Download · Link · More" }],
      inputs: 1, outputs: 1,
      description: "selectedIds.length > 0 일 때 상단에 플로팅. AIWand → ImageEditorModal(Inpaint|Outpaint|Camera|Relight|Adjust). UseAsReference → ReferenceSystem에 등록",
    },
    {
      name: "AdjustPanel",
      type: "2단계",
      icon: "🎚️",
      color: "#8b5cf6",
      glowColor: "rgba(139, 92, 246, 0.3)",
      fields: [{ label: "파일", value: "components/editor/AdjustPanel.tsx" }, { label: "조정", value: "밝기·대비·채도·색온도·선명도·노이즈감소 · 필터 프리셋" }],
      inputs: 1, outputs: 1,
      description: "비파괴 방식으로 이미지 색감·필터 조정. CSS filter 또는 canvas API로 실시간 미리보기. 확정 시 새 이미지로 저장",
    },
  ],
};

// ═══════════════════════════════════════════════

type CanvasMode = "dev" | "video" | "image" | "code";

export default function WorkflowCanvasPage() {
  const [mode, setMode] = useState<CanvasMode>("dev");

  return (
    <div className="h-screen flex flex-col academy-bg text-white overflow-hidden">
      {/* 헤더 */}
      <header className="glass-panel-light mx-3 mt-3 rounded-xl px-5 py-2.5 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3 text-sm">
          <Link href="/academy" className="text-secondary-dark hover:text-white">대시보드</Link>
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
          <button
            onClick={() => setMode("image")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${mode === "image" ? "bg-orange-500 text-white" : "bg-white/5 text-secondary-dark hover:bg-white/10"}`}
          >
            🎨 이미지/영상 실습
          </button>
          <button
            onClick={() => setMode("code")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${mode === "code" ? "bg-green-500 text-white" : "bg-white/5 text-secondary-dark hover:bg-white/10"}`}
          >
            💻 구현 코드 로드맵
          </button>

          <div className="w-px h-4 bg-white/10 mx-1" />

          <Link
            href="/spaces/new"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all"
          >
            <Sparkles size={12} />
            워크스페이스 열기
          </Link>
        </div>
      </header>

      <div className="flex-1 overflow-hidden mt-3 mx-3 mb-3">
        {mode === "dev" && <WorkflowCanvas key="dev" preset={DEV_PRESET} />}
        {mode === "video" && <WorkflowCanvas key="video" preset={VIDEO_PRESET} />}
        {mode === "image" && <WorkflowCanvas key="image" preset={IMAGE_PRESET} />}
        {mode === "code" && <WorkflowCanvas key="code" preset={CODE_PRESET} />}
      </div>
    </div>
  );
}
