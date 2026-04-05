import { NextRequest, NextResponse } from "next/server";

// 이미지 생성 API (Google Gemini Imagen / OpenAI DALL-E)
export async function POST(req: NextRequest) {
  const { prompt, size = "1024x1024" } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ success: false, error: "프롬프트를 입력하세요" }, { status: 400 });
  }
  if (prompt.length > 4000) {
    return NextResponse.json({ success: false, error: "프롬프트는 4000자 이내로 입력하세요" }, { status: 400 });
  }

  const brandedPrompt = `${prompt}. Style: bright, warm tones, natural lighting, positive and joyful travel mood, yellow (#FFC700) accent color. No dark or gloomy atmosphere.`;

  // 1) Google Gemini Imagen API
  const geminiKey = process.env.GOOGLE_AI_KEY;
  if (geminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": geminiKey },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Generate an image: ${brandedPrompt}` }] }],
            generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const parts = data.candidates?.[0]?.content?.parts || [];
        const imagePart = parts.find((p: Record<string, unknown>) => p.inlineData);

        if (imagePart?.inlineData) {
          const base64 = imagePart.inlineData.data;
          const mimeType = imagePart.inlineData.mimeType || "image/png";
          const imageUrl = `data:${mimeType};base64,${base64}`;
          const textPart = parts.find((p: Record<string, unknown>) => p.text);

          return NextResponse.json({
            success: true,
            data: {
              imageUrl,
              revisedPrompt: textPart?.text || prompt,
              model: "gemini-imagen",
              provider: "google",
            },
          });
        }
      }
    } catch (e) {
      console.error("Gemini Image API error:", e);
    }
  }

  // 2) OpenAI DALL-E (키 있으면)
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${openaiKey}` },
        body: JSON.stringify({ model: "dall-e-3", prompt: brandedPrompt, n: 1, size, quality: "standard" }),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({
          success: true,
          data: {
            imageUrl: data.data?.[0]?.url || "",
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

  // 3) Gemini 텍스트로 이미지 설명 생성 (이미지 생성 실패 시 폴백)
  if (geminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": geminiKey },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `이 이미지 프롬프트를 분석하고, 어떤 이미지가 생성될지 상세하게 한국어로 설명해주세요. 또한 이 프롬프트를 개선할 수 있는 방법 3가지를 제안해주세요:\n\n"${prompt}"` }] }],
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        return NextResponse.json({
          success: true,
          data: {
            imageUrl: `https://placehold.co/1024x1024/1a1a2e/FFC700?text=Gemini+Image+Analysis&font=montserrat`,
            revisedPrompt: prompt,
            model: "gemini-analysis",
            provider: "google",
            analysis: text,
            note: "이미지 직접 생성은 준비 중입니다. 대신 프롬프트 분석과 개선안을 제공합니다.",
          },
        });
      }
    } catch (e) {
      console.error("Gemini fallback error:", e);
    }
  }

  // 4) 시뮬레이션 폴백 — Unsplash 기반 예시 이미지 (API 키 없을 때)
  const SIMULATION_IMAGES = [
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80', // 여행
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', // 해변
    'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=600&q=80', // 도시
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80', // 카페
    'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=600&q=80', // 야경
  ];
  const idx = Math.floor(Math.random() * SIMULATION_IMAGES.length);
  return NextResponse.json({
    success: true,
    isSimulation: true,
    data: {
      imageUrl: SIMULATION_IMAGES[idx],
      revisedPrompt: prompt,
      model: "simulation",
      provider: "local",
      note: "시뮬레이션 모드 — API 키 없이 예시 이미지를 표시합니다.",
    },
  });
}
