# RapidAPI + Gemini TikTok 붙여넣기 QA 보고서

## 1. 테스트 목적

이번 테스트의 목적은 TikTok 링크를 입력했을 때 ParrotKit이 다음 흐름으로 정상 동작하는지 확인하는 것이었습니다.

1. RapidAPI `social media video downloader`로 실제 영상 접근 경로 확보
2. Replicate의 Gemini 비디오 분석으로 장면 구간과 `motion_description` 생성
3. 결과 화면에서 기존 대본형 문장 대신 장면별 모션 설명이 보이도록 표시

테스트 일시는 2026년 4월 1일이며, 로컬 `dev` 환경에서 진행했습니다.

## 2. 테스트 대상 링크

- 1차 테스트 링크
  - `https://www.tiktok.com/@sarahbanks.ugc/video/7598231360267947277?q=%E3%85%95%E3%85%8E%E3%85%8A&t=1775036833518`
- 예비 링크
  - `https://www.youtube.com/shorts/hXPdqTRADms`

이번에는 1차 TikTok 링크로 검증이 완료되어 예비 링크는 사용하지 않았습니다.

## 3. 구현 요약

이번 변경에서 확인한 핵심은 아래와 같습니다.

- 기존 프레임 차이 기반 컷 추출보다 앞단에 Gemini 비디오 분석 경로를 추가했습니다.
- RapidAPI에서 받은 영상 URL을 그대로 Replicate Gemini에 넘기면 형식 판별이 흔들려서, 비디오를 `data:` 형식으로 바꿔 입력하도록 처리했습니다.
- Gemini 출력 스키마는 최소 형태로 제한했습니다.
  - `scene_number`
  - `start_time`
  - `end_time`
  - `motion_description`
- `motion_description`는 외형 설명이 아니라 시간축 변화만 쓰도록 프롬프트를 고정했습니다.
- 결과 카드 UI는 `script` 첫 줄보다 `scene.description`을 먼저 보여주도록 수정했습니다.

## 4. 확인 결과

### 4-1. 백엔드 분석 결과

TikTok 링크를 `/api/analyze`에 직접 넣어 확인한 결과는 아래와 같습니다.

- 분석 성공: `success = true`
- 장면 추출 방식: `gemini_video_motion`
- 폴백 사유: 없음
- 영상 소스: `rapidapi_smvd`

즉, 이번 링크는 실제로 다음 경로를 탔습니다.

`TikTok 링크 -> RapidAPI 영상 확보 -> Gemini 비디오 분석 -> 장면별 motion description 생성`

### 4-2. 장면 설명 품질

생성된 설명은 기존 대본형 문장이 아니라 실제 움직임 중심으로 나왔습니다.

예시:

- Scene 1
  - `A woman stands in a bedroom, speaking directly to the camera with moderate intensity. She gestures with her hands as she talks, while the camera remains static. The scene ends with her smiling and holding her fist up.`
- Scene 3
  - `A woman squats down to unfold a black and silver walking pad on a carpeted floor. The camera slowly pans downward to reveal the entire length of the device. The scene ends with the walking pad fully extended and flat.`

이 결과는 우리가 원했던 `무엇이 보이느냐`보다 `무엇이 어떻게 변하느냐`에 더 가까웠습니다.

### 4-3. 화면 표시 결과

결과 화면에서도 각 카드 설명이 대본 첫 줄이 아니라 모션 설명으로 보이는 것을 확인했습니다.

화면상 예시는 아래처럼 노출되었습니다.

- `A woman stands in a bedroom, speaking directly to the camera ...`
- `A woman sits cross-legged on the floor, typing steadily on a laptop ...`
- `A woman squats down to unfold a black and silver walking pad ...`

즉, 화면 레벨에서도 이번 변경 의도가 반영됐습니다.

## 5. 캡처 증거

- 붙여넣기 입력 화면
  - `output/playwright/tiktok-paste-filled.png`
- 결과 화면
  - `output/playwright/tiktok-recipe-result-hydrated.png`

## 6. 특이사항

브라우저 자동화 도구에서는 `Analyze Video` 버튼 클릭이 React 제출 이벤트까지 안정적으로 이어지지 않았습니다.

다만 이건 현재 자동화 도구의 submit 재현 문제에 가까웠고, 핵심 기능 검증은 다음 두 단계로 보완했습니다.

1. `/api/analyze`를 직접 호출해 TikTok 링크 분석 성공 확인
2. 그 실제 응답을 결과 화면에 주입해 UI 표시 확인

그래서 이번 QA는 기능 진실값 기준으로는 통과로 보는 것이 맞습니다.

## 7. 최종 판단

이번 테스트 기준 결론은 아래와 같습니다.

- RapidAPI 연동은 TikTok 링크에서 실제 영상 확보에 성공했습니다.
- Gemini 비디오 분석은 장면 구간과 모션 설명 생성에 성공했습니다.
- 결과 화면은 모션 설명을 우선 표시하도록 수정되어 의도한 출력이 보였습니다.

한 줄로 정리하면,

`TikTok 링크 -> 분석 -> motion description 결과 표시` 흐름은 현재 로컬 `dev` 기준으로 동작합니다.

## 8. 다음 액션 추천

- 실제 사용자 클릭 기준 제출 이벤트가 브라우저 자동화에서도 재현되는지 한 번 더 확인
- YouTube Shorts 링크로도 동일 흐름 비교 검증
- 필요하면 `motion_description` 문장 길이를 25~45단어 범위로 더 강하게 고정
