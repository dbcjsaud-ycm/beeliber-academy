# Design System — Beeliber Academy

## Product Context
- **What this is:** AI 실습 교육 플랫폼 — 마케팅·영상·개발·자동화 4개 트랙, 프롬프트 입력창과 결과 패널이 통합된 워크스페이스형 LMS
- **Who it's for:** AI를 처음 실무에 적용하려는 한국어 사용자 (마케터, 기획자, 개발자, 자영업자)
- **Space/industry:** EdTech / AI tools — Coursera, Udemy, Anthropic Claude UI, Notion AI
- **Project type:** Web app (워크스페이스/랩) + marketing site (랜딩)

## Aesthetic Direction
- **Direction:** Retro-Futuristic Maker — "황금빛 등불이 어두운 방을 밝히는 느낌"
- **Decoration level:** intentional (subtle glow, grain texture, glassmorphism — 과하지 않게)
- **Mood:** 따뜻하지만 기술적. 모든 AI 플랫폼이 차가운 보라색인데, 여기는 사람이 있다. 벌의 황금색이 브랜드를 관통한다. 사용자는 "도구를 쓴다"는 느낌이 아니라 "작업실에 왔다"는 느낌을 받아야 한다.
- **Reference sites:** Linear (dense, productive), Raycast (dark + warm accent), Craft (editorial warmth)

## Typography

- **Display/Hero:** Fraunces (variable, wdth 100, opsz auto) weight 700–800
  - 히어로 헤드라인, 대형 섹션 제목에만 사용
  - 이탤릭 변형이 특히 강렬함 — "작은 질문이" 같은 구문에 이탤릭 고려
  - 이유: AI 플랫폼 전부 기하학적 고딕. 세리프 한 줄이 "여기는 인간이 가르친다"고 말함
- **Body:** Geist Sans 400/500/600
  - 본문, UI 레이블, 설명 텍스트 전반
  - Vercel이 만든 기술적이고 가독성 좋은 고딕. 한국어 폴백: Pretendard
  - 이유: 기술 도구의 신뢰감, 깔끔한 숫자 렌더링
- **UI/Labels:** Geist Sans 500 (medium)
- **Data/Tables:** Geist Sans (tabular-nums feature), Geist Mono for raw values
- **Code:** Geist Mono — API 응답, 프롬프트 예시, 코드 블록
- **Loading strategy:** Google Fonts CDN (Fraunces), Vercel CDN (Geist via next/font)
- **Scale (px / rem):**
  | Token | px  | rem   | Usage |
  |-------|-----|-------|-------|
  | xs    | 12  | 0.75  | Meta, timestamps |
  | sm    | 14  | 0.875 | Body small, labels |
  | base  | 16  | 1     | Body default |
  | lg    | 18  | 1.125 | Lead text |
  | xl    | 20  | 1.25  | Card titles |
  | 2xl   | 24  | 1.5   | Section headings |
  | 3xl   | 30  | 1.875 | Sub-hero |
  | 4xl   | 36  | 2.25  | Hero (mobile) |
  | 5xl   | 48  | 3     | Hero (tablet) |
  | 6xl   | 60  | 3.75  | Hero (desktop) |
  | 7xl   | 72  | 4.5   | Hero (xl) |

## Color

- **Approach:** balanced — amber가 주연, violet은 조연, cyan은 인터랙션
- **Primary:** `#f59e0b` (amber-500) — CTA 버튼, 활성 상태, 강조, 크레딧 표시
  - hover: `#d97706` (amber-600)
  - subtle bg: `rgba(245,158,11,0.10)`
  - border: `rgba(245,158,11,0.25)`
  - glow: `rgba(245,158,11,0.30)` blur-30
- **Secondary:** `#7c3aed` (violet-700) — AI 생성 상태, 기술 지표, 3D 로봇, 인페인팅
  - hover: `#6d28d9`
  - subtle bg: `rgba(124,58,237,0.08)`
- **Tertiary:** `#06b6d4` (cyan-500) — 링크, 인터랙션, 아웃페인팅
- **Neutrals (surface, dark to light):**
  - base: `#05050f`
  - surface-1: `rgba(255,255,255,0.03)` (카드 배경)
  - surface-2: `rgba(255,255,255,0.06)` (호버 상태)
  - border-subtle: `rgba(255,255,255,0.07)`
  - border-default: `rgba(255,255,255,0.10)`
  - border-hover: `rgba(245,158,11,0.30)` (앰버로 호버 테두리)
- **Semantic:**
  - success: `#10b981` (emerald-500) — 저장됨, 검수 통과
  - warning: `#fb923c` (orange-400) — 마감 임박, 잔여 크레딧 낮음
  - error: `#ef4444` (red-500) — 삭제, 실패
  - info: `#06b6d4` (cyan-500)
- **Text:**
  - primary: `#ffffff`
  - secondary: `rgba(255,255,255,0.60)`
  - muted: `rgba(255,255,255,0.30)`
  - disabled: `rgba(255,255,255,0.15)`
- **Dark mode:** 이 제품은 다크 모드가 기본. 라이트 모드 없음.

## Spacing

- **Base unit:** 4px
- **Density:** comfortable — 카드 패딩 16–24px, 컴포넌트 간 갭 8px
- **Scale:**
  | Token | Value |
  |-------|-------|
  | 1     | 4px   |
  | 2     | 8px   |
  | 3     | 12px  |
  | 4     | 16px  |
  | 5     | 20px  |
  | 6     | 24px  |
  | 8     | 32px  |
  | 10    | 40px  |
  | 12    | 48px  |
  | 16    | 64px  |
  | 20    | 80px  |
  | 24    | 96px  |

## Layout

