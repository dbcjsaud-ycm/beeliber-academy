"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface CheckItem { id: string; text: string; category: "basic" | "prompt" | "tool" | "workflow" | "harness" }

const CHECKLIST: CheckItem[] = [
  { id: "n1", text: "ChatGPT 또는 Claude에 질문을 해본 적 있다", category: "basic" },
  { id: "n2", text: "AI가 생성한 텍스트를 읽고 이해할 수 있다", category: "basic" },
  { id: "n3", text: "AI에게 '~해줘'라고 요청할 수 있다", category: "basic" },
  { id: "n4", text: "AI 이미지 생성 도구(Midjourney/DALL-E)가 있다는 걸 안다", category: "basic" },
  { id: "n5", text: "프롬프트가 뭔지 한 문장으로 설명할 수 있다", category: "basic" },
  { id: "n6", text: "AI가 틀린 정보를 말할 수 있다는 걸 안다 (할루시네이션)", category: "basic" },
  { id: "m1", text: "역할 부여 프롬프트를 작성할 수 있다 ('당신은 ~입니다')", category: "prompt" },
  { id: "m2", text: "AI에게 출력 형식을 지정할 수 있다 (표, 목록, JSON 등)", category: "prompt" },
  { id: "m3", text: "같은 질문을 다르게 물어서 더 좋은 답을 얻어본 적 있다", category: "prompt" },
  { id: "m4", text: "AI 이미지 생성에서 스타일/비율/품질을 지정할 수 있다", category: "tool" },
  { id: "m5", text: "Canva, CapCut 등 편집 도구와 AI를 함께 사용해본 적 있다", category: "tool" },
  { id: "m6", text: "AI가 생성한 콘텐츠를 직접 검수하고 수정할 수 있다", category: "tool" },
  { id: "m7", text: "TTS(텍스트-투-스피치) 도구를 사용해본 적 있다", category: "tool" },
  { id: "m8", text: "AI에게 단계별로 지시하는 방법을 안다 (Step 1, 2, 3...)", category: "prompt" },
  { id: "a1", text: "시스템 프롬프트와 유저 프롬프트의 차이를 안다", category: "prompt" },
  { id: "a2", text: "Tree of Thoughts(사고의 나무) 기법을 사용할 수 있다", category: "prompt" },
  { id: "a3", text: "Self-Reflection 프롬프트를 설계할 수 있다", category: "prompt" },
  { id: "a4", text: "RAG(검색 증강 생성)의 개념을 설명할 수 있다", category: "workflow" },
  { id: "a5", text: "Image-to-Video 도구(Runway/Kling)를 사용할 수 있다", category: "tool" },
  { id: "a6", text: "AI 검수 체크리스트를 직접 설계할 수 있다", category: "workflow" },
  { id: "a7", text: "여러 AI 도구를 연결한 워크플로우를 설계해본 적 있다", category: "workflow" },
  { id: "a8", text: "프롬프트 A/B 테스트를 해서 최적의 결과를 찾아본 적 있다", category: "prompt" },
  { id: "p1", text: "Planner→Generator→Evaluator→Coach 하네스 구조를 설명할 수 있다", category: "harness" },
  { id: "p2", text: "AI가 생성한 결과물의 품질을 정량적으로 평가할 수 있다", category: "harness" },
  { id: "p3", text: "API를 활용하여 AI 자동화 파이프라인을 구축할 수 있다", category: "harness" },
  { id: "p4", text: "메타 프롬프팅(AI가 프롬프트를 개선하게 하기)을 사용할 수 있다", category: "prompt" },
  { id: "p5", text: "여러 AI 모델의 장단점을 비교하고 용도에 맞게 선택할 수 있다", category: "harness" },
  { id: "p6", text: "AI 검수 규칙을 코드로 구현할 수 있다", category: "harness" },
  { id: "p7", text: "다국어 콘텐츠를 AI로 생성하고 품질 검수까지 할 수 있다", category: "workflow" },
  { id: "p8", text: "AI 교육 커리큘럼을 직접 설계할 수 있다", category: "harness" },
];

interface LevelInfo { name: string; range: [number, number]; emoji: string; title: string; desc: string; recommendation: string; traits: string[]; color: string }

