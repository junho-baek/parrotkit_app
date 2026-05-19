package analysis

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"strings"
)

type RecipeDraft struct {
	OneLineDescription string             `json:"oneLineDescription"`
	Scenes             []RecipeDraftScene `json:"scenes"`
	Title              string             `json:"title"`
}

type RecipeDraftScene struct {
	DurationSec          int      `json:"durationSec"`
	LineToSay            string   `json:"lineToSay"`
	MyTakeRelationship   string   `json:"myTakeRelationship"`
	ReferenceObservation string   `json:"referenceObservation"`
	ReferenceUsage       string   `json:"referenceUsage"`
	ShootingGuideline    string   `json:"shootingGuideline"`
	SuccessCriteria      []string `json:"successCriteria"`
	Title                string   `json:"title"`
}

type ModelOutputError struct {
	Code   string
	Reason string
	Err    error
}

func (e ModelOutputError) Error() string {
	if e.Err == nil {
		return e.Code + ": " + e.Reason
	}
	return e.Code + ": " + e.Reason + ": " + e.Err.Error()
}

func (e ModelOutputError) Unwrap() error {
	return e.Err
}

func ParseRecipeDraft(text string) (RecipeDraft, error) {
	trimmed := stripMarkdownFence(strings.TrimSpace(text))
	if trimmed == "" {
		return RecipeDraft{}, modelOutputError("empty_output", nil)
	}

	var raw any
	decoder := json.NewDecoder(strings.NewReader(trimmed))
	decoder.UseNumber()
	if err := decoder.Decode(&raw); err != nil {
		return RecipeDraft{}, modelOutputError(classifyJSONError(err, trimmed), err)
	}
	var extra any
	if err := decoder.Decode(&extra); err != io.EOF {
		if err == nil {
			return RecipeDraft{}, modelOutputError("invalid_json", fmt.Errorf("extra JSON values"))
		}
		return RecipeDraft{}, modelOutputError(classifyJSONError(err, trimmed), err)
	}

	draft, ok, err := draftFromRaw(raw)
	if err != nil {
		return RecipeDraft{}, err
	}
	if !ok {
		return RecipeDraft{}, modelOutputError("missing_draft", nil)
	}
	normalizeDraft(&draft)
	if err := validateDraft(draft); err != nil {
		return RecipeDraft{}, err
	}
	return draft, nil
}

func draftFromRaw(raw any) (RecipeDraft, bool, error) {
	if object, ok := raw.(map[string]any); ok {
		if _, hasScenes := object["scenes"]; hasScenes {
			draft, err := decodeDraft(object)
			return draft, true, err
		}
		for _, key := range []string{"analysis", "draft", "recipeDraft", "result"} {
			value, exists := object[key]
			if !exists {
				continue
			}
			if nestedObject, ok := value.(map[string]any); ok {
				if _, hasScenes := nestedObject["scenes"]; hasScenes {
					draft, err := decodeDraft(nestedObject)
					return draft, true, err
				}
			}
			if nestedText, ok := value.(string); ok {
				draft, err := ParseRecipeDraft(nestedText)
				return draft, err == nil, err
			}
		}
	}
	return RecipeDraft{}, false, nil
}

func decodeDraft(value any) (RecipeDraft, error) {
	bytes, err := json.Marshal(value)
	if err != nil {
		return RecipeDraft{}, modelOutputError("invalid_json", err)
	}
	var draft RecipeDraft
	if err := json.Unmarshal(bytes, &draft); err != nil {
		return RecipeDraft{}, modelOutputError("invalid_draft_shape", err)
	}
	return draft, nil
}

func normalizeDraft(draft *RecipeDraft) {
	draft.Title = strings.TrimSpace(draft.Title)
	draft.OneLineDescription = strings.TrimSpace(draft.OneLineDescription)
	for index := range draft.Scenes {
		scene := &draft.Scenes[index]
		scene.Title = strings.TrimSpace(scene.Title)
		scene.LineToSay = strings.TrimSpace(scene.LineToSay)
		scene.ShootingGuideline = strings.TrimSpace(scene.ShootingGuideline)
		scene.ReferenceObservation = strings.TrimSpace(scene.ReferenceObservation)
		scene.ReferenceUsage = strings.TrimSpace(scene.ReferenceUsage)
		scene.MyTakeRelationship = strings.TrimSpace(scene.MyTakeRelationship)
		scene.SuccessCriteria = compactStrings(scene.SuccessCriteria)
	}
}

func validateDraft(draft RecipeDraft) error {
	if len(draft.Scenes) == 0 {
		return modelOutputError("empty_scenes", nil)
	}
	for _, scene := range draft.Scenes {
		if scene.Title != "" || scene.LineToSay != "" || scene.ShootingGuideline != "" {
			return nil
		}
	}
	return modelOutputError("empty_scenes", nil)
}

func compactStrings(values []string) []string {
	result := make([]string, 0, len(values))
	for _, value := range values {
		trimmed := strings.TrimSpace(value)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}
	return result
}

func modelOutputError(reason string, err error) ModelOutputError {
	return ModelOutputError{Code: "model_invalid_output", Reason: reason, Err: err}
}

func classifyJSONError(err error, text string) string {
	if strings.Contains(err.Error(), "unexpected EOF") || looksTruncatedJSON(text) {
		return "truncated_json"
	}
	return "invalid_json"
}

func looksTruncatedJSON(text string) bool {
	var stack []rune
	inString := false
	escaped := false
	for _, char := range text {
		if inString {
			if escaped {
				escaped = false
				continue
			}
			switch char {
			case '\\':
				escaped = true
			case '"':
				inString = false
			}
			continue
		}
		switch char {
		case '"':
			inString = true
		case '{', '[':
			stack = append(stack, char)
		case '}':
			if len(stack) == 0 || stack[len(stack)-1] != '{' {
				return false
			}
			stack = stack[:len(stack)-1]
		case ']':
			if len(stack) == 0 || stack[len(stack)-1] != '[' {
				return false
			}
			stack = stack[:len(stack)-1]
		}
	}
	return inString || len(stack) > 0
}

func stripMarkdownFence(text string) string {
	if !strings.HasPrefix(text, "```") {
		return text
	}
	lines := strings.Split(text, "\n")
	if len(lines) == 0 || !strings.HasPrefix(strings.TrimSpace(lines[0]), "```") {
		return text
	}
	lines = lines[1:]
	if len(lines) > 0 && strings.TrimSpace(lines[len(lines)-1]) == "```" {
		lines = lines[:len(lines)-1]
	}
	return strings.TrimSpace(strings.Join(lines, "\n"))
}

func modelOutputShapePreview(text string) string {
	trimmed := stripMarkdownFence(strings.TrimSpace(text))
	if trimmed == "" {
		return "empty"
	}
	var raw any
	decoder := json.NewDecoder(bytes.NewReader([]byte(trimmed)))
	decoder.UseNumber()
	if err := decoder.Decode(&raw); err != nil {
		if looksTruncatedJSON(trimmed) {
			return "truncated_json"
		}
		return "invalid_json"
	}
	object, ok := raw.(map[string]any)
	if !ok {
		return fmt.Sprintf("%T", raw)
	}
	keys := make([]string, 0, len(object))
	for key := range object {
		keys = append(keys, key)
		if len(keys) == 4 {
			break
		}
	}
	return "object:" + strings.Join(keys, ",")
}
