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
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
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
          return NextResponse.json({ success: true, data: { text, model: "gemini-2.5-flash", provider: "google" } });
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

  // 4) 시뮬레이션 모드 — 경고문을 본문에 섞지 않고 isSimulation 플래그로 분리
  const simulatedText = generateSimulatedResponse(prompt);
  return NextResponse.json({
    success: true,
    isSimulation: true,
    data: {
      text: simulatedText,
      model: "simulation",
      provider: "local",
    },
  });
}

/* ── 시뮬레이션 응답 생성 ─────────────────────────────────────── */
function generateSimulatedResponse(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes("광고") || p.includes("마케팅") || p.includes("카피")) {
    return `# 광고 카피 초안 (시뮬레이션)

**헤드라인 5가지:**
1. 작은 질문이 거대한 변화를 만든다
2. AI와 함께라면 아이디어가 결과물이 됩니다
3. 오늘의 프롬프트가 내일의 경쟁력
4. 복잡한 작업을 단순하게, beeliber Academy
5. 당신의 업무에 AI를 더하세요

**서브 메시지:**
마케팅부터 영상, 개발, 자동화까지 — 4개 실전 트랙으로 AI 실무 역량을 키우세요.

**CTA 3가지:**
- 지금 무료로 시작하기
- 내 AI 레벨 체크하기
- 샘플 수업 체험하기`;
  }

  if (p.includes("전략") || p.includes("기획") || p.includes("계획")) {
    return `# 전략 기획 초안 (시뮬레이션)

## 현황 분석
- 타겟: AI 도입 초보 실무자 (마케터, 기획자, 자영업자)
- 기회: 실습 기반 AI 교육 수요 증가

## 전략 3안

**전략 A — 체험 중심**
핵심: 무료 샘플 레슨으로 진입장벽 제거
채널: SNS 숏폼 + 검색광고
KPI: 샘플 수업 완료율 60%

**전략 B — 커뮤니티 중심**
핵심: 결과물 공유 → 바이럴 유도
채널: 인스타그램 + 오픈카톡
KPI: UGC 월 50건

**전략 C — B2B 중심**
핵심: 기업 내 AI 교육 프로그램
채널: 링크드인 + 직접 영업
KPI: 기업 계약 월 3건

## 추천
전략 A → 초기 인지도 확보 후 전략 B 전환`;
  }

  if (p.includes("스토리보드") || p.includes("영상") || p.includes("비디오")) {
    return `# 영상 스토리보드 초안 (시뮬레이션)

**씬 1 (0:00~0:03)**
장면: 어두운 방, 노트북 앞에 앉은 사람
텍스트: "매일 반복되는 업무..."
카메라: 클로즈업 → 줌아웃

**씬 2 (0:03~0:07)**
장면: 프롬프트 입력창에 한 줄 타이핑
텍스트: "한 줄의 질문이"
카메라: 스크린 클로즈업, 타이핑 애니메이션

**씬 3 (0:07~0:12)**
장면: 결과물이 화면에 가득 채워지며 등장
텍스트: "거대한 변화를 만듭니다"
카메라: 줌인 → 페이드

**씬 4 (0:12~0:15)**
장면: beeliber 로고 + CTA
텍스트: "지금 시작하세요"
카메라: 정지`;
  }

  if (p.includes("프롬프트") || p.includes("igo") || p.includes("설계")) {
    return `# 프롬프트 설계 초안 (시뮬레이션)

## INPUT 정의
- 필수: 타겟 고객, 핵심 메시지, 출력 형식
- 선택: 톤앤매너, 금지 표현, 참고 예시
- 예시: "30대 직장인 / AI 교육의 편리함 강조 / SNS 카드뉴스 3장"

## GENERATE 규칙
프롬프트 템플릿:
\`\`\`
역할: 당신은 {{domain}} 전문 카피라이터입니다.
타겟: {{target}}
목표: {{goal}}
톤: {{tone}}
출력: {{format}}
제약: {{constraints}}
\`\`\`

## OUTPUT 기준
- 형식: Markdown 또는 JSON
- 품질: 브랜드 가이드 준수, 금지 표현 없음
- 검수: Evaluator 자동 검수 통과 기준 score ≥ 80`;
  }

  // 기본 응답
  return `# AI 응답 초안 (시뮬레이션)

요청하신 내용을 분석하여 초안을 작성했습니다.

## 핵심 내용
입력하신 프롬프트를 바탕으로 아래와 같이 정리했습니다.

1. **첫 번째 항목**: 구체적인 실행 방안을 포함한 내용
2. **두 번째 항목**: 브랜드 가이드를 준수한 표현 방식
3. **세 번째 항목**: 검수 기준에 맞는 완성도 있는 결과물

## 개선 제안
- 타겟 독자를 더 구체적으로 명시하면 결과가 개선됩니다
- 원하는 출력 형식(표/목록/서술)을 프롬프트에 포함하세요
- 금지 표현 체크리스트를 참고하여 수정하세요

---
*이 초안은 검토 후 수정하여 사용하세요.*`;
}
