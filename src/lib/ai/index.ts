// Beeliber Academy 하네스 에이전트 팀 오케스트레이터
// Planner → Generator → Evaluator → Coach

export { runPlanner } from './planner';
export type { PlannerInput, PlannerOutput } from './planner';

export { runGenerator } from './generator';
export type { GeneratorInput, GeneratorOutput } from './generator';

export { runEvaluator } from './evaluator';
export type { EvaluatorInput, EvaluatorOutput } from './evaluator';

export { runCoach } from './coach';
export type { CoachInput, CoachOutput } from './coach';

import { runEvaluator, type EvaluatorInput } from './evaluator';
import { runCoach } from './coach';

export interface ReviewAndCoachInput {
  submissionText: string;
  assignmentTitle: string;
  rubric: Record<string, number>;
  userRole: string;
  weakAreas: string[];
}

/**
 * Evaluator + Coach 병렬이 아닌 순차 실행
 * (Coach는 Evaluator 결과를 필요로 함)
 */
export async function runReviewAndCoach(input: ReviewAndCoachInput) {
  const evaluatorInput: EvaluatorInput = {
    submissionText: input.submissionText,
    assignmentTitle: input.assignmentTitle,
    rubric: input.rubric,
  };

  const evaluatorResult = await runEvaluator(evaluatorInput);

  const coachResult = await runCoach({
    evaluatorResult,
    submissionText: input.submissionText,
    userRole: input.userRole,
    weakAreas: input.weakAreas,
  });

  return { evaluatorResult, coachResult };
}
