"use client";

import { useState } from "react";
import Link from "next/link";
import { ASSIGNMENTS, MODULES, TRACKS } from "@/lib/academy/data";
import { runAutoReview } from "@/lib/academy/policies";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { use } from "react";

// 과제별 예시 프롬프트
const EXAMPLE_PROMPTS: Record<string, { title: string; prompt: string; tip: string }[]> = {
  a1: [
    {
      title: "빌리버 서비스 소개문 생성",
      prompt: `당신은 빌리버(beeliber) 서비스를 소개하는 마케팅 카피라이터입니다.

아래 조건으로 서비스 소개문을 작성해주세요:
- 대상: 한국을 방문하는 외국인 여행자
- 톤: 경쾌하고 친근한 (Active 모드)
- 길이: 200자 이내
- 포함 정보: 서비스 종류, 가격대, 예약 방법
- 마무리: 브랜드 시그니처로 끝내기

주의: 빌리버의 브랜드 가이드라인을 반드시 준수하세요.`,
      tip: "이 프롬프트로 생성된 결과물에서 금지 표현과 잘못된 정보를 찾는 것이 과제입니다!",
    },
    {
      title: "오류가 포함된 소개문 검수",
      prompt: `아래 빌리버 서비스 소개문에서 잘못된 부분을 모두 찾아주세요.

검수 기준:
1. 금지 표현 10개 (저렴한/싼/할인/힘들다/무겁다/택배/물류/AI기반솔루션/호텔픽업/공항→호텔배송)
2. 운영 시간 정확성 (09:00~21:00)
3. 배송 방향 (Hub→인천공항만 가능)
4. 예약 경로 (bee-liber.com만 안내)
5. Phase 1 기준 준수

발견한 오류마다:
- 위치 (몇 번째 줄)
- 오류 유형 (금지표현/운영정책/사실오류)
- 수정 제안

을 포함하여 리포트를 작성해주세요.`,
      tip: "Evaluator 역할을 직접 체험하는 과제입니다. AI가 검수하듯 여러분이 직접 검수해보세요!",
    },
  ],
  a3: [
    {
      title: "금지 표현이 포함된 콘텐츠 생성 (의도적 오류)",
      prompt: `빌리버 서비스를 소개하는 SNS 게시물 5개를 작성해주세요.
단, 각 게시물에 1~2개의 금지 표현을 의도적으로 포함시켜주세요.

빌리버 금지 표현 목록:
저렴한, 싼, 할인, 힘들다, 무겁다, 택배, 물류, AI 기반 솔루션, 호텔 픽업, 공항→호텔 배송

게시물 형식:
- 채널: 인스타그램 스레드
- 톤: Active 모드 (경쾌하고 친근하게)
- 각 게시물 150자 이내
- 마지막에 CTA 포함`,
      tip: "AI에게 일부러 틀린 콘텐츠를 만들게 한 후, 여러분이 금지 표현을 모두 찾아내는 훈련입니다!",
    },
  ],
  a4: [
    {
      title: "Gemini 전략 3안 생성 프롬프트",
      prompt: `당신은 빌리버(beeliber)의 마케팅 전략 컨설턴트입니다.

빌리버 현황:
- 인스타그램 팔로워 213명
- 서울 Hub 6개 + 파트너 33개+ 지점
- 핵심 타겟: 라스트데이 외국인 여행자
- 배송: Hub→인천공항 당일 배송
- 주요 시장: 영어권, 繁體中文(TW/HK), 일본어권

과제: 인스타그램 팔로워를 3개월 내 1,000명으로 성장시키는 전략 3안을 제시하세요.

각 전략에 포함할 내용:
1. 전략명
2. 핵심 아이디어 (3줄)
3. 예상 비용
4. 실현 가능성 (상/중/하)
5. 장점 3가지
6. 단점 3가지
7. 1주차~12주차 실행 로드맵`,
      tip: "3안을 비교 분석하고, 최적의 1안을 선택하여 근거를 설명하는 것까지가 과제입니다!",
    },
  ],
  a7: [
    {
      title: "숏폼 스토리보드 자동 생성",
      prompt: `당신은 교육 콘텐츠 전문 스토리 기획자입니다.

## 입력
- 주제: 빌리버 라스트데이 서비스 소개
- 타깃: 한국 여행 중인 외국인 (영어권)
- 길이: 15초
- 톤: 밝고 자유로운 여행 분위기

## 요구
1. 정확히 4씬으로 구성
2. 각 씬: 시간 / 화면 설명 / 텍스트 오버레이 / 감정
3. 구조: 후킹(3초) → 문제(3초) → 솔루션(6초) → CTA(3초)
4. 빌리버 Phase 1 기준 엄격 준수
5. Image-to-Video 프롬프트까지 포함

## 절대 금지
- 공항→호텔 배송 언급
- 호텔 픽업 언급
- 금지 표현 사용`,
      tip: "스토리보드를 만든 후 Runway/Kling 프롬프트까지 작성하는 것이 과제입니다!",
    },
  ],
};

