import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt, model = "auto" } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ success: false, error: "프롬프트를 입력하세요" }, { status: 400 });
  }
  if (prompt.length > 4000) {
    return NextResponse.json({ success: false, error: "프롬프트는 4000자 이내로 입력하세요" }, { status: 400 });
  }

  const systemPrompt = `당신은 교육 플랫폼의 AI 어시스턴트입니다. 사용자의 요청에 성실하게 응답하세요. 한국어로 답변하세요.`;

  // 1) Google Gemini API
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
            generationConfig: { temperature: 0.8, maxOutputTokens: 2048 },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if (text) {
          return NextResponse.json({ success: true, data: { text, model: "gemini-2.0-flash", provider: "google" } });
        }
      }
    } catch (e) {
      console.error("Gemini API error:", e);
    }
  }

  // 2) Anthropic Claude API
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
        return NextResponse.json({ success: true, data: { text, model: "claude-sonnet", provider: "anthropic" } });
      }
    } catch (e) {
      console.error("Anthropic API error:", e);
    }
  }

  // 3) OpenAI API
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
        return NextResponse.json({ success: true, data: { text, model: "gpt-4o-mini", provider: "openai" } });
      }
    } catch (e) {
      console.error("OpenAI API error:", e);
    }
  }

  // 4) 시뮬레이션 모드
  return NextResponse.json({
    success: true,
    data: {
      text: `📝 AI 응답 (시뮬레이션)\n\n입력하신 프롬프트에 대한 결과입니다.\n\n---\n⚠️ [시뮬레이션 모드] .env.local에 GOOGLE_AI_KEY를 추가하면 Gemini가 실제 응답합니다.`,
      model: "simulation",
      provider: "local",
    },
  });
}
