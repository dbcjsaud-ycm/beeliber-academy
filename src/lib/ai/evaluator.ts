import Anthropic from '@anthropic-ai/sdk';
import { BEELIBER_POLICY_RULES, runAutoReview } from '@/lib/academy/policies';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface EvaluatorInput {
  submissionText: string;
  assignmentTitle: string;
  rubric: Record<string, number>; // { "brandConsistency": 20, ... }
}

export interface EvaluatorOutput {
  totalScore: number;
  rubricScores: Record<string, number>;
  violations: {
    brand: number;
    policy: number;
    language: number;
    factualRisk: number;
    details: string[];
  };
  shouldRequestRevision: boolean;
  summary: string;
  autoReview: ReturnType<typeof runAutoReview>;
}

export async function runEvaluator(input: EvaluatorInput): Promise<EvaluatorOutput> {
  // 1. 자동 규칙 검수 (동기)
  const autoReview = runAutoReview(input.submissionText);

  const rubricDesc = Object.entries(input.rubric)
    .map(([k, v]) => `- ${k}: ${v}점`)
    .join('\n');

  const forbiddenList = BEELIBER_POLICY_RULES.forbiddenPhrases.join(', ');

  const prompt = `당신은 Beeliber Academy의 과제 검수 전문가입니다.

## 평가 기준
${rubricDesc}

## 빌리버 금지 표현
${forbiddenList}

## 금지 서비스 (탐지 시 critical)
공항→호텔 배송, 호텔 픽업

## 제출물
과제명: ${input.assignmentTitle}
---
${input.submissionText}
---

위 제출물을 평가하고 JSON으로 결과를 반환하세요.
응답 형식:
{
  "rubricScores": { "rubricKey": score },
  "violations": {
    "brand": 위반건수(숫자),
    "policy": 위반건수(숫자),
    "language": 위반건수(숫자),
    "factualRisk": 위반건수(숫자),
    "details": ["위반내용1", "위반내용2"]
  },
  "summary": "검수 요약"
}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  let aiResult: Partial<EvaluatorOutput> = {};

  try {
    const json = text.match(/\{[\s\S]*\}/)?.[0] ?? '{}';
    aiResult = JSON.parse(json);
  } catch {
    aiResult = { summary: text };
  }

  const rubricScores = (aiResult.rubricScores as Record<string, number>) ?? {};
  const totalScore = Object.values(rubricScores).reduce((a, b) => a + b, 0);
  const violations = aiResult.violations as EvaluatorOutput['violations'] ?? {
    brand: autoReview.violations.filter(v => v.rule === 'required_mention').length,
    policy: autoReview.violations.filter(v => v.rule === 'forbidden_phrase').length,
    language: 0,
    factualRisk: 0,
    details: autoReview.violations.map(v => v.message),
  };

  const shouldRequestRevision =
    !autoReview.passed ||
    violations.brand > 0 ||
    violations.policy > 0;

  return {
    totalScore,
    rubricScores,
    violations,
    shouldRequestRevision,
    summary: aiResult.summary as string ?? autoReview.summary,
    autoReview,
  };
}
