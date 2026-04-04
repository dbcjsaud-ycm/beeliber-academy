# Beeliber Academy — Google Stitch 디자인 프롬프트

> 각 섹션의 프롬프트를 Google Stitch (stitch.withgoogle.com) 에 붙여넣으세요.
> 디자인 시스템 프롬프트를 **먼저** 실행하고, 이후 각 페이지 프롬프트를 실행합니다.

---

## 0. 공통 디자인 시스템 (모든 페이지 전 먼저 설정)

```
Design a dark-mode web UI design system for "Beeliber Academy", an AI education platform.

Color palette:
- Background: #09090b (zinc-950), secondary background: #18181b (zinc-900)
- Surface/card: rgba(255,255,255,0.04) with 1px border rgba(255,255,255,0.08)
- Primary accent: #7c3aed (violet-700), hover: #6d28d9
- Secondary accent: #06b6d4 (cyan-500) for outpainting/expansion actions
- Success: #10b981 (emerald-500)
- Warning: #f59e0b (amber-500)
- Danger: #ef4444 (red-500)
- Text primary: #ffffff, secondary: rgba(255,255,255,0.6), muted: rgba(255,255,255,0.3)

Typography: Inter or Pretendard font. Headings bold, body regular.

Components:
- Cards: rounded-2xl, glassmorphism (backdrop-blur-sm, bg white/4, border white/8)
- Buttons: primary = violet-600 fill, rounded-xl; ghost = white/5 bg, white/10 hover
- Badges: small pill shapes, colored backgrounds with matching text
- Input fields: bg white/5, border white/10, focus ring violet-500/50, rounded-xl
- Navigation: sticky top header, glass panel, breadcrumb trail

Visual style: dark glassmorphism, subtle gradients, no heavy drop shadows. 
Glow effects on accent elements (violet glow on primary actions).
Spacing: generous padding (16-24px), 8px base grid.
```

---

## 1. 홈 페이지 (/)

```
Design a hero landing page for "Beeliber Academy" — an AI practical education platform.
Dark mode. Desktop 1440px wide.

Layout (top to bottom):

HEADER (sticky, 56px tall):
- Left: "🐝 beeliber" logo in white, bold
- Center: nav links — 홈, 실전세션, 실습랩, 워크스페이스 (white/60, hover white)
- Right: "시작하기" button (violet-600, rounded-xl, small) + user avatar circle

HERO SECTION (full-width, 520px tall):
- Background: dark radial gradient from violet-900/20 at center to zinc-950
- Floating particle dots in violet/cyan (subtle, animated glow)
- Left side (60% width):
  - Small tag pill: "AI 실습 교육 플랫폼" (violet border, violet text, rounded-full)
  - H1 (48px, bold, white): "설명이 아닌\n실행과 저장이 되는\nAI 워크스페이스"
  - Subtitle (16px, white/60): "마케팅·영상·개발·자동화 4개 트랙, 실제 프롬프트 입력창과 결과 패널로 학습하고 결과물은 버전 단위로 저장됩니다"
  - Two CTA buttons: "무료로 시작하기" (violet, large) + "샘플 수업 보기" (ghost, outline)
  - Three stats chips below: "4개 트랙 · 28개 모듈 · AI 자동검수"
- Right side (40%): Mockup screenshot of the 3-panel lab UI, slightly tilted, with a violet glow behind it

TRACK CARDS (4-column grid, below hero):
- Section heading: "4개 실전 세션" (small uppercase label + h2)
- 4 cards, each showing: icon emoji, track name, one-line description, 3 sample outputs as small chips, difficulty badge, "트랙 시작" button
  - Card 1: 📣 마케팅 — 광고 카피, 채널별 문구, 해시태그
  - Card 2: 🎬 이미지 투 비디오 — 장면 프롬프트, 자막, 썸네일
  - Card 3: 💻 웹/앱 개발 — 화면 구조, 기능 목록, 작업지시서
  - Card 4: 🤖 자동화 — 입력-처리-결과, 역할 분리, 검수 흐름

OUTPUT PREVIEW (full-width strip):
- Label: "실제 결과물 예시"
- Horizontal scroll of 5 result preview cards: image thumbnails with violet border glow

FOOTER: minimal, dark, just logo + copyright + links
```

