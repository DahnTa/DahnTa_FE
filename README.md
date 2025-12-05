# 📈 StockSim - 실전 투자 시뮬레이션

Firebase와 외부 API 없이 로컬 상태 관리만으로 동작하는 주식 투자 시뮬레이션 게임입니다.

## ✨ 주요 기능

- 🎮 **20일간의 투자 시뮬레이션**: 실전과 같은 주식 거래 경험
- 📊 **실시간 차트**: Recharts를 활용한 아름다운 가격 차트
- 🤖 **AI 투자 조언(사전 저장)**: 백엔드에 저장된 Gemini 분석 5종 제공
  - 통합 분석 (Gemini)
  - 뉴스 분석 (Gemini)
  - Reddit 분석 (Gemini)
  - 재무제표 분석 (Gemini)
  - 거시경제 분석 (Gemini)
- 📰 **자동 생성 뉴스**: 시장 변동에 따른 실시간 헤드라인
- 💼 **포트폴리오 관리**: 보유 주식, 거래 내역, 관심 종목 관리
- 🎨 **다크/라이트 모드**: 테마 전환 지원
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 모두 지원

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

### 설치

```bash
# 프로젝트 디렉토리로 이동
cd stock-sim-local

# 의존성 설치
npm install
```

### 실행

```bash
# 개발 서버 시작
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 🎮 게임 방법

1. **로그인**: 데모 계정 (ID: `1111`, PW: `1111`)으로 로그인
2. **주식 선택**: 대시보드에서 원하는 주식 클릭
3. **AI 분석**: 3가지 AI 성격 중 하나를 선택하여 투자 조언 받기
4. **매수/매도**: 주문 패널에서 수량 입력 후 거래
5. **다음 날 진행**: 하루를 진행하여 시장 변화 관찰
6. **20일 완료**: 최종 수익률 확인 및 새 게임 시작

## 📁 프로젝트 구조

```
stock-sim-local/
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── AuthScreen.jsx   # 로그인 화면
│   │   ├── Dashboard.jsx    # 시장 대시보드
│   │   ├── StockDetail.jsx  # 주식 상세 페이지
│   │   ├── MyPage.jsx        # 마이 페이지
│   │   ├── Layout.jsx        # 레이아웃
│   │   ├── Header.jsx        # 헤더
│   │   └── Modals.jsx        # 모달 컴포넌트들
│   ├── utils/               # 유틸리티
│   │   ├── marketData.js    # 시장 데이터 생성
│   │   ├── aiTemplates.js   # AI 분석 템플릿
│   │   ├── aiPersonas.jsx   # AI 성격 정의
│   │   ├── formatters.js    # 포매터 함수
│   │   └── storage.js       # localStorage 관리
│   ├── App.jsx              # 메인 앱
│   ├── main.jsx             # 엔트리 포인트
│   └── index.css            # 글로벌 스타일
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 기술 스택

- **React 18**: UI 라이브러리
- **Vite**: 빌드 도구
- **Tailwind CSS**: 스타일링
- **Recharts**: 차트 라이브러리
- **Lucide React**: 아이콘
- **LocalStorage**: 데이터 저장

## 🔄 원본과의 차이점

원본 `gemini_code(origin).jsx`와 비교하여 다음이 변경되었습니다:

- ❌ **Firebase 제거**: 모든 데이터를 localStorage에 저장
- ❌ **Gemini API 제거**: AI 분석과 뉴스를 미리 정의된 템플릿으로 대체
- ✅ **로컬 상태 관리**: React useState + localStorage
- ✅ **디자인 동일**: 원본과 완전히 동일한 UI/UX 유지
- ✅ **모든 기능 유지**: 게임의 모든 기능이 로컬에서 동작

## 📝 데이터 저장

게임 데이터는 브라우저의 localStorage에 저장됩니다:
- `stocksim_game_state`: 게임 상태 (포트폴리오, 거래내역 등)
- `stocksim_auth`: 로그인 상태

데이터를 초기화하려면 브라우저 개발자 도구에서 localStorage를 클리어하거나 로그아웃하세요.

## 🎯 개발 참고사항

- **시장 데이터**: Seeded Random으로 생성된 365일간의 주가 데이터
- **AI 분석**: 실시간 생성이 아닌, 백엔드에 사전 저장된 Gemini 결과를 노출
- **뉴스 생성**: 최대 변동폭을 보인 종목 기반으로 헤드라인 생성
- **테마**: isDarkMode state로 전역 테마 관리

## 📄 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

## 🤝 기여

버그 리포트나 기능 제안은 환영합니다!

---

**즐거운 투자 시뮬레이션 되세요! 📈💰**

