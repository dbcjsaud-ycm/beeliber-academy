// 브랜드/정책 자동 검수 엔진 (Evaluator)

export const BEELIBER_POLICY_RULES = {
  forbiddenPhrases: [
    '저렴한',
    '싼',
    '할인',
    '힘들다',
    '무겁다',
    '택배',
    '물류',
    'AI 기반 솔루션',
    '호텔 픽업',
    '공항→호텔 배송',
    '공항-호텔 배송',
    'airport to hotel',
    'hotel pickup',
  ],
  requiredMentions: [
    'bee-liber.com',
  ],
  forbiddenServices: [
    '공항→호텔 배송',
    '공항-호텔 배송',
    '호텔 픽업',
    'airport to hotel',
    'hotel pickup',
  ],
};

// 하위 호환용 alias
export const POLICY_RULES = {
  forbiddenPhrases: BEELIBER_POLICY_RULES.forbiddenPhrases,
  requiredMentions: BEELIBER_POLICY_RULES.requiredMentions,
  forbiddenServices: BEELIBER_POLICY_RULES.forbiddenServices,
};

export interface ReviewResult {
  score: number;
  violations: Violation[];
  passed: boolean;
  summary: string;
}

export interface Violation {
  rule: string;
  severity: 'critical' | 'error' | 'warning';
  message: string;
  found: string;
}

export function runAutoReview(text: string): ReviewResult {
  const violations: Violation[] = [];

  for (const phrase of BEELIBER_POLICY_RULES.forbiddenPhrases) {
    if (text.includes(phrase)) {
      const isCritical = BEELIBER_POLICY_RULES.forbiddenServices.some(
        s => phrase.includes(s) || s.includes(phrase)
      );
      violations.push({
        rule: 'forbidden_phrase',
        severity: isCritical ? 'critical' : 'error',
        message: `금지 표현 "${phrase}"이(가) 포함되어 있습니다.`,
        found: phrase,
      });
    }
  }

  for (const required of BEELIBER_POLICY_RULES.requiredMentions) {
    if (!text.includes(required)) {
      violations.push({
        rule: 'required_mention',
        severity: 'warning',
        message: `필수 언급 "${required}"이(가) 누락되었습니다.`,
        found: '',
      });
    }
  }

  const criticalCount = violations.filter(v => v.severity === 'critical').length;
  const errorCount = violations.filter(v => v.severity === 'error').length;
  const warningCount = violations.filter(v => v.severity === 'warning').length;

  const score = Math.max(0, 100 - criticalCount * 30 - errorCount * 15 - warningCount * 5);
  const passed = criticalCount === 0 && errorCount === 0;

  return {
    score,
    violations,
    passed,
    summary: violations.length === 0
      ? '자동 검수를 통과했습니다.'
      : `${violations.length}건의 위반이 발견되었습니다. (심각: ${criticalCount}, 오류: ${errorCount}, 경고: ${warningCount})`,
  };
}
