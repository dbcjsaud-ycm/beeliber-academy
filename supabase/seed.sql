-- Beeliber Academy seed.sql
-- 목적: 트랙 / 모듈 / 과제 / 검수 규칙의 기본 데이터를 삽입한다.

begin;

-- =========================
-- 1) Tracks
-- =========================
insert into public.academy_tracks (slug, title, description, order_no)
values
  ('common', '공통 베이스캠프', '빌리버 브랜드, 운영 현실, 금지 표현, 기본 정책 교육', 1),
  ('tools', '핵심 기술 및 도구', 'Gemini / Opal / NotebookLM 역할 구분과 기초 실습', 2),
  ('supergems', 'Super Gems / Opal 랩', '목적형 사내 미니 앱 설계 실습', 3),
  ('multimodal', '멀티모달 생성 스쿨', '이미지, 영상, 오디오 생성과 브랜드 일관성 실습', 4),
  ('video-lab', '영상 솔루션 랩', 'Higgsfield / Freepik 기반 영상 제작 실습', 5),
  ('use-cases', '실전 활용 사례', '콘텐츠 제작, 비즈니스 효율화, 웹 서비스 개발 사례', 6),
  ('optimization', '최적화 전략', 'SEO/GEO, 프롬프트 구조, 하네스 엔지니어링 고급 과정', 7)
on conflict (slug) do update
set
  title = excluded.title,
  description = excluded.description,
  order_no = excluded.order_no,
  updated_at = now();

-- =========================
-- 2) Modules
-- =========================
with track_map as (
  select id, slug from public.academy_tracks
)
insert into public.academy_modules (
  track_id, slug, title, summary, difficulty, estimated_minutes, is_required, order_no
)
select tm.id, v.slug, v.title, v.summary, v.difficulty::public.academy_module_difficulty, v.estimated_minutes, v.is_required, v.order_no
from track_map tm
join (
  values
    ('common', 'brand-phase1', '브랜드와 Phase 1 운영 기준', '빌리버의 현재 서비스 구조와 브랜드 기준을 고정하는 모듈', 'basic', 20, true, 1),
    ('common', 'service-flow-policy', '서비스 흐름과 운영 정책', 'Hub/Partner 차이, 운영 시간, 배송 방향, 예약 방식 학습', 'basic', 25, true, 2),
    ('common', 'forbidden-phrases', '금지 표현과 정책 위반 사례', '실수하기 쉬운 표현과 실제 운영 위반 문구를 교정하는 훈련', 'basic', 15, true, 3),

    ('tools', 'gemini-reasoning', 'Gemini 사고 엔진 사용법', '전략 설계, 비교, 추론, 기준 문서 작성 훈련', 'basic', 25, true, 1),
    ('tools', 'opal-igo-design', 'Opal Input-Generate-Output 설계', '최종 결과물을 먼저 정의하고 워크플로우를 역산 설계하는 훈련', 'intermediate', 30, true, 2),
    ('tools', 'notebooklm-knowledge-core', 'NotebookLM 지식 코어 설계', '브랜드, 정책, 레퍼런스를 지식 코어로 구조화하는 모듈', 'intermediate', 30, true, 3),

    ('supergems', 'mini-app-planning', '사내 미니 앱 기획', '목표를 자연어로 정의하고 미니 앱 구조를 설계', 'intermediate', 30, true, 1),
    ('supergems', 'planner-generator-evaluator', 'Planner / Generator / Evaluator 분리', '하네스 엔지니어링으로 역할을 나누고 검수 루프를 설계', 'advanced', 35, true, 2),

    ('multimodal', 'image-brand-assets', '브랜드 이미지 자산 제작', '브랜드 카드뉴스와 비주얼 에셋 생성 훈련', 'intermediate', 30, true, 1),
    ('multimodal', 'video-shortform-production', '숏폼 영상 제작 기본', '이미지-투-비디오, 대본, 자막 구조 학습', 'intermediate', 35, true, 2),
    ('multimodal', 'tts-audio-script', 'TTS와 교육형 오디오 제작', '시니어 매뉴얼 낭독, 발표 스크립트 음성화 훈련', 'basic', 20, true, 3),

    ('video-lab', 'higgsfield-lab', 'Higgsfield 시네마틱 랩', '카메라 무브와 시네마틱 숏폼 제작 훈련', 'advanced', 35, true, 1),
    ('video-lab', 'freepik-lab', 'Freepik 크리에이티브 랩', '모바일/웹 기반 반복 제작과 SNS 패키지 제작 훈련', 'intermediate', 30, true, 2),

    ('use-cases', 'content-production-case', '콘텐츠 제작 자동화 사례', '블로그, 광고, 카드뉴스, 숏폼 자동화 사례 적용', 'intermediate', 25, true, 1),
    ('use-cases', 'business-efficiency-case', '비즈니스 효율화 사례', '회의록, 리포트, 제안서 자동화 사례 적용', 'intermediate', 25, true, 2),
    ('use-cases', 'web-service-dev-case', '웹 서비스 개발 사례', '교육 웹 자체 기능, API, DB, 검수 플로우를 사례 기반으로 학습', 'advanced', 35, true, 3),

    ('optimization', 'seo-geo', 'SEO & GEO 최적화', '검색과 AI 인용을 동시에 고려한 콘텐츠 구조 설계', 'advanced', 30, true, 1),
    ('optimization', 'prompt-architecture', '프롬프트 구조화', 'ToT, Self-Reflection, Meta Prompting, RAG 결합 훈련', 'advanced', 35, true, 2),
    ('optimization', 'harness-engineering-ops', '하네스 엔지니어링 운영', '검수 중심 운영, 백업 모델, 오류 복구 루프 설계', 'advanced', 35, true, 3)
) as v(track_slug, slug, title, summary, difficulty, estimated_minutes, is_required, order_no)
  on tm.slug = v.track_slug
