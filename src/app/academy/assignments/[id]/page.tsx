"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, Play, ChevronRight } from "lucide-react";
import { ASSIGNMENTS, MODULES, TRACKS } from "@/lib/academy/data";
import { runAutoReview } from "@/lib/academy/policies";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { use } from "react";

/* ── 과제별 전용 프롬프트 ─────────────────────────────────────── */
const ASSIGNMENT_PROMPTS: Record<string, Array<{ title: string; prompt: string; tip: string }>> = {
  a1: [
    {
      title: "브랜드 기준 위반 탐지 프롬프트",
      prompt: `아래 서비스 소개문을 검토하여 브랜드 기준에 어긋나는 표현을 모두 찾아주세요.

[서비스 소개문을 여기에 붙여넣으세요]

검토 기준:
1. 저렴한 / 싼 / 할인 등 가격 비하 표현
2. 운영 정책과 다른 내용 (배송 범위, 픽업 방식 등)
3. 브랜드 톤앤매너 위반 (지나치게 가볍거나 무거운 어조)
4. 빠진 필수 정보 (서비스 이름, 연락처, 핵심 혜택)

각 위반 사항에 대해:
- 위반 유형 / 위반 문장 원문 / 수정 제안 형식으로 작성`,
      tip: "위반 표현을 찾은 후 반드시 '왜 위반인지' 이유와 '대안 표현'까지 작성해야 합점이 높아집니다.",
    },
    {
      title: "교정 결과물 작성 프롬프트",
      prompt: `아래 원문을 브랜드 가이드에 맞게 교정한 최종본을 작성해주세요.

원문:
[교정 전 서비스 소개문]

교정 규칙:
- 저렴한 → 합리적인 / 효율적인
- 운영 불가 서비스 언급 삭제
- 브랜드 감성: 따뜻하고 전문적인 어조 유지
- 브랜드명 beeliber 정확히 표기

교정 후:`,
      tip: "AI 교정본을 그대로 제출하지 말고, 실제 브랜드 정책을 직접 확인한 후 수정하세요.",
    },
  ],
  a2: [
    {
      title: "서비스 흐름 배열 도우미",
      prompt: `아래 서비스 프로세스 단계들을 올바른 순서로 배열하고, 각 단계가 왜 그 순서여야 하는지 설명해주세요.

단계 목록 (섞여있음):
[단계 목록을 여기에 붙여넣으세요]

출력 형식:
1. [단계명] - [이유 한 줄]
2. [단계명] - [이유 한 줄]
...

주의: 고객 경험 흐름과 운영 효율 두 가지 기준을 모두 고려하세요.`,
      tip: "각 단계의 '이유'를 쓸 때 고객 관점과 운영자 관점을 각각 1문장씩 작성하면 이해도 점수가 올라갑니다.",
    },
    {
      title: "운영 정책 O/X 퀴즈 생성기",
      prompt: `beeliber 서비스의 운영 정책을 기반으로 O/X 퀴즈 5문제를 만들어주세요.

퀴즈 포함 주제:
- 서비스 운영 시간
- 예약 방식과 취소 정책
- 금지 표현 및 브랜드 규정
- 배송/픽업 가능 범위

출력 형식:
Q1. [문장] → 정답: O/X / 해설: [설명]`,
      tip: "퀴즈를 직접 풀어보고, 틀린 문제는 정책 문서에서 근거를 찾아 '왜 틀렸는지' 설명을 추가하세요.",
    },
  ],
  a3: [
    {
      title: "금지 표현 탐지 리포트 작성",
      prompt: `아래 AI 생성 콘텐츠에서 정책 위반 표현을 모두 찾아 리포트를 작성해주세요.

콘텐츠:
[AI 생성 콘텐츠 5개를 여기에 붙여넣으세요]

리포트 형식 (각 콘텐츠마다):
---
콘텐츠 번호:
위반 표현: [원문 인용]
위반 유형: [가격 비하 / 서비스 오정보 / 톤 위반 / 기타]
위반 이유: [한 문장 설명]
대안 표현: [수정 제안]
---`,
      tip: "위반 표현의 '대안'을 쓸 때 단순히 삭제하지 말고, 같은 의미를 브랜드 톤에 맞게 재표현해보세요.",
    },
    {
      title: "정책 위반 심각도 분류 프롬프트",
      prompt: `발견된 위반 표현들을 심각도에 따라 분류해주세요.

위반 표현 목록:
[찾은 위반 표현들을 나열]

분류 기준:
🔴 Critical (즉시 삭제): 브랜드 명시적 금지 / 운영 불가 서비스 언급
🟠 Error (수정 필요): 톤 위반 / 오해 유발 표현
🟡 Warning (개선 권장): 어색한 표현 / 누락 정보

표 형식으로 정리해주세요: 표현 | 심각도 | 이유 | 수정안`,
      tip: "심각도 분류가 명확할수록 Evaluator 점수가 높아집니다. 단순 나열보다 근거 있는 분류가 중요합니다.",
    },
  ],
  a4: [
    {
      title: "마케팅 전략 3안 생성 프롬프트",
      prompt: `Gemini를 활용하여 beeliber 서비스의 마케팅 전략 3안을 생성해주세요.

서비스 개요: beeliber — AI 교육 실습 플랫폼 (4개 트랙: 마케팅, 영상, 개발, 자동화)

전략 요구사항:
- 각 안은 서로 다른 타겟 세그먼트를 공략
- 예산 규모: 소규모(100만원), 중규모(500만원), 대규모(2000만원)
- 핵심 채널 1개 + 부채널 2개 명시

각 전략 출력 형식:
전략명:
핵심 타겟:
메인 메시지:
주요 채널 및 콘텐츠:
예상 KPI:
장점:
단점:`,
      tip: "3안을 비교할 때 단순 나열보다 '어떤 상황에서 어떤 안이 유리한지' 상황 조건을 명시하면 비교 분석 점수가 올라갑니다.",
    },
    {
      title: "전략 비교 분석 프롬프트",
      prompt: `위에서 생성한 마케팅 전략 3안을 다음 기준으로 비교 분석해주세요.

비교 기준표:
| 기준 | 전략1 | 전략2 | 전략3 |
|------|-------|-------|-------|
| 빠른 성과 가능성 | | | |
| 장기 브랜드 효과 | | | |
| 실행 난이도 | | | |
| 브랜드 일치도 | | | |
| ROI 예상 | | | |

최종 추천: [이유와 함께 1안 추천]
단, 추천 이유는 beeliber 브랜드 가치와 현재 시장 상황을 근거로 설명`,
      tip: "추천 이유에 '구체적인 숫자 또는 사례'를 하나라도 넣으면 분석의 신뢰도가 크게 올라갑니다.",
    },
  ],
  a5: [
    {
      title: "IGO 워크플로우 설계 프롬프트",
      prompt: `광고 카피 생성 워크플로우를 Input-Generate-Output 구조로 설계해주세요.

서비스: beeliber AI 아카데미
목표 결과물: SNS 광고 카피 (5종 이상)

IGO 설계서 형식:
─────────────────────────────
INPUT (입력 정의)
- 필수 입력값: [목록]
- 선택 입력값: [목록]
- 입력 예시: [샘플]

GENERATE (생성 규칙)
- AI 모델: Gemini / Claude / GPT (선택 이유 설명)
- 프롬프트 템플릿: [실제 프롬프트]
- 변수 자리: {{target}}, {{tone}}, {{cta}} 형식

OUTPUT (결과물 기준)
- 결과물 형식: [포맷 명시]
- 품질 기준: [체크리스트]
- 검수 기준: [합격/불합격 조건]
─────────────────────────────`,
      tip: "GENERATE 단계의 프롬프트 템플릿을 실제로 실행해서 결과물이 나오는지 검증하고 제출하세요.",
    },
    {
      title: "Opal 노드 연결 설계 프롬프트",
      prompt: `광고 카피 생성 파이프라인의 Opal 노드 구조를 설계해주세요.

목표: 타겟 정보를 입력하면 → A/B 테스트용 광고 카피 3세트가 자동 출력

노드 구조 설계:
노드1: [이름] - 역할: - 입력: - 출력:
노드2: [이름] - 역할: - 입력: - 출력:
노드3: [이름] - 역할: - 입력: - 출력:
(필요한 만큼 추가)

연결 다이어그램 (텍스트 형식):
[노드1] → [노드2] → [노드3]

주의: 각 노드의 출력이 다음 노드의 입력과 정확히 맞아야 합니다.`,
      tip: "노드 간 데이터 형식(JSON, 텍스트, 배열 등)을 명시하면 실행 가능성 점수가 높아집니다.",
    },
  ],
  a6: [
    {
      title: "브랜드 카드뉴스 이미지 프롬프트 생성",
      prompt: `beeliber AI 아카데미 브랜드 카드뉴스 이미지 3종을 위한 AI 이미지 생성 프롬프트를 작성해주세요.

브랜드 가이드:
- 주색: 황금색 (#f59e0b), 어두운 배경 (#050508)
- 톤: 따뜻하고 기술적, 벌 테마
- 폰트 느낌: 세리프 헤드라인 + 모던 산세리프 본문

카드 3종 주제:
1. 마케팅 트랙 소개 (SNS 콘텐츠 자동화)
2. AI 실습 환경 (프롬프트 → 결과물 경험)
3. 수료 혜택 (실무 역량 + 결과물 포트폴리오)

각 카드에 대해 다음 형식으로 작성:
카드 N:
- 이미지 프롬프트 (영문, Midjourney/DALL-E 형식):
- 텍스트 오버레이 내용:
- 색상 팔레트:
- 구도 설명:`,
      tip: "이미지 프롬프트에 '9:16 portrait, dark background, golden amber accent'를 반드시 포함하세요. 비율 명시가 없으면 감점됩니다.",
    },
    {
      title: "이미지 브랜드 일치도 체크 프롬프트",
      prompt: `제작한 카드뉴스 이미지 3종이 브랜드 가이드를 준수하는지 자체 검수해주세요.

검수 체크리스트 형식으로 작성:

이미지 1:
☐ 주색(황금색 계열) 사용 여부
☐ 어두운 배경 유지 여부
☐ beeliber 브랜드명 정확 표기
☐ 텍스트 가독성 (다크 배경 대비)
☐ 9:16 또는 1:1 비율 준수
☐ 금지 표현 없음
종합 점수: /30점 / 개선 필요 사항:

(이미지 2, 3 동일 형식으로 반복)`,
      tip: "자체 검수 점수가 낮더라도 솔직하게 작성하고 개선 계획을 명시하는 게 높은 점수를 받습니다.",
    },
  ],
  a7: [
    {
      title: "15초 숏폼 스토리보드 작성 프롬프트",
      prompt: `beeliber AI 아카데미 서비스 소개 15초 숏폼 영상의 스토리보드를 작성해주세요.

영상 조건:
- 총 길이: 15초
- 비율: 9:16 (세로형)
- 플랫폼: Instagram Reels / TikTok
- 핵심 메시지: "작은 질문이 거대한 변화를 만든다"

스토리보드 형식 (4-5컷):
---
컷 N | 시간: 0:00~0:00
장면 설명: [무엇이 보이는가]
텍스트 오버레이: [화면에 뜨는 문구]
카메라 무브: [정지/줌인/패닝/페이드]
음악/효과음: [분위기 설명]
---`,
      tip: "각 컷의 '전환' 방식(컷/디졸브/와이프)을 명시하고, 15초를 초 단위로 정확히 나누어야 완성도 점수가 올라갑니다.",
    },
    {
      title: "Image-to-Video 프롬프트 작성 가이드",
      prompt: `스토리보드의 각 컷에 대한 Image-to-Video 프롬프트를 작성해주세요.

핵심 원칙: 텍스트로 바로 영상을 만들지 않고, 기준 이미지를 먼저 생성한 후 첫 프레임으로 고정합니다.

각 컷에 대해:
1단계 - 기준 이미지 프롬프트 (Midjourney 형식):
[컷 N] "분위기, 피사체, 조명, 색상, 구도 --ar 9:16 --style raw"

2단계 - 영상 전환 프롬프트 (Kling/Runway 형식):
[컷 N] "시작 상태 → 끝 상태, 카메라 무브, 속도, 분위기"

캐릭터 일관성 유지:
- 변하면 안 되는 요소: [목록]
- 레퍼런스 이미지 첨부 필요 여부: [O/X]`,
      tip: "영상 프롬프트에 '9:16, 15 seconds, smooth transition'을 반드시 포함하세요. 캐릭터가 등장한다면 레퍼런스 이미지 설명도 필수입니다.",
    },
  ],
  a8: [
    {
      title: "Higgsfield 시네마틱 씬 설계 프롬프트",
      prompt: `Higgsfield를 활용한 시네마틱 숏폼 영상 씬을 설계해주세요.

영상 주제: beeliber AI 아카데미 — 교육의 변화 순간 포착
스타일: 시네마틱 다큐 + 모션그래픽 하이브리드

씬 구성 (3-4씬):
---
씬 N | 길이: 00초
카메라 무브: [Drone/Dolly/Handheld/Static]
  - 시작 위치:
  - 이동 방향과 속도:
  - 끝 위치:
피사체: [무엇을, 어떤 각도로]
조명: [자연광/인공광, 방향, 분위기]
Higgsfield 프롬프트:
브랜드 연결: [이 씬이 브랜드 메시지와 연결되는 이유]
---`,
      tip: "Higgsfield는 카메라 무브 키워드(orbit, push in, pull back 등)에 민감합니다. 키워드를 정확히 사용할수록 의도한 결과가 나옵니다.",
    },
    {
      title: "카메라 무브 + 감정 연결 설계",
      prompt: `각 씬의 카메라 무브가 시청자 감정에 어떤 영향을 주는지 분석하고, 브랜드 감성과 연결해주세요.

분석 프레임:
씬 N:
- 카메라 무브: [기법명]
- 유발 감정: [긴장/기대/안도/영감/궁금증]
- 브랜드 연결점: [beeliber 어떤 가치를 표현하는가]
- 전환 방식: [다음 씬으로 어떻게 넘어가는가]

전체 씬 감정 흐름 요약:
씬1(감정) → 씬2(감정) → 씬3(감정) → 클라이막스(감정)

최종 메시지 임팩트: [마지막 씬이 시청자에게 남기는 인상]`,
      tip: "카메라 무브와 감정의 연결이 논리적일수록 cameraDirection 루브릭 점수가 높아집니다. 영화 사례를 레퍼런스로 드는 것도 좋습니다.",
    },
  ],
  a9: [
    {
      title: "3언어 카드뉴스 통일 설계 프롬프트",
      prompt: `Freepik을 활용한 카드뉴스 세트를 한/영/중 3언어 통일 버전으로 기획해주세요.

카드뉴스 주제: beeliber AI 아카데미 — 마케팅 트랙 소개

언어별 핵심 메시지 통일:
한국어: [헤드라인] / [서브 메시지]
English: [headline] / [sub message]
中文: [标题] / [副标题]

각 언어별 주의사항:
- 한: 직접적이고 실용적인 어조
- 영: 간결한 CTA 중심 (Action verb로 시작)
- 중: 성과 강조형 문장 구조

Freepik 이미지 프롬프트 (3언어 공통 비주얼):
[동일한 비주얼로 3개 언어판 제작 가능한 이미지 프롬프트]`,
      tip: "3개 언어의 비주얼이 동일해야 languageAccuracy 점수를 받습니다. 텍스트만 바꾸고 레이아웃/이미지는 동일하게 유지하세요.",
    },
    {
      title: "비주얼 일관성 자체 검수 프롬프트",
      prompt: `제작한 카드뉴스 3언어 세트의 비주얼 일관성을 체크해주세요.

검수 항목:
1. 동일 컬러 팔레트 사용 여부 (각 언어판 비교)
2. 폰트 스타일 통일 여부
3. 로고/브랜드 엘리먼트 위치 일관성
4. 여백(마진) 비율 일관성
5. 이미지 스타일 통일 (사진/일러스트/혼합)

3언어 비교표:
| 항목 | 한국어판 | English판 | 中文판 | 일관성 |
|------|---------|----------|-------|-------|
각 항목 ✅/❌/⚠️ 표시

종합 일관성 점수: /30점
개선 우선순위:`,
      tip: "비교표에 ⚠️(부분 불일치)까지 정확히 체크하는 게 단순히 모두 ✅보다 신뢰도 있어 보입니다.",
    },
  ],
  a10: [
    {
      title: "Tree of Thoughts 프롬프트 설계",
      prompt: `아래 마케팅 과제에 Tree of Thoughts(ToT) 기법을 적용한 프롬프트를 설계해주세요.

과제: beeliber AI 아카데미 신규 수강생 유치 캠페인 기획

ToT 구조:
1단계 — 전략 트리 (3가지 방향 동시 탐색):
  전략A: [소셜 미디어 바이럴 중심]
  전략B: [검색/SEO 중심]
  전략C: [커뮤니티/입소문 중심]

2단계 — 각 전략의 하위 전술 2개씩 브랜치:
  A1: / A2:
  B1: / B2:
  C1: / C2:

3단계 — 평가 기준으로 가지치기:
  평가 기준: 실행 속도 / 비용 효율 / 브랜드 일치도
  탈락 전략 + 이유:

최종 선택 전략:
최종 프롬프트 (실행용):`,
      tip: "ToT의 핵심은 '동시에 여러 경로를 탐색하고 평가 기준으로 가지치기'하는 것입니다. 최종 선택보다 탈락 이유가 더 중요한 평가 요소입니다.",
    },
    {
      title: "Self-Reflection + RAG 복합 프롬프트",
      prompt: `다음 단계로 Self-Reflection과 RAG를 결합한 복합 프롬프트를 설계해주세요.

[Step 1 — RAG 지식 연결]
내 지식 소스: (NotebookLM에 연결된 문서 목록)
- beeliber 브랜드 가이드
- 최근 성공 캠페인 사례 3건
- 경쟁사 분석 보고서

RAG 프롬프트:
"위 자료를 참고하여 [과제 내용]을 작성해주세요.
참고한 근거는 [출처: 문서명, 페이지] 형식으로 명시하세요."

[Step 2 — Self-Reflection 루프]
초안 생성 후 AI에게 자기비평 요청:
"위 초안에서 개선할 수 있는 부분 3가지를 스스로 찾아 수정해주세요.
각 수정에 대해 왜 개선이 필요했는지 이유를 설명하세요."

[Step 3 — 최종 검수]
수정본을 다시 브랜드 기준으로 검수:
"수정본이 beeliber 브랜드 가이드를 준수하는지 체크리스트 형식으로 확인해주세요."`,
      tip: "3단계를 실제로 모두 실행하고 각 단계의 결과물을 첨부하세요. 과정이 없으면 promptArchitecture 점수를 받기 어렵습니다.",
    },
  ],
};

