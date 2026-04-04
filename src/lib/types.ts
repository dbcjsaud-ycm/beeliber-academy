export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type WorkspaceDocument = {
  id: string;
  user_id: string;
  track_slug: string;
  lesson_slug: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  current_version_no: number;
  current_version_id: string | null;
  created_at: string;
  updated_at: string;
};

export type WorkspaceDocumentVersion = {
  id: string;
  document_id: string;
  user_id: string;
  version_no: number;
  prompt_text: string;
  input_payload: Json;
  output_payload: Json;
  ai_provider: string;
  ai_model: string;
  notes: string | null;
  created_at: string;
};

export type AiGenerateRequest = {
  trackSlug: string;
  lessonSlug: string;
  prompt: string;
  inputPayload?: Record<string, string>;
};

export type AiGenerateResponse = {
  ok: true;
  provider: 'openai';
  model: string;
  rawText: string;
  structured: {
    title: string;
    summary: string;
    sections: Array<{ title: string; body: string }>;
  };
};
