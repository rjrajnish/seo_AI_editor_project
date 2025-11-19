package repositories

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/models"
)

type ArticleRepo struct{ Col *mongo.Collection }

func NewArticleRepo(db *mongo.Database) *ArticleRepo { return &ArticleRepo{ Col: db.Collection("articles") } }

func (r *ArticleRepo) Create(ctx context.Context, a *models.Article) error {
	_, err := r.Col.InsertOne(ctx, a)
	return err
}

func (r *ArticleRepo) List(ctx context.Context) ([]models.Article, error) {
	cur, err := r.Col.Find(ctx, bson.M{})
	if err != nil { return nil, err }
	var out []models.Article
	cur.All(ctx, &out)
	return out, nil
}

func (r *ArticleRepo) FindByID(ctx context.Context, id interface{}) (*models.Article, error) {
	var a models.Article
	err := r.Col.FindOne(ctx, bson.M{"_id": id}).Decode(&a)
	if err == mongo.ErrNoDocuments { return nil, nil }
	return &a, err
}

func (r *ArticleRepo) Update(ctx context.Context, id interface{}, update interface{}) error {
	_, err := r.Col.UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": update})
	return err
}

func (r *ArticleRepo) Delete(ctx context.Context, id interface{}) error {
	_, err := r.Col.DeleteOne(ctx, bson.M{"_id": id})
	return err
}
