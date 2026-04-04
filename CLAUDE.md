@AGENTS.md

# Academy AI Lab — 작업 가이드

## 이 프로젝트가 무엇인가

단순 강의 목록이 아닌 **교수 가이드 + 실제 AI 실습 + 결과물 저장**이 한 화면에서 이어지는 실습형 교육 플랫폼이다.
사용자 경험: 교수 설명 읽기 → 프롬프트 입력 → 결과 확인 → 수정 → 저장. 이 흐름이 끊기면 안 된다.

## 기술 스택

- **Next.js 15.2.4** App Router, `src/` 구조, React 19
- **TypeScript + Tailwind CSS + shadcn/ui**
- **Supabase** (Auth, Postgres, RLS)
- AI: Gemini → Anthropic Claude → OpenAI → simulation 폴백 체인 (`/api/ai/generate`, `/api/ai/image`)

## 확정 IA (라우트 구조)

```
/                          홈 — 히어로 + 4개 세션 카드 + 실습 미리보기
/start                     입문 진입 허브
/learn/page-1              AI 처음 시작하기
/learn/page-2              AI에게 잘 물어보는 방법
/learn/page-3              글 정리 / 요약 / 쉬운 설명 받기
/learn/page-4              파일 넣고 질문하기
/tracks                    4개 세션 선택 허브
/tracks/marketing
/tracks/image-to-video
/tracks/web-app
/tracks/automation
/lab/[track]/[lesson]      공통 실습 화면 (3-panel 레이아웃)
/outputs                   결과물 저장 / 버전 관리
/assignments               과제 센터
/admin                     관리자
```

현재 구현된 라우트: `/`, `/tracks`, `/lab/[track]/[lesson]`, `/outputs`, `/assignments`, `/admin`, `/academy/*`
**미구현**: `/start`, `/learn/page-1~4`, `/tracks/{marketing,image-to-video,web-app,automation}`

## 공통 실습 화면 레이아웃 (Professor Mode AI Lab)

`/lab/[track]/[lesson]` 및 모든 실습 페이지는 이 3-panel 구조를 따른다:

```
[GuideRail 20%] | [PromptWorkspace 50%] | [OutputRail 30%]
```

### GuideRail (좌측)
- 오늘의 목표
- 교수 설명 카드 (`GuideCard`)
- 핵심 단어 쉬운 설명
- 따라하기 순서
- 자주 하는 실수

### PromptWorkspace (중앙)
- `InputFormCard` — 주제/대상/목적/톤/결과물형태 입력 필드
- `PromptChipGroup` — 클릭하면 프롬프트 자동 입력되는 예시 칩
- `PromptInputBox` — 프롬프트 에디터
- 실행 버튼
- 대화형 결과 로그

### OutputRail (우측)
- `ResultCard` (복사 / 수정 / 저장 / 제출 버튼 포함)
- `QualityCheckCard` — 목적 부합 / 너무 길지 않은가 / 빠진 요소 체크
- 저장 / 제출 버튼

### RetryActionBar (하단 고정)
더 짧게 / 더 쉽게 / 순서대로 / 초보자용으로 다시 / 표로 정리 / 핵심만 다시

### 모바일
상단: 수업 헤더 → 중단: GuideRail 아코디언 → 하단: AI 입력창 → 결과물 순차 노출

## 4개 실전 세션 — 핵심 결과물

| 세션 | 결과물 |
|------|--------|
| 마케팅 | 제목 10개, 설명 3개, CTA 5개, 해시태그 15개, 썸네일 문구 |
| 이미지 투 비디오 | 시작 이미지 프롬프트, 장면별 영상 프롬프트, 자막, 썸네일, 업로드 패키지 |
| 웹/앱 개발 | 서비스 소개, 화면 구조, 핵심 기능 목록, 사용자 흐름, 개발 작업지시서 |
| 자동화 | 반복 업무 정의, 입력/처리/결과 구조, 역할 분리, 단계별 요청문, 최종 출력 형식 |

## 입문 페이지 1~4 설계 원칙

각 페이지 공통 흐름: 교수 설명 → 예시 프롬프트 바로 실행 → 내 주제로 실습 → 결과 확인 → 수정 → 저장 → 다음 페이지

