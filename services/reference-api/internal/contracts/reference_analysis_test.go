package contracts

import "testing"

func TestReadyRequiresUsableArtifacts(t *testing.T) {
	response := ReadyFixture()
	if err := response.Validate(); err != nil {
		t.Fatalf("ready Validate() error = %v", err)
	}
}

func TestPartialRequiresUsableCutBoard(t *testing.T) {
	response := ReadyFixture()
	response.Status = StatusPartialReady
	response.Generation.MissingArtifacts = []string{"transcript"}
	response.CutBoard.Items = nil

	if err := response.Validate(); err == nil {
		t.Fatalf("partial_ready without cutBoard items should fail validation")
	}
}

func TestPartialWithMissingArtifactsAndBoardIsValid(t *testing.T) {
	response := ReadyFixture()
	response.Status = StatusPartialReady
	response.Generation.MissingArtifacts = []string{"transcript"}

	if err := response.Validate(); err != nil {
		t.Fatalf("partial_ready Validate() error = %v", err)
	}
}

func TestFallbackCannotContainFakeBreakdown(t *testing.T) {
	response := ReadyFixture()
	response.Status = StatusFallback
	response.Generation.FallbackUsed = true
	response.Error = &AnalysisError{
		Code:           "metadata_only",
		UserMessage:    "This link could not be fully analyzed.",
		Retryable:      true,
		RecoveryAction: RecoveryRetry,
	}

	if err := response.Validate(); err == nil {
		t.Fatalf("fallback with breakdown should fail validation")
	}
}

func TestFailedCannotContainBoard(t *testing.T) {
	response := ReadyFixture()
	response.Status = StatusFailed
	response.Error = &AnalysisError{
		Code:           "provider_auth",
		UserMessage:    "Reference analysis is not available right now.",
		Retryable:      false,
		RecoveryAction: RecoveryTryLater,
	}

	if err := response.Validate(); err == nil {
		t.Fatalf("failed with cutBoard should fail validation")
	}
}

func TestReadyFixtureIncludesTwoRecipeVariants(t *testing.T) {
	response := ReadyFixture()

	if response.Recipe.DefaultVariant != "sourceFaithful" {
		t.Fatalf("recipe default variant = %q", response.Recipe.DefaultVariant)
	}
	if response.CutBoard.DefaultVariant != "sourceFaithful" {
		t.Fatalf("cutBoard default variant = %q", response.CutBoard.DefaultVariant)
	}
	for _, name := range []string{"sourceFaithful", "goalAdapted"} {
		recipeVariant, ok := response.Recipe.Variants[name]
		if !ok || len(recipeVariant.Scenes) == 0 {
			t.Fatalf("missing recipe variant %q: %#v", name, response.Recipe.Variants)
		}
		boardVariant, ok := response.CutBoard.Variants[name]
		if !ok || len(boardVariant.Items) == 0 {
			t.Fatalf("missing cutBoard variant %q: %#v", name, response.CutBoard.Variants)
		}
	}
}
