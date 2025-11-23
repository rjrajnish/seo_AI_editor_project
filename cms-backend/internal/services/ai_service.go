package services

import (
    "context"
    "fmt"
    "strings"

    genai "github.com/google/generative-ai-go/genai"
    "google.golang.org/api/option"
)

type AIService struct {
    Client *genai.Client
    Model  *genai.GenerativeModel
}

func NewAIService(apiKey string) (*AIService, error) {
    ctx := context.Background()

    client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
    if err != nil {
        return nil, fmt.Errorf("failed to initialize Gemini: %w", err)
    }

    // 100% stable model
    model := client.GenerativeModel("models/gemini-2.5-flash")
    // model.GenerationConfig = &genai.GenerationConfig{
    //     Temperature: 0.8,
    // }

    return &AIService{
        Client: client,
        Model:  model,
    }, nil
}

//
// Utility: Call Gemini Safely
//
func (s *AIService) callGemini(prompt string) (string, error) {
    ctx := context.Background()

    resp, err := s.Model.GenerateContent(ctx, genai.Text(prompt))
    if err != nil {
        return "", fmt.Errorf("Gemini API error: %w", err)
    }

    raw := ""
    if len(resp.Candidates) > 0 {
        for _, p := range resp.Candidates[0].Content.Parts {
            if text, ok := p.(genai.Text); ok {
                raw += string(text)
            }
        }
    }

    if raw == "" {
        return "", fmt.Errorf("empty response from Gemini")
    }

    // Remove any accidental markdown
    raw = strings.TrimSpace(raw)
    raw = strings.TrimPrefix(raw, "```")
    raw = strings.TrimSuffix(raw, "```")
    return raw, nil
}

//
// 1. Title Generator
//
func (s *AIService) GenerateTitle(topic string) ([]string, error) {

    prompt := fmt.Sprintf(`
Generate 5 highly clickable SEO-optimized blog titles for the topic: "%s". 
Return each title on a new line.
`, topic)

    text, err := s.callGemini(prompt)
    if err != nil {
        return nil, err
    }

    return strings.Split(text, "\n"), nil
}

//
// 2. Outline Generator
//
func (s *AIService) GenerateOutline(topic string) ([]string, error) {

    prompt := fmt.Sprintf(`
Generate a detailed blog outline for: "%s".
Return each heading on a new line.
`, topic)

    text, err := s.callGemini(prompt)
    if err != nil {
        return nil, err
    }

    return strings.Split(text, "\n"), nil
}

//
// 3. Meta Description Generator
//
func (s *AIService) GenerateMeta(topic string) (string, error) {

    prompt := fmt.Sprintf(`
Write a 150-character SEO meta description for the topic: "%s".
Return ONLY the description.
`, topic)

    return s.callGemini(prompt)
}

//
// 4. Keyword Generator
//
func (s *AIService) GenerateKeywords(topic string) ([]string, error) {

    prompt := fmt.Sprintf(`
Generate 10 SEO keywords for the topic: "%s".
Return each keyword on a new line.
`, topic)

    text, err := s.callGemini(prompt)
    if err != nil {
        return nil, err
    }

    return strings.Split(text, "\n"), nil
}

//
// 5. Full Article Generator
//
func (s *AIService) GenerateArticle(topic string) (string, error) {

    prompt := fmt.Sprintf(`
Write a complete blog article about: "%s".
Include introduction, sections, examples, and conclusion.
Return clean markdown.
`, topic)

    return s.callGemini(prompt)
}
