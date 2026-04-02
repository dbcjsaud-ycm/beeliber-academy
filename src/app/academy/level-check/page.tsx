"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface CheckItem {
  id: string;
  text: string;
  category: "basic" | "prompt" | "tool" | "workflow" | "harness";
}

const CHECKLIST: CheckItem[] = [
  // 뉴비 레벨 (0~6)
  { id: "n1", text: "ChatGPT 또는 Claude에 질문을 해본 적 있다", category: "basic" },
  { id: "n2", text: "AI가 생성한 텍스트를 읽고 이해할 수 있다", category: "basic" },
  { id: "n3", text: "AI에게 '~해줘'라고 요청할 수 있다", category: "basic" },
  { id: "n4", text: "AI 이미지 생성 도구(Midjourney/DALL-E)가 있다는 걸 안다", category: "basic" },
  { id: "n5", text: "프롬프트가 뭔지 한 문장으로 설명할 수 있다", category: "basic" },
  { id: "n6", text: "AI가 틀린 정보를 말할 수 있다는 걸 안다 (할루시네이션)", category: "basic" },

  // 중수 레벨 (7~14)
  { id: "m1", text: "역할 부여 프롬프트를 작성할 수 있다 ('당신은 ~입니다')", category: "prompt" },
  { id: "m2", text: "AI에게 출력 형식을 지정할 수 있다 (표, 목록, JSON 등)", category: "prompt" },
  { id: "m3", text: "같은 질문을 다르게 물어서 더 좋은 답을 얻어본 적 있다", category: "prompt" },
  { id: "m4", text: "AI 이미지 생성에서 스타일/비율/품질을 지정할 수 있다", category: "tool" },
  { id: "m5", text: "Canva, CapCut 등 편집 도구와 AI를 함께 사용해본 적 있다", category: "tool" },
  { id: "m6", text: "AI가 생성한 콘텐츠를 직접 검수하고 수정할 수 있다", category: "tool" },
  { id: "m7", text: "TTS(텍스트-투-스피치) 도구를 사용해본 적 있다", category: "tool" },
  { id: "m8", text: "AI에게 단계별로 지시하는 방법을 안다 (Step 1, 2, 3...)", category: "prompt" },

  // 고수 레벨 (15~22)
  { id: "a1", text: "시스템 프롬프트와 유저 프롬프트의 차이를 안다", category: "prompt" },
  { id: "a2", text: "Tree of Thoughts(사고의 나무) 기법을 사용할 수 있다", category: "prompt" },
  { id: "a3", text: "Self-Reflection 프롬프트를 설계할 수 있다", category: "prompt" },
  { id: "a4", text: "RAG(검색 증강 생성)의 개념을 설명할 수 있다", category: "workflow" },
  { id: "a5", text: "Image-to-Video 도구(Runway/Kling)를 사용할 수 있다", category: "tool" },
  { id: "a6", text: "AI 검수 체크리스트를 직접 설계할 수 있다", category: "workflow" },
  { id: "a7", text: "여러 AI 도구를 연결한 워크플로우를 설계해본 적 있다", category: "workflow" },
  { id: "a8", text: "프롬프트 A/B 테스트를 해서 최적의 결과를 찾아본 적 있다", category: "prompt" },

  // 프로 레벨 (23~30)
  { id: "p1", text: "Planner→Generator→Evaluator→Coach 하네스 구조를 설명할 수 있다", category: "harness" },
  { id: "p2", text: "AI가 생성한 결과물의 품질을 정량적으로 평가할 수 있다", category: "harness" },
  { id: "p3", text: "API를 활용하여 AI 자동화 파이프라인을 구축할 수 있다", category: "harness" },
  { id: "p4", text: "메타 프롬프팅(AI가 프롬프트를 개선하게 하기)을 사용할 수 있다", category: "prompt" },
  { id: "p5", text: "여러 AI 모델의 장단점을 비교하고 용도에 맞게 선택할 수 있다", category: "harness" },
  { id: "p6", text: "AI 검수 규칙을 코드로 구현할 수 있다", category: "harness" },
  { id: "p7", text: "다국어 콘텐츠를 AI로 생성하고 품질 검수까지 할 수 있다", category: "workflow" },
  { id: "p8", text: "AI 교육 커리큘럼을 직접 설계할 수 있다", category: "harness" },
];

interface LevelInfo {
  name: string;
  range: [number, number];
  color: string;
  bgColor: string;
  borderColor: string;
  emoji: string;
  title: string;
  description: string;
  recommendation: string;
  traits: string[];
}