/* 과제 ID에 맞는 프롬프트 가져오기 (없으면 기본 프롬프트) */
const DEFAULT_PROMPT = [
  {
    title: "과제 초안 생성 도우미",
    prompt: `아래 과제 조건에 맞는 초안을 작성해주세요.

과제 제목: [이 과제의 제목]
제출 형식: [markdown/json/image/mixed]

작성 규칙:
1. 과제 조건을 정확히 준수
2. 브랜드 가이드라인 반영
3. 명확하고 실행 가능한 결과물 작성`,
    tip: "AI가 생성한 초안을 그대로 제출하면 안 됩니다! 반드시 검수하고 수정한 후 제출하세요.",
  },
];

/* ── 루브릭 키 한국어 매핑 ───────────────────────────────────── */
const RUBRIC_LABELS: Record<string, string> = {
  brandConsistency: "브랜드 일치도",
  policyAccuracy: "정책 정확도",
  completeness: "완성도",
  accuracy: "정확도",
  understanding: "이해도",
  explanation: "설명력",
  alternatives: "대안 제시",
  strategyQuality: "전략 품질",
  comparison: "비교 분석",
  brandAlignment: "브랜드 정합",
  structureClarity: "구조 명확성",
  executionReadiness: "실행 가능성",
  visualQuality: "비주얼 품질",
  promptSkill: "프롬프트 스킬",
  storyClarity: "스토리 명확성",
  promptQuality: "프롬프트 품질",
  cameraDirection: "카메라 연출",
  visualConsistency: "비주얼 일관성",
  languageAccuracy: "언어 정확도",
  promptArchitecture: "프롬프트 구조",
  practicalApplication: "실용 적용",
  selfReflection: "자기 성찰",
};

