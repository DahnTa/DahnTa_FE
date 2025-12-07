# 프론트엔드 API 연동 점검 리포트

> **점검일**: 2025-12-06  
> **기준 문서**: `NOTION_API_DOCUMENTATION.md`  
> **프로젝트**: `stock-sim-local`

## 📋 현재 상태 요약

### ✅ 현재 구현된 기능
- 로컬 상태 관리 (React useState + localStorage)
- UI 컴포넌트 (Dashboard, StockDetail, MyPage, AuthScreen)
- 로컬 게임 로직 (매수/매도, 다음날 진행)
- 정적 시장 데이터 (MARKET_DATA.js)

### ❌ 누락된 기능 (백엔드 API 연동 필요)
- **API 통신 모듈 없음** - 백엔드와 통신하는 코드가 전혀 없음
- **인증 시스템** - 하드코딩된 "1111/1111" 체크만 존재
- **환경 변수 설정** - Base URL 설정 파일 없음
- **토큰 관리** - JWT 토큰 저장/관리 로직 없음
- **에러 처리** - API 에러 핸들링 로직 없음

---

## 🔍 상세 점검 결과

### 1. 인증 관련 (Auth API)

#### 현재 상태
- **파일**: `src/components/AuthScreen.jsx`
- **문제점**:
  - 하드코딩된 로그인 체크 (`id === "1111" && password === "1111"`)
  - 회원가입 기능 없음 (alert만 표시)
  - 토큰 저장/관리 없음
  - 비밀번호 변경 기능 없음

#### 필요한 작업
- [ ] `POST /api/auth/login` 연동
- [ ] `POST /api/auth/signup` 연동
- [ ] `POST /api/auth/password` 연동
- [ ] `POST /api/auth/refresh` 연동
- [ ] 토큰 저장 로직 (localStorage)
- [ ] 자동 토큰 갱신 로직

#### 노션 API 스펙
```javascript
// 로그인
POST /api/auth/login
Request: { userAccount: "String", userPassword: "String" }
Response: { accessToken: "String", refreshToken: "String" }

// 회원가입
POST /api/auth/signup
Request: { userAccount, userPassword, userName, userNickName, userProfileImageUrl }
Response: HTTP 201

// 비밀번호 변경
POST /api/auth/password
Headers: Authorization: "Bearer token"
Request: { userPassword: "String" }
Response: HTTP 200

// 토큰 갱신
POST /api/auth/refresh
Headers: Authorization: "Bearer token"
Response: HTTP 200
```

---

### 2. 주식 관련 (Stock API)

#### 현재 상태
- **파일**: `src/components/Dashboard.jsx`, `src/components/StockDetail.jsx`
- **문제점**:
  - 정적 데이터만 사용 (`MARKET_DATA.js`)
  - 백엔드에서 주식 리스트를 가져오지 않음
  - 주식 상세 정보를 API에서 가져오지 않음
  - Reddit, 뉴스, 재무제표, 종합분석 데이터를 API에서 가져오지 않음
  - 매수/매도가 로컬 상태만 업데이트 (백엔드에 전송 안 함)

#### 필요한 작업
- [ ] `GET /api/stock/` - 주식 리스트 조회
- [ ] `GET /api/stock/{id}` - 주식 상세 조회
- [ ] `GET /api/stock/{id}/reddit` - Reddit 데이터
- [ ] `GET /api/stock/{id}/company` - 재무제표
- [ ] `GET /api/stock/{id}/news` - 뉴스
- [ ] `GET /api/stock/{id}/total` - 종합 분석
- [ ] `GET /api/stock/macro` - 거시경제지표
- [ ] `POST /api/stock/{id}/orders/buy` - 매수
- [ ] `POST /api/stock/{id}/orders/sell` - 매도
- [ ] `GET /api/stock/{id}/order` - 주문 상세

#### 노션 API 스펙
```javascript
// 주식 리스트
GET /api/stock/
Response: { dashBoard: [{ id, stockName, stockTag, currentPrice, marketPrice, changeRate, changeAmount }] }

// 주식 상세
GET /api/stock/{id}
Response: { stockName, stockTag, marketPrices: [{ marketPrice }], currentPrice, changeRate }
// ⚠️ 중요: marketPrices는 10일치 과거 시가 데이터 (List)

// 매수
POST /api/stock/{id}/orders/buy
Request: { quantity: "int" }
Response: HTTP 201

// 매도
POST /api/stock/{id}/orders/sell
Request: { quantity: "int" }
Response: HTTP 200
```

