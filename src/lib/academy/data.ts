// Academy 시드 데이터 (MVP: Supabase 연결 전 로컬 데이터)

import { Track, Module, Assignment, ReviewRule } from '@/types/academy';

export const TRACKS: Track[] = [
  { id: 't1', slug: 'common', title: '공통 베이스캠프', description: '브랜드, 운영 기준, 기본 정책 교육', order_no: 1 },
  { id: 't2', slug: 'tools', title: '핵심 기술 및 도구', description: 'Gemini / Opal / NotebookLM 역할 구분과 기초 실습', order_no: 2 },
  { id: 't3', slug: 'supergems', title: 'Super Gems / Opal 랩', description: '목적형 사내 미니 앱 설계 실습', order_no: 3 },
  { id: 't4', slug: 'multimodal', title: '멀티모달 생성 스쿨', description: '이미지, 영상, 오디오 생성과 브랜드 일관성 실습', order_no: 4 },
  { id: 't5', slug: 'video-lab', title: '영상 솔루션 랩', description: 'Higgsfield / Freepik 기반 영상 제작 실습', order_no: 5 },
  { id: 't6', slug: 'use-cases', title: '실전 활용 사례', description: '콘텐츠 제작, 비즈니스 효율화, 웹 서비스 개발 사례', order_no: 6 },
  { id: 't7', slug: 'optimization', title: '최적화 전략', description: 'SEO/GEO, 프롬프트 구조, 하네스 엔지니어링 고급 과정', order_no: 7 },
];