---

## 2. 아카데미 대시보드 (/academy)

```
Design a dashboard page for "Beeliber Academy" learning management. Dark mode, desktop 1440px.

STICKY HEADER (56px):
- Logo left, nav links center (대시보드, AI 플레이그라운드, 워크플로우 캔버스, AI 레벨체크, 과제 센터)
- Right: notification bell + user avatar + name

ALERT BANNER (full-width, amber/10 bg):
- Small amber dot pulse + text warning about content policy (Phase 1 restrictions)

MAIN CONTENT (two-column: 68% left + 32% right, max-width 1200px, mx-auto):

LEFT COLUMN:
1. Welcome card (gradient violet-900/20 to transparent, rounded-2xl, p-6):
   - "안녕하세요, 오현정님 👋" (h2)
   - "오늘의 학습 목표: Super Gems 활용법 마스터하기"
   - Progress bar (violet fill, 68% complete)
   - Two action chips: "이어서 학습" + "AI 레벨체크"

2. Section filter tabs (all / 마케팅 / 웹앱개발 / 자동화):
   - Pill-style tabs, active = white text + violet border-b
   
3. Track cards (2-column grid):
   - Each card: icon, track name, module count badge, description, progress percentage, "학습 시작" button
   - Cards have colored left border accent (green for common, blue for tools, purple for supergems, orange for multimodal)
   - Example tracks: 공통 기초, 프롬프트 도구, Super Gems, 멀티모달, 영상랩, 실전 케이스, 최적화

RIGHT COLUMN:
1. Learning streak card: calendar heatmap (small squares, violet = active days), streak count "🔥 12일 연속"
2. Upcoming assignments (3 items, deadline badge, status chip: 진행중/마감임박/완료)
3. Quick actions: "AI 플레이그라운드 →", "워크스페이스 열기 →", "결과물 보기 →"
4. Credits widget: donut chart showing used/remaining, "500 크레딧 남음"
```

---

## 3. 실습 랩 3-패널 레이아웃 (/lab/[track]/[lesson])

```
Design a 3-panel AI practice workspace for "Beeliber Academy". Dark mode, desktop 1440px.
This is the core learning experience — professor guide + AI prompt input + results.

FULL-SCREEN LAYOUT (no page scroll, fixed height = viewport):

TOP HEADER BAR (48px, glass panel):
- Breadcrumb: "마케팅 > 캠페인 카피 스튜디오"
- Center: lesson title + outcome badge chips ("광고 카피 10개", "CTA 5개")
- Right: progress "3/8 완료" + save status indicator

3-COLUMN MAIN AREA (flex, full remaining height):

LEFT PANEL — GuideRail (20% width, 240px, scrollable):
- "오늘의 목표" section: 3 bullet points with violet checkmarks
- Professor Guide card (glass card, violet-400 Paintbrush icon):
  - Small avatar (professor) + quote-style explanation text
  - Expandable sections
- "핵심 단어" accordion: term + plain-Korean definition
- "따라하기 순서" numbered list (1→2→3→4)
- "자주 하는 실수" collapse with red warning chips
- All sections collapsible, smooth transition

CENTER PANEL — PromptWorkspace (50% width, main area):
- InputFormCard (glass card, top):
  - 5 labeled input fields in 2-column grid: 주제, 대상, 목적, 톤, 결과물 형태
  - Each field: small label above, text input with white/5 bg
  
- PromptChipGroup: horizontal scroll of 4 example chips
  - Each chip: rounded-full, white/5 bg, click = fills prompt below
  - Active chip = violet border
  
- PromptInputBox (large textarea, min 120px):
  - Placeholder Korean text, character count bottom-right
  - Negative prompt toggle (collapsed by default)
  
- Execute button (full-width, violet-600, large, "AI 실행" with Sparkles icon)
- Conversation log (scrollable): alternating user/AI message bubbles

BOTTOM FIXED — RetryActionBar (40px, above footer):
- 6 action chips: "더 짧게", "더 쉽게", "순서대로", "초보자용으로", "표로 정리", "핵심만"
- Each chip: small, rounded-full, white/5 bg, hover = violet/20

RIGHT PANEL — OutputRail (30% width, scrollable):
- ResultCard (glass card):
  - AI output text with syntax highlighting for key terms
  - Action row: Copy, Edit, Save, Submit buttons (small, ghost)
  - Version indicator: "v3 / 저장됨"
  
- QualityCheckCard (glass card, below):
  - Three check rows with green ✓ or amber ⚠:
    - "목적 부합 여부"
    - "길이 적정성"  
    - "필수 요소 포함"
  - Score badge: "87점" with color coding
  
- Save/Submit button: full-width, emerald-600 "제출하기"
```

