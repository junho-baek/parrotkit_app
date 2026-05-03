# Recipe Prompter Controls Context

## 시점
- 2026-05-03 10:49 KST

## 배경
- 사용자가 레시피 촬영 화면에서도 Quick Shoot처럼 프롬프터 cue를 직접 수정하고, 크기 조절, cue 추가, 불투명도 조절, 보기/안보기를 지원하길 요청했다.
- 이어서 8081을 다시 띄우되 iPhone Pro 시뮬레이터에서 확인하고 Pro Max에서는 하지 말라고 요청했다.

## 변경 요약
- `RecipePrompterCameraScreen`에서 기존 코치형 overlay만 쓰던 구조를 editable prompter block overlay 기반으로 확장했다.
- 레시피 씬별 `PrompterBlock` 상태를 로컬로 보관해 씬을 바꿀 때 해당 씬의 cue만 렌더링한다.
- 하단 촬영 컨트롤에 `NativePrompterToolbar`를 추가해 cue 추가, 편집 요청, 크기 조절, 색상 변경, 숨김/복구, 불투명도 조절을 제공한다.
- `PrompterBlock`에 선택적 `opacity` 필드를 추가하고 normalizer가 raw recipe block의 opacity를 유지하도록 했다.
- `NativePrompterBlockOverlay`가 block opacity를 실제 카드 스타일에 반영하게 했다.
- Quick Shoot 화면에도 같은 opacity toolbar 액션을 연결해 두 촬영 경험의 프롬프터 조작성을 맞췄다.
- `createPrompterDraftBlock`, `normalizePrompterOpacity` helper와 타입체크 기반 테스트를 추가했다.

## 검증
- RED: 새 helper export가 없는 상태에서 `cd parrotkit-app && npx tsc --noEmit` 실패 확인.
- GREEN: 구현 후 `cd parrotkit-app && npx tsc --noEmit` 통과.
- `git diff --check` 통과.
- Metro 8081을 재시작하고 iPhone 17 Pro 디바이스에서 `exp://127.0.0.1:8081/--/recipe/recipe-korean-diet-hook/prompter`를 열어 editable toolbar와 cue overlay가 보이는지 확인했다.
- 원격 탐색 탭 업데이트(`fix: simplify explore recommended cards`)를 최신 기준선으로 반영한 뒤 다시 타입체크했다.
- QA 스크린샷: `output/playwright/native_recipe_prompter_pro_8081_after_go.png`

## 남은 리스크
- 이번 cue 편집 상태는 촬영 화면 내 로컬 state이며 recipe 원본 데이터나 서버에 저장하지 않는다.
- 불투명도는 toolbar 버튼으로 단계 조절만 제공한다. 추후 slider/bottom sheet로 바꾸면 더 세밀하게 조정할 수 있다.
- 실제 카메라/동영상 저장 흐름 자체는 기존 mock/local 흐름을 유지했다.
