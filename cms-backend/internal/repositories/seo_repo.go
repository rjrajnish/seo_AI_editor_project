package repositories

import (
    "context"
    "go.mongodb.org/mongo-driver/mongo"

    "github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/models"
)

type SEORepo struct {
    Col *mongo.Collection
}

func NewSEORepo(db *mongo.Database) *SEORepo {
    return &SEORepo{Col: db.Collection("seo_reports")}
}

func (r *SEORepo) Save(ctx context.Context, data *models.SEOInsight) error {
    _, err := r.Col.InsertOne(ctx, data)
    return err
}
