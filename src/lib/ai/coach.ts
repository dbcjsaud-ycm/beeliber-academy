import Anthropic from '@anthropic-ai/sdk';
import type { EvaluatorOutput } from './evaluator';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface CoachInput {
  evaluatorResult: EvaluatorOutput;
  submissionText: string;
  userRole: string;
  weakAreas: string[];
}

export interface CoachOutput {
  feedbackSummary: string;
  revisionGuide: string[];
  checklistItems: string[];
  nextRecommendedModules: string[];
  encouragement: string;
}

export async function runCoach(input: CoachInput): Promise<CoachOutput> {
  const violationDetails = input.evaluatorResult.violations.details.join('\n- ');

  const prompt = `당신은 Beeliber Academy의 수강생 코칭 전문가입니다.
브랜드 보이스: 경쾌함, 친근함, 간결함. 격려하되 핵심은 짚어줍니다.

## 검수 결과
- 총점: ${input.evaluatorResult.totalScore}점
- 통과 여부: ${input.evaluatorResult.shouldRequestRevision ? '수정 필요' : '통과'}
- 위반 내용:
${violationDetails ? `- ${violationDetails}` : '없음'}

## 수강생 정보
- 역할: ${input.userRole}
- 약점 영역: ${input.weakAreas.join(', ') || '없음'}

## 제출물 요약
${input.submissionText.slice(0, 500)}...

수강생에게 피드백을 JSON으로 제공하세요.
응답 형식:
{
  "feedbackSummary": "전체 피드백 요약 (2-3문장)",
  "revisionGuide": ["수정 가이드1", "수정 가이드2"],
  "checklistItems": ["재제출 전 확인할 항목1", "항목2"],
  "nextRecommendedModules": ["추천 모듈 슬러그1"],
  "encouragement": "격려 메시지 (1문장)"
}`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 768,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  try {
    const json = text.match(/\{[\s\S]*\}/)?.[0] ?? '{}';
    return JSON.parse(json) as CoachOutput;
  } catch {
    return {
      feedbackSummary: text,
      revisionGuide: [],
      checklistItems: [],
      nextRecommendedModules: [],
      encouragement: '계속 도전해보세요!',
    };
  }
}
