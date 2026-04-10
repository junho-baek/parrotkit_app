# 인덱스 | Index

ParrotKit 위키의 진입점이다. 현재는 2026년 4월 초 context 문서를 중심으로 제품 구조, UI 방향, 운영 규칙을 먼저 정리했다.

## Overview

- [개요 | Overview](overview.md): 현재 위키 범위와 핵심 판단 기준 요약.

## Sources

- [도메인 제품 전략 | Domain AGENTS Product Strategy](sources/domain-agents-product-strategy.md): ParrotKit을 `분석 -> 레시피 -> 촬영` 하나의 제품으로 보는 기준 문서.
- [레시피 화면 3레이어 리팩터 | Recipe Screen Refactor: Analysis / Recipe / Shooting](sources/recipe-screen-refactor-analysis-recipe-shooting.md): nested scene 계약과 3탭 구조 도입 배경.
- [원격 동기화와 최신 리뷰 | Sync Remote Review 59da22e](sources/sync-remote-review-59da22e.md): prompter debounce 저장 리스크를 처음 분명히 짚은 리뷰 기록.
- [프롬프터 저장 안정화와 커스텀 큐 | Prompter Persistence And Custom Blocks](sources/prompter-persistence-custom-blocks.md): flush 보강과 custom cue 편집 기능 정리.
- [4월 8일 레시피/슈팅 UI 반복 정리 | April 8 Recipe/Shooting UI Iteration Bundle](sources/apr-08-recipe-shooting-ui-iteration-bundle.md): same-day UI 실험, 복원, 롤백, 단순화 흐름 묶음.
- [dev-only 운영 규칙 보정 | AGENTS Dev-Only Correction](sources/agents-dev-only-correction.md): 문서상 Git 운영 기준을 실제 `dev` 흐름에 맞춘 수정.

## Concepts

- [분석-레시피-슈팅 스택 | Analysis-Recipe-Shooting Stack](concepts/analysis-recipe-shooting-stack.md): 제품의 핵심 레이어 모델.
- [브랜드 컨텍스트 정규화 | Brand Context Normalization](concepts/brand-context-normalization.md): PDF/브리프를 구조화된 brief로 바꾸는 원칙.
- [프롬프터 지속성 및 인라인 편집 | Prompter Persistence And Inline Editing](concepts/prompter-persistence-and-inline-editing.md): cue 저장, 편집, 색상, custom block 설계 축.
- [레시피 상세 UI 단순화 | Recipe Detail UI Simplification](concepts/recipe-detail-ui-simplification.md): 4월 8일 상세 화면 변화의 공통 방향.
- [dev-only 멀티클론 워크플로 | Dev-Only Multi-Clone Workflow](concepts/dev-only-multi-clone-workflow.md): 이 저장소의 작업/동기화/검증 규칙.

## Entities

- [ParrotKit](entities/parrotkit.md): 제품 전체.
- [RecipeResult](entities/recipe-result.md): 레시피 목록/상세/시트/큐 편집을 담당하는 핵심 UI 컴포넌트.
- [CameraShooting](entities/camera-shooting.md): 촬영 surface와 cue overlay를 담당하는 컴포넌트.

## Analyses

- [2026년 4월 context 맵 | Context Map for April 2026](analyses/context-map-april-2026.md): 최근 context 묶음이 무엇을 말하는지 빠르게 파악하는 안내 문서.
