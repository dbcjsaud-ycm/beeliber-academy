"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { runAutoReview } from "@/lib/academy/policies";

type Mode = "text" | "image";

const EXAMPLE_PROMPTS = {
  text: [
    { label: "서비스 소개문", prompt: "빌리버 서비스를 외국인 여행자 대상으로 200자 이내로 소개해주세요. Active 모드(경쾌하고 친근하게) 톤으로 작성하고, 운영 시간과 예약 방법을 포함해주세요." },
    { label: "금지표현 검수 연습", prompt: "아래 문장에서 빌리버 금지 표현을 찾고 대체해주세요:\n\n'빌리버는 저렴한 택배 서비스로 호텔에서 공항까지 무거운 짐을 쉽게 배송해드립니다. AI 기반 솔루션으로 할인된 가격에 이용하세요.'" },
    { label: "마케팅 전략 3안", prompt: "빌리버 인스타그램 팔로워를 3개월 내 1,000명으로 성장시키는 마케팅 전략 3안을 제시해주세요. 각 안에 장단점, 예상 비용, 실현 가능성을 포함해주세요." },
    { label: "스레드 게시물 5개", prompt: "빌리버 서비스를 소개하는 인스타그램 스레드 게시물 5개를 작성해주세요. 각 150자 이내, Active 모드, 마지막에 bee-liber.com CTA 포함." },
    { label: "다국어 카피 (영/중/일)", prompt: "빌리버 라스트데이 배송 서비스를 영어, 繁體中文, 일본어로 각각 소개하는 짧은 카피(50자 이내)를 작성해주세요. 톤은 각 문화에 맞게 조절하되 핵심 메시지는 동일하게." },
  ],
  image: [
    { label: "빈손 여행자", prompt: "A happy young Asian tourist walking through a bright Seoul street with empty hands, no luggage, warm golden hour lighting, travel lifestyle photography, candid shot, warm tones" },
    { label: "Hub 지점 분위기", prompt: "A modern clean luggage storage counter in a bright Korean neighborhood shop, warm interior lighting, wooden shelves with colorful suitcases neatly organized, welcoming atmosphere" },
    { label: "카드뉴스 배경", prompt: "Minimalist abstract background with soft yellow gradient, subtle geometric shapes, clean modern design, warm tones, perfect for text overlay" },
    { label: "공항 수령 장면", prompt: "A smiling tourist receiving their luggage at Incheon airport pickup counter, bright modern airport interior, clean commercial lighting, relieved and happy expression" },
    { label: "캐리어 POV", prompt: "First person view of a rolling suitcase wheel on a clean Seoul sidewalk, cherry blossoms visible, warm spring sunlight, cinematic travel mood, shallow depth of field" },
  ],
};