on conflict (slug) do update
set
  track_id = excluded.track_id,
  title = excluded.title,
  summary = excluded.summary,
  difficulty = excluded.difficulty,
  estimated_minutes = excluded.estimated_minutes,
  is_required = excluded.is_required,
  order_no = excluded.order_no,
  updated_at = now();

-- =========================
-- 3) Module resources
-- =========================
with module_map as (
  select id, slug from public.academy_modules
)
insert into public.academy_module_resources (
  module_id, title, resource_type, content_markdown, order_no
)
select mm.id, v.title, v.resource_type::public.academy_resource_type, v.content_markdown, v.order_no
from module_map mm
join (
  values
    ('brand-phase1', '브랜드 핵심 요약', 'markdown', '빌리버는 짐을 맡기는 곳이 아니라, 여행을 시작하는 곳입니다. Phase 1 기준 운영 현실을 절대 벗어나지 않습니다.', 1),
    ('service-flow-policy', '운영 정책 요약', 'markdown', 'Hub → 인천공항 당일 배송 / 운영시간 09:00~21:00 / Hub 접수 09:00~13:00 / 공항 수령 16:00~21:00 / 공항→호텔 배송 미운영', 1),
    ('forbidden-phrases', '금지 표현 체크리스트', 'checklist', '- 저렴한\n- 싼\n- 할인\n- 택배\n- 물류\n- 호텔 픽업\n- 공항→호텔 배송', 1),
    ('opal-igo-design', 'I-G-O 설계 템플릿', 'template', '1. Input\n2. Generate\n3. Output\n4. 검수 노드\n5. 실패 케이스', 1),
    ('notebooklm-knowledge-core', '노트북 분리 원칙', 'markdown', '브랜드 / 운영정책 / 마케팅 사례 / 개발 레퍼런스 / 자동화 템플릿을 목적별 노트북으로 나눕니다.', 1),
    ('higgsfield-lab', '시네마틱 숏폼 실습 템플릿', 'template', '장면 목적 / 카메라 무브 / 샷 전환 / CTA 연결 / 정책 위반 여부', 1),
    ('freepik-lab', 'SNS 패키지 실습 템플릿', 'template', '표지 이미지 / 중간 이미지 / 짧은 영상 / CTA / 언어별 변주', 1),
    ('prompt-architecture', '복합 프롬프트 구조', 'markdown', '메타 프롬프팅 → Tree of Thoughts → RAG → Self-Reflection 순으로 설계합니다.', 1)
) as v(module_slug, title, resource_type, content_markdown, order_no)
  on mm.slug = v.module_slug
on conflict do nothing;

-- =========================
-- 4) Assignments
-- =========================
with module_map as (
  select id, slug from public.academy_modules
)
insert into public.academy_assignments (
  module_id, slug, title, description, submission_type, rubric, due_days, is_required, order_no
)
select
  mm.id,
  v.slug,
  v.title,
  v.description,
  v.submission_type::public.academy_submission_type,
  v.rubric::jsonb,
  v.due_days,
  v.is_required,
  v.order_no
