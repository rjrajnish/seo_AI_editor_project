package repositories

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/models"
)

type ArticleRepo struct{ Col *mongo.Collection }

func NewArticleRepo(db *mongo.Database) *ArticleRepo {
	return &ArticleRepo{Col: db.Collection("articles")}
}

// ------------------ BASIC CRUD (Already existed) ------------------

func (r *ArticleRepo) Create(ctx context.Context, a *models.Article) error {
	_, err := r.Col.InsertOne(ctx, a)
	return err
}

func (r *ArticleRepo) List(ctx context.Context) ([]models.Article, error) {
	cur, err := r.Col.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	var out []models.Article
	cur.All(ctx, &out)
	return out, nil
}

func (r *ArticleRepo) FindByID(ctx context.Context, id interface{}) (*models.Article, error) {
	var a models.Article
	err := r.Col.FindOne(ctx, bson.M{"_id": id}).Decode(&a)
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
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

// ------------------ NEW METHODS FOR CONTENT PAGE ------------------

// 1️⃣ List with Search + Status + Pagination
func (r *ArticleRepo) ListAdvanced(ctx context.Context, search string, status string, skip int, limit int) ([]models.Article, error) {
	filter := bson.M{}

	if search != "" {
		filter["title"] = bson.M{"$regex": search, "$options": "i"}
	}

	if status != "" && status != "All" {
		filter["status"] = status
	}

	opts := options.Find().SetSkip(int64(skip)).SetLimit(int64(limit)).SetSort(bson.M{"updated_at": -1})

	cur, err := r.Col.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}

	var out []models.Article
	cur.All(ctx, &out)
	return out, nil
}

// 2️⃣ Count documents (for pagination)
func (r *ArticleRepo) Count(ctx context.Context, search string, status string) (int64, error) {
	filter := bson.M{}

	if search != "" {
		filter["title"] = bson.M{"$regex": search, "$options": "i"}
	}

	if status != "" && status != "All" {
		filter["status"] = status
	}

	return r.Col.CountDocuments(ctx, filter)
}

// 3️⃣ Find by UUID (UI uses UUID, not _id)
func (r *ArticleRepo) FindByUUID(ctx context.Context, uuid string) (*models.Article, error) {
	var a models.Article
	err := r.Col.FindOne(ctx, bson.M{"uuid": uuid}).Decode(&a)
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	return &a, err
}

// 4️⃣ Update by UUID (cleaner for frontend apps)
func (r *ArticleRepo) UpdateByUUID(ctx context.Context, uuid string, update interface{}) error {
	_, err := r.Col.UpdateOne(ctx, bson.M{"uuid": uuid}, bson.M{"$set": update})
	return err
}