#### ⚠️ 중요: 게임 데이터 구조
- **백엔드에서 30일치 데이터 제공**
- **게임 시작 시**: 과거 10일치 데이터를 미리 표시 (게임 시작 전 과거 데이터)
- **게임 진행**: 20일 동안 진행
- **총 데이터**: 30일치 (과거 10일 + 게임 20일)

**구현 시 주의사항**:
- 게임 시작 시 백엔드에서 30일치 주가 데이터를 받아와야 함
- `marketPrices` 배열의 처음 10개는 과거 데이터 (게임 시작 전)
- 나머지 20개는 게임 진행 기간 데이터
- `StockDetail.jsx`의 `historyDays = 10` 로직이 백엔드 데이터와 연동되도록 수정 필요

---

### 3. 게임 관련 (Game API)

#### 현재 상태
- **파일**: `src/App.jsx`
- **문제점**:
  - 게임 시작이 로컬 상태만 초기화
  - 다음날 진행이 로컬 계산만 수행
  - 게임 종료가 로컬 상태만 업데이트
  - 게임 결과를 백엔드에서 가져오지 않음
  - **30일치 데이터 구조 미반영**: 백엔드에서 30일치 데이터를 받아와야 하는데 현재는 로컬 랜덤 데이터 사용
  - **과거 10일치 표시 미반영**: 게임 시작 시 과거 10일치를 미리 보여주는 로직이 없음

#### 필요한 작업
- [ ] `POST /api/stock/start` - 게임 시작
- [ ] `POST /api/stock/next` - 다음날 진행
- [ ] `POST /api/stock/finish` - 게임 종료
- [ ] `GET /api/stock/result` - 게임 결과 조회

#### 노션 API 스펙
```javascript
// 게임 시작
POST /api/stock/start
Response: HTTP 201
// ⚠️ 중요: 게임 시작 시 백엔드에서 30일치 주가 데이터를 받아와야 함
// - 과거 10일치: 게임 시작 전 과거 데이터 (차트에 표시용)
// - 게임 20일치: 실제 게임 진행 기간 데이터

// 다음날 진행
POST /api/stock/next
Response: HTTP 200

// 게임 종료
POST /api/stock/finish
Response: HTTP 200

// 게임 결과
GET /api/stock/result
Response: { finalReturnRate, initialFunds, finalAmount }
```

#### ⚠️ 중요: 게임 데이터 구조 및 초기화
**현재 프론트엔드 로직**:
- `initializeGame()`: 로컬 랜덤 `startDayIndex` 생성
- `StockDetail.jsx`: `historyDays = 10`으로 과거 10일치 표시 시도

**백엔드 연동 시 필요한 변경**:
1. 게임 시작 시 (`POST /api/stock/start`):
   - 백엔드에서 30일치 주가 데이터 수신
   - 데이터 구조: `{ past10Days: [...], game20Days: [...] }` 또는 단일 배열로 30일치
   
2. 데이터 저장:
   - 30일치 데이터를 게임 상태에 저장
   - `currentDayOffset: 0` (게임 시작 = 0일차)
   - 과거 10일치 인덱스: -10 ~ -1
   - 게임 진행 인덱스: 0 ~ 19

3. 차트 표시 로직 (`StockDetail.jsx`):
   - 게임 시작 시: 과거 10일치 + 현재일 (총 11개 포인트)
   - 게임 진행 중: 과거 10일치 + 현재일까지 (최대 11개 포인트)
   - `marketPrices` 배열의 처음 10개를 과거 데이터로 사용

---

### 4. 사용자 관련 (User API)

#### 현재 상태
- **파일**: `src/components/MyPage.jsx`
- **문제점**:
  - 자산 현황이 로컬 계산만 수행
  - 보유 종목이 로컬 상태만 표시
  - 거래 내역이 로컬 상태만 표시
  - 관심 종목이 로컬 상태만 관리

#### 필요한 작업
- [ ] `GET /api/user/asset` - 자산 현황 조회
- [ ] `GET /api/user/holdings` - 보유 종목 조회
- [ ] `GET /api/user/transaction` - 거래 내역 조회
- [ ] `GET /api/user/interest` - 관심 종목 리스트
- [ ] `POST /api/user/interest/{id}/like` - 관심 종목 추가
- [ ] `POST /api/user/interest/{id}/dislike` - 관심 종목 삭제