| 경로 | 핵심 목표 |
|------|-----------|
| `/learn/page-1` | AI에 한 줄 말 걸어보기, 첫 질문 공포 제거 |
| `/learn/page-2` | 다시 시키는 법 (더 짧게 / 쉽게 / 표로 / 순서대로) |
| `/learn/page-3` | 긴 글을 AI로 정리 / 요약하는 경험 |
| `/learn/page-4` | 파일(PDF/텍스트)을 넣고 질문하는 경험 |

## 컴포넌트 체계

```
components/
  layout/
    SiteHeader.tsx         로고 + 현재 단계 + 세션 이동 + 로그인
    SidebarProgress.tsx    입문 페이지 1~4 진행률
  academy/
    HeroSection.tsx
    TrackCard.tsx          한 줄 설명 + 결과물 예시 3개 + 난이도 + CTA
    LearningPath.tsx
    OutputPreviewGrid.tsx
  lab/
    GuideRail.tsx          ← 아직 미구현
    GuideCard.tsx          ← 아직 미구현
    LessonHeader.tsx       breadcrumb + 제목 + outcome badges
    PromptWorkspace.tsx    ← 부분 구현 (LessonWorkspace.tsx 참고)
    PromptInputBox.tsx
    PromptChipGroup.tsx
    InputFormCard.tsx
    OutputRail.tsx         ← 아직 미구현
    ResultCard.tsx
    QualityCheckCard.tsx   ← 아직 미구현
    RetryActionBar.tsx     ← 아직 미구현
```

## 데이터 레이어

- `src/lib/academy-data.ts` — 4개 트랙 + 레슨 정의 (현재 구현됨)
- `src/lib/academy/data.ts` — Track/Module/Assignment 시드 데이터
- `src/lib/academy/module-content.ts` — 모듈별 학습 콘텐츠
- 입문 페이지용 데이터는 `src/lib/lesson-data.ts`로 분리 예정
- AI 호출: `/api/ai/generate` (텍스트), `/api/ai/image` (이미지)

## 검수 엔진

- `src/lib/academy/policies.ts` — `POLICY_RULES` (금지어/필수언급 현재 비어있음)
- `runAutoReview(text)` → `{ score, violations, passed, summary }`
- 결과물 생성 후 자동 검수 → QualityCheckCard에 표시

## 커리큘럼 콘텐츠 방향 (통합 문서화 마스터 기준)

### 핵심 교수법 원칙
- **입력(Input) → 생성(Generate) → 출력(Output)** 노드형 사고로 모든 실습을 구성한다
- 성공 사례만 보여주지 말고 **실수 교육**도 포함: 캐릭터 일관성 붕괴, 출력 형식 누락, 9:16 비율 누락 등
- 초보자에게는 "한 줄 지시로 결과가 나오는 경험"을 먼저, 중급 이상에게는 노드 구조 해부

### 실전 세션 콘텐츠 상세

**마케팅 세션**
- Super Gems/Opal 개념: Classic Gems → Super Gems → Opal 노드형 워크플로우 순서로 설명
- 소셜 SEO: SNS 유입 → 블로그/웹사이트 심화 소비 연결 전략
- GEO(생성 AI SEO): 명확한 결론, 발행 정보, FAQ, 스키마 마크업 → AI 인용 유도

**이미지 투 비디오 세션**
- 핵심 원칙: 텍스트로 바로 영상 만들기 ❌ → **기준 이미지 먼저 생성 → 첫 프레임으로 고정** ✅
- 파이프라인: 아이디어 입력 → 대본/키워드 → 이미지 프롬프트 → 영상 프롬프트 → Image-to-Video → TTS/편집
- 캐릭터 일관성: 레퍼런스 이미지 첨부, 변하면 안 되는 특징(종/색/얼굴비율/체형) 명시

**자동화 세션**
- 구글 워크스페이스 자동화: Docs(보고서) / Sheets(데이터 구조화) / Slides(발표자료) / Gmail(문의 분류)
- 고급 프롬프팅 기법 (실습으로 가르칠 것):
  | 기법 | 한 줄 설명 |
  |------|-----------|
  | Tree of Thoughts | AI가 여러 전략을 동시에 비교하게 만들기 |
  | Self-Reflection | 초안 → AI 자기비평 → 수정의 2단계 품질 향상 |
  | Meta-Prompting | 좋은 질문을 AI가 대신 만들게 하기 |
  | RAG | 내 자료를 연결해 환각 줄이기 |

