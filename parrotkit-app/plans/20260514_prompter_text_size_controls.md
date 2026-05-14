# Prompter Text Size Controls

## 배경

ParrotKit v1 prompter camera should let creators adjust readable script text size while shooting, without introducing deferred features such as pinch zoom or automatic speed control.

## 목표

- Add explicit text size adjustment controls to the native prompter UI.
- Keep the setting local to the current prompter session.
- Preserve the existing manual scroll controls and camera/take workflow.

## 범위

- Add a small prompter text size helper with fixed readable size levels.
- Add plus/minus text size controls to the `LINE TO SAY` block.
- Apply selected size to primary and secondary prompter lines.

## 변경 파일

- `src/features/recipes/lib/prompter-text-size.ts`
- `src/features/recipes/lib/prompter-text-size.test.ts`
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `context/context_20260514_prompter_text_size_controls.md`

## 테스트

- Run the text size helper test directly if the local TypeScript runtime supports it.
- Run TypeScript no-emit verification if available.

## 롤백

Remove the helper/test and restore static `sayNowText` / `sayNowTextSecondary` styles in the prompter camera screen.

## 리스크

- The native camera preview cannot be fully verified from type checks alone.
- Nearby manual scroll work touches the same screen, so the patch should avoid unrelated rewrites.

## 결과

- `LINE TO SAY` prompter block에 텍스트 크기 감소/증가 컨트롤을 추가했다.
- 텍스트 크기는 `sm`, `md`, `lg`, `xl` 4단계로 제한하고 기본값은 기존 typography와 같은 `md(100%)`로 유지했다.
- 현재 단계 label을 표시하고 최소/최대 단계에서는 해당 버튼이 disabled 된다.
- 선택된 단계는 `getPrompterScriptTextStyle` helper를 통해 primary/secondary prompter script text의 font size와 line height에 즉시 반영된다.
- 검증: `npx tsc --noEmit` 통과.
- 연결 context: `context/context_20260514_prompter_text_size_controls.md`
