# Beeliber Academy — Supabase 저장 연동 + AI API Route + 버전관리 구조

이 프로젝트는 Beeliber Academy의 워크스페이스형 수업을 실제 운영 단계로 옮기기 위한 Next.js App Router 목업입니다.

포함 내용:
- Supabase 저장 구조
- 사용자별 결과물 저장
- 버전 이력 저장 / 복원
- OpenAI Responses API 기반 실제 AI 호출 Route Handler
- `lab/[track]/[lesson]` 동적 라우트
- shadcn/ui 스타일의 워크스페이스 화면

## 1) 설치

```bash
pnpm install
cp .env.example .env.local
```

## 2) 환경변수

`.env.local`에 아래 값을 넣습니다.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

## 3) Supabase SQL 적용

아래 파일을 Supabase SQL Editor에서 실행합니다.

```txt
supabase/migrations/20260403_workspace_outputs.sql
```

## 4) 실행

```bash
pnpm dev
```

## 5) 핵심 구조

### 프론트
- `app/workspace/page.tsx` : 4개 트랙 허브
- `app/lab/[track]/[lesson]/page.tsx` : 실습 워크스페이스 진입
- `components/workspace/LessonWorkspace.tsx` : 실행 / 저장 / 버전 리스트 / 복원 UI

### AI
- `app/api/ai/route.ts` : OpenAI Responses API 호출
- `lib/openai/client.ts` : OpenAI SDK 초기화
- `lib/openai/prompt-builder.ts` : 수업별 시스템 프롬프트 생성

### 저장 / 버전관리
- `app/api/workspace/route.ts` : 새 문서 생성 + 1차 버전 저장
- `app/api/workspace/[documentId]/route.ts` : 문서 상세 조회
- `app/api/workspace/[documentId]/versions/route.ts` : 새 버전 저장 / 버전 목록 조회
- `app/api/workspace/[documentId]/versions/[versionId]/restore/route.ts` : 특정 버전 복원

### Supabase
- `lib/supabase/browser.ts`
- `lib/supabase/server.ts`
- `lib/supabase/admin.ts`

## 6) 저장 모델

### documents
사용자가 한 수업 안에서 만드는 “결과물 묶음” 단위

예:
- 마케팅 / campaign-copy-studio / 봄 프로모션 카피 세트
- 자동화 / workflow-architect / 회의록 자동화 설계안

### versions
문서 안의 각 저장 시점

예:
- v1 초안
- v2 CTA 강화
- v3 랜딩 문단 수정
- v4 이전 버전 복원 후 재저장

## 7) 운영 흐름

1. 사용자가 워크스페이스에서 프롬프트 작성
2. `/api/ai` 실행
3. 결과 카드 확인
4. “첫 저장” 시 document + version 1 생성
5. “새 버전 저장” 시 version N 추가
6. 버전 리스트에서 과거 결과 확인
7. “복원” 시 해당 버전을 복사해 새 버전으로 저장하고 current_version를 갱신

## 8) 참고

- Route Handlers는 `app` 디렉터리 안의 `route.ts` 파일에서 정의합니다.
- Supabase SSR 구성은 `@supabase/ssr`의 browser/server client 패턴을 사용합니다.
- 공개 스키마의 테이블은 RLS를 켜고 `auth.uid()` 기반 정책으로 보호합니다.
