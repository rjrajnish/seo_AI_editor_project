package services

import (
	"time"

	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SEOService struct{}

func NewSEOService() *SEOService { return &SEOService{} }

func (s *SEOService) GenerateSEOInsight(keyword string) *models.SEOInsight {

    // Fake ranges like UI (40k-60k)
    volume := "40k - 60k"
    competition := "40k - 60k"

    return &models.SEOInsight{
        Keyword: keyword,

        EstimatedVolume: volume,
        Competition:     competition,

        RelatedKeywords: []models.RelatedKeyword{
            {Keyword: "best " + keyword + " 2025"},
            {Keyword: "budget " + keyword},
            {Keyword: keyword + " battery life"},
            {Keyword: "android compatible " + keyword},
        },

        IndustryCategories: []string{
            "ecommerce", "tech", "news",
        },

        RankingSuggestions: []string{
            "Add comparison table (original images)",
            "Add schema markup (ProductReview)",
            "Increase content to 1200+ words",
            "Acquire backlinks from tech blogs",
        },

        SERPSimulation: []models.SERPResult{
            {Title: "Result 1 Title - Example Site", Type: "Organic", URL: "https://example1.com", Words: 1000, Strength: "strong"},
            {Title: "Result 2 Title - Example Site",Type: "Ecommerce", URL: "https://example2.com", Words: 1200, Strength: "strong"},
            {Title: "Result 3 Title - Example Site", Type: "Research", URL: "https://example3.com", Words: 1100, Strength: "medium"},
            {Title: "Result 4 Title - Example Site", Type: "Retail", URL: "https://example4.com", Words: 1300, Strength: "strong"},
        },

        CreatedAt: primitive.NewDateTimeFromTime(time.Now()),
    }
}
