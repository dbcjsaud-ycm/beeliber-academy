// 모듈별 학습 콘텐츠 (실습 가이드, 핵심 개념, 예시 프롬프트)

export interface ModuleContent {
  concepts: { title: string; body: string }[];
  practiceSteps: { step: number; title: string; instruction: string; tip?: string }[];
  examplePrompts: { title: string; prompt: string; expected: string }[];
  doAndDont: { do: string[]; dont: string[] };
  quiz?: { question: string; options: string[]; answer: number; explanation: string }[];
}

export const MODULE_CONTENTS: Record<string, ModuleContent> = {
  "brand-phase1": {
    concepts: [
      {
        title: "빌리버는 짐을 맡기는 곳이 아닙니다",
        body: "빌리버는 여행을 시작하는 곳입니다. 단순 보관 서비스가 아니라, 여행자에게 '무게가 사라진 시간과 자유'를 배달하는 것이 핵심 가치입니다.",
      },
      {
        title: "Phase 1 운영 기준",
        body: "현재 빌리버는 Phase 1 기준으로 운영됩니다. Hub 6개 지점에서 보관+배송, 파트너 33개+ 지점에서 보관 전용 서비스를 제공합니다. 배송은 오직 Hub→인천공항 당일 배송만 운영합니다.",
      },
      {
        title: "브랜드 보이스 4가지",
        body: "경쾌함(Energetic) · 친근함(Warm) · 간결함(Concise) · 담담함(Calm). SNS에서는 경쾌함과 친근함을 최대로, CS에서는 담담함과 간결함을 최대로 올립니다.",
      },
    ],
    practiceSteps: [
      { step: 1, title: "금지 표현 10개 암기", instruction: "저렴한 / 싼 / 할인 / 힘들다 / 무겁다 / 택배 / 물류 / AI기반솔루션 / 호텔픽업 / 공항→호텔배송 을 모두 외우세요.", tip: "각 금지어마다 대체 표현도 함께 외우면 좋아요!" },
      { step: 2, title: "톤 3가지 모드 구분 실습", instruction: "같은 메시지를 Active/Balance/Trust 3가지 모드로 각각 작성해보세요. AI에게 '빌리버 배송 서비스를 Active 모드로 설명해줘'라고 요청해보세요.", tip: "Active = SNS, Balance = 블로그, Trust = 공지문" },
      { step: 3, title: "AI 생성 콘텐츠 검수 실습", instruction: "AI에게 빌리버 소개문을 생성시킨 후, 금지어와 정책 위반을 직접 찾아보세요. 찾은 결과를 과제로 제출합니다." },
    ],
    examplePrompts: [
      {
        title: "빌리버 소개문 생성 (검수용)",
        prompt: "당신은 빌리버(beeliber) 마케팅 카피라이터입니다.\n\n빌리버 서비스를 200자 이내로 소개해주세요.\n- 대상: 한국 여행 중인 외국인\n- 톤: Active 모드 (경쾌하고 친근하게)\n- 포함: 서비스 종류, 운영 시간, 예약 방법\n- 마무리: 브랜드 시그니처",
        expected: "이 결과물에서 금지 표현이 있는지, 운영 시간이 정확한지, 배송 방향이 맞는지 검수하세요.",
      },
      {
        title: "금지 표현 대체 연습",
        prompt: "아래 문장에서 빌리버 금지 표현을 찾고 대체해주세요:\n\n'빌리버는 저렴한 가격으로 호텔에서 공항까지 택배 서비스를 제공합니다. AI 기반 솔루션으로 무거운 짐을 쉽게 배송해드립니다.'\n\n금지 표현 목록: 저렴한, 싼, 할인, 힘들다, 무겁다, 택배, 물류, AI기반솔루션, 호텔픽업, 공항→호텔배송",
        expected: "6개의 금지 표현을 찾고, 각각 적절한 대체 표현으로 바꿀 수 있어야 합니다.",
      },
    ],
    doAndDont: {
      do: [
        "짐 없는 자유 → 여행의 자유를 강조",
        "bee-liber.com 으로 예약 안내",
        "Hub→인천공항 당일 배송만 언급",
        "운영 시간 09:00~21:00 정확히 명시",
        "마무리 시그니처: 가벼운 여행 되세요! 🐝",
      ],
      dont: [
        "저렴한 / 싼 / 할인 표현 사용",
        "공항→호텔 배송 또는 호텔 픽업 언급",
        "택배 / 물류 / AI기반솔루션 표현",
        "24시간 운영 가능하다는 내용",
        "카카오톡이나 현장 방문으로 예약 안내",
      ],
    },
    quiz: [
      { question: "빌리버의 현재 배송 방향은?", options: ["공항→호텔", "호텔→공항", "Hub→인천공항", "어디든 가능"], answer: 2, explanation: "빌리버 Phase 1에서는 Hub 지점→인천공항 당일 배송만 운영합니다." },
      { question: "'저렴한 가격'의 올바른 대체 표현은?", options: ["싼 가격", "할인된 가격", "스마트한 여행 파트너", "무료 서비스"], answer: 2, explanation: "'저렴한', '싼', '할인'은 모두 금지 표현입니다. '스마트한 여행 파트너'가 올바른 대체입니다." },
      { question: "빌리버 운영 시간은?", options: ["24시간", "08:00~22:00", "09:00~21:00", "10:00~20:00"], answer: 2, explanation: "전 제휴 파트너 지점 동일하게 09:00~21:00입니다." },
      { question: "Hub 지점에서 짐을 맡기는 마감 시간은?", options: ["09:00~11:00", "09:00~13:00", "09:00~15:00", "09:00~17:00"], answer: 1, explanation: "Hub 배송 접수는 09:00~13:00이며, 공항 수령은 16:00~21:00입니다." },
    ],
  },

  "service-flow-policy": {
    concepts: [
      { title: "Hub vs Partner 지점", body: "Hub 6개 지점: 배송+보관 모두 운영 (연남/이태원/동대문/마포/홍대바오/명동본점). 파트너 33개+ 지점: 보관 전용 (Moneybox)." },
      { title: "보관 서비스 흐름", body: "① bee-liber.com 예약 → ② 지점 방문하여 짐 맡김 → ③ 찾을 때 지점 재방문" },
      { title: "배송 서비스 흐름", body: "① bee-liber.com 예약 → ② Hub 지점 방문 (오전 9~1시) → ③ 빌리버가 인천공항으로 당일 배송 → ④ 공항에서 수령 (오후 4~9시)" },
    ],
    practiceSteps: [
      { step: 1, title: "서비스 흐름 배열하기", instruction: "보관과 배송 서비스의 단계를 올바른 순서로 배열해보세요." },
      { step: 2, title: "Hub/Partner 구분 실습", instruction: "AI에게 '빌리버 지점 소개'를 요청한 후, Hub와 Partner가 정확히 구분되었는지 검수하세요.", tip: "Hub 지점은 6개뿐! 그 외는 전부 파트너(보관 전용)입니다." },
      { step: 3, title: "운영 정책 O/X 퀴즈", instruction: "모듈 하단의 퀴즈를 풀어보세요. 모두 맞아야 과제 제출이 가능합니다." },
    ],
    examplePrompts: [
      {
        title: "서비스 흐름 설명 생성",
        prompt: "빌리버의 보관 서비스와 배송 서비스 흐름을 외국인 여행자가 이해하기 쉽도록 영어로 설명해주세요.\n\n조건:\n- 보관: 3단계\n- 배송: 4단계 (시간 포함)\n- 예약은 반드시 bee-liber.com\n- Hub→인천공항만 배송 가능",
        expected: "생성된 결과에서 시간, 방향, 예약 방법이 모두 정확한지 검수하세요.",
      },
    ],
    doAndDont: {
      do: ["Hub 6개와 Partner 33개+ 정확히 구분", "배송 접수 09~13시, 수령 16~21시 명시", "예약은 bee-liber.com만"],
      dont: ["Hub와 Partner를 섞어서 안내", "13시 이후 접수 가능하다고 안내", "원하는 곳으로 배송 가능하다고 안내"],
    },
    quiz: [
      { question: "배송 서비스를 제공하는 지점 유형은?", options: ["파트너 지점", "Hub 지점", "모든 지점", "인천공항"], answer: 1, explanation: "배송은 Hub 6개 지점에서만 가능합니다. 파트너 지점은 보관 전용입니다." },
      { question: "Hub 지점 수는?", options: ["3개", "6개", "10개", "33개"], answer: 1, explanation: "Hub 지점은 연남/이태원/동대문/마포/홍대바오/명동본점 총 6개입니다." },
    ],
  },

  "forbidden-phrases": {
    concepts: [
      { title: "왜 금지 표현이 중요한가", body: "빌리버는 '짐을 맡기는 곳'이 아니라 '여행을 시작하는 곳'입니다. '저렴한', '택배' 같은 표현은 브랜드 가치를 훼손합니다. AI가 자동 생성한 콘텐츠에서 이런 표현이 나오면 즉시 수정해야 합니다." },
      { title: "금지 표현 → 대체 표현 매핑", body: "저렴한 → 스마트한 여행 파트너 | 택배 → 여행 자유 배달 서비스 | 짐 맡기세요 → 빈손으로 여행을 시작하세요 | 물류 → (삭제) | AI 기반 → (삭제)" },
    ],
    practiceSteps: [
      { step: 1, title: "금지 표현 사냥 실습", instruction: "AI가 생성한 5개 콘텐츠에서 금지 표현을 모두 찾아 리포트를 작성하세요.", tip: "각 금지어마다 어떤 대체 표현으로 바꿀 수 있는지도 함께 적으세요." },
      { step: 2, title: "자동 검수 체험", instruction: "실습 공간에 AI가 생성한 콘텐츠를 붙여넣고 '자동 검수 미리보기' 버튼을 눌러보세요. Evaluator가 어떻게 감지하는지 확인할 수 있습니다." },
      { step: 3, title: "Evaluator 규칙 설계 실습", instruction: "기존 10개 외에 추가로 감지해야 할 표현 3개를 제안하고, 왜 금지해야 하는지 설명하세요." },
    ],
    examplePrompts: [
      {
        title: "의도적 오류 콘텐츠 생성",
        prompt: "빌리버 SNS 게시물 5개를 작성하되, 각 게시물에 금지 표현을 1~2개 의도적으로 포함시켜주세요.\n\n금지 표현: 저렴한, 싼, 할인, 힘들다, 무겁다, 택배, 물류, AI기반솔루션, 호텔픽업, 공항→호텔배송\n\n채널: 인스타그램 Threads\n톤: Active 모드\n각 150자 이내",
        expected: "5개 게시물에서 모든 금지 표현을 찾고, 대체 표현으로 수정한 버전을 제출하세요.",
      },
    ],
    doAndDont: {
      do: ["모든 AI 생성물을 검수 후 사용", "금지어 → 대체어 매핑을 항상 참조", "Evaluator 자동 검수를 활용"],
      dont: ["AI 생성물을 검수 없이 그대로 게시", "금지어를 비슷한 의미의 다른 부정 표현으로 대체", "'검수했다'고 하면서 실제로 안 하기"],
    },
  },

  "gemini-reasoning": {
    concepts: [
      { title: "Gemini = 사고 엔진", body: "Gemini는 전략 설계, 비교, 추론, 기준 문서 작성에 최적화된 도구입니다. '만들어줘'보다는 '비교해줘', '전략을 세워줘', '분석해줘'가 더 적합합니다." },
      { title: "3안 비교 프레임워크", body: "항상 3가지 이상의 안을 동시에 생성하고, 장단점을 비교한 후 최적안을 선택하세요. 이것이 Tree of Thoughts의 기본입니다." },
    ],
    practiceSteps: [
      { step: 1, title: "전략 3안 생성", instruction: "빌리버 인스타그램 성장 전략 3안을 AI에게 요청하세요. 각 안에 장점/단점/비용/실현가능성을 포함해야 합니다." },
      { step: 2, title: "비교 분석표 작성", instruction: "3안을 표로 비교하고, 가장 비합리적인 1안을 가지치기(제거)하세요. 제거 이유를 논리적으로 설명해야 합니다." },
      { step: 3, title: "최종 전략 선택 + 로드맵", instruction: "남은 2안 중 최종 1안을 선택하고, 12주 실행 로드맵을 작성하세요." },
    ],
    examplePrompts: [
      {
        title: "마케팅 전략 3안 생성",
        prompt: "당신은 빌리버의 마케팅 전략 컨설턴트입니다.\n\n현황:\n- 인스타 213명\n- Hub 6개 + 파트너 33개+\n- 핵심 타겟: 라스트데이 외국인 여행자\n\n3개월 내 팔로워 1,000명 달성 전략 3안을 제시하세요.\n\n각 안에 포함:\n1. 전략명\n2. 핵심 아이디어 3줄\n3. 예상 비용\n4. 실현 가능성 (상/중/하)\n5. 장단점 각 3가지\n6. 12주 로드맵",
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
        body: "[주제/피사체] + [환경/배경] + [스타일/분위기] + [조명] + [카메라/구도]. 예: 'A happy tourist walking through Myeongdong market, sunny day, warm tones, lifestyle photography, wide angle'. 영어로 작성하는 것이 품질이 훨씬 좋습니다.",
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
        title: "빌리버 브랜드 이미지 생성하기",
        instruction: "아래 설정으로 이미지를 생성하세요:\n- Style: Photo (사진풍)\n- Aspect Ratio: 1:1 (인스타용) 또는 9:16 (릴스용)\n- 프롬프트에 빌리버 키워드 포함: bright, warm tones, travel, freedom, light luggage\n- Negative Prompt: dark, heavy, stressed, tired",
        tip: "빌리버 브랜드 컬러(#FFC700 옐로우)와 톤(밝고 긍정적, 자연광)을 항상 기억하세요!",
      },
      {
        step: 3,
        title: "동일 스타일로 3장 세트 만들기",
        instruction: "같은 스타일 키워드 세트를 유지하면서 주제만 바꿔 3장을 만드세요:\n- 이미지 1: 빈손으로 걷는 여행자 (1:1)\n- 이미지 2: Hub 지점 분위기 (16:9)\n- 이미지 3: 인천공항에서 짐 수령 (9:16)\n\n3장 모두 'warm tones, bright, natural light, travel lifestyle' 키워드를 공통으로 넣어야 합니다.",
        tip: "브랜드 일관성의 핵심: 동일한 스타일 키워드 세트를 반복 사용!",
      },
      {
        step: 4,
        title: "Pikaso로 아이디어 빠르게 시각화",
        instruction: "Pikaso 캔버스에서 간단한 스케치(사각형, 사람 윤곽 등)를 그리고, 프롬프트를 입력하세요. 스케치를 수정하면 AI 이미지가 실시간으로 바뀌는 것을 확인하세요.",
        tip: "아이디어 회의할 때 Pikaso를 쓰면 말로만 하던 것을 바로 시각화할 수 있어요!",
      },
      {
        step: 5,
        title: "Reimagine으로 기존 소재 변형하기",
        instruction: "빌리버 기존 마케팅 이미지 1장을 Reimagine에 업로드하세요. AI가 생성한 변형 이미지와 원본을 비교하고, 브랜드 일관성이 유지되었는지 평가하세요.",
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
        title: "빌리버 여행자 이미지 (인스타 1:1)",
        prompt: "A happy young Asian tourist walking through a bright Seoul street with empty hands, no luggage, warm golden hour lighting, travel lifestyle photography, candid shot, warm tones, yellow and white color accents, joyful expression\n\nNegative: dark, heavy bags, stressed, tired, rain, cold",
        expected: "밝고 자유로운 여행자 이미지. 빌리버 '빈손 여행' 컨셉에 맞는지 확인하세요. 짐 없는 모습, 밝은 톤, 자연광이 핵심입니다.",
      },
      {
        title: "Hub 지점 분위기 (블로그 16:9)",
        prompt: "A modern, clean luggage storage counter in a bright Korean neighborhood cafe-style shop, warm interior lighting, wooden shelves with colorful suitcases neatly organized, friendly welcoming atmosphere, professional service photography, warm tones\n\nNegative: dark, messy, old, dirty, industrial",
        expected: "친근하고 깔끔한 지점 분위기. '짐을 맡기는 곳'이 아니라 '여행을 시작하는 곳' 느낌이 나야 합니다.",
      },
      {
        title: "카드뉴스 배경 (심플)",
        prompt: "Minimalist abstract background with soft yellow (#FFC700) gradient, subtle geometric shapes, clean modern design, warm tones, perfect for text overlay, no people, simple and elegant\n\nNegative: busy, cluttered, dark, cold colors, blue",
        expected: "텍스트 오버레이용 배경. 빌리버 Yellow(#FFC700)가 반영되었는지, 텍스트를 올렸을 때 가독성이 좋은지 확인하세요.",
      },
      {
        title: "3언어 통일 비주얼 (한/영/중)",
        prompt: "A vibrant travel scene of a tourist couple at Incheon Airport departure area, waving goodbye with bright smiles, light carry-on bags only, large windows with airplane visible, warm sunlight, cinematic travel photography, golden tones\n\nNegative: heavy luggage, stressed, dark, crowded, rainy",
        expected: "같은 이미지 위에 한국어/영어/중국어 텍스트를 올려도 자연스러운지 확인. 텍스트가 들어갈 여백이 있는 구도인지가 핵심입니다.",
      },
    ],
    doAndDont: {
      do: [
        "영어 프롬프트 사용 (품질 훨씬 좋음)",
        "동일 스타일 키워드 세트 반복 (브랜드 일관성)",
        "Negative Prompt로 원치 않는 요소 제거",
        "여러 번 생성 후 최적 결과물 선택",
        "9:16 비율로 생성하면 릴스 배경으로 바로 활용",
        "생성 후 Upscale로 해상도 높이기",
      ],
      dont: [
        "한국어 프롬프트만 사용 (품질 저하)",
        "매번 다른 스타일 키워드 사용 (일관성 깨짐)",
        "'예쁜 사진 만들어줘' 같은 모호한 프롬프트",
        "AI 생성 인물을 실제 인물이라고 사용",
        "무료 플랜 이미지를 출처 표기 없이 상업적 사용",
        "한 번 생성으로 만족하고 반복 안 하기",
      ],
    },
    quiz: [
      { question: "Freepik AI에서 이미지 품질이 가장 좋은 프롬프트 언어는?", options: ["한국어", "영어", "일본어", "상관없음"], answer: 1, explanation: "Freepik AI 모델은 영어 프롬프트에 최적화되어 있습니다. 한국어로 쓰고 AI에게 영어 번역을 요청하는 것도 좋은 방법입니다." },
      { question: "Pikaso의 핵심 기능은?", options: ["텍스트→영상 생성", "실시간 스케치→이미지 변환", "이미지→3D 모델", "음성→이미지 변환"], answer: 1, explanation: "Pikaso는 캔버스에 스케치를 그리면 실시간으로 AI 이미지로 변환하는 도구입니다." },
      { question: "Freepik에서 릴스용 이미지 비율은?", options: ["1:1", "16:9", "9:16", "4:3"], answer: 2, explanation: "릴스/숏폼은 세로형 9:16 비율입니다. 인스타 피드는 1:1, 유튜브 썸네일은 16:9." },
      { question: "브랜드 일관성을 유지하는 핵심 방법은?", options: ["매번 다른 프롬프트 사용", "동일 스타일 키워드 세트 반복", "항상 같은 이미지 재사용", "프롬프트 없이 생성"], answer: 1, explanation: "동일한 스타일 키워드 세트(예: warm tones, bright, natural light)를 모든 이미지에 공통으로 넣으면 일관성이 유지됩니다." },
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
        body: "① Pan (좌우 이동): 수평으로 카메라 이동. 공간감 표현. ② Tilt (상하 회전): 카메라를 위아래로 기울임. 건물/인물 전체 보여줄 때. ③ Zoom In/Out (확대/축소): 피사체에 집중하거나 전체 보여주기. ④ Dolly (전후 이동): 카메라 자체가 앞뒤로 이동. 몰입감 극대화. ⑤ Orbit (궤도 회전): 피사체를 중심으로 회전. 제품/공간 360도 뷰. ⑥ Static (고정): 카메라 고정, 피사체만 움직임. 안정적 느낌.",
      },
      {
        title: "숏폼 영상 = 이미지 + 카메라 무브 + 자막",
        body: "Higgsfield의 핵심 워크플로우: ① AI/실제 이미지 준비 → ② Higgsfield에서 카메라 무브 프리셋 선택 → ③ 프롬프트로 모션 방향 지시 → ④ 3~6초 클립 생성 → ⑤ 여러 클립을 CapCut에서 편집하여 15~60초 숏폼 완성",
      },
      {
        title: "프롬프트에서 카메라 무브 키워드",
        body: "영어 키워드 사전: slow pan left/right, tilt up/down, gentle zoom in, dolly forward/backward, orbit around, static shot, tracking shot, crane shot, aerial view, low angle, high angle, dutch angle, close-up, wide shot, establishing shot. 속도 조절: slowly, gently, smoothly, quickly, dynamically.",
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
        instruction: "빌리버 관련 이미지(여행자, 캐리어, 서울 거리 등)를 업로드하고, 아래 프롬프트로 줌인 영상을 만드세요:\n\n'Slow cinematic zoom in on the subject, soft ambient light, gentle movement, professional travel commercial feel'\n\n길이: 4초 / Motion 강도: 중간(5/10)",
        tip: "줌인은 가장 안전한 카메라 무브! 실패 확률이 낮아서 첫 실습에 적합해요.",
      },
      {
        step: 3,
        title: "두 번째 영상: 패닝 (Pan)",
        instruction: "같은 이미지 또는 풍경 이미지로 좌→우 패닝 영상을 만드세요:\n\n'Smooth slow pan from left to right, revealing the scene gradually, warm golden hour lighting, cinematic travel mood'\n\n길이: 4~6초",
        tip: "패닝은 공간감을 보여줄 때 최고! 서울 거리, Hub 지점 외관 등에 적합.",
      },
      {
        step: 4,
        title: "세 번째 영상: 돌리 (Dolly Forward)",
        instruction: "입구/문/길 이미지로 전진하는 느낌의 돌리 영상을 만드세요:\n\n'Camera slowly moves forward through the entrance, revealing the interior, smooth dolly shot, inviting atmosphere'\n\n길이: 4초",
        tip: "돌리 포워드는 '여행을 시작하는 곳'이라는 빌리버 메시지와 완벽히 맞아요!",
      },
      {
        step: 5,
        title: "빌리버 서비스 데모 숏폼 조립",
        instruction: "만든 3개 클립(줌인 + 패닝 + 돌리)을 CapCut에서 이어 붙여 15초 영상을 만드세요:\n\n0~4초: 줌인 (서울 거리 여행자)\n4~9초: 패닝 (Hub 지점)\n9~13초: 돌리 (짐 수령 장면)\n13~15초: 텍스트 CTA\n\n+ 자막 + BGM 추가",
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
        title: "캐리어 POV 숏폼 (라스트데이)",
        prompt: "Smooth dolly forward following a rolling suitcase on a clean Seoul street, early morning warm sunlight, the suitcase gradually gets smaller as it moves away, cinematic depth of field, travel freedom mood, warm golden tones\n\nDuration: 4s / Motion: 6/10",
        expected: "캐리어가 멀어지는 느낌 = '짐에서 자유로워지는' 빌리버 메시지. 따뜻한 톤, 아침 빛이 핵심.",
      },
      {
        title: "Hub 지점 입장 씬",
        prompt: "Camera slowly moves forward through a bright modern entrance doorway, revealing a clean organized interior with warm lighting, welcoming atmosphere, dolly forward shot, professional commercial cinematography, gentle movement\n\nDuration: 5s / Motion: 5/10",
        expected: "'여행을 시작하는 곳'에 들어가는 느낌. 밝은 내부, 정돈된 공간, 환영하는 분위기가 나와야 합니다.",
      },
      {
        title: "빈손 여행자 패닝 (명동 거리)",
        prompt: "Slow cinematic pan right following a happy young woman walking through a vibrant Korean shopping street with empty hands, no bags, bright daylight, shallow depth of field, lifestyle commercial feel, warm yellow tones\n\nDuration: 6s / Motion: 5/10",
        expected: "빈손으로 가볍게 걷는 여행자. '짐 없는 자유'를 시각적으로 표현. 밝은 톤, 자연광, 활기찬 분위기.",
      },
      {
        title: "인천공항 짐 수령 (오빗)",
        prompt: "Slow orbit around a smiling tourist receiving their luggage at an airport pickup counter, bright modern airport interior, clean commercial lighting, the tourist looks relieved and happy, 360 degree camera movement\n\nDuration: 5s / Motion: 7/10",
        expected: "안심하고 짐을 받는 순간. 오빗으로 360도 돌면서 공항의 넓은 공간감과 고객 만족을 동시에 표현.",
      },
      {
        title: "배경 루프 (파티클/빛)",
        prompt: "Subtle particle effects and light rays moving gently across a warm yellow gradient background, abstract bokeh lights floating slowly, seamless loop, minimal movement, ambient mood\n\nDuration: 3s / Motion: 2/10",
        expected: "텍스트 오버레이용 루프 배경. Motion을 매우 낮게(2/10) 설정하여 미세한 움직임만. 브랜드 컬러 반영.",
      },
    ],
    doAndDont: {
      do: [
        "Motion 3~5로 시작, 결과 보고 조절",
        "프롬프트에 카메라 무브 키워드 명시 (pan, dolly, zoom 등)",
        "속도 키워드 포함 (slowly, gently, smoothly)",
        "영상 톤을 빌리버 브랜드(밝고 따뜻한)에 맞추기",
        "여러 클립을 CapCut에서 조합하여 완성",
        "동일 이미지로 다양한 카메라 무브 실험하기",
      ],
      dont: [
        "Motion 8 이상으로 설정 (캐릭터 변형됨)",
        "프롬프트 없이 기본 설정으로만 생성",
        "한 번 생성으로 만족하기 (3~5번 반복 추천)",
        "어두운/무거운 톤의 영상 사용",
        "15초 이상을 한 클립으로 만들려 하기 (3~6초씩 나눠서!)",
        "카메라 무브를 한 클립에 2개 이상 넣기 (1클립 = 1무브)",
      ],
    },
    quiz: [
      { question: "Pan은 어떤 카메라 움직임인가요?", options: ["상하 회전", "좌우 수평 이동", "전후 이동", "확대/축소"], answer: 1, explanation: "Pan은 카메라가 좌우로 수평 이동하는 것. 공간감을 보여줄 때 사용합니다." },
      { question: "Dolly Forward의 효과는?", options: ["뒤로 물러남", "앞으로 다가감 (몰입감)", "회전", "정지"], answer: 1, explanation: "Dolly Forward는 카메라가 앞으로 이동하여 몰입감을 만듭니다. '여행을 시작하는 곳'에 들어가는 느낌에 적합." },
      { question: "처음 실습할 때 추천하는 Motion 강도는?", options: ["1~2 (거의 안 움직임)", "3~5 (부드러운 움직임)", "8~10 (격한 움직임)", "상관없음"], answer: 1, explanation: "Motion 3~5가 가장 안전합니다. 너무 높으면 이미지가 변형되고, 너무 낮으면 움직임이 안 보입니다." },
      { question: "1클립당 권장 카메라 무브 수는?", options: ["1개", "2개", "3개", "제한 없음"], answer: 0, explanation: "1클립 = 1카메라 무브가 원칙! 2개 이상 넣으면 부자연스러워집니다. 여러 무브는 CapCut에서 클립을 이어붙여 표현하세요." },
      { question: "빌리버 라스트데이 서비스를 가장 잘 표현하는 카메라 무브 조합은?", options: ["줌인 + 줌인 + 줌인", "돌리 포워드 → 패닝 → 오빗", "전부 Static", "전부 빠른 회전"], answer: 1, explanation: "돌리(지점 입장) → 패닝(서비스 과정) → 오빗(공항 수령)이 서비스 흐름을 자연스럽게 보여줍니다." },
    ],
  },

  "image-brand-assets": {
    concepts: [
      {
        title: "AI 이미지 생성의 브랜드 활용",
        body: "AI 이미지 생성 도구(Midjourney, DALL-E 등)를 활용하면 빠르게 브랜드 비주얼 에셋을 제작할 수 있습니다. 단, 빌리버 브랜드 컬러(#FFC700), 자연광 Warm tone, 밝고 긍정적인 분위기를 반드시 준수해야 합니다. AI가 만든 결과물도 브랜드 가이드 검수가 필수입니다.",
      },
      {
        title: "카드뉴스란 무엇인가",
        body: "카드뉴스는 이미지 + 텍스트를 결합한 SNS용 콘텐츠 포맷입니다. 빌리버 카드뉴스는 3~5장 구성을 기본으로 하며, 첫 장은 시선을 끄는 헤드라인, 마지막 장은 CTA(bee-liber.com 예약 유도)로 마무리합니다.",
      },
      {
        title: "프롬프트 작성의 기본 구조",
        body: "AI 이미지 프롬프트는 '주제(Subject) + 스타일(Style) + 분위기(Mood) + 기술 설정(Technical)' 4요소로 구성합니다. 빌리버 전용 프롬프트에는 'warm natural lighting, golden hour, bright and positive mood, travel lifestyle'을 기본 키워드로 포함하세요.",
      },
      {
        title: "빌리버 비주얼 가이드라인",
        body: "브랜드 컬러 #FFC700(골드 옐로우)를 강조색으로, 화이트/라이트그레이를 배경으로 사용합니다. 여행자가 가볍게 걷는 장면, 빈손으로 도시를 즐기는 장면이 핵심 비주얼입니다. 짐을 들고 힘들어하는 이미지는 절대 사용하지 않습니다.",
      },
    ],
    practiceSteps: [
      {
        step: 1,
        title: "브랜드 키워드 세트 정리",
        instruction: "빌리버 비주얼 가이드라인을 참고하여 AI 이미지 생성에 사용할 필수 키워드 세트를 정리하세요. 컬러, 톤, 분위기, 피사체 유형을 각각 3개 이상 작성합니다.",
        tip: "키워드 세트를 한번 만들어두면 모든 이미지 생성에 재사용할 수 있어요!",
      },
      {
        step: 2,
        title: "Midjourney/DALL-E 프롬프트 작성",
        instruction: "빌리버 카드뉴스 표지용 이미지를 생성할 프롬프트를 작성하세요. 4요소(주제/스타일/분위기/기술설정)를 모두 포함해야 합니다.",
        tip: "Midjourney는 --ar 1:1 또는 --ar 4:5로 SNS 비율에 맞추세요.",
      },
      {
        step: 3,
        title: "카드뉴스 3종 스토리보드 설계",
        instruction: "빌리버 카드뉴스 3종(서비스 소개 / 이용 방법 / 고객 후기)의 스토리보드를 각 3~5장 구성으로 설계하세요. 장마다 헤드라인, 이미지 설명, 텍스트 내용을 포함합니다.",
      },
      {
        step: 4,
        title: "AI 이미지 생성 및 검수",
        instruction: "스토리보드에 따라 AI 이미지를 생성한 후, 브랜드 가이드라인 체크리스트로 검수하세요. 컬러 톤, 분위기, 금지 비주얼(짐을 들고 힘든 표정 등)을 확인합니다.",
        tip: "생성된 이미지에 #FFC700 컬러가 자연스럽게 포함되었는지 꼭 확인하세요.",
      },
      {
        step: 5,
        title: "최종 카드뉴스 조립 및 제출",
        instruction: "검수된 이미지와 텍스트를 조합하여 카드뉴스 3종을 완성하세요. 마지막 장에는 반드시 bee-liber.com 예약 CTA를 포함합니다.",
      },
    ],
    examplePrompts: [
      {
        title: "카드뉴스 표지 이미지 생성",
        prompt: "A young traveler walking hands-free through a vibrant Seoul street market, golden hour warm natural lighting, bright and positive mood, subtle golden yellow (#FFC700) accent in accessories, lifestyle travel photography style, Canon EOS R5, 35mm lens, shallow depth of field --ar 4:5 --v 6",
        expected: "밝고 따뜻한 톤의 여행 라이프스타일 이미지가 생성됩니다. 여행자가 빈손으로 자유롭게 걷는 모습이 핵심입니다.",
      },
      {
        title: "서비스 설명용 인포그래픽 이미지",
        prompt: "Minimalist infographic illustration showing a suitcase with wings flying from a city to an airport, flat design, warm color palette with golden yellow (#FFC700) as primary accent, white background, clean modern style, no text --ar 1:1 --v 6",
        expected: "빌리버의 Hub→인천공항 배송 컨셉을 시각적으로 표현한 깔끔한 일러스트가 생성됩니다.",
      },
      {
        title: "DALL-E용 카드뉴스 배경 생성",
        prompt: "Create a warm, bright background image for a social media card news post. Soft golden gradient with subtle travel-themed elements (small airplane silhouette, passport stamp patterns). Color palette: golden yellow #FFC700, warm white, light cream. Style: modern, clean, minimal. Aspect ratio: square.",
        expected: "카드뉴스 텍스트를 올릴 수 있는 깔끔한 배경 이미지가 생성됩니다. 텍스트 가독성을 위해 과도한 디테일이 없어야 합니다.",
      },
    ],
    doAndDont: {
      do: [
        "브랜드 컬러 #FFC700을 강조색으로 일관되게 사용",
        "자연광, Warm tone, 밝고 긍정적인 분위기 유지",
        "여행자가 빈손으로 자유롭게 즐기는 비주얼 사용",
        "카드뉴스 마지막 장에 bee-liber.com CTA 포함",
        "AI 생성 이미지를 브랜드 가이드라인으로 반드시 검수",
      ],
      dont: [
        "짐을 들고 지친 표정의 여행자 이미지 사용",
        "차갑거나 어두운 톤(Blue, Dark)의 이미지 사용",
        "AI 생성 이미지를 검수 없이 바로 게시",
        "텍스트가 읽히지 않는 복잡한 배경 이미지 사용",
        "브랜드 컬러와 무관한 색상 팔레트로 제작",
      ],
    },
    quiz: [
      {
        question: "빌리버 브랜드 메인 강조색(컬러 코드)은?",
        options: ["#FF6B6B", "#FFC700", "#00C4CC", "#8B5CF6"],
        answer: 1,
        explanation: "빌리버 브랜드 메인 컬러는 #FFC700(골드 옐로우)입니다.",
      },
      {
        question: "AI 이미지 프롬프트의 4요소가 아닌 것은?",
        options: ["주제(Subject)", "가격(Price)", "분위기(Mood)", "기술 설정(Technical)"],
        answer: 1,
        explanation: "AI 이미지 프롬프트 4요소는 주제(Subject), 스타일(Style), 분위기(Mood), 기술 설정(Technical)입니다.",
      },
      {
        question: "빌리버 카드뉴스 마지막 장에 반드시 포함해야 하는 것은?",
        options: ["할인 쿠폰 안내", "bee-liber.com 예약 CTA", "경쟁사 비교표", "고객 개인정보"],
        answer: 1,
        explanation: "카드뉴스 마지막 장에는 반드시 bee-liber.com 예약 유도 CTA를 포함합니다.",
      },
      {
        question: "빌리버 비주얼에서 절대 사용하면 안 되는 이미지는?",
        options: ["빈손으로 걷는 여행자", "골든아워 자연광 사진", "짐을 들고 지친 표정의 여행자", "서울 거리 풍경"],
        answer: 2,
        explanation: "빌리버는 '여행의 자유'를 강조하므로, 짐을 들고 힘들어하는 이미지는 브랜드 가치에 반합니다.",
      },
    ],
  },

  "video-shortform-production": {
    concepts: [
      {
        title: "Image-to-Video 워크플로우란",
        body: "AI 이미지를 먼저 생성한 후, Runway/Kling/Higgsfield 같은 도구로 영상으로 변환하는 제작 방식입니다. 0에서 영상을 만드는 것보다 훨씬 일관된 비주얼을 유지할 수 있어, 브랜드 숏폼 제작에 최적화된 워크플로우입니다.",
      },
      {
        title: "카메라 무브 키워드 5가지",
        body: "Pan(좌우 이동), Tilt(상하 이동), Zoom(확대/축소), Dolly(전후 이동), Orbit(피사체 주위 회전). 이 5가지 키워드를 프롬프트에 넣으면 AI 영상의 카메라 움직임을 제어할 수 있습니다. 숏폼에서는 Slow zoom in + Pan이 가장 자연스럽습니다.",
      },
      {
        title: "15초 숏폼 구조",
        body: "Hook(0~3초, 시선 끌기) → Story(3~10초, 핵심 메시지 전달) → CTA(10~15초, 행동 유도). 빌리버 숏폼은 '빈손 여행의 자유'를 3초 안에 보여주고, bee-liber.com으로 마무리합니다.",
      },
      {
        title: "대본→TTS→립싱크 파이프라인",
        body: "①대본 작성 → ②TTS로 음성 생성 → ③AI 립싱크(HeyGen/D-ID)로 영상에 음성 합성 → ④편집(CapCut/Premiere). 각 단계별로 별도 도구를 사용하며, 대본 품질이 최종 영상 품질을 결정합니다.",
      },
    ],
    practiceSteps: [
      {
        step: 1,
        title: "15초 스토리보드 작성",
        instruction: "빌리버 서비스 소개 15초 숏폼의 스토리보드를 작성하세요. Hook(0~3초)/Story(3~10초)/CTA(10~15초) 3단계로 구분하고, 각 구간의 화면 설명과 대사를 포함합니다.",
        tip: "Hook에서 '짐 없이 여행하는 장면'을 보여주면 시선을 확실히 끌 수 있어요!",
      },
      {
        step: 2,
        title: "카메라 무브 키워드 적용",
        instruction: "스토리보드의 각 장면에 적합한 카메라 무브 키워드(Pan/Tilt/Zoom/Dolly/Orbit)를 지정하세요. 왜 그 움직임을 선택했는지 이유도 함께 작성합니다.",
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
        instruction: "15초 분량의 내레이션 대본을 작성하세요. 한 문장당 15자 이내, 총 3~4문장으로 구성하고, 빌리버 브랜드 보이스(경쾌함+친근함)를 적용합니다.",
      },
      {
        step: 5,
        title: "최종 숏폼 기획서 제출",
        instruction: "스토리보드 + 카메라 무브 + 이미지 프롬프트 + 대본을 하나의 기획서로 정리하여 제출하세요. 실제 제작 가능한 수준의 완성도가 필요합니다.",
      },
    ],
    examplePrompts: [
      {
        title: "숏폼 Hook 장면 이미지 생성",
        prompt: "A cinematic close-up shot of hands releasing a suitcase handle, the suitcase gently floating away, bright Seoul cityscape in the background, golden hour lighting, warm tones, travel freedom concept, shallow depth of field, 4K quality --ar 9:16 --v 6",
        expected: "숏폼 세로 비율(9:16)의 Hook 장면 이미지가 생성됩니다. 이 이미지를 Runway에 넣고 'slow zoom in, camera push forward' 키워드로 영상 변환합니다.",
      },
      {
        title: "Runway Image-to-Video 프롬프트",
        prompt: "Camera slowly dollies forward while the traveler walks hands-free through a bustling Korean street market, warm golden sunlight, gentle camera movement, cinematic feel, 4 seconds",
        expected: "정적 이미지에서 자연스러운 카메라 이동이 적용된 4초 영상 클립이 생성됩니다. Hook 구간에 사용합니다.",
      },
      {
        title: "숏폼 대본 생성 프롬프트",
        prompt: "빌리버 15초 숏폼 영상 내레이션 대본을 작성해주세요.\n\n조건:\n- Hook(0~3초): 질문형으로 시작\n- Story(3~10초): 빌리버 서비스 핵심 1줄\n- CTA(10~15초): bee-liber.com 예약 유도\n- 총 3~4문장, 문장당 15자 이내\n- 톤: 경쾌하고 친근하게\n- 금지어: 저렴한, 싼, 할인, 택배, 물류",
        expected: "3~4문장의 간결한 내레이션 대본이 생성됩니다. 금지어가 포함되지 않았는지 반드시 검수하세요.",
      },
    ],
    doAndDont: {
      do: [
        "Hook 3초 안에 시선을 끄는 비주얼 배치",
        "카메라 무브 키워드를 프롬프트에 명시적으로 포함",
        "15초 구조(Hook/Story/CTA)를 철저히 준수",
        "내레이션 대본의 금지어 검수를 반드시 실시",
        "CTA에서 bee-liber.com 예약 유도로 마무리",
      ],
      dont: [
        "30초 이상 늘어지는 숏폼 제작 (15초가 최적)",
        "카메라 움직임 없이 정적 이미지만 나열",
        "대본에 금지 표현(저렴한, 택배, 물류 등) 포함",
        "CTA 없이 영상 마무리",
        "브랜드 톤과 맞지 않는 어둡거나 무거운 영상 분위기",
      ],
    },
    quiz: [
      {
        question: "Image-to-Video 워크플로우의 올바른 순서는?",
        options: [
          "영상 촬영 → 이미지 추출 → 편집",
          "AI 이미지 생성 → AI 영상 변환 → 편집",
          "대본 작성 → 영상 촬영 → 이미지 생성",
          "편집 → 이미지 생성 → 영상 변환",
        ],
        answer: 1,
        explanation: "Image-to-Video 워크플로우는 AI 이미지를 먼저 생성한 후, Runway 등의 도구로 영상으로 변환하고, 최종 편집하는 순서입니다.",
      },
      {
        question: "피사체 주위를 회전하는 카메라 움직임 키워드는?",
        options: ["Pan", "Tilt", "Dolly", "Orbit"],
        answer: 3,
        explanation: "Orbit은 피사체 주위를 회전하는 카메라 움직임입니다. Pan은 좌우, Tilt은 상하, Dolly는 전후 이동입니다.",
      },
      {
        question: "15초 숏폼에서 Hook 구간의 적정 길이는?",
        options: ["0~1초", "0~3초", "0~7초", "0~10초"],
        answer: 1,
        explanation: "Hook은 0~3초로, 시청자의 시선을 끄는 가장 중요한 구간입니다. 3초 안에 핵심 비주얼을 보여줘야 합니다.",
      },
      {
        question: "숏폼 내레이션 대본에서 한 문장의 권장 길이는?",
        options: ["5자 이내", "15자 이내", "30자 이내", "50자 이내"],
        answer: 1,
        explanation: "숏폼 내레이션은 한 문장당 15자 이내로 간결하게 작성해야 15초 안에 자연스럽게 전달됩니다.",
      },
    ],
  },

  "tts-audio-script": {
    concepts: [
      {
        title: "TTS 도구의 역할과 선택",
        body: "ElevenLabs와 Typecast는 텍스트를 자연스러운 음성으로 변환하는 TTS(Text-to-Speech) 도구입니다. ElevenLabs는 영어 음성 품질이 뛰어나고, Typecast는 한국어 음성에 강점이 있습니다. 빌리버 콘텐츠는 타겟에 따라 도구를 선택하세요.",
      },
      {
        title: "음성 파라미터 이해",
        body: "Stability(안정성): 높을수록 일관된 톤, 낮을수록 감정 표현 풍부. Similarity(유사도): 원본 음성과의 유사도 조절. Style(스타일): 읽기 스타일의 강도 조절. 빌리버 안내 음성은 Stability 0.7 / Similarity 0.8 / Style 0.3을 권장합니다.",
      },
      {
        title: "교육용 오디오 스크립트 작성 규칙",
        body: "①한 문장 20자 이내 ②전문 용어 뒤에 괄호 설명 추가 ③자연스러운 쉼표와 마침표로 호흡 조절 ④핵심 내용은 반복 언급 ⑤시작과 끝에 인사/시그니처 포함. TTS 품질은 스크립트 품질에 비례합니다.",
      },
      {
        title: "빌리버 음성 브랜딩",
        body: "빌리버 TTS 음성은 밝고 친근한 톤을 기본으로 합니다. 서비스 안내는 Balance 모드(친근함+간결함), 교육 콘텐츠는 Trust 모드(담담함+간결함)를 사용합니다. 음성 마무리는 항상 '가벼운 여행 되세요!'로 통일합니다.",
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
        instruction: "같은 문장을 Stability 0.3 / 0.7 / 1.0으로 각각 생성하여 차이를 비교하세요. 빌리버 서비스 안내에 가장 적합한 설정값을 찾아 기록합니다.",
      },
      {
        step: 3,
        title: "서비스 안내 스크립트 작성",
        instruction: "빌리버 서비스 안내 TTS 스크립트(60초 분량)를 작성하세요. 교육용 오디오 스크립트 작성 규칙 5가지를 모두 적용해야 합니다.",
        tip: "60초 분량은 약 150~180자(한국어 기준)입니다.",
      },
      {
        step: 4,
        title: "TTS 생성 및 품질 검수",
        instruction: "작성한 스크립트를 TTS로 변환하고, 다음 체크리스트로 검수하세요: ①발음 정확성 ②호흡/쉼표 자연스러움 ③톤 일관성 ④속도 적절성 ⑤금지어 미포함.",
      },
      {
        step: 5,
        title: "최종 오디오 파일 제출",
        instruction: "검수 완료된 TTS 오디오 파일과 스크립트 원문을 함께 제출하세요. 스크립트에 사용한 파라미터 설정값도 포함합니다.",
      },
    ],
    examplePrompts: [
      {
        title: "서비스 안내 TTS 스크립트 생성",
        prompt: "빌리버 서비스 안내 TTS 스크립트를 작성해주세요.\n\n조건:\n- 분량: 60초 (약 150~180자)\n- 톤: Balance 모드 (친근하고 간결하게)\n- 포함 내용: 서비스 소개, 이용 방법 3단계, 운영 시간\n- 문장당 20자 이내\n- 마무리: '가벼운 여행 되세요!'\n- 금지어: 저렴한, 싼, 할인, 택배, 물류, AI기반솔루션\n- 예약 안내: bee-liber.com",
        expected: "60초 분량의 자연스러운 안내 스크립트가 생성됩니다. 문장 길이, 금지어, 운영 시간(09:00~21:00) 정확성을 검수하세요.",
      },
      {
        title: "영어 서비스 안내 TTS 스크립트 생성",
        prompt: "Write a TTS script for Beeliber service introduction targeting foreign tourists in Korea.\n\nConditions:\n- Duration: 30 seconds (about 75~90 words)\n- Tone: Friendly, bright, and concise\n- Include: What is Beeliber, how to use (3 steps), operating hours 09:00~21:00\n- Delivery: Hub to Incheon Airport same-day only\n- Booking: bee-liber.com only\n- Closing: 'Travel light, travel free!'\n- Forbidden: cheap, discount, courier, logistics",
        expected: "30초 분량의 영어 안내 스크립트가 생성됩니다. ElevenLabs에서 영어 음성으로 변환하기에 적합한 형태입니다.",
      },
    ],
    doAndDont: {
      do: [
        "한 문장 20자 이내로 간결하게 작성",
        "쉼표와 마침표로 자연스러운 호흡 조절",
        "Stability 0.7 / Similarity 0.8 / Style 0.3 권장값 적용",
        "음성 마무리를 '가벼운 여행 되세요!'로 통일",
        "생성된 TTS를 반드시 재생하여 품질 검수",
      ],
      dont: [
        "한 문장에 30자 이상의 긴 문장 작성",
        "쉼표 없이 긴 문장을 이어붙이기",
        "금지어(저렴한, 택배, 물류 등)를 스크립트에 포함",
        "TTS 생성 후 재생 검수 없이 바로 사용",
        "브랜드 톤과 맞지 않는 딱딱하거나 사무적인 톤 사용",
      ],
    },
    quiz: [
      {
        question: "빌리버 서비스 안내 TTS 권장 Stability 값은?",
        options: ["0.3", "0.5", "0.7", "1.0"],
        answer: 2,
        explanation: "빌리버 안내 음성은 Stability 0.7을 권장합니다. 너무 낮으면 감정 변화가 크고, 너무 높으면 기계적으로 들립니다.",
      },
      {
        question: "교육용 오디오 스크립트에서 한 문장의 권장 길이는?",
        options: ["10자 이내", "20자 이내", "30자 이내", "제한 없음"],
        answer: 1,
        explanation: "교육용 오디오 스크립트는 한 문장 20자 이내를 권장합니다. 짧은 문장이 TTS에서 더 자연스럽게 들립니다.",
      },
      {
        question: "한국어 TTS에 더 강점이 있는 도구는?",
        options: ["ElevenLabs", "Typecast", "ChatGPT", "Midjourney"],
        answer: 1,
        explanation: "Typecast는 한국어 음성에 강점이 있고, ElevenLabs는 영어 음성 품질이 뛰어납니다.",
      },
      {
        question: "빌리버 TTS 음성의 마무리 시그니처는?",
        options: ["감사합니다!", "가벼운 여행 되세요!", "빌리버와 함께!", "좋은 하루 되세요!"],
        answer: 1,
        explanation: "빌리버 음성 마무리는 브랜드 시그니처인 '가벼운 여행 되세요!'로 통일합니다.",
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
        body: "①최종 Output의 형태와 기준을 명확히 정의 ②Output을 만들기 위해 필요한 중간 산출물 나열 ③각 중간 산출물을 만들 수 있는 Input 정의 ④각 단계의 평가 기준(Evaluator 규칙) 설정. 이렇게 하면 모든 단계가 최종 목표를 향해 정렬됩니다.",
      },
    ],
    practiceSteps: [
      {
        step: 1,
        title: "Output 먼저 정의하기",
        instruction: "빌리버 인스타그램 광고 카피를 최종 Output으로 설정하세요. Output의 형태(텍스트 150자), 톤(Active 모드), 포함 요소(서비스명, CTA, 시그니처), 금지 요소(금지어 10개)를 명확히 정의합니다.",
        tip: "Output 정의가 구체적일수록 전체 워크플로우 품질이 올라갑니다!",
      },
      {
        step: 2,
        title: "역산으로 Input 설계",
        instruction: "정의한 Output을 만들기 위해 필요한 Input을 나열하세요. 브랜드 가이드, 타겟 정보, 채널 특성, 금지어 목록 등 모든 필요 정보를 빠짐없이 정리합니다.",
      },
      {
        step: 3,
        title: "3노드 분리 설계",
        instruction: "Planner(전략 수립) → Generator(카피 생성) → Evaluator(검수) 3단계를 각각 설계하세요. 각 노드의 역할, 입력, 출력, 프롬프트를 구체적으로 작성합니다.",
      },
      {
        step: 4,
        title: "Evaluator 규칙 작성",
        instruction: "Evaluator 노드의 검수 규칙을 작성하세요. 금지어 체크, 글자수 체크, 톤 일관성 체크, CTA 포함 여부 체크 등 최소 5개 규칙을 포함해야 합니다.",
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
        prompt: "빌리버 인스타그램 광고 카피 생성을 위한 IGO(Input-Generate-Output) 워크플로우 설계서를 작성해주세요.\n\n최종 Output:\n- 인스타그램 광고 카피 150자 이내\n- 톤: Active 모드 (경쾌+친근)\n- 포함: 서비스 소개 1줄, bee-liber.com CTA, '가벼운 여행 되세요! 🐝'\n- 금지어: 저렴한, 싼, 할인, 힘들다, 무겁다, 택배, 물류, AI기반솔루션, 호텔픽업, 공항→호텔배송\n\n설계서에 포함할 것:\n1. Input 목록\n2. Planner 노드 (전략 수립 프롬프트)\n3. Generator 노드 (카피 생성 프롬프트)\n4. Evaluator 노드 (검수 규칙 5개 이상)\n5. 실패 시 되돌림 루프 설명",
        expected: "5개 섹션이 모두 포함된 IGO 설계서가 생성됩니다. 각 노드의 프롬프트가 실제 사용 가능한 수준인지 검수하세요.",
      },
      {
        title: "Evaluator 규칙 자동 생성",
        prompt: "빌리버 콘텐츠 Evaluator 노드의 검수 규칙을 작성해주세요.\n\n규칙 카테고리:\n1. 금지어 감지 (10개 금지어 목록 기반)\n2. 글자수 제한 (150자 이내)\n3. 필수 포함 요소 (CTA, 시그니처)\n4. 톤 일관성 (Active/Balance/Trust 모드)\n5. 정책 정확성 (운영 시간, 배송 방향 등)\n\n각 규칙마다 통과/실패 기준과 실패 시 피드백 메시지를 포함해주세요.",
        expected: "5개 카테고리의 구체적인 검수 규칙이 생성됩니다. 각 규칙이 자동화 가능한 형태인지 확인하세요.",
      },
    ],
    doAndDont: {
      do: [
        "최종 Output을 먼저 구체적으로 정의한 후 역산 설계",
        "Planner/Generator/Evaluator 3노드를 명확히 분리",
        "Evaluator에 금지어 체크 규칙을 반드시 포함",
        "실패 시 Generator로 되돌리는 루프 설계",
        "각 노드의 프롬프트를 실제 사용 가능한 수준으로 작성",
      ],
      dont: [
        "Output 정의 없이 바로 생성부터 시작",
        "Planner와 Generator를 하나로 합쳐서 설계",
        "Evaluator 없이 생성 결과를 바로 사용",
        "금지어 검수 규칙을 빠뜨리기",
        "추상적인 설계서만 작성하고 실제 프롬프트는 미작성",
      ],
    },
    quiz: [
      {
        question: "IGO의 약자가 올바르게 풀이된 것은?",
        options: [
          "Image-Generate-Output",
          "Input-Generate-Output",
          "Input-Grade-Output",
          "Idea-Generate-Optimize",
        ],
        answer: 1,
        explanation: "IGO는 Input-Generate-Output의 약자로, AI 워크플로우 설계 프레임워크입니다.",
      },
      {
        question: "IGO 역산 설계에서 가장 먼저 해야 할 것은?",
        options: [
          "Input 데이터 수집",
          "Generator 프롬프트 작성",
          "최종 Output 형태와 기준 정의",
          "Evaluator 규칙 작성",
        ],
        answer: 2,
        explanation: "IGO 역산 설계의 핵심은 최종 Output을 먼저 정의하고, 거기서 역산하여 나머지를 설계하는 것입니다.",
      },
      {
        question: "Evaluator 노드의 역할은?",
        options: [
          "콘텐츠를 생성한다",
          "전략을 수립한다",
          "생성 결과를 기준에 따라 평가하고 통과/반려한다",
          "Input 데이터를 수집한다",
        ],
        answer: 2,
        explanation: "Evaluator는 생성된 결과를 기준에 따라 평가하고, 통과하지 못하면 Generator로 되돌리는 역할을 합니다.",
      },
      {
        question: "IGO 워크플로우에서 품질을 보장하는 핵심 메커니즘은?",
        options: [
          "더 비싼 AI 모델 사용",
          "Generator 반복 실행",
          "Evaluator 실패 시 Generator로 되돌리는 루프",
          "Input 데이터 양을 늘리기",
        ],
        answer: 2,
        explanation: "Evaluator가 기준을 통과하지 못한 결과를 Generator로 되돌리는 피드백 루프가 품질 보장의 핵심입니다.",
      },
    ],
  },

  "notebooklm-knowledge-core": {
    concepts: [
      {
        title: "NotebookLM이란",
        body: "NotebookLM은 Google이 만든 AI 기반 지식 도구입니다. 문서를 업로드하면 해당 문서의 내용만을 기반으로 답변하는 '출처 기반 AI'입니다. 일반 챗봇과 달리 환각(hallucination)을 최소화하고, 답변마다 출처를 표시합니다.",
      },
      {
        title: "브랜드 지식 구조화",
        body: "빌리버 브랜드 가이드, 운영 정책, 금지어 목록, FAQ 등을 NotebookLM에 체계적으로 업로드하면, 팀 누구나 정확한 브랜드 정보를 즉시 확인할 수 있습니다. 이것이 '지식 코어(Knowledge Core)' 설계입니다.",
      },
      {
        title: "RAG의 기초 개념",
        body: "RAG(Retrieval-Augmented Generation)는 AI가 답변을 생성할 때 외부 문서에서 관련 정보를 검색(Retrieve)하여 답변에 활용(Augment)하는 기술입니다. NotebookLM이 바로 RAG의 대표적 예시입니다. 업로드된 문서가 곧 검색 대상이 됩니다.",
      },
      {
        title: "팩트 체크의 중요성",
        body: "AI가 생성한 빌리버 콘텐츠에 잘못된 정보(운영 시간, 배송 방향, 지점 수 등)가 포함될 수 있습니다. NotebookLM에 정책 문서를 넣어두면 팩트 체크 도구로 활용할 수 있습니다. '이 내용이 맞는지 확인해줘'라고 질문하면 출처와 함께 검증 결과를 받을 수 있습니다.",
      },
    ],
    practiceSteps: [
      {
        step: 1,
        title: "NotebookLM 접속 및 노트북 생성",
        instruction: "notebooklm.google.com에 접속하여 '빌리버 정책 노트북'을 새로 생성하세요. Google 계정 로그인이 필요합니다.",
        tip: "노트북 이름을 '빌리버 정책 v1'처럼 버전을 명시하면 관리가 편해요.",
      },
      {
        step: 2,
        title: "핵심 문서 업로드",
        instruction: "빌리버 브랜드 가이드, 운영 정책, 금지어 목록, 서비스 흐름 문서를 NotebookLM에 업로드하세요. 최소 4개 문서를 업로드해야 합니다.",
        tip: "문서 형식은 PDF, Google Docs, 텍스트 파일 모두 가능합니다.",
      },
      {
        step: 3,
        title: "지식 검증 질문 테스트",
        instruction: "NotebookLM에 다음 5개 질문을 하고 답변의 정확성을 확인하세요: ①Hub 지점은 몇 개? ②배송 방향은? ③운영 시간은? ④금지어 목록은? ⑤예약 방법은?",
      },
      {
        step: 4,
        title: "팩트 체크 실습",
        instruction: "AI가 생성한 빌리버 소개문을 NotebookLM에 붙여넣고 '이 내용에서 틀린 부분을 찾아줘'라고 요청하세요. NotebookLM이 출처를 기반으로 오류를 지적하는지 확인합니다.",
        tip: "의도적으로 오류가 포함된 소개문을 사용하면 더 효과적으로 실습할 수 있어요.",
      },
      {
        step: 5,
        title: "지식 코어 설계서 제출",
        instruction: "빌리버 NotebookLM 지식 코어의 문서 구성, 활용 시나리오 3가지, 운영 규칙을 정리한 설계서를 제출하세요.",
      },
    ],
    examplePrompts: [
      {
        title: "NotebookLM 팩트 체크 요청",
        prompt: "아래 빌리버 소개문에서 사실과 다른 내용을 찾아주세요.\n\n'빌리버는 서울 10개 Hub 지점에서 운영되는 여행 짐 보관 서비스입니다. 24시간 운영되며, 공항에서 호텔까지 짐을 배달해드립니다. 카카오톡으로 예약하시면 할인된 가격으로 이용 가능합니다.'\n\n업로드된 정책 문서를 기준으로 각 오류를 지적하고, 올바른 내용을 알려주세요.",
        expected: "NotebookLM이 출처를 표시하며 최소 5개 오류(Hub 수, 운영 시간, 배송 방향, 예약 방법, 금지어 사용)를 지적합니다.",
      },
      {
        title: "NotebookLM 기반 FAQ 생성",
        prompt: "업로드된 빌리버 정책 문서를 기반으로 외국인 여행자가 자주 물어볼 FAQ 10개를 생성해주세요.\n\n조건:\n- 질문은 영어, 답변은 영어\n- 각 답변에 출처 문서 표시\n- 운영 시간, 배송 방향, 예약 방법을 반드시 포함\n- 금지어(cheap, discount, courier, logistics)를 답변에 사용하지 않기",
        expected: "정책 문서에 근거한 정확한 FAQ 10개가 생성됩니다. 각 답변에 출처가 표시되어 있는지 확인하세요.",
      },
      {
        title: "브랜드 일관성 검수 요청",
        prompt: "아래 SNS 게시물 3개가 빌리버 브랜드 가이드에 맞는지 검수해주세요.\n\n게시물 1: '빌리버에서 저렴하게 짐 맡기세요!'\n게시물 2: '빈손으로 서울을 즐기세요. 빌리버가 인천공항까지 배달합니다. bee-liber.com'\n게시물 3: '빌리버 택배 서비스로 편하게 여행하세요.'\n\n브랜드 가이드 기준으로 각 게시물의 적합/부적합 여부와 수정 사항을 알려주세요.",
        expected: "게시물 1(금지어 '저렴하게'), 게시물 3(금지어 '택배')이 부적합으로 판정되고, 게시물 2만 적합으로 판정됩니다.",
      },
    ],
    doAndDont: {
      do: [
        "정책 문서를 항상 최신 버전으로 유지",
        "NotebookLM 답변의 출처 표시를 반드시 확인",
        "AI 생성 콘텐츠의 팩트 체크 도구로 적극 활용",
        "브랜드 가이드 + 금지어 목록 + 운영 정책을 모두 업로드",
        "노트북 버전을 명시하여 문서 관리 체계화",
      ],
      dont: [
        "정책 변경 후 NotebookLM 문서를 업데이트하지 않기",
        "NotebookLM 답변을 출처 확인 없이 그대로 사용",
        "브랜드 가이드 없이 정책 문서만 업로드",
        "오래된 버전의 정책 문서를 방치",
        "NotebookLM을 단순 챗봇처럼만 사용 (검색+검증 기능 미활용)",
      ],
    },
    quiz: [
      {
        question: "NotebookLM의 핵심 특징은?",
        options: [
          "인터넷 검색 기반 답변",
          "업로드된 문서 기반 출처 표시 답변",
          "이미지 생성 기능",
          "실시간 번역 기능",
        ],
        answer: 1,
        explanation: "NotebookLM은 업로드된 문서만을 기반으로 답변하며, 답변마다 출처를 표시하는 것이 핵심 특징입니다.",
      },
      {
        question: "RAG의 올바른 풀이는?",
        options: [
          "Real-time AI Generation",
          "Retrieval-Augmented Generation",
          "Random Answer Generator",
          "Recursive Algorithm Growth",
        ],
        answer: 1,
        explanation: "RAG는 Retrieval-Augmented Generation으로, 외부 문서 검색을 통해 AI 답변의 정확성을 높이는 기술입니다.",
      },
      {
        question: "빌리버 NotebookLM 지식 코어에 반드시 포함되어야 하는 문서가 아닌 것은?",
        options: [
          "브랜드 가이드",
          "경쟁사 내부 전략 문서",
          "금지어 목록",
          "운영 정책 문서",
        ],
        answer: 1,
        explanation: "경쟁사 내부 전략 문서는 빌리버 지식 코어에 포함할 대상이 아닙니다. 브랜드 가이드, 금지어 목록, 운영 정책이 핵심 문서입니다.",
      },
      {
        question: "NotebookLM을 팩트 체크에 활용하는 올바른 방법은?",
        options: [
          "AI 생성 콘텐츠를 붙여넣고 '맞는지 확인해줘'라고 질문",
          "NotebookLM에 질문만 하고 답변을 그대로 사용",
          "문서를 업로드하지 않고 일반 질문만 하기",
          "NotebookLM 대신 일반 챗봇으로 팩트 체크",
        ],
        answer: 0,
        explanation: "AI 생성 콘텐츠를 NotebookLM에 붙여넣고 정책 문서 기반으로 사실 여부를 확인 요청하는 것이 올바른 팩트 체크 방법입니다.",
      },
    ],
  },

  "mini-app-planning": {
    concepts: [
      { title: "미니 앱이란?", body: "사내 미니 앱은 특정 반복 업무를 자동화하기 위해 자연어 프롬프트 구조로 설계하는 소형 워크플로우입니다. 코딩 없이, 목표 정의 → 입력/출력 설계 → 프롬프트 체인 구성만으로 실무 도구를 만들 수 있습니다." },
      { title: "자연어로 목표 정의하기", body: "미니 앱 설계의 첫 단계는 '이 앱이 무엇을 해결하는가'를 한 문장으로 정의하는 것입니다. 예: '지점별 SNS 광고 카피를 브랜드 가이드에 맞게 자동 생성한다.' 목표가 모호하면 결과물도 모호해집니다." },
      { title: "빌리버 미니 앱 실무 예시", body: "① 지점별 광고 카피 생성기: 지점명+채널+언어를 입력하면 브랜드 톤에 맞는 카피 3안 생성 ② 브랜드 금지어 검수기: 콘텐츠를 입력하면 금지 표현 10개를 자동 감지하고 대체어 제안 ③ CS 응답 템플릿 생성기: 문의 유형을 선택하면 Trust 모드 응답 초안 생성." },
      { title: "Planner/Generator/Evaluator 구조", body: "미니 앱 내부는 세 단계로 나뉩니다. Planner: 입력을 분석하고 실행 계획 수립. Generator: 계획에 따라 콘텐츠 생성. Evaluator: 결과물을 기준(금지어, 정책, 톤)에 따라 검수. 이 세 단계를 분리하면 각각 독립적으로 개선할 수 있습니다." },
    ],
    practiceSteps: [
      { step: 1, title: "해결할 반복 업무 선정", instruction: "빌리버 실무에서 매주 반복되는 업무를 3개 이상 나열하세요. 그중 AI 자동화 효과가 가장 큰 1개를 선정하고, 이유를 적으세요.", tip: "반복 횟수가 많고, 결과물 형식이 정형화된 업무일수록 미니 앱 효과가 큽니다." },
      { step: 2, title: "한 문장 목표 정의", instruction: "선정한 업무를 '[누가] [무엇을 입력하면] [어떤 결과물이] [어떤 기준으로] 나온다' 형식으로 한 문장 정의하세요.", tip: "예: '마케팅 담당자가 지점명과 채널을 입력하면, 브랜드 가이드 준수 광고 카피 3안이 생성된다.'" },
      { step: 3, title: "입력/출력 명세서 작성", instruction: "미니 앱의 입력 항목(필수/선택), 출력 형식(텍스트/표/JSON), 검수 기준(금지어, 톤, 정책)을 표로 정리하세요." },
      { step: 4, title: "PGE 흐름도 작성", instruction: "Planner/Generator/Evaluator 3단계 흐름도를 작성하세요. 각 단계별로 프롬프트 초안과 예상 입력/출력을 포함해야 합니다.", tip: "Evaluator 단계에서 '통과/반려/재생성' 분기가 반드시 있어야 합니다." },
      { step: 5, title: "미니 앱 설계서 완성", instruction: "위 단계를 종합하여 미니 앱 설계서 1장을 완성하세요. 목표 정의, 입출력 명세, 3단계 흐름도, 예시 실행 결과를 모두 포함해야 합니다." },
    ],
    examplePrompts: [
      { title: "지점별 광고 카피 생성기 설계", prompt: "당신은 빌리버 사내 미니 앱 설계자입니다.\n\n다음 미니 앱을 설계해주세요:\n- 앱 이름: 지점별 광고 카피 생성기\n- 입력: 지점명(Hub/Partner), 채널(인스타/블로그/구글), 언어(한/영/중/일)\n- 출력: 광고 카피 3안 (각 150자 이내)\n- 검수 기준: 금지 표현 10개, 브랜드 톤, Phase 1 정책\n\n설계서에 포함:\n1. Planner 프롬프트\n2. Generator 프롬프트\n3. Evaluator 검수 기준\n4. 통과/반려/재생성 분기 조건", expected: "3단계가 분리되었는지, Evaluator에 금지어+정책 검수 기준이 구체적으로 포함되었는지 확인." },
      { title: "브랜드 금지어 검수기 설계", prompt: "빌리버 브랜드 금지어 검수기 미니 앱을 설계해주세요.\n\n입력: 마케팅 콘텐츠 텍스트 (최대 500자)\n출력: 감지된 금지 표현 목록, 대체 표현 제안, 수정된 텍스트, 검수 결과\n\n금지 표현 10개: 저렴한, 싼, 할인, 힘들다, 무겁다, 택배, 물류, AI기반솔루션, 호텔픽업, 공항→호텔배송", expected: "금지어 감지 정확도, 대체 표현의 적절성, 전체 문맥을 해치지 않는 수정인지 확인." },
    ],
    doAndDont: {
      do: ["한 문장 목표 정의부터 시작", "입력/출력을 구체적으로 명세", "PGE 3단계 분리", "Evaluator에 금지어+정책 검수 기준 명시", "실제 빌리버 데이터로 테스트"],
      dont: ["목표 없이 시작", "3단계를 하나의 프롬프트에 넣기", "Evaluator 없이 Generator 결과 사용", "금지 표현 검수 생략", "테스트 없이 설계서만 제출"],
    },
    quiz: [
      { question: "미니 앱 설계의 첫 단계는?", options: ["프롬프트 작성", "코드 개발", "한 문장 목표 정의", "UI 디자인"], answer: 2, explanation: "미니 앱 설계는 '이 앱이 무엇을 해결하는가'를 한 문장으로 정의하는 것에서 시작합니다." },
      { question: "PGE를 분리하는 이유는?", options: ["프롬프트가 길어서", "각 단계를 독립적으로 개선 가능", "AI가 요구해서", "코드 구조 때문"], answer: 1, explanation: "분리하면 Generator만 바꾸거나 Evaluator 기준만 강화하는 등 독립적 개선이 가능합니다." },
      { question: "Evaluator에 반드시 포함될 검수 기준은?", options: ["디자인 품질", "금지 표현 10개 위반 여부", "코드 문법", "서버 속도"], answer: 1, explanation: "빌리버 모든 콘텐츠는 금지 표현 10개 위반 여부를 반드시 검수해야 합니다." },
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
      { step: 1, title: "단일 vs 분리 프롬프트 비교", instruction: "같은 과제를 ① 단일 프롬프트 ② PGE 분리 방식으로 실행하고, 금지 표현 감지율을 비교하세요." },
      { step: 2, title: "Planner 프롬프트 설계", instruction: "입력(채널, 언어, 목적)을 받아 실행 계획(톤, 길이, 키워드, 검수 기준)을 출력하는 Planner를 설계하세요." },
      { step: 3, title: "Generator 프롬프트 설계", instruction: "Planner 출력을 받아 콘텐츠를 생성하는 Generator를 설계하세요. 빌리버 브랜드 가이드를 시스템 프롬프트에 포함." },
      { step: 4, title: "Evaluator + 검수 루프 설계", instruction: "검수 항목: 금지 표현 10개, Phase 1 정책, 브랜드 톤, 사실 정확성. 통과/반려/재생성 판정 기준과 피드백 형식을 정의하세요.", tip: "피드백 형식: '[위반 항목] → [위반 내용] → [수정 방향]'" },
      { step: 5, title: "전체 파이프라인 실행", instruction: "PGE를 순서대로 실행하고 반려→재생성 과정을 기록하여 제출하세요." },
    ],
    examplePrompts: [
      { title: "Planner 프롬프트", prompt: "당신은 빌리버 콘텐츠 Planner입니다.\n\n입력: 채널(인스타), 언어(영어), 목적(명동 Hub 홍보), 타겟(외국인 관광객)\n\n출력 형식:\n1. 톤: Active/Balance/Trust 중 선택 + 이유\n2. 길이: 글자 수\n3. 필수 키워드 3~5개\n4. 금지 표현 체크리스트 10개\n5. 포함 정보: 서비스, 시간, 예약\n6. CTA", expected: "계획이 구체적인지, 금지 표현 10개가 모두 포함되었는지 확인." },
      { title: "Evaluator 프롬프트", prompt: "당신은 빌리버 콘텐츠 Evaluator입니다.\n\n아래 콘텐츠를 검수하세요:\n---\n[Generator 결과물]\n---\n\n검수 기준:\n1. 금지 표현 10개\n2. Phase 1 정책 (Hub→인천공항만)\n3. 브랜드 톤\n4. 사실 정확성\n\n판정: 통과/반려/재생성\n반려 시: [위반 항목] → [위반 내용] → [수정 방향]", expected: "구체적 피드백이 있는지, 판정 기준이 명확한지 확인." },
    ],
    doAndDont: {
      do: ["PGE를 별도 프롬프트로 분리", "입력/출력 형식 명확히 정의", "Evaluator에 금지 표현 10개 전체 포함", "반려 루프 최대 횟수 설정", "반려 피드백에 수정 방향 포함"],
      dont: ["하나의 프롬프트에 모두 요청", "Evaluator 없이 바로 사용", "피드백 없이 '다시 해줘'만 전달", "반려 횟수 제한 없이 무한 반복", "같은 대화창에서 Generator+Evaluator 실행"],
    },
    quiz: [
      { question: "하네스 엔지니어링의 핵심은?", options: ["완벽한 프롬프트 1개", "역할별 프롬프트 체인 분리", "AI 모델 여러 개 사용", "프롬프트 길게 작성"], answer: 1, explanation: "역할을 Planner/Generator/Evaluator로 분리하고 체인으로 연결하는 것이 핵심입니다." },
      { question: "같은 대화창에서 Generator+Evaluator를 하면 안 되는 이유는?", options: ["속도 느림", "비용 문제", "AI가 자기 결과를 관대하게 평가", "기술적 불가능"], answer: 2, explanation: "같은 대화에서 생성과 검수를 하면 AI가 자기 결과물을 관대하게 평가합니다." },
    ],
  },

  "content-production-case": {
    concepts: [
      { title: "콘텐츠 제작 자동화 워크플로우", body: "기획(Planner) → 생성(Generator) → 검수(Evaluator) → 수정 → 게시. 사람은 기획과 최종 승인에 집중하고, 반복 작업은 AI가 처리합니다." },
      { title: "빌리버 6개 언어 현지화", body: "한국어, 영어, 중국어(간체), 일본어, 태국어, 베트남어. 단순 번역이 아닌 현지화입니다. 영어는 캐주얼, 일본어는 경어, 중국어는 간결 실용적 톤." },
      { title: "AI 생성 → 검수 → 게시 파이프라인", body: "① 한국어 원본 생성 ② Evaluator 검수 ③ 6개 언어 현지화 ④ 각 언어별 검수 ⑤ 최종 승인 게시. 검수 없이 게시하면 브랜드 사고 발생." },
      { title: "채널별 콘텐츠 변형", body: "인스타: 150자+이미지, 블로그: 800~1500자, 카드뉴스: 5~7장 슬라이드, 구글 비즈니스: 100자 단문. Generator에 채널별 출력 형식을 지정하면 다채널 동시 생산 가능." },
    ],
    practiceSteps: [
      { step: 1, title: "원본 콘텐츠 생성", instruction: "빌리버 인스타 게시물 1개를 Active 모드로 작성하세요. 주제: '여행 마지막 날, 빈손으로 즐기는 서울'. 150자 이내, CTA 포함." },
      { step: 2, title: "Evaluator 검수", instruction: "생성한 원본을 금지 표현, Phase 1 정책, 브랜드 톤으로 검수하세요. 반려 시 수정 후 재검수." },
      { step: 3, title: "3개 언어 현지화", instruction: "검수 통과한 원본을 영어, 일본어, 중국어로 현지화하세요. 문화적 맥락 반영 필수.", tip: "영어: 캐주얼, 일본어: 정중, 중국어: 간결 실용적" },
      { step: 4, title: "현지화 검수", instruction: "각 언어에서 금지 표현 잔존, 부자연스러운 표현, 정책 정보 정확성을 검수하세요." },
      { step: 5, title: "채널 변형 제출", instruction: "영어 버전을 인스타(150자)와 블로그(500자)로 변형하여 제출하세요." },
    ],
    examplePrompts: [
      { title: "6개 언어 현지화", prompt: "빌리버 한국어 원본을 6개 언어로 현지화하세요.\n\n원본: '여행 마지막 날, 짐은 빌리버에게! 빈손으로 서울을 마음껏 즐기세요. bee-liber.com에서 예약! 가벼운 여행 되세요! 🐝'\n\n언어: 영어, 중국어(간체), 일본어\n조건: 현지화(번역X), 금지 표현 금지, 각 150자 이내", expected: "금지 표현 없는지, 현지에서 자연스러운지, 정책 정보 정확한지 검수." },
      { title: "채널별 변형", prompt: "인스타 게시물을 블로그(800자)와 카드뉴스(5장)로 변형하세요.\n블로그: Balance 모드, 소제목 3개+\n카드뉴스: Active 모드, 마지막 장 CTA", expected: "블로그 정보 밀도, 카드뉴스 독립 이해 가능 여부 확인." },
    ],
    doAndDont: {
      do: ["원본 검수 후 현지화", "문화적 맥락 반영", "각 언어별 Evaluator 검수", "채널별 출력 형식 지정", "파이프라인 실행 기록"],
      dont: ["검수 없이 게시", "구글 번역기만으로 현지화", "모든 채널에 같은 형식", "현지화 시 금지어 검수 생략", "원본 반려인데 현지화 먼저"],
    },
    quiz: [
      { question: "빌리버 현지화 대상 언어 수는?", options: ["3개", "4개", "6개", "8개"], answer: 2, explanation: "한국어, 영어, 중국어, 일본어, 태국어, 베트남어 6개." },
      { question: "현지화와 번역의 차이는?", options: ["글자 수", "문화적 맥락 반영 여부", "AI 모델 종류", "비용"], answer: 1, explanation: "현지화는 문화권의 표현 방식, 톤, 관심사를 반영하여 재작성합니다." },
    ],
  },

  "seo-geo": {
    concepts: [
      { title: "SEO vs GEO", body: "SEO는 구글 검색 상위 노출, GEO는 AI(ChatGPT, Gemini)가 빌리버를 인용하도록 최적화. SEO는 '클릭' 유도, GEO는 '인용' 유도. 둘 다 필요합니다." },
      { title: "빌리버 키워드 전략", body: "영어: luggage storage Seoul, luggage delivery Incheon Airport. 한국어: 짐 보관 서울, 인천공항 짐 배송. 롱테일 키워드 중심으로 콘텐츠 설계." },
      { title: "구글 비즈니스 프로필 최적화", body: "Hub 6개 지점 각각 등록. 카테고리 설정, 운영 시간 09:00~21:00, 사진 10장+, 리뷰 답변 필수, 주 1회 게시글." },
      { title: "GEO 최적화", body: "AI 인용용: 구조화된 FAQ, 명확한 서술문, Schema.org 마크업, 외부 신뢰 소스 등록." },
    ],
    practiceSteps: [
      { step: 1, title: "키워드 리서치", instruction: "빌리버 관련 키워드 30개(영어/한국어)를 생성하고 검색 의도별로 분류하세요.", tip: "롱테일 키워드가 경쟁 낮고 전환율 높아요." },
      { step: 2, title: "SEO 랜딩 페이지 카피", instruction: "메타 타이틀(60자), 메타 디스크립션(155자), H1, H2 3개+, 본문 500자+, FAQ 3개를 작성하세요.", tip: "메타 타이틀에 키워드를 앞쪽에 배치!" },
      { step: 3, title: "구글 비즈니스 프로필 계획서", instruction: "명동본점 프로필 설명문, 게시글 3개 초안, 리뷰 답변 템플릿 2개를 작성하세요." },
      { step: 4, title: "GEO FAQ 작성", instruction: "AI 인용용 FAQ 10개(영어5+한국어5). 각 답변 2~3문장, 명확한 서술문으로.", tip: "AI는 '~입니다'로 끝나는 명확한 문장을 인용하기 좋아해요." },
      { step: 5, title: "통합 제출", instruction: "랜딩 페이지 카피 + 구글 비즈니스 계획서 + FAQ를 하나로 제출. Evaluator 검수 필수." },
    ],
    examplePrompts: [
      { title: "SEO 랜딩 페이지", prompt: "빌리버 영문 랜딩 페이지 카피를 작성하세요.\n키워드: luggage storage Seoul, hands-free travel Korea\n포함: Meta Title(60자), Meta Description(155자), H1, H2 3개+, 본문 500자+, FAQ 3개\n조건: 금지 표현 금지, Phase 1만, Balance 모드", expected: "메타 타이틀에 키워드 포함, FAQ가 AI 인용 적합한지, 금지 표현 없는지 확인." },
      { title: "GEO FAQ", prompt: "빌리버 FAQ 10개를 AI 인용 최적화 형태로 작성하세요.\n영어 5개 + 한국어 5개\n각 답변 2~3문장, 수치 포함, Schema.org 호환\n금지 표현 금지, Phase 1만", expected: "각 답변이 독립적으로 완결되는지, AI가 그대로 인용 가능한지 확인." },
    ],
    doAndDont: {
      do: ["메타 타이틀 60자, 키워드 앞배치", "FAQ는 명확한 서술문으로", "구글 비즈니스 주 1회 업데이트", "영어/한국어 키워드 모두 타겟", "Schema.org 마크업"],
      dont: ["키워드 스터핑", "금지 표현을 SEO 키워드로 사용", "잘못된 운영 시간 입력", "모든 페이지에 같은 메타 타이틀", "GEO 무시하고 SEO만"],
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
