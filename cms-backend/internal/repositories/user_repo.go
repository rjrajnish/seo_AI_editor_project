
package repositories

import (
    "context"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "github.com/example/cms-backend/internal/models"
)

type UserRepo struct{ col *mongo.Collection }

func NewUserRepo(db *mongo.Database) *UserRepo{ return &UserRepo{ col: db.Collection("users") } }

func (r *UserRepo) Create(ctx context.Context, u *models.User) error{
    _, err := r.col.InsertOne(ctx, u)
    return err
}

func (r *UserRepo) FindByEmail(ctx context.Context, email string) (*models.User, error){
    var u models.User
    err := r.col.FindOne(ctx, bson.M{"email": email}).Decode(&u)
    if err == mongo.ErrNoDocuments { return nil, nil }
    return &u, err
}
