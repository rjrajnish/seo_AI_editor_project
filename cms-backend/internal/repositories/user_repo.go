package repositories

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/models"
)

type UserRepo struct{ Col *mongo.Collection }

func NewUserRepo(db *mongo.Database) *UserRepo { return &UserRepo{ Col: db.Collection("users") } }

func (r *UserRepo) Create(ctx context.Context, u *models.User) error {
	_, err := r.Col.InsertOne(ctx, u)
	return err
}

func (r *UserRepo) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	var u models.User
	err := r.Col.FindOne(ctx, bson.M{"email": email}).Decode(&u)
	if err == mongo.ErrNoDocuments { return nil, nil }
	return &u, err
}