from module_map mm
join (
  values
    ('brand-phase1', 'assignment-brand-rewrite', '잘못된 서비스 설명문 교정', '빌리버 브랜드 문장과 Phase 1 운영 현실에 맞게 잘못된 설명문을 수정한다.', 'markdown', '{"brandConsistency":30,"policyAccuracy":40,"clarity":30}', 3, true, 1),
    ('service-flow-policy', 'assignment-service-flow', '서비스 흐름 도식화', '보관과 Hub→공항 배송 플로우를 단계별로 작성한다.', 'markdown', '{"policyAccuracy":50,"structure":30,"executionReadiness":20}', 3, true, 1),
    ('forbidden-phrases', 'assignment-forbidden-phrases', '금지 표현 교정 테스트', '금지 표현 20개를 찾아 수정한다.', 'text', '{"policyAccuracy":60,"brandConsistency":40}', 2, true, 1),

    ('gemini-reasoning', 'assignment-gemini-3plans', 'Gemini로 전략 3안 생성', '홍대 라스트데이 고객용 캠페인 전략 3안을 비교 작성한다.', 'markdown', '{"reasoningQuality":40,"brandConsistency":20,"policyAccuracy":20,"clarity":20}', 4, true, 1),
    ('opal-igo-design', 'assignment-igo-blueprint', 'Opal용 I-G-O 설계서', '목적형 자동화 앱 하나를 Input-Generate-Output 구조로 설계한다.', 'json', '{"workflowDesign":40,"completeness":30,"evaluationNode":30}', 4, true, 1),
    ('notebooklm-knowledge-core', 'assignment-notebooklm-structure', 'NotebookLM 노트북 구조안', '브랜드/운영/마케팅/개발/자동화 기준의 노트북 분리 구조를 제안한다.', 'markdown', '{"knowledgeDesign":40,"reusePotential":30,"clarity":30}', 4, true, 1),

    ('mini-app-planning', 'assignment-mini-app-plan', '사내 미니 앱 기획서', '지점별 광고 카피 생성기 또는 브랜드 금지어 검수기 등 1개를 기획한다.', 'markdown', '{"problemDefinition":30,"workflowDesign":40,"businessFit":30}', 5, true, 1),
    ('planner-generator-evaluator', 'assignment-harness-roles', 'P/G/E 구조 설계', 'Planner / Generator / Evaluator 구조를 가진 자동화 과제를 설계한다.', 'json', '{"roleSeparation":40,"evaluationQuality":30,"practicality":30}', 5, true, 1),

    ('image-brand-assets', 'assignment-brand-visuals', '브랜드 카드뉴스 이미지 프롬프트', '브랜드 톤을 지키는 카드뉴스 비주얼 프롬프트 3세트를 작성한다.', 'markdown', '{"brandConsistency":40,"visualClarity":30,"executionReadiness":30}', 5, true, 1),
    ('video-shortform-production', 'assignment-shortform-prompt', '숏폼 영상 프롬프트', '라스트데이 고객용 15초 숏폼 영상 프롬프트를 설계한다.', 'markdown', '{"storyClarity":30,"brandConsistency":20,"policyAccuracy":20,"executionReadiness":30}', 5, true, 1),
    ('tts-audio-script', 'assignment-tts-script', '교육용 TTS 스크립트', '시니어 매뉴얼 또는 교육 슬라이드용 낭독 스크립트를 작성한다.', 'text', '{"clarity":40,"accessibility":30,"executionReadiness":30}', 3, true, 1),

    ('higgsfield-lab', 'assignment-higgsfield-carry-pov', 'Higgsfield 캐리어 POV 숏폼 설계', '캐리어 POV 시네마틱 숏폼을 설계하고 장면 구조를 작성한다.', 'mixed', '{"cameraDirection":30,"brandConsistency":20,"policyAccuracy":20,"executionReadiness":30}', 5, true, 1),
    ('freepik-lab', 'assignment-freepik-social-pack', 'Freepik SNS 패키지 제작안', '지점별 카드뉴스/짧은 영상/SNS 패키지 구성을 작성한다.', 'mixed', '{"packageCompleteness":40,"brandConsistency":30,"executionReadiness":30}', 5, true, 1),

    ('content-production-case', 'assignment-content-automation', '콘텐츠 제작 자동화 사례 적용', '블로그 또는 샤오홍슈 게시물 자동화 워크플로우를 제안한다.', 'markdown', '{"workflowDesign":40,"channelFit":30,"brandConsistency":30}', 5, true, 1),
    ('business-efficiency-case', 'assignment-report-automation', '리포트 자동화 사례 적용', '회의록 → 액션아이템 → 보고서 흐름을 설계한다.', 'markdown', '{"workflowDesign":40,"businessFit":30,"clarity":30}', 5, true, 1),
    ('web-service-dev-case', 'assignment-dev-fsd', '교육 웹 기능 FSD 초안', '과제 제출, AI 검수, 관리자 피드백 흐름의 FSD를 작성한다.', 'markdown', '{"productLogic":40,"policyFit":20,"completeness":40}', 7, true, 1),

    ('seo-geo', 'assignment-seo-faq', 'AI 인용형 FAQ 작성', '지점 서비스 설명 FAQ를 검색과 AI 인용에 맞게 재작성한다.', 'markdown', '{"seoStructure":30,"geoRelevance":30,"brandConsistency":20,"policyAccuracy":20}', 4, true, 1),
    ('prompt-architecture', 'assignment-composite-prompt', '복합 프롬프트 설계', 'ToT + RAG + Self-Reflection 구조의 복합 프롬프트를 설계한다.', 'markdown', '{"promptArchitecture":50,"evidenceDesign":20,"evaluationLoop":30}', 5, true, 1),
    ('harness-engineering-ops', 'assignment-ops-recovery-plan', '운영 통제 플랜 작성', '한글 출력 고정, 근거 검증, 백업 모델 전환 시나리오를 포함한 운영 통제 플랜을 작성한다.', 'markdown', '{"opsControl":50,"riskHandling":30,"clarity":20}', 5, true, 1)
) as v(module_slug, slug, title, description, submission_type, rubric, due_days, is_required, order_no)
  on mm.slug = v.module_slug