#### 노션 API 스펙
```javascript
// 자산 현황
GET /api/user/asset
Response: { totalAmount, creditChangeRate, creditChangeAmount, userCredit, stockValuation }

// 보유 종목
GET /api/user/holdings
Response: { holdings: [{ stockName, stockTag, quantity, changeRate, stockValuation }] }

// 거래 내역
GET /api/user/transaction
Response: { transactions: [{ date, stockName, stockTag, type, quantity, totalAmount }] }

// 관심 종목 리스트
GET /api/user/interest
Response: { interests: [{ stockId, stockName, stockTag, currentPrice, changeRate }] }

// 관심 종목 추가/삭제
POST /api/user/interest/{id}/like
POST /api/user/interest/{id}/dislike
Response: HTTP 200
```

---

## 🛠️ 필요한 파일 구조

### 새로 생성해야 할 파일

```
stock-sim-local/
├── .env.example                    # 환경 변수 예제
├── src/
│   ├── api/                        # API 관련 (신규 생성 필요)
│   │   ├── api.js                 # API 호출 함수
│   │   ├── apiTypes.js            # API 타입 정의
│   │   └── apiClient.js           # Axios/Fetch 클라이언트 설정
│   ├── services/                   # 서비스 로직 (신규 생성 필요)
│   │   ├── authService.js         # 인증 서비스
│   │   └── tokenService.js        # 토큰 관리 서비스
│   └── utils/
│       └── storage.js             # 수정 필요 (토큰 저장 추가)
```

---

## 📝 구현 우선순위

### Phase 1: 기본 인프라 구축
1. ✅ 환경 변수 설정 파일 생성
2. ✅ API 클라이언트 모듈 생성
3. ✅ 토큰 관리 서비스 생성
4. ✅ 에러 처리 로직 구현

### Phase 2: 인증 시스템
1. ✅ 로그인 API 연동
2. ✅ 회원가입 API 연동
3. ✅ 토큰 저장/관리
4. ✅ 자동 토큰 갱신

### Phase 3: 주식 데이터 연동
1. ✅ 주식 리스트 조회
2. ✅ 주식 상세 조회
3. ✅ **30일치 데이터 구조 처리** (과거 10일 + 게임 20일)
4. ✅ **과거 10일치 차트 표시 로직 구현**
5. ✅ 매수/매도 API 연동

### Phase 4: 게임 로직 연동
1. ✅ 게임 시작 API
   - **30일치 주가 데이터 수신 및 저장**
   - **과거 10일치 데이터 구조화**
2. ✅ 다음날 진행 API
3. ✅ 게임 종료 API
4. ✅ 게임 결과 조회

### Phase 5: 사용자 데이터 연동
1. ✅ 자산 현황 조회
2. ✅ 보유 종목 조회
3. ✅ 거래 내역 조회
4. ✅ 관심 종목 관리

### Phase 6: 추가 기능
1. ✅ Reddit 데이터 조회
2. ✅ 뉴스 조회
3. ✅ 재무제표 조회
4. ✅ 종합 분석 조회
5. ✅ 거시경제지표 조회

---

## 🔧 주요 변경 사항

### 1. App.jsx
- 로컬 상태 관리 → 백엔드 API 호출로 변경
- `initializeGame()` → `POST /api/stock/start` 호출
  - **30일치 주가 데이터 수신 및 저장**
  - **과거 10일치 데이터 구조화** (게임 시작 전 과거 데이터)
  - 게임 상태 초기화: `currentDayOffset: 0` (0일차부터 시작)
- `handleNextDay()` → `POST /api/stock/next` 호출
- `handleOrder()` → `POST /api/stock/{id}/orders/buy` 또는 `/sell` 호출
- `toggleWatchlist()` → `POST /api/user/interest/{id}/like` 또는 `/dislike` 호출

### 2. AuthScreen.jsx
- 하드코딩 로그인 → `POST /api/auth/login` 호출
- 회원가입 alert → `POST /api/auth/signup` 호출
- 토큰 저장 로직 추가

### 3. Dashboard.jsx
- `MARKET_DATA` 정적 데이터 → `GET /api/stock/` 호출
- 관심 종목 토글 → API 호출로 변경

### 4. StockDetail.jsx
- 정적 데이터 → `GET /api/stock/{id}` 호출
- **차트 데이터 구조 변경**:
  - 현재: 로컬 `MARKET_DATA`에서 `historyDays = 10`으로 과거 데이터 계산
  - 변경: 백엔드에서 받은 30일치 데이터 사용
  - 과거 10일치: `marketPrices` 배열의 처음 10개 (인덱스 -10 ~ -1)
  - 게임 진행: 인덱스 0 ~ 19 (20일)
  - 차트 표시: 과거 10일치 + 현재일까지 (최대 11개 포인트)
