package services

import (
    "fmt"
    "strings"
)

type AIService struct{}

func NewAIService() *AIService { return &AIService{} }

// 1. Title Generator
func (s *AIService) GenerateTitle(topic string) []string {
    return []string{
        fmt.Sprintf("Top 10 %s You Must Know", topic),
        fmt.Sprintf("Ultimate Guide to %s", topic),
        fmt.Sprintf("Everything About %s (Explained)", topic),
    }
}

// 2. Outline Generator
func (s *AIService) GenerateOutline(topic string) []string {
    return []string{
        "Introduction",
        fmt.Sprintf("What is %s?", topic),
        fmt.Sprintf("Benefits of %s", topic),
        fmt.Sprintf("How to use %s effectively", topic),
        "Conclusion",
    }
}

// 3. Meta Description Generator
func (s *AIService) GenerateMeta(topic string) string {
    return fmt.Sprintf("Learn everything about %s in this complete guide. Simple, clear, and optimized for SEO.", topic)
}

// 4. Keyword Generator
func (s *AIService) GenerateKeywords(topic string) []string {
    base := strings.ToLower(topic)
    return []string{
        base + " guide",
        base + " tutorial",
        "best " + base,
        base + " for beginners",
        base + " tools",
    }
}

// 5. Full Article Generator
func (s *AIService) GenerateArticle(topic string) string {
    return fmt.Sprintf(`
# %s

## Introduction
This article explains everything about %s in a simple and clear way.

## What is %s?
%s is a trending topic that has gained huge popularity.

## Benefits
- Easy to understand  
- Very useful  
- Saves time  

## Conclusion
You now understand the basics of %s.

`, strings.Title(topic), topic, topic, topic, topic)
}