const LEVELS: LevelInfo[] = [
  { name: "뉴비", range: [0, 6], emoji: "🐣", title: "AI 세계에 첫 발!", desc: "어디서 시작해야 할지 모르겠죠? 걱정 마세요!", recommendation: "공통 베이스캠프부터 시작하세요.", traits: ["AI에 질문 해봤어요", "프롬프트 들어봤어요"], color: "blue" },
  { name: "중수", range: [7, 14], emoji: "🦊", title: "AI를 도구로 다루는 실전파!", desc: "기본 프롬프트와 도구 활용이 가능한 단계.", recommendation: "핵심 기술 및 도구 트랙으로!", traits: ["역할 부여 프롬프트", "AI+편집 도구 조합"], color: "green" },
  { name: "고수", range: [15, 22], emoji: "🦅", title: "워크플로우를 설계하는 전략가!", desc: "고급 프롬프트와 멀티 도구 워크플로우.", recommendation: "Super Gems/Opal 랩 + 영상 솔루션!", traits: ["ToT/Self-Reflection", "멀티모달 도구"], color: "purple" },
  { name: "프로", range: [23, 30], emoji: "🐝", title: "하네스 엔지니어링 마스터!", desc: "AI를 시스템으로 설계하고 운영.", recommendation: "최적화 전략 + 실전 프로젝트!", traits: ["하네스 구조 설계", "AI 파이프라인 자동화"], color: "amber" },
];

const CAT_LABEL: Record<string, string> = { basic: "AI 기초", prompt: "프롬프트", tool: "AI 도구", workflow: "워크플로우", harness: "하네스" };
const CAT_COLOR: Record<string, string> = { basic: "bg-blue-500/20 text-blue-400", prompt: "bg-violet-500/20 text-violet-400", tool: "bg-green-500/20 text-green-400", workflow: "bg-orange-500/20 text-orange-400", harness: "bg-amber-500/20 text-amber-400" };
const LEVEL_COLOR: Record<string, string> = { blue: "border-blue-500/30", green: "border-green-500/30", purple: "border-purple-500/30", amber: "border-amber-500/30" };
const LEVEL_BG: Record<string, string> = { blue: "bg-blue-500/10", green: "bg-green-500/10", purple: "bg-purple-500/10", amber: "bg-amber-500/10" };
const LEVEL_TEXT: Record<string, string> = { blue: "text-blue-400", green: "text-green-400", purple: "text-purple-400", amber: "text-amber-400" };

function getLevel(score: number): LevelInfo {
  for (const l of LEVELS) { if (score >= l.range[0] && score <= l.range[1]) return l; }
  return LEVELS[LEVELS.length - 1];
}

