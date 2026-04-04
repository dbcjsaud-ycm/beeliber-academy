import Anthropic from '@anthropic-ai/sdk';
import { BEELIBER_POLICY_RULES } from '@/lib/academy/policies';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface GeneratorInput {
  assignmentTitle: string;
  assignmentDescription: string;
  userRole: string;
  submissionType: 'text' | 'markdown' | 'mixed';
  additionalContext?: string;
}

export interface GeneratorOutput {
  draft: string;
  keyPoints: string[];
  selfCheckItems: string[];
}

export async function runGenerator(input: GeneratorInput): Promise<GeneratorOutput> {
  const forbiddenList = BEELIBER_POLICY_RULES.forbiddenPhrases.join(', ');
  const requiredList = BEELIBER_POLICY_RULES.requiredMentions.join(', ');

  const prompt = `당신은 Beeliber Academy의 과제 초안 생성 전문가입니다.

## 빌리버 운영 원칙 (반드시 준수)
- 현재 Phase 1 기준 운영
- 운영 서비스: Hub → 인천공항 당일 배송만 운영
- 절대 금지 서비스: 공항→호텔 배송, 호텔 픽업
- 금지 표현: ${forbiddenList}
- 필수 포함: ${requiredList}
- 예약은 반드시 bee-liber.com 기준 안내
- 브랜드 문장: "짐을 맡기는 곳이 아니라, 여행을 시작하는 곳입니다."
- 브랜드 보이스: 경쾌함, 친근함, 간결함

## 과제 정보
- 제목: ${input.assignmentTitle}
- 설명: ${input.assignmentDescription}
- 역할: ${input.userRole}
- 제출 형식: ${input.submissionType}
${input.additionalContext ? `- 추가 컨텍스트: ${input.additionalContext}` : ''}

위 조건에 맞는 과제 초안을 JSON으로 작성하세요.
응답 형식:
{
  "draft": "초안 내용 (마크다운 가능)",
  "keyPoints": ["핵심 포인트1", "핵심 포인트2"],
  "selfCheckItems": ["자체 점검 항목1", "자체 점검 항목2"]
}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  try {
    const json = text.match(/\{[\s\S]*\}/)?.[0] ?? '{}';
    return JSON.parse(json) as GeneratorOutput;
  } catch {
    return {
      draft: text,
      keyPoints: [],
      selfCheckItems: [],
    };
  }
}