// 기본 예시 프롬프트
const DEFAULT_PROMPTS = [
  {
    title: "과제 초안 생성 도우미",
    prompt: `아래 과제 조건에 맞는 초안을 작성해주세요.

과제 제목: [이 과제의 제목]
제출 형식: [markdown/json/image/mixed]

작성 규칙:
1. 빌리버 Phase 1 기준 엄격 준수
2. 금지 표현 사용 금지
3. 예약은 반드시 bee-liber.com으로 안내
4. Hub→인천공항 배송만 언급 가능
5. 마무리 시그니처: "가벼운 여행 되세요! 🐝"`,
    tip: "AI가 생성한 초안을 그대로 제출하면 안 됩니다! 반드시 검수하고 수정한 후 제출하세요.",
  },
];

export default function AssignmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [content, setContent] = useState("");
  const [reviewResult, setReviewResult] = useState<ReturnType<typeof runAutoReview> | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDraft, setAiDraft] = useState<{ text: string; model: string; provider: string } | null>(null);

  const assignment = ASSIGNMENTS.find((a) => a.id === id);
  if (!assignment) return <div className="p-8 academy-bg text-white">과제를 찾을 수 없습니다.</div>;

  const module = MODULES.find((m) => m.id === assignment.module_id);
  const track = module ? TRACKS.find((t) => t.id === module.track_id) : null;
  const prompts = EXAMPLE_PROMPTS[id] || DEFAULT_PROMPTS;

  const handleReview = () => {
    const result = runAutoReview(content);
    setReviewResult(result);
  };

  const handleSubmit = () => {
    if (!reviewResult) { handleReview(); return; }
    setSubmitted(true);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
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
        setAiDraft(data.data);
        setContent(data.data.text);
        setReviewResult(runAutoReview(data.data.text));
      }
    } catch (e) { console.error(e); }
    finally { setAiLoading(false); }
  };

  return (
    <div className="min-h-screen academy-bg text-white">
      <header className="glass-panel-light sticky top-0 z-50 mx-4 mt-3 rounded-xl">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-2 text-sm">
          <Link href="/academy" className="text-secondary-dark hover:text-white">대시보드</Link>
          <span className="text-white/20">/</span>
          {track && (
            <>
              <Link href={`/academy/${track.slug}`} className="text-secondary-dark hover:text-white">{track.title}</Link>
              <span className="text-white/20">/</span>
            </>
          )}
          <span className="font-semibold truncate">{assignment.title}</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* 과제 정보 */}
        <div className="glass-panel p-8 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-amber-100 text-amber-800">실습 과제</Badge>
            <Badge variant="outline">{assignment.submission_type}</Badge>
            {assignment.due_days && <Badge className="bg-red-100 text-red-700">D-{assignment.due_days}</Badge>}
          </div>
          <h1 className="text-2xl font-bold mb-2">{assignment.title}</h1>
          <p className="text-neutral-500 mb-4">{assignment.description}</p>

          {/* 평가 기준 */}
          <div className="bg-neutral-50 rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">평가 기준 (Evaluator 루브릭)</p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(assignment.rubric).map(([key, value]) => (
                <div key={key} className="flex items-center gap-1 text-sm">
                  <span className="w-2 h-2 bg-amber-400 rounded-full" />
                  <span className="text-neutral-600">{key}</span>
                  <span className="font-bold">{value}점</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 탭 */}
        <Tabs defaultValue="prompts" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 rounded-xl p-1">
            <TabsTrigger value="prompts" className="rounded-lg text-xs data-[state=active]:bg-white/10">예시 프롬프트</TabsTrigger>
            <TabsTrigger value="workspace" className="rounded-lg text-xs data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">실습 공간</TabsTrigger>
            <TabsTrigger value="review" className="rounded-lg text-xs data-[state=active]:bg-white/10">AI 검수 결과</TabsTrigger>
          </TabsList>

          {/* 예시 프롬프트 탭 */}
          <TabsContent value="prompts">
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-xs text-blue-400">
                  프롬프트를 복사하거나, &quot;AI로 실행&quot; 버튼을 누르면 실제 Gemini가 결과를 생성합니다!
                </p>
              </div>

              {prompts.map((p, idx) => (
                <div key={idx} className="node-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm">프롬프트 {idx + 1}: {p.title}</span>
                    <div className="flex gap-2">
                      <button className="btn-secondary-dark px-3 py-1 text-xs border-green-500/30 text-green-400 hover:bg-green-500/10" onClick={() => handleAiDraft(p.prompt)} disabled={aiLoading}>
                        {aiLoading ? "생성 중..." : "▶ AI로 실행"}
                      </button>
                      <button className="btn-secondary-dark px-3 py-1 text-xs" onClick={() => handleCopy(p.prompt, `p-${idx}`)}>
                        {copied === `p-${idx}` ? "✓ 복사됨" : "복사"}
                      </button>
                    </div>
                  </div>
                  <div>
                    <pre className="bg-[#0a0a0c] text-green-400 p-4 rounded-xl text-xs whitespace-pre-wrap overflow-x-auto mb-3 border border-white/5">
                      {p.prompt}
                    </pre>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                      <p className="text-xs text-amber-400">
                        <strong>💡 팁:</strong> {p.tip}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* 실습 공간 탭 */}
          <TabsContent value="workspace">
            <div className="space-y-4">

              {/* AI 초안 결과 */}
              {aiDraft && (
                <div className="glass-panel p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm">AI 초안 생성 결과</h3>
                    <div className="flex gap-2">
                      <Badge className="bg-green-500/20 text-green-400 text-xs">{aiDraft.provider}</Badge>
                      <Badge className="bg-blue-500/20 text-blue-400 text-xs">{aiDraft.model}</Badge>
                    </div>
                  </div>
                  <div className="bg-[#0a0a0c] rounded-xl p-4 text-xs whitespace-pre-wrap leading-relaxed border border-white/5 max-h-60 overflow-y-auto mb-3">
                    {aiDraft.text}
                  </div>
                  <p className="text-[10px] text-amber-400">⚠️ AI 초안을 그대로 제출하면 감점! 반드시 검수 후 수정하세요.</p>
                </div>
              )}

            <div className="node-card p-5">
              <h3 className="font-bold text-sm mb-3">과제 작성</h3>
              <div>
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                      ✅
                    </div>
                    <h3 className="text-xl font-bold mb-2">제출 완료!</h3>
                    <p className="text-neutral-500 mb-4">
                      AI 자동 검수가 진행되었습니다. 검수 결과 탭에서 확인하세요.
                    </p>
                    <button className="btn-secondary-dark px-4 py-1.5 text-xs" onClick={() => { setSubmitted(false); setReviewResult(null); }}>
                      다시 작성하기
                    </button>
                  </div>
                ) : (
                  <>
                    <textarea
                      className="glass-input w-full h-64 px-4 py-3 text-sm font-mono resize-none"
                      placeholder={`여기에 과제를 작성하세요...\n\n예시 프롬프트 탭에서 "AI로 실행" 버튼을 누르면\n실제 Gemini가 초안을 생성하고 자동으로 여기에 채워집니다.\n\n⚠️ AI 초안을 그대로 제출하면 감점!\n반드시 검수하고 수정한 후 제출하세요.`}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-secondary-dark">{content.length}자</span>
                      <div className="flex gap-2">
                        <button className="btn-secondary-dark px-4 py-1.5 text-xs" onClick={handleReview} disabled={!content.trim()}>자동 검수</button>
                        <button className="btn-primary-dark px-5 py-1.5 text-sm" onClick={handleSubmit} disabled={!content.trim()}>제출하기</button>
                      </div>
                    </div>

                    {/* 인라인 검수 미리보기 */}
                    {reviewResult && !submitted && (
                      <div className={`mt-4 p-4 rounded-lg border ${reviewResult.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">
                            {reviewResult.passed ? '✅ 자동 검수 통과' : '❌ 위반 사항 발견'}
                          </span>
                          <span className="text-sm font-bold">점수: {reviewResult.score}/100</span>
                        </div>
                        {reviewResult.violations.length > 0 && (
                          <ul className="space-y-1">
                            {reviewResult.violations.map((v, i) => (
                              <li key={i} className="text-sm flex items-center gap-2">
                                <Badge className={
                                  v.severity === 'critical' ? 'bg-red-500 text-white' :
                                  v.severity === 'error' ? 'bg-orange-500 text-white' :
                                  'bg-yellow-500 text-white'
                                }>
                                  {v.severity === 'critical' ? '심각' : v.severity === 'error' ? '오류' : '경고'}
                                </Badge>
                                <span>{v.message}</span>
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
            </div>
          </TabsContent>

          {/* AI 검수 결과 탭 */}
          <TabsContent value="review">
            {reviewResult ? (
              <div className="space-y-4">
                <div className="glass-panel p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm">Evaluator 자동 검수 결과</h3>
                    <span className={`text-3xl font-black ${reviewResult.score >= 80 ? 'text-green-400' : reviewResult.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{reviewResult.score}점</span>
                  </div>
                  <div className={`p-3 rounded-lg ${reviewResult.passed ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                    <p className="text-sm font-semibold">{reviewResult.passed ? '✅ 기본 검수 통과' : '❌ 수정이 필요합니다'}</p>
                    <p className="text-xs text-secondary-dark mt-1">{reviewResult.summary}</p>
                  </div>
                </div>

                {reviewResult.violations.length > 0 && (
                  <div className="glass-panel p-5">
                    <h4 className="font-bold text-sm mb-3">위반 사항 상세</h4>
                    <div className="space-y-2">
                      {reviewResult.violations.map((v, i) => (
                        <div key={i} className="flex items-start gap-2 glass-panel-light p-3 rounded-lg">
                          <Badge className={`shrink-0 text-[10px] ${v.severity === 'critical' ? 'bg-red-500/20 text-red-400' : v.severity === 'error' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {v.severity === 'critical' ? '심각' : v.severity === 'error' ? '오류' : '경고'}
                          </Badge>
                          <div>
                            <p className="text-xs">{v.message}</p>
                            {v.found && <p className="text-[10px] text-secondary-dark mt-0.5">발견: <code className="bg-red-500/20 px-1 rounded text-red-300">{v.found}</code></p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="glass-panel p-5 border-purple-500/20">
                  <h4 className="font-bold text-sm text-purple-400 mb-2">Coach 피드백</h4>
                  <ul className="space-y-1.5 text-xs text-secondary-dark">
                    {reviewResult.violations.filter(v => v.severity === 'critical').length > 0 && <li>🚨 미운영 서비스 언급 감지. Hub→인천공항 배송만 가능합니다.</li>}
                    {reviewResult.violations.filter(v => v.rule === 'forbidden_phrase').length > 0 && <li>📝 금지 표현을 대체 표현으로 바꾸세요. (&quot;저렴한&quot; → &quot;스마트한 여행 파트너&quot;)</li>}
                    {reviewResult.violations.filter(v => v.rule === 'required_mention').length > 0 && <li>🔗 bee-liber.com을 반드시 포함하세요.</li>}
                    {reviewResult.passed && <li>🎉 검수 통과! 운영자 검토 후 최종 판정됩니다.</li>}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="node-card p-12 text-center text-secondary-dark text-sm">
                실습 공간에서 과제를 작성하고 제출하면 AI 검수 결과가 여기에 표시됩니다.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