---

## 4. 실전 세션 허브 (/tracks)

```
Design a course track selection page for "Beeliber Academy". Dark mode, desktop 1440px.

HEADER: Same sticky glass header as other pages

PAGE TITLE SECTION (centered, pt-12 pb-8):
- Small label: "실전 세션"
- H1 (40px bold): "어떤 결과물을 만들 건가요?"
- Subtitle: "4개 트랙 중 하나를 선택해 실제 프롬프트와 결과물을 만들어보세요"

TRACK CARDS (2×2 grid, max-width 900px, mx-auto, gap-6):
Each card is large (440px tall), glassmorphism, hover = lift + glow:

CARD 1 — 📣 마케팅 (green accent, #10b981):
- Large emoji icon (64px) + track name (h2)
- Tag chips: "카피", "SEO", "SNS", "GEO"
- Description: "Super Gems 활용, GEO 전략, SNS-SEO 연결 워크플로우"
- Output preview list (3 items with small icons):
  • 📋 제목 10개 + 설명 3개
  • 🔗 CTA 5개 + 해시태그 15개
  • 🖼️ 썸네일 문구 세트
- Difficulty: "초급–중급" badge
- Estimated time: "⏱ 2–3시간"
- CTA button: "마케팅 트랙 시작" (green fill)

CARD 2 — 🎬 이미지 투 비디오 (amber accent, #f59e0b):
- Same structure, outputs: 기준이미지 프롬프트 · 장면별 영상 프롬프트 · 자막 · 업로드 패키지
- CTA: "영상 트랙 시작" (amber fill)

CARD 3 — 💻 웹/앱 개발 (blue accent, #3b82f6):
- Outputs: 서비스 소개 · 화면 구조 · 핵심 기능 목록 · 개발 작업지시서
- CTA: "개발 트랙 시작" (blue fill)

CARD 4 — 🤖 자동화 (purple accent, #8b5cf6):
- Outputs: 반복업무 정의 · 입출력 구조 · 단계별 요청문 · 최종 출력 형식
- CTA: "자동화 트랙 시작" (purple fill)

BOTTOM CTA STRIP (mt-12):
- "아직 방향을 모르겠다면?" + "AI 레벨 체크" button (ghost) + "입문 페이지 보기" link
```

---

## 5. 이미지/영상 워크스페이스 (/spaces/[id])