**공통 모듈 (세션 전 공통 기초)**
- NotebookLM: 내 자료를 지식 소스로 연결 → 일반론 아닌 맞춤형 결과물 생성
- 실수 방지 교육 파트: 의도적으로 실패 조건을 보여주는 커리큘럼 포함

### module-content.ts 작성 규칙
모든 모듈 콘텐츠는 아래 구조를 따른다:
```ts
{
  concepts: [...],   // 개념 설명 (초보자도 이해하는 쉬운 언어)
  steps: [...],      // 단계별 실습 (클릭하면 프롬프트 자동 입력)
  prompts: [...],    // 예시 프롬프트 칩
  mistakes: [...],   // 자주 하는 실수 (실수 교육)
  qualityChecks: [...] // 결과물 체크 기준
}
```

---

## Pikaso Clone — 이미지/영상 생성 워크스페이스 개발 설계

> 원문: `개발자_작업지시서_원문정리본.md` (4단계 기술 설계)
> 적용 범위: `/academy/workflow-canvas` 이미지/영상 실습 탭, `/lab/image-to-video/` 계열 실습 페이지

### 프로젝트 폴더 구조

```
pikaso-clone/
├── app/
│   ├── spaces/[id]/page.tsx        # 무한 캔버스 스페이스
│   ├── generate/
│   │   ├── image/page.tsx          # 이미지 생성기
│   │   ├── video/page.tsx          # 동영상 생성기
│   │   ├── audio/page.tsx          # 오디오 생성기 (TTS/Music/SFX)
│   │   └── 3d/page.tsx             # 3D 가상 장면
│   └── api/
│       ├── generate/image|video|audio|3d|inpaint|outpaint|relight|camera|upscale/route.ts
│       ├── generate/[id]/status    # 생성 상태 폴링
│       ├── models/route.ts
│       ├── references/route.ts
│       ├── credits/route.ts
│       ├── spaces/[id]/route.ts
│       └── collaborate/route.ts    # WebSocket 실시간 협업
├── components/
│   ├── canvas/
│   │   ├── InfiniteCanvas.tsx      # 캔버스 코어 (줌/팬/선택/렌더링)
│   │   ├── CanvasToolbar.tsx       # 좌측 플로팅 도구바
│   │   ├── ContextActionBar.tsx    # 선택 시 상단 액션바
│   │   ├── MiniMap.tsx
│   │   ├── PageManager.tsx
│   │   └── elements/               # ImageElement, TextElement, VideoElement, StickyNote, GroupElement
│   ├── editor/
│   │   ├── InpaintingPanel.tsx     # 브러시 마스크 → 바이너리 추출 → API
│   │   ├── OutpaintingPanel.tsx    # 상하좌우 bounds 확장
│   │   ├── CameraChangePanel.tsx   # 시점 변경 후보 생성
│   │   ├── RelightPanel.tsx        # 광원 재배치
│   │   └── AdjustPanel.tsx         # 밝기/대비/채도
│   └── generate/
│       ├── ModelSelector.tsx       # Auto / 다중 / 모델 브라우저
│       ├── ReferenceSystem.tsx     # 레퍼런스 최대 8개 조합
│       ├── PromptInput.tsx         # @ 인라인 레퍼런스 지원
│       └── GenerateButton.tsx      # 크레딧 표시 포함
├── lib/
│   ├── ai/
│   │   ├── model-router.ts         # Auto 선택 + BullMQ 큐 + 폴백
│   │   ├── providers/              # replicate, fal, openai, google, elevenlabs
│   │   ├── inpainting.ts
│   │   ├── outpainting.ts
│   │   └── reference-engine.ts     # IP-Adapter / prompt suffix 조건화
│   ├── credits/
│   │   ├── pricing.ts              # 모델별 단가표
│   │   └── manager.ts              # estimate → balance check → deduct (SELECT FOR UPDATE)
│   └── db/schema.ts                # Drizzle ORM (PostgreSQL)
├── stores/
│   ├── canvasStore.ts              # viewport, elements, selectedIds, activeTool, pages, history
│   ├── generateStore.ts            # activeType, selectedModel, references, prompt, activeGenerations
│   └── creditStore.ts              # balance, plan, monthlyUsed, estimateCost()
└── types/
    ├── canvas.ts                   # CanvasElement, ViewportState, Page, Space
    ├── models.ts                   # AIModel, ModelTag
    ├── references.ts               # Reference, ReferenceCategory, ReferencePreset
    └── credits.ts                  # CreditAccount, CreditTransaction
```

