# 20260429 Local Take Projects

## 요약
- Recipe shooting과 Quick Shoot에서 녹화 직후 갤러리 자동 저장을 중단했다.
- 녹화된 take는 앱 내부 local take project에 먼저 보관한다.
- 각 recipe scene과 Quick Shoot project는 여러 take와 best take를 가진다.
- 사용자는 선택한 take만 native Gallery에 저장하거나 `Open in...`으로 외부 앱에 보낼 수 있다.

## 구현
- `MockProjectTake`, `MockRecipeTakeProject`, `MockQuickTakeProject` 타입을 추가했다.
- `take-projects.ts`에 add/delete/best/export 상태 변경 helper를 추가했다.
- `take-export.ts`에 Gallery 저장과 React Native share sheet helper를 추가했다.
- mock workspace provider가 scene별 take collection과 Quick Shoot take project를 관리한다.
- recipe camera와 Quick Shoot camera 모두 `Keep` 우선 local take flow로 변경했다.
- `NativeTakeTray`에서 best 선택, Gallery 저장, Open in..., delete를 제공한다.

## 검증
- `cd parrotkit-app && npx tsc --noEmit` 통과.
- `curl -s http://localhost:8081/status` 결과 `packager-status:running`.
- 새 native module을 추가하지 않아 dev-client 재빌드 없이 Metro reload로 확인 가능한 범위다.

## 리스크
- v1 metadata는 mock provider state라 앱 재시작 후 take 목록은 유지되지 않는다.
- 녹화 URI 자체는 현재 앱 local URI를 사용한다. 장기 보관을 위해서는 다음 단계에서 file-system 문서 저장소로 복사하는 영속화가 필요하다.
- CapCut 등 외부 앱 노출 여부는 iOS share sheet와 설치 앱 상태에 의존한다.
