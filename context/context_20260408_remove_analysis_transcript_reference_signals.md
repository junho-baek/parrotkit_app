# Context - Remove Analysis Transcript / Reference Signals

## 작업 요약
- `Analysis` 탭에서 `View Original Script` drawer가 이미 transcript 역할을 담당하므로, 본문에 남아 있던 `Original Transcript`와 `Reference Signals` 섹션을 제거했습니다.
- 결과적으로 `Analysis` 탭은 `Motion View`와 `Why It Works` 중심의 더 간결한 구성으로 정리됐습니다.

## 변경 파일
- `src/components/common/RecipeVideoPlayer.tsx`
- `plans/20260408_remove_analysis_transcript_reference_signals.md`

## 구현 메모
- `Original Transcript` section 제거
- `Reference Signals` section 제거
- 더 이상 쓰지 않는 `getSignalTone()` helper도 함께 삭제

## 검증
- 별도 실행 검증은 이번 턴에서 수행하지 않았습니다.

## 남은 리스크
- reference signals가 완전히 사라지면서 일부 분석 근거가 요약적으로만 남을 수 있습니다.
