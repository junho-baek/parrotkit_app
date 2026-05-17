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