export default function LevelCheckPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [showResult, setShowResult] = useState(false);

  const score = checked.size;
  const level = getLevel(score);
  const progress = (score / CHECKLIST.length) * 100;

  const toggle = (id: string) => {
    setChecked((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };

  const catScores = Object.keys(CAT_LABEL).map((cat) => {
    const items = CHECKLIST.filter((c) => c.category === cat);
    const done = items.filter((c) => checked.has(c.id)).length;
    return { category: cat, total: items.length, done, percent: Math.round((done / items.length) * 100) };
  });

  const SECTIONS = [
    { emoji: "🐣", label: "뉴비 레벨", color: "text-blue-400", sub: "AI 세계에 첫 발", items: CHECKLIST.slice(0, 6) },
    { emoji: "🦊", label: "중수 레벨", color: "text-green-400", sub: "AI를 도구로 다루다", items: CHECKLIST.slice(6, 14) },
    { emoji: "🦅", label: "고수 레벨", color: "text-purple-400", sub: "워크플로우 설계", items: CHECKLIST.slice(14, 22) },
    { emoji: "🐝", label: "프로 레벨", color: "text-amber-400", sub: "하네스 마스터", items: CHECKLIST.slice(22, 30) },
  ];

  return (
    <div className="min-h-screen text-white">
      <header className="glass-panel-light sticky top-0 z-50 mx-4 mt-3 rounded-xl">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-2 text-sm">
          <Link href="/academy" className="text-secondary-dark hover:text-white">대시보드</Link>
          <span className="text-white/20">/</span>
          <span className="font-semibold">AI 레벨 체크</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 히어로 */}
        <div className="glass-panel p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">나의 AI 레벨은?</h1>
          <p className="text-secondary-dark mb-4 text-sm">30개 항목을 솔직하게 체크하고 나의 AI 활용 수준을 확인하세요.</p>
          <div className="flex items-center gap-4">
            {LEVELS.map((l) => (
              <div key={l.name} className="flex items-center gap-1.5">
                <span className="text-xl">{l.emoji}</span>
                <span className={`text-xs font-semibold ${LEVEL_TEXT[l.color]}`}>{l.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 실시간 점수 바 */}
        <div className="glass-panel p-5 mb-8 sticky top-14 z-40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{level.emoji}</span>
              <span className={`font-bold ${LEVEL_TEXT[level.color]}`}>{level.name}</span>
              <span className="text-secondary-dark text-xs">{score}/{CHECKLIST.length}개</span>
            </div>
            <button onClick={() => setShowResult(true)} className="btn-primary-dark px-4 py-1.5 text-xs">결과 확인</button>
          </div>
          <div className="w-full bg-white/5 rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-500 via-green-500 via-purple-500 to-amber-500 h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] text-secondary-dark">
            <span>뉴비 (0~6)</span><span>중수 (7~14)</span><span>고수 (15~22)</span><span>프로 (23~30)</span>
          </div>
        </div>

        {!showResult ? (
          <div className="space-y-8">
            {SECTIONS.map((sec) => (
              <div key={sec.label}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{sec.emoji}</span>
                  <h3 className={`font-bold ${sec.color}`}>{sec.label}</h3>
                  <span className="text-xs text-secondary-dark">{sec.sub}</span>
                </div>
                <div className="space-y-2">
                  {sec.items.map((item) => (
                    <label key={item.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${checked.has(item.id) ? "glass-panel border-green-500/30" : "glass-panel-light border-white/5 hover:border-white/10"}`}>
                      <input type="checkbox" checked={checked.has(item.id)} onChange={() => toggle(item.id)} className="w-4 h-4 rounded border-white/20 bg-white/5 text-amber-400 shrink-0" />
                      <span className={`text-sm flex-1 ${checked.has(item.id) ? "text-white" : "text-white/60"}`}>{item.text}</span>
                      <Badge className={`text-[10px] shrink-0 ${CAT_COLOR[item.category]}`}>{CAT_LABEL[item.category]}</Badge>
                      {checked.has(item.id) && <span className="text-green-400 text-xs">✓</span>}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* 레벨 배지 */}
            <div className={`glass-panel p-8 text-center ${LEVEL_BG[level.color]} border ${LEVEL_COLOR[level.color]}`}>
              <span className="text-6xl block mb-3">{level.emoji}</span>
              <h2 className={`text-2xl font-black ${LEVEL_TEXT[level.color]}`}>{level.title}</h2>
              <p className="text-secondary-dark mt-2 text-sm">{level.desc}</p>
              <div className="flex justify-center gap-2 mt-4">
                {level.traits.map((t, i) => (
                  <Badge key={i} className={`${CAT_COLOR.harness} text-xs`}>{t}</Badge>
                ))}
              </div>
            </div>

            {/* 영역별 분석 */}
            <div className="glass-panel p-5">
              <h3 className="font-bold text-sm mb-4">영역별 분석</h3>
              <div className="space-y-3">
                {catScores.map((cs) => (
                  <div key={cs.category}>
                    <div className="flex items-center justify-between mb-1">
                      <Badge className={`text-[10px] ${CAT_COLOR[cs.category]}`}>{CAT_LABEL[cs.category]}</Badge>
                      <span className="text-xs font-semibold">{cs.done}/{cs.total}</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-3">
                      <div className={`h-3 rounded-full transition-all ${cs.percent >= 80 ? "bg-green-500" : cs.percent >= 50 ? "bg-yellow-500" : cs.percent >= 20 ? "bg-orange-500" : "bg-red-400"}`} style={{ width: `${cs.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 추천 */}
            <div className="glass-panel p-5 border border-violet-500/20">
              <h3 className="font-bold text-sm text-violet-400 mb-2">추천 학습 경로</h3>
              <p className="text-sm text-secondary-dark">{level.recommendation}</p>
            </div>

            {/* 전체 비교 */}
            <div className="glass-panel p-5">
              <h3 className="font-bold text-sm mb-4">전체 레벨 비교</h3>
              <div className="grid grid-cols-4 gap-3">
                {LEVELS.map((l) => {
                  const isCurrent = l.name === level.name;
                  return (
                    <div key={l.name} className={`text-center p-4 rounded-xl border transition-all ${isCurrent ? `${LEVEL_BG[l.color]} ${LEVEL_COLOR[l.color]} shadow-lg` : "glass-panel-light border-white/5 opacity-50"}`}>
                      <span className="text-2xl block mb-1">{l.emoji}</span>
                      <span className={`font-bold text-xs ${isCurrent ? LEVEL_TEXT[l.color] : "text-white/40"}`}>{l.name}</span>
                      <span className="block text-[10px] text-secondary-dark">{l.range[0]}~{l.range[1]}개</span>
                      {isCurrent && <Badge className="mt-2 bg-violet-500/20 text-violet-400 text-[10px]">현재</Badge>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-center">
              <button className="btn-secondary-dark px-4 py-1.5 text-xs" onClick={() => setShowResult(false)}>체크리스트로 돌아가기</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
