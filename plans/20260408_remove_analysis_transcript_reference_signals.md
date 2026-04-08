# Analysis 탭 transcript / reference signals 제거 계획

## 배경
`Analysis` 탭에 `View Original Script` drawer가 추가된 뒤에도 본문 안에 `Original Transcript`와 `Reference Signals`가 남아 있어 정보가 중복되고 화면이 복잡하게 보입니다.

## 목표
`Analysis` 탭 본문을 `Motion View`와 `Why It Works` 중심으로 단순화하고, transcript 확인은 drawer로 일원화합니다.

## 범위
- `src/components/common/RecipeVideoPlayer.tsx`에서 `Original Transcript` 섹션 제거
- `src/components/common/RecipeVideoPlayer.tsx`에서 `Reference Signals` 섹션 제거
- 관련 unused helper 정리

## 변경 파일
- `plans/20260408_remove_analysis_transcript_reference_signals.md`
- `src/components/common/RecipeVideoPlayer.tsx`
- `context/context_20260408_remove_analysis_transcript_reference_signals.md` (작업 후 기록)

## 테스트
- 별도 실행 검증은 사용자 요청 시 진행

## 롤백
- `RecipeVideoPlayer`의 `Original Transcript` / `Reference Signals` 섹션과 signal tone helper 복원

## 리스크
- reference signals를 인라인으로 빠르게 훑고 싶었던 사용자는 drawer/다른 섹션 이동이 한 단계 더 필요해질 수 있습니다.

## 결과
- `Analysis` 탭 본문에서 `Original Transcript`와 `Reference Signals`를 제거했습니다.
- transcript 확인은 drawer로 일원화했고, 연결 context는 `context/context_20260408_remove_analysis_transcript_reference_signals.md`에 기록했습니다.
