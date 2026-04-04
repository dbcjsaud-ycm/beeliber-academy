import { BEELIBER_POLICY_RULES } from '@/lib/academy/policies';

export function reviewAiText(text: string) {
  const normalized = text.toLowerCase();
  const matched = BEELIBER_POLICY_RULES.forbiddenPhrases.filter((phrase) =>
    normalized.includes(phrase.toLowerCase())
  );

  const toneWarning = text.length > 500 ? '문장이 길어 톤이 무거워질 수 있습니다.' : null;
  const policyPassed = matched.length === 0;
  const riskScore = matched.length > 0 ? 90 : toneWarning ? 35 : 10;

  return {
    policyPassed,
    riskScore,
    checks: [
      {
        checkType: 'forbidden_service',
        result: matched.length > 0 ? 'fail' : 'pass',
        detail: matched.length > 0 ? `금지 문구 감지: ${matched.join(', ')}` : '금지 문구 없음',
      },
      {
        checkType: 'tone',
        result: toneWarning ? 'warning' : 'pass',
        detail: toneWarning || '톤 이상 없음',
      },
    ],
  };
}
