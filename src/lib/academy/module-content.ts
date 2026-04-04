// 모듈별 학습 콘텐츠 (실습 가이드, 핵심 개념, 예시 프롬프트)

export interface ModuleContent {
  concepts: { title: string; body: string }[];
  practiceSteps: { step: number; title: string; instruction: string; tip?: string }[];
  examplePrompts: { title: string; prompt: string; expected: string }[];
  doAndDont: { do: string[]; dont: string[] };
  quiz?: { question: string; options: string[]; answer: number; explanation: string }[];
}

export const MODULE_CONTENTS: Record<string, ModuleContent> = {
  "brand-basics": {
    concepts: [
      {
        title: "브랜드란 무엇인가",
        body: "브랜드는 제품이나 서비스를 고객이 경험하는 방식의 총체입니다. 로고, 색상, 언어, 톤, 가치관이 모두 브랜드를 구성합니다. 일관된 브랜드 경험이 신뢰를 만듭니다.",
      },
      {
        title: "브랜드 보이스 설계",
        body: "브랜드 보이스는 고객과 소통하는 방식입니다. 경쾌함, 친근함, 간결함, 담담함 등 보이스 속성을 정의하고, 채널별로 속성의 강도를 조절합니다. SNS에서는 경쾌함을, 공식 안내문에서는 간결함을 강화합니다.",
      },
      {
        title: "브랜드 일관성의 중요성",
        body: "모든 채널(SNS, 웹, CS, 광고)에서 동일한 브랜드 언어와 톤을 유지해야 합니다. AI 생성 콘텐츠도 브랜드 가이드라인 검수를 거쳐야 합니다. 일관성이 깨지면 고객 신뢰가 흔들립니다.",
      },
    ],
    practiceSteps: [
      { step: 1, title: "브랜드 보이스 속성 정의", instruction: "자신의 서비스나 제품의 브랜드 보이스 속성 4가지를 정의하고, 각 속성에 맞는 예시 문장을 작성하세요.", tip: "속성 예: 경쾌함, 친근함, 전문성, 신뢰감" },
      { step: 2, title: "채널별 톤 조절 실습", instruction: "같은 메시지를 SNS용(경쾌), 공지문용(간결), CS 응대용(담담) 3가지 톤으로 각각 작성해보세요." },
      { step: 3, title: "AI 생성 콘텐츠 검수", instruction: "AI에게 서비스 소개문을 생성시킨 후, 브랜드 보이스 기준으로 직접 검수하세요. 수정이 필요한 부분을 찾아 교정합니다." },
    ],
    examplePrompts: [
      {
        title: "서비스 소개문 생성 (검수용)",
        prompt: "당신은 브랜드 카피라이터입니다.\n\n서비스를 200자 이내로 소개해주세요.\n- 대상: 잠재 고객\n- 톤: 경쾌하고 친근하게\n- 포함: 서비스 핵심 가치, 이용 방법, CTA",
        expected: "생성된 결과물에서 브랜드 보이스 일치 여부, 정보 정확성, 톤 적합성을 검수하세요.",
      },
      {
        title: "톤 변환 실습",
        prompt: "아래 문장을 세 가지 톤으로 각각 변환해주세요:\n\n원문: '저희 서비스를 이용해 주세요.'\n\n1. Active 모드 (경쾌+친근)\n2. Balance 모드 (친근+간결)\n3. Trust 모드 (담담+간결)",
        expected: "세 가지 톤의 차이가 명확하게 나타나야 합니다. 각 모드의 특징을 설명할 수 있어야 합니다.",
      },
    ],
    doAndDont: {
      do: [
        "브랜드 보이스 속성을 문서화하여 팀 공유",
        "채널별 톤 강도를 조절하여 일관성 유지",
        "AI 생성 콘텐츠를 브랜드 가이드로 반드시 검수",
        "긍정적이고 가치 중심의 언어 사용",
      ],
      dont: [
        "채널마다 전혀 다른 톤과 언어 사용",
        "AI 생성물을 검수 없이 그대로 게시",
        "부정적이거나 브랜드 가치와 맞지 않는 표현 사용",
        "브랜드 가이드 없이 즉흥적으로 콘텐츠 생산",
      ],
    },
    quiz: [
      { question: "브랜드 보이스 속성에 해당하지 않는 것은?", options: ["경쾌함", "친근함", "간결함", "저렴함"], answer: 3, explanation: "브랜드 보이스는 소통 방식을 정의합니다. '저렴함'은 가격 정책이지 보이스 속성이 아닙니다." },
      { question: "AI 생성 콘텐츠를 브랜드에 맞게 활용하는 올바른 순서는?", options: ["생성 → 바로 게시", "생성 → 브랜드 검수 → 수정 → 게시", "검수 → 생성 → 게시", "게시 → 검수 → 수정"], answer: 1, explanation: "AI 생성물은 반드시 브랜드 가이드라인 검수를 거친 후 게시해야 합니다." },
    ],
  },

  "service-flow-policy": {
    concepts: [
      { title: "서비스 구조 이해", body: "서비스를 정확히 이해해야 올바른 콘텐츠를 만들 수 있습니다. 서비스의 종류, 운영 방식, 이용 흐름을 명확히 파악하고, AI에게 정보를 전달할 때 정확하게 제공해야 합니다." },
      { title: "운영 정책 고정의 중요성", body: "운영 시간, 이용 방법, 예약 경로 등 운영 정책은 콘텐츠 생성 시 반드시 정확해야 합니다. 잘못된 정보가 포함된 콘텐츠는 고객 혼선을 초래합니다. AI 생성 결과물의 정책 정확성 검수는 필수입니다." },
      { title: "서비스 흐름 시각화", body: "고객이 서비스를 이용하는 전체 흐름을 단계별로 정의하면, AI에게 정확한 콘텍스트를 제공할 수 있습니다. 흐름도 형태로 정리해두는 것이 좋습니다." },
    ],
    practiceSteps: [
      { step: 1, title: "서비스 흐름 배열하기", instruction: "서비스의 이용 단계를 올바른 순서로 배열하고, 각 단계에서 고객이 해야 할 행동을 명시하세요." },
      { step: 2, title: "운영 정책 O/X 퀴즈", instruction: "서비스 운영 정책을 기반으로 O/X 퀴즈 5개를 만들고 직접 풀어보세요.", tip: "자신이 모르는 부분을 찾는 것이 목표입니다." },
      { step: 3, title: "정확한 정보로 안내문 작성", instruction: "서비스 운영 정책이 정확히 반영된 고객 안내문을 작성하세요. 시간, 방법, 경로가 모두 포함되어야 합니다." },
    ],
    examplePrompts: [
      {
        title: "서비스 흐름 설명 생성",
        prompt: "서비스 이용 흐름을 고객이 이해하기 쉽도록 단계별로 설명해주세요.\n\n조건:\n- 3~5단계로 구분\n- 각 단계에 시간/방법/장소 포함\n- 예약 경로 명시\n- 고객 관점에서 작성",
        expected: "생성된 결과에서 단계 순서, 시간, 방법이 모두 정확한지 검수하세요.",
      },
    ],
    doAndDont: {
      do: ["서비스 정책을 정확히 파악한 후 콘텐츠 생성", "운영 시간, 이용 방법, 예약 경로를 정확히 명시", "AI 생성 결과물의 정책 정확성 검수"],
      dont: ["운영 정책을 확인하지 않고 AI 생성물 사용", "잘못된 운영 시간이나 방법을 안내", "정책 변경 후 콘텐츠 업데이트 누락"],
    },
    quiz: [
      { question: "서비스 안내 콘텐츠에서 가장 중요한 정확성 항목은?", options: ["디자인", "운영 시간과 이용 방법", "폰트 크기", "이미지 해상도"], answer: 1, explanation: "고객이 실제로 서비스를 이용할 때 필요한 운영 시간과 이용 방법의 정확성이 가장 중요합니다." },
    ],
  },

  "content-policy": {
    concepts: [
      { title: "콘텐츠 정책이 필요한 이유", body: "브랜드에 맞지 않는 표현, 잘못된 정보, 부정적인 언어가 콘텐츠에 포함되면 브랜드 가치를 훼손합니다. AI가 자동 생성한 콘텐츠에서도 이런 문제가 발생할 수 있으므로, 명확한 콘텐츠 정책과 자동 검수 체계가 필요합니다." },
      { title: "금지 표현 관리", body: "브랜드 가이드에 맞지 않는 표현이나 잘못된 정보를 포함하는 표현을 사전에 정의하고, 콘텐츠 생성 시 자동으로 감지하는 체계를 갖춰야 합니다. 각 금지 표현에는 대체 표현을 함께 정의해두세요." },
    ],
    practiceSteps: [
      { step: 1, title: "금지 표현 목록 작성", instruction: "자신의 서비스나 브랜드에서 사용하면 안 되는 표현 10개를 작성하고, 각각의 대체 표현도 함께 작성하세요.", tip: "부정적 언어, 브랜드 가치와 맞지 않는 표현, 정책에 어긋나는 표현을 포함하세요." },
      { step: 2, title: "자동 검수 체험", instruction: "AI가 생성한 콘텐츠에서 금지 표현을 직접 찾아보세요. 찾은 결과를 리포트로 작성합니다." },
      { step: 3, title: "Evaluator 규칙 설계", instruction: "콘텐츠 자동 검수를 위한 Evaluator 규칙 5개를 작성하세요. 각 규칙에 통과/실패 기준을 포함합니다." },
    ],
    examplePrompts: [
      {
        title: "금지 표현 탐지 실습",
        prompt: "아래 콘텐츠에서 브랜드 정책에 위반되는 표현을 모두 찾고, 대체 표현을 제안해주세요.\n\n[검수할 콘텐츠를 입력하세요]\n\n금지 표현 목록: [브랜드 금지 표현 목록]\n\n결과 형식:\n- 위반 표현: [표현]\n- 위반 이유: [이유]\n- 대체 표현: [대안]",
        expected: "모든 금지 표현이 감지되고, 각각 적절한 대체 표현이 제안되어야 합니다.",
      },
    ],
    doAndDont: {
      do: ["모든 AI 생성물을 검수 후 사용", "금지 표현 → 대체 표현 매핑 문서화", "Evaluator 자동 검수 활용"],
      dont: ["AI 생성물을 검수 없이 그대로 게시", "금지 표현을 비슷한 의미의 다른 부정 표현으로 대체", "검수 규칙을 한번 만들고 업데이트하지 않기"],
    },
  },

  "gemini-reasoning": {
    concepts: [
      { title: "Gemini = 사고 엔진", body: "Gemini는 전략 설계, 비교, 추론, 기준 문서 작성에 최적화된 도구입니다. '만들어줘'보다는 '비교해줘', '전략을 세워줘', '분석해줘'가 더 적합합니다." },
      { title: "3안 비교 프레임워크", body: "항상 3가지 이상의 안을 동시에 생성하고, 장단점을 비교한 후 최적안을 선택하세요. 이것이 Tree of Thoughts의 기본입니다." },
    ],
    practiceSteps: [
      { step: 1, title: "전략 3안 생성", instruction: "마케팅 또는 비즈니스 전략 3안을 AI에게 요청하세요. 각 안에 장점/단점/비용/실현가능성을 포함해야 합니다." },
      { step: 2, title: "비교 분석표 작성", instruction: "3안을 표로 비교하고, 가장 비합리적인 1안을 가지치기(제거)하세요. 제거 이유를 논리적으로 설명해야 합니다." },
      { step: 3, title: "최종 전략 선택 + 로드맵", instruction: "남은 2안 중 최종 1안을 선택하고, 12주 실행 로드맵을 작성하세요." },
    ],
    examplePrompts: [
      {
        title: "마케팅 전략 3안 생성",
        prompt: "당신은 마케팅 전략 컨설턴트입니다.\n\n3개월 내 목표 달성을 위한 전략 3안을 제시하세요.\n\n각 안에 포함:\n1. 전략명\n2. 핵심 아이디어 3줄\n3. 예상 비용\n4. 실현 가능성 (상/중/하)\n5. 장단점 각 3가지\n6. 12주 로드맵",
        expected: "3안을 비교 분석하고, 최적의 1안을 선택하여 12주 실행 계획으로 제출하세요.",
      },
    ],
    doAndDont: {
      do: ["항상 3안 이상 생성 후 비교", "가지치기로 약한 안 제거", "선택 이유를 논리적으로 설명"],
      dont: ["AI가 준 첫 번째 답을 그대로 사용", "1안만 생성하고 끝내기", "비교 없이 느낌으로 선택"],
    },
  },

  "freepik-lab": {
    concepts: [
      {
        title: "Freepik AI = 빠른 반복 제작 도구",
        body: "Freepik AI Image Generator는 브라우저에서 바로 사용 가능한 이미지 생성 도구입니다. 별도 설치 없이 텍스트 프롬프트만으로 이미지를 만들 수 있어, 빠른 반복 제작과 SNS 패키지 제작에 최적화되어 있습니다.",
      },
      {
        title: "Freepik AI 핵심 3가지 도구",
        body: "① AI Image Generator: 텍스트→이미지 생성 (Flux 모델 기반, 다양한 스타일 선택) ② Pikaso: 실시간 스케치→이미지 변환 캔버스 (그리면서 바로 AI 이미지 확인) ③ Reimagine: 기존 이미지 업로드→AI 변형 생성 (브랜드 일관성 유지에 유용)",
      },
      {
        title: "Freepik은 이미지 전문, 영상은 연동",
        body: "Freepik 자체로는 영상을 생성하지 않습니다. 핵심 워크플로우: Freepik AI(이미지 생성) → 배경 제거/Upscale → CapCut/Canva(모션+텍스트+BGM) → 숏폼 완성. AI 이미지를 9:16 비율로 생성하면 숏폼 배경으로 바로 활용 가능합니다.",
      },
      {
        title: "프롬프트 기본 공식",
        body: "[주제/피사체] + [환경/배경] + [스타일/분위기] + [조명] + [카메라/구도]. 예: 'A happy tourist walking through a market, sunny day, warm tones, lifestyle photography, wide angle'. 영어로 작성하는 것이 품질이 훨씬 좋습니다.",
      },
    ],
    practiceSteps: [
      {
        step: 1,
        title: "Freepik AI Image Generator 접속",
        instruction: "freepik.com 접속 → 회원가입/로그인 → 상단 메뉴 'AI Images' 또는 'Generate' 클릭. 무료 계정으로 하루 3~5회 생성 가능합니다.",
        tip: "무료 플랜으로 충분히 실습 가능! 유료는 실무 도입 시 결정하세요.",
      },
      {
        step: 2,
        title: "브랜드 이미지 생성하기",
        instruction: "아래 설정으로 이미지를 생성하세요:\n- Style: Photo (사진풍)\n- Aspect Ratio: 1:1 (인스타용) 또는 9:16 (릴스용)\n- 프롬프트에 브랜드 키워드 포함\n- Negative Prompt: 원치 않는 요소 명시",
        tip: "브랜드 컬러와 톤을 항상 프롬프트에 포함하세요!",
      },
      {
        step: 3,
        title: "동일 스타일로 3장 세트 만들기",
        instruction: "같은 스타일 키워드 세트를 유지하면서 주제만 바꿔 3장을 만드세요. 3장 모두 공통 스타일 키워드를 넣어야 합니다.",
        tip: "브랜드 일관성의 핵심: 동일한 스타일 키워드 세트를 반복 사용!",
      },
      {
        step: 4,
        title: "Pikaso로 아이디어 빠르게 시각화",
        instruction: "Pikaso 캔버스에서 간단한 스케치를 그리고, 프롬프트를 입력하세요. 스케치를 수정하면 AI 이미지가 실시간으로 바뀌는 것을 확인하세요.",
        tip: "아이디어 회의할 때 Pikaso를 쓰면 말로만 하던 것을 바로 시각화할 수 있어요!",
      },
      {
        step: 5,
        title: "Reimagine으로 기존 소재 변형하기",
        instruction: "기존 이미지 1장을 Reimagine에 업로드하세요. AI가 생성한 변형 이미지와 원본을 비교하고, 브랜드 일관성이 유지되었는지 평가하세요.",
        tip: "Reimagine은 기존 소재를 리뉴얼할 때 유용! 완전 새로 만드는 것보다 빠릅니다.",
      },
      {
        step: 6,
        title: "숏폼 영상 소재로 변환 (CapCut 연동)",
        instruction: "Freepik에서 만든 9:16 이미지를 CapCut에 가져와서:\n① 배경으로 배치\n② 줌인/줌아웃 키프레임 애니메이션 추가 (2~4초)\n③ 텍스트 오버레이 추가\n④ BGM 추가\n→ 15초 숏폼 완성!",
      },
    ],
    examplePrompts: [
      {
        title: "라이프스타일 이미지 (인스타 1:1)",
        prompt: "A happy young tourist walking through a bright city street with empty hands, warm golden hour lighting, travel lifestyle photography, candid shot, warm tones\n\nNegative: dark, heavy bags, stressed, tired, rain, cold",
        expected: "밝고 자유로운 라이프스타일 이미지. 밝은 톤, 자연광이 핵심입니다.",
      },
      {
        title: "카드뉴스 배경 (심플)",
        prompt: "Minimalist abstract background with soft warm gradient, subtle geometric shapes, clean modern design, perfect for text overlay, no people, simple and elegant\n\nNegative: busy, cluttered, dark, cold colors",
        expected: "텍스트 오버레이용 배경. 텍스트를 올렸을 때 가독성이 좋은지 확인하세요.",
      },
    ],
    doAndDont: {
      do: [
        "영어 프롬프트 사용 (품질 훨씬 좋음)",
        "동일 스타일 키워드 세트 반복 (브랜드 일관성)",
        "Negative Prompt로 원치 않는 요소 제거",
        "여러 번 생성 후 최적 결과물 선택",
        "9:16 비율로 생성하면 릴스 배경으로 바로 활용",
      ],
      dont: [
        "한국어 프롬프트만 사용 (품질 저하)",
        "매번 다른 스타일 키워드 사용 (일관성 깨짐)",
        "'예쁜 사진 만들어줘' 같은 모호한 프롬프트",
        "AI 생성 인물을 실제 인물이라고 사용",
        "한 번 생성으로 만족하고 반복 안 하기",
      ],
    },
    quiz: [
      { question: "Freepik AI에서 이미지 품질이 가장 좋은 프롬프트 언어는?", options: ["한국어", "영어", "일본어", "상관없음"], answer: 1, explanation: "Freepik AI 모델은 영어 프롬프트에 최적화되어 있습니다." },
      { question: "Pikaso의 핵심 기능은?", options: ["텍스트→영상 생성", "실시간 스케치→이미지 변환", "이미지→3D 모델", "음성→이미지 변환"], answer: 1, explanation: "Pikaso는 캔버스에 스케치를 그리면 실시간으로 AI 이미지로 변환하는 도구입니다." },
      { question: "Freepik에서 릴스용 이미지 비율은?", options: ["1:1", "16:9", "9:16", "4:3"], answer: 2, explanation: "릴스/숏폼은 세로형 9:16 비율입니다." },
      { question: "브랜드 일관성을 유지하는 핵심 방법은?", options: ["매번 다른 프롬프트 사용", "동일 스타일 키워드 세트 반복", "항상 같은 이미지 재사용", "프롬프트 없이 생성"], answer: 1, explanation: "동일한 스타일 키워드 세트를 모든 이미지에 공통으로 넣으면 일관성이 유지됩니다." },
    ],
  },

  "higgsfield-lab": {
    concepts: [
      {
        title: "Higgsfield = 시네마틱 영상 디렉션 도구",
        body: "Higgsfield AI는 이미지-투-비디오(Image-to-Video) 전문 도구로, 특히 카메라 무브먼트와 시네마틱 샷 프리셋이 강점입니다. 정적 이미지에 영화 같은 카메라 워크를 입혀 짧은 영상 클립을 생성합니다.",
      },
      {
        title: "카메라 무브 6가지 기본형",
        body: "① Pan (좌우 이동): 수평으로 카메라 이동. 공간감 표현. ② Tilt (상하 회전): 카메라를 위아래로 기울임. ③ Zoom In/Out (확대/축소): 피사체에 집중하거나 전체 보여주기. ④ Dolly (전후 이동): 카메라 자체가 앞뒤로 이동. 몰입감 극대화. ⑤ Orbit (궤도 회전): 피사체를 중심으로 회전. ⑥ Static (고정): 카메라 고정, 피사체만 움직임.",
      },
      {
        title: "숏폼 영상 = 이미지 + 카메라 무브 + 자막",
        body: "Higgsfield의 핵심 워크플로우: ① AI/실제 이미지 준비 → ② Higgsfield에서 카메라 무브 프리셋 선택 → ③ 프롬프트로 모션 방향 지시 → ④ 3~6초 클립 생성 → ⑤ 여러 클립을 CapCut에서 편집하여 15~60초 숏폼 완성",
      },
      {
        title: "프롬프트에서 카메라 무브 키워드",
        body: "영어 키워드 사전: slow pan left/right, tilt up/down, gentle zoom in, dolly forward/backward, orbit around, static shot, tracking shot, aerial view, low angle, high angle. 속도 조절: slowly, gently, smoothly, quickly, dynamically.",
      },
    ],
    practiceSteps: [
      {
        step: 1,
        title: "Higgsfield 접속 및 인터페이스 익히기",
        instruction: "higgsfield.ai 접속 → 회원가입 → Create Video 선택. 인터페이스를 둘러보고 어떤 옵션들이 있는지 확인하세요.",
        tip: "무료 플랜으로 하루 몇 회 생성 가능합니다. 프롬프트를 미리 준비해서 횟수를 아끼세요!",
      },
      {
        step: 2,
        title: "첫 번째 영상: 줌인 (Zoom In)",
        instruction: "이미지를 업로드하고, 아래 프롬프트로 줌인 영상을 만드세요:\n\n'Slow cinematic zoom in on the subject, soft ambient light, gentle movement, professional commercial feel'\n\n길이: 4초 / Motion 강도: 중간(5/10)",
        tip: "줌인은 가장 안전한 카메라 무브! 실패 확률이 낮아서 첫 실습에 적합해요.",
      },
      {
        step: 3,
        title: "두 번째 영상: 패닝 (Pan)",
        instruction: "풍경 이미지로 좌→우 패닝 영상을 만드세요:\n\n'Smooth slow pan from left to right, revealing the scene gradually, warm golden hour lighting, cinematic mood'\n\n길이: 4~6초",
        tip: "패닝은 공간감을 보여줄 때 최고!",
      },
      {
        step: 4,
        title: "세 번째 영상: 돌리 (Dolly Forward)",
        instruction: "입구/문/길 이미지로 전진하는 느낌의 돌리 영상을 만드세요:\n\n'Camera slowly moves forward through the entrance, revealing the interior, smooth dolly shot, inviting atmosphere'\n\n길이: 4초",
      },
      {
        step: 5,
        title: "숏폼 조립",
        instruction: "만든 3개 클립(줌인 + 패닝 + 돌리)을 CapCut에서 이어 붙여 15초 영상을 만드세요. + 자막 + BGM 추가",
        tip: "3개 클립의 톤(밝기, 색감)이 통일되었는지 확인! 안 맞으면 CapCut 필터로 조정.",
      },
      {
        step: 6,
        title: "카메라 무브 비교 실습",
        instruction: "동일한 이미지 1장으로 6가지 카메라 무브(Pan/Tilt/Zoom/Dolly/Orbit/Static)를 각각 적용해보세요. 어떤 카메라 무브가 어떤 감정/효과를 주는지 비교 리포트를 작성하세요.",
      },
    ],
    examplePrompts: [
      {
        title: "줌인 클립 프롬프트",
        prompt: "Slow cinematic zoom in on the subject, soft ambient light, gentle movement, professional commercial feel\n\nDuration: 4s / Motion: 5/10",
        expected: "부드럽게 확대되는 시네마틱 클립. 따뜻한 톤과 자연광이 핵심입니다.",
      },
      {
        title: "돌리 포워드 클립 프롬프트",
        prompt: "Camera slowly moves forward through the entrance, revealing the interior, smooth dolly shot, inviting atmosphere, warm lighting\n\nDuration: 5s / Motion: 5/10",
        expected: "앞으로 나아가는 몰입감 있는 클립. 내부 공간이 서서히 드러나야 합니다.",
      },
    ],
    doAndDont: {
      do: [
        "Motion 3~5로 시작, 결과 보고 조절",
        "프롬프트에 카메라 무브 키워드 명시 (pan, dolly, zoom 등)",
        "속도 키워드 포함 (slowly, gently, smoothly)",
        "여러 클립을 CapCut에서 조합하여 완성",
        "동일 이미지로 다양한 카메라 무브 실험하기",
      ],
      dont: [
        "Motion 8 이상으로 설정 (캐릭터 변형됨)",
        "프롬프트 없이 기본 설정으로만 생성",
        "한 번 생성으로 만족하기 (3~5번 반복 추천)",
        "15초 이상을 한 클립으로 만들려 하기 (3~6초씩 나눠서!)",
        "카메라 무브를 한 클립에 2개 이상 넣기 (1클립 = 1무브)",
      ],
    },
    quiz: [
      { question: "Pan은 어떤 카메라 움직임인가요?", options: ["상하 회전", "좌우 수평 이동", "전후 이동", "확대/축소"], answer: 1, explanation: "Pan은 카메라가 좌우로 수평 이동하는 것. 공간감을 보여줄 때 사용합니다." },
      { question: "Dolly Forward의 효과는?", options: ["뒤로 물러남", "앞으로 다가감 (몰입감)", "회전", "정지"], answer: 1, explanation: "Dolly Forward는 카메라가 앞으로 이동하여 몰입감을 만듭니다." },
      { question: "처음 실습할 때 추천하는 Motion 강도는?", options: ["1~2 (거의 안 움직임)", "3~5 (부드러운 움직임)", "8~10 (격한 움직임)", "상관없음"], answer: 1, explanation: "Motion 3~5가 가장 안전합니다." },
      { question: "1클립당 권장 카메라 무브 수는?", options: ["1개", "2개", "3개", "제한 없음"], answer: 0, explanation: "1클립 = 1카메라 무브가 원칙! 2개 이상 넣으면 부자연스러워집니다." },
    ],
  },

  "image-brand-assets": {
    concepts: [
      {
        title: "AI 이미지 생성의 브랜드 활용",
        body: "AI 이미지 생성 도구(Midjourney, DALL-E 등)를 활용하면 빠르게 브랜드 비주얼 에셋을 제작할 수 있습니다. 단, 브랜드 컬러, 자연광 Warm tone, 밝고 긍정적인 분위기를 반드시 준수해야 합니다.",
      },
      {
        title: "카드뉴스란 무엇인가",
        body: "카드뉴스는 이미지 + 텍스트를 결합한 SNS용 콘텐츠 포맷입니다. 3~5장 구성을 기본으로 하며, 첫 장은 시선을 끄는 헤드라인, 마지막 장은 CTA로 마무리합니다.",
      },
      {
        title: "프롬프트 작성의 기본 구조",
        body: "AI 이미지 프롬프트는 '주제(Subject) + 스타일(Style) + 분위기(Mood) + 기술 설정(Technical)' 4요소로 구성합니다. 브랜드 전용 프롬프트에는 브랜드 컬러와 톤을 기본 키워드로 포함하세요.",
      },
    ],
    practiceSteps: [
      {
        step: 1,
        title: "브랜드 키워드 세트 정리",
        instruction: "비주얼 가이드라인을 참고하여 AI 이미지 생성에 사용할 필수 키워드 세트를 정리하세요. 컬러, 톤, 분위기, 피사체 유형을 각각 3개 이상 작성합니다.",
        tip: "키워드 세트를 한번 만들어두면 모든 이미지 생성에 재사용할 수 있어요!",
      },
      {
        step: 2,
        title: "Midjourney/DALL-E 프롬프트 작성",
        instruction: "카드뉴스 표지용 이미지를 생성할 프롬프트를 작성하세요. 4요소(주제/스타일/분위기/기술설정)를 모두 포함해야 합니다.",
        tip: "Midjourney는 --ar 1:1 또는 --ar 4:5로 SNS 비율에 맞추세요.",
      },
      {
        step: 3,
        title: "카드뉴스 3종 스토리보드 설계",
        instruction: "카드뉴스 3종의 스토리보드를 각 3~5장 구성으로 설계하세요. 장마다 헤드라인, 이미지 설명, 텍스트 내용을 포함합니다.",
      },
      {
        step: 4,
        title: "AI 이미지 생성 및 검수",
        instruction: "스토리보드에 따라 AI 이미지를 생성한 후, 브랜드 가이드라인 체크리스트로 검수하세요.",
        tip: "생성된 이미지에 브랜드 컬러가 자연스럽게 포함되었는지 꼭 확인하세요.",
      },
      {
        step: 5,
        title: "최종 카드뉴스 조립 및 제출",
        instruction: "검수된 이미지와 텍스트를 조합하여 카드뉴스 3종을 완성하세요. 마지막 장에는 반드시 CTA를 포함합니다.",
      },
    ],
    examplePrompts: [
      {
        title: "카드뉴스 표지 이미지 생성",
        prompt: "A young traveler walking hands-free through a vibrant city street, golden hour warm natural lighting, bright and positive mood, lifestyle travel photography style, Canon EOS R5, 35mm lens, shallow depth of field --ar 4:5 --v 6",
        expected: "밝고 따뜻한 톤의 라이프스타일 이미지가 생성됩니다.",
      },
      {
        title: "DALL-E용 카드뉴스 배경 생성",
        prompt: "Create a warm, bright background image for a social media card news post. Soft gradient with subtle themed elements. Style: modern, clean, minimal. Aspect ratio: square.",
        expected: "카드뉴스 텍스트를 올릴 수 있는 깔끔한 배경 이미지가 생성됩니다.",
      },
    ],
    doAndDont: {
      do: [
        "브랜드 컬러를 강조색으로 일관되게 사용",
        "자연광, Warm tone, 밝고 긍정적인 분위기 유지",
        "카드뉴스 마지막 장에 CTA 포함",
        "AI 생성 이미지를 브랜드 가이드라인으로 반드시 검수",
      ],
      dont: [
        "차갑거나 어두운 톤(Blue, Dark)의 이미지 사용",
        "AI 생성 이미지를 검수 없이 바로 게시",
        "텍스트가 읽히지 않는 복잡한 배경 이미지 사용",
      ],
    },
    quiz: [
      {
        question: "AI 이미지 프롬프트의 4요소가 아닌 것은?",
        options: ["주제(Subject)", "가격(Price)", "분위기(Mood)", "기술 설정(Technical)"],
        answer: 1,
        explanation: "AI 이미지 프롬프트 4요소는 주제(Subject), 스타일(Style), 분위기(Mood), 기술 설정(Technical)입니다.",
      },
    ],
  },

  "video-shortform-production": {
    concepts: [
      {
        title: "Image-to-Video 워크플로우란",
        body: "AI 이미지를 먼저 생성한 후, Runway/Kling/Higgsfield 같은 도구로 영상으로 변환하는 제작 방식입니다. 브랜드 숏폼 제작에 최적화된 워크플로우입니다.",
      },
      {
        title: "카메라 무브 키워드 5가지",
        body: "Pan(좌우 이동), Tilt(상하 이동), Zoom(확대/축소), Dolly(전후 이동), Orbit(피사체 주위 회전). 이 5가지 키워드를 프롬프트에 넣으면 AI 영상의 카메라 움직임을 제어할 수 있습니다.",
      },
      {
        title: "15초 숏폼 구조",
        body: "Hook(0~3초, 시선 끌기) → Story(3~10초, 핵심 메시지 전달) → CTA(10~15초, 행동 유도). Hook에서 핵심 비주얼을 3초 안에 보여주는 것이 중요합니다.",
      },
      {
        title: "대본→TTS→립싱크 파이프라인",
        body: "①대본 작성 → ②TTS로 음성 생성 → ③AI 립싱크(HeyGen/D-ID)로 영상에 음성 합성 → ④편집(CapCut/Premiere). 대본 품질이 최종 영상 품질을 결정합니다.",
      },
    ],
    practiceSteps: [
      {
        step: 1,
        title: "15초 스토리보드 작성",
        instruction: "서비스 소개 15초 숏폼의 스토리보드를 작성하세요. Hook(0~3초)/Story(3~10초)/CTA(10~15초) 3단계로 구분하고, 각 구간의 화면 설명과 대사를 포함합니다.",
      },
      {
        step: 2,
        title: "카메라 무브 키워드 적용",
        instruction: "스토리보드의 각 장면에 적합한 카메라 무브 키워드(Pan/Tilt/Zoom/Dolly/Orbit)를 지정하세요.",
      },
      {
        step: 3,
        title: "Image-to-Video 프롬프트 작성",
        instruction: "스토리보드 첫 번째 장면을 기준으로 AI 이미지 생성 프롬프트와 Image-to-Video 변환 프롬프트를 각각 작성하세요.",
        tip: "Runway Gen-3는 프롬프트에 카메라 무브 키워드를 직접 넣을 수 있어요.",
      },
      {
        step: 4,
        title: "대본 및 TTS 스크립트 작성",
        instruction: "15초 분량의 내레이션 대본을 작성하세요. 한 문장당 15자 이내, 총 3~4문장으로 구성합니다.",
      },
      {
        step: 5,
        title: "최종 숏폼 기획서 제출",
        instruction: "스토리보드 + 카메라 무브 + 이미지 프롬프트 + 대본을 하나의 기획서로 정리하여 제출하세요.",
      },
    ],
    examplePrompts: [
      {
        title: "숏폼 Hook 장면 이미지 생성",
        prompt: "A cinematic close-up shot showing the concept of freedom and travel, bright cityscape in the background, golden hour lighting, warm tones, shallow depth of field, 4K quality --ar 9:16 --v 6",
        expected: "숏폼 세로 비율(9:16)의 Hook 장면 이미지가 생성됩니다.",
      },
      {
        title: "Runway Image-to-Video 프롬프트",
        prompt: "Camera slowly dollies forward, warm golden sunlight, gentle camera movement, cinematic feel, 4 seconds",
        expected: "정적 이미지에서 자연스러운 카메라 이동이 적용된 4초 영상 클립이 생성됩니다.",
      },
    ],
    doAndDont: {
      do: [
        "Hook 3초 안에 시선을 끄는 비주얼 배치",
        "카메라 무브 키워드를 프롬프트에 명시적으로 포함",
        "15초 구조(Hook/Story/CTA)를 철저히 준수",
      ],
      dont: [
        "30초 이상 늘어지는 숏폼 제작 (15초가 최적)",
        "카메라 움직임 없이 정적 이미지만 나열",
        "CTA 없이 영상 마무리",
      ],
    },
    quiz: [
      {
        question: "Image-to-Video 워크플로우의 올바른 순서는?",
        options: ["영상 촬영 → 이미지 추출 → 편집", "AI 이미지 생성 → AI 영상 변환 → 편집", "대본 작성 → 영상 촬영 → 이미지 생성", "편집 → 이미지 생성 → 영상 변환"],
        answer: 1,
        explanation: "AI 이미지를 먼저 생성한 후, 영상으로 변환하고, 최종 편집하는 순서입니다.",
      },
      {
        question: "15초 숏폼에서 Hook 구간의 적정 길이는?",
        options: ["0~1초", "0~3초", "0~7초", "0~10초"],
        answer: 1,
        explanation: "Hook은 0~3초로, 시청자의 시선을 끄는 가장 중요한 구간입니다.",
      },
    ],
  },

  "tts-audio-script": {
    concepts: [
      {
        title: "TTS 도구의 역할과 선택",
        body: "ElevenLabs와 Typecast는 텍스트를 자연스러운 음성으로 변환하는 TTS(Text-to-Speech) 도구입니다. ElevenLabs는 영어 음성 품질이 뛰어나고, Typecast는 한국어 음성에 강점이 있습니다.",
      },
      {
        title: "음성 파라미터 이해",
        body: "Stability(안정성): 높을수록 일관된 톤, 낮을수록 감정 표현 풍부. Similarity(유사도): 원본 음성과의 유사도 조절. Style(스타일): 읽기 스타일의 강도 조절.",
      },
      {
        title: "교육용 오디오 스크립트 작성 규칙",
        body: "①한 문장 20자 이내 ②전문 용어 뒤에 괄호 설명 추가 ③자연스러운 쉼표와 마침표로 호흡 조절 ④핵심 내용은 반복 언급 ⑤시작과 끝에 인사/시그니처 포함. TTS 품질은 스크립트 품질에 비례합니다.",
      },
    ],
    practiceSteps: [
      {
        step: 1,
        title: "TTS 도구 탐색",
        instruction: "ElevenLabs(elevenlabs.io)와 Typecast(typecast.ai)에 각각 접속하여 무료 체험으로 같은 문장을 음성으로 변환해보세요. 두 도구의 한국어/영어 음질 차이를 비교 메모합니다.",
        tip: "ElevenLabs는 무료 플랜에서도 여러 음성을 테스트할 수 있어요.",
      },
      {
        step: 2,
        title: "음성 파라미터 실험",
        instruction: "같은 문장을 Stability 0.3 / 0.7 / 1.0으로 각각 생성하여 차이를 비교하세요.",
      },
      {
        step: 3,
        title: "서비스 안내 스크립트 작성",
        instruction: "서비스 안내 TTS 스크립트(60초 분량)를 작성하세요. 교육용 오디오 스크립트 작성 규칙 5가지를 모두 적용해야 합니다.",
        tip: "60초 분량은 약 150~180자(한국어 기준)입니다.",
      },
      {
        step: 4,
        title: "TTS 생성 및 품질 검수",
        instruction: "작성한 스크립트를 TTS로 변환하고, 다음 체크리스트로 검수하세요: ①발음 정확성 ②호흡/쉼표 자연스러움 ③톤 일관성 ④속도 적절성.",
      },
      {
        step: 5,
        title: "최종 오디오 파일 제출",
        instruction: "검수 완료된 TTS 오디오 파일과 스크립트 원문을 함께 제출하세요.",
      },
    ],
    examplePrompts: [
      {
        title: "서비스 안내 TTS 스크립트 생성",
        prompt: "서비스 안내 TTS 스크립트를 작성해주세요.\n\n조건:\n- 분량: 60초 (약 150~180자)\n- 톤: 친근하고 간결하게\n- 포함 내용: 서비스 소개, 이용 방법 3단계, 운영 시간\n- 문장당 20자 이내",
        expected: "60초 분량의 자연스러운 안내 스크립트가 생성됩니다. 문장 길이와 정보 정확성을 검수하세요.",
      },
    ],
    doAndDont: {
      do: [
        "한 문장 20자 이내로 간결하게 작성",
        "쉼표와 마침표로 자연스러운 호흡 조절",
        "Stability 0.7 / Similarity 0.8 / Style 0.3 권장값 적용",
        "생성된 TTS를 반드시 재생하여 품질 검수",
      ],
      dont: [
        "한 문장에 30자 이상의 긴 문장 작성",
        "쉼표 없이 긴 문장을 이어붙이기",
        "TTS 생성 후 재생 검수 없이 바로 사용",
      ],
    },
    quiz: [
      {
        question: "교육용 오디오 스크립트에서 한 문장의 권장 길이는?",
        options: ["10자 이내", "20자 이내", "30자 이내", "제한 없음"],
        answer: 1,
        explanation: "교육용 오디오 스크립트는 한 문장 20자 이내를 권장합니다.",
      },
      {
        question: "한국어 TTS에 더 강점이 있는 도구는?",
        options: ["ElevenLabs", "Typecast", "ChatGPT", "Midjourney"],
        answer: 1,
        explanation: "Typecast는 한국어 음성에 강점이 있고, ElevenLabs는 영어 음성 품질이 뛰어납니다.",
      },
    ],
  },

  "opal-igo-design": {
    concepts: [
      {
        title: "IGO 구조란 무엇인가",
        body: "IGO는 Input-Generate-Output의 약자로, AI 워크플로우를 설계하는 프레임워크입니다. 핵심은 '최종 결과물(Output)을 먼저 정의하고, 거기서 역산하여 입력(Input)과 생성 과정(Generate)을 설계'하는 역방향 사고입니다.",
      },
      {
        title: "Planner / Generator / Evaluator 노드",
        body: "Planner 노드: 전략을 수립하고 생성 방향을 결정합니다. Generator 노드: 실제 콘텐츠를 생성합니다. Evaluator 노드: 생성된 결과를 기준에 따라 평가하고, 통과하지 못하면 Generator로 되돌립니다. 이 3단계 분리가 품질을 보장합니다.",
      },
      {
        title: "역산 설계의 원칙",
        body: "①최종 Output의 형태와 기준을 명확히 정의 ②Output을 만들기 위해 필요한 중간 산출물 나열 ③각 중간 산출물을 만들 수 있는 Input 정의 ④각 단계의 평가 기준(Evaluator 규칙) 설정.",
      },
    ],
    practiceSteps: [
      {
        step: 1,
        title: "Output 먼저 정의하기",
        instruction: "최종 Output으로 만들고 싶은 결과물을 설정하세요. Output의 형태, 톤, 포함 요소, 금지 요소를 명확히 정의합니다.",
        tip: "Output 정의가 구체적일수록 전체 워크플로우 품질이 올라갑니다!",
      },
      {
        step: 2,
        title: "역산으로 Input 설계",
        instruction: "정의한 Output을 만들기 위해 필요한 Input을 나열하세요.",
      },
      {
        step: 3,
        title: "3노드 분리 설계",
        instruction: "Planner(전략 수립) → Generator(콘텐츠 생성) → Evaluator(검수) 3단계를 각각 설계하세요.",
      },
      {
        step: 4,
        title: "Evaluator 규칙 작성",
        instruction: "Evaluator 노드의 검수 규칙을 작성하세요. 최소 5개 규칙을 포함해야 합니다.",
        tip: "Evaluator가 통과시키지 않으면 Generator로 자동 되돌아가는 루프를 설계하세요.",
      },
      {
        step: 5,
        title: "IGO 설계서 완성 및 제출",
        instruction: "전체 IGO 워크플로우를 하나의 설계서로 정리하세요. Input 목록, Planner 프롬프트, Generator 프롬프트, Evaluator 규칙, Output 기준을 모두 포함한 문서를 제출합니다.",
      },
    ],
    examplePrompts: [
      {
        title: "IGO 설계서 초안 생성",
        prompt: "광고 카피 생성을 위한 IGO(Input-Generate-Output) 워크플로우 설계서를 작성해주세요.\n\n최종 Output:\n- 광고 카피 150자 이내\n- 지정된 톤과 스타일\n- 필수 포함 요소 명시\n- 금지 표현 목록\n\n설계서에 포함할 것:\n1. Input 목록\n2. Planner 노드\n3. Generator 노드\n4. Evaluator 노드 (규칙 5개 이상)\n5. 실패 시 되돌림 루프 설명",
        expected: "5개 섹션이 모두 포함된 IGO 설계서가 생성됩니다.",
      },
    ],
    doAndDont: {
      do: [
        "최종 Output을 먼저 구체적으로 정의한 후 역산 설계",
        "Planner/Generator/Evaluator 3노드를 명확히 분리",
        "실패 시 Generator로 되돌리는 루프 설계",
        "각 노드의 프롬프트를 실제 사용 가능한 수준으로 작성",
      ],
      dont: [
        "Output 정의 없이 바로 생성부터 시작",
        "Evaluator 없이 생성 결과를 바로 사용",
        "추상적인 설계서만 작성하고 실제 프롬프트는 미작성",
      ],
    },
    quiz: [
      { question: "IGO의 약자가 올바르게 풀이된 것은?", options: ["Image-Generate-Output", "Input-Generate-Output", "Input-Grade-Output", "Idea-Generate-Optimize"], answer: 1, explanation: "IGO는 Input-Generate-Output의 약자로, AI 워크플로우 설계 프레임워크입니다." },
      { question: "IGO 역산 설계에서 가장 먼저 해야 할 것은?", options: ["Input 데이터 수집", "Generator 프롬프트 작성", "최종 Output 형태와 기준 정의", "Evaluator 규칙 작성"], answer: 2, explanation: "IGO 역산 설계의 핵심은 최종 Output을 먼저 정의하고, 거기서 역산하는 것입니다." },
    ],
  },

  "notebooklm-knowledge-core": {
    concepts: [
      {
        title: "NotebookLM이란",
        body: "NotebookLM은 Google이 만든 AI 기반 지식 도구입니다. 문서를 업로드하면 해당 문서의 내용만을 기반으로 답변하는 '출처 기반 AI'입니다. 일반 챗봇과 달리 환각(hallucination)을 최소화하고, 답변마다 출처를 표시합니다.",
      },
      {
        title: "지식 구조화",
        body: "브랜드 가이드, 운영 정책, FAQ 등을 NotebookLM에 체계적으로 업로드하면, 팀 누구나 정확한 정보를 즉시 확인할 수 있습니다. 이것이 '지식 코어(Knowledge Core)' 설계입니다.",
      },
      {
        title: "RAG의 기초 개념",
        body: "RAG(Retrieval-Augmented Generation)는 AI가 답변을 생성할 때 외부 문서에서 관련 정보를 검색(Retrieve)하여 답변에 활용(Augment)하는 기술입니다. NotebookLM이 바로 RAG의 대표적 예시입니다.",
      },
      {
        title: "팩트 체크의 중요성",
        body: "AI가 생성한 콘텐츠에 잘못된 정보가 포함될 수 있습니다. NotebookLM에 정책 문서를 넣어두면 팩트 체크 도구로 활용할 수 있습니다.",
      },
    ],
    practiceSteps: [
      {
        step: 1,
        title: "NotebookLM 접속 및 노트북 생성",
        instruction: "notebooklm.google.com에 접속하여 새 노트북을 생성하세요. Google 계정 로그인이 필요합니다.",
        tip: "노트북 이름에 버전을 명시하면 관리가 편해요.",
      },
      {
        step: 2,
        title: "핵심 문서 업로드",
        instruction: "브랜드 가이드, 운영 정책, FAQ 등 핵심 문서를 NotebookLM에 업로드하세요. 최소 4개 문서를 업로드해야 합니다.",
        tip: "문서 형식은 PDF, Google Docs, 텍스트 파일 모두 가능합니다.",
      },
      {
        step: 3,
        title: "지식 검증 질문 테스트",
        instruction: "NotebookLM에 서비스 관련 핵심 질문 5개를 하고 답변의 정확성을 확인하세요.",
      },
      {
        step: 4,
        title: "팩트 체크 실습",
        instruction: "AI가 생성한 콘텐츠를 NotebookLM에 붙여넣고 '이 내용에서 틀린 부분을 찾아줘'라고 요청하세요.",
        tip: "의도적으로 오류가 포함된 콘텐츠를 사용하면 더 효과적으로 실습할 수 있어요.",
      },
      {
        step: 5,
        title: "지식 코어 설계서 제출",
        instruction: "NotebookLM 지식 코어의 문서 구성, 활용 시나리오 3가지, 운영 규칙을 정리한 설계서를 제출하세요.",
      },
    ],
    examplePrompts: [
      {
        title: "NotebookLM 팩트 체크 요청",
        prompt: "아래 소개문에서 사실과 다른 내용을 찾아주세요.\n\n[검수할 콘텐츠]\n\n업로드된 정책 문서를 기준으로 각 오류를 지적하고, 올바른 내용을 알려주세요.",
        expected: "NotebookLM이 출처를 표시하며 오류를 지적합니다.",
      },
      {
        title: "NotebookLM 기반 FAQ 생성",
        prompt: "업로드된 정책 문서를 기반으로 자주 물어볼 FAQ 10개를 생성해주세요.\n\n조건:\n- 각 답변에 출처 문서 표시\n- 핵심 운영 정보를 반드시 포함\n- 명확한 서술문 형태로 작성",
        expected: "정책 문서에 근거한 정확한 FAQ 10개가 생성됩니다.",
      },
    ],
    doAndDont: {
      do: [
        "정책 문서를 항상 최신 버전으로 유지",
        "NotebookLM 답변의 출처 표시를 반드시 확인",
        "AI 생성 콘텐츠의 팩트 체크 도구로 적극 활용",
        "노트북 버전을 명시하여 문서 관리 체계화",
      ],
      dont: [
        "정책 변경 후 NotebookLM 문서를 업데이트하지 않기",
        "NotebookLM 답변을 출처 확인 없이 그대로 사용",
        "오래된 버전의 정책 문서를 방치",
      ],
    },
    quiz: [
      { question: "NotebookLM의 핵심 특징은?", options: ["인터넷 검색 기반 답변", "업로드된 문서 기반 출처 표시 답변", "이미지 생성 기능", "실시간 번역 기능"], answer: 1, explanation: "NotebookLM은 업로드된 문서만을 기반으로 답변하며, 답변마다 출처를 표시하는 것이 핵심 특징입니다." },
      { question: "RAG의 올바른 풀이는?", options: ["Real-time AI Generation", "Retrieval-Augmented Generation", "Random Answer Generator", "Recursive Algorithm Growth"], answer: 1, explanation: "RAG는 Retrieval-Augmented Generation으로, 외부 문서 검색을 통해 AI 답변의 정확성을 높이는 기술입니다." },
    ],
  },

  "mini-app-planning": {
    concepts: [
      { title: "미니 앱이란?", body: "사내 미니 앱은 특정 반복 업무를 자동화하기 위해 자연어 프롬프트 구조로 설계하는 소형 워크플로우입니다. 코딩 없이, 목표 정의 → 입력/출력 설계 → 프롬프트 체인 구성만으로 실무 도구를 만들 수 있습니다." },
      { title: "자연어로 목표 정의하기", body: "미니 앱 설계의 첫 단계는 '이 앱이 무엇을 해결하는가'를 한 문장으로 정의하는 것입니다. 목표가 모호하면 결과물도 모호해집니다." },
      { title: "Planner/Generator/Evaluator 구조", body: "미니 앱 내부는 세 단계로 나뉩니다. Planner: 입력을 분석하고 실행 계획 수립. Generator: 계획에 따라 콘텐츠 생성. Evaluator: 결과물을 기준에 따라 검수. 이 세 단계를 분리하면 각각 독립적으로 개선할 수 있습니다." },
    ],
    practiceSteps: [
      { step: 1, title: "해결할 반복 업무 선정", instruction: "실무에서 매주 반복되는 업무를 3개 이상 나열하세요. 그중 AI 자동화 효과가 가장 큰 1개를 선정하고, 이유를 적으세요.", tip: "반복 횟수가 많고, 결과물 형식이 정형화된 업무일수록 미니 앱 효과가 큽니다." },
      { step: 2, title: "한 문장 목표 정의", instruction: "선정한 업무를 '[누가] [무엇을 입력하면] [어떤 결과물이] [어떤 기준으로] 나온다' 형식으로 한 문장 정의하세요." },
      { step: 3, title: "입력/출력 명세서 작성", instruction: "미니 앱의 입력 항목(필수/선택), 출력 형식(텍스트/표/JSON), 검수 기준을 표로 정리하세요." },
      { step: 4, title: "PGE 흐름도 작성", instruction: "Planner/Generator/Evaluator 3단계 흐름도를 작성하세요. 각 단계별로 프롬프트 초안과 예상 입력/출력을 포함해야 합니다.", tip: "Evaluator 단계에서 '통과/반려/재생성' 분기가 반드시 있어야 합니다." },
      { step: 5, title: "미니 앱 설계서 완성", instruction: "위 단계를 종합하여 미니 앱 설계서 1장을 완성하세요. 목표 정의, 입출력 명세, 3단계 흐름도, 예시 실행 결과를 모두 포함해야 합니다." },
    ],
    examplePrompts: [
      { title: "미니 앱 설계서 생성", prompt: "사내 미니 앱 설계서를 작성해주세요.\n\n앱 목표: [목표를 한 문장으로 입력]\n입력: [입력 항목]\n출력: [출력 형식 및 기준]\n\n설계서에 포함:\n1. Planner 프롬프트\n2. Generator 프롬프트\n3. Evaluator 검수 기준\n4. 통과/반려/재생성 분기 조건", expected: "3단계가 분리되었는지, Evaluator에 검수 기준이 구체적으로 포함되었는지 확인." },
    ],
    doAndDont: {
      do: ["한 문장 목표 정의부터 시작", "입력/출력을 구체적으로 명세", "PGE 3단계 분리", "Evaluator에 검수 기준 명시"],
      dont: ["목표 없이 시작", "3단계를 하나의 프롬프트에 넣기", "Evaluator 없이 Generator 결과 사용", "테스트 없이 설계서만 제출"],
    },
    quiz: [
      { question: "미니 앱 설계의 첫 단계는?", options: ["프롬프트 작성", "코드 개발", "한 문장 목표 정의", "UI 디자인"], answer: 2, explanation: "미니 앱 설계는 '이 앱이 무엇을 해결하는가'를 한 문장으로 정의하는 것에서 시작합니다." },
      { question: "PGE를 분리하는 이유는?", options: ["프롬프트가 길어서", "각 단계를 독립적으로 개선 가능", "AI가 요구해서", "코드 구조 때문"], answer: 1, explanation: "분리하면 Generator만 바꾸거나 Evaluator 기준만 강화하는 등 독립적 개선이 가능합니다." },
    ],
  },

  "planner-generator-evaluator": {
    concepts: [
      { title: "하네스 엔지니어링이란?", body: "AI를 하나의 프롬프트가 아니라, 역할별로 분리된 프롬프트 체인으로 연결하는 설계 방식입니다. 각 부품(AI 역할)을 정해진 경로로 연결하여 안정적인 결과를 만듭니다." },
      { title: "각 역할의 입력/출력", body: "Planner: 사용자 입력 → 실행 계획. Generator: 실행 계획 → 콘텐츠 초안. Evaluator: 초안 + 검수 기준 → 통과/반려 판정 + 피드백. 각 단계의 출력이 다음 단계의 입력이 됩니다." },
      { title: "검수 루프: 통과/반려/재생성", body: "Evaluator 판정: ① 통과 → 최종 출력 ② 반려 → 피드백과 함께 Generator로 반환 ③ 재생성 → Planner부터 다시. 반려 루프는 최대 3회로 제한하여 무한 루프를 방지합니다." },
      { title: "왜 분리해야 하는가?", body: "하나의 프롬프트에 모두 넣으면 AI가 자기 결과를 관대하게 평가합니다. 역할을 분리하면 Evaluator가 Generator 결과를 객관적으로 검수하고, 각 단계를 독립적으로 개선할 수 있습니다." },
    ],
    practiceSteps: [
      { step: 1, title: "단일 vs 분리 프롬프트 비교", instruction: "같은 과제를 ① 단일 프롬프트 ② PGE 분리 방식으로 실행하고 결과를 비교하세요." },
      { step: 2, title: "Planner 프롬프트 설계", instruction: "입력(채널, 언어, 목적)을 받아 실행 계획(톤, 길이, 키워드, 검수 기준)을 출력하는 Planner를 설계하세요." },
      { step: 3, title: "Generator 프롬프트 설계", instruction: "Planner 출력을 받아 콘텐츠를 생성하는 Generator를 설계하세요." },
      { step: 4, title: "Evaluator + 검수 루프 설계", instruction: "검수 항목과 통과/반려/재생성 판정 기준, 피드백 형식을 정의하세요.", tip: "피드백 형식: '[위반 항목] → [위반 내용] → [수정 방향]'" },
      { step: 5, title: "전체 파이프라인 실행", instruction: "PGE를 순서대로 실행하고 반려→재생성 과정을 기록하여 제출하세요." },
    ],
    examplePrompts: [
      { title: "Planner 프롬프트", prompt: "당신은 콘텐츠 Planner입니다.\n\n입력: 채널, 언어, 목적, 타겟\n\n출력 형식:\n1. 톤 선택 + 이유\n2. 길이 (글자 수)\n3. 필수 키워드 3~5개\n4. 검수 기준\n5. CTA", expected: "계획이 구체적인지, 검수 기준이 명확히 포함되었는지 확인." },
      { title: "Evaluator 프롬프트", prompt: "당신은 콘텐츠 Evaluator입니다.\n\n아래 콘텐츠를 검수하세요:\n---\n[Generator 결과물]\n---\n\n검수 기준:\n1. 브랜드 가이드 준수\n2. 정보 정확성\n3. 톤 일관성\n\n판정: 통과/반려/재생성\n반려 시: [위반 항목] → [위반 내용] → [수정 방향]", expected: "구체적 피드백이 있는지, 판정 기준이 명확한지 확인." },
    ],
    doAndDont: {
      do: ["PGE를 별도 프롬프트로 분리", "입력/출력 형식 명확히 정의", "실패 시 되돌리는 루프 설계", "반려 피드백에 수정 방향 포함"],
      dont: ["하나의 프롬프트에 모두 요청", "Evaluator 없이 바로 사용", "피드백 없이 '다시 해줘'만 전달", "같은 대화창에서 Generator+Evaluator 실행"],
    },
    quiz: [
      { question: "하네스 엔지니어링의 핵심은?", options: ["완벽한 프롬프트 1개", "역할별 프롬프트 체인 분리", "AI 모델 여러 개 사용", "프롬프트 길게 작성"], answer: 1, explanation: "역할을 Planner/Generator/Evaluator로 분리하고 체인으로 연결하는 것이 핵심입니다." },
      { question: "같은 대화창에서 Generator+Evaluator를 하면 안 되는 이유는?", options: ["속도 느림", "비용 문제", "AI가 자기 결과를 관대하게 평가", "기술적 불가능"], answer: 2, explanation: "같은 대화에서 생성과 검수를 하면 AI가 자기 결과물을 관대하게 평가합니다." },
    ],
  },

  "content-production-case": {
    concepts: [
      { title: "콘텐츠 제작 자동화 워크플로우", body: "기획(Planner) → 생성(Generator) → 검수(Evaluator) → 수정 → 게시. 사람은 기획과 최종 승인에 집중하고, 반복 작업은 AI가 처리합니다." },
      { title: "다국어 현지화", body: "단순 번역이 아닌 현지화입니다. 각 언어권의 문화적 맥락, 표현 방식, 톤을 반영하여 재작성해야 합니다." },
      { title: "채널별 콘텐츠 변형", body: "인스타: 150자+이미지, 블로그: 800~1500자, 카드뉴스: 5~7장 슬라이드, 구글 비즈니스: 100자 단문. Generator에 채널별 출력 형식을 지정하면 다채널 동시 생산 가능합니다." },
    ],
    practiceSteps: [
      { step: 1, title: "원본 콘텐츠 생성", instruction: "SNS 게시물 1개를 작성하세요. 150자 이내, CTA 포함." },
      { step: 2, title: "Evaluator 검수", instruction: "생성한 원본을 브랜드 기준으로 검수하세요. 반려 시 수정 후 재검수." },
      { step: 3, title: "다국어 현지화", instruction: "검수 통과한 원본을 영어, 일본어, 중국어로 현지화하세요. 문화적 맥락 반영 필수.", tip: "영어: 캐주얼, 일본어: 정중, 중국어: 간결 실용적" },
      { step: 4, title: "현지화 검수", instruction: "각 언어에서 부자연스러운 표현, 정책 정보 정확성을 검수하세요." },
      { step: 5, title: "채널 변형 제출", instruction: "영어 버전을 인스타(150자)와 블로그(500자)로 변형하여 제출하세요." },
    ],
    examplePrompts: [
      { title: "3개 언어 현지화", prompt: "한국어 원본을 3개 언어로 현지화하세요.\n\n원본: [원본 텍스트]\n\n언어: 영어, 중국어(간체), 일본어\n조건: 현지화(번역X), 각 150자 이내", expected: "현지에서 자연스러운지, 정책 정보가 정확한지 검수." },
      { title: "채널별 변형", prompt: "SNS 게시물을 블로그(800자)와 카드뉴스(5장)로 변형하세요.\n블로그: 소제목 3개+\n카드뉴스: 마지막 장 CTA", expected: "블로그 정보 밀도, 카드뉴스 독립 이해 가능 여부 확인." },
    ],
    doAndDont: {
      do: ["원본 검수 후 현지화", "문화적 맥락 반영", "각 언어별 Evaluator 검수", "채널별 출력 형식 지정"],
      dont: ["검수 없이 게시", "구글 번역기만으로 현지화", "모든 채널에 같은 형식", "원본 반려인데 현지화 먼저"],
    },
    quiz: [
      { question: "현지화와 번역의 차이는?", options: ["글자 수", "문화적 맥락 반영 여부", "AI 모델 종류", "비용"], answer: 1, explanation: "현지화는 문화권의 표현 방식, 톤, 관심사를 반영하여 재작성합니다." },
    ],
  },

  "seo-geo": {
    concepts: [
      { title: "SEO vs GEO", body: "SEO는 구글 검색 상위 노출, GEO는 AI(ChatGPT, Gemini)가 해당 서비스를 인용하도록 최적화. SEO는 '클릭' 유도, GEO는 '인용' 유도. 둘 다 필요합니다." },
      { title: "키워드 전략", body: "영어와 한국어 키워드를 모두 타겟합니다. 롱테일 키워드 중심으로 콘텐츠를 설계하면 경쟁이 낮고 전환율이 높습니다." },
      { title: "GEO 최적화", body: "AI 인용용: 구조화된 FAQ, 명확한 서술문, Schema.org 마크업, 외부 신뢰 소스 등록." },
    ],
    practiceSteps: [
      { step: 1, title: "키워드 리서치", instruction: "서비스 관련 키워드 30개(영어/한국어)를 생성하고 검색 의도별로 분류하세요.", tip: "롱테일 키워드가 경쟁 낮고 전환율 높아요." },
      { step: 2, title: "SEO 랜딩 페이지 카피", instruction: "메타 타이틀(60자), 메타 디스크립션(155자), H1, H2 3개+, 본문 500자+, FAQ 3개를 작성하세요.", tip: "메타 타이틀에 키워드를 앞쪽에 배치!" },
      { step: 3, title: "GEO FAQ 작성", instruction: "AI 인용용 FAQ 10개(영어5+한국어5). 각 답변 2~3문장, 명확한 서술문으로.", tip: "AI는 '~입니다'로 끝나는 명확한 문장을 인용하기 좋아해요." },
      { step: 4, title: "통합 제출", instruction: "랜딩 페이지 카피 + FAQ를 하나로 제출. 브랜드 가이드 검수 필수." },
    ],
    examplePrompts: [
      { title: "SEO 랜딩 페이지", prompt: "서비스 영문 랜딩 페이지 카피를 작성하세요.\n포함: Meta Title(60자), Meta Description(155자), H1, H2 3개+, 본문 500자+, FAQ 3개\n조건: 브랜드 톤 준수, Balance 모드", expected: "메타 타이틀에 키워드 포함, FAQ가 AI 인용 적합한지 확인." },
      { title: "GEO FAQ", prompt: "FAQ 10개를 AI 인용 최적화 형태로 작성하세요.\n영어 5개 + 한국어 5개\n각 답변 2~3문장, 수치 포함, Schema.org 호환", expected: "각 답변이 독립적으로 완결되는지, AI가 그대로 인용 가능한지 확인." },
    ],
    doAndDont: {
      do: ["메타 타이틀 60자, 키워드 앞배치", "FAQ는 명확한 서술문으로", "영어/한국어 키워드 모두 타겟", "Schema.org 마크업"],
      dont: ["키워드 스터핑", "잘못된 정보 입력", "모든 페이지에 같은 메타 타이틀", "GEO 무시하고 SEO만"],
    },
    quiz: [
      { question: "SEO와 GEO의 차이는?", options: ["비용", "SEO는 클릭, GEO는 AI 인용", "SEO는 한국어, GEO는 영어", "없음"], answer: 1, explanation: "SEO는 검색 클릭 유도, GEO는 AI 인용 유도입니다." },
      { question: "메타 타이틀 권장 길이는?", options: ["30자", "60자", "100자", "제한 없음"], answer: 1, explanation: "60자 이내로 작성해야 검색 결과에서 잘리지 않습니다." },
      { question: "GEO에 가장 효과적인 콘텐츠 형태는?", options: ["이미지", "구조화된 FAQ", "동영상", "PDF"], answer: 1, explanation: "AI는 명확하고 구조화된 서술문을 인용하기 좋아합니다." },
    ],
  },
};

export function getModuleContent(slug: string): ModuleContent | null {
  return MODULE_CONTENTS[slug] || null;
}