### 핵심 타입 요약

```ts
// CanvasElement — 캔버스 위 모든 요소의 공통 구조
{ id, type: 'image'|'text'|'video'|'sticky'|'group', x, y, width, height, rotation, zIndex, pageId, data }

// AIModel
{ id, name, provider: 'flux'|'google'|'openai'|'kling'|'elevenlabs'|'recraft', type: 'image'|'video'|'audio'|'3d', credits: {min,max}, tags, estimatedTime }

// ReferenceCategory
'stock' | 'style' | 'character' | 'element' | 'color' | 'effect' | 'camera'
// style/character → IP-Adapter 기반
// color/effect/camera → prompt suffix 방식
// element → 배경 제거 후 object conditioning

// GenerationStatus
'queued' | 'processing' | 'completed' | 'failed' | 'cancelled'
```

### API 엔드포인트 전체 맵

```
── AI GENERATION ──────────────────────────────────────
POST  /api/generate/image           이미지 생성
POST  /api/generate/video           동영상 생성 (startImageUrl 지원)
POST  /api/generate/audio           TTS / 음악 / SFX / 음성복제
POST  /api/generate/3d              3D 장면 생성
POST  /api/generate/inpaint         마스크 기반 영역 수정
POST  /api/generate/outpaint        캔버스 확장
POST  /api/generate/relight         광원 재배치
POST  /api/generate/camera          카메라 시점 변경
POST  /api/generate/upscale         업스케일
GET   /api/generate/:id/status      상태 폴링 (SSE도 지원)
POST  /api/generate/:id/cancel      취소

── SPACES / CANVAS ────────────────────────────────────
GET/POST      /api/spaces
GET/PATCH/DEL /api/spaces/:id
POST          /api/spaces/:id/pages
PATCH/DEL     /api/spaces/:id/pages/:pid
POST/PATCH/DEL /api/elements, /api/elements/batch

── MODELS / REFERENCES ────────────────────────────────
GET  /api/models?type=image|video|audio|3d
GET  /api/references/presets?cat=style
POST /api/references/custom

── CREDITS ────────────────────────────────────────────
GET  /api/credits                   잔액 & 사용량
POST /api/credits/estimate          생성 전 비용 견적
POST /api/credits/purchase          결제 연동

── COLLABORATION ───────────────────────────────────────
WS   /api/collaborate/:spaceId      Yjs CRDT + Awareness
```

**이미지 생성 요청 핵심 파라미터:**
```ts
{ modelId, prompt, negativePrompt?, references?: [{category, presetId?, customImageUrl?, weight?}],
  count: 1~8, aspectRatio: '1:1'|'16:9'|'9:16'|'4:3', enhancePrompt?, seed? }
```

### DB 테이블 구조 (Drizzle ORM + PostgreSQL)

| 테이블 | 주요 컬럼 | 비고 |
|--------|-----------|------|
| `users` | id, email, plan(free/pro/enterprise) | |
| `credit_accounts` | userId, balance, monthlyAllowance, usedThisMonth, resetDate | userId UNIQUE |
| `credit_transactions` | userId, amount(음수=소비/양수=충전), type, modelId, generationId | date 인덱스 |
| `spaces` | ownerId, title, settings(jsonb), isPublic | owner 인덱스 |
| `space_collaborators` | spaceId, userId, role(viewer/editor/admin) | spaceId+userId UNIQUE |
| `pages` | spaceId, name, order | space 인덱스 |
| `elements` | pageId, type, x, y, width, height, rotation, zIndex, data(jsonb), groupId | |
| `ai_models` | id(text PK), provider, type, creditCostMin/Max, tags(jsonb), isActive | |
| `reference_presets` | id, category, name, thumbnail, isPremium | |
| `user_references` | userId, category, name, imageUrl, weight | |
| `generations` | userId, modelId, type, status, prompt, outputUrls(jsonb), creditsCost | status 인덱스 |
| `templates` | title, type, config(jsonb), isPublic | |
| `comments` | spaceId, userId, x, y, content, resolved | |

### 모델 라우터 — Auto 선택 로직

