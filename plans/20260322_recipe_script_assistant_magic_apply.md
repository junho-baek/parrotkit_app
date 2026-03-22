# Recipe Script Assistant Magic Apply UX

## 배경
- `Apply to Script` 버튼이 일반 버튼이라 스크립트 적용 순간의 피드백이 약하다.
- 사용자는 더 “마법처럼 적용되는” 느낌의 인터랙션과, 적용 중 대기 UI, script/chat drawer 자동 전환을 원한다.
- shadcn 기반으로 `@magicui/interactive-hover-button`과 `spinner` 사용 요청이 있었다.

## 목표
- `Apply to Script` 버튼을 interactive hover button 스타일로 교체한다.
- 적용 중 spinner와 비활성화 상태를 제공한다.
- 적용 후 Script Assistant drawer를 자동으로 닫는다.
- `View Script`와 Script Assistant drawer가 자연스럽게 서로 전환되도록 만든다.

## 범위
- shadcn 초기화 및 필요한 컴포넌트 추가
- `src/components/common/RecipeResult.tsx`
- 필요 시 관련 생성 컴포넌트 import 정리
- 작업 기록 문서 업데이트

## 변경 파일
- `plans/20260322_recipe_script_assistant_magic_apply.md`
- `src/components/common/RecipeResult.tsx`
- `components.json`
- shadcn add로 생성되는 컴포넌트 파일
- `context/context_20260322_*_recipe_script_assistant_magic_apply.md`

## 테스트
- `npx tsc --noEmit`
- 대상 파일 ESLint
- 상호작용 상태 확인

## 롤백
- 생성된 shadcn 컴포넌트 제거
- 기존 Apply 버튼/기본 drawer 상태 전환으로 복구

## 리스크
- shadcn가 현재 프로젝트에 초기화되지 않아 최초 설정 파일이 추가된다.
- Magic UI registry 컴포넌트 import 경로가 프로젝트 alias와 맞지 않을 수 있어 수동 보정이 필요할 수 있다.

## 결과
- 완료
- 요약:
  - shadcn 초기화 후 `@magicui/interactive-hover-button`과 `spinner`를 추가했다.
  - `Apply to Script`를 interactive hover button으로 교체하고, 적용 중에는 spinner와 `Applying magic...` 대기 상태를 표시하도록 변경했다.
  - 스크립트 적용 후 Script Assistant drawer는 자동으로 닫히고 Script drawer가 자동으로 열리도록 연결했다.
  - `View Script`를 누르면 Script drawer가 열리면서 Script Assistant drawer는 자동으로 닫히도록 상태를 통합했다.

## 연결 Context
- `context/context_20260322_092500_recipe_script_assistant_magic_apply.md`