- AI 분석 → `GET /api/stock/{id}/total`, `/reddit`, `/news`, `/company` 호출
- 매수/매도 → API 호출로 변경

### 5. MyPage.jsx
- 로컬 상태 → `GET /api/user/asset`, `/holdings`, `/transaction`, `/interest` 호출

---

## ⚠️ 주의사항

### 1. 데이터 타입 변환
- 백엔드: `LocalDate` (YYYY-MM-DD)
- 프론트엔드: JavaScript Date 객체
- 변환 로직 필요

### 2. 인증 토큰
- 모든 API 요청에 `Authorization: Bearer <token>` 헤더 필요
- 토큰 만료 시 자동 갱신 로직 필요

### 3. 에러 처리
- 401 에러: 자동 로그아웃 및 로그인 페이지로 리다이렉트
- 네트워크 에러: 사용자에게 알림 표시
- API 에러: 적절한 에러 메시지 표시

### 4. 게임 데이터 구조 (30일치)
- **백엔드 제공**: 30일치 주가 데이터
- **과거 10일치**: 게임 시작 전 과거 데이터 (차트 표시용)
- **게임 20일치**: 실제 게임 진행 기간
- **인덱스 구조**:
  - 과거 데이터: 인덱스 -10 ~ -1 (게임 시작 전)
  - 게임 진행: 인덱스 0 ~ 19 (게임 1일차 ~ 20일차)
- **차트 표시**: 과거 10일치 + 현재일까지 (최대 11개 포인트)

### 4. 로딩 상태
- API 호출 중 로딩 인디케이터 표시
- 사용자 경험 개선

---

## 📊 API 연동 체크리스트

### 인증 관련
- [ ] 로그인 API 연동 (`/api/auth/login`)
- [ ] 회원가입 API 연동 (`/api/auth/signup`)
- [ ] 비밀번호 변경 API 연동 (`/api/auth/password`)
- [ ] 토큰 갱신 API 연동 (`/api/auth/refresh`)
- [ ] 토큰 저장 및 관리 (localStorage)
- [ ] 자동 토큰 갱신 로직 구현

### 주식 관련
- [ ] 주식 리스트 조회 (`/api/stock/`)
- [ ] 주식 상세 조회 (`/api/stock/{id}`)
- [ ] Reddit 데이터 조회 (`/api/stock/{id}/reddit`)
- [ ] 재무제표 조회 (`/api/stock/{id}/company`)
- [ ] 뉴스 조회 (`/api/stock/{id}/news`)
- [ ] 종합 분석 조회 (`/api/stock/{id}/total`)
- [ ] 거시경제지표 조회 (`/api/stock/macro`)
- [ ] 주식 매수 (`/api/stock/{id}/orders/buy`)
- [ ] 주식 매도 (`/api/stock/{id}/orders/sell`)
- [ ] 주문 상세 조회 (`/api/stock/{id}/order`)

### 게임 관련
- [ ] 게임 시작 (`/api/stock/start`)
- [ ] 다음날 진행 (`/api/stock/next`)
- [ ] 게임 종료 (`/api/stock/finish`)
- [ ] 게임 결과 조회 (`/api/stock/result`)

### 사용자 관련
- [ ] 자산 현황 조회 (`/api/user/asset`)
- [ ] 보유 종목 조회 (`/api/user/holdings`)
- [ ] 거래 내역 조회 (`/api/user/transaction`)
- [ ] 관심 종목 리스트 조회 (`/api/user/interest`)
- [ ] 관심 종목 추가 (`/api/user/interest/{id}/like`)
- [ ] 관심 종목 삭제 (`/api/user/interest/{id}/dislike`)

---

## 🎯 다음 단계

1. **API 클라이언트 모듈 생성**
   - Base URL 설정
   - 인증 헤더 자동 추가
   - 에러 처리

2. **인증 시스템 구현**
   - 로그인/회원가입 API 연동
   - 토큰 관리

3. **주식 데이터 연동**
   - 주식 리스트/상세 조회
   - 매수/매도 API 연동

4. **게임 로직 연동**
   - 게임 시작/진행/종료 API 연동

5. **사용자 데이터 연동**
   - 자산/보유종목/거래내역/관심종목 API 연동

---

**점검 완료일**: 2025-12-06  
**다음 작업**: API 클라이언트 모듈 생성 및 인증 시스템 구현