const LEVELS: LevelInfo[] = [
  {
    name: "뉴비",
    range: [0, 6],
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
    emoji: "🐣",
    title: "AI 세계에 첫 발을 내딛은 당신!",
    description: "AI가 뭔지는 알겠는데, 어디서부터 시작해야 할지 모르겠죠? 걱정 마세요!",
    recommendation: "공통 베이스캠프부터 시작하세요. AI 기초와 빌리버 브랜드를 동시에 배울 수 있어요.",
    traits: ["AI에게 질문은 해봤어요", "프롬프트? 들어는 봤어요", "AI가 틀릴 수도 있다는 건 알아요"],
  },
  {
    name: "중수",
    range: [7, 14],
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-300",
    emoji: "🦊",
    title: "AI를 도구로 쓸 줄 아는 실전파!",
    description: "기본적인 프롬프트 작성과 AI 도구 활용이 가능한 단계입니다.",
    recommendation: "핵심 기술 및 도구 트랙으로 진행하세요. Gemini/Opal/NotebookLM 역할 분리를 배울 차례!",
    traits: ["역할 부여 프롬프트 작성 가능", "AI + 편집 도구 조합 사용", "AI 결과물 검수 가능"],
  },
  {
    name: "고수",
    range: [15, 22],
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-300",
    emoji: "🦅",
    title: "AI 워크플로우를 설계하는 전략가!",
    description: "고급 프롬프트 기법과 멀티 도구 워크플로우를 다룰 수 있는 수준입니다.",
    recommendation: "Super Gems/Opal 랩과 영상 솔루션 랩을 추천합니다. 하네스 엔지니어링 기초도 시작하세요!",
    traits: ["ToT, Self-Reflection 활용", "멀티모달 도구 사용", "AI 워크플로우 설계 가능"],
  },
  {
    name: "프로",
    range: [23, 30],
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-300",
    emoji: "🐝",
    title: "하네스 엔지니어링 마스터!",
    description: "AI를 시스템으로 설계하고 운영할 수 있는 최고 수준입니다.",
    recommendation: "최적화 전략 트랙과 실전 프로젝트에 도전하세요. 팀을 리드할 준비가 되었습니다!",
    traits: ["하네스 구조 설계/운영", "AI 파이프라인 자동화", "검수 규칙 코드 구현"],
  },
];

const CATEGORY_LABEL: Record<string, string> = {
  basic: "AI 기초",
  prompt: "프롬프트",
  tool: "AI 도구",
  workflow: "워크플로우",
  harness: "하네스 엔지니어링",
};

const CATEGORY_COLOR: Record<string, string> = {
  basic: "bg-blue-100 text-blue-700",
  prompt: "bg-violet-100 text-violet-700",
  tool: "bg-green-100 text-green-700",
  workflow: "bg-orange-100 text-orange-700",
  harness: "bg-amber-100 text-amber-700",
};

function getLevel(score: number): LevelInfo {
  for (const level of LEVELS) {
    if (score >= level.range[0] && score <= level.range[1]) return level;
  }
  return LEVELS[LEVELS.length - 1];
}

function LevelBadgeImage({ level, size = "large" }: { level: LevelInfo; size?: "large" | "small" }) {
  const isLarge = size === "large";

  return (
    <div className={`relative ${isLarge ? "w-48 h-48" : "w-20 h-20"}`}>
      {/* 배경 원 */}
      <div className={`absolute inset-0 rounded-full ${level.bgColor} ${level.borderColor} border-4 flex items-center justify-center`}>
        <div className="text-center">
          <div className={isLarge ? "text-6xl mb-1" : "text-2xl"}>{level.emoji}</div>
          {isLarge && (
            <>
              <div className={`text-xl font-black ${level.color}`}>{level.name}</div>
            </>
          )}
        </div>
      </div>
      {/* 빛나는 효과 (프로 레벨) */}
      {level.name === "프로" && (
        <div className="absolute inset-0 rounded-full border-4 border-amber-400 animate-pulse opacity-50" />
      )}
    </div>
  );
}

