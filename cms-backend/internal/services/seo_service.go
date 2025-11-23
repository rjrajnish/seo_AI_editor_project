package services

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	genai "github.com/google/generative-ai-go/genai"
	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"google.golang.org/api/option"
)

type SEOService struct {
	Client *genai.Client
	Model  *genai.GenerativeModel
}

func NewSEOService(apiKey string) (*SEOService, error) {
	ctx := context.Background()

	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, fmt.Errorf("failed to init Gemini client: %w", err)
	}

	// CORRECT & TESTED MODEL
	model := client.GenerativeModel("models/gemini-2.5-flash")

	// Force JSON output
	// model.GenerationConfig = &genai.GenerationConfig{
	// 	Temperature:      0,
	// 	ResponseMimeType: "application/json",
	// }

	return &SEOService{
		Client: client,
		Model:  model,
	}, nil
}

func (s *SEOService) GenerateSEOInsight(keyword string) (*models.SEOInsight, error) {
	ctx := context.Background()

	prompt := fmt.Sprintf(`
You are an SEO Analysis Engine. For the keyword "%s", return STRICT JSON ONLY using this schema:

{
  "estimated_volume": "string" as like text and "1-2k" or "10-20M",
  "competition": "string" and also like text and "1-2k" or "10-20M",
  "related_keywords": [
    {"keyword": "string"}
  ],
  "industry_categories": ["string"],
  "ranking_suggestions": ["string"],
  "serp_simulation": [
    {
      "title": "string",
      "type": "string",
      "url": "string",
      "words": 1200,
      "strength": "strong"
    }
  ]
}
`, keyword)

	resp, err := s.Model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return nil, fmt.Errorf("Gemini API error: %w", err)
	}

	// Extract response text
	raw := ""

// ---- EXTRACT ALL TEXT PARTS SAFELY ----
if len(resp.Candidates) > 0 {
	for _, part := range resp.Candidates[0].Content.Parts {
		if text, ok := part.(genai.Text); ok {
			raw += string(text)
		}
	}
}

if raw == "" {
	return nil, fmt.Errorf("empty response from Gemini")
}

// ---- CLEAN ALL ``` MARKDOWN FENCES ----
raw = strings.TrimSpace(raw)
raw = strings.TrimPrefix(raw, "```json")
raw = strings.TrimPrefix(raw, "```JSON")
raw = strings.TrimPrefix(raw, "```")
raw = strings.TrimSuffix(raw, "```")

// Remove any leftover backticks anywhere
raw = strings.ReplaceAll(raw, "```", "")
raw = strings.Trim(raw, "` \n\t")

	if raw == "" {
		return nil, fmt.Errorf("empty response from Gemini")
	}

	// Parse JSON
	var aiData struct {
		EstimatedVolume    string                  `json:"estimated_volume"`
		Competition        string                  `json:"competition"`
		RelatedKeywords    []models.RelatedKeyword `json:"related_keywords"`
		IndustryCategories []string                `json:"industry_categories"`
		RankingSuggestions []string                `json:"ranking_suggestions"`
		SERPSimulation     []models.SERPResult     `json:"serp_simulation"`
	}

	if err := json.Unmarshal([]byte(raw), &aiData); err != nil {
		return nil, fmt.Errorf("JSON parse error: %v | RAW: %s", err, raw)
	}

	return &models.SEOInsight{
		ID:                 primitive.NewObjectID(),
		Keyword:            keyword,
		EstimatedVolume:    aiData.EstimatedVolume,
		Competition:        aiData.Competition,
		RelatedKeywords:    aiData.RelatedKeywords,
		IndustryCategories: aiData.IndustryCategories,
		RankingSuggestions: aiData.RankingSuggestions,
		SERPSimulation:     aiData.SERPSimulation,
		CreatedAt:          primitive.NewDateTimeFromTime(time.Now()),
	}, nil
}


func PrintGeminiModels(apiKey string) {
    ctx := context.Background()
    client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
    if err != nil {
        panic(err)
    }

    fmt.Println("======= SUPPORTED GEMINI MODELS (Go SDK) =======")

    it := client.ListModels(ctx)
    for {
        m, err := it.Next()
        if err != nil {
            break
        }
        fmt.Println("Model:", m.Name)
    }

    fmt.Println("================================================")
}
