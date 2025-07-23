# Design Document

## Overview

팀원 평가 페이지의 UI/UX를 개선하여 사용자가 더 직관적이고 효율적으로 팀원을 평가할 수 있도록 하는 기능입니다. 기존의 React 컴포넌트 구조를 활용하면서 새로운 디자인 시스템을 적용하여 5단계 평가 플로우를 구현합니다.

## Architecture

### Component Structure

```
TeamMemberEvaluationPage (Main Container)
├── DefaultHeader (기존 컴포넌트 재사용)
├── EvaluationStep1 (카테고리별 슬라이더 평가)
│   ├── ProjectInfoCard
│   ├── ProgressIndicator
│   ├── CategorySlider (새로운 컴포넌트)
│   └── NavigationButtons
├── EvaluationStep2 (별점 및 역할 입력)
│   ├── ProjectInfoCard
│   ├── ProgressIndicator
│   ├── RatingInputStars (기존 컴포넌트 재사용)
│   ├── RoleDescriptionInput
│   └── NavigationButtons
├── EvaluationStep3 (키워드 확인 및 수정)
│   ├── ProjectInfoCard
│   ├── ProgressIndicator
│   ├── KeywordDisplay
│   ├── KeywordEditor
│   └── NavigationButtons
├── EvaluationStep4 (응원 메시지)
│   ├── CompletionConfirmation
│   ├── EncouragementMessageInput
│   └── NavigationButtons
└── EvaluationStep5 (완료 화면)
    └── SuccessMessage
```

### State Management

```javascript
const [evaluationData, setEvaluationData] = useState({
  categoryRatings: {
    participation: 0,    // 참여도
    communication: 0,    // 소통
    responsibility: 0,   // 책임감
    collaboration: 0,    // 협력
    individualAbility: 0 // 개인능력
  },
  overallRating: 0,
  roleDescription: '',
  extractedKeywords: [],
  customKeywords: [],
  encouragementMessage: ''
});
```

## Components and Interfaces

### 1. CategorySlider Component

새로운 터치 친화적인 슬라이더 컴포넌트를 구현합니다.

**Props Interface:**
```javascript
interface CategorySliderProps {
  category: string;
  name: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}
```

**Features:**
- 터치 및 마우스 이벤트 지원
- 실시간 값 업데이트
- 시각적 피드백 (색상 변화, 애니메이션)
- 접근성 지원 (ARIA 속성)

### 2. ProjectInfoCard Component

프로젝트 정보와 팀원 프로필을 표시하는 카드 컴포넌트입니다.

**Props Interface:**
```javascript
interface ProjectInfoCardProps {
  projectData: {
    name: string;
    description: string;
    members: Member[];
  };
  currentMember: Member;
  completedMembers?: number[];
}
```

### 3. KeywordEditor Component

AI 추출 키워드를 표시하고 편집할 수 있는 컴포넌트입니다.

**Props Interface:**
```javascript
interface KeywordEditorProps {
  extractedKeywords: string[];
  customKeywords: string[];
  onKeywordAdd: (keyword: string) => void;
  onKeywordRemove: (keyword: string) => void;
}
```

### 4. ProgressIndicator Component

현재 단계와 전체 진행 상황을 표시하는 컴포넌트입니다.

**Props Interface:**
```javascript
interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  completedSteps?: number[];
}
```

## Data Models

### EvaluationData Model

