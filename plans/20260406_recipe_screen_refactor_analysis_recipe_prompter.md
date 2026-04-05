# Recipe Screen Refactor: Analysis / Recipe / Prompter

## 배경
- 현재 레시피 화면은 원본 분석, 생성 레시피, 촬영 프롬프터가 `description`/`script` 중심으로 뒤섞여 있다.
- 상세 화면은 `Recipe / Shooting` 2탭 구조라서 “왜 이 레퍼런스가 좋은가”와 “내 컷에서 뭘 말하고 어떻게 찍어야 하는가”가 분리되지 않는다.
- 브랜드 PDF를 실제 컨텍스트로 넣고, 컷별 프롬프터 블록을 촬영 화면에 띄우는 방향으로 제품 기준이 정리됐다.

## 목표
- scene 계약을 `analysis / recipe / prompter`로 분리한다.
- 상세 화면을 `Analysis / Recipe / Prompter` 3탭 구조로 재편한다.
- PDF 업로드 및 LLM 기반 `brandBrief` 추출을 분석/저장 흐름에 포함한다.
- 기존 저장 recipe는 읽기 호환을 유지하면서 새 저장부터 새 구조를 쓰게 한다.

## 범위
- `src/types/recipe.ts`
- `src/lib/recipe-scene.ts` 신규
- `src/lib/brand-brief.ts` 신규
- `src/app/api/analyze/route.ts`
- `src/app/api/chat/route.ts`
- `src/app/api/recipes/route.ts`
- `src/app/api/recipes/[id]/route.ts`
- `src/components/auth/URLInputForm.tsx`
- `src/components/auth/DashboardContent.tsx`
- `src/components/common/RecipeResult.tsx`
- `src/components/common/RecipeVideoPlayer.tsx`
- `src/components/common/CameraShooting.tsx`
- `package.json`
- `package-lock.json`

## 변경 파일
- 타입/정규화 유틸 추가 및 기존 scene 계약 확장
- analyze/chat/recipes API의 입출력 shape 재정의
- recipe 상세 화면과 prompter 촬영 화면 UI 재구성
- paste/submit 입력에 브랜드 PDF 업로드 필드 추가

## 테스트
- `npm install`
- `npx eslint src/components/common/RecipeResult.tsx src/components/common/RecipeVideoPlayer.tsx src/components/common/CameraShooting.tsx src/components/auth/URLInputForm.tsx src/components/auth/DashboardContent.tsx src/app/api/analyze/route.ts src/app/api/chat/route.ts src/app/api/recipes/route.ts 'src/app/api/recipes/[id]/route.ts' src/lib/recipe-scene.ts src/lib/brand-brief.ts src/types/recipe.ts`
- `npm run dev`
- 로컬 브라우저에서 paste -> analyze -> recipe detail -> analysis/recipe/prompter -> recipe reopen 검증

## 롤백
- scene JSON nested shape 도입 후 문제 발생 시 `normalizeRecipeScene` 기반 legacy fallback만 유지하고 nested 필드를 숨겨 기존 `description/script` 중심 UI로 되돌린다.
- PDF 추출 경로 문제 시 업로드 필드를 숨기고 `brandBrief` 생성 단계를 비활성화한다.

## 리스크
- 기존 recipe JSON을 여러 컴포넌트가 직접 가정하고 있어 누락된 정규화 지점이 있으면 reopen 시 깨질 수 있다.
- PDF 텍스트 추출 품질이 낮은 문서에서는 `brandBrief`가 빈 값으로 저장될 수 있다.
- prompter drag/drop은 웹 카메라 레이어 위에서 pointer event 처리가 꼬일 수 있어 scene 전환/record 버튼과 충돌 가능성이 있다.

## 결과
- 완료
- scene 계약을 `analysis / recipe / prompter` nested shape로 확장했고 legacy `description / script`는 read-through fallback으로 유지했다.
- `brandBrief` 추출/저장 경로를 추가해 analyze 응답, recipe 저장, reopen hydration까지 같은 shape를 쓰도록 맞췄다.
- 상세 화면은 `Analysis / Recipe / Prompter` 3탭으로 재구성했고, `Prompter` 안에서 block visible/size/preset 변경이 가능해졌다.
- Scene Assistant는 script-only 응답 대신 `sceneUpdate` 기반 구조화 수정 계약으로 바뀌었다.
- 로컬 QA는 mock `recipeData` 세션을 주입해 3탭 렌더, brand context 배지, prompter layout 패널, visible 토글을 확인했다.
- API 쪽은 invalid PDF 업로드 시 `400`과 한국어 에러 응답을 확인했고, legacy scene normalize smoke test도 통과했다.
- 외부 서비스가 필요한 `URL + PDF 실제 analyze` end-to-end는 로컬에서 장시간 대기만 발생해 이번 턴에서는 완료하지 못했다.

## 연결 context
- `context/context_20260406_224900_recipe_screen_refactor_analysis_recipe_prompter.md`
