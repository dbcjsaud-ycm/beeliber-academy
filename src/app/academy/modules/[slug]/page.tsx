"use client";

import { useState, use } from "react";
import Link from "next/link";
import { MODULES, TRACKS, getAssignmentsByModule } from "@/lib/academy/data";
import { getModuleContent } from "@/lib/academy/module-content";
import { runAutoReview } from "@/lib/academy/policies";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ModuleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState<{ text: string; model: string; provider: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReview, setAiReview] = useState<ReturnType<typeof runAutoReview> | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const module = MODULES.find((m) => m.slug === slug);
  if (!module) return <div className="p-8 academy-bg text-white">모듈을 찾을 수 없습니다.</div>;

  const track = TRACKS.find((t) => t.id === module.track_id);
  const content = getModuleContent(slug);
  const assignments = getAssignmentsByModule(module.id);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleAiRun = async (promptText?: string) => {
    const p = promptText || aiPrompt;
    if (!p.trim()) return;
    setAiLoading(true); setAiResult(null); setAiReview(null);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: p }),
      });
      const data = await res.json();
      if (data.success) { setAiResult(data.data); setAiReview(runAutoReview(data.data.text)); }
    } catch (e) { console.error(e); }
    finally { setAiLoading(false); }
  };

  const DIFF_DOT: Record<string, string> = { basic: "bg-green-500", intermediate: "bg-yellow-500", advanced: "bg-red-500" };
  const DIFF_LABEL: Record<string, string> = { basic: "기초", intermediate: "중급", advanced: "고급" };

  return (
    <div className="min-h-screen academy-bg text-white">
      <header className="glass-panel-light sticky top-0 z-50 mx-4 mt-3 rounded-xl">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-2 text-sm">
          <Link href="/academy" className="text-secondary-dark hover:text-white">대시보드</Link>
          <span className="text-white/20">/</span>
          {track && (<><Link href={`/academy/${track.slug}`} className="text-secondary-dark hover:text-white">{track.title}</Link><span className="text-white/20">/</span></>)}
          <span className="font-semibold truncate">{module.title}</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* 모듈 헤더 */}
        <div className="glass-panel p-8 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-2.5 h-2.5 rounded-full ${DIFF_DOT[module.difficulty]}`} />
            <span className="text-xs text-secondary-dark">{DIFF_LABEL[module.difficulty]} · {module.estimated_minutes}분</span>
            {module.is_required && <Badge className="bg-amber-500/20 text-amber-400 text-xs">필수</Badge>}
          </div>
          <h1 className="text-2xl font-bold mb-2">{module.title}</h1>
          <p className="text-secondary-dark">{module.summary}</p>
        </div>

        {content ? (
          <Tabs defaultValue="learn" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 bg-white/5 rounded-xl p-1">
              <TabsTrigger value="learn" className="rounded-lg text-xs data-[state=active]:bg-white/10">핵심 개념</TabsTrigger>
              <TabsTrigger value="practice" className="rounded-lg text-xs data-[state=active]:bg-white/10">실습 가이드</TabsTrigger>
              <TabsTrigger value="prompts" className="rounded-lg text-xs data-[state=active]:bg-white/10">예시 프롬프트</TabsTrigger>
              <TabsTrigger value="ai-lab" className="rounded-lg text-xs data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">AI 실습</TabsTrigger>
              <TabsTrigger value="quiz" className="rounded-lg text-xs data-[state=active]:bg-white/10">퀴즈</TabsTrigger>
            </TabsList>

            {/* ── 핵심 개념 ── */}
            <TabsContent value="learn">
              <div className="space-y-4">
                {content.concepts.map((c, i) => (
                  <div key={i} className="node-card p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">{i + 1}</div>
                      <div>
                        <h3 className="font-bold mb-2">{c.title}</h3>
                        <p className="text-sm text-secondary-dark leading-relaxed">{c.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="glass-panel p-5">
                  <h4 className="font-bold mb-3 text-sm">Do & Don&apos;t</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-4">
                      <h5 className="font-semibold text-green-400 text-xs mb-2">✅ Do</h5>
                      {content.doAndDont.do.map((d, i) => <p key={i} className="text-xs text-secondary-dark mb-1">• {d}</p>)}
                    </div>
                    <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-4">
                      <h5 className="font-semibold text-red-400 text-xs mb-2">❌ Don&apos;t</h5>
                      {content.doAndDont.dont.map((d, i) => <p key={i} className="text-xs text-secondary-dark mb-1">• {d}</p>)}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ── 실습 가이드 ── */}
            <TabsContent value="practice">
              <div className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <p className="text-xs text-amber-400">아래 단계를 순서대로 따라하세요. 완료 후 과제를 제출합니다.</p>
                </div>
                {content.practiceSteps.map((s) => (
                  <div key={s.step} className="node-card p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 text-black rounded-xl flex items-center justify-center font-black text-lg shrink-0">{s.step}</div>
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">{s.title}</h3>
                        <p className="text-sm text-secondary-dark whitespace-pre-line">{s.instruction}</p>
                        {s.tip && <div className="mt-2 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3"><p className="text-xs text-blue-400">💡 {s.tip}</p></div>}
                      </div>
                    </div>
                  </div>
                ))}
                {assignments.length > 0 && (
                  <div className="glass-panel p-5">
                    <h3 className="font-bold mb-3 text-sm">실습 완료 후 과제 제출</h3>
                    {assignments.map((a) => (
                      <Link key={a.id} href={`/academy/assignments/${a.id}`}>
                        <div className="flex items-center justify-between py-2 px-3 glass-panel-light rounded-lg hover:bg-white/5 mb-2">
                          <span className="text-sm">{a.title}</span>
                          <Badge className="bg-amber-500/20 text-amber-400 text-xs">제출하기 →</Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ── 예시 프롬프트 ── */}
            <TabsContent value="prompts">
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-xs text-blue-400">프롬프트를 복사 → AI에 실행 → 결과를 검수하는 것까지가 실습입니다! &quot;AI 실습&quot; 탭에서 바로 실행할 수도 있어요.</p>
                </div>
                {content.examplePrompts.map((p, i) => (
                  <div key={i} className="node-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-sm">{p.title}</span>
                      <div className="flex gap-2">
                        <button className="btn-secondary-dark px-3 py-1 text-xs" onClick={() => { setAiPrompt(p.prompt); }}>AI 실습에 넣기</button>
                        <button className="btn-secondary-dark px-3 py-1 text-xs" onClick={() => handleCopy(p.prompt, `p-${i}`)}>
                          {copied === `p-${i}` ? "✓ 복사됨" : "복사"}
                        </button>
                      </div>
                    </div>
                    <pre className="bg-[#0a0a0c] text-green-400 p-4 rounded-xl text-xs whitespace-pre-wrap mb-3 border border-white/5">{p.prompt}</pre>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                      <p className="text-xs text-amber-400"><strong>기대 결과:</strong> {p.expected}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* ── AI 실습 (실전 결과) ── */}
            <TabsContent value="ai-lab">
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <p className="text-xs text-green-400">
                    <span className="status-dot status-dot-active mr-2" />
                    Gemini AI 연결됨 — 프롬프트를 입력하면 <strong>실제 AI가 응답</strong>합니다. 결과물은 자동으로 Evaluator 검수됩니다.
                  </p>
                </div>

                {/* 빠른 실행 버튼 */}
                {content.examplePrompts.length > 0 && (
                  <div className="glass-panel p-4">
                    <p className="text-xs text-secondary-dark mb-2">예시 프롬프트 빠른 실행</p>
                    <div className="flex flex-wrap gap-2">
                      {content.examplePrompts.map((p, i) => (
                        <button key={i} onClick={() => { setAiPrompt(p.prompt); handleAiRun(p.prompt); }}
                          className="btn-secondary-dark px-3 py-1.5 text-xs hover:border-green-500/30 hover:text-green-400">
                          ▶ {p.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 프롬프트 입력 */}
                <div className="glass-panel p-5">
                  <h3 className="font-bold text-sm mb-3">프롬프트 입력</h3>
                  <textarea
                    className="glass-input w-full h-32 px-4 py-3 text-sm resize-none"
                    placeholder="프롬프트를 입력하거나, 위 버튼으로 예시를 바로 실행하세요..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-secondary-dark">{aiPrompt.length}자</span>
                    <button className="btn-primary-dark px-6 py-2 text-sm disabled:opacity-50" onClick={() => handleAiRun()} disabled={!aiPrompt.trim() || aiLoading}>
                      {aiLoading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />생성 중...</span> : "▶ AI 실행"}
                    </button>
                  </div>
                </div>

                {/* AI 결과 */}
                {aiResult && (
                  <div className="glass-panel p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-sm">AI 결과물</h3>
                      <div className="flex gap-2">
                        <Badge className="bg-green-500/20 text-green-400 text-xs">{aiResult.provider}</Badge>
                        <Badge className="bg-blue-500/20 text-blue-400 text-xs">{aiResult.model}</Badge>
                      </div>
                    </div>
                    <div className="bg-[#0a0a0c] rounded-xl p-5 text-sm whitespace-pre-wrap leading-relaxed border border-white/5">
                      {aiResult.text}
                    </div>
                  </div>
                )}

                {/* Evaluator 자동 검수 */}
                {aiReview && (
                  <div className="glass-panel p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-sm">Evaluator 자동 검수</h3>
                      <span className={`text-2xl font-black ${aiReview.score >= 80 ? "text-green-400" : aiReview.score >= 50 ? "text-yellow-400" : "text-red-400"}`}>{aiReview.score}점</span>
                    </div>
                    <div className={`p-3 rounded-lg mb-3 ${aiReview.passed ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                      <p className="text-sm font-semibold">{aiReview.passed ? "✅ 자동 검수 통과" : "❌ 위반 사항 발견"}</p>
                      <p className="text-xs text-secondary-dark mt-1">{aiReview.summary}</p>
                    </div>
                    {aiReview.violations.length > 0 && (
                      <div className="space-y-2">
                        {aiReview.violations.map((v, i) => (
                          <div key={i} className="flex items-start gap-2 glass-panel-light p-3 rounded-lg">
                            <Badge className={`shrink-0 text-[10px] ${v.severity === "critical" ? "bg-red-500/20 text-red-400" : v.severity === "error" ? "bg-orange-500/20 text-orange-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                              {v.severity === "critical" ? "심각" : v.severity === "error" ? "오류" : "경고"}
                            </Badge>
                            <p className="text-xs">{v.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-xs text-purple-400 font-semibold mb-1">Coach 피드백</p>
                      {aiReview.passed
                        ? <p className="text-xs text-secondary-dark">잘하셨어요! 이 결과물을 과제에 활용해보세요.</p>
                        : <p className="text-xs text-secondary-dark">위반 사항을 수정한 프롬프트로 다시 실행해보세요. 금지 표현은 대체 표현으로 바꿔야 합니다.</p>
                      }
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ── 퀴즈 ── */}
            <TabsContent value="quiz">
              {content.quiz && content.quiz.length > 0 ? (
                <div className="space-y-4">
                  {content.quiz.map((q, qi) => {
                    const userAnswer = quizAnswers[qi];
                    const isCorrect = userAnswer === q.answer;
                    return (
                      <div key={qi} className={`node-card p-5 ${showQuizResults ? (isCorrect ? "!border-green-500/30" : "!border-red-500/30") : ""}`}>
                        <h4 className="font-bold mb-3 text-sm">Q{qi + 1}. {q.question}</h4>
                        <div className="space-y-2">
                          {q.options.map((opt, oi) => (
                            <button key={oi}
                              onClick={() => { if (!showQuizResults) setQuizAnswers(p => ({ ...p, [qi]: oi })); }}
                              className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                                showQuizResults
                                  ? oi === q.answer ? "bg-green-500/10 border-green-500/30 font-semibold" : userAnswer === oi ? "bg-red-500/10 border-red-500/30" : "bg-white/5 border-white/5"
                                  : userAnswer === oi ? "bg-blue-500/10 border-blue-500/30 font-semibold" : "bg-white/5 border-white/5 hover:border-white/20"
                              }`}>
                              {String.fromCharCode(65 + oi)}. {opt}
                              {showQuizResults && oi === q.answer && " ✅"}
                              {showQuizResults && userAnswer === oi && oi !== q.answer && " ❌"}
                            </button>
                          ))}
                        </div>
                        {showQuizResults && (
                          <div className={`mt-3 p-3 rounded-lg text-xs ${isCorrect ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                            <strong>{isCorrect ? "정답!" : "오답."}</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div className="text-center">
                    {!showQuizResults ? (
                      <button className="btn-primary-dark px-6 py-2 text-sm disabled:opacity-50"
                        onClick={() => setShowQuizResults(true)}
                        disabled={Object.keys(quizAnswers).length < (content.quiz?.length || 0)}>
                        {Object.keys(quizAnswers).length < (content.quiz?.length || 0)
                          ? `${Object.keys(quizAnswers).length}/${content.quiz?.length} 답변` : "결과 확인"}
                      </button>
                    ) : (
                      <div>
                        <p className="text-lg font-bold mb-2">
                          {Object.entries(quizAnswers).filter(([qi]) => quizAnswers[Number(qi)] === content.quiz![Number(qi)].answer).length}/{content.quiz?.length} 정답
                        </p>
                        <button className="btn-secondary-dark px-4 py-1.5 text-xs" onClick={() => { setQuizAnswers({}); setShowQuizResults(false); }}>다시 풀기</button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="node-card p-12 text-center text-secondary-dark">이 모듈의 퀴즈는 준비 중입니다.</div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="node-card p-12 text-center">
            <p className="text-secondary-dark mb-4">이 모듈의 학습 콘텐츠는 준비 중입니다.</p>
            {assignments.length > 0 && (
              <div className="flex justify-center gap-2">
                {assignments.map((a) => (
                  <Link key={a.id} href={`/academy/assignments/${a.id}`}>
                    <button className="btn-secondary-dark px-4 py-2 text-sm">{a.title}</button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
