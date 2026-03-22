# Script Assistant Mode Split Persistence

## 배경
- 현재 Script Assistant는 글로벌/씬별 맥락이 하나의 대화 상태에 섞여 있어 컷별 수정 경험이 불편하다.
- `Apply to Script`로 반영한 스크립트가 레시피 재진입 시 유지되지 않는다.
- Shooting 화면에서 현재 씬 스크립트를 바로 보지 못해 촬영 프롬프터 역할이 약하다.

## 목표
- 하나의 Script Assistant UI 안에서 `Global`과 `Scene` 모드를 분리한다.
- 씬 모드는 컷별 독립 대화처럼 동작하되 전체 레시피와 인접 컷 문맥은 참고하게 한다.
- 스크립트 적용 시 즉시 서버 저장하고 재진입 시 유지되게 한다.
- Shooting 화면에 현재 씬 스크립트를 연한 회색 오버레이로 노출한다.

## 범위
- `src/components/common/RecipeResult.tsx`
- `src/components/common/CameraShooting.tsx`
- `src/app/api/chat/route.ts`
- `src/app/api/recipes/[id]/route.ts`
- 작업 기록 문서 업데이트

## 변경 파일
- `plans/20260322_script_assistant_mode_split_persistence.md`
- `src/components/common/RecipeResult.tsx`
- `src/components/common/CameraShooting.tsx`
- `src/app/api/chat/route.ts`
- `src/app/api/recipes/[id]/route.ts`
- `context/context_20260322_*_script_assistant_mode_split_persistence.md`

## 테스트
- `npx tsc --noEmit`
- 대상 파일 ESLint
- 저장/재진입/씬 전환 수동 검토

## 롤백
- Assistant를 단일 chatHistory 구조로 복구
- recipe PATCH를 title-only 동작으로 되돌림
- Shooting overlay 제거

## 리스크
- `recipeData` sessionStorage와 서버 저장 결과가 엇갈리면 재진입 시 혼란이 생길 수 있다.
- Scene/Global 전환 시 초기 메시지와 대화 복원 규칙을 잘못 처리하면 UX가 어색해질 수 있다.

## 결과
- 완료
- 요약:
  - Script Assistant를 `Global` / `Scene` 모드로 분리하고, 씬별 대화 상태를 독립적으로 관리하도록 변경했다.
  - `Apply to Script` 시 현재 씬 스크립트를 optimistic update 후 `/api/recipes/[id]`에 즉시 저장하고 session cache도 갱신하도록 연결했다.
  - Shooting 화면에 현재 씬 스크립트를 연한 회색 오버레이로 노출하도록 추가했다.
  - `/api/chat` 프롬프트를 모드 기반으로 재구성해 scene mode는 현재 씬 중심, global mode는 전체 레시피 중심으로 동작하게 조정했다.

## 연결 Context
- `context/context_20260322_221500_script_assistant_mode_split_persistence.md`