```
Design an infinite canvas AI image workspace. Dark mode, full-screen desktop 1440×900px.
This is a Pikaso/Canva-style creative workspace.

TOP HEADER (48px, dark with border-b white/7):
- Left: "← 워크플로우" back link (small, white/40) + divider + space title
- Right (flex gap-2):
  - Save status: small "저장됨" with cloud icon (white/30)
  - Credits badge: "크레딧 · 460" pill (white/10 bg, violet text for number)
  - Generation progress badge (violet pulse dot, "생성 중 1") — show when active
  - "내보내기" button (ghost, small) + "공유" button (ghost, small)

FULL-SCREEN 3-COLUMN LAYOUT:

LEFT FLOATING TOOLBAR (vertical pill, absolute left-3 center-y, z-20):
- 5 icon buttons stacked: Select(cursor), Hand(pan), Type, StickyNote, Upload
- Active tool: violet-600/20 bg + violet border
- Rounded-2xl pill container, glass bg

CENTER — Infinite Canvas (flex-1, bg-neutral-900):
- Dark checkered grid pattern (very subtle, white/3)
- Sample image card on canvas: glass border, violet glow when selected
- When image selected: Context Action Bar floats at top-center:
  - Pill with icon buttons: Inpaint, Outpaint, Camera, Relight, Copy, Download, Delete
  - Active panel button = violet highlight
  - Below active button: floating panel drops down (InpaintingPanel or OutpaintingPanel)
- Bottom left: zoom percentage "84%" (small glass chip)
- Bottom right: element count "3 요소" (small glass chip)
- Center empty state (when no elements): large icon + "첫 이미지를 생성해보세요" + violet CTA button

RIGHT PANEL (288px, flex-col, border-l white/7):
- Tab header: "생성" | "레이어" (border-b active tab = violet border-b-2)
  
  GENERATE TAB:
  - "모델" label + ModelSelector dropdown (shows model name, credits cost, estimated time)
  - "프롬프트" label + PromptInput textarea (with quick prompt chips above)
  - Aspect ratio buttons: 1:1 / 16:9 / 9:16 / 4:3
  - "이미지 생성" button (full-width, violet-600, large)
  - Generation history (small rows: status dot + model name + credit cost)
  
  LAYERS TAB:
  - List of elements in reverse order
  - Each row: image icon, label text, dimensions (right-aligned, white/20)

Show InpaintingPanel as a floating overlay panel (top-center, below context bar):
- 256px wide, glass dark bg
- Brush mode buttons (paint/erase), brush size slider, mask clear button
- Source image preview (thumbnail)
- Prompt textarea
- "인페인팅 생성" violet button
```

---

## 6. 과제 센터 (/academy/assignments)

```
Design an assignments dashboard page for "Beeliber Academy". Dark mode, desktop 1440px, max-width 960px centered.

STICKY HEADER: glass panel, breadcrumb "대시보드 / 과제 센터"

PAGE INTRO (pt-8 pb-6):
- H2: "과제 센터"
- Subtitle: "모든 실습 과제를 한눈에 확인하고 제출하세요. AI가 자동 검수합니다."
- Filter pills row: 전체 | 진행중 | 마감임박 | 완료 | 미제출

STATS STRIP (4 glass cards in a row, mb-6):
- 전체 과제: "12"
- 완료: "5" (green)
- 진행중: "4" (violet/pulse)
- 마감임박: "3" (amber/pulse)

ASSIGNMENT LIST (vertical stack, gap-3):
Each assignment row card (glass card, p-5, hover = border violet/30):
- Left: type icon in glass square (📝📄🎨🎬)
- Middle: assignment title (white, bold) + module/track path (white/40, small) + description (1 line, truncated)
- Status chip right-aligned: 
  - 진행중 = violet bg, animate-pulse dot
  - 마감임박 = amber bg + "D-2" countdown
  - 완료 = emerald bg + checkmark
  - 미제출 = white/10 bg
- Far right: deadline date (white/30, small) + chevron-right icon

EMPTY STATE (when no assignments): centered illustration + "아직 과제가 없습니다" text
```

---

## 7. 결과물 저장소 (/outputs)