/* ── 메인 컴포넌트 ────────────────────────────────────────────── */
export default function AssignmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [content, setContent] = useState("");
  const [reviewResult, setReviewResult] = useState<ReturnType<typeof runAutoReview> | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDraft, setAiDraft] = useState<{ text: string; model: string; provider: string; isSimulation?: boolean } | null>(null);
  const [activeTab, setActiveTab] = useState("prompts");

  const assignment = ASSIGNMENTS.find((a) => a.id === id);
  if (!assignment) return (
    <div style={{ minHeight: "100vh", background: "#050508", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "rgba(255,255,255,0.40)" }}>과제를 찾을 수 없습니다.</p>
    </div>
  );

  const module = MODULES.find((m) => m.id === assignment.module_id);
  const track = module ? TRACKS.find((t) => t.id === module.track_id) : null;
  const prompts = ASSIGNMENT_PROMPTS[id] ?? DEFAULT_PROMPT;

  const handleReview = () => setReviewResult(runAutoReview(content));

  const handleSubmit = () => {
    if (!reviewResult) { handleReview(); return; }
    setSubmitted(true);
  };

  const handleCopy = (text: string, copyId: string) => {
    navigator.clipboard.writeText(text);
    setCopied(copyId);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleAiDraft = async (promptText: string) => {
    setAiLoading(true); setAiDraft(null);
    try {
      const fullPrompt = `${promptText}\n\n과제 제목: ${assignment.title}\n과제 설명: ${assignment.description}`;
      const res = await fetch("/api/ai/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt }),
      });
      const data = await res.json();
      if (data.success) {
        setAiDraft({ ...data.data, isSimulation: !!data.isSimulation });
        setContent(data.data.text);
        setReviewResult(runAutoReview(data.data.text));
        setActiveTab("workspace");  // AI 결과가 있는 탭으로 자동 이동
      }
    } catch (e) { console.error(e); }
    finally { setAiLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050508", color: "#fff" }}>

      {/* ── Header ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        margin: "12px 16px 0",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(10,10,18,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}>
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-2 text-sm">
          <Link href="/academy" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: 13 }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#fff"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"}>
            대시보드
          </Link>
          <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.18)" }} />
          {track && (
            <>
              <Link href={`/academy/${track.slug}`} style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: 13 }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#fff"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"}>
                {track.title}
              </Link>
              <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.18)" }} />
            </>
          )}
          <span className="font-sans" style={{ fontSize: 13, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {assignment.title}
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-5">

        {/* ── 과제 정보 카드 ── */}
        <div style={{
          borderRadius: 16,
          border: "1px solid rgba(245,158,11,0.15)",
          background: "linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(5,5,8,0.60) 60%)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          padding: "28px 32px",
          boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset",
        }}>
          {/* 배지 행 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{
              padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700,
              background: "rgba(245,158,11,0.15)", color: "#f59e0b",
              border: "1px solid rgba(245,158,11,0.25)",
            }}>실습 과제</span>
            <span style={{
              padding: "3px 10px", borderRadius: 4, fontSize: 11,
              background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.50)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>{assignment.submission_type}</span>
            {assignment.due_days && (
              <span style={{
                padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700,
                background: "rgba(239,68,68,0.12)", color: "#f87171",
                border: "1px solid rgba(239,68,68,0.22)",
              }}>D-{assignment.due_days}</span>
            )}
          </div>

          <h1 className="font-display" style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 900, marginBottom: 8 }}>
            {assignment.title}
          </h1>
          <p className="font-sans" style={{ fontSize: 14, color: "rgba(255,255,255,0.50)", lineHeight: 1.7, marginBottom: 20 }}>
            {assignment.description}
          </p>

          {/* 평가 기준 */}
          <div style={{
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(8px)",
            padding: "14px 16px",
          }}>
            <p className="font-mono" style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)", marginBottom: 10,
            }}>Evaluator 루브릭</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {Object.entries(assignment.rubric).map(([key, value]) => (
                <div key={key} style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "6px 12px", borderRadius: 8,
                  background: "rgba(245,158,11,0.07)",
                  border: "1px solid rgba(245,158,11,0.15)",
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", flexShrink: 0 }} />
                  <span className="font-sans" style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
                    {RUBRIC_LABELS[key] ?? key}
                  </span>
                  <span className="font-mono" style={{ fontSize: 12, fontWeight: 800, color: "#f59e0b" }}>{value}점</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 탭 ── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 rounded-xl p-1" style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}>
            <TabsTrigger value="prompts" className="rounded-lg text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white">
              예시 프롬프트 ({prompts.length})
            </TabsTrigger>
            <TabsTrigger value="workspace" className="rounded-lg text-xs data-[state=active]:text-green-400">
              실습 공간
            </TabsTrigger>
            <TabsTrigger value="review" className="rounded-lg text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white">
              AI 검수 결과
            </TabsTrigger>
          </TabsList>

          {/* ── 예시 프롬프트 탭 ── */}
          <TabsContent value="prompts">
            <div className="space-y-4">
              {/* 안내 배너 */}
              <div style={{
                borderRadius: 10, padding: "12px 16px",
                background: "rgba(6,182,212,0.07)",
                border: "1px solid rgba(6,182,212,0.18)",
              }}>
                <p className="font-sans" style={{ fontSize: 12, color: "rgba(6,182,212,0.90)", lineHeight: 1.6 }}>
                  💡 프롬프트를 복사하거나 <strong>AI로 실행</strong> 버튼을 누르면 실제 AI가 결과를 생성합니다. 이 과제에 맞게 최적화된 프롬프트 {prompts.length}개가 준비되어 있습니다.
                </p>
              </div>

              {prompts.map((p, idx) => (
                <div key={idx} style={{
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.025)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  padding: "20px",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.05) inset",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14, gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: 6,
                        background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <span className="font-mono" style={{ fontSize: 10, fontWeight: 800, color: "#f59e0b" }}>{idx + 1}</span>
                      </span>
                      <span className="font-sans" style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{p.title}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => handleAiDraft(p.prompt)}
                        disabled={aiLoading}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "6px 14px", borderRadius: 8, cursor: "pointer",
                          background: aiLoading ? "rgba(16,185,129,0.05)" : "rgba(16,185,129,0.10)",
                          color: "#10b981", fontSize: 12, fontWeight: 600,
                          border: "1px solid rgba(16,185,129,0.22)",
                          opacity: aiLoading ? 0.5 : 1,
                        }}>
                        <Play size={10} /> {aiLoading ? "생성 중..." : "AI 실행"}
                      </button>
                      <button
                        onClick={() => handleCopy(p.prompt, `p-${idx}`)}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "6px 12px", borderRadius: 8, cursor: "pointer",
                          background: copied === `p-${idx}` ? "rgba(16,185,129,0.10)" : "rgba(255,255,255,0.05)",
                          color: copied === `p-${idx}` ? "#10b981" : "rgba(255,255,255,0.55)",
                          fontSize: 12, border: "1px solid rgba(255,255,255,0.08)",
                        }}>
                        {copied === `p-${idx}` ? <><Check size={10} /> 복사됨</> : <><Copy size={10} /> 복사</>}
                      </button>
                    </div>
                  </div>

                  {/* 프롬프트 내용 */}
                  <pre style={{
                    background: "rgba(0,0,0,0.35)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 10, padding: "14px 16px",
                    fontSize: 12, lineHeight: 1.7,
                    color: "#86efac",
                    fontFamily: "var(--font-geist-mono, monospace)",
                    whiteSpace: "pre-wrap", overflowX: "auto",
                    marginBottom: 12,
                  }}>
                    {p.prompt}
                  </pre>

                  {/* 팁 */}
                  <div style={{
                    borderRadius: 8, padding: "10px 14px",
                    background: "rgba(245,158,11,0.07)",
                    border: "1px solid rgba(245,158,11,0.15)",
                  }}>
                    <p className="font-sans" style={{ fontSize: 12, color: "rgba(245,158,11,0.90)", lineHeight: 1.6 }}>
                      <strong>💡 팁:</strong> {p.tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ── 실습 공간 탭 ── */}
          <TabsContent value="workspace">
            <div className="space-y-4">
              {/* AI 초안 결과 */}
              {aiDraft && (
                <div style={{
                  borderRadius: 14, padding: "20px",
                  border: "1px solid rgba(16,185,129,0.18)",
                  background: "rgba(16,185,129,0.04)",
                  backdropFilter: "blur(12px)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <h3 className="font-sans" style={{ fontSize: 13, fontWeight: 700 }}>AI 초안 생성 결과</h3>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.25)" }}>{aiDraft.provider}</span>
                      <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, background: "rgba(6,182,212,0.12)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.20)" }}>{aiDraft.model}</span>
                    </div>
                  </div>
                  <div style={{
                    background: "rgba(0,0,0,0.30)", borderRadius: 10, padding: "14px",
                    fontSize: 12, lineHeight: 1.75, whiteSpace: "pre-wrap",
                    border: "1px solid rgba(255,255,255,0.05)",
                    maxHeight: 240, overflowY: "auto", marginBottom: 10,
                    color: "rgba(255,255,255,0.80)",
                  }}>
                    {aiDraft.text}
                  </div>
                  {aiDraft.isSimulation && (
                    <div style={{
                      borderRadius: 8, padding: "8px 12px", marginBottom: 8,
                      background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.18)",
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                      <span style={{ fontSize: 11 }}>⚠️</span>
                      <p className="font-sans" style={{ fontSize: 11, color: "rgba(245,158,11,0.85)" }}>
                        <strong>시뮬레이션 모드</strong> — .env.local에 GOOGLE_AI_KEY를 추가하면 실제 Gemini가 응답합니다.
                      </p>
                    </div>
                  )}
                  <p className="font-sans" style={{ fontSize: 11, color: "#fbbf24" }}>⚠️ AI 초안을 그대로 제출하면 감점! 반드시 검수 후 수정하세요.</p>
                </div>
              )}

              {/* 과제 작성 영역 */}
              <div style={{
                borderRadius: 14, padding: "20px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.025)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.05) inset",
              }}>
                <h3 className="font-sans" style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>과제 작성</h3>

                {submitted ? (
                  <div style={{ textAlign: "center", padding: "48px 0" }}>
                    <div style={{
                      width: 60, height: 60, borderRadius: "50%",
                      background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.30)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 16px", fontSize: 28,
                    }}>✅</div>
                    <h3 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 900, marginBottom: 8 }}>제출 완료!</h3>
                    <p className="font-sans" style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 20 }}>
                      AI 자동 검수가 진행되었습니다. 검수 결과 탭에서 확인하세요.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setReviewResult(null); }}
                      style={{
                        padding: "8px 20px", borderRadius: 8, cursor: "pointer",
                        background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.60)",
                        border: "1px solid rgba(255,255,255,0.10)", fontSize: 13,
                      }}>
                      다시 작성하기
                    </button>
                  </div>
                ) : (
                  <>
                    <textarea
                      className="glass-input w-full h-64 px-4 py-3 text-sm font-mono resize-none"
                      placeholder="여기에 과제를 작성하세요..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
                      <span className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.28)" }}>{content.length}자</span>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={handleReview} disabled={!content.trim()}
                          style={{
                            padding: "7px 16px", borderRadius: 8, cursor: "pointer",
                            background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.55)",
                            border: "1px solid rgba(255,255,255,0.09)", fontSize: 12,
                            opacity: !content.trim() ? 0.4 : 1,
                          }}>
                          자동 검수
                        </button>
                        <button
                          onClick={handleSubmit} disabled={!content.trim()}
                          style={{
                            padding: "7px 20px", borderRadius: 8, cursor: "pointer",
                            background: "#f59e0b", color: "#000", fontSize: 13, fontWeight: 700,
                            border: "none", boxShadow: "0 0 20px rgba(245,158,11,0.25)",
                            opacity: !content.trim() ? 0.4 : 1,
                          }}>
                          제출하기
                        </button>
                      </div>
                    </div>

                    {/* 인라인 검수 결과 */}
                    {reviewResult && !submitted && (
                      <div style={{
                        marginTop: 14, borderRadius: 10, padding: "14px",
                        background: reviewResult.passed ? "rgba(16,185,129,0.07)" : "rgba(239,68,68,0.07)",
                        border: `1px solid ${reviewResult.passed ? "rgba(16,185,129,0.22)" : "rgba(239,68,68,0.22)"}`,
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span className="font-sans" style={{ fontSize: 13, fontWeight: 700, color: reviewResult.passed ? "#10b981" : "#f87171" }}>
                            {reviewResult.passed ? "✅ 자동 검수 통과" : "❌ 위반 사항 발견"}
                          </span>
                          <span className="font-mono" style={{ fontSize: 13, fontWeight: 800, color: reviewResult.score >= 80 ? "#10b981" : reviewResult.score >= 50 ? "#fbbf24" : "#f87171" }}>
                            {reviewResult.score}/100
                          </span>
                        </div>
                        {reviewResult.violations.length > 0 && (
                          <ul style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            {reviewResult.violations.map((v, i) => (
                              <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.70)" }}>
                                <span style={{
                                  padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, flexShrink: 0,
                                  background: v.severity === "critical" ? "rgba(239,68,68,0.20)" : v.severity === "error" ? "rgba(251,146,60,0.20)" : "rgba(250,204,21,0.20)",
                                  color: v.severity === "critical" ? "#f87171" : v.severity === "error" ? "#fb923c" : "#facc15",
                                  border: `1px solid ${v.severity === "critical" ? "rgba(239,68,68,0.30)" : v.severity === "error" ? "rgba(251,146,60,0.30)" : "rgba(250,204,21,0.30)"}`,
                                }}>
                                  {v.severity === "critical" ? "심각" : v.severity === "error" ? "오류" : "경고"}
                                </span>
                                {v.message}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ── AI 검수 결과 탭 ── */}
          <TabsContent value="review">
            {reviewResult ? (
              <div className="space-y-4">
                {/* 점수 카드 */}
                <div style={{
                  borderRadius: 14, padding: "24px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.025)",
                  backdropFilter: "blur(12px)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3 className="font-sans" style={{ fontSize: 13, fontWeight: 700 }}>Evaluator 자동 검수 결과</h3>
                    <span className="font-mono" style={{
                      fontSize: "2rem", fontWeight: 900,
                      color: reviewResult.score >= 80 ? "#10b981" : reviewResult.score >= 50 ? "#fbbf24" : "#f87171",
                    }}>{reviewResult.score}점</span>
                  </div>
                  <div style={{
                    borderRadius: 10, padding: "12px 14px",
                    background: reviewResult.passed ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                    border: `1px solid ${reviewResult.passed ? "rgba(16,185,129,0.20)" : "rgba(239,68,68,0.20)"}`,
                  }}>
                    <p className="font-sans" style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: reviewResult.passed ? "#10b981" : "#f87171" }}>
                      {reviewResult.passed ? "✅ 기본 검수 통과" : "❌ 수정이 필요합니다"}
                    </p>
                    <p className="font-sans" style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{reviewResult.summary}</p>
                  </div>
                </div>

                {/* 위반 사항 */}
                {reviewResult.violations.length > 0 && (
                  <div style={{
                    borderRadius: 14, padding: "20px",
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "rgba(255,255,255,0.020)",
                    backdropFilter: "blur(12px)",
                  }}>
                    <h4 className="font-sans" style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>위반 사항 상세</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {reviewResult.violations.map((v, i) => (
                        <div key={i} style={{
                          display: "flex", alignItems: "flex-start", gap: 10,
                          borderRadius: 8, padding: "12px",
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}>
                          <Badge style={{
                            flexShrink: 0, fontSize: 10,
                            background: v.severity === "critical" ? "rgba(239,68,68,0.15)" : v.severity === "error" ? "rgba(251,146,60,0.15)" : "rgba(250,204,21,0.15)",
                            color: v.severity === "critical" ? "#f87171" : v.severity === "error" ? "#fb923c" : "#facc15",
                            border: `1px solid ${v.severity === "critical" ? "rgba(239,68,68,0.25)" : v.severity === "error" ? "rgba(251,146,60,0.25)" : "rgba(250,204,21,0.25)"}`,
                          }}>
                            {v.severity === "critical" ? "심각" : v.severity === "error" ? "오류" : "경고"}
                          </Badge>
                          <div>
                            <p className="font-sans" style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>{v.message}</p>
                            {v.found && (
                              <p className="font-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>
                                발견: <code style={{ background: "rgba(239,68,68,0.15)", padding: "1px 5px", borderRadius: 3, color: "#fca5a5" }}>{v.found}</code>
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coach 피드백 */}
                <div style={{
                  borderRadius: 14, padding: "20px",
                  border: "1px solid rgba(124,58,237,0.18)",
                  background: "rgba(124,58,237,0.05)",
                  backdropFilter: "blur(12px)",
                }}>
                  <h4 className="font-sans" style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa", marginBottom: 8 }}>Coach 피드백</h4>
                  <p className="font-sans" style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>
                    {reviewResult.passed
                      ? "🎉 검수 통과! 운영자 검토 후 최종 판정됩니다."
                      : "📝 위반 사항을 수정한 후 다시 제출하세요. 금지 표현을 확인하고 대안 표현으로 교체하세요."}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{
                borderRadius: 14, padding: "60px 20px", textAlign: "center",
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.015)",
              }}>
                <p className="font-sans" style={{ fontSize: 13, color: "rgba(255,255,255,0.28)" }}>
                  실습 공간에서 과제를 작성하고 제출하면 AI 검수 결과가 여기에 표시됩니다.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
