package repositories

import (
    "context"
    "go.mongodb.org/mongo-driver/mongo"

    "github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/models"
)

type AIRepo struct {
    Col *mongo.Collection
}

func NewAIRepo(db *mongo.Database) *AIRepo {
    return &AIRepo{Col: db.Collection("ai_prompts")}
}

func (r *AIRepo) SavePrompt(ctx context.Context, p *models.AIPrompt) error {
    _, err := r.Col.InsertOne(ctx, p)
    return err
}

func (r *AIRepo) ListPrompts(ctx context.Context) ([]models.AIPrompt, error) {
    cur, err := r.Col.Find(ctx, map[string]interface{}{})
    if err != nil {
        return nil, err
    }
    var out []models.AIPrompt
    cur.All(ctx, &out)
    return out, nil
}