on conflict (slug) do update
set
  module_id = excluded.module_id,
  title = excluded.title,
  description = excluded.description,
  submission_type = excluded.submission_type,
  rubric = excluded.rubric,
  due_days = excluded.due_days,
  is_required = excluded.is_required,
  order_no = excluded.order_no,
  updated_at = now();

-- =========================
-- 5) Review rules
-- =========================
insert into public.academy_review_rules (code, title, description, rule_type, config)
values
  (
    'FORBIDDEN_PHRASES',
    '금지 표현 탐지',
    '브랜드/정책상 사용하면 안 되는 표현을 탐지한다.',
    'policy',
    '{
      "phrases": [
        "저렴한",
        "싼",
        "할인",
        "힘들다",
        "무겁다",
        "택배",
        "물류",
        "AI 기반 솔루션",
        "호텔 픽업",
        "공항→호텔 배송",
        "공항-호텔 배송",
        "airport to hotel"
      ]
    }'
  ),
  (
    'REQUIRED_BOOKING_MENTION',
    '예약 방식 명시',
    '서비스/광고/설명문에는 bee-liber.com 예약 안내가 포함되어야 한다.',
    'brand',
    '{
      "required_phrases": [
        "bee-liber.com"
      ]
    }'
  ),
  (
    'PHASE1_POLICY_GUARD',
    'Phase 1 운영 정책 가드',
    'Hub→인천공항, Hub 접수 09:00~13:00, 공항 수령 16:00~21:00 규칙 위반을 탐지한다.',
    'policy',
    '{
      "must_not_claim": [
        "공항→호텔 배송",
        "호텔 픽업"
      ],
      "required_context_when_claiming_same_day_delivery": [
        "오전 중",
        "09:00",
        "13:00"
      ]
    }'
  ),
  (
    'KOREAN_OUTPUT_ONLY',
    '한국어 출력 고정',
    '교육 시스템 기본 출력은 한국어로 유지한다.',
    'language',
    '{
      "default_language": "ko",
      "forbid_random_english_output": true
    }'
  ),
  (
    'EVIDENCE_FIRST',
    '근거 기반 응답',
    '보고서/정책/설명문은 출처 또는 근거 확인 절차를 포함해야 한다.',
    'factual',
    '{
      "require_evidence": true,
      "require_source_layer": true
    }'
  )
on conflict (code) do update
set
  title = excluded.title,
  description = excluded.description,
  rule_type = excluded.rule_type,
  config = excluded.config,
  is_active = true,
  updated_at = now();

commit;