export const MODULES: Module[] = [
  // 공통 베이스캠프
  { id: 'm1', track_id: 't1', slug: 'brand-basics', title: '브랜드 기본 원칙', summary: '서비스 구조와 브랜드 기준을 이해하는 모듈', difficulty: 'basic', estimated_minutes: 20, is_required: true, order_no: 1 },
  { id: 'm2', track_id: 't1', slug: 'service-flow-policy', title: '서비스 흐름과 운영 정책', summary: '서비스 구조, 운영 시간, 예약 방식 학습', difficulty: 'basic', estimated_minutes: 25, is_required: true, order_no: 2 },
  { id: 'm3', track_id: 't1', slug: 'content-policy', title: '콘텐츠 정책과 표현 가이드', summary: '올바른 표현과 금지 표현, 실제 사례 교정 훈련', difficulty: 'basic', estimated_minutes: 15, is_required: true, order_no: 3 },
  // 핵심 기술 및 도구
  { id: 'm4', track_id: 't2', slug: 'gemini-reasoning', title: 'Gemini 사고 엔진 사용법', summary: '전략 설계, 비교, 추론, 기준 문서 작성 훈련', difficulty: 'basic', estimated_minutes: 25, is_required: true, order_no: 1 },
  { id: 'm5', track_id: 't2', slug: 'opal-igo-design', title: 'Opal Input-Generate-Output 설계', summary: '최종 결과물을 먼저 정의하고 워크플로우를 역산 설계하는 훈련', difficulty: 'intermediate', estimated_minutes: 30, is_required: true, order_no: 2 },
  { id: 'm6', track_id: 't2', slug: 'notebooklm-knowledge-core', title: 'NotebookLM 지식 코어 설계', summary: '브랜드, 정책, 레퍼런스를 지식 코어로 구조화하는 모듈', difficulty: 'intermediate', estimated_minutes: 30, is_required: true, order_no: 3 },
  // Super Gems / Opal 랩
  { id: 'm7', track_id: 't3', slug: 'mini-app-planning', title: '사내 미니 앱 기획', summary: '목표를 자연어로 정의하고 미니 앱 구조를 설계', difficulty: 'intermediate', estimated_minutes: 30, is_required: true, order_no: 1 },
  { id: 'm8', track_id: 't3', slug: 'planner-generator-evaluator', title: 'Planner / Generator / Evaluator 분리', summary: '하네스 엔지니어링으로 역할을 나누고 검수 루프를 설계', difficulty: 'advanced', estimated_minutes: 35, is_required: true, order_no: 2 },
  // 멀티모달 생성 스쿨
  { id: 'm9', track_id: 't4', slug: 'image-brand-assets', title: '브랜드 이미지 자산 제작', summary: '브랜드 카드뉴스와 비주얼 에셋 생성 훈련', difficulty: 'intermediate', estimated_minutes: 30, is_required: true, order_no: 1 },
  { id: 'm10', track_id: 't4', slug: 'video-shortform-production', title: '숏폼 영상 제작 기본', summary: '이미지-투-비디오, 대본, 자막 구조 학습', difficulty: 'intermediate', estimated_minutes: 35, is_required: true, order_no: 2 },
  { id: 'm11', track_id: 't4', slug: 'tts-audio-script', title: 'TTS와 교육형 오디오 제작', summary: '발표 스크립트 음성화 훈련', difficulty: 'basic', estimated_minutes: 20, is_required: true, order_no: 3 },
  // 영상 솔루션 랩
  { id: 'm12', track_id: 't5', slug: 'higgsfield-lab', title: 'Higgsfield 시네마틱 랩', summary: '카메라 무브와 시네마틱 숏폼 제작 훈련', difficulty: 'advanced', estimated_minutes: 35, is_required: true, order_no: 1 },
  { id: 'm13', track_id: 't5', slug: 'freepik-lab', title: 'Freepik 크리에이티브 랩', summary: '모바일/웹 기반 반복 제작과 SNS 패키지 제작 훈련', difficulty: 'intermediate', estimated_minutes: 30, is_required: true, order_no: 2 },
  // 실전 활용 사례
  { id: 'm14', track_id: 't6', slug: 'content-production-case', title: '콘텐츠 제작 자동화 사례', summary: '블로그, 광고, 카드뉴스, 숏폼 자동화 사례 적용', difficulty: 'intermediate', estimated_minutes: 25, is_required: true, order_no: 1 },
  { id: 'm15', track_id: 't6', slug: 'business-efficiency-case', title: '비즈니스 효율화 사례', summary: '회의록, 리포트, 제안서 자동화 사례 적용', difficulty: 'intermediate', estimated_minutes: 25, is_required: true, order_no: 2 },
  { id: 'm16', track_id: 't6', slug: 'web-service-dev-case', title: '웹 서비스 개발 사례', summary: 'API, DB, 검수 플로우를 사례 기반으로 학습', difficulty: 'advanced', estimated_minutes: 35, is_required: true, order_no: 3 },
  // 최적화 전략
  { id: 'm17', track_id: 't7', slug: 'seo-geo', title: 'SEO & GEO 최적화', summary: '검색과 AI 인용을 동시에 고려한 콘텐츠 구조 설계', difficulty: 'advanced', estimated_minutes: 30, is_required: true, order_no: 1 },
  { id: 'm18', track_id: 't7', slug: 'prompt-architecture', title: '프롬프트 구조화', summary: 'ToT, Self-Reflection, Meta Prompting, RAG 결합 훈련', difficulty: 'advanced', estimated_minutes: 35, is_required: true, order_no: 2 },
  { id: 'm19', track_id: 't7', slug: 'harness-engineering-ops', title: '하네스 엔지니어링 운영', summary: '검수 중심 운영, 백업 모델, 오류 복구 루프 설계', difficulty: 'advanced', estimated_minutes: 35, is_required: true, order_no: 3 },
];

