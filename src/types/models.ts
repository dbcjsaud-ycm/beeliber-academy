// AI 모델 타입 정의

export type ModelProvider = 'flux' | 'google' | 'openai' | 'kling' | 'elevenlabs' | 'recraft';
export type ModelType = 'image' | 'video' | 'audio' | '3d';
export type ModelTag = 'fast' | 'quality' | 'reference' | 'video' | 'audio' | 'creative';

export interface AIModel {
  id: string;
  name: string;
  provider: ModelProvider;
  type: ModelType;
  credits: { min: number; max: number };
  tags: ModelTag[];
  estimatedTime: string; // "3s", "15s", "60s"
  description?: string;
}

export type GenerationStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface GenerationRequest {
  modelId: string; // "auto" or specific model id
  prompt: string;
  negativePrompt?: string;
  references?: Array<{
    category: string;
    presetId?: string;
    customImageUrl?: string;
    weight?: number;
  }>;
  count?: number;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3';
  enhancePrompt?: boolean;
  seed?: number;
}

export interface GenerationResult {
  id: string;
  status: GenerationStatus;
  modelId: string;
  outputUrls: string[];
  creditsCost: number;
  durationMs?: number;
  error?: string;
}

// 이미지 모델 목록 (Auto 라우터가 사용)
export const IMAGE_MODELS: AIModel[] = [
  {
    id: 'auto',
    name: 'Auto',
    provider: 'google',
    type: 'image',
    credits: { min: 2, max: 30 },
    tags: ['fast', 'quality'],
    estimatedTime: '5-15s',
    description: '상황에 맞는 최적 모델 자동 선택',
  },
  {
    id: 'flux-1-fast',
    name: 'Flux 1 Fast',
    provider: 'flux',
    type: 'image',
    credits: { min: 2, max: 2 },
    tags: ['fast'],
    estimatedTime: '3s',
    description: '가장 빠른 이미지 생성',
  },
  {
    id: 'google-nano-banana-2',
    name: 'Google Nano Banana 2',
    provider: 'google',
    type: 'image',
    credits: { min: 5, max: 5 },
    tags: ['fast', 'quality'],
    estimatedTime: '5s',
    description: 'Google 경량 고속 이미지 모델',
  },
  {
    id: 'flux-2-pro',
    name: 'Flux 2 Pro',
    provider: 'flux',
    type: 'image',
    credits: { min: 15, max: 15 },
    tags: ['quality'],
    estimatedTime: '10s',
    description: '고품질 이미지 생성',
  },
  {
    id: 'seedream-5-lite',
    name: 'Seedream 5 Lite',
    provider: 'flux',
    type: 'image',
    credits: { min: 15, max: 15 },
    tags: ['quality', 'reference'],
    estimatedTime: '10s',
    description: '레퍼런스 이미지 활용에 강함',
  },
  {
    id: 'google-imagen-4',
    name: 'Google Imagen 4',
    provider: 'google',
    type: 'image',
    credits: { min: 20, max: 20 },
    tags: ['quality', 'creative'],
    estimatedTime: '15s',
    description: 'Google 최신 고품질 이미지 모델',
  },
  {
    id: 'gpt',
    name: 'GPT Image (DALL-E 3)',
    provider: 'openai',
    type: 'image',
    credits: { min: 30, max: 30 },
    tags: ['quality', 'creative'],
    estimatedTime: '20s',
    description: '복잡한 프롬프트에 강함',
  },
];

// 모델 Auto 라우터
export function resolveAutoModel(
  prompt: string,
  hasReferences: boolean
): string {
  if (hasReferences) return 'seedream-5-lite';
  if (prompt.length > 200) return 'gpt';
  return 'google-nano-banana-2';
}
