// Academy 타입 정의

export type UserRole = 'student' | 'marketer' | 'developer' | 'automation' | 'reviewer' | 'admin';
export type SubmissionStatus = 'draft' | 'submitted' | 'ai_reviewed' | 'revision_requested' | 'resubmitted' | 'passed' | 'failed';
export type Difficulty = 'basic' | 'intermediate' | 'advanced';
export type SubmissionType = 'text' | 'markdown' | 'json' | 'image' | 'video' | 'mixed';

export interface AcademyUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  team?: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface Track {
  id: string;
  slug: string;
  title: string;
  description: string;
  order_no: number;
  moduleCount?: number;
  modules?: Module[];
}

export interface Module {
  id: string;
  track_id: string;
  slug: string;
  title: string;
  summary: string;
  difficulty: Difficulty;
  estimated_minutes: number;
  is_required: boolean;
  order_no: number;
  assignments?: Assignment[];
  resources?: ModuleResource[];
}

export interface ModuleResource {
  id: string;
  module_id: string;
  resource_type: string;
  title: string;
  content_md?: string;
  external_url?: string;
}

export interface Assignment {
  id: string;
  module_id: string;
  title: string;
  description: string;
  submission_type: SubmissionType;
  rubric: Record<string, number>;
  due_days?: number;
  is_required: boolean;
}

export interface Submission {
  id: string;
  assignment_id: string;
  user_id: string;
  version_no: number;
  content_text?: string;
  content_json?: Record<string, unknown>;
  file_urls: string[];
  status: SubmissionStatus;
  submitted_at?: string;
}

export interface AIReview {
  id: string;
  submission_id: string;
  planner_score: number;
  evaluator_score: number;
  brand_violation_count: number;
  policy_violation_count: number;
  factual_risk_count: number;
  language_violation_count: number;
  review_summary: string;
  review_detail: Record<string, unknown>;
}

export interface Feedback {
  id: string;
  submission_id: string;
  reviewer_id: string;
  feedback_text: string;
  action_items: string[];
  final_score: number;
  decision: 'pass' | 'revise' | 'fail';
}

export interface ReviewRule {
  id: string;
  rule_key: string;
  label: string;
  category: string;
  check_type: string;
  check_value: string;
  severity: string;
  message_template: string;
  is_active: boolean;
}
