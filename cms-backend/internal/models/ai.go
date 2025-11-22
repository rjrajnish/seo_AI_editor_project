package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type AIPrompt struct {
    ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
    Title     string             `json:"title" bson:"title"`
    Template  string             `json:"template" bson:"template"`
    CreatedAt primitive.DateTime `json:"created_at" bson:"created_at"`
}
