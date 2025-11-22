package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type RelatedKeyword struct {
    Keyword string `json:"keyword" bson:"keyword"`
}

type SERPResult struct {
    Title     string `json:"title" bson:"title"`
	Type      string `json:"type" bson:"type"`
    URL       string `json:"url" bson:"url"`
    Words     int    `json:"words" bson:"words"`
    Strength  string `json:"strength" bson:"strength"`
}

type SEOInsight struct {
    ID         primitive.ObjectID `json:"id" bson:"_id,omitempty"`
    Keyword    string             `json:"keyword" bson:"keyword"`

    EstimatedVolume string `json:"estimated_volume" bson:"estimated_volume"`
    Competition     string `json:"competition" bson:"competition"`

    RelatedKeywords     []RelatedKeyword `json:"related_keywords" bson:"related_keywords"`
    IndustryCategories  []string         `json:"industry_categories" bson:"industry_categories"`
    RankingSuggestions  []string         `json:"ranking_suggestions" bson:"ranking_suggestions"`
    SERPSimulation      []SERPResult     `json:"serp_simulation" bson:"serp_simulation"`

    CreatedAt primitive.DateTime `json:"created_at" bson:"created_at"`
}
