import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface PlannerInput {
  userRole: string;       // marketer | developer | automation
  currentProgress: number; // 0-100
  weakAreas: string[];
  completedModules: string[];
}

export interface PlannerOutput {
  recommendedTrack: string;
  nextModules: string[];
  weeklyPlan: string;
  assignmentDifficulty: 'basic' | 'intermediate' | 'advanced';
  reasoning: string;
}

export async function runPlanner(input: PlannerInput): Promise<PlannerOutput> {
  const prompt = `당신은 Beeliber Academy의 학습 경로 설계 전문가입니다.

## 수강생 정보
- 역할: ${input.userRole}
- 진도율: ${input.currentProgress}%
- 완료한 모듈: ${input.completedModules.join(', ') || '없음'}
- 약점 영역: ${input.weakAreas.join(', ') || '없음'}

## Beeliber Phase 1 트랙 목록
1. common - 공통 베이스캠프 (필수)
2. tools - 핵심 기술 및 도구
3. supergems - Super Gems / Opal 랩
4. multimodal - 멀티모달 생성 스쿨
5. video-lab - 영상 솔루션 랩
6. use-cases - 실전 활용 사례
7. optimization - 최적화 전략

## 역할별 우선 트랙
- marketer: common → tools → multimodal → video-lab
- developer: common → tools → supergems → use-cases
- automation: common → tools → supergems → optimization

위 정보를 바탕으로 최적의 학습 계획을 JSON으로 답변하세요.
응답 형식:
{
  "recommendedTrack": "트랙 슬러그",
  "nextModules": ["모듈1", "모듈2"],
  "weeklyPlan": "이번 주 학습 계획 요약",
  "assignmentDifficulty": "basic|intermediate|advanced",
  "reasoning": "추천 이유"
}`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  try {
    const json = text.match(/\{[\s\S]*\}/)?.[0] ?? '{}';
    return JSON.parse(json) as PlannerOutput;
  } catch {
    return {
      recommendedTrack: 'common',
      nextModules: ['공통 베이스캠프'],
      weeklyPlan: '공통 베이스캠프부터 시작하세요.',
      assignmentDifficulty: 'basic',
      reasoning: text,
    };
  }
}
