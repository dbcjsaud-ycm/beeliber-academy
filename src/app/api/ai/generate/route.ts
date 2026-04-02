import { NextRequest, NextResponse } from "next/server";

// 텍스트 생성 API (Google Gemini / Claude / OpenAI 연동)
export async function POST(req: NextRequest) {
  const { prompt, model = "auto" } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ success: false, error: "프롬프트를 입력하세요" }, { status: 400 });
  }
  if (prompt.length > 4000) {
    return NextResponse.json({ success: false, error: "프롬프트는 4000자 이내로 입력하세요" }, { status: 400 });
  }

  const systemPrompt = `당신은 빌리버(beeliber) 교육 플랫폼의 AI 어시스턴트입니다.

빌리버 핵심 정보:
- 서비스: 여행자 짐 보관 + Hub→인천공항 당일 배송
- Hub 6개 지점: 연남/이태원/동대문/마포/홍대바오/명동본점
- 파트너 33개+ 지점: 보관 전용
- 운영 시간: 09:00~21:00
- 예약: bee-liber.com
- 브랜드 보이스: 경쾌함, 친근함, 간결함, 담담함
- 마무리 시그니처: "가벼운 여행 되세요! 🐝"

절대 금지 표현: 저렴한, 싼, 할인, 힘들다, 무겁다, 택배, 물류, AI기반솔루션, 호텔픽업, 공항→호텔배송
절대 금지 서비스: 공항→호텔 배송, 호텔 픽업 (Phase 1에서 미운영)

반드시 위 규칙을 준수하면서 요청에 응답하세요. 한국어로 답변하세요.`;

  // 1) Google Gemini API 시도
  const geminiKey = process.env.GOOGLE_AI_KEY;
  if (geminiKey && (model === "auto" || model === "gemini")) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": geminiKey },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: `${systemPrompt}\n\n---\n\n사용자 요청:\n${prompt}` }] }
            ],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if (text) {
          return NextResponse.json({
            success: true,
            data: { text, model: "gemini-2.0-flash", provider: "google" },
          });
        }
      }
    } catch (e) {
      console.error("Gemini API error:", e);
    }
  }

  // 2) Anthropic Claude API 시도
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey && (model === "auto" || model === "claude")) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          system: systemPrompt,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.content?.[0]?.text || "";
        return NextResponse.json({
          success: true,
          data: { text, model: "claude-sonnet", provider: "anthropic" },
        });
      }
    } catch (e) {
      console.error("Anthropic API error:", e);
    }
  }

  // 3) OpenAI API 시도
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey && (model === "auto" || model === "openai")) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          max_tokens: 2048,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content || "";
        return NextResponse.json({
          success: true,
          data: { text, model: "gpt-4o-mini", provider: "openai" },
        });
      }
    } catch (e) {
      console.error("OpenAI API error:", e);
    }
  }

  // 4) 시뮬레이션 모드
  return NextResponse.json({
    success: true,
    data: {
      text: generateSimulatedResponse(prompt),
      model: "simulation",
      provider: "local",
    },
  });
}

function generateSimulatedResponse(prompt: string): string {
  const lower = prompt.toLowerCase();

  if (lower.includes("소개") || lower.includes("서비스")) {
    return `✈️ 빌리버와 함께라면, 여행의 무게가 사라집니다.

빌리버는 짐을 맡기는 곳이 아니라, 여행을 시작하는 곳입니다.

📦 보관 서비스 — 서울 전역 33개+ 지점
🚀 당일 배송 — Hub 지점(09:00~13:00) → 인천공항(16:00~21:00)
🔒 안심 보험 — 단 2,000원으로 최대 50만원 보상

📱 bee-liber.com에서 지금 바로 예약하세요!
가벼운 여행 되세요! 🐝

---
⚠️ [시뮬레이션 모드] .env.local에 GOOGLE_AI_KEY를 추가하면 Gemini가 실제 응답합니다.`;
  }

  if (lower.includes("금지") || lower.includes("검수") || lower.includes("찾")) {
    return `📋 빌리버 금지 표현 검수 리포트

❌ "저렴한" → ✅ "스마트한 여행 파트너"
❌ "택배" → ✅ "여행 자유 배달 서비스"
❌ "호텔 픽업" → ✅ (절대 금지 - 미운영)
❌ "공항→호텔" → ✅ (절대 금지 - 미운영)
❌ "무거운" → ✅ (삭제 또는 "가벼운"으로 대체)
❌ "AI 기반" → ✅ (삭제)

✅ 필수: bee-liber.com / 09:00~21:00 / "가벼운 여행 되세요! 🐝"

---
⚠️ [시뮬레이션 모드] API 키 설정 시 실제 AI 검수가 가능합니다.`;
  }

  return `📝 AI 응답 (시뮬레이션)

입력하신 프롬프트에 대한 결과입니다.

빌리버 브랜드 가이드를 준수하면서:
• 금지 표현 10개 피하기
• bee-liber.com 예약 안내 포함
• Hub→인천공항 배송만 언급
• 운영 시간 09:00~21:00 명시

이 결과물을 받은 후 Evaluator 관점에서 검수하세요!

---
⚠️ [시뮬레이션 모드] 실제 AI 응답을 원하시면:
.env.local에 GOOGLE_AI_KEY=사장님키 추가 후 서버 재시작`;
}
