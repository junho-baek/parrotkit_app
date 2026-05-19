package analysis

import (
	"testing"

	"github.com/junho-baek/parrotkit-app/services/reference-api/internal/contracts"
)

func TestDeriveResponseStatusReadyWhenRecipeAndBoardUsable(t *testing.T) {
	status := deriveResponseStatus(usableStatusRecipe(), usableStatusCutBoard(), nil)
	if status != contracts.StatusReady {
		t.Fatalf("status = %s", status)
	}
}

func TestDeriveResponseStatusPartialReadyWhenOnlyVisualExtractMissing(t *testing.T) {
	status := deriveResponseStatus(usableStatusRecipe(), usableStatusCutBoard(), []string{"visual_extract"})
	if status != contracts.StatusPartialReady {
		t.Fatalf("status = %s", status)
	}
}

func TestDeriveResponseStatusFailedWhenBoardIsNotUsable(t *testing.T) {
	status := deriveResponseStatus(usableStatusRecipe(), &contracts.CutBoard{}, []string{"visual_extract"})
	if status != contracts.StatusFailed {
		t.Fatalf("status = %s", status)
	}
}

func usableStatusRecipe() *contracts.Recipe {
	return &contracts.Recipe{
		Title: "Reference board",
		Scenes: []contracts.RecipeScene{{
			Index:           1,
			ProjectionCutID: "cut-1",
			Title:           "Hook",
		}},
	}
}

func usableStatusCutBoard() *contracts.CutBoard {
	return &contracts.CutBoard{
		Items: []contracts.CutBoardItem{{
			ProjectionCutID: "cut-1",
		}},
	}
}