export default function LevelCheckPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [showResult, setShowResult] = useState(false);

  const score = checked.size;
  const level = getLevel(score);
  const progress = (score / CHECKLIST.length) * 100;

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const categoryScores = Object.keys(CATEGORY_LABEL).map((cat) => {
    const items = CHECKLIST.filter((c) => c.category === cat);
    const done = items.filter((c) => checked.has(c.id)).length;
    return { category: cat, total: items.length, done, percent: Math.round((done / items.length) * 100) };
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-2 text-sm">
          <Link href="/" className="text-neutral-400 hover:text-black">홈</Link>
          <span className="text-neutral-300">/</span>
          <span className="font-semibold">AI 레벨 체크</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 히어로 */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">나의 AI 레벨은?</h1>
          <p className="text-violet-200 mb-4">
            30개 항목을 체크하고 나의 AI 활용 수준을 확인하세요.
            솔직하게 체크해야 정확한 학습 경로를 추천받을 수 있어요!
          </p>
          <div className="flex items-center gap-4">
            {LEVELS.map((l) => (
              <div key={l.name} className="flex items-center gap-1.5">
                <LevelBadgeImage level={l} size="small" />
                <span className="text-sm font-semibold">{l.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 현재 점수 바 */}
        <Card className="mb-8 sticky top-0 z-40">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{level.emoji}</span>
                <div>
                  <span className={`font-bold text-lg ${level.color}`}>{level.name}</span>
                  <span className="text-neutral-400 text-sm ml-2">{score}/{CHECKLIST.length}개 체크</span>
                </div>
              </div>
              <Button
                onClick={() => setShowResult(true)}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                결과 확인하기
              </Button>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between mt-1 text-xs text-neutral-400">
              <span>뉴비 (0~6)</span>
              <span>중수 (7~14)</span>
              <span>고수 (15~22)</span>
              <span>프로 (23~30)</span>
            </div>
          </CardContent>
        </Card>

        {/* 체크리스트 */}
        {!showResult ? (
          <div className="space-y-6">
            {/* 뉴비 영역 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🐣</span>
                <h3 className="text-lg font-bold text-blue-600">뉴비 레벨</h3>
                <span className="text-sm text-neutral-400">AI 세계에 첫 발을 내딛다</span>
              </div>
              <div className="space-y-2">
                {CHECKLIST.slice(0, 6).map((item) => (
                  <ChecklistItem key={item.id} item={item} checked={checked.has(item.id)} onToggle={toggle} />
                ))}
              </div>
            </div>

            {/* 중수 영역 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🦊</span>
                <h3 className="text-lg font-bold text-green-600">중수 레벨</h3>
                <span className="text-sm text-neutral-400">AI를 도구로 다루다</span>
              </div>
              <div className="space-y-2">
                {CHECKLIST.slice(6, 14).map((item) => (
                  <ChecklistItem key={item.id} item={item} checked={checked.has(item.id)} onToggle={toggle} />
                ))}
              </div>
            </div>

            {/* 고수 영역 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🦅</span>
                <h3 className="text-lg font-bold text-purple-600">고수 레벨</h3>
                <span className="text-sm text-neutral-400">AI 워크플로우를 설계하다</span>
              </div>
              <div className="space-y-2">
                {CHECKLIST.slice(14, 22).map((item) => (
                  <ChecklistItem key={item.id} item={item} checked={checked.has(item.id)} onToggle={toggle} />
                ))}
              </div>
            </div>

            {/* 프로 영역 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🐝</span>
                <h3 className="text-lg font-bold text-amber-600">프로 레벨</h3>
                <span className="text-sm text-neutral-400">하네스 엔지니어링 마스터</span>
              </div>
              <div className="space-y-2">
                {CHECKLIST.slice(22, 30).map((item) => (
                  <ChecklistItem key={item.id} item={item} checked={checked.has(item.id)} onToggle={toggle} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* 결과 화면 */
          <div className="space-y-6">
            {/* 레벨 배지 카드 */}
            <Card className={`${level.bgColor} ${level.borderColor} border-2`}>
              <CardContent className="pt-8 pb-8">
                <div className="flex flex-col items-center text-center">
                  <LevelBadgeImage level={level} size="large" />
                  <h2 className={`text-2xl font-black mt-4 ${level.color}`}>{level.title}</h2>
                  <p className="text-neutral-600 mt-2 max-w-md">{level.description}</p>

                  <div className="mt-4 flex gap-2">
                    {level.traits.map((trait, i) => (
                      <Badge key={i} variant="outline" className={level.color}>
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 카테고리별 레이더 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">영역별 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryScores.map((cs) => (
                    <div key={cs.category}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${CATEGORY_COLOR[cs.category]}`}>
                            {CATEGORY_LABEL[cs.category]}
                          </Badge>
                        </div>
                        <span className="text-sm font-semibold">{cs.done}/{cs.total}</span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            cs.percent >= 80 ? "bg-green-500" :
                            cs.percent >= 50 ? "bg-yellow-500" :
                            cs.percent >= 20 ? "bg-orange-500" :
                            "bg-red-400"
                          }`}
                          style={{ width: `${cs.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 추천 학습 경로 */}
            <Card className="bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-200">
              <CardHeader>
                <CardTitle className="text-base text-violet-800">추천 학습 경로</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-violet-700 mb-4">{level.recommendation}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {level.name === "뉴비" && (
                    <>
                      <RecommendCard emoji="🏕️" title="공통 베이스캠프" desc="AI 기초 + 빌리버 브랜드" href="/academy/common" priority="필수" />
                      <RecommendCard emoji="🔧" title="핵심 기술 및 도구" desc="Gemini / Opal 기초" href="/academy/tools" priority="다음" />
                    </>
                  )}
                  {level.name === "중수" && (
                    <>
                      <RecommendCard emoji="🔧" title="핵심 기술 및 도구" desc="도구 역할 분리" href="/academy/tools" priority="필수" />
                      <RecommendCard emoji="🎨" title="멀티모달 생성 스쿨" desc="이미지/영상/오디오" href="/academy/multimodal" priority="추천" />
                    </>
                  )}
                  {level.name === "고수" && (
                    <>
                      <RecommendCard emoji="💎" title="Super Gems / Opal 랩" desc="미니 앱 설계" href="/academy/supergems" priority="필수" />
                      <RecommendCard emoji="🎬" title="영상 솔루션 랩" desc="Higgsfield / Freepik" href="/academy/video-lab" priority="추천" />
                    </>
                  )}
                  {level.name === "프로" && (
                    <>
                      <RecommendCard emoji="⚡" title="최적화 전략" desc="하네스 엔지니어링 고급" href="/academy/optimization" priority="도전" />
                      <RecommendCard emoji="🚀" title="실전 활용 사례" desc="팀 프로젝트" href="/academy/use-cases" priority="실전" />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 레벨 전체 비교 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">전체 레벨 비교</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {LEVELS.map((l) => {
                    const isCurrent = l.name === level.name;
                    return (
                      <div
                        key={l.name}
                        className={`text-center p-4 rounded-xl border-2 transition-all ${
                          isCurrent
                            ? `${l.bgColor} ${l.borderColor} scale-105 shadow-lg`
                            : "bg-white border-neutral-100 opacity-60"
                        }`}
                      >
                        <div className="text-3xl mb-2">{l.emoji}</div>
                        <div className={`font-bold ${isCurrent ? l.color : "text-neutral-400"}`}>
                          {l.name}
                        </div>
                        <div className="text-xs text-neutral-400 mt-1">
                          {l.range[0]}~{l.range[1]}개
                        </div>
                        {isCurrent && (
                          <Badge className="mt-2 bg-violet-600 text-white text-xs">현재 레벨</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button variant="outline" onClick={() => setShowResult(false)}>
                체크리스트로 돌아가기
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ChecklistItem({ item, checked, onToggle }: { item: CheckItem; checked: boolean; onToggle: (id: string) => void }) {
  return (
    <label
      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
        checked
          ? "bg-green-50 border-green-200"
          : "bg-white border-neutral-200 hover:border-neutral-300"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(item.id)}
        className="w-5 h-5 rounded border-neutral-300 text-violet-600 focus:ring-violet-500 shrink-0"
      />
      <span className={`text-sm flex-1 ${checked ? "text-green-700" : "text-neutral-700"}`}>
        {item.text}
      </span>
      <Badge className={`text-xs shrink-0 ${CATEGORY_COLOR[item.category]}`}>
        {CATEGORY_LABEL[item.category]}
      </Badge>
      {checked && <span className="text-green-500 shrink-0">✓</span>}
    </label>
  );
}

function RecommendCard({ emoji, title, desc, href, priority }: { emoji: string; title: string; desc: string; href: string; priority: string }) {
  const priorityColor: Record<string, string> = {
    "필수": "bg-red-100 text-red-700",
    "추천": "bg-blue-100 text-blue-700",
    "다음": "bg-neutral-100 text-neutral-600",
    "도전": "bg-purple-100 text-purple-700",
    "실전": "bg-amber-100 text-amber-700",
  };

  return (
    <Link href={href}>
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:shadow-md transition-shadow">
        <span className="text-2xl">{emoji}</span>
        <div className="flex-1">
          <div className="font-semibold text-sm">{title}</div>
          <div className="text-xs text-neutral-400">{desc}</div>
        </div>
        <Badge className={`text-xs ${priorityColor[priority] || "bg-neutral-100"}`}>{priority}</Badge>
      </div>
    </Link>
  );
}
