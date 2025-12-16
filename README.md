# 🔍 추리소설 정리 - 사건 분석 도구

추리소설을 읽거나 쓸 때 복잡한 사건을 체계적으로 정리하고 분석하기 위한 React 웹 애플리케이션입니다.

## 📋 주요 기능

### 1. 타임라인 (Timeline)

- 사건이 발생한 시간 범위를 자유롭게 설정 가능
- 시작 시간과 종료 시간을 설정하여 30분 단위로 타임라인 생성
- 모든 용의자의 알리바이를 한눈에 볼 수 있음

### 2. 용의자 관리 (Suspect Manager)

- 용의자 추가 기능
- 각 용의자의 정보 입력:
  - **이름**: 용의자의 이름
  - **특징**: 용의자의 신체적 특징이나 성격
  - **동기**: 범행의 동기
  - **알리바이**: 범행 당시 용의자의 위치와 활동
- 용의자 이름 버튼 클릭으로 상세 정보 확인 및 수정
- 용의자 삭제 기능

### 3. 증거 분석 표 (Evidence Table)

- 각 용의자별로 증거를 관리하는 테이블
- 3가지 질문으로 증거 분석:
  - **어디서?**: 증거가 어디에서 발견되었는가?
  - **어떻게?**: 이 증거가 범행을 어떻게 증명하는가?
  - **왜?**: 왜 이 증거가 중요한가?
- 각 항목에 대해 3가지 상태 선택 가능:
  - **O** (초록색): 맞음 / 명확한 증거
  - **△** (주황색): 불확실함 / 추가 조사 필요
  - **X** (빨간색): 틀림 / 반박됨
- 증거 셀을 클릭하여 상태 변경 (자동 순환)
- 새로운 단서 추가 버튼으로 추가 증거 입력
- 증거 삭제 기능

### 4. 용의자 필터링 (Suspect Filter)

- "모두 보기" 버튼으로 모든 용의자 확인
- 각 용의자 버튼으로 특정 용의자만 필터링
- 필터링된 용의자의 증거 테이블만 표시

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`을 열면 애플리케이션이 실행됩니다.

### 빌드

```bash
npm run build
```

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── Timeline.tsx          # 타임라인 컴포넌트
│   ├── Timeline.css
│   ├── SuspectManager.tsx    # 용의자 관리 컴포넌트
│   ├── SuspectManager.css
│   ├── EvidenceTable.tsx     # 증거 분석 테이블
│   ├── EvidenceTable.css
│   ├── SuspectFilter.tsx     # 용의자 필터링
│   └── SuspectFilter.css
├── types.ts                 # TypeScript 타입 정의
├── App.tsx                  # 메인 App 컴포넌트
├── App.css
├── index.css
└── main.tsx
```

## 💾 데이터 저장

- 모든 데이터는 자동으로 브라우저의 `localStorage`에 저장됩니다
- 페이지를 새로고침해도 입력한 데이터가 유지됩니다
- 브라우저 캐시를 삭제하면 데이터가 초기화됩니다

## 🛠 기술 스택

- **React 19**: 사용자 인터페이스 구성
- **TypeScript**: 타입 안정성
- **Vite**: 빠른 빌드 및 개발 서버
- **CSS**: 반응형 디자인

## 📝 사용 팁

1. 먼저 타임라인의 시작 시간과 종료 시간을 설정하세요
2. 용의자들을 추가하고 기본 정보를 입력하세요
3. 각 용의자에 대해 알아낸 증거들을 추가하세요
4. 증거 셀을 클릭하여 각 질문에 대한 답변을 표시하세요
5. 필터링 기능을 사용하여 특정 용의자만 집중적으로 분석하세요

## 🎨 UI 특징

- 직관적이고 사용하기 쉬운 인터페이스
- 색상으로 구분된 상태 표시 (O: 초록색, △: 주황색, X: 빨간색)
- 반응형 디자인으로 다양한 화면 크기 지원
- 부드러운 애니메이션과 호버 효과
  {
  files: ['**/*.{ts,tsx}'],
  extends: [
  // Other configs...

        // Remove tseslint.configs.recommended and replace with this
        tseslint.configs.recommendedTypeChecked,
        // Alternatively, use this for stricter rules
        tseslint.configs.strictTypeChecked,
        // Optionally, add this for stylistic rules
        tseslint.configs.stylisticTypeChecked,

        // Other configs...
      ],
      languageOptions: {
        parserOptions: {
          project: ['./tsconfig.node.json', './tsconfig.app.json'],
          tsconfigRootDir: import.meta.dirname,
        },
        // other options...
      },

  },
  ])

````

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
````
