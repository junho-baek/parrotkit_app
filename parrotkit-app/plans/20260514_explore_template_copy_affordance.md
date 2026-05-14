# Explore Template Copy Affordance

## 배경
Sub-AC 5.1.1 requires Explore template cards to expose a clear copy affordance when template copy is available. Existing Explore cards already support local recipe copy/save, but the visible card affordance can be more explicit than a bookmark-style save cue.

## 목표
- Recipe-backed unsaved Explore cards clearly present a template-copy action.
- Saved recipe-backed cards continue to present shooting access.
- Brand/static cards remain Pro/deferred and do not enter template copy.
- Keep the change minimal and simulator-oriented.

## 범위
- Explore template action affordance helper.
- Explore card CTA icon/label/accessibility for recommended and browse cards.
- Focused TypeScript verification only.

## 변경 파일
- `plans/20260514_explore_template_copy_affordance.md`
- `src/features/explore/lib/explore-template-copy-action.ts`
- `src/features/explore/lib/explore-template-copy-action.test.ts`
- `src/features/explore/screens/explore-screen.tsx`
- `context/context_20260514_explore_template_copy_affordance.md`

## 테스트
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json`

## 롤백
- 위 파일 변경을 되돌리면 Explore card CTA는 기존 텍스트/북마크 중심 표현으로 돌아간다.

## 리스크
- 실제 iPhone simulator QA는 이 run에서 최종 acceptance gate로 요구되지만, 이 sub-AC의 코드 변경은 작은 UI copy/affordance 변경에 한정한다.

## 결과
- Unsaved recipe-backed Explore cards now use the explicit `Copy template` / `템플릿 복사` CTA label.
- Recommended and browse Explore cards now render a `content-copy` icon for available template copy instead of a bookmark-style save cue.
- Saved recipe-backed cards continue to render filming access, and brand/static cards remain deferred/apply.
- 연결 context: `context/context_20260514_explore_template_copy_affordance.md`

## 검증 결과
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json` 통과.
- iPhone simulator QA 시도: `xcrun simctl list devices available` failed because CoreSimulatorService was unavailable in this sandbox/session (`Connection refused` / `CoreSimulatorService connection became invalid`).
