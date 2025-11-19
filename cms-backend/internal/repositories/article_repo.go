
package repositories

import (
    "context"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "github.com/example/cms-backend/internal/models"
)

type ArticleRepository struct{ col *mongo.Collection }

func NewArticleRepository(db *mongo.Database) *ArticleRepository{ return &ArticleRepository{ col: db.Collection("articles") } }

func (r *ArticleRepository) Create(ctx context.Context, a *models.Article) error{
    _, err := r.col.InsertOne(ctx, a)
    return err
}

func (r *ArticleRepository) List(ctx context.Context) ([]models.Article, error){
    cur, err := r.col.Find(ctx, bson.M{})
    if err != nil { return nil, err }
    var items []models.Article
    if err := cur.All(ctx, &items); err != nil { return nil, err }
    return items, nil
}

func (r *ArticleRepository) FindByID(ctx context.Context, id interface{}) (*models.Article, error){
    var a models.Article
    err := r.col.FindOne(ctx, bson.M{"_id": id}).Decode(&a)
    if err == mongo.ErrNoDocuments { return nil, nil }
    return &a, err
}

func (r *ArticleRepository) Update(ctx context.Context, id interface{}, update interface{}) error{
    _, err := r.col.UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": update})
    return err
}

func (r *ArticleRepository) Delete(ctx context.Context, id interface{}) error{
    _, err := r.col.DeleteOne(ctx, bson.M{"_id": id})
    return err
}