export default function PlaygroundPage() {
  const [mode, setMode] = useState<Mode>("text");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    text?: string;
    imageUrl?: string;
    model?: string;
    provider?: string;
    note?: string;
    revisedPrompt?: string;
  } | null>(null);
  const [reviewResult, setReviewResult] = useState<ReturnType<typeof runAutoReview> | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);
    setReviewResult(null);

    try {
      const endpoint = mode === "text" ? "/api/ai/generate" : "/api/ai/image";
      const body = mode === "text" ? { prompt } : { prompt, size: "1024x1024" };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        // 텍스트 결과물 자동 검수
        if (mode === "text" && data.data.text) {
          setReviewResult(runAutoReview(data.data.text));
        }
      }
    } catch (e) {
      console.error("Generation error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen academy-bg text-white">
      <header className="glass-panel-light sticky top-0 z-50 mx-4 mt-3 rounded-xl">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-secondary-dark hover:text-white">홈</Link>
            <span className="text-white/20">/</span>
            <span className="font-semibold">AI 플레이그라운드</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setMode("text"); setResult(null); setReviewResult(null); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${mode === "text" ? "bg-white text-black" : "bg-white/5 text-secondary-dark hover:bg-white/10"}`}
            >
              📝 텍스트 생성
            </button>
            <button
              onClick={() => { setMode("image"); setResult(null); setReviewResult(null); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${mode === "image" ? "bg-white text-black" : "bg-white/5 text-secondary-dark hover:bg-white/10"}`}
            >
              🎨 이미지 생성
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 좌측: 예시 프롬프트 */}
          <div className="lg:col-span-1">
            <div className="glass-panel p-5">
              <h3 className="font-bold mb-3 text-sm">예시 프롬프트</h3>
              <p className="text-xs text-secondary-dark mb-4">클릭하면 자동으로 입력됩니다</p>
              <div className="space-y-2">
                {EXAMPLE_PROMPTS[mode].map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(ex.prompt)}
                    className="w-full text-left glass-panel-light p-3 rounded-lg hover:border-white/20 transition-all text-xs"
                  >
                    <span className="font-semibold text-white">{ex.label}</span>
                    <p className="text-secondary-dark mt-1 line-clamp-2">{ex.prompt}</p>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-secondary-dark">
                  💡 <strong className="text-white">팁:</strong> 예시를 기반으로 수정하면서 프롬프트 작성법을 익히세요.
                  AI 결과물은 반드시 Evaluator 관점에서 검수하세요!
                </p>
              </div>
            </div>
          </div>

          {/* 우측: 입력 + 결과 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 프롬프트 입력 */}
            <div className="glass-panel p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">
                  {mode === "text" ? "📝 프롬프트 입력" : "🎨 이미지 프롬프트 입력"}
                </h3>
                <Badge className={`text-xs ${mode === "text" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"}`}>
                  {mode === "text" ? "텍스트 모드" : "이미지 모드"}
                </Badge>
              </div>
              <textarea
                className="glass-input w-full h-32 px-4 py-3 text-sm resize-none"
                placeholder={mode === "text"
                  ? "빌리버 관련 프롬프트를 입력하세요...\n예: 빌리버 서비스를 소개하는 SNS 게시물을 작성해주세요."
                  : "이미지 프롬프트를 영어로 입력하세요...\n예: A happy tourist walking through Seoul with no luggage, warm tones"
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-secondary-dark">{prompt.length}자</span>
                <button
                  className="btn-primary-dark px-6 py-2 text-sm disabled:opacity-50"
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      생성 중...
                    </span>
                  ) : mode === "text" ? "텍스트 생성" : "이미지 생성"}
                </button>
              </div>
            </div>

            {/* 결과 */}
            {result && (
              <div className="glass-panel p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm">결과물</h3>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white/5 text-secondary-dark text-xs">
                      {result.provider === "local" ? "시뮬레이션" : result.provider}
                    </Badge>
                    {result.model && (
                      <Badge className="bg-blue-500/20 text-blue-400 text-xs">{result.model}</Badge>
                    )}
                  </div>
                </div>

                {/* 텍스트 결과 */}
                {result.text && (
                  <div className="bg-[#0f1012] rounded-xl p-5 text-sm whitespace-pre-wrap leading-relaxed border border-white/5">
                    {result.text}
                  </div>
                )}

                {/* 이미지 결과 */}
                {result.imageUrl && (
                  <div className="space-y-3">
                    <div className="rounded-xl overflow-hidden border border-white/10">
                      <img
                        src={result.imageUrl}
                        alt="AI Generated"
                        className="w-full"
                      />
                    </div>
                    {result.revisedPrompt && result.revisedPrompt !== prompt && (
                      <div className="glass-panel-light p-3 rounded-lg">
                        <p className="text-xs text-secondary-dark">
                          <strong className="text-white">수정된 프롬프트:</strong> {result.revisedPrompt}
                        </p>
                      </div>
                    )}
                    {result.note && (
                      <p className="text-xs text-amber-400">{result.note}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Evaluator 자동 검수 (텍스트 모드) */}
            {reviewResult && (
              <div className="glass-panel p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm">Evaluator 자동 검수</h3>
                  <span className={`text-2xl font-black ${reviewResult.score >= 80 ? "text-green-400" : reviewResult.score >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                    {reviewResult.score}점
                  </span>
                </div>

                <div className={`p-3 rounded-lg mb-3 ${reviewResult.passed ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                  <p className="text-sm font-semibold">
                    {reviewResult.passed ? "✅ 자동 검수 통과" : "❌ 위반 사항 발견"}
                  </p>
                  <p className="text-xs text-secondary-dark mt-1">{reviewResult.summary}</p>
                </div>

                {reviewResult.violations.length > 0 && (
                  <div className="space-y-2">
                    {reviewResult.violations.map((v, i) => (
                      <div key={i} className="flex items-start gap-2 glass-panel-light p-3 rounded-lg">
                        <Badge className={`shrink-0 text-[10px] ${
                          v.severity === "critical" ? "bg-red-500/20 text-red-400" :
                          v.severity === "error" ? "bg-orange-500/20 text-orange-400" :
                          "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {v.severity === "critical" ? "심각" : v.severity === "error" ? "오류" : "경고"}
                        </Badge>
                        <div>
                          <p className="text-xs">{v.message}</p>
                          {v.found && (
                            <p className="text-[10px] text-secondary-dark mt-0.5">
                              발견: <code className="bg-red-500/20 px-1 rounded text-red-300">{v.found}</code>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Coach 피드백 */}
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-xs font-semibold text-purple-400 mb-2">Coach 피드백</p>
                  <ul className="text-xs text-secondary-dark space-y-1">
                    {!reviewResult.passed && <li>• 위반 사항을 수정한 후 다시 생성해보세요</li>}
                    {reviewResult.violations.some(v => v.rule === "forbidden_phrase") && (
                      <li>• 금지 표현을 대체 표현으로 바꿔보세요 (예: &quot;저렴한&quot; → &quot;스마트한 여행 파트너&quot;)</li>
                    )}
                    {reviewResult.violations.some(v => v.rule === "required_mention") && (
                      <li>• 예약 안내 시 bee-liber.com을 반드시 포함하세요</li>
                    )}
                    {reviewResult.passed && <li>• 잘하셨어요! 이 결과물을 과제에 활용해보세요</li>}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