```
Design an outputs gallery page for "Beeliber Academy". Dark mode, desktop 1440px.
This shows saved AI-generated content in a masonry/grid layout.

STICKY HEADER: glass, breadcrumb "대시보드 / 결과물"

TOOLBAR (flex, justify-between, mb-6):
- Left: H2 "내 결과물" + count badge
- Right: filter dropdown (전체/텍스트/이미지/영상) + search input + sort dropdown

MASONRY GRID (3 columns, gap-4):
Each result card (glass, rounded-2xl):
  TEXT result:
  - Card header: type badge "텍스트" + track name chip + date (white/30)
  - Content preview: 3-4 lines of Korean text, truncated with "..." fade
  - Tags: small prompt keyword chips
  - Footer: Copy button + "이어서 작업" button + version "v2"
  
  IMAGE result:
  - Full-width thumbnail image (aspect-ratio 4:3, object-cover, rounded-t-2xl)
  - Below: prompt text truncated + model badge + credits used chip
  - Actions: Download + "캔버스에서 열기" button
  
  VIDEO result (placeholder):
  - Dark thumbnail with play button overlay
  - Duration badge bottom-right
  - Same footer pattern

EMPTY STATE: centered, "첫 결과물을 만들어보세요" + "실습 시작하기" CTA button
```

---

## 8. 입문 페이지 (/learn/page-1)

```
Design an onboarding learning page for first-time AI users. "Beeliber Academy". Dark mode, desktop 1440px.
This is /learn/page-1 — "AI에게 한 줄 말 걸어보기" — removing the fear of the first question.

STICKY HEADER: glass, breadcrumb "입문 > 1단계: 첫 질문 해보기"
Progress bar below header: 4-step pill tracker (1 active, 2-4 gray). "1/4 단계"

FULL PAGE LAYOUT (2-column, 55%/45%):

LEFT — 교수 가이드 (scrollable):
  Professor card (glass, violet-400 icon):
  - Small professor emoji avatar + "교수 가이드"
  - Large comfortable text (16px, 1.7 line-height, white/80):
    "AI에게 말을 거는 건 검색창에 뭔가 치는 것과 똑같아요.
    틀려도 괜찮아요. AI는 화내지 않거든요. 😊
    지금 바로 아무 말이나 해보세요."
  
  핵심 원칙 (3 cards with icons):
  - ✅ "틀려도 됩니다" — 피드백 없음, 그냥 다시 하면 됨
  - ✅ "짧아도 됩니다" — 한 줄도 충분
  - ✅ "한국어 그대로" — 번역할 필요 없음
  
  예시 프롬프트 (3 chip buttons, click = fill right panel):
  - "오늘 날씨 어때?" (초초초간단)
  - "나 요즘 피곤해. 뭐가 문제일까?"
  - "광고 문구 하나만 써줘"

RIGHT — AI 실습 창 (sticky, full height):
  Glass card, rounded-2xl:
  - Header: "직접 해보세요 ✨" (small, white/60)
  - Large textarea (min 160px): placeholder "여기에 아무 말이나 써보세요..."
  - "AI에게 물어보기" button (full-width, violet-600, large, Sparkles icon)
  
  Result area (appears after submit):
  - Divider with "AI 답변" label
  - AI response text (white/80, 16px)
  - 3 RetryChips below: "더 쉽게", "더 짧게", "다시"
  - Save button: "결과 저장하기" (emerald, small)
  
  "다음 단계로 →" (violet, full-width, disabled until at least 1 response)

BOTTOM FIXED BAR (only on mobile):
  Collapsed accordion for professor guide
```

---

## 디자인 일관성 체크리스트

Stitch로 각 페이지 생성 후 확인:
- [ ] 배경색 #09090b (zinc-950) 통일
- [ ] 카드 컴포넌트 glassmorphism 일관성 (bg white/4, border white/8)
- [ ] 주요 액션 버튼 violet-600
- [ ] 폰트: Pretendard (한국어) / Inter (영문)
- [ ] 모든 둥근 모서리 rounded-2xl (카드), rounded-xl (버튼/인풋)
- [ ] 아이콘: Lucide React 계열
- [ ] 반응형: 모바일에서 GuideRail은 Accordion으로 접힘