```javascript
interface EvaluationData {
  projectId: number;
  memberId: number;
  evaluatorId: number;
  categoryRatings: {
    participation: number;     // 1-5
    communication: number;     // 1-5
    responsibility: number;    // 1-5
    collaboration: number;     // 1-5
    individualAbility: number; // 1-5
  };
  overallRating: number;      // 1-5
  roleDescription: string;
  extractedKeywords: string[];
  customKeywords: string[];
  encouragementMessage: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Project Model

```javascript
interface Project {
  id: number;
  name: string;
  description: string;
  period: string;
  members: Member[];
}
```

### Member Model

```javascript
interface Member {
  id: number;
  name: string;
  position: string;
  avatar: string;
  isEvaluated?: boolean;
}
```

## Error Handling

### Validation Rules

1. **카테고리 평가 검증**
   - 모든 카테고리 점수가 1-5 범위 내에 있어야 함
   - 모든 카테고리가 평가되어야 다음 단계 진행 가능

2. **별점 및 역할 설명 검증**
   - 전체 별점이 1-5 범위 내에 있어야 함
   - 역할 설명이 최소 10자 이상이어야 함

3. **키워드 검증**
   - 키워드는 최소 1개 이상 있어야 함
   - 키워드 길이는 최대 20자 제한

4. **응원 메시지 검증**
   - 비방, 비하, 욕설 필터링
   - 최대 200자 제한

### Error States

```javascript
interface ErrorState {
  categoryRatings?: string;
  overallRating?: string;
  roleDescription?: string;
  keywords?: string;
  encouragementMessage?: string;
  network?: string;
}
```

### Error Handling Strategy

- 실시간 유효성 검사
- 사용자 친화적인 오류 메시지
- 네트워크 오류 시 재시도 기능
- 데이터 손실 방지를 위한 로컬 저장

## Testing Strategy

### Unit Tests

1. **CategorySlider Component**
   - 터치/마우스 이벤트 처리
   - 값 변경 시 콜백 호출
   - 경계값 테스트 (1-5 범위)

2. **KeywordEditor Component**
   - 키워드 추가/삭제 기능
   - 중복 키워드 방지
   - 최대 키워드 수 제한

3. **Validation Functions**
   - 각 단계별 유효성 검사
   - 오류 메시지 생성
   - 경계값 및 예외 상황 처리

### Integration Tests

1. **Step Navigation**
   - 단계 간 데이터 전달
   - 이전 단계로 돌아가기
   - 진행 상황 저장

2. **API Integration**
   - 평가 데이터 저장
   - 키워드 추출 API 호출
   - 오류 상황 처리

### E2E Tests

1. **Complete Evaluation Flow**
   - 전체 평가 프로세스 완료
   - 데이터 지속성 확인
   - 다양한 디바이스에서 테스트

2. **User Experience Tests**
   - 터치 인터랙션 테스트
   - 반응형 디자인 테스트
   - 접근성 테스트

## Design System

### Color Palette

```scss
// Primary Colors
$primary-color: #f76241;      // 메인 액션 버튼, 슬라이더
$secondary-color: #52C41A;    // 성공 상태, 완료 표시
$accent-color: #FFC107;       // 별점, 강조 요소

// Neutral Colors
$gray-dark: #403e3e;          // 제목, 중요 텍스트
$gray: #807c7c;               // 일반 텍스트, 설명
$gray-light: #ececec;         // 배경, 비활성 요소
$background: #f2f2f2;         // 페이지 배경
$white: #ffffff;              // 카드 배경

// Status Colors
$error: #FF4D4F;              // 오류 메시지
$success: #52C41A;            // 성공 메시지
```

### Typography

```scss
// Font Sizes
$font-size-xs: 12px;          // 보조 정보
$font-size-sm: 14px;          // 일반 텍스트
$font-size-md: 16px;          // 기본 텍스트
$font-size-lg: 18px;          // 제목
$font-size-xl: 22px;          // 큰 제목

// Font Weights
$font-weight-regular: 400;    // 일반 텍스트
$font-weight-bold: 700;       // 제목, 강조
```

### Spacing System

```scss
$spacing-xs: 4px;             // 최소 여백
$spacing-sm: 8px;             // 작은 여백
$spacing-md: 16px;            // 기본 여백
$spacing-lg: 24px;            // 큰 여백
$spacing-xl: 32px;            // 최대 여백
```

### Border Radius

```scss
$border-radius-sm: 6px;       // 작은 요소
$border-radius-base: 10px;    // 기본 요소
$border-radius-lg: 20px;      // 카드, 큰 요소
```

## Mobile Optimization

### Touch Interactions

1. **Slider Touch Area**
   - 최소 44px 터치 영역 확보
   - 터치 피드백 애니메이션
   - 드래그 제스처 지원

2. **Button Interactions**
   - 터치 시 시각적 피드백
   - 적절한 버튼 크기 (최소 44px)
   - 터치 지연 최소화

### Responsive Design

1. **Breakpoints**
   - Mobile: 320px - 768px
   - Tablet: 768px - 1024px
   - Desktop: 1024px+

2. **Layout Adaptations**
   - 카드 여백 조정
   - 텍스트 크기 조정
   - 버튼 크기 최적화

## Performance Considerations

### Optimization Strategies

1. **Component Lazy Loading**
   - 단계별 컴포넌트 지연 로딩
   - 이미지 지연 로딩

2. **State Management**
   - 불필요한 리렌더링 방지
   - 메모이제이션 활용

3. **Bundle Size**
   - 사용하지 않는 코드 제거
   - 컴포넌트 분할

### Accessibility

1. **ARIA Support**
   - 슬라이더 ARIA 속성
   - 진행 상황 스크린 리더 지원
   - 키보드 네비게이션

2. **Color Contrast**
   - WCAG 2.1 AA 준수
   - 색상 외 추가 시각적 단서 제공

3. **Focus Management**
   - 논리적 탭 순서
   - 포커스 표시 개선