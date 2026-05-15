# Context 2026-05-16 Home Copy Stable

## 작업
Seed issue 6 AC 11: Home copy가 concise하고 recipe/reference oriented 상태를 유지하며 user-facing CTA copy에 workflow/debug/Shoot wording이 재도입되지 않도록 regression guard를 보강했다.

## 변경
- Updated `src/features/home/lib/home-primary-cta.test.ts`
  - `assertStableHomeCopy` helper를 추가했다.
  - English/Korean continue/start Home primary CTA의 모든 반환 copy field를 검사해 `workflow`, `워크플로우`, `Shoot`, `New Shoot`, `Start Shoot`, `console`, `debug` wording이 들어오면 실패하도록 했다.

## 검증
- PASS: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-primary-cta.test.ts`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-primary-cta-check.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false`
- PASS: Home UI/source focused copy scan found only internal symbol names, not user-facing banned copy:
  - `rg -n "workflow|워크플로우|Shoot|New Shoot|Start Shoot|Open shoot board|console|debug" src/features/home/lib/home-primary-cta.ts src/core/i18n/app-language.tsx src/features/home/components/home-workspace-surface.tsx -S`
- BLOCKED: `npx -y @google/design.md lint DESIGN.md`
  - npm registry DNS 실패: `getaddrinfo ENOTFOUND registry.npmjs.org`

## 리스크 / 후속
- `@google/design.md` package가 local `node_modules/.bin`에 없어 restricted network 환경에서는 DESIGN lint를 완료할 수 없었다.
- 내부 함수명/file명에는 legacy `workflow`/`ShootBoard` 용어가 남아 있다. 이번 AC 검증은 user-facing Home copy fields와 Home UI literals에 한정했다.
