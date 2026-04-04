export type AcademyLesson = {
  slug: string;
  title: string;
  summary: string;
  level: string;
  outcomes: string[];
  risks: string[];
  professorNote: string;
  inputFields: { label: string; placeholder: string }[];
  defaultPrompt: string;
  quickActions: string[];
  structure: { input: string; process: string; output: string };
  outputFormat: string[];
  qualityChecks: string[];
  resultTemplate: {
    headline: string;
    sections: { title: string; body: string }[];
  };
  mockResult: {
    headline: string;
    sections: { title: string; body: string }[];
  };
};

export type AcademyTrack = {
  slug: string;
  label: string;
  workspaceTitle: string;
  workspaceSummary: string;
  outcomes: string[];
  lessons: AcademyLesson[];
};

export const academyTracks: AcademyTrack[] = [
  {
    slug: 'marketing',
    label: '마케팅',
    workspaceTitle: '캠페인 카피와 채널별 콘텐츠를 직접 만드는 마케팅 워크스페이스',
    workspaceSummary: '광고 문구, SNS 포스트, 랜딩페이지 초안을 실제 프롬프트로 입력하고 결과 카드를 비교하며 학습합니다.',
    outcomes: ['광고 제목 세트', 'SNS 초안', 'CTA/해시태그', '랜딩 첫 문단'],
    lessons: [
      {
        slug: 'campaign-copy-studio',
        title: '캠페인 카피 스튜디오',
        summary: '같은 메시지를 제목, 설명, CTA, 해시태그로 분리해 결과를 만드는 수업',
        level: '입문-실전',
        outcomes: ['제목 10개', '설명 3개', 'CTA 5개', '해시태그 세트'],
        risks: ['타깃이 모호하면 결과가 흐려짐', '채널 형식을 안 정하면 길이가 불안정해짐'],
        professorNote: '좋은 마케팅 결과물은 감각보다 구조에서 나옵니다. 대상, 제안, 톤, 형식을 먼저 고정하세요.',
        inputFields: [
          { label: '상품/서비스', placeholder: '예: 모바일 앱 서비스' },
          { label: '타깃 고객', placeholder: '예: 20~30대 직장인' },
          { label: '채널', placeholder: '예: 인스타 릴스 캡션 / 구글 광고 / 랜딩페이지' },
          { label: '강조 포인트', placeholder: '예: 편리함, 빠른 속도, 간편 예약' },
        ],
        defaultPrompt:
          '아래 정보를 바탕으로 인스타/광고/랜딩페이지에서 재사용 가능한 마케팅 문구 세트를 만들어줘.\n- 상품: 모바일 앱 서비스\n- 타깃: 20~30대 직장인\n- 강조 포인트: 편리함, 빠른 속도, 간편 예약\n- 톤: 가볍고 친근하게\n\n출력 형식:\n1) 제목 10개\n2) 설명 3개\n3) CTA 5개\n4) 해시태그 15개\n5) 랜딩 첫 문단 1개',
        quickActions: ['더 짧고 강하게 바꿔줘', '해외 타깃 버전도 추가해줘', '썸네일 문구 5개 더 줘'],
        structure: {
          input: '상품, 타깃, 채널, 강조 포인트, 톤',
          process: '메시지 정리 → 채널별 카피 분기 → CTA/해시태그 생성',
          output: '제목/설명/CTA/해시태그/랜딩 첫 문단 패키지',
        },
        outputFormat: ['제목 10개', '설명 3개', 'CTA 5개', '해시태그 15개', '랜딩 첫 문단 1개'],
        qualityChecks: ['타깃이 바로 보이는가', '너무 길지 않은가', '행동 유도 문구가 있는가'],
        resultTemplate: {
          headline: '마케팅 결과 패키지',
          sections: [
            { title: '실행 프롬프트', body: '입력한 프롬프트가 여기 반영됩니다.' },
            { title: '제목 세트', body: '1. 지금 바로 시작하세요\n2. 더 빠르고 편리하게\n3. 오늘부터 달라지는 경험' },
            { title: 'CTA / 랜딩', body: 'CTA: 지금 바로 시작하기\n랜딩 첫 문단: 처음 쓰는 순간부터 달라집니다.' },
          ],
        },
        mockResult: {
          headline: '마케팅 결과 패키지',
          sections: [
            { title: '실행 프롬프트', body: '아직 실행 전입니다. 기본 프롬프트를 확인하고 수정해보세요.' },
            { title: '제목 세트', body: '1. 지금 바로 시작하세요\n2. 더 빠르고 편리하게\n3. 오늘부터 달라지는 경험' },
            { title: 'CTA / 랜딩', body: 'CTA: 지금 바로 시작하기\n랜딩 첫 문단: 처음 쓰는 순간부터 달라집니다.' },
          ],
        },
      },
    ],
  },
  {
    slug: 'image-to-video',
    label: '이미지 투 비디오',
    workspaceTitle: '컷 구성과 장면 프롬프트를 직접 조립하는 이미지 투 비디오 워크스페이스',
    workspaceSummary: '이미지 한 장에서 시작 이미지, 장면 프롬프트, 자막, 썸네일까지 연결하는 수업입니다.',
    outcomes: ['시작 이미지', '장면 프롬프트', '자막', '썸네일 문구'],
    lessons: [
      {
        slug: 'reel-scene-builder',
        title: '릴스 장면 빌더',
        summary: '주인공, 배경, 감정선을 고정한 채 컷을 연결하는 수업',
        level: '입문-실전',
        outcomes: ['시작 이미지 1개', '5컷 장면 흐름', '자막 5개', '업로드 패키지'],
        risks: ['장면마다 주인공 설정이 바뀜', '한 컷에 너무 많은 동작을 넣음'],
        professorNote: '이미지 투 비디오는 예쁜 문장보다 고정 정보가 더 중요합니다. 주인공과 배경을 먼저 잠가두세요.',
        inputFields: [
          { label: '주제', placeholder: '예: 공항 체크아웃 후 9시간 남은 여행자' },
          { label: '주인공', placeholder: '예: 20대 여성 여행자' },
          { label: '배경', placeholder: '예: 서울 도심, 홍대, 카페, 야경' },
          { label: '컷 수', placeholder: '예: 5컷 또는 8컷' },
        ],
        defaultPrompt:
          '아래 정보를 바탕으로 세로형 숏폼 이미지 투 비디오 패키지를 만들어줘.\n- 주제: 공항 체크아웃 후 비행기까지 9시간 남은 여행자\n- 주인공: 20대 여성 여행자\n- 배경: 서울 도심, 홍대, 카페, 야경\n- 톤: 감성적이지만 가볍고 귀여운 여행 기록\n\n출력 형식:\n1) 시작 이미지 프롬프트\n2) 5컷 장면 프롬프트\n3) 장면별 자막\n4) 썸네일 문구',
        quickActions: ['더 후킹 강하게 바꿔줘', '8컷 버전으로 늘려줘', '자막을 더 짧게 줄여줘'],
        structure: {
          input: '주제, 주인공, 배경, 톤, 컷 수',
          process: '시작 이미지 고정 → 컷별 장면 연결 → 자막/썸네일 분기',
          output: '이미지 프롬프트 + 컷 프롬프트 + 자막 + 썸네일 패키지',
        },
        outputFormat: ['시작 이미지', '5컷 장면 프롬프트', '자막 5개', '썸네일 3개'],
        qualityChecks: ['주인공 설정이 유지되는가', '컷 사이 연결이 자연스러운가', '시작 3초가 강한가'],
        resultTemplate: {
          headline: '이미지 투 비디오 결과 패키지',
          sections: [
            { title: '실행 프롬프트', body: '입력한 프롬프트가 여기 반영됩니다.' },
            { title: '시작 이미지', body: '홍대 거리 입구 앞, 여행 가방을 잠깐 내려둔 20대 여성 여행자, 부드러운 오후 햇빛, 9:16' },
            { title: '5컷 흐름', body: '컷1 홍대 도착\n컷2 카페 쉬는 장면\n컷3 쇼핑\n컷4 노을\n컷5 야경 마무리' },
          ],
        },
        mockResult: {
          headline: '이미지 투 비디오 결과 패키지',
          sections: [
            { title: '실행 프롬프트', body: '아직 실행 전입니다. 컷 수와 톤을 조정해보세요.' },
            { title: '시작 이미지', body: '홍대 거리 입구 앞, 여행 가방을 잠깐 내려둔 20대 여성 여행자, 부드러운 오후 햇빛, 9:16' },
            { title: '5컷 흐름', body: '컷1 홍대 도착\n컷2 카페 쉬는 장면\n컷3 쇼핑\n컷4 노을\n컷5 야경 마무리' },
          ],
        },
      },
    ],
  },
  {
    slug: 'web-app',
    label: '웹/앱 개발',
    workspaceTitle: '기획과 개발 흐름을 한 화면에서 정리하는 웹/앱 워크스페이스',
    workspaceSummary: '서비스 설명, 화면 구조, 기능 목록, 사용자 흐름, 작업지시서를 한 번에 정리하는 수업입니다.',
    outcomes: ['서비스 정의', '화면 구조', '기능 목록', '작업지시서'],
    lessons: [
      {
        slug: 'service-planning-lab',
        title: '서비스 기획 랩',
        summary: '아이디어를 화면과 기능으로 바꾸고 개발자 전달용 초안을 만드는 수업',
        level: '입문-실전',
        outcomes: ['서비스 한 줄 소개', '핵심 화면 3개', '기능 우선순위', '작업지시서 초안'],
        risks: ['기능이 너무 많아짐', '화면 목적이 모호함'],
        professorNote: '좋은 기획은 멋진 말보다 화면 목적과 사용자 행동이 명확한 상태입니다.',
        inputFields: [
          { label: '서비스 이름', placeholder: '예: Bee Trip Guide' },
          { label: '해결 문제', placeholder: '예: 외국인 여행자의 서울 동선 계획' },
          { label: '주요 사용자', placeholder: '예: 20~30대 대만 여성 여행자' },
          { label: '핵심 기능', placeholder: '예: 장소 추천, 지도, 일정 저장' },
        ],
        defaultPrompt:
          '아래 서비스 아이디어를 바탕으로 웹/앱 기획 초안을 정리해줘.\n- 서비스: 외국인 서울 여행 가이드 웹앱\n- 주요 사용자: 20~30대 대만 여성 여행자\n- 핵심 기능: 장소 추천, 일정 저장, 지도 보기, AI 가이드\n\n출력 형식:\n1) 서비스 한 줄 소개\n2) 핵심 화면 3개\n3) 기능 목록(MVP / 추후)\n4) 사용자 흐름\n5) 개발 작업지시서 초안',
        quickActions: ['MVP만 남기고 줄여줘', '관리자 화면도 추가해줘', '개발자 전달용으로 더 구체화해줘'],
        structure: {
          input: '서비스 개요, 사용자, 기능, 문제 정의',
          process: '서비스 정의 → 화면 분해 → 기능 우선순위 → 사용자 흐름 설계',
          output: '화면 구조 + 기능 목록 + 작업지시서 초안',
        },
        outputFormat: ['서비스 정의', '화면 3개', '기능 목록', '사용자 흐름', '작업지시서'],
        qualityChecks: ['화면 목적이 분명한가', 'MVP 범위가 지나치지 않은가', '데이터/버튼 동작이 보이는가'],
        resultTemplate: {
          headline: '웹/앱 기획 결과 패키지',
          sections: [
            { title: '실행 프롬프트', body: '입력한 프롬프트가 여기 반영됩니다.' },
            { title: '핵심 화면', body: '1. 홈 추천 화면\n2. 장소 상세 화면\n3. 일정 저장 화면' },
            { title: '작업지시서 요약', body: '홈에서는 추천 카드와 검색, 상세에서는 사진/설명/저장, 일정에서는 날짜별 정렬을 제공' },
          ],
        },
        mockResult: {
          headline: '웹/앱 기획 결과 패키지',
          sections: [
            { title: '실행 프롬프트', body: '아직 실행 전입니다. 핵심 기능을 더 분명히 적어보세요.' },
            { title: '핵심 화면', body: '1. 홈 추천 화면\n2. 장소 상세 화면\n3. 일정 저장 화면' },
            { title: '작업지시서 요약', body: '홈에서는 추천 카드와 검색, 상세에서는 사진/설명/저장, 일정에서는 날짜별 정렬을 제공' },
          ],
        },
      },
    ],
  },
  {
    slug: 'automation',
    label: '자동화',
    workspaceTitle: '반복 업무를 입력-처리-결과 구조로 뜯어보는 자동화 워크스페이스',
    workspaceSummary: '자동화 아이디어를 역할 분리, 검수 포인트, 출력 형식까지 포함해 설계하는 수업입니다.',
    outcomes: ['반복 업무 정의', '흐름 설계', '역할 분리', '검수 체크리스트'],
    lessons: [
      {
        slug: 'workflow-architect',
        title: '자동화 워크플로우 아키텍트',
        summary: '한 번에 다 시키지 않고 단계별로 자동화를 설계하는 수업',
        level: '입문-실전',
        outcomes: ['입력/처리/결과 구조', '생각/생성/검수 역할', '요청문 세트', '최종 출력 형식'],
        risks: ['한 프롬프트에 모든 일을 몰아넣음', '검수 단계가 없음'],
        professorNote: '자동화는 더 똑똑한 프롬프트보다 더 나은 분업 구조가 중요합니다.',
        inputFields: [
          { label: '자동화할 일', placeholder: '예: 회의록을 요약하고 실행 항목을 정리하는 일' },
          { label: '입력 데이터', placeholder: '예: 녹취록, 회의 메모, 관련 문서' },
          { label: '원하는 결과', placeholder: '예: 요약, 액션아이템, 담당자별 할 일' },
          { label: '확인 주체', placeholder: '예: 팀장 또는 PM' },
        ],
        defaultPrompt:
          '아래 업무를 자동화 관점에서 설계해줘.\n- 업무: 회의록을 요약하고 실행 항목을 정리하는 일\n- 입력: 녹취록, 회의 메모, 관련 문서\n- 원하는 결과: 요약, 액션아이템, 담당자별 할 일\n- 확인 주체: 팀장\n\n출력 형식:\n1) 반복 업무 정의\n2) 입력 / 처리 / 결과 구조\n3) 생각하는 역할 / 만드는 역할 / 확인하는 역할 / 고쳐주는 역할\n4) 단계별 요청문\n5) 최종 출력 형식',
        quickActions: ['검수 단계를 더 강화해줘', '팀 협업 기준으로 바꿔줘', '최종 보고서 형식까지 넣어줘'],
        structure: {
          input: '원본 데이터, 업무 목적, 결과 형태, 확인 주체',
          process: '분업 설계 → 단계별 요청문 생성 → 출력 형식 표준화',
          output: '자동화 흐름도 + 역할 분리 + 요청문 세트',
        },
        outputFormat: ['입력/처리/결과', '역할 분리', '요청문 세트', '최종 결과 형식'],
        qualityChecks: ['검수 단계가 있는가', '출력 형식이 명확한가', '업무가 너무 뭉뚱그려지지 않았는가'],
        resultTemplate: {
          headline: '자동화 설계 결과 패키지',
          sections: [
            { title: '실행 프롬프트', body: '입력한 프롬프트가 여기 반영됩니다.' },
            { title: '흐름 구조', body: '입력: 녹취록\n처리: 요약 → 액션아이템 추출 → 검수\n결과: 팀 공유용 보고서' },
            { title: '역할 분리', body: '생각하는 역할: 구조 설계\n만드는 역할: 초안 작성\n확인하는 역할: 누락/오류 점검' },
          ],
        },
        mockResult: {
          headline: '자동화 설계 결과 패키지',
          sections: [
            { title: '실행 프롬프트', body: '아직 실행 전입니다. 자동화할 일을 더 구체적으로 적어보세요.' },
            { title: '흐름 구조', body: '입력: 녹취록\n처리: 요약 → 액션아이템 추출 → 검수\n결과: 팀 공유용 보고서' },
            { title: '역할 분리', body: '생각하는 역할: 구조 설계\n만드는 역할: 초안 작성\n확인하는 역할: 누락/오류 점검' },
          ],
        },
      },
    ],
  },
];

export function getTrackBySlug(trackSlug: string) {
  return academyTracks.find((track) => track.slug === trackSlug);
}

export function getLessonBySlug(trackSlug: string, lessonSlug: string) {
  return academyTracks
    .find((track) => track.slug === trackSlug)
    ?.lessons.find((lesson) => lesson.slug === lessonSlug);
}

export function getTrackAndLesson(trackSlug: string, lessonSlug: string) {
  const track = academyTracks.find((item) => item.slug === trackSlug);
  const lesson = track?.lessons.find((item) => item.slug === lessonSlug);
  return { track, lesson };
}