```ts
// modelId == "auto" 시 자동 선택 규칙:
image:
  hasReferences → 'seedream-5-lite'   // IP-Adapter 지원
  prompt.length > 200 → 'gpt'          // 긴 프롬프트
  default → 'flux-2-pro'
video → 'kling-3'
audio → 'elevenlabs-v3'
```

**모델 → 프로바이더 매핑 (주요):**

| 모델 ID | 프로바이더 | 실제 슬러그 | 폴백 |
|---------|-----------|------------|------|
| flux-2-pro | replicate | black-forest-labs/flux-pro | fal |
| flux-1-fast | fal | fal-ai/flux/schnell | — |
| seedream-5-lite | fal | fal-ai/seedream-5-lite | — |
| google-imagen-4 | google | imagen-4.0 | — |
| google-nano-banana-2 | google | nano-banana-2 | — |
| gpt | openai | dall-e-3 | — |
| recraft-v4-pro | replicate | recraft-ai/recraft-v4-pro | — |
| kling-3 | fal | fal-ai/kling/v3 | — |
| kling-3-omni | fal | fal-ai/kling/v3-omni | — |
| seedance-2 | fal | fal-ai/seedance-2 | — |
| wan-2.2 | replicate | wan-ai/wan-2.2 | — |
| elevenlabs-v3 | elevenlabs | eleven_turbo_v3 | — |
| elevenlabs-music | elevenlabs | eleven_music_v1 | — |

### 크레딧 단가표

**이미지 (baseCost):** flux-1-fast=5 · flux-1=10 · flux-2-pro=50 · seedream-5-lite=50 · google-imagen-4=100 · gpt=150 · gpt-1-hq=500

**영상 (baseCost + perSecond):** kling-3=210+150/s · kling-3-omni=210+100/s · seedance-2=550+400/s · wan-2.2=80+25/s · openai-sora-2-pro=1800+1000/s

**작업별 고정:** inpaint=40 · outpaint=60 · camera-change=80 · relight=50 · upscale=30 · background-remove=10

### BullMQ 큐 아키텍처

```
API 요청 → Credit Check → Model Router → BullMQ Queue(Redis)
  → Worker (프로바이더 호출 → 폴링/웹훅 → 결과 수신)
    실패 시 → Fallback 프로바이더 재시도 (최대 3회)
  → Post-Process: S3 저장 → 크레딧 차감(SELECT FOR UPDATE) → DB 업데이트 → 클라이언트 알림
  → 클라이언트: SSE 스트림 (진행률) 또는 GET /api/generate/:id/status 폴링
```

Pro 유저 큐 우선순위 높음 / Free 유저 보통

### 실시간 협업 (Yjs)

- `Yjs` CRDT + `y-websocket` WebSocket Provider
- 동기화 대상: 요소(elements), 페이지(pages), 코멘트
- `Awareness`: 유저 커서 위치·선택 상태 실시간 브로드캐스트
- Redis: Yjs 영속성, rate limiting, Pub/Sub

### 배포 아키텍처

```
브라우저 → CloudFront CDN → Vercel(Next.js SSR/API) → S3
                         → y-websocket WS Server
                         → PostgreSQL (Neon/Supabase)
                         → Redis
                         → BullMQ Worker → AI Providers
                              (Replicate, Fal.ai, OpenAI, Google Vertex, ElevenLabs)
```

### 개발 우선순위

1. 캔버스 코어 — 줌/팬/선택/이미지 배치 (제품 데모 최소 형태)
2. 이미지 생성기 — 프롬프트 → 결과 → 캔버스 배치 (가치 검증)
3. Inpaint/Outpaint — 만들고 바로 고치는 경험 완성
4. DB/API/크레딧 — 저장·이력·과금 (실서비스 전환)
5. 협업 — Yjs 다중 사용자 동기화
6. 배포/모니터링 — S3/CDN/큐/로그

---

## 코딩 규칙

- 새 실습 페이지는 반드시 GuideRail / PromptWorkspace / OutputRail 3-panel 구조
- RetryActionBar는 모든 실습 페이지 하단에 고정 (`sticky bottom-0`)
- AI 결과물은 ResultCard로 렌더링, 복사/저장 버튼 필수
- 모바일에서 GuideRail은 `Accordion`으로 접힘
- 새 라우트 추가 전 `node_modules/next/dist/docs/` 확인 (AGENTS.md 지시)
- 다크 배경 기본 (`academy-bg`, `glass-panel` CSS 클래스 사용)

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health