- **Approach:** hybrid — 앱/워크스페이스는 grid-disciplined, 랜딩/마케팅은 editorial
- **Grid:** 12-column, 24px gutter
  - mobile: 4-col, 16px gutter
  - tablet: 8-col, 20px gutter
  - desktop: 12-col, 24px gutter
- **Max content width:** 1440px (marketing), 1280px (app), 960px (reading/docs)
- **Border radius:**
  | Token | Value | Usage |
  |-------|-------|-------|
  | sm    | 6px   | 인풋, 배지, 작은 칩 |
  | md    | 10px  | 버튼, 드롭다운 |
  | lg    | 14px  | 카드, 패널 |
  | xl    | 20px  | 대형 카드, 모달 |
  | 2xl   | 28px  | 히어로 섹션 |
  | full  | 9999px | 알약형 배지, 태그 |
- **Glassmorphism (카드 기본값):**
  ```css
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(12px);
  border-radius: 14px;
  ```
  호버 시 border-color → `rgba(245,158,11,0.30)`

## Motion

- **Approach:** intentional — 의미 없는 애니메이션 없음. 상태 전환과 진입에만.
- **Easing:**
  - enter: `cubic-bezier(0, 0, 0.2, 1)` (ease-out — 빠르게 나타남)
  - exit: `cubic-bezier(0.4, 0, 1, 1)` (ease-in — 빠르게 사라짐)
  - move: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out)
- **Duration:**
  | Token  | Range       | Usage |
  |--------|-------------|-------|
  | micro  | 50–80ms     | 색상 전환, 테두리 |
  | short  | 120–180ms   | 버튼 호버, 아이콘 |
  | medium | 220–300ms   | 패널 진입, 드롭다운 |
  | long   | 350–500ms   | 페이지 진입, 모달 |
- **특별 규칙:**
  - `prefers-reduced-motion` 항상 존중
  - 로딩 인디케이터: spinner 대신 pulse (덜 산만함)
  - 3D 로봇: 항상 부드럽게, 프레임 드롭 없도록 dpr 제한

## Component Patterns

### Primary Button
```
background: #f59e0b
color: #000000 (검정 — 앰버 위에서 가독성 최고)
border-radius: 10px
padding: 10px 20px
font: Geist Sans 600, 14px
hover: #d97706 + scale(1.01)
active: scale(0.98)
glow: 0 0 20px rgba(245,158,11,0.35)
```

### Ghost Button
```
background: rgba(255,255,255,0.05)
border: 1px solid rgba(255,255,255,0.10)
color: rgba(255,255,255,0.75)
hover: bg rgba(255,255,255,0.09), border rgba(245,158,11,0.25), color white
```

### Card (glass)
```
background: rgba(255,255,255,0.04)
border: 1px solid rgba(255,255,255,0.08)
border-radius: 14px
backdrop-filter: blur(12px)
hover: border rgba(245,158,11,0.30), bg rgba(245,158,11,0.03), translateY(-1px)
```

### Badge / Tag
```
border-radius: 9999px
padding: 3px 10px
font: Geist Sans 500, 12px
amber: bg rgba(245,158,11,0.15), text #f59e0b, border rgba(245,158,11,0.25)
violet: bg rgba(124,58,237,0.15), text #a78bfa
emerald: bg rgba(16,185,129,0.15), text #10b981
```

### Input
```
background: rgba(255,255,255,0.05)
border: 1px solid rgba(255,255,255,0.10)
border-radius: 10px
padding: 10px 14px
color: white, placeholder white/30
focus: border rgba(245,158,11,0.50), outline none
```

## Safe Choices (카테고리 기준선)
1. **다크 배경** — AI 도구 사용자 기대값. 변경 시 이탈 가능성.
2. **Geist Mono for code** — 기술적 신뢰감. 코드/프롬프트 영역에 필수.
3. **카드 기반 모듈 레이아웃** — LMS 사용자가 익숙한 패턴.

## Deliberate Risks (차별화 지점)
1. **앰버를 메인 액션 컬러로** — Coursera/Udemy/Claude 전부 파랑-보라계열. 앰버는 시장에서 혼자다. 벌 마스코트와 의미적으로 연결됨. 리스크: 앰버는 저렴해 보일 수 있음. 미티게이션: 어두운 배경 위에서 골드처럼 빛남.
2. **Fraunces 세리프 for 히어로** — AI 플랫폼 치고 세리프는 거의 없음. 신호: "여기는 사람이 있다, 기계만 있는 게 아니다." 리스크: 한국어와 혼용 시 어색할 수 있음. 미티게이션: 영문 헤드라인에만, 한국어 본문은 Geist/Pretendard.
3. **워크스페이스 화면의 빽빽한 밀도** — 소비형 MOOC가 아닌 전문가 도구처럼 느껴지게. 리스크: 초보자에게 위압감. 미티게이션: 입문 페이지는 spacious, 워크스페이스는 compact.

## Decisions Log
| Date       | Decision | Rationale |
|------------|----------|-----------|
| 2026-04-04 | Amber (#f59e0b) as primary accent | 🐝 마스코트 연결, AI 플랫폼 보라색 포화 회피 |
| 2026-04-04 | Fraunces for display, Geist for body | 따뜻한 세리프 헤드 + 기술적 고딕 본문의 대비 |
| 2026-04-04 | Violet retained as secondary | AI/기술 지표, 3D 로봇, 생성 상태에만 |
| 2026-04-04 | Glassmorphism hover → amber border | 인터랙션 피드백이 브랜드 컬러를 강화 |
| 2026-04-04 | Primary button text: black (#000) | 앰버 배경 위 최대 대비비 확보 |
| 2026-04-04 | No light mode | 제품 성격상 다크 단일 모드가 맞음 |
