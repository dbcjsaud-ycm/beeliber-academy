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
    provider: 'flux',
    type: 'image',
    credits: { min: 5, max: 150 },
    tags: ['fast', 'quality'],
    estimatedTime: '5-15s',
    description: '상황에 맞는 최적 모델 자동 선택',
  },
  {
    id: 'flux-1-fast',
    name: 'Flux 1 Fast',
    provider: 'flux',
    type: 'image',
    credits: { min: 5, max: 5 },
    tags: ['fast'],
    estimatedTime: '3s',
    description: '가장 빠른 이미지 생성',
  },
  {
    id: 'flux-2-pro',
    name: 'Flux 2 Pro',
    provider: 'flux',
    type: 'image',
    credits: { min: 50, max: 50 },
    tags: ['quality'],
    estimatedTime: '10s',
    description: '고품질 이미지 생성',
  },
  {
    id: 'google-imagen-4',
    name: 'Google Imagen 4',
    provider: 'google',
    type: 'image',
    credits: { min: 100, max: 100 },
    tags: ['quality', 'creative'],
    estimatedTime: '15s',
    description: 'Google 최신 이미지 모델',
  },
  {
    id: 'gpt',
    name: 'GPT Image (DALL-E 3)',
    provider: 'openai',
    type: 'image',
    credits: { min: 150, max: 150 },
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
  return 'flux-2-pro';
}