export const ASSIGNMENTS: Assignment[] = [
  // 공통 베이스캠프
  { id: 'a1', module_id: 'm1', title: '서비스 설명문 교정', description: 'AI가 생성한 서비스 소개문에서 잘못된 부분을 찾아 교정하세요. 브랜드 기준, 운영 정책을 확인해야 합니다.', submission_type: 'markdown', rubric: { brandConsistency: 30, policyAccuracy: 40, completeness: 30 }, due_days: 3, is_required: true },
  { id: 'a2', module_id: 'm2', title: '운영 정책 퀴즈 + 서비스 흐름 배열', description: '서비스 흐름을 올바른 순서로 배열하고, 운영 정책 O/X 퀴즈에 답하세요.', submission_type: 'json', rubric: { accuracy: 50, understanding: 50 }, due_days: 2, is_required: true },
  { id: 'a3', module_id: 'm3', title: '금지 표현 찾기 리포트', description: 'AI가 생성한 콘텐츠 5개에서 정책 위반 표현을 모두 찾아 리포트를 작성하세요.', submission_type: 'markdown', rubric: { accuracy: 50, explanation: 30, alternatives: 20 }, due_days: 3, is_required: true },
  // 핵심 기술 및 도구
  { id: 'a4', module_id: 'm4', title: 'Gemini로 전략 3안 생성', description: 'Gemini를 활용하여 마케팅 전략 3안을 생성하고, 각 안의 장단점을 비교 분석하세요.', submission_type: 'markdown', rubric: { strategyQuality: 40, comparison: 30, brandAlignment: 30 }, due_days: 4, is_required: true },
  { id: 'a5', module_id: 'm5', title: 'Opal용 IGO 설계서 작성', description: 'Input / Generate / Output 구조로 광고 카피 생성 워크플로우를 설계하세요.', submission_type: 'mixed', rubric: { structureClarity: 40, executionReadiness: 30, brandConsistency: 30 }, due_days: 5, is_required: true },
  // 멀티모달 생성 스쿨
  { id: 'a6', module_id: 'm9', title: '브랜드 카드뉴스 이미지 3종 제작', description: 'AI 이미지 도구를 활용하여 브랜드 가이드를 준수하는 카드뉴스 이미지 3종을 제작하세요.', submission_type: 'image', rubric: { brandConsistency: 40, visualQuality: 30, promptSkill: 30 }, due_days: 5, is_required: true },
  { id: 'a7', module_id: 'm10', title: '숏폼 영상 스토리보드 + 프롬프트', description: '서비스 소개 15초 숏폼 영상의 스토리보드를 작성하고 Image-to-Video 프롬프트를 준비하세요.', submission_type: 'mixed', rubric: { storyClarity: 30, promptQuality: 30, brandConsistency: 20, executionReadiness: 20 }, due_days: 5, is_required: true },
  // 영상 솔루션 랩
  { id: 'a8', module_id: 'm12', title: 'Higgsfield 시네마틱 숏폼 설계', description: '카메라 무브와 씬 구성을 포함한 시네마틱 숏폼 영상을 기획하세요.', submission_type: 'mixed', rubric: { storyClarity: 25, cameraDirection: 25, brandConsistency: 25, executionReadiness: 25 }, due_days: 7, is_required: true },
  { id: 'a9', module_id: 'm13', title: '카드뉴스 세트 + 3언어 통일', description: 'Freepik을 활용하여 카드뉴스 세트(한/영/중)를 제작하세요. 메시지와 비주얼이 3개 언어에서 통일되어야 합니다.', submission_type: 'image', rubric: { visualConsistency: 30, languageAccuracy: 30, brandConsistency: 20, completeness: 20 }, due_days: 7, is_required: true },
  // 최적화 전략
  { id: 'a10', module_id: 'm18', title: 'ToT + RAG + Self-Reflection 복합 프롬프트', description: 'Tree of Thoughts, RAG, Self-Reflection을 결합한 복합 프롬프트를 설계하고 실제 과제에 적용하세요.', submission_type: 'markdown', rubric: { promptArchitecture: 40, practicalApplication: 30, selfReflection: 30 }, due_days: 7, is_required: true },
];

export const REVIEW_RULES: ReviewRule[] = [];

// 헬퍼 함수들
export function getTrackBySlug(slug: string): Track | undefined {
  return TRACKS.find(t => t.slug === slug);
}

export function getModulesByTrack(trackId: string): Module[] {
  return MODULES.filter(m => m.track_id === trackId).sort((a, b) => a.order_no - b.order_no);
}

export function getModuleBySlug(slug: string): Module | undefined {
  return MODULES.find(m => m.slug === slug);
}

export function getAssignmentsByModule(moduleId: string): Assignment[] {
  return ASSIGNMENTS.filter(a => a.module_id === moduleId);
}

export function getAssignmentById(id: string): Assignment | undefined {
  return ASSIGNMENTS.find(a => a.id === id);
}
