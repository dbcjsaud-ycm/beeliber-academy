import { NextRequest, NextResponse } from "next/server";

// 이미지 생성 API (OpenAI DALL-E 연동)
export async function POST(req: NextRequest) {
  const { prompt, size = "1024x1024" } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ success: false, error: "프롬프트를 입력하세요" }, { status: 400 });
  }

  // 빌리버 브랜드 가이드 자동 적용
  const brandedPrompt = `${prompt}. Style: bright, warm tones, natural lighting, positive and joyful travel mood, yellow (#FFC700) accent color. No dark or gloomy atmosphere.`;

  // OpenAI DALL-E API
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: brandedPrompt,
          n: 1,
          size,
          quality: "standard",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const imageUrl = data.data?.[0]?.url || "";
        return NextResponse.json({
          success: true,
          data: {
            imageUrl,
            revisedPrompt: data.data?.[0]?.revised_prompt || prompt,
            model: "dall-e-3",
            provider: "openai",
          },
        });
      }
    } catch (e) {
      console.error("DALL-E API error:", e);
    }
  }

  // 시뮬레이션 모드 (API 키 없을 때 — placeholder 이미지)
  const placeholderUrl = `https://placehold.co/${size.replace("x", "x")}/1a1a2e/FFC700?text=AI+Generated+Image&font=montserrat`;

  return NextResponse.json({
    success: true,
    data: {
      imageUrl: placeholderUrl,
      revisedPrompt: prompt,
      model: "simulation",
      provider: "local",
      note: "API 키를 설정하면 실제 DALL-E 이미지가 생성됩니다. .env.local에 OPENAI_API_KEY를 추가하세요.",
    },
  });
}
